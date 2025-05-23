import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../theme_context';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import themes from "../theme";

import StylingModal from '../components/styling_modal';
import DeleteModal from '../components/delete_modal';
import CreatePasswordModal from '../components/create_note_password';
import PasswordModal from '../components/note_password';

const ToDoComponent = ({ navigation, route }) => {

    const { id, contentJSON, saveToDoByID, deleteToDoByID } = route.params;
    const { currentTheme } = useTheme();

    const [title, setTitle] = useState(route.params?.title || '');
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState(() => {
        try {
            return contentJSON ? JSON.parse(contentJSON) : [];
        } catch (error) {
            console.error("Invalid JSON for tasks:", error);
            return [];
        }
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [stylizeVisible, setStylizeVisible] = useState(false);
    const [editing, setEditing] = useState(false);
    const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);
    const [notePassword, setNotePassword] = useState(route.params?.notePassword || null);
    const [unlocked, setUnlocked] = useState(route.params?.notePassword ? false : true);

    const [fontSize, setFontSize] = useState(route.params?.fontSize || 16);
    const [fontFamily, setFontFamily] = useState(route.params?.fontFamily || 'system');
    const [bgImage, setBgImage] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(route.params?.theme || currentTheme);

    const styles = useMemo(() => getStyles(selectedTheme), [selectedTheme]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', async () => {
            await saveAndGoBack();
            return true;
        });

        return () => backHandler.remove();
    }, [tasks, title, selectedTheme, fontSize, fontFamily, notePassword]);

    const saveAndGoBack = async () => {
        try {
            const contentJSON = JSON.stringify(tasks);
            await saveToDoByID(id, contentJSON, title, selectedTheme, fontSize, fontFamily, notePassword);
            navigation.navigate('Home', {
                shouldNavigateToTodo: true // bu sayede `to-do` sekmesi otomatik seçilir
            });
        } catch (error) {
            console.error('Error saving todo:', error);
        }
    };
    

    const goBack = async () => {
        await saveAndGoBack();
    };

    const applyTheme = (theme) => {
        setSelectedTheme(theme)
    };

    const addTask = () => {
        if (task.trim() !== '') {
            setTasks(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    text: task,
                    completed: false
                }
            ]);
            setTask('');
        }
    };

    const toggleCompleted = (id) => {
        setTasks(prev =>
            prev.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );
    };

    const removeTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const onDeleteInput = async () => {
        deleteToDo();
    }

    const deleteToDo = async () => {
        try {
            await deleteToDoByID(id);
            navigation.navigate('Home');
        } catch (error) {
            console.log('HATA:', error);
        }
    };


    return (
        <View style={styles.container}>
            {unlocked ? (
                <>
                    <View style={styles.topNavContainer}>
                        <TouchableOpacity onPress={goBack}>
                            <MaterialCommunityIcons
                                name="arrow-left-thick"
                                size={24}
                                style={{ color: selectedTheme.secondaryColor }}
                            />
                        </TouchableOpacity>

                        <View
                            style={{
                                paddingLeft: 16,
                                gap: 24,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                            }}>
                            <TouchableOpacity onPress={() => setShowCreatePasswordModal(true)}>
                                <MaterialCommunityIcons name="lock-outline" size={24} color={selectedTheme.placeholderText} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setStylizeVisible(true)}>
                                <MaterialCommunityIcons name="palette-outline" size={24} color={selectedTheme.placeholderText} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
                                <MaterialCommunityIcons name="delete-outline" size={24} color={selectedTheme.errorColor} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.titleContainer}>
                        <TextInput
                            placeholder="Title"
                            placeholderTextColor={selectedTheme.placeholderText}
                            value={title}
                            maxLength={60}
                            numberOfLines={1}
                            onChangeText={setTitle}
                            style={[
                                styles.title,
                                {
                                    fontFamily: fontFamily,
                                    fontSize: fontSize * 1.5
                                }]}
                        />
                        <TouchableOpacity onPress={goBack} style={styles.saveButton}>
                            <MaterialCommunityIcons name="check" size={24} color={selectedTheme.secondaryColor} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    fontFamily: fontFamily
                                }
                            ]}
                            placeholder="Add a task"
                            placeholderTextColor={selectedTheme.secondaryColor}
                            value={task}
                            onChangeText={setTask}
                        />
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={addTask}
                        >
                            <Text style={[
                                styles.addButtonText,
                                {
                                    fontFamily: fontFamily
                                }
                            ]}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={tasks}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View
                                style={styles.taskItem}>
                                <TouchableOpacity onPress={() => toggleCompleted(item.id)}>
                                    <MaterialCommunityIcons
                                        name={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                        size={24}
                                        color={selectedTheme.secondaryColor}
                                        style={{ marginRight: 10 }}
                                    />
                                </TouchableOpacity>

                                <Text
                                    style={[
                                        styles.taskText,
                                        {
                                            color: selectedTheme.secondaryColor,
                                            textDecorationLine: item.completed ? 'line-through' : 'none',
                                            flex: 1,
                                            fontFamily: fontFamily
                                        }
                                    ]}
                                >
                                    {item.text}
                                </Text>

                                <TouchableOpacity onPress={() => removeTask(item.id)}>
                                    <MaterialCommunityIcons
                                        name="trash-can-outline"
                                        size={24}
                                        color={selectedTheme.secondaryColor}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    {/* Styling Modal */}
                    <StylingModal
                        stylizeVisible={stylizeVisible}
                        setStylizeVisible={setStylizeVisible}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        fontFamily={fontFamily}
                        setFontFamily={setFontFamily}
                        bgImage={bgImage}
                        setBgImage={setBgImage}
                        bgColor={selectedTheme.primaryColor}
                        selectedTheme={selectedTheme}
                        setSelectedTheme={setSelectedTheme}
                        applyTheme={applyTheme}
                        themes={themes}>
                    </StylingModal>

                    {/* Create Password Modal */}
                    <CreatePasswordModal
                        visible={showCreatePasswordModal}
                        onClose={() => setShowCreatePasswordModal(false)}
                        onSave={(newPassword) => setNotePassword(newPassword)}
                        theme={selectedTheme}
                    />

                    {/* Delete To-Do Modal */}
                    <DeleteModal
                        showDeleteModal={showDeleteModal}
                        setShowDeleteModal={setShowDeleteModal}
                        currentTheme={currentTheme}
                        onDeleteInput={onDeleteInput}
                        message={"Are you sure you want to delete this note?"}
                    />
                </>
            ) : (
                <PasswordModal
                    visible={true}
                    onClose={() => {
                        navigation.navigate('Home');
                    }}
                    onUnlock={() => setUnlocked(true)}
                    notePassword={notePassword}
                    theme={selectedTheme}
                />
            )}
        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        padding: 12,
        paddingTop: 48,
        flex: 1,
        backgroundColor: theme.primaryColor
    },
    topNavContainer: {
        flex: 1,
        width: '100%',
        height: 96,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        position: 'absolute',
        top: 48,
        left: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 64,
        marginBottom: 12,
        gap: 8,
    },
    title: {
        flex: 1,
        fontWeight: 'bold',
        color: theme.titleColor
    },
    saveButton: {
        padding: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 48,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: theme.containerBg,
        color: theme.secondaryColor,
    },
    addButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: theme.lowerOpacityText
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.buttonText
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 0.5,
        backgroundColor: theme.containerBg
    },
    taskText: {
        fontSize: 16,
    },
});

export default ToDoComponent;
