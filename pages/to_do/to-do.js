import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../theme'

import StylingModal from '../../components/styling_modal';
import DeleteModal from '../../components/delete_modal';
import CreatePasswordModal from '../note/create_note_password';
import PasswordModal from '../../components/note_password';

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

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTaskText, setEditingTaskText] = useState('');

    const startEditingTask = (id, currentText) => {
        setEditingTaskId(id);
        setEditingTaskText(currentText);
    };

    const finishEditingTask = () => {
        setTasks(prev =>
            prev.map(t =>
                t.id === editingTaskId ? { ...t, text: editingTaskText } : t
            )
        );
        setEditingTaskId(null);
        setEditingTaskText('');
    };

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
        if (task.trim() === '') return;

        if (editingTaskId) {
            // Düzenleme modundaysak
            setTasks(prev =>
                prev.map(t =>
                    t.id === editingTaskId ? { ...t, text: task } : t
                )
            );
            setEditingTaskId(null); // Düzenleme modunu kapat
        } else {
            // Yeni görev ekle
            setTasks(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    text: task,
                    completed: false
                }
            ]);
        }
        setTask('');
    };


    const toggleCompleted = (id) => {
        setTasks(prev =>
            prev.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );
    };

    const editTask = (id) => {
        const taskToEdit = tasks.find(t => t.id === id);
        if (taskToEdit) {
            setTask(taskToEdit.text);     // Input'a görev metnini yükle
            setEditingTaskId(id);         // Düzenleme modunu aktif et
        }
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

    const completedCount = tasks.filter(task => task.completed).length;
    const totalCount = tasks.length;

    const getStatusProps = () => {
        if (totalCount === 0) {
            return {
                icon: 'clipboard-text-outline',
                bgColor: '#666',
                message: 'Henüz görev yok',
            };
        }

        if (completedCount === totalCount) {
            return {
                icon: 'check-circle-outline',
                bgColor: '#4CAF50',
                message: 'Tüm görevler tamamlandı!',
            };
        }

        if (completedCount === 0) {
            return {
                icon: 'alert-circle-outline',
                bgColor: '#F44336',
                message: 'Hiç görev tamamlanmamış!',
            };
        }

        return {
            icon: 'progress-clock',
            bgColor: '#FF9800',
            message: `${completedCount}/${totalCount} görev tamamlandı`,
        };
    };

    const { icon, bgColor, message } = getStatusProps();






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
                            placeholder="Başlık"
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
                            placeholder="Görev ekle"
                            placeholderTextColor={selectedTheme.placeholderText}
                            value={task}
                            onChangeText={setTask}
                        />

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={addTask}
                        >
                            <MaterialCommunityIcons
                                name='plus'
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.allDoneBox, { backgroundColor: bgColor }]}>
                        <MaterialCommunityIcons name={icon} size={20} color="white" />
                        <Text style={styles.allDoneText}>{message}</Text>
                    </View>


                    <FlatList
                        data={tasks}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.taskItem}>
                                <TouchableOpacity onPress={() => toggleCompleted(item.id)}>
                                    <MaterialCommunityIcons
                                        name={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                        size={24}
                                        color={selectedTheme.secondaryColor}
                                        style={{ marginRight: 10 }}
                                    />
                                </TouchableOpacity>

                                {editingTaskId === item.id ? (
                                    <TextInput
                                        multiline
                                        style={[
                                            styles.taskText,
                                            {
                                                color: selectedTheme.secondaryColor,
                                                flex: 1,
                                                fontFamily: fontFamily
                                            }
                                        ]}
                                        value={editingTaskText}
                                        onChangeText={setEditingTaskText}
                                        onBlur={finishEditingTask}
                                        onSubmitEditing={finishEditingTask}
                                        autoFocus
                                    />
                                ) : (
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => startEditingTask(item.id, item.text)}>
                                        <Text
                                            style={[
                                                styles.taskText,
                                                {
                                                    color: selectedTheme.secondaryColor,
                                                    textDecorationLine: item.completed ? 'line-through' : 'none',
                                                    fontFamily: fontFamily,
                                                    paddingVertical: 16,
                                                }
                                            ]}
                                        >
                                            {item.text}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => removeTask(item.id)}
                                >
                                    <MaterialCommunityIcons
                                        name="trash-can"
                                        size={20}
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
                        message={"Silmek istediğinden emin misin?"}
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
        alignItems: 'center',
        marginBottom: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: theme.containerBg,
        paddingLeft: 8,
    },
    input: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 16,
        color: theme.secondaryColor,
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginRight: 9
    },
    addButtonText: {
        paddingHorizontal: 8,
        fontSize: 16,
        color: theme.buttonText
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: theme.containerBg,
        marginBottom: 12,
        paddingLeft: 12,
        minHeight: 64,
    },
    taskText: {
        fontSize: 16,
    },

    editButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        borderRadius: 16,
    },


    deleteButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        marginRight: 4,
        borderRadius: 16,
    },

    allDoneBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        height: 56,
    },
    allDoneText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});


export default ToDoComponent;