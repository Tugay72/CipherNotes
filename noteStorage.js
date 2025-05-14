import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from '@env';

const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};


export const saveNote = async (id, noteData, time, date) => {
    try {
        const noteWithMetadata = {
            ...noteData,
            time,
            date,
        };
        const plainText = JSON.stringify(noteWithMetadata);
        const encryptedText = encrypt(plainText);
        await AsyncStorage.setItem(`note-${id}`, encryptedText);
    } catch (error) {
        console.error('Error saving note:', error);
    }
};

export const loadNote = async (id) => {
    try {
        const encryptedText = await AsyncStorage.getItem(`note-${id}`);
        if (!encryptedText) return null;
        const plainText = decrypt(encryptedText);
        return JSON.parse(plainText);
    } catch (error) {
        console.error('Error loading note:', error);
        return null;
    }
};

export const deleteNote = async (id) => {
    try {
        await AsyncStorage.removeItem(`note-${id}`);
    } catch (error) {
        console.error('Error deleting note:', error);
    }
};

export const listNoteIDs = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        return keys.filter(key => key.startsWith('note-'));
    } catch (error) {
        console.error('Error listing notes:', error);
        return [];
    }
};
