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

const ToDoComponent = ({ navigation, route }) => {

    const { id, contentJSON, saveToDoByID, deleteToDoByID } = route.params;

    console.log(contentJSON)

    const { currentTheme } = useTheme();
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState(() => {
        try {
            return contentJSON ? JSON.parse(contentJSON) : [];
        } catch (error) {
            console.error("Invalid JSON for tasks:", error);
            return [];
        }
    });


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

    const goBack = async () => {
        const contentJSON = JSON.stringify(tasks);
        const title = 'Title';
        await saveToDoByID(id, contentJSON, title);

        navigation.navigate('Home');
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.primaryColor }]}>
            <View style={styles.topNavContainer}>
                <TouchableOpacity onPress={goBack}>
                    <MaterialCommunityIcons
                        name="arrow-left-thick"
                        size={24}
                        style={{ color: currentTheme.secondaryColor }}
                    />
                </TouchableOpacity>
            </View>

            <Text style={[styles.title, { color: currentTheme.secondaryColor }]}>To-Do List</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: currentTheme.containerBg,
                        color: currentTheme.secondaryColor,
                    }]}
                    placeholder="Add a task"
                    placeholderTextColor={currentTheme.secondaryColor}
                    value={task}
                    onChangeText={setTask}
                />
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: currentTheme.lowerOpacityText }]}
                    onPress={addTask}
                >
                    <Text style={[styles.addButtonText, { color: currentTheme.secondaryColor }]}>Add</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.taskItem, { backgroundColor: currentTheme.containerBg }]}>
                        <TouchableOpacity onPress={() => toggleCompleted(item.id)}>
                            <MaterialCommunityIcons
                                name={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                size={24}
                                color={currentTheme.secondaryColor}
                                style={{ marginRight: 10 }}
                            />
                        </TouchableOpacity>

                        <Text
                            style={[
                                styles.taskText,
                                {
                                    color: currentTheme.secondaryColor,
                                    textDecorationLine: item.completed ? 'line-through' : 'none',
                                    flex: 1
                                }
                            ]}
                        >
                            {item.text}
                        </Text>

                        <TouchableOpacity onPress={() => removeTask(item.id)}>
                            <MaterialCommunityIcons
                                name="trash-can-outline"
                                size={24}
                                color={currentTheme.secondaryColor}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        padding: 12,
        flex: 1,
    },
    topNavContainer: {
        width: '100%',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        position: 'absolute',
        top: 48,
        left: 0,
        zIndex: 10,
    },
    title: {
        fontSize: 24,
        marginTop: 96,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 48,
    },
    input: {
        flex: 1,
        borderWidth: 1,
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
