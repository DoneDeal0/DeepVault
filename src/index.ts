import Vault from "./vault";
import { Data, EncryptedData, DeepVaultMethods, SecretKey } from "./model";

export default class DeepVault implements DeepVaultMethods {
  private dataName: string;
  private encryptionStore: string;
  private vaultName: string;
  private vault: Vault;

  constructor(dataName: string) {
    this.dataName = dataName;
    this.encryptionStore = `encryption_${dataName}`;
    this.vaultName = `deepvault_${dataName}`;
    this.vault = new Vault();
  }

  private addSecretKeyInVault(secretKey: SecretKey): Promise<void> {
    return new Promise((resolve, reject) => {
      const vault = indexedDB.open(this.vaultName, 1);
      vault.onsuccess = (e: any) => {
        if (this.encryptionStoreExist(vault)) {
          const request = e.target["result"]
            .transaction([this.encryptionStore], "readwrite")
            .objectStore(this.encryptionStore)
            .add(secretKey);
          request.onsuccess = (res: any) => resolve(res.target.result);
          request.onerror = (err: any) => reject(err);
        }
      };
    });
  }

  private createVault() {
    if (!this.isDeepVaultSupported()) {
      throw new Error("DeepVault is not supported by this browser.");
    }
    const request = indexedDB.open(this.vaultName, 1);
    request.onupgradeneeded = (e: any) => {
      const vault = e.target["result"];
      return vault.createObjectStore(this.encryptionStore, {
        autoIncrement: true,
      });
    };
    request.onerror = () => {
      throw new Error(`DeepVault couldn't create a vault for ${this.dataName}`);
    };
  }

  public async decryptData(encryptedData: EncryptedData): Promise<Data | void> {
    try {
      const secretKey = await this.getSecretKey();
      const decryptedData = await this.vault.decryptData(
        encryptedData,
        secretKey
      );
      return decryptedData;
    } catch (_) {
      this.deleteData();
      throw new Error(`${this.vaultName} is corrupted and was deleted.`);
    }
  }

  public deleteData(): void {
    indexedDB.deleteDatabase(this.vaultName);
    return localStorage.removeItem(this.dataName);
  }

  public async encryptAndSaveData(data: Data): Promise<void> {
    try {
      const encryptedData = await this.encryptData(data);
      return localStorage.setItem(this.dataName, encryptedData);
    } catch (err) {
      throw new Error(err);
    }
  }

  private async encryptData(data: Data): Promise<EncryptedData> {
    try {
      const secretKey = await this.vault.generateSecretKey();
      await this.saveSecretKey(secretKey);
      const encryptedData = await this.vault.encrypt(data, secretKey);
      localStorage.setItem(this.dataName, encryptedData);
      return encryptedData;
    } catch (err) {
      throw new Error(err);
    }
  }

  private encryptionStoreExist(db: IDBOpenDBRequest): boolean {
    return Object.values(db.result.objectStoreNames).includes(
      this.encryptionStore
    );
  }

  public async getDecryptedData(): Promise<Data> {
    try {
      const encryptedData = this.getEncryptedData();
      if (encryptedData) {
        const decryptedData = await this.decryptData(encryptedData);
        return decryptedData;
      }
      throw new Error(`${this.dataName} doesn't exist.`);
    } catch (err) {
      throw new Error(err);
    }
  }

  public getEncryptedData(): EncryptedData | null {
    return localStorage.getItem(this.dataName);
  }

  private getSecretKey(): Promise<SecretKey> {
    return new Promise((resolve, reject) => {
      const vault = indexedDB.open(this.vaultName, 1);
      vault.onsuccess = (e: any) => {
        if (this.encryptionStoreExist(vault)) {
          const request = e.target["result"]
            .transaction([this.encryptionStore])
            .objectStore(this.encryptionStore)
            .get(1);
          request.onsuccess = (res: any) => resolve(res.target.result);
          request.onerror = (err: any) => reject(err);
        } else {
          reject();
        }
      };
    });
  }

  private isDeepVaultSupported(): boolean {
    return !!window.indexedDB && !!window.crypto;
  }

  private saveSecretKey(secretKey: SecretKey): Promise<void> {
    this.createVault();
    return this.addSecretKeyInVault(secretKey);
  }

  public async updateData(data: Data): Promise<string> {
    const secretKey = await this.vault.generateSecretKey();
    await this.updateSecretKey(secretKey);
    const encryptedData = await this.vault.encrypt(data, secretKey);
    localStorage.setItem(this.dataName, encryptedData);
    return encryptedData;
  }

  private updateSecretKey(secretKey: SecretKey) {
    return new Promise((resolve, reject) => {
      const vault = indexedDB.open(this.vaultName, 1);
      vault.onsuccess = (e: any) => {
        if (this.encryptionStoreExist(vault)) {
          const request = e.target["result"]
            .transaction([this.encryptionStore], "readwrite")
            .objectStore(this.encryptionStore)
            .put(secretKey, 1);
          request.onsuccess = (res: any) => resolve(res.target.result);
          request.onerror = (err: any) => reject(err);
        }
      };
    });
  }
}
