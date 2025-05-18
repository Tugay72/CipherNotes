import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme_context';

export default function ToDoBox({ toDo }) {
    const { currentTheme } = useTheme();
    const contentBlocks = toDo.contentJSON || [];

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.containerBg }]}>
            <Text style={[styles.title, { color: currentTheme.titleColor }]}>
                {toDo.title}
            </Text>
            <Text style={[styles.text, { color: currentTheme.secondaryColor }]}>
                {contentBlocks.length > 0 ? contentBlocks[0].content || '' : ''}
            </Text>
        </View>
    );
}



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
