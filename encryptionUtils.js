import * as Keychain from 'react-native-keychain';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

export const saveSecretKey = async () => {
    const existing = await Keychain.getGenericPassword();
    if (!existing) {
        const key = uuidv4();
        await Keychain.setGenericPassword('encryption', key);
        console.log('Yeni şifreleme anahtarı kaydedildi.');
    } else {
        console.log('Şifreleme anahtarı zaten mevcut.');
    }
};

export const getSecretKey = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
        return credentials.password;
    } else {
        console.warn('Anahtar alınamadı.');
        return null;
    }
};
