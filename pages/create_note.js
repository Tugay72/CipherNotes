import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";


export default function CreateNote({ navigation }) {

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

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

    return (
        <View style={styles.container}>

            {/* Top Navigation */}
            <View style={styles.topNavContainer}>
                <TouchableOpacity style={styles.createNoteButton} onPress={goBack}>
                    <Text style={styles.buttonText}>☚</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createNoteButton} onPress={saveNote}>
                    <Text style={styles.buttonText}>✔</Text>
                </TouchableOpacity>
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
                    style={
                        styles.titleInput
                    }>

                </TextInput>
                <View style={styles.infoBox}>
                    <Text style={{ color: '#2a2a2a' }}>Last edit: {time + '  ' + date}</Text>
                    <Text style={{ color: '#2a2a2a' }}>Characters: {text.length} / 60</Text>
                </View>


                <TextInput /* Note text */
                    placeholder="Start typing..."
                    placeholderTextColor='#3a3a3a'
                    value={text}
                    maxLength={6000}
                    onChangeText={setText}
                    style={
                        styles.textInput
                    }>

                </TextInput>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        paddingTop: 16,
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
        top: 0,
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

        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'white',
        borderRadius: 12
    },

    title: {
        color: '#2995D9',
        fontSize: 16,
        fontWeight: 'bold',
    },

    titleInput: {
        width: '100%',
        color: '#eaeaea',
        fontSize: 24,
        padding: 0,
        margin: 0
    },

    textInput: {
        width: '100%',
        color: '#eaeaea',
        fontSize: 16,
        padding: 0,
        margin: 0,
        left: 0
    },

    text: {
        fontSize: 14,
        color: '#F2F2F2',
    },

    exitButton: {
    },

    saveButton: {
        // Button styles go here
    },

    buttonText: {
        color: 'white',
        fontSize: 24,
    }
});
