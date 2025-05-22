import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

export const saveSecretKey = async () => {
    const existing = await SecureStore.getItemAsync('secretKey');
    if (!existing) {
        const key = uuidv4();
        await SecureStore.setItemAsync('secretKey', key);
        console.log('Yeni şifreleme anahtarı kaydedildi.');
    } else {
        console.log('Şifreleme anahtarı zaten mevcut.');
    }
};

export const getSecretKey = async () => {
    const key = await SecureStore.getItemAsync('secretKey');
    if (key) {
        return key;
    } else {
        console.warn('Anahtar alınamadı.');
        return null;
    }
};
