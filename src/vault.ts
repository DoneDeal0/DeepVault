import {
  CRYPTO,
  Data,
  EncodedData,
  EncryptedData,
  SecretKey,
  VaultMethods,
} from "./model";

export default class Vault implements VaultMethods {
  encoder: TextEncoder;
  decoder: TextDecoder;
  constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }

  private bufferToBase64(buffer: ArrayBuffer):EncodedData {
    const utfIntegers = new Uint8Array(buffer)
    const encodedString = String.fromCharCode.apply(
      null,
      utfIntegers as unknown as number[]
    );
    return btoa(encodedString);
  }

  private base64ToBuffer(base64string: EncodedData):Uint8Array {
    return Uint8Array.from(atob(base64string), (char) => char.charCodeAt(0));
  }

  public async decryptData(
    encryptedData: EncryptedData,
    secretKey: SecretKey
  ): Promise<Data> {
    const { 0: data, 1: iv } = encryptedData.split(".");
    const initializationVector = this.base64ToBuffer(iv);
    const _data = this.base64ToBuffer(data);
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: CRYPTO.GALOIS_COUNTER_MODE,
        iv: initializationVector,
        tagLength: CRYPTO.TAG_LENGTH
      },
      secretKey,
      _data
    );
    return JSON.parse(this.decoder.decode(decryptedData));
  }

  public async encrypt(
    data: Data,
    secretKey: SecretKey
  ): Promise<EncryptedData> {
    const initializationVector = this.generateInitializationVector()
    const encodedData = this.getEncodedData(data)
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: CRYPTO.GALOIS_COUNTER_MODE,
        iv: initializationVector,
        tagLength: CRYPTO.TAG_LENGTH
      },
      secretKey,
      encodedData
    );
    const encryptedDataBase64 = this.bufferToBase64(encryptedData);
    const initializationVectorBase64 = this.bufferToBase64(
      initializationVector
    );
    return `${encryptedDataBase64}.${initializationVectorBase64}`;
  }

  private generateInitializationVector():Uint8Array {
    return crypto.getRandomValues(new Uint8Array(CRYPTO.IV_BYTES));
  }

  public async generateSecretKey(): Promise<SecretKey> {
    return crypto.subtle.generateKey(
      { name: CRYPTO.GALOIS_COUNTER_MODE, length: CRYPTO.SECRET_KEY_BITS },
      false,
      ["encrypt", "decrypt"]
    );
  }

  private getEncodedData(encodedData:EncodedData):Uint8Array {
    const data = JSON.stringify(encodedData)
    return this.encoder.encode(data);
  }

}


