export declare const CRYPTO: {
    TAG_LENGTH: number;
    IV_BYTES: number;
    SECRET_KEY_BITS: number;
    GALOIS_COUNTER_MODE: string;
};
export declare type Data = any;
export declare type EncodedData = string;
export declare type EncryptedData = string;
export declare type SecretKey = CryptoKey;
export interface DeepVaultMethods {
    decryptData: (data: EncryptedData) => Promise<Data | void>;
    deleteData: () => void;
    encryptAndSaveData: (data: Data) => Promise<void>;
    getEncryptedData: () => EncryptedData | null;
    getDecryptedData: () => Promise<Data>;
    updateData: (data: Data) => Promise<EncryptedData>;
}
export interface VaultMethods {
    decryptData: (encryptedData: EncryptedData, secretKey: SecretKey) => Promise<Data>;
    encrypt: (data: Data, secretKey: SecretKey) => Promise<EncryptedData>;
    generateSecretKey: () => Promise<SecretKey>;
}
