import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import Note from '../components/note';

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
        navigation.navigate('CreateNote')
    };

    return (
        <View style={styles.container}>

            {/* Notes */}
            <FlatList
                data={notesData}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.noteItem}
                        onPress={() => navigation.navigate('Note', { note: item })}
                    >
                        <Note note={item} />
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.notes}
                columnWrapperStyle={styles.columnWrapper}
            />

            {/* Create new note */}
            <TouchableOpacity style={styles.createNoteButton} onPress={onCreateNote}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingTop: 16,
    },

    notes: {
        paddingHorizontal: 16,
        gap: 16,
    },

    columnWrapper: {
        justifyContent: 'space-between',
    },

    createNoteButton: {
        width: 64,
        height: 64,
        position: 'absolute',
        right: 32,
        bottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E82D9',
        borderRadius: 50,
    },

    buttonText: {
        color: '#F2F2F0',
        fontSize: 32,
        fontWeight: 'bold',
    },
});

