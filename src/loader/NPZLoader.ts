import * as RNFS from 'react-native-fs';
import { KittenTTSError, errorMessage, isKittenTTSError, loadNPZData, type VoiceEmbeddings, base64ToUint8Array } from '@kittentts/core';

export { loadNPZData, type VoiceEmbeddings };

export async function loadNPZ(filePath: string): Promise<VoiceEmbeddings> {
  try {
    const exists = await RNFS.exists(filePath);
    if (!exists) {
      throw KittenTTSError.voicesFileNotFound(filePath);
    }

    const base64 = await RNFS.readFile(filePath, 'base64');
    return loadNPZData(base64ToUint8Array(base64), filePath);
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
