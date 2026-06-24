import sharp from 'sharp';

/**
 * Processes an image buffer: resizes to 800×1000 cover (top-aligned)
 * and converts it to WebP format — matches legacy upload pipeline.
 */
export const processImage = async (buffer: Buffer): Promise<Buffer> => {
  try {
    return await sharp(buffer)
      .resize(800, 1000, { fit: "cover", position: "top" })
      .webp({ quality: 88 })
      .toBuffer();
  } catch (error) {
    console.error('[STORAGE][Image] Error processing image:', error);
    throw new Error('Failed to process image');
  }
};
