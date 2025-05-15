import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme_context';

export default function NoteBox({ note }) {
    const { currentTheme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.containerBg }]}>
            <Text style={[styles.title, { color: currentTheme.lowerOpacityText }]}>{note.title}</Text>
            <Text style={[styles.text, { color: currentTheme.secondaryColor }]}>{note.text}</Text>
        </View>
    );


};

const styles = StyleSheet.create({
    container: {
        width: 172,
        height: 172,
        padding: 16,
        borderRadius: 16,
        gap: 16,
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    text: {
        fontSize: 14,
    }
});
