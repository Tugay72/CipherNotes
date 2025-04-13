import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveNote = async (id, noteData) => {
    try {
        await AsyncStorage.setItem(`note-${id}`, JSON.stringify(noteData));
    } catch (error) {
        console.error('Error saving note:', error);
    }
};

export const loadNote = async (id) => {
    try {
        const data = await AsyncStorage.getItem(`note-${id}`);
        return data ? JSON.parse(data) : null;
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
