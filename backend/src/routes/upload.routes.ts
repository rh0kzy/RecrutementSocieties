import express, { Request, Response } from 'express';
import multer from 'multer';
import { authenticate } from '../lib/jwt';
import { requireRole } from '../lib/validate';
import { uploadFileToB2, authorizeB2 } from '../lib/backblaze';

const router = express.Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.'));
    }
  }
});

// Initialize B2 authorization on server start
authorizeB2().catch(err => {
  console.error('Failed to authorize with Backblaze B2 on startup:', err);
});

// Upload file endpoint
router.post(
  '/upload',
  authenticate,
  requireRole(['CANDIDATE']),
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const user = (req as any).user;
      const fileType = req.body.fileType || 'document'; // cv, idCard, militaryStatus

      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `candidates/${user.id}/${fileType}-${timestamp}.${fileExt}`;

      // Upload to Backblaze B2
      const fileUrl = await uploadFileToB2(
        req.file.buffer,
        fileName,
        req.file.mimetype
      );

      res.json({
        success: true,
        fileUrl,
        fileName
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      res.status(500).json({
        error: 'Failed to upload file',
        message: error.message
      });
    }
  }
);

export default router;
