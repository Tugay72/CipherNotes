import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { useTheme } from '../theme_context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import themes from "../theme";

import StylingModal from '../components/styling_modal';
import DeleteModal from '../components/delete_modal';

const ToDoComponent = ({ navigation, route }) => {

    const { id, contentJSON, saveToDoByID, deleteToDoByID } = route.params;

    const [editing, setEditing] = useState(false);

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
    const [fontSize, setFontSize] = useState(route.params?.fontSize || 16);
    const [fontFamily, setFontFamily] = useState(route.params?.fontFamily || 'system');
    const [bgImage, setBgImage] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(route.params?.theme || currentTheme);


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

    {/* Navigating to homepage while saving the to-do*/ }
    const goBack = async () => {
        const contentJSON = JSON.stringify(tasks);
        await saveToDoByID(id, contentJSON, title, selectedTheme);

        navigation.navigate('Home');
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
        <View style={[styles.container, { backgroundColor: selectedTheme.primaryColor }]}>

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
                    <TouchableOpacity onPress={() => console.log('Add password')}>
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

            <TextInput
                placeholder="Title"
                placeholderTextColor={selectedTheme.placeholderText}
                value={title}
                maxLength={60}
                numberOfLines={1}
                onChangeText={setTitle}
                onFocus={() => setEditing(true)}
                onBlur={() => setEditing(false)}
                style={[
                    styles.title,
                    {
                        color: selectedTheme.titleColor,
                        fontFamily: fontFamily,
                        fontSize: fontSize * 1.5
                    }]}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: selectedTheme.containerBg,
                        color: selectedTheme.secondaryColor,
                        fontFamily: fontFamily
                    }]}
                    placeholder="Add a task"
                    placeholderTextColor={selectedTheme.secondaryColor}
                    value={task}
                    onChangeText={setTask}
                />
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: selectedTheme.lowerOpacityText }]}
                    onPress={addTask}
                >
                    <Text style={[styles.addButtonText, { color: selectedTheme.buttonText, fontFamily: fontFamily }]}>Add</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.taskItem, { backgroundColor: selectedTheme.containerBg }]}>
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

            {/* Delete To-Do Modal */}
            <DeleteModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                currentTheme={currentTheme}
                onDeleteInput={onDeleteInput}
                message={"Are you sure you want to delete this note?"}
            ></DeleteModal>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        paddingTop: 48,
        flex: 1,
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
    title: {
        marginTop: 64,
        marginBottom: 12,
        fontWeight: 'bold',
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
    },
    addButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 0.5,
    },
    taskText: {
        fontSize: 16,
    },
});

export default ToDoComponent;
