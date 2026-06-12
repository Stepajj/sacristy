import sharp from 'sharp';

/**
 * Processes an image buffer: resizes it to a maximum width of 1200px (preserving aspect ratio)
 * and converts it to WebP format with 80% quality.
 */
export const processImage = async (buffer: Buffer): Promise<Buffer> => {
  try {
    return await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch (error) {
    console.error('[STORAGE][Image] Error processing image:', error);
    throw new Error('Failed to process image');
  }
};
