import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, StatusBar, Keyboard, Image, FlatList } from "react-native";
import { Menu, Provider, Divider } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from 'expo-image-picker';
import theme from '../theme';
import { saveNote } from '../noteStorage';

export default function CreateNote({ navigation, route }) {
    const { id } = route.params;
    const { saveNoteByID } = route.params;

    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState(route.params?.title || '');
    const [contentBlocks, setContentBlocks] = useState([
        { type: 'text', content: route.params?.text || '' }
    ]);
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [editing, setEditing] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const goBack = () => {
        navigation.navigate('Home');
    };

    const onBottomNavPress = (onPressFunction) => {
        // Klavye kapanmasını engelle
        if (Keyboard.isVisible()) {
            return;
        }
        onPressFunction();
    };


    const saveNote = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}:${seconds}`);

        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        setDate(`${day}/${month}/${year}`);

        // Merge all text blocks into one for saving
        const finalText = contentBlocks
            .filter(b => b.type === 'text')
            .map(b => b.content)
            .join('\n');

        saveNoteByID(id, title, finalText);
        navigation.navigate('Home');
    };

    const onSaveInput = () => {
        Keyboard.dismiss();
        setEditing(false);
        setVisible(false);
        saveNote();
    };

    const addImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const newUri = result.assets[0].uri;
            const newBlocks = [...contentBlocks];

            newBlocks.push({ type: 'image', content: newUri });
            newBlocks.push({ type: 'text', content: '' });

            setContentBlocks(newBlocks);
        }
    };

    const BNB_DATA = [
        { id: "1", icon: 'record-voice-over', onPress: () => console.log("Voice Recording Started") },
        { id: "2", icon: 'image', onPress: addImage },
        { id: "3", icon: 'brush', onPress: () => console.log("Open Drawing Canvas") },
        { id: "4", icon: 'document-scanner', onPress: () => console.log("Open Document Scanner") },
    ];

    return (
        <Provider>
            <View style={styles.container}>

                {/* Top Navigation */}
                <View style={styles.topNavContainer}>
                    <TouchableOpacity onPress={goBack}>
                        <Text style={styles.buttonText}>←</Text>
                    </TouchableOpacity>

                    {editing ? (
                        <TouchableOpacity onPress={onSaveInput}>
                            <Text style={styles.buttonText}>✔</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={openMenu}>
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
                    <TextInput
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
                        <Text style={{ color: '#2a2a2a' }}>
                            Characters: {
                                contentBlocks.filter(b => b.type === 'text')
                                    .map(b => b.content.length).reduce((a, b) => a + b, 0)
                            } / 3000
                        </Text>
                    </View>

                    <FlatList
                        data={contentBlocks}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            if (item.type === 'image') {
                                return (
                                    <Image
                                        source={{ uri: item.content }}
                                        style={{ width: '100%', height: 200, marginBottom: 10, borderRadius: 8 }}
                                        resizeMode="cover"
                                    />
                                );
                            } else {
                                return (
                                    <TextInput
                                        multiline
                                        placeholder="Start typing..."
                                        placeholderTextColor='#3a3a3a'
                                        style={styles.textInput}
                                        value={item.content}
                                        onChangeText={(text) => {
                                            const updatedBlocks = [...contentBlocks];
                                            updatedBlocks[index].content = text;
                                            setContentBlocks(updatedBlocks);
                                        }}
                                        onFocus={() => setEditing(true)}


                                    />
                                );
                            }
                        }}
                        ListFooterComponent={<View style={{ height: 320 }} />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                {/* Bottom Navigation Bar */}

                <View style={styles.bottomNavigationBar}>
                    <FlatList
                        data={BNB_DATA}
                        horizontal
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.bottomNavBaritem}>
                                <TouchableOpacity onPress={() => onBottomNavPress(item.onPress)}>
                                    {item.icon ? (
                                        <Icon name={item.icon} size={24} color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.buttonText}>
                                            {item.title}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />

                </View>

                <StatusBar style="light" hidden={false} />
            </View>
        </Provider>
    );
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
    bottomNavigationBar: {
        flex: 1,
        position: "absolute",
        bottom: 8,
    },
    bottomNavBaritem: {
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#0f0f0f",
        width: 64,
        height: 64,
    },
    infoBox: {
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
        height: '100%',
        color: theme.secondaryColor,
        fontSize: 16,
        padding: 0,
        marginBottom: 10,
        textAlign: 'left',
        textAlignVertical: 'top'
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
