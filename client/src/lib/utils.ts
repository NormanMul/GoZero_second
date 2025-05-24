import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Compresses an image from a base64 string
 * @param base64Image - The base64 image string to compress
 * @param maxWidth - Maximum width of the compressed image (default: 800px)
 * @param quality - JPEG quality from 0 to 1 (default: 0.7)
 * @returns A promise that resolves to the compressed base64 image string
 */
export function compressImage(
  base64Image: string,
  maxWidth = 600,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create an image object
    const img = new Image();
    img.src = base64Image;
    
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw image to canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw image with white background (prevents black background on some PNG images)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get the compressed image as base64 string
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      
      // Log compression results with detailed information
      const originalSize = base64Image.length;
      const compressedSize = compressedBase64.length;
      const originalSizeKB = (originalSize / 1024).toFixed(2);
      const compressedSizeKB = (compressedSize / 1024).toFixed(2);
      const reductionPercentage = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      
      console.log('========== IMAGE COMPRESSION DEBUG INFO ==========');
      console.log(`Original dimensions: ${img.width}x${img.height}px`);
      console.log(`Compressed dimensions: ${width}x${height}px`);
      console.log(`Compression quality: ${quality}`);
      console.log(`Original size: ${originalSizeKB}KB`);
      console.log(`Compressed size: ${compressedSizeKB}KB`);
      console.log(`Reduction: ${reductionPercentage}%`);
      console.log(`Estimated upload time on 3G: ~${(compressedSize / (750 * 1024)).toFixed(2)}s`);
      console.log('=================================================');
      
      resolve(compressedBase64);
    };
    
    img.onerror = () => {
      reject(new Error('Error loading image for compression'));
    };
  });
}
