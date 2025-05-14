import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, StatusBar, Keyboard, Image, ImageBackground, FlatList, Modal } from "react-native";
import { Menu, Provider, Divider } from 'react-native-paper';
import { Audio } from 'expo-av';

import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from 'expo-image-picker';
import VoiceNote from '../components/voice_note'

import themes from "../theme";
import StylingModal from "../components/styling_modal";


export default function CreateNote({ navigation, route }) {
    const { id } = route.params;
    const { saveNoteByID } = route.params;
    const { deleteNoteByID } = route.params;


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

    const [audioUri, setAudioUri] = useState(null);
    const [sound, setSound] = useState(null);
    const [showVoiceNote, setShowVoiceNote] = useState(false);

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

    const deleteNote = async () => {
        try {
            console.log('Deleting');
            await deleteNoteByID(id);
            console.log('Navigating');
            navigation.navigate('Home');
        } catch (error) {
            console.log('HATA:', error);
        }
    };

    const onSaveInput = async () => {
        Keyboard.dismiss();
        setEditing(false);
        setVisible(false);
        await saveNote();
    };

    const onDeleteInput = async () => {
        deleteNote()
    }

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
            if (newBlocks[0]?.type === 'text') {
                newBlocks[0].content = ' ';
            }

            newBlocks.push({ type: 'image', content: newUri });
            newBlocks.push({ type: 'text', content: ' ' });

            setContentBlocks(newBlocks);
        }
    };

    const deleteImage = (index) => {
        const newBlocks = [...contentBlocks];
        newBlocks.splice(index, 1);
        setContentBlocks(newBlocks)

        if (newBlocks[0].type == 'text' && newBlocks[0].content == ' ') {
            newBlocks[0].content = ''
        }
    }

    const onAudioSave = ({ uri, duration }) => {
        setAudioUri(uri);
        setShowVoiceNote(false);

        const newBlocks = [...contentBlocks];
        if (newBlocks[0].type == 'text' && newBlocks[0].content == ' ') {
            newBlocks[0].content = ' ';
        }
        newBlocks.push({ type: 'audio', content: uri, title: 'Voice Note', duration: duration });
        newBlocks.push({ type: 'text', content: ' ' });
        setContentBlocks(newBlocks);
    };

    const playAudio = async (uri) => {
        if (sound) {
            await sound.stopAsync();
            setSound(null);
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: true }
        );
        setSound(newSound);
    };

    const stopAudio = async () => {
        if (sound) {
            await sound.stopAsync();
            setSound(null);
        }
    };

    const deleteAudio = (index) => {
        const newBlocks = [...contentBlocks];
        newBlocks.splice(index, 1);
        setContentBlocks(newBlocks);

        if (newBlocks[0].type == 'text' && newBlocks[0].content == ' ') {
            newBlocks[0].content = ''
        }

    };




    const BNB_DATA = [
        { id: "1", icon: 'record-voice-over', onPress: () => setShowVoiceNote(true) },
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
                            <Icon style={[
                                styles.buttonText,
                                {
                                    paddingHorizontal: 4,
                                    paddingVertical: 14,
                                    color: fontColor,
                                    fontSize: 24,
                                    fontWeight: 900
                                }]} name="arrow-back-ios-new" />
                        </TouchableOpacity>

                        {editing ? (
                            <TouchableOpacity onPress={onSaveInput}>
                                <Text style={[styles.buttonText, { paddingHorizontal: 8, color: fontColor }]}>✔</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={openMenu}>
                                <Menu
                                    visible={visible}
                                    onDismiss={closeMenu}
                                    anchor={
                                        <TouchableOpacity onPress={openMenu}>
                                            <Text style={[styles.textInput, { fontSize: 32, paddingHorizontal: 8, color: fontColor }]}>⋮</Text>
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
                                    <Menu.Item onPress={() => { onDeleteInput(); closeMenu(); }} title="Delete" />
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
                                        <View>
                                            <Image
                                                source={{ uri: item.content }}
                                                style={{ width: '100%', height: 200, marginBottom: 10, borderRadius: 8 }}
                                                resizeMode="cover"
                                            />
                                            <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
                                                <TouchableOpacity
                                                    onPress={() => { }}
                                                    style={[styles.voiceNote, { width: '77.5%' }]}
                                                >
                                                    <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>
                                                        Something
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => deleteImage(index)}
                                                    style={[styles.voiceNote, { backgroundColor: '#505050', width: '20%' }]}
                                                >
                                                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                                                        🗑️
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                    );
                                } else if (item.type === 'audio') {
                                    return (
                                        <View style={{ marginVertical: 16, }}>
                                            <Text style={{ color: fontColor, fontSize: 16, marginBottom: 10 }}>
                                                🎙️  {item.title}:
                                            </Text>
                                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        backgroundColor: '#ffffff',
                                                        borderRadius: 12,
                                                        overflow: 'hidden',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            if (!sound) {
                                                                playAudio(item.content);
                                                            } else {
                                                                stopAudio();
                                                            }
                                                        }}
                                                        style={[styles.voiceNote, { width: '80%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }]}
                                                    >
                                                        <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>
                                                            {sound ? '■      ' + item.duration : '➤      ' + item.duration}
                                                        </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        onPress={() => deleteAudio(index)}
                                                        style={[styles.voiceNote, { width: '20%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }]}
                                                    >
                                                        <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>
                                                            🗑️
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                        </View>
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
                            scrollEnabled={false}
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

                    {/* Sesli Not Modalı */}
                    <Modal
                        visible={showVoiceNote}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => {
                            setShowVoiceNote(false)
                            onAudioSave()
                        }}
                    >
                        <View style={styles.voiceModalOverlay}>
                            <View style={styles.voiceModalContent}>
                                {/* VoiceNote Component */}
                                <VoiceNote
                                    onCancel={() => {
                                        setShowVoiceNote(false)
                                        onAudioSave()
                                    }}
                                    onVoiceRecorded={onAudioSave}
                                />
                            </View>
                        </View>
                    </Modal>

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
        flex: 1,
        width: '100%',
        height: 96,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        backgroundColor: 'black',
        position: 'absolute',
        top: 32,
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
    },


    voiceNote: {
        backgroundColor: '#ffffff',
        paddingVertical: 8,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',

    },
    voiceModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    voiceModalContent: {
        width: '80%',
        backgroundColor: '#505050',
        padding: 16,
        borderRadius: 16,
        position: 'relative',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        elevation: 5,
    },
});

