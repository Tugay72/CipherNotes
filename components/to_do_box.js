import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme_context';

export default function ToDoBox({ toDo }) {
    const { currentTheme } = useTheme();

    const savedTheme = toDo.theme

    return (
        <View style={[styles.container, { backgroundColor: savedTheme?.containerBg ?? currentTheme.containerBg }]}>
            <Text style={[styles.title, { color: savedTheme?.titleColor ?? currentTheme.titleColor }]}>
                {toDo.title}
            </Text>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        width: 360,
        height: 56,
        padding: 16,
        borderRadius: 16,
        gap: 16,
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
