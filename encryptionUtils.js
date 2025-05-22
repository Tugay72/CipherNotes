import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_STORAGE = 'app_secret_key';

export async function getOrCreateKey() {
    let savedKey = await AsyncStorage.getItem(KEY_STORAGE);

    if (!savedKey) {
        // Random 16 byte key oluştur
        const newKey = CryptoJS.lib.WordArray.random(16);
        // Base64 olarak kaydet
        savedKey = CryptoJS.enc.Base64.stringify(newKey);
        await AsyncStorage.setItem(KEY_STORAGE, savedKey);
    }
    // Base64’den WordArray’e çevirip geri döndür
    return CryptoJS.enc.Base64.parse(savedKey);
}
