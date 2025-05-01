import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, StatusBar, Keyboard, Image, ImageBackground, FlatList, Modal } from "react-native";
import { Menu, Provider, Divider } from 'react-native-paper';

import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from 'expo-image-picker';

import themes from "../theme";
import StylingModal from "../components/styling_modal";

export default function CreateNote({ navigation, route }) {
    const { id } = route.params;
    const { saveNoteByID } = route.params;

    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState(route.params?.title || '');
    const [contentBlocks, setContentBlocks] = useState([
        { type: 'text', content: route.params?.text || '' }
    ]);
    const [time, setTime] = useState(route.params?.time || '');
    const [date, setDate] = useState(route.params?.date || '');
    const [editing, setEditing] = useState(false);

    const [stylizeVisible, setStylizeVisible] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [fontStyle, setFontStyle] = useState('normal');
    const [fontColor, setFontColor] = useState('#ffffff')
    const [bgImage, setBgImage] = useState(null);
    const [bgColor, setBgColor] = useState('#000000');
    const [selectedTheme, setSelectedTheme] = useState(null);

    const applyTheme = (theme) => {
        setBgColor(theme.primaryColor);
        setFontColor(theme.secondaryColor)
    };

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const goBack = async () => {
        await saveNote();
        navigation.navigate('Home');
    };


    const onBottomNavPress = (onPressFunction) => {
        if (Keyboard.isVisible()) {
            return;
        }
        onPressFunction();
    };


    const saveNote = async () => {
        const now = new Date();
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        setTime(formattedTime);
        setDate(formattedDate);

        const finalText = contentBlocks
            .filter(b => b.type === 'text')
            .map(b => b.content)
            .join('\n');

        saveNoteByID(id, title, finalText, formattedTime, formattedDate);
        Keyboard.dismiss();
    };


    const onSaveInput = async () => {
        Keyboard.dismiss();
        setEditing(false);
        setVisible(false);
        await saveNote();
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

    const pickBackgroundImage = async () => {
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
            setBgImage(result.assets[0].uri);
        }
        else {
            setBgColor('#f0f0f0')
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
            <StylingModal
                stylizeVisible={stylizeVisible}
                setStylizeVisible={setStylizeVisible}
                fontSize={fontSize}
                setFontSize={setFontSize}
                bgImage={bgImage}
                setBgImage={setBgImage}
                bgColor={bgColor}
                setBgColor={setBgColor}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                applyTheme={applyTheme}
                themes={themes}>

            </StylingModal>


            <ImageBackground
                source={bgImage ? { uri: bgImage } : null}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                <View style={[styles.container, { backgroundColor: bgImage ? 'transparent' : bgColor }]}>


                    {/* Top Navigation */}
                    <View style={[styles.topNavContainer, { backgroundColor: 'none' }]}>
                        <TouchableOpacity onPress={goBack}>
                            <Text style={[styles.buttonText, { color: fontColor }]}>←</Text>
                        </TouchableOpacity>

                        {editing ? (
                            <TouchableOpacity onPress={onSaveInput}>
                                <Text style={[styles.buttonText, { color: fontColor }]}>✔</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={openMenu}>
                                <Menu
                                    visible={visible}
                                    onDismiss={closeMenu}
                                    anchor={
                                        <TouchableOpacity onPress={openMenu}>
                                            <Text style={[styles.textInput, { fontSize: 24, color: fontColor }]}>:</Text>
                                        </TouchableOpacity>
                                    }
                                >
                                    <Menu.Item onPress={() => { console.log('Option 1 pressed'); closeMenu(); }} title="Add password" />
                                    <Menu.Item
                                        onPress={() => {
                                            closeMenu();
                                            setStylizeVisible(true);
                                        }}
                                        title="Stylize"
                                    />

                                    <Divider />
                                    <Menu.Item onPress={() => { console.log('Option 3 pressed'); closeMenu(); }} title="Delete" />
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
                            style={[styles.titleInput, { color: fontColor }]}
                        />

                        <View style={styles.infoBox}>
                            <Text style={{ color: fontColor + 60 }}>Last edit: {time + '  ' + date}</Text>
                            <Text style={{ color: fontColor + 60 }}>
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
                                            placeholderTextColor={fontColor + 75}
                                            style={[styles.textInput, { color: fontColor, fontSize: fontSize }]}
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
                    <View style={[styles.bottomNavigationBar, { backgroundColor: 'black', paddingRight: 140 }]}>
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
            </ImageBackground>
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
        bottom: 0,
    },
    bottomNavBaritem: {
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "none",
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
        color: themes[0].secondaryColor,
        fontSize: 24,
        padding: 0,
        margin: 0
    },
    textInput: {
        width: '100%',
        height: '100%',
        color: themes[0].secondaryColor,
        fontSize: 16,
        padding: 0,
        marginBottom: 10,
        textAlign: 'left',
        textAlignVertical: 'top'
    },
    buttonText: {
        color: themes[0].secondaryColor,
        fontSize: 24,
    },
    tinyLogo: {
        width: 24,
        height: 24,
    },


    // STYLIZE MODAL
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)'
    },

    modalContainer: {
        backgroundColor: '#1a1a1a',
        padding: 20,
        borderRadius: 12,
        width: '90%',
        height: '80%'
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16
    },

    modalLabel: {
        color: '#ccc',
        marginTop: 10,
        marginBottom: 4
    },

    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12
    },

    optionButton: {
        backgroundColor: '#333',
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        borderRadius: 6,
    },

    optionSelected: {
        backgroundColor: '#007bff',
    },

    colorBox: {
        width: 32,
        height: 32,
        borderRadius: 6,
        marginRight: 8,
    },

    colorSelected: {
        borderWidth: 2,
        borderColor: '#fff',
    },

    modalCloseButton: {
        marginTop: 16,
        alignSelf: 'flex-end',
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6
    },

    colorBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        margin: 8,
        borderWidth: 2,
        borderColor: 'none',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 4,
    },

    colorBoxSelected: {
        borderColor: '#ffffff',
        borderWidth: 3,
    },

    secondaryDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00000033',
    }
});
