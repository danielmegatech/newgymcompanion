/**
 * imageUtils.ts — Utilitário de Processamento e Compressão de Imagens
 * 
 * Permite redimensionar e comprimir imagens no navegador antes de salvar no Firestore
 * Mantém alta qualidade visual enquanto reduz o tamanho para 30-100 KB, garantindo
 * performance instantânea e sincronização em tempo real entre celular e computador.
 */

export interface CompressImageOptions {
  maxDimension?: number;
  quality?: number;
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
}

/**
 * Converte um arquivo de imagem (File/Blob) em DataURL comprimido em Base64
 */
export async function compressImageFile(
  file: File | Blob,
  options: CompressImageOptions = {}
): Promise<string> {
  const {
    maxDimension = 800,
    quality = 0.78,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo de imagem'));
    };

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Erro ao processar imagem para compressão'));
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Redimensionar proporcionalmente se exceder a dimensão máxima
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          // Fundo branco caso haja transparência para JPEG
          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Exportar em formato comprimido
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl);
        } catch (e) {
          // Fallback para o dataURL original caso o canvas falhe
          resolve(readerEvent.target?.result as string);
        }
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Utilitário para validar se uma string é um DataURL ou URL válida
 */
export function isValidImageUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('data:image/') || url.startsWith('http://') || url.startsWith('https://');
}
