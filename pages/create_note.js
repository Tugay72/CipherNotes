import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, StatusBar, Keyboard, Image } from "react-native";
import { Menu, Provider, Divider } from 'react-native-paper';

import theme from '../theme';

export default function CreateNote({ navigation, route }) {
    const { id } = route.params?.id || 0;

    const [visible, setVisible] = useState(false);

    // Toggle menu visibility
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const [title, setTitle] = useState(route.params?.title || '');
    const [text, setText] = useState(route.params?.text || '');
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [editing, setEditing] = useState(false);

    const goBack = () => {
        navigation.navigate('Home');
    }

    const saveNote = () => {
        //Save last edit time
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}:${seconds}`);

        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        setDate(`${day}/${month}/${year}`);

        navigation.navigate('Home');
    }

    const onSaveInput = () => {
        Keyboard.dismiss();
        setEditing(false);
        setVisible(false)
    }

    return (
        <Provider>
            <View style={styles.container}>

                {/* Top Navigation */}
                <View style={styles.topNavContainer}>
                    <TouchableOpacity onPress={goBack}>
                        <Text style={styles.buttonText}>☚</Text>
                    </TouchableOpacity>

                    {editing ? (
                        <TouchableOpacity onPress={onSaveInput}>
                            <Text style={styles.buttonText}>✔</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setVisible(true)}>
                            <Menu
                                visible={visible}
                                onDismiss={closeMenu}
                                anchor={
                                    <TouchableOpacity onPress={openMenu}>
                                        <Image
                                            style={styles.tinyLogo}
                                            source={require('../assets/dots.png')}
                                        />
                                    </TouchableOpacity>
                                }

                            >
                                <Menu.Item onPress={() => { console.log('Option 1 pressed'); closeMenu(); }} title="Add password" />
                                <Divider />
                                <Menu.Item onPress={() => { console.log('Option 4 pressed'); closeMenu(); }} title="Delete" />
                            </Menu>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Content */}
                <View style={styles.content}>

                    <TextInput /* Title */
                        placeholder="Title"
                        placeholderTextColor='#3a3a3a'
                        value={title}
                        maxLength={60}
                        numberOfLines={1}
                        onChangeText={setTitle}
                        onFocus={() => setEditing(true)}
                        onBlur={() => setEditing(false)}
                        style={styles.titleInput}
                    />

                    <View style={styles.infoBox}>
                        <Text style={{ color: '#2a2a2a' }}>Last edit: {time + '  ' + date}</Text>
                        <Text style={{ color: '#2a2a2a' }}>Characters: {text.length} / 3000</Text>
                    </View>

                    <TextInput /* Note text */
                        placeholder="Start typing..."
                        placeholderTextColor='#3a3a3a'
                        value={text}
                        maxLength={6000}
                        onChangeText={setText}
                        onFocus={() => setEditing(true)}
                        onBlur={() => setEditing(false)}
                        style={styles.textInput}
                    />
                </View>
                <StatusBar style="light" hidden={false} />
            </View>
        </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        paddingTop: 40,
        flex: 1,
    },

    topNavContainer: {
        width: '100%',
        height: 64,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'black',
        position: 'absolute',
        top: 24,
        left: 0,
    },

    content: {
        flex: 1,
        marginTop: 48,
        padding: 16,
        gap: 16
    },

    infoBox: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },

    titleInput: {
        width: '100%',
        color: theme.secondaryColor,
        fontSize: 24,
        padding: 0,
        margin: 0
    },

    textInput: {
        width: '100%',
        color: theme.secondaryColor,
        fontSize: 16,
        padding: 0,
        margin: 0,
        left: 0
    },

    buttonText: {
        color: theme.secondaryColor,
        fontSize: 24,
    },

    tinyLogo: {
        width: 24,
        height: 24,
    },
});
