import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Audio } from 'expo-av';

const VoiceNote = ({ onVoiceRecorded }) => {
    const [recording, setRecording] = useState(null);
    const [recordedUri, setRecordedUri] = useState(null);
    const [sound, setSound] = useState(null);

    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to use microphone is required!');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
        } catch (err) {
            console.error('Failed to start recording:', err);
        }
    };

    const stopRecording = async () => {
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecordedUri(uri);
            setRecording(null);

            if (onVoiceRecorded) {
                onVoiceRecorded(uri)
            }


        } catch (err) {
            console.error('Failed to stop recording:', err);
        }
    };

    return (

        <View style={styles.container}>
            <Text style={styles.header}>Voice Note Recorder</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#ff5934' }]}
                    onPress={recording ? stopRecording : startRecording}
                >
                    <Text style={styles.buttonText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
                </TouchableOpacity>

            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        top: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    buttonsContainer: {
        gap: 8,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    button: {
        width: '80%',
        padding: 12,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default VoiceNote;

