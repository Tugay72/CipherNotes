import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import theme from '../theme';

export default function NoteBox({ route, note }) {

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
        backgroundColor: theme.containerBg,
        gap: 16,
    },

    title: {
        color: theme.lowerOpacityText,
        fontSize: 16,
        fontWeight: 'bold',
    },

    text: {
        fontSize: 14,
        color: theme.secondaryColor
    }
})