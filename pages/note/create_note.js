import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from '../../theme_context';

import { StyleSheet, View, Text, TouchableOpacity, TextInput, StatusBar, Keyboard, Image, ImageBackground, FlatList, Modal, SafeAreaView, Share, BackHandler } from "react-native";
import { Menu, Provider, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/MaterialIcons";

import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import VoiceNote from '../../components/voice_note'

import * as TextRecognition from 'expo-text-recognition';


import themes from "../../theme";
import StylingModal from "../../components/styling_modal";
import DrawingCanvas from "../../components/drawing_canvas";
import DeleteModal from "../../components/delete_modal";
import PasswordModal from "../../components/note_password";
import CreatePasswordModal from "./create_note_password";


export default function CreateNote({ navigation, route }) {
    const { id } = route.params;
    const { saveNoteByID } = route.params;
    const { deleteNoteByID } = route.params;
    const { currentTheme } = useTheme();

    const [unlocked, setUnlocked] = useState(route.params?.notePassword ? false : true);
    const [notePassword, setNotePassword] = useState(route.params?.notePassword || null);

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(route.params?.title || '');
    const [contentBlocks, setContentBlocks] = useState(() => {
        try {
            return route.params?.content
                ? JSON.parse(route.params.content)
                : [{ type: 'text', content: '' }];
        } catch (e) {
            return [{ type: 'text', content: '' }];
        }
    });
    const [time, setTime] = useState(route.params?.time || '');
    const [date, setDate] = useState(route.params?.date || '');


    const [fontSize, setFontSize] = useState(route.params?.fontSize || 16);
    const [fontFamily, setFontFamily] = useState(route.params?.fontFamily || 'system');
    const [bgImage, setBgImage] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(route.params?.theme || currentTheme);

    const [audioUri, setAudioUri] = useState(null);
    const [sound, setSound] = useState(null);
    const [showVoiceNote, setShowVoiceNote] = useState(false);
    const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);
    const [imageToZoom, setImageToZoom] = useState(null);

    const [stylizeVisible, setStylizeVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const styles = useMemo(() => getStyles(selectedTheme), [selectedTheme]);


    useEffect(() => {
        if (selectedTheme == null) {
            applyTheme(currentTheme);
        }
    }, [selectedTheme]);

    // Merge text blocks
    useEffect(() => {
        if (!contentBlocks || contentBlocks.length === 0) return;

        const mergedBlocks = [];
        let i = 0;
        while (i < contentBlocks.length) {
            const currentBlock = contentBlocks[i];

            if (
                currentBlock.type === 'text' &&
                i + 1 < contentBlocks.length &&
                contentBlocks[i + 1].type === 'text'
            ) {
                const mergedText = currentBlock.content + contentBlocks[i + 1].content;
                mergedBlocks.push({ ...currentBlock, content: mergedText });
                i += 2;
            } else {
                mergedBlocks.push(currentBlock);
                i += 1;
            }
        }

        const isEqual = JSON.stringify(mergedBlocks) === JSON.stringify(contentBlocks);
        if (!isEqual) {
            setContentBlocks(mergedBlocks);
        }
        console.log(contentBlocks)
    }, [contentBlocks]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', async () => {
            await saveNote();
            navigation.navigate('Home', { screen: 'notes' });
            return true;
        });

        return () => backHandler.remove();
    }, [title, contentBlocks, selectedTheme, fontSize, fontFamily, notePassword]);

    const goBack = async () => {
        await saveNote();
        navigation.navigate('Home', { screen: 'notes' });
    };

    const getTextFromContentBlocks = (contentBlocks) => {
        return contentBlocks
            .filter(block => block.type === 'text')
            .map(block => block.content)
            .join('\n');
    }

    const shareNote = () => {

        const noteText = getTextFromContentBlocks(contentBlocks);

        Share.share({
            message: noteText,
        })
            .then(result => {
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        console.log('Paylaşılan aktivite:', result.activityType);
                    } else {
                        console.log('Not paylaşıldı!');
                    }
                } else if (result.action === Share.dismissedAction) {
                    console.log('Paylaşım iptal edildi.');
                }
            })
            .catch(error => console.log('Paylaşım hatası:', error));
    }

    const applyTheme = (theme) => {
        setSelectedTheme(theme)
    };

    const onBottomNavPress = (onPressFunction) => {
        if (Keyboard.isVisible()) {
            return;
        }
        onPressFunction();
    };

    const onSaveInput = async () => {
        Keyboard.dismiss();
        setEditing(false);
        setVisible(false);
        await saveNote();
    };

    const saveNote = async () => {
        const now = new Date();
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        setTime(formattedTime);
        setDate(formattedDate);

        const contentJSON = JSON.stringify(contentBlocks);
        saveNoteByID(id, notePassword, title, contentJSON, formattedTime, formattedDate, selectedTheme, fontSize, fontFamily);
        Keyboard.dismiss();
    };

    const onDeleteInput = async () => {
        deleteNote();
    }

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
            if (newBlocks[0]?.type === 'text' && newBlocks[0]?.content == '') {
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

    const onDrawingSave = (uri) => {
        const newBlocks = [...contentBlocks];
        if (newBlocks[0].type == 'text' && newBlocks[0].content == ' ') {
            newBlocks[0].content = ' ';
        }
        console.log(uri)
        newBlocks.push({ type: 'drawing', content: uri });
        newBlocks.push({ type: 'text', content: ' ' });
        setContentBlocks(newBlocks);
    }

    const runTextRecognition = async () => {
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
            const uri = result.assets[0].uri;

            const recognized = await TextRecognition.recognizeTextAsync(uri);
            const recognizedText = recognized.map(block => block.value).join('\n');

            const newBlocks = [...contentBlocks];

            // Ensure at least one text block exists
            if (newBlocks.length === 0 || newBlocks[newBlocks.length - 1].type !== 'text') {
                newBlocks.push({ type: 'text', content: '' });
            }

            // Add recognized text into a new block
            newBlocks.push({ type: 'text', content: recognizedText });
            setContentBlocks(newBlocks);
        }
    };

    const BNB_DATA = [
        { id: "1", icon: 'record-voice-over', onPress: () => setShowVoiceNote(true) },
        { id: "2", icon: 'image', onPress: addImage },
        { id: "3", icon: 'brush', onPress: () => setShowDrawingCanvas(true) },
        { id: "4", icon: 'document-scanner', onPress: () => runTextRecognition },
    ];

    return (
        <Provider>
            <ImageBackground
                source={bgImage ? { uri: bgImage } : null}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                {unlocked ? (
                    <View
                        style={styles.container}
                    >

                        {/* Top Navigation */}
                        <View style={styles.topNavContainer}>
                            <TouchableOpacity onPress={goBack}>
                                <MaterialCommunityIcons
                                    style={
                                        {
                                            paddingHorizontal: 8,
                                            paddingVertical: 12,
                                            color: selectedTheme.secondaryColor,
                                        }}
                                    name="arrow-left-thick" size={24} color="#333" />
                            </TouchableOpacity>

                            {editing ? (
                                <TouchableOpacity onPress={onSaveInput}>
                                    <Text style={[
                                        styles.buttonText,
                                        {
                                            paddingTop: 4,
                                            paddingHorizontal: 8,
                                            color: selectedTheme.secondaryColor
                                        }]}
                                    >✔</Text>
                                </TouchableOpacity>
                            ) : (
                                <View
                                    style={{
                                        padding: 16,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        gap: 24
                                    }}>
                                    <TouchableOpacity onPress={() => shareNote()}>
                                        <MaterialCommunityIcons name="share-variant" size={24} color={selectedTheme.placeholderText} />

                                    </TouchableOpacity>
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
                            )}
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
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
                                    styles.titleInput,
                                    {
                                        fontFamily: fontFamily,
                                        fontSize: fontSize * 1.5,
                                    }]}
                            />

                            <View style={[
                                styles.infoBox,
                                {
                                    flexDirection: fontFamily === 'monospace' ? 'column' : 'row'
                                }]}>
                                <Text style={
                                    {
                                        color: selectedTheme.placeholderText,
                                        fontFamily: fontFamily
                                    }}
                                >Last edit: {time + '  ' + date}</Text>

                                <Text style={
                                    {
                                        color: selectedTheme.placeholderText,
                                        fontFamily: fontFamily
                                    }}
                                >Characters:
                                    {
                                        contentBlocks.filter(b => b.type === 'text')
                                            .map(b => b.content.length).reduce((a, b) => a + b, 0)
                                    }
                                    / 3000</Text>
                            </View>

                            <FlatList
                                data={contentBlocks}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    if (item.type === 'image') {
                                        return (
                                            <View style={{ marginBottom: 16 }}>
                                                <Image
                                                    source={{ uri: item.content }}
                                                    style={styles.image}
                                                    resizeMode="cover"
                                                />

                                                <View style={styles.commonContentButtons}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setImageToZoom(item.content);
                                                            setImageModalVisible(true);
                                                        }}
                                                        style={styles.commonButton}
                                                    >
                                                        <Text style={styles.commonButtonText}>
                                                            Fullscreen
                                                        </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        onPress={() => deleteImage(index)}
                                                        style={styles.commonDeleteButton}
                                                    >
                                                        <MaterialCommunityIcons
                                                            name="trash-can"
                                                            size={20}
                                                            color={selectedTheme.secondaryColor}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                        );
                                    } else if (item.type === 'audio') {
                                        return (
                                            <View style={{ marginVertical: 16, }}>
                                                <Text
                                                    style={styles.voiceNoteTitle}
                                                >🎙️ {item.title}:
                                                </Text>
                                                <View style={
                                                    {
                                                        flexDirection: 'row',
                                                        width: '100%'
                                                    }}>
                                                    <View style={styles.commonContentButtons}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                if (!sound) {
                                                                    playAudio(item.content);
                                                                } else {
                                                                    stopAudio();
                                                                }
                                                            }}
                                                            style={styles.commonButton}
                                                        >
                                                            <Text style={styles.commonButtonText}>
                                                                {sound ? '■  ' + item.duration : '➤  ' + item.duration}
                                                            </Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            onPress={() => deleteAudio(index)}
                                                            style={styles.commonDeleteButton}
                                                        >
                                                            <MaterialCommunityIcons
                                                                name="trash-can"
                                                                size={20}
                                                                color={selectedTheme.secondaryColor}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>

                                                </View>

                                            </View>
                                        );
                                    } else if (item.type === 'drawing') {
                                        console.log(item.content)
                                        return (
                                            <View
                                                style={{ marginBottom: 16 }}>
                                                <Image
                                                    source={{ uri: item.content }}
                                                    style={styles.drawingImage}
                                                    resizeMode="cover"
                                                />

                                                <View style={styles.commonContentButtons}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setImageToZoom(item.content)
                                                            setImageModalVisible(true);
                                                        }}
                                                        style={styles.commonButton}
                                                    >
                                                        <Text style={styles.commonButtonText}>
                                                            Fullscreen
                                                        </Text>
                                                    </TouchableOpacity>


                                                    <TouchableOpacity
                                                        onPress={() => deleteImage(index)}
                                                        style={styles.commonDeleteButton}
                                                    >
                                                        <MaterialCommunityIcons name="trash-can" size={20} color={selectedTheme.secondaryColor} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    } else {
                                        return (
                                            <TextInput
                                                multiline
                                                placeholder="Start typing..."
                                                placeholderTextColor={selectedTheme.placeholderText}
                                                style={[
                                                    styles.textInput,
                                                    {
                                                        fontSize: fontSize,
                                                        fontFamily: fontFamily,
                                                    }
                                                ]}
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
                                showsVerticalScrollIndicator={true}
                                scrollEnabled={true}
                            />


                        </View>

                        {/* Bottom Navigation Bar */}
                        <View
                            style={styles.bottomNavigationBar}>
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

                        {/* Voice Note Modal */}
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

                        {/* Drawing Modal */}
                        <Modal
                            visible={showDrawingCanvas}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => setShowDrawingCanvas(false)}
                        >
                            <View style={styles.drawingModalOverlay}>
                                <View style={styles.drawingModalContent}>
                                    <DrawingCanvas
                                        onSave={(base64Image) => {
                                            onDrawingSave(base64Image)
                                            setShowDrawingCanvas(false);
                                        }}
                                    />
                                </View>
                            </View>
                        </Modal>

                        {/* Delete Note Modal */}
                        <DeleteModal
                            showDeleteModal={showDeleteModal}
                            setShowDeleteModal={setShowDeleteModal}
                            currentTheme={currentTheme}
                            onDeleteInput={onDeleteInput}
                            message={"Are you sure?"}
                        ></DeleteModal>

                        {/* General Modal to show images and drawings at fullscreen */}
                        <Modal visible={imageModalVisible} transparent={true}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,0.9)'
                                }}
                            >
                                {/* Kapat Butonu */}
                                <TouchableOpacity
                                    style={styles.imageModalCloseButton}
                                    onPress={() => setImageModalVisible(false)}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: 16
                                        }}
                                    >Kapat</Text>
                                </TouchableOpacity>

                                {/* Resim */}
                                <Image
                                    source={{ uri: imageToZoom }}
                                    style={{
                                        flex: 1,
                                        resizeMode: 'contain',
                                        backgroundColor: 'white'
                                    }}
                                />
                            </View>
                        </Modal>

                        {/* Create Password Modal */}
                        <CreatePasswordModal
                            visible={showCreatePasswordModal}
                            onClose={() => setShowCreatePasswordModal(false)}
                            onSave={(newPassword) => setNotePassword(newPassword)}
                            theme={selectedTheme}
                        />

                        <StatusBar style="light" hidden={false} />

                    </View>
                ) : (
                    (
                        <PasswordModal
                            visible={true}
                            onClose={() => {
                                setPasswordModalVisible(false);
                                navigation.navigate('Home');
                            }}
                            onUnlock={() => setUnlocked(true)}
                            notePassword={notePassword}
                            theme={selectedTheme}
                        />
                    )
                )}

            </ImageBackground >
        </Provider >
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.primaryColor,
        paddingTop: 40,
        flex: 1,
    },

    topNavContainer: {
        flex: 1,
        width: '100%',
        height: 96,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        position: 'absolute',
        top: 48,
        left: 0,
    },
    content: {
        marginTop: 64,
        padding: 16,
        gap: 16
    },
    bottomNavigationBar: {
        flex: 1,
        position: "absolute",
        bottom: 0,
        backgroundColor: 'black',
        paddingRight: 140
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
        color: theme.titleColor,
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

    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 10,
    },

    commonContentButtons: {
        flexDirection: 'row',
        backgroundColor: theme.buttonBg,
        borderRadius: 20,
        overflow: 'hidden',
        width: '100%',
    },

    commonButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.buttonBg,
    },

    commonButtonText: {
        color: theme.buttonText,
        fontSize: 16,
        fontWeight: '600',
    },

    commonDeleteButton: {
        width: 60,
        backgroundColor: theme.errorButtonBg,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        marginLeft: 8,
        borderRadius: 16,
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

    voiceNoteTitle: {
        color: theme.secondaryColor,
        fontSize: 16,
        marginBottom: 10
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

    drawingImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white'
    },

    drawingModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    drawingModalContent: {
        width: '95%',
        height: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },

    imageModalCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
    },
});
