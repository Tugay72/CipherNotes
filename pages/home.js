import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Animated, BackHandler, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import NoteBox from '../components/note_box';

import theme from '../theme';

export default function Home({ navigation }) {
    const [notesData, setNotesData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuAnimation = useState(new Animated.Value(-250))[0];

    useEffect(() => {
        loadNotes();

        // Geri tuşuna basıldığında menüyü kapat
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (isMenuOpen) {
                closeMenu();
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    }, [isMenuOpen]);

    useEffect(() => {
        filterNotes();
    }, [searchText, notesData]);

    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            if (storedNotes) {
                const notes = JSON.parse(storedNotes);
                setNotesData(notes);
                setFilteredNotes(notes);
            } else {
                setNotesData([]);
                setFilteredNotes([]);
            }
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    };

    const filterNotes = () => {
        if (searchText === '') {
            setFilteredNotes(notesData);
        } else {
            const filtered = notesData.filter(note =>
                note.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredNotes(filtered);
        }
    };

    const saveNotes = async (newNotes) => {
        try {
            await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
            setNotesData(newNotes);
            setFilteredNotes(newNotes);
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    };

    const saveNoteByID = async (id, title = 'Title', text = 'Text', time = '/', date = '/') => {
        let updatedNotes = [...notesData];
        const index = updatedNotes.findIndex(note => note.id === id);

        if (title == '' || title == null) {
            title = 'Title'
        }

        if (text == '' || text == null) {
            text = 'Text'
        }

        if (index !== -1) {
            updatedNotes[index] = { id, title, text, time, date };
        } else {
            const newId = (Date.now()).toString();
            updatedNotes.push({ id: newId, title, text, time, date });
        }

        await saveNotes(updatedNotes);
    };

    const deleteNoteByID = async (id) => {
        const updatedNotes = notesData.filter(note => note.id !== id);
        console.log('GÜNCELLENMİŞ NOTES:', updatedNotes);
        await saveNotes(updatedNotes);
        console.log('NOTLAR KAYDEDİLDİ');
    };




    const onCreateNote = () => {
        navigation.navigate('CreateNote', { id: null, title: '', text: '', time: '', date: '', saveNoteByID, deleteNoteByID });
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        const toValue = isMenuOpen ? -250 : 0;
        Animated.timing(menuAnimation, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        Animated.timing(menuAnimation, {
            toValue: -250,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleSearchBlur = () => {

        if (isMenuOpen) {
            closeMenu();
        }
    };

    return (
        <View style={styles.container}>
            {/* Side Menu with animation */}
            <Animated.View style={[styles.menu, { transform: [{ translateX: menuAnimation }] }]}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
                    <Text style={styles.menuItemText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                    <Text style={styles.menuItemText}>Close Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.buttonText}>☾</Text>
                </TouchableOpacity>
            </Animated.View>

            {isMenuOpen && (
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            {/* Top Navigation */}
            <View style={styles.topNavContainer}>
                <View style={styles.searchBar}>
                    <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                        <Text style={styles.buttonText}>☰</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={{
                            color: theme[0].secondaryColor,
                        }}
                        placeholder="Search notes..."
                        placeholderTextColor={theme[0].secondaryColor}
                        numberOfLines={1}
                        value={searchText}
                        onChangeText={setSearchText}
                        onBlur={handleSearchBlur}
                    />
                </View>


            </View>

            {/* Notes */}
            <FlatList
                data={filteredNotes}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.noteItem}
                        onPress={() => navigation.navigate('CreateNote', { id: item.id, title: item.title, text: item.text, time: item.time, date: item.date, saveNoteByID, deleteNoteByID })}
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
        marginTop: 32,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: 'black',
    },
    searchBar: {
        flex: 1,
        height: 48,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        color: theme[0].secondaryColor,
        paddingLeft: 12,
        borderRadius: 8,
    },
    notes: {
        paddingHorizontal: 16,
        marginTop: 12,
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
    menu: {
        flex: 1,
        zIndex: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        width: 200,
        height: '120%',
        backgroundColor: theme[0].primaryColor,
        paddingTop: 60,
        paddingLeft: 20,
    },
    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    menuItemText: {
        color: theme[0].secondaryColor,
        fontSize: 18,
    },
    menuButton: {
        marginRight: 16,
    },

    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent', // Gerekirse yarı saydam yapabilirsin
        zIndex: 5, // Menüden düşük ama içerikten yüksek olmalı
    },

});
