import { Data, EncryptedData, SecretKey, VaultMethods } from "./model";
export default class Vault implements VaultMethods {
    encoder: TextEncoder;
    decoder: TextDecoder;
    constructor();
    private bufferToBase64;
    private base64ToBuffer;
    decryptData(encryptedData: EncryptedData, secretKey: SecretKey): Promise<Data>;
    encrypt(data: Data, secretKey: SecretKey): Promise<EncryptedData>;
    private generateInitializationVector;
    generateSecretKey(): Promise<SecretKey>;
    private getEncodedData;
}
