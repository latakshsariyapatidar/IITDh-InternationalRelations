import { PDFDocument } from 'pdf-lib';

/**
 * Formats byte size into human readable string (e.g. 1.2 MB, 340 KB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Compresses an image file using an offscreen HTML5 Canvas.
 * Resizes dimensions to maxWidth/maxHeight while preserving aspect ratio,
 * and re-encodes to high-quality JPEG.
 */
export async function compressImage(file, { maxWidth = 1600, maxHeight = 1600, quality = 0.78 } = {}) {
  if (!file || !file.type.startsWith('image/')) return file;
  // If file is already tiny (less than 150KB) and JPEG, no need to touch it
  if (file.size <= 150 * 1024 && file.type === 'image/jpeg') return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // If still > 1.2MB, perform a second pass with lower dimension & quality
            if (blob.size > 1.2 * 1024 * 1024 && quality > 0.6) {
              const pass2Width = Math.round(width * 0.75);
              const pass2Height = Math.round(height * 0.75);
              const canvas2 = document.createElement('canvas');
              canvas2.width = pass2Width;
              canvas2.height = pass2Height;
              const ctx2 = canvas2.getContext('2d');
              ctx2.drawImage(canvas, 0, 0, pass2Width, pass2Height);
              canvas2.toBlob(
                (blob2) => {
                  if (blob2 && blob2.size < file.size) {
                    const finalName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
                    const compressed = new File([blob2], finalName, {
                      type: 'image/jpeg',
                      lastModified: Date.now(),
                    });
                    compressed.originalSize = file.size;
                    compressed.compressedSize = blob2.size;
                    resolve(compressed);
                  } else {
                    resolve(file);
                  }
                },
                'image/jpeg',
                0.65
              );
              return;
            }

            if (blob.size < file.size) {
              const finalName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
              const compressed = new File([blob], finalName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              compressed.originalSize = file.size;
              compressed.compressedSize = blob.size;
              resolve(compressed);
            } else {
              // If canvas compression produced a larger file, retain original
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Optimizes a PDF file using pdf-lib stream compression and object stream packing.
 */
export async function compressPdf(file) {
  if (!file || (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'))) {
    return file;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    // Saving with useObjectStreams: true re-compresses streams and strips unreferenced cross-refs
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

    if (pdfBytes.length < file.size) {
      const compressed = new File([pdfBytes], file.name, {
        type: 'application/pdf',
        lastModified: Date.now(),
      });
      compressed.originalSize = file.size;
      compressed.compressedSize = pdfBytes.length;
      return compressed;
    }
    return file;
  } catch (err) {
    console.warn(`[PDF Compression skipped for ${file.name}]:`, err);
    return file;
  }
}

/**
 * Universal document compressor: automatically identifies image or PDF and applies
 * optimal compression to drastically reduce multipart payload size.
 */
export async function compressDocument(file, options = {}) {
  if (!file) return file;
  const initialSize = file.size;

  let compressedFile = file;

  if (file.type?.startsWith('image/')) {
    compressedFile = await compressImage(file, options);
  } else if (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf')) {
    compressedFile = await compressPdf(file);
  }

  // Attach metadata
  compressedFile.originalSize = initialSize;
  compressedFile.compressedSize = compressedFile.size;
  compressedFile.reductionPercent = Math.round(
    ((initialSize - compressedFile.size) / (initialSize || 1)) * 100
  );

  return compressedFile;
}
