import { promises as fs } from 'fs';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';

/**
 * Saves a file buffer to the disk.
 * Returns the public URL of the saved file.
 */
export const saveFile = async (file: Buffer, filename: string): Promise<string> => {
  try {
    const fullUploadPath = path.join(process.cwd(), UPLOAD_DIR);
    
    // Ensure directory exists
    await fs.mkdir(fullUploadPath, { recursive: true });
    
    const filePath = path.join(fullUploadPath, filename);
    await fs.writeFile(filePath, file);
    
    // Return the URL path (relative to public folder)
    return `/${UPLOAD_DIR.replace('public/', '')}/${filename}`;
  } catch (error) {
    console.error('[STORAGE][Upload] Error saving file:', error);
    throw new Error('Failed to save file');
  }
};

/**
 * Deletes a file from the disk given its public URL.
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    if (!fileUrl) return;
    
    // Convert URL to filesystem path
    const filename = path.basename(fileUrl);
    const filePath = path.join(process.cwd(), UPLOAD_DIR, filename);
    
    // Check if file exists before trying to delete
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (e) {
      // File already gone or inaccessible, ignore
      console.warn(`[STORAGE][Upload] File not found or inaccessible for deletion: ${filePath}`);
    }
  } catch (error) {
    console.error('[STORAGE][Upload] Error deleting file:', error);
    // Don't throw, deletion failure is usually non-critical for the user flow
  }
};
