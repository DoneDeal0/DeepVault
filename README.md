<img width="904" alt="deepvault-logo" src="https://user-images.githubusercontent.com/43271780/123779944-f7f9b100-d8d2-11eb-9e9c-4f4a79b0e9b2.png">

# DEEPVAULT - DOCUMENTATION

## WHAT IS IT?

**DeepVault** allows you to safely store data in the browser with AES encryption.

## MOTIVATION
Storing data in the browser is very convenient, but not secure. It can be fixed by only storing it in an internal volatile state that gets erased once the user closes the app or refreshes the page. This technique offers a good level of security but necessitate to repeat api calls to retrieve the same data each time a user launches your app.  

Thanks to **DeepVault**, you can now directly encrypt sensitive data (geolocation, email, etc.), in your browser and access it with a cryptographic key as if you were using good old local storage.  

  
### features:
- Save, read, update and delete encrypted data in the browser.
- Supports Typescript.
- No dependencies.
- Extra-light package.

## HOW DOES IT WORK?

#### Vaults file

- Create a `vaults.js` file (the name and the extension doesn't matter).
- Create as many instances of DeepVault as you want and export them.
- Each instance is dedicated to a single dataset.

```javascript
import DeepVault from "deepvault";

export const userVault = new DeepVault("user");
export const cashVault = new DeepVault("cash");
```

#### Save data

```javascript
import { userVault } from "./vaults";
 
   const onLogin = async (form) => {  
     try {
        const user = await login(form)
        await userVault.encryptAndSaveData(user)    
        return saveUserInGlobalState(user)
      }
     catch(err){
        throw new Error(err)
     }
```
#### Read data

```javascript
import { userVault } from "./vaults";
 
   const getUser = async () => {  
     try {
        const user = await userVault.getDecryptedData()
        if (user) return saveUserInGlobalState(user)
        return null
      }
     catch(err){
        throw new Error(err)
     }
```
#### Update data

```javascript
import { userVault } from "./vaults";
 
   const updateUser = async (user) => {  
     try {
        await userVault.updateData(user)  
        return saveUserInGlobalState(user)
      }
     catch(err){
        throw new Error(err)
     }
```
#### Delete data

```javascript
import { userVault } from "./vaults";
 
   const logout = async () => {  
     try {
        await userVault.deleteData()  
        return clearGlobalState()
      }
     catch(err){
        throw new Error(err)
     }
```
> The dummy functions `saveUserInGlobalState()` and `clearGlobalState()` are not part of DeepVault. You should implement them yourself. If you use React, Redux or Zustand will work fine.

## Methods

**DeepVault** offers you 6 methods:

| |Type |Role |
|----------------|-------------------------------|-----------------------------|
|decryptData |`(data: string) => Promise<any>` |Decrypt data. |
|deleteData |`() => void` |Delete data.  |
|encryptAndSaveData |`(data: any) => void`|Encrypt and save data|
|getEncryptedData |`() => string`|Get data without decrypting it. Useful to check the existence of an item without any need to access its information.|
|getDecryptedData |`() => Promise<string>`|Get decrypted data.|
|updateData |`(data: any) => Promise<string>`|Update an item already encrypted and saved. This method will replace the former data with the new one.|

## CONTRIBUTING
Feel free to send your pull requests or to raise issues on the github repository.

## SECURITY
Albeit **DeepVault** should bring a good level of security to the persistent data stored in your users' browsers, it may not be immune to all attacks. Please weight up the pros and cons and design your app carefully. 

You can learn more about Advanced Encryption Standard and Galois Counter Mode here:
 - https://en.wikipedia.org/wiki/Galois/Counter_Mode
 - https://fr.wikipedia.org/wiki/Advanced_Encryption_Standard

## CREDITS
DoneDeal0

Logo made by throwaway icons from the Noun Project