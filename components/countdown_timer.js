import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = targetDate - new Date();
        if (difference <= 0) return null;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return (
            <View style={styles.container}>
                <Text style={styles.finishedText}>Date is not selected!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.block}>
                <Text style={styles.number}>{timeLeft.days.toString().padStart(2, '0')}</Text>
                <Text style={styles.label}>Day</Text>
            </View>
            <View style={styles.block}>
                <Text style={styles.number}>
                    {timeLeft.hours.toString().padStart(2, '0')}:
                    {timeLeft.minutes.toString().padStart(2, '0')}:
                    {timeLeft.seconds.toString().padStart(2, '0')}
                </Text>
                <Text style={styles.label}>HH:MM:SS</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        marginVertical: 12,
    },
    block: {
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    number: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    label: {
        fontSize: 12,
        color: '#bbb',
        marginTop: 4,
        textTransform: 'uppercase',
    },
    finishedText: {
        fontSize: 24,
        color: '#ff5555',
        fontWeight: 'bold',
    },
});

export default CountdownTimer;
