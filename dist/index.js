"use strict";const t=128,e=12,r=256,a="AES-GCM";class n{constructor(){this.encoder=new TextEncoder,this.decoder=new TextDecoder}bufferToBase64(t){const e=new Uint8Array(t),r=String.fromCharCode.apply(null,e);return btoa(r)}base64ToBuffer(t){return Uint8Array.from(atob(t),(t=>t.charCodeAt(0)))}async decryptData(e,r){const{0:n,1:s}=e.split("."),o=this.base64ToBuffer(s),c=this.base64ToBuffer(n),i=await crypto.subtle.decrypt({name:a,iv:o,tagLength:t},r,c);return JSON.parse(this.decoder.decode(i))}async encrypt(e,r){const n=this.generateInitializationVector(),s=this.getEncodedData(e),o=await crypto.subtle.encrypt({name:a,iv:n,tagLength:t},r,s);return`${this.bufferToBase64(o)}.${this.bufferToBase64(n)}`}generateInitializationVector(){return crypto.getRandomValues(new Uint8Array(e))}async generateSecretKey(){return crypto.subtle.generateKey({name:a,length:r},!1,["encrypt","decrypt"])}getEncodedData(t){const e=JSON.stringify(t);return this.encoder.encode(e)}}module.exports=class{constructor(t){this.dataName=t,this.encryptionStore=`encryption_${t}`,this.vaultName=`deepvault_${t}`,this.vault=new n}addSecretKeyInVault(t){return new Promise(((e,r)=>{const a=indexedDB.open(this.vaultName,1);a.onsuccess=n=>{if(this.encryptionStoreExist(a)){const a=n.target.result.transaction([this.encryptionStore],"readwrite").objectStore(this.encryptionStore).add(t);a.onsuccess=t=>e(t.target.result),a.onerror=t=>r(t)}}}))}createVault(){if(!this.isDeepVaultSupported())throw new Error("DeepVault is not supported by this browser.");const t=indexedDB.open(this.vaultName,1);t.onupgradeneeded=t=>t.target.result.createObjectStore(this.encryptionStore,{autoIncrement:!0}),t.onerror=()=>{throw new Error(`DeepVault couldn't create a vault for ${this.dataName}`)}}async decryptData(t){try{const e=await this.getSecretKey();return await this.vault.decryptData(t,e)}catch(t){throw this.deleteData(),new Error(`${this.vaultName} is corrupted and was deleted.`)}}deleteData(){return indexedDB.deleteDatabase(this.vaultName),localStorage.removeItem(this.dataName)}async encryptAndSaveData(t){try{const e=await this.encryptData(t);return localStorage.setItem(this.dataName,e)}catch(t){throw new Error(t)}}async encryptData(t){try{const e=await this.vault.generateSecretKey();await this.saveSecretKey(e);const r=await this.vault.encrypt(t,e);return localStorage.setItem(this.dataName,r),r}catch(t){throw new Error(t)}}encryptionStoreExist(t){return Object.values(t.result.objectStoreNames).includes(this.encryptionStore)}async getDecryptedData(){try{const t=this.getEncryptedData();if(t){return await this.decryptData(t)}throw new Error(`${this.dataName} doesn't exist.`)}catch(t){throw new Error(t)}}getEncryptedData(){return localStorage.getItem(this.dataName)}getSecretKey(){return new Promise(((t,e)=>{const r=indexedDB.open(this.vaultName,1);r.onsuccess=a=>{if(this.encryptionStoreExist(r)){const r=a.target.result.transaction([this.encryptionStore]).objectStore(this.encryptionStore).get(1);r.onsuccess=e=>t(e.target.result),r.onerror=t=>e(t)}else e()}}))}isDeepVaultSupported(){return!!window.indexedDB&&!!window.crypto}saveSecretKey(t){return this.createVault(),this.addSecretKeyInVault(t)}async updateData(t){const e=await this.vault.generateSecretKey();await this.updateSecretKey(e);const r=await this.vault.encrypt(t,e);return localStorage.setItem(this.dataName,r),r}updateSecretKey(t){return new Promise(((e,r)=>{const a=indexedDB.open(this.vaultName,1);a.onsuccess=n=>{if(this.encryptionStoreExist(a)){const a=n.target.result.transaction([this.encryptionStore],"readwrite").objectStore(this.encryptionStore).put(t,1);a.onsuccess=t=>e(t.target.result),a.onerror=t=>r(t)}}}))}};