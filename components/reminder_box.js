import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme_context';

export default function ReminderBox({ reminder }) {
    const { currentTheme } = useTheme();

    const savedTheme = reminder.theme;
    const dateObj = new Date(reminder.date);

    console.log(dateObj)
    return (
        <View style={[styles.container, { backgroundColor: savedTheme?.containerBg ?? currentTheme.containerBg }]}>
            <Text style={[styles.title, { color: savedTheme?.titleColor ?? currentTheme.titleColor }]}>
                {reminder.title}
            </Text>
            <Text style={[styles.title, { color: savedTheme?.secondaryColor ?? currentTheme.secondaryColor }]}>
                {dateObj.getFullYear()}-{(dateObj.getMonth() + 1).toString().padStart(2, '0')}-{dateObj.getDate().toString().padStart(2, '0')} {' '}
                {dateObj.getHours().toString().padStart(2, '0')}:{dateObj.getMinutes().toString().padStart(2, '0')}
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 360,
        height: 96,
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
