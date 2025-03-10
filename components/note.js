import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Note({ route, note }) {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.text}>{note.text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 172,
        height: 172,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#1a1a1a',
        gap: 16,
    },

    title: {
        color: '#2995D9',
        fontSize: 16,
        fontWeight: 'bold',
    },

    text: {
        fontSize: 14,
        color: '#F2F2F2'
    }
})