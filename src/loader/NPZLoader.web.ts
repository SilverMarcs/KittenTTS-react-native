import { KittenTTSError, errorMessage, isKittenTTSError, loadNPZData, type VoiceEmbeddings } from '@kittentts/core';

export { loadNPZData, type VoiceEmbeddings };

export async function loadNPZ(filePath: string): Promise<VoiceEmbeddings> {
  try {
    const data = await readFileBytes(filePath);
    return loadNPZData(data, filePath);
  } catch (error) {
    if (isKittenTTSError(error)) {
      throw error;
    }
    throw KittenTTSError.invalidModelData(
      `Could not load voice embeddings from ${filePath}: ${errorMessage(error)}`,
      error,
    );
  }
}

async function readFileBytes(filePath: string): Promise<Uint8Array> {
  if (typeof process === 'undefined' || !process.versions?.node) {
    throw KittenTTSError.voicesFileNotFound(filePath);
  }
  const fs = await import('node:fs/promises');
  const data = await fs.readFile(stripFileScheme(filePath));
  return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}

function stripFileScheme(filePath: string): string {
  return filePath.startsWith('file://') ? filePath.slice('file://'.length) : filePath;
}
