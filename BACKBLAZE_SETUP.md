# Backblaze B2 File Storage Setup

This project uses Backblaze B2 for secure and cost-effective file storage for candidate documents (CV, ID cards, military status certificates).

## Why Backblaze B2?

- **Cost-effective**: Significantly cheaper than competitors
- **S3-compatible**: Easy migration path if needed
- **Reliable**: Enterprise-grade storage with 99.9% uptime
- **Simple**: Straightforward API and authentication

## Setup Instructions

### 1. Create a Backblaze B2 Account

1. Go to [https://www.backblaze.com/b2/sign-up.html](https://www.backblaze.com/b2/sign-up.html)
2. Sign up for a free account (10GB free storage)
3. Verify your email address

### 2. Create a Bucket

1. Log in to your Backblaze B2 account
2. Click on "Buckets" in the left sidebar
3. Click "Create a Bucket"
4. Configure your bucket:
   - **Bucket Name**: Choose a unique name (e.g., `recruitment-saas-files`)
   - **Files in Bucket**: Set to "Public" or "Private" based on your needs
   - **Encryption**: Enable if required
   - **Object Lock**: Leave disabled for MVP
5. Click "Create a Bucket"

### 3. Create Application Keys

1. Go to "App Keys" in the left sidebar
2. Click "Add a New Application Key"
3. Configure the key:
   - **Name**: `recruitment-saas-backend`
   - **Bucket Access**: Select your bucket or "All"
   - **Type of Access**: Read and Write
   - **Allow List All Bucket Names**: Checked
   - **File name prefix**: Leave empty (or set to `candidates/` for security)
4. Click "Create New Key"
5. **IMPORTANT**: Copy the `keyID` and `applicationKey` immediately - you won't be able to see the key again!

### 4. Configure Environment Variables

Add the following to your `backend/.env` file:

```env
# Backblaze B2 Configuration
B2_APPLICATION_KEY_ID=your_key_id_here
B2_APPLICATION_KEY=your_application_key_here
B2_BUCKET_ID=your_bucket_id_here
B2_BUCKET_NAME=your_bucket_name_here
```

**Where to find these values:**
- `B2_APPLICATION_KEY_ID`: The keyID from step 3
- `B2_APPLICATION_KEY`: The applicationKey from step 3
- `B2_BUCKET_ID`: Found in Buckets → Your Bucket → Bucket ID
- `B2_BUCKET_NAME`: The bucket name you chose in step 2

### 5. Test the Integration

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Try uploading a file through the candidate profile page
3. Verify the file appears in your B2 bucket under the Files tab

## File Structure

Files are organized in Backblaze B2 as follows:

```
candidates/
  ├── {userId}/
  │   ├── cv-{timestamp}.pdf
  │   ├── idCard-{timestamp}.jpg
  │   └── militaryStatus-{timestamp}.pdf
```

## Security Considerations

### Current Implementation (MVP)
- Files are uploaded directly from frontend to backend
- Backend validates file types and sizes
- Authentication required for uploads

### Production Recommendations
1. **Bucket Privacy**: Set bucket to "Private" and use signed URLs
2. **CORS Configuration**: Configure CORS rules in B2 for your domain
3. **File Encryption**: Enable server-side encryption in B2 settings
4. **Access Control**: Create separate app keys for different environments
5. **Rate Limiting**: Already implemented in upload endpoint
6. **Virus Scanning**: Consider integrating ClamAV or similar
7. **Backup Strategy**: Enable B2 Snapshot or Replication

## API Endpoints

### Upload File
```
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- file: File (required)
- fileType: 'cv' | 'idCard' | 'militaryStatus' (required)

Response:
{
  "success": true,
  "fileUrl": "https://...",
  "fileName": "candidates/123/cv-1234567890.pdf"
}
```

## File Validation

The following validations are enforced:

- **File Types**: PDF, DOC, DOCX, JPG, PNG
- **File Size**: Maximum 5MB per file
- **Authentication**: Only authenticated candidates can upload
- **Naming**: Files are renamed to prevent conflicts

## Cost Estimation

Backblaze B2 Pricing (as of 2024):
- **Storage**: $0.005 per GB/month ($5 per TB)
- **Downloads**: First 1GB free per day, then $0.01 per GB
- **API Calls**: First 2,500 free per day, then $0.004 per 10,000

### Example Monthly Cost:
- 1,000 candidates × 3 files × 2MB avg = 6GB storage = **$0.03/month**
- Minimal download costs (view-only, no direct downloads)
- **Total**: Less than $1/month for first 1,000 candidates

## Troubleshooting

### Error: "Could not authorize with Backblaze B2"
- Verify your `B2_APPLICATION_KEY_ID` and `B2_APPLICATION_KEY` are correct
- Check that the application key has read/write permissions
- Ensure the key isn't expired or revoked

### Error: "Bucket not found"
- Verify `B2_BUCKET_ID` matches your bucket ID exactly
- Check that the application key has access to this bucket

### Error: "File upload failed"
- Check file size is under 5MB
- Verify file type is in allowed list
- Check network connectivity

### Files not appearing in bucket
- Log in to B2 console and check the Files tab
- Verify the bucket name in your .env matches the console
- Check file path format: `candidates/{userId}/{fileType}-{timestamp}.{ext}`

## Migration from Supabase Storage

The codebase has been updated to use Backblaze B2 instead of Supabase Storage:

**Changes made:**
1. Added `backblaze-b2` npm package
2. Created `backend/src/lib/backblaze.ts` for B2 operations
3. Added `backend/src/routes/upload.routes.ts` for upload endpoint
4. Created `frontend/src/lib/upload.ts` for client-side uploads
5. Updated `CandidateProfile.tsx` to use new upload function
6. Updated `JobApplication.tsx` to use new upload function
7. Removed direct Supabase Storage calls

**Old files (can be safely removed):**
- `frontend/src/lib/supabase.ts` (database connection still needed for Postgres)

## Support

For Backblaze B2 specific issues:
- Documentation: https://www.backblaze.com/b2/docs/
- Support: https://help.backblaze.com/

For project-specific issues, check the main README or contact the development team.
