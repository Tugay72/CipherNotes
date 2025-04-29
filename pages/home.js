import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import NoteBox from '../components/note_box';

import theme from '../theme';

export default function Home({ navigation }) {
    const [notesData, setNotesData] = useState([]);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            if (storedNotes) {
                setNotesData(JSON.parse(storedNotes));
            } else {
                setNotesData([]);
            }
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    };

    const saveNotes = async (newNotes) => {
        try {
            await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
            setNotesData(newNotes);
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    };

    const saveNoteByID = async (id, title = 'Empty Title', text = 'Empty Text', time = '/', date = '/') => {
        let updatedNotes = [...notesData];
        const index = updatedNotes.findIndex(note => note.id === id);

        if (index !== -1) {

            updatedNotes[index] = { id, title, text, time, date };
        } else {

            const newId = (Date.now()).toString();
            updatedNotes.push({ id: newId, title, text, time, date });
        }

        await saveNotes(updatedNotes);
    };

    const onCreateNote = () => {
        navigation.navigate('CreateNote', { id: null, title: '', text: '', time: '', date: '', saveNoteByID });
    };

    return (
        <View style={styles.container}>

            {/* Top Navigation */}
            <View style={styles.topNavContainer}>
                <TouchableOpacity>
                    <Text style={styles.buttonText}>--</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Image
                        style={styles.tinyLogo}
                        source={require('../assets/settings.png')}
                    />
                </TouchableOpacity>
            </View>

            {/* Notes */}
            <FlatList
                data={notesData}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.noteItem}
                        onPress={() => navigation.navigate('CreateNote', { id: item.id, title: item.title, text: item.text, time: item.time, date: item.date, saveNoteByID })}
                    >
                        <NoteBox note={item} />
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.notes}
                columnWrapperStyle={styles.columnWrapper}
            />

            {/* Create new note */}
            <TouchableOpacity style={styles.createNoteButton} onPress={onCreateNote}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>

            <StatusBar style="light" hidden={false} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        paddingTop: 16,
        flex: 1,
    },
    topNavContainer: {
        width: '100%',
        height: 72,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'black',
    },
    notes: {
        paddingHorizontal: 16,
        paddingBottom: 72,
        gap: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    createNoteButton: {
        width: 64,
        height: 64,
        position: 'absolute',
        right: 16,
        bottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme[0].lowerOpacityText,
        borderRadius: 50,
    },
    buttonText: {
        color: theme[0].secondaryColor,
        fontSize: 32,
        fontWeight: 'bold',
    },
    tinyLogo: {
        width: 24,
        height: 24,
    },
});