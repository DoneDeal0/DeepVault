export const CRYPTO = {
  TAG_LENGTH: 128,
  IV_BYTES: 12,
  SECRET_KEY_BITS: 256,
  GALOIS_COUNTER_MODE: "AES-GCM",
};

export type Data = any;
export type EncodedData = string;
export type EncryptedData = string;
export type SecretKey = CryptoKey;

export interface DeepVaultMethods {
  decryptData: (data: EncryptedData) => Promise<Data | void>;
  deleteData: () => void;
  encryptAndSaveData: (data: Data) => Promise<void>;
  getEncryptedData: () => EncryptedData | null;
  getDecryptedData: () => Promise<Data>;
  updateData: (data: Data) => Promise<EncryptedData>;
}

export interface VaultMethods {
  decryptData: (
    encryptedData: EncryptedData,
    secretKey: SecretKey
  ) => Promise<Data>;
  encrypt: (data: Data, secretKey: SecretKey) => Promise<EncryptedData>;
  generateSecretKey: () => Promise<SecretKey>;
}
