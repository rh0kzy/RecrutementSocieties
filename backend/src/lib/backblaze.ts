import B2 from 'backblaze-b2';

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID || '',
  applicationKey: process.env.B2_APPLICATION_KEY || ''
});

let authorizationToken: string | null = null;
let apiUrl: string | null = null;
let downloadUrl: string | null = null;

// Authorize with B2
export const authorizeB2 = async () => {
  try {
    const response = await b2.authorize();
    authorizationToken = response.data.authorizationToken;
    apiUrl = response.data.apiUrl;
    downloadUrl = response.data.downloadUrl;
    return response.data;
  } catch (error) {
    console.error('Error authorizing with Backblaze B2:', error);
    throw error;
  }
};

// Upload file to B2
export const uploadFileToB2 = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  try {
    // Ensure we're authorized
    if (!authorizationToken) {
      await authorizeB2();
    }

    const bucketId = process.env.B2_BUCKET_ID || '';
    
    // Get upload URL
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId
    });

    const { uploadUrl, authorizationToken: uploadToken } = uploadUrlResponse.data;

    // Upload the file
    const uploadResponse = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: uploadToken,
      fileName,
      data: fileBuffer,
      mime: contentType
    });

    // Construct public URL
    const bucketName = process.env.B2_BUCKET_NAME || '';
    const fileUrl = `${downloadUrl}/file/${bucketName}/${fileName}`;

    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to Backblaze B2:', error);
    throw error;
  }
};

// Delete file from B2
export const deleteFileFromB2 = async (fileName: string, fileId: string): Promise<void> => {
  try {
    if (!authorizationToken) {
      await authorizeB2();
    }

    await b2.deleteFileVersion({
      fileId,
      fileName
    });
  } catch (error) {
    console.error('Error deleting file from Backblaze B2:', error);
    throw error;
  }
};

// Get file info from B2
export const getFileInfoFromB2 = async (fileId: string) => {
  try {
    if (!authorizationToken) {
      await authorizeB2();
    }

    const response = await b2.getFileInfo({
      fileId
    });

    return response.data;
  } catch (error) {
    console.error('Error getting file info from Backblaze B2:', error);
    throw error;
  }
};

export default b2;
