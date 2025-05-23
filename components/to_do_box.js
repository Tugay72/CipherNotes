import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme_context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ToDoBox({ toDo }) {
    const { currentTheme } = useTheme();
    const savedTheme = toDo.theme;
    const isEncrypted = toDo.notePassword && toDo.notePassword.length > 0;

    return (
        <View style={[styles.container, { backgroundColor: savedTheme?.containerBg ?? currentTheme.containerBg }]}>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: savedTheme?.titleColor ?? currentTheme.titleColor }]}>
                    {toDo.title}
                </Text>
                {isEncrypted && (
                    <MaterialCommunityIcons 
                        name="lock" 
                        size={20} 
                        color={savedTheme?.secondaryColor ?? currentTheme.secondaryColor} 
                        style={styles.lockIcon}
                    />
                )}
            </View>
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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lockIcon: {
        marginLeft: 4,
    }
});
