import CryptoJS, { enc } from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { endAsyncEvent } from 'react-native/Libraries/Performance/Systrace';

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
        if (!key || typeof key !== 'string') {
            console.warn('Geçersiz anahtar:', key);
            return null;
        }

        const encrypted = await AsyncStorage.getItem(key);
        if (!encrypted || typeof encrypted !== 'string') {
            console.warn('Şifrelenmiş veri bulunamadı veya geçersiz:', encrypted);
            return null;
        }

        const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const plainText = decrypted.toString(CryptoJS.enc.Utf8);

        if (!plainText) {
            console.warn('Decryption sonucu boş veya geçersiz!');
            return null;
        }

        let parsedNotes;
        try {
            parsedNotes = JSON.parse(plainText);
        } catch (jsonError) {
            console.error('JSON parse hatası:', jsonError);
            return null;
        }

        if (!Array.isArray(parsedNotes)) {
            console.warn('Çözümlenen veri dizi formatında değil:', parsedNotes);
            return null;
        }

        const notesWithEncrypted = parsedNotes.map(note => ({
            ...note,
            encryptedData: note.notePassword ? encrypted : null
        }));

        return notesWithEncrypted;

    } catch (e) {
        console.error('Veri okunurken hata:', e);
        return null;
    }
};


export const savePassword = async (password) => {
    try {
        if (!password) {
            // Şifre kaldırmak için özel bir anahtar kullan
            await AsyncStorage.setItem('appPassword', '__NO_PASSWORD__');
            return;
        }

        const encrypted = CryptoJS.AES.encrypt(password, secretKey, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        await AsyncStorage.setItem('appPassword', encrypted);
    } catch (error) {
        console.error('Password save failed:', error);
    }
};




export const passwordExists = async () => {
    try {
        const encrypted = await AsyncStorage.getItem('appPassword');

        if (
            typeof encrypted !== 'string' ||
            !encrypted ||
            encrypted === '__NO_PASSWORD__'
        ) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Password load failed:', error);
        return false;
    }
};


export const verifyPassword = async (inputPassword) => {
    try {
        const encrypted = await AsyncStorage.getItem('appPassword');
        if (!encrypted) return false;

        const bytes = CryptoJS.AES.decrypt(encrypted, secretKey, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const storedPassword = bytes.toString(CryptoJS.enc.Utf8);
        return inputPassword === storedPassword;
    } catch (error) {
        console.error('Password verification failed:', error);
        return false;
    }
};
