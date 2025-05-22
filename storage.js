import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const secretKey = CryptoJS.enc.Utf8.parse('1234567890123456');
const iv = CryptoJS.enc.Utf8.parse('6543210987654321');

export const saveEncryptedData = async (key, value) => {
    try {
        const ciphertext = CryptoJS.AES.encrypt(
            JSON.stringify(value),
            secretKey,
            { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        ).toString();

        await AsyncStorage.setItem(key, ciphertext);
    } catch (e) {
        console.error('Veri kaydedilirken hata:', e);
    }
};

export const loadEncryptedData = async (key) => {
    try {
        const encrypted = await AsyncStorage.getItem(key);
        if (!encrypted) return null;

        const decrypted = CryptoJS.AES.decrypt(
            encrypted,
            secretKey,
            { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );

        const plainText = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(plainText);
    } catch (e) {
        console.error('Veri okunurken hata:', e);
        return null;
    }
};

