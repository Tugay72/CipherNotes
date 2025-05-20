import { useEffect, useState } from 'react';
import { useTheme } from '../theme_context';
import { useIsFocused } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Animated, BackHandler, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import NoteBox from '../components/note_box';
import ToDoBox from '../components/to_do_box';
import ReminderBox from '../components/reminder_box';


export default function Home({ navigation }) {
    const [notesData, setNotesData] = useState([]);
    const [toDoData, setToDoData] = useState([]);
    const [reminderData, setReminderData] = useState([]);

    const [filteredNotes, setFilteredNotes] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [filteredReminders, setFilteredReminders] = useState([]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [section, setSection] = useState('notes');
    const [searchText, setSearchText] = useState('');
    const menuAnimation = useState(new Animated.Value(-250))[0];


    const isFocused = useIsFocused();
    const { currentTheme } = useTheme();
    const styles = getStyles(currentTheme);

    useEffect(() => {
        if (isFocused) {
            setIsMenuOpen(false);
            closeMenu();
        }
    }, [isFocused]);

    useEffect(() => {
        loadNotes();
        loadToDos().then(todos => {
            setToDoData(todos);
            setFilteredTodos(todos);
        });
        loadReminders().then(reminders => {
            setReminderData(reminders);
            setFilteredReminders(reminders);
        });

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
        filterTodos();
        filterReminders();
    }, [searchText, notesData, toDoData, reminderData]);

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

    const changeSection = (section) => {
        setSection(section)
    }

    const encryptData = (data) => {
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
        return ciphertext;
    };

    const decryptData = (ciphertext) => {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    };

    // NOTE FUNCTIONS
    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            if (storedNotes) {
                const notes = decryptData(storedNotes);
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
            const encrypted = encryptData(newNotes);
            await AsyncStorage.setItem('notes', encrypted);
            setNotesData(newNotes);
            setFilteredNotes(newNotes);
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    };

    const saveNoteByID = async (id, notePassword = '', title = 'Untitled', content = 'Text', time = '/', date = '/', theme = '', fontSize = '', fontFamily = '') => {
        let updatedNotes = [...notesData];
        const index = updatedNotes.findIndex(note => note.id === id);
        if (title == '' || title == null) {
            title = 'Title'
        }

        if (content == '' || content == null) {
            content = 'Text'
        }
        const newNote = { id, notePassword, title, content, time, date, theme, fontSize, fontFamily };

        if (index !== -1) {
            updatedNotes[index] = newNote;
        } else {
            const newId = (Date.now()).toString();
            updatedNotes.push({ ...newNote, id: newId });
        }

        await saveNotes(updatedNotes);
    };

    const deleteNoteByID = async (id) => {
        const updatedNotes = notesData.filter(note => note.id !== id);
        await saveNotes(updatedNotes);
    };

    const onCreateNote = () => {
        navigation.navigate('CreateNote', { id: null, title: '', content: '', time: '', date: '', theme: '', fontSize: '', fontFamily: '', saveNoteByID, deleteNoteByID });
    };

    // TODO FUNCTIONS
    const saveToDos = async (toDos) => {
        try {
            const encrypted = encryptData(toDos);
            await AsyncStorage.setItem('@my_todos', encrypted);
        } catch (e) {
            console.error('ToDo kaydedilirken hata:', e);
        }
    };

    const loadToDos = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@my_todos');
            return jsonValue != null ? decryptData(jsonValue) : [];
        } catch (e) {
            console.error('ToDo okunurken hata:', e);
            return [];
        }
    };

    const saveToDoByID = async (id, contentJSON = [], title = 'Untitled', theme = '', fontSize = '', fontFamily = '') => {
        let updatedToDos = [...toDoData];
        const index = updatedToDos.findIndex(todo => todo.id === id);

        if (!title || title.trim() === '') {
            title = 'Title';
        }

        const newToDo = {
            id,
            title,
            contentJSON: typeof contentJSON === 'string' ? contentJSON : JSON.stringify(contentJSON),
            theme: theme,
            fontSize,
            fontFamily
        };

        if (index !== -1) {
            updatedToDos[index] = newToDo;
        } else {
            const newId = Date.now().toString();
            updatedToDos.push({ ...newToDo, id: newId });
        }

        await saveToDos(updatedToDos);
    };

    const deleteToDoByID = async (id) => {
        const updatedToDos = toDoData.filter(todo => todo.id !== id);
        await saveToDos(updatedToDos);
    };

    const filterTodos = () => {
        if (searchText === '') {
            setFilteredTodos(toDoData);
        } else {
            const filtered = toDoData.filter(todo =>
                todo.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredTodos(filtered);
        }
    };

    const onCreateToDo = () => {
        navigation.navigate('CreateToDo', {
            id: '',
            notePassword: '',
            title: '',
            contentJSON: '',
            theme: '',
            fontSize: '',
            fontFamily: '',
            saveToDoByID,
            deleteToDoByID
        })
    }

    // REMINDER FUNCTIONS
    const saveReminders = async (reminders) => {
        try {
            const encrypted = encryptData(reminders);
            await AsyncStorage.setItem('@my_reminders', encrypted);
        } catch (e) {
            console.error('Hatırlatıcı kaydedilirken hata:', e);
        }
    };

    const loadReminders = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@my_reminders');
            return jsonValue != null ? decryptData(jsonValue) : [];
        } catch (e) {
            console.error('Hatırlatıcı okunurken hata:', e);
            return [];
        }
    };

    const saveReminderByID = async (id, title = 'Untitled', date = new Date().toISOString(), theme = '') => {
        let updatedReminders = [...reminderData];
        const index = updatedReminders.findIndex(reminder => reminder.id === id);

        if (!title || title.trim() === '') {
            title = 'Untitled';
        }

        const newReminder = {
            id,
            title,
            date,
            theme
        };

        if (index !== -1) {
            updatedReminders[index] = newReminder;
        } else {
            const newId = Date.now().toString();
            updatedReminders.push({ ...newReminder, id: newId });
        }

        setReminderData(updatedReminders);
        setFilteredReminders(updatedReminders);
        await saveReminders(updatedReminders);
        return true;
    };

    const deleteReminderByID = async (id) => {
        const updatedReminders = reminderData.filter(reminder => reminder.id !== id);
        setReminderData(updatedReminders);
        setFilteredReminders(updatedReminders);
        await saveReminders(updatedReminders);
    };

    const filterReminders = () => {
        if (searchText === '') {
            setFilteredReminders(reminderData);
        } else {
            const filtered = reminderData.filter(reminder =>
                reminder.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredReminders(filtered);
        }
    };

    const onCreateReminder = () => {
        navigation.navigate('CreateReminder', {
            id: '',
            title: '',
            date: '',
            theme: '',
            saveReminderByID,
            deleteReminderByID
        });
    };

    return (
        <View
            style={styles.container}>

            {/* Side Menu with animation */}
            <Animated.View
                style={[
                    styles.menu,
                    {
                        transform: [{ translateX: menuAnimation }],

                    }]}>

                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                    <Text
                        style={styles.menuItemText}
                    >☰</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('Settings')}>
                    <Text
                        style={styles.menuItemText}
                    >Settings</Text>
                </TouchableOpacity>
            </Animated.View>

            {isMenuOpen && (
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            {/* Apps Section */}
            <View style={styles.appsSection}>
                <TouchableOpacity onPress={() => changeSection('notes')}>
                    <MaterialCommunityIcons
                        style={[
                            styles.appsSectionButton,
                            {
                                backgroundColor: section === 'notes' ? currentTheme.buttonBg : "transparent",
                            }

                        ]}
                        name="note-edit" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeSection('to-do')}>
                    <MaterialCommunityIcons
                        style={[
                            styles.appsSectionButton,
                            {
                                backgroundColor: section === 'to-do' ? currentTheme.buttonBg : "transparent",
                            }
                        ]}
                        name="timeline-check-outline" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeSection('reminder')}>
                    <MaterialCommunityIcons
                        style={[
                            styles.appsSectionButton,
                            {
                                backgroundColor: section === 'reminder' ? currentTheme.buttonBg : "transparent",
                            }
                        ]}
                        name="clock-alert" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {section === 'notes' ? (
                <View>
                    <View
                        style={styles.topNavContainer}>

                        <View
                            style={styles.searchBar}
                        >
                            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                                <Text
                                    style={styles.buttonText}
                                >☰</Text>
                            </TouchableOpacity>

                            <TextInput
                                style={{
                                    color: currentTheme.secondaryColor,
                                    flex: 1,
                                }}
                                placeholder="Search notes..."
                                placeholderTextColor={currentTheme.secondaryColor}
                                numberOfLines={1}
                                value={searchText}
                                onChangeText={setSearchText}
                                onBlur={handleSearchBlur}
                            />
                        </View>
                    </View>


                    <FlatList
                        key='notes'
                        data={filteredNotes}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate(
                                    'CreateNote',
                                    {
                                        id: item.id,
                                        notePassword: item.notePassword,
                                        title: item.title,
                                        content: item.content,
                                        time: item.time,
                                        date: item.date,
                                        theme: item.theme,
                                        fontSize: item.fontSize,
                                        fontFamily: item.fontFamily,
                                        saveNoteByID,
                                        deleteNoteByID
                                    })}
                            >
                                <NoteBox note={item} />
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.notes}
                        columnWrapperStyle={styles.columnWrapper}
                    />

                    <TouchableOpacity
                        style={styles.createNoteButton}
                        onPress={onCreateNote}
                    >
                        <Text
                            style={styles.buttonText}
                        >+</Text>
                    </TouchableOpacity>
                </View>
            ) : section === 'to-do' ? (
                <View>

                    <View
                        style={styles.topNavContainer}>

                        <View
                            style={styles.searchBar}
                        >
                            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                                <Text
                                    style={styles.buttonText}
                                >☰
                                </Text>
                            </TouchableOpacity>

                            <TextInput
                                style={{
                                    color: currentTheme.secondaryColor,
                                    flex: 1,
                                }}
                                placeholder="Search to-do..."
                                placeholderTextColor={currentTheme.secondaryColor}
                                numberOfLines={1}
                                value={searchText}
                                onChangeText={setSearchText}
                                onBlur={handleSearchBlur}
                            />
                        </View>
                    </View>

                    <FlatList
                        key='todos'
                        data={filteredTodos}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('CreateToDo', {
                                        id: item.id,
                                        title: item.title,
                                        contentJSON: item.contentJSON,
                                        theme: item.theme,
                                        fontSize: item.fontSize,
                                        fontFamily: item.fontFamily,
                                        saveToDoByID,
                                        deleteToDoByID
                                    })}
                                >
                                    <ToDoBox toDo={item} />
                                </TouchableOpacity>
                            )
                        }}

                        contentContainerStyle={styles.notes}
                    />

                    <TouchableOpacity
                        style={styles.createNoteButton}
                        onPress={onCreateToDo}
                    >
                        <Text
                            style={styles.buttonText}
                        >+</Text>
                    </TouchableOpacity>

                </View>

            ) : section === 'reminder' ? (
                <View>

                    <View style={styles.topNavContainer}>

                        <View
                            style={styles.searchBar}>
                            <TouchableOpacity
                                onPress={toggleMenu}
                                style={styles.menuButton}>
                                <Text
                                    style={styles.buttonText}
                                >☰</Text>
                            </TouchableOpacity>

                            <TextInput
                                style={{
                                    color: currentTheme.secondaryColor,
                                    flex: 1,
                                }}
                                placeholder="Search reminder..."
                                placeholderTextColor={currentTheme.secondaryColor}
                                numberOfLines={1}
                                value={searchText}
                                onChangeText={setSearchText}
                                onBlur={handleSearchBlur}
                            />
                        </View>
                    </View>

                    <FlatList
                        key='todos'
                        data={filteredReminders}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('CreateReminder', {
                                        id: item.id,
                                        title: item.title,
                                        date: item.date,
                                        theme: item.theme,
                                        saveReminderByID,
                                        deleteReminderByID
                                    })}
                                >
                                    <ReminderBox reminder={item} />
                                </TouchableOpacity>
                            )
                        }}

                        contentContainerStyle={styles.notes}
                    />

                    <TouchableOpacity
                        style={styles.createNoteButton}
                        onPress={onCreateReminder}
                    >
                        <Text
                            style={styles.buttonText}
                        >+</Text>
                    </TouchableOpacity>

                </View>
            ) : null}

            <StatusBar style={currentTheme.name === 'dark' ? "light" : "dark"} hidden={false} />
        </View>
    );

}
const getStyles = (theme) => StyleSheet.create({
    container: {
        paddingTop: 16,
        flex: 1,
        backgroundColor: theme.primaryColor
    },

    appsSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginTop: 24,
        marginBottom: 0,
    },

    topNavContainer: {
        width: '100%',
        height: 72,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: theme.primaryColor
    },
    appsSectionButton: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: theme.secondaryColor,
        fontSize: 24,
        borderRadius: 16,
    },
    searchBar: {
        flex: 1,
        height: 48,
        width: '100%',
        flexDirection: 'row',
        paddingLeft: 12,
        borderRadius: 8,
        backgroundColor: theme.containerBg
    },
    notes: {
        paddingHorizontal: 16,
        marginTop: 12,
        paddingBottom: 72,
        gap: 16,
        height: '80%'
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
        borderRadius: 50,
        backgroundColor: theme.buttonBg
    },
    buttonText: {
        fontSize: 32,
        color: theme.secondaryColor
    },
    menu: {
        flex: 1,
        zIndex: 10,
        position: 'absolute',
        top: 101,
        left: 0,
        width: 144,
        height: '100%',
        paddingLeft: 24,
        backgroundColor: theme.containerBg,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },

    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    menuItemText: {
        color: theme.secondaryColor,
        fontSize: 32,
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
        backgroundColor: 'transparent',
        zIndex: 5,
    },
});
