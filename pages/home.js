import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Animated, BackHandler, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import NoteBox from '../components/note_box';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../theme_context';
import ToDoComponent from '../components/to-do';
import ToDoBox from '../components/to_do_box';

export default function Home({ navigation }) {
    const [notesData, setNotesData] = useState([]);
    const [toDoData, setToDoData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [section, setSection] = useState('notes');

    const menuAnimation = useState(new Animated.Value(-250))[0];

    const { currentTheme } = useTheme();

    useEffect(() => {
        loadNotes();
        loadToDos().then(todos => {
            setToDoData(todos);
            setFilteredTodos(todos);
        });
        console.log(toDoData)

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
    }, [searchText, notesData, toDoData]);

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

    const saveNoteByID = async (id, title = 'Title', content = 'Text', time = '/', date = '/', theme = 'dark') => {
        let updatedNotes = [...notesData];
        const index = updatedNotes.findIndex(note => note.id === id);
        if (title == '' || title == null) {
            title = 'Title'
        }

        if (content == '' || content == null) {
            content = 'Text'
        }
        const newNote = { id, title, content, time, date, theme };

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
        console.log('GÜNCELLENMİŞ NOTES:', updatedNotes);
        await saveNotes(updatedNotes);
        console.log('NOTLAR KAYDEDİLDİ');
    };

    const onCreateNote = () => {
        navigation.navigate('CreateNote', { id: null, title: '', content: '', time: '', date: '', theme: '', saveNoteByID, deleteNoteByID });
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

    const changeSection = (section) => {
        setSection(section)
    }

    const saveToDos = async (toDos) => {
        try {
            await AsyncStorage.setItem('@my_todos', JSON.stringify(toDos));
        } catch (e) {
            console.error('ToDo kaydedilirken hata:', e);
        }
    };

    const loadToDos = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@my_todos');
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('ToDo okunurken hata:', e);
            return [];
        }
    };

    const saveToDoByID = async (id, contentJSON = [], title = 'Title') => {
        let updatedToDos = [...toDoData];
        const index = updatedToDos.findIndex(todo => todo.id === id);

        if (!title || title.trim() === '') {
            title = 'Title';
        }

        if (!Array.isArray(contentJSON)) {
            contentJSON = [];
        }

        const newToDo = { id, title, contentJSON };

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
        console.log('GÜNCELLENMİŞ TODOS:', updatedToDos);
        await saveToDos(updatedToDos);
        console.log('TODO KAYDEDİLDİ');
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
            title: '',
            contentJSON: '',
            saveToDoByID,
            deleteToDoByID
        })
    }



    return (
        <View style={[
            styles.container,
            {
                backgroundColor: currentTheme.primaryColor

            }
        ]}>

            {/* Side Menu with animation */}
            <Animated.View
                style={[
                    styles.menu,
                    {
                        transform: [{ translateX: menuAnimation }],
                        backgroundColor: currentTheme.containerBg,
                    }]}>

                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                    <Text
                        style={[
                            styles.menuItemText,
                            {
                                color:
                                    currentTheme.secondaryColor,
                                fontSize: 32,

                            }
                        ]}>☰</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('Settings')}>
                    <Text style={[
                        styles.menuItemText,
                        {
                            color: currentTheme.secondaryColor
                        }
                    ]}>Settings</Text>
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
                        style={
                            {
                                paddingHorizontal: 8,
                                paddingVertical: 12,
                                color: currentTheme.secondaryColor,
                                fontSize: 24,

                            }}
                        name="note-edit" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeSection('to-do')}>
                    <MaterialCommunityIcons
                        style={
                            {
                                paddingHorizontal: 8,
                                paddingVertical: 12,
                                color: currentTheme.secondaryColor,
                                fontSize: 24,

                            }}
                        name="timeline-check-outline" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeSection('reminder')}>
                    <MaterialCommunityIcons
                        style={
                            {
                                paddingHorizontal: 8,
                                paddingVertical: 12,
                                color: currentTheme.secondaryColor,
                                fontSize: 24,

                            }}
                        name="clock-alert" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {section === 'notes' ? (
                <View>
                    <View style={[
                        styles.topNavContainer,
                        {
                            backgroundColor:
                                currentTheme.primaryColor
                        }
                    ]}>

                        <View style={[
                            styles.searchBar,
                            {
                                backgroundColor: currentTheme.containerBg
                            }
                        ]}>
                            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                                <Text style={[
                                    styles.buttonText,
                                    {
                                        color: currentTheme.secondaryColor
                                    }
                                ]}>☰</Text>
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
                        data={filteredNotes}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.noteItem}
                                onPress={() => navigation.navigate('CreateNote', { id: item.id, title: item.title, content: item.content, time: item.time, date: item.date, theme: item.theme, saveNoteByID, deleteNoteByID })}
                            >
                                <NoteBox note={item} />
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.notes}
                        columnWrapperStyle={styles.columnWrapper}
                    />


                    <TouchableOpacity style={[
                        styles.createNoteButton,
                        {
                            backgroundColor: currentTheme.lowerOpacityText
                        }
                    ]} onPress={onCreateNote}>
                        <Text style={[
                            styles.buttonText,
                            {
                                color: currentTheme.secondaryColor
                            }
                        ]}>+</Text>
                    </TouchableOpacity>
                </View>
            ) : section === 'to-do' ? (
                <View>

                    <View style={[
                        styles.topNavContainer,
                        {
                            backgroundColor: currentTheme.primaryColor
                        }
                    ]}>

                        <View style={[
                            styles.searchBar,
                            {
                                backgroundColor: currentTheme.containerBg
                            }
                        ]}>
                            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                                <Text style={[
                                    styles.buttonText,
                                    {
                                        color: currentTheme.secondaryColor
                                    }
                                ]}>☰</Text>
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
                        data={filteredTodos}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.noteItem}
                                onPress={() => navigation.navigate('CreateToDo', {
                                    id: item.id,
                                    title: item.title,
                                    content: item.contentJSON,
                                    saveToDoByID,
                                    deleteToDoByID
                                })}
                            >
                                <ToDoBox toDo={item} />
                            </TouchableOpacity>
                        )}

                        contentContainerStyle={styles.notes}
                        columnWrapperStyle={styles.columnWrapper}
                    />

                    <TouchableOpacity style={[
                        styles.createNoteButton,
                        {
                            backgroundColor: currentTheme.lowerOpacityText
                        }
                    ]} onPress={onCreateToDo}>
                        <Text style={[
                            styles.buttonText,
                            {
                                color: currentTheme.secondaryColor
                            }
                        ]}>+</Text>
                    </TouchableOpacity>

                </View>

            ) : section === 'remindeer' ? (
                <Text>A</Text>
            ) : null}




            <StatusBar style={currentTheme.name === 'dark' ? "light" : "dark"} hidden={false} />
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        flex: 1,
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
    },
    searchBar: {
        flex: 1,
        height: 48,
        width: '100%',
        flexDirection: 'row',
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
        borderRadius: 50,
    },
    buttonText: {
        fontSize: 32,
    },
    menu: {
        flex: 1,
        zIndex: 10,
        position: 'absolute',
        top: 86,
        left: 0,
        width: 144,
        height: '100%',
        paddingLeft: 24,
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
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
        backgroundColor: 'transparent',
        zIndex: 5,
    },
});
