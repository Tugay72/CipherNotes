import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=<>?/';

export default function EncryptedText({ text = 'Veri Şifreleniyor...', speed = 500 }) {
    const [displayed, setDisplayed] = useState(text);

    useEffect(() => {
        let frame = 0;
        const interval = setInterval(() => {
            const newText = text.split('').map((char, index) => {
                if (Math.random() < 0.5) {
                    return characters[Math.floor(Math.random() * characters.length)];
                } else {
                    return char;
                }
            }).join('');

            setDisplayed(newText);
            frame++;
        }, speed);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{displayed}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: 'monospace',
        letterSpacing: 1.2,
    },
});
