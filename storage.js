import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import { getSecretKey } from './encryptionUtils';

export const saveEncryptedData = async (key, value) => {
    try {


        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), secretKey).toString();
        await AsyncStorage.setItem(key, encrypted);
    } catch (e) {
        console.error('Veri kaydedilirken hata:', e);
    }
};

export const loadEncryptedData = async (key) => {
    try {


        const encrypted = await AsyncStorage.getItem(key);
        if (!encrypted) return null;

        const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decrypted;
    } catch (e) {
        console.error('Veri okunurken hata:', e);
        return null;
    }
};
