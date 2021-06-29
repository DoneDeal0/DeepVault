import { Data, EncryptedData, DeepVaultMethods } from "./model";
export default class DeepVault implements DeepVaultMethods {
    private dataName;
    private encryptionStore;
    private vaultName;
    private vault;
    constructor(dataName: string);
    private addSecretKeyInVault;
    private createVault;
    decryptData(encryptedData: EncryptedData): Promise<Data | void>;
    deleteData(): void;
    encryptAndSaveData(data: Data): Promise<void>;
    private encryptData;
    private encryptionStoreExist;
    getDecryptedData(): Promise<Data>;
    getEncryptedData(): EncryptedData | null;
    private getSecretKey;
    private isDeepVaultSupported;
    private saveSecretKey;
    updateData(data: Data): Promise<string>;
    private updateSecretKey;
}
