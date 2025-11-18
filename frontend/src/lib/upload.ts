import api from '../api/axios';

export const uploadFileToBackblaze = async (
  file: File,
  fileType: 'cv' | 'idCard' | 'militaryStatus'
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.fileUrl;
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(error.response?.data?.error || 'Failed to upload file');
  }
};

export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSize: number
): string | null => {
  if (!allowedTypes.includes(file.type)) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }
  if (file.size > maxSize) {
    return `File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`;
  }
  return null;
};

export default { uploadFileToBackblaze, validateFile };
