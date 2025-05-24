import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Compresses an image from a base64 string
 * @param base64Image - The base64 image string to compress
 * @param maxWidth - Maximum width of the compressed image (default: 480px)
 * @param quality - Compression quality from 0 to 1 (default: 0.6)
 * @param format - Output format (webp, jpeg, or auto)
 * @returns A promise that resolves to the compressed base64 image string
 */
export function compressImage(
  base64Image: string,
  maxWidth = 480,
  quality = 0.6,
  format: 'webp' | 'jpeg' | 'auto' = 'auto'
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
        height = Math.floor(height * ratio);
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
      
      // Use better image rendering for downscaled images
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      
      // Determine output format
      let outputFormat = 'image/jpeg';
      let outputQuality = quality;
      
      if (format === 'webp' || (format === 'auto' && supportsWebP())) {
        outputFormat = 'image/webp';
      }
      
      // Get the compressed image as base64 string
      const compressedBase64 = canvas.toDataURL(outputFormat, outputQuality);
      
      // Log compression results with detailed information
      const originalSize = base64Image.length;
      const compressedSize = compressedBase64.length;
      const originalSizeKB = (originalSize / 1024).toFixed(2);
      const compressedSizeKB = (compressedSize / 1024).toFixed(2);
      const reductionPercentage = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      
      console.log('========== IMAGE COMPRESSION DEBUG INFO ==========');
      console.log(`Original dimensions: ${img.width}x${img.height}px`);
      console.log(`Compressed dimensions: ${width}x${height}px`);
      console.log(`Format: ${outputFormat}, Quality: ${outputQuality}`);
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

/**
 * Detects WebP support in the current browser
 * @returns Boolean indicating whether WebP is supported
 */
function supportsWebP(): boolean {
  // Try to use a feature detection approach first
  const canvas = document.createElement('canvas');
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return true;
  }
  
  // Fallback to user agent sniffing for older browsers
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Chrome 9+, Opera 12+, Firefox 65+, Edge 18+
  if (userAgent.indexOf('chrome') > -1 || 
      userAgent.indexOf('opera') > -1 || 
      (userAgent.indexOf('firefox') > -1 && parseInt(userAgent.split('firefox/')[1]) >= 65) ||
      (userAgent.indexOf('edge') > -1 && parseInt(userAgent.split('edge/')[1]) >= 18)) {
    return true;
  }
  
  return false;
}
