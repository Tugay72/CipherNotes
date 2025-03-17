import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import NoteBox from '../components/note_box';

import theme from '../theme';

const notesData = [
    { id: '1', title: 'Note 1', text: 'This is a short note.' },
    { id: '2', title: 'Note 2', text: 'Another quick thought.' },
    { id: '3', title: 'Reminder', text: 'Don’t forget to hydrate.' },
    { id: '4', title: 'Idea', text: 'Brainstorming for a new app.' },
    { id: '5', title: 'To-Do', text: 'Finish React Native project.' },
    { id: '6', title: 'Quote', text: '“Stay hungry, stay foolish.”' },
    { id: '7', title: 'Note 1', text: 'This is a short note.' },
    { id: '8', title: 'Note 2', text: 'Another quick thought.' },
    { id: '9', title: 'Reminder', text: 'Don’t forget to hydrate.' },
    { id: '10', title: 'Idea', text: 'Brainstorming for a new app.' },
    { id: '11', title: 'To-Do', text: 'Finish React Native project.' },
    { id: '12', title: 'Quote', text: '“Stay hungry, stay foolish.”' },
];

export default function Home({ navigation }) {
    const onCreateNote = () => {
        navigation.navigate('CreateNote', { id: 13, title: '', text: '', saveNoteByID: saveNoteByID })
    };

    const saveNoteByID = (id, title, text) => {
        console.log(id, title, text)
        // Find the note by id
        const note = notesData.find(note => note.id === id);

        if (note) {
            // Update the note's title and text
            note.title = title;
            note.text = text;
        } else {
            // Create a new note
            let newId = (parseInt(notesData[notesData.length - 1].id) + 1).toString(); // Generate a new unique id
            notesData.push({
                id: newId,
                title: title,
                text: text
            });

        }
    };

    return (
        <View style={styles.container}>

            {/* Top Navigation */}
            <View style={styles.topNavContainer}>
                <TouchableOpacity>
                    <Text style={styles.buttonText}>\\\</Text>
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
                        onPress={() => navigation.navigate('CreateNote', { id: item.id, title: item.title, text: item.text, saveNoteByID: saveNoteByID })}
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
    },

    topNavContainer: {
        width: '100%',
        height: 72,

        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'black',
        left: 0,

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
        bottom: 80,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: 50,
    },

    buttonText: {
        color: theme.secondaryColor,
        fontSize: 32,
        fontWeight: 'bold',
    },

    tinyLogo: {
        width: 24,
        height: 24,
    },
});

