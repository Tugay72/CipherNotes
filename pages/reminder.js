import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme_context';
import * as Notifications from 'expo-notifications';
import { BackHandler } from 'react-native';

import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DateTimePicker from '@react-native-community/datetimepicker';
import CountdownTimer from '../components/countdown_timer';
import DeleteModal from '../components/delete_modal';


const Reminder = ({ navigation, route }) => {
    const { id, saveReminderByID, deleteReminderByID } = route.params;
    const { currentTheme } = useTheme();

    const [title, setTitle] = useState(route.params?.title || '');
    const [date, setDate] = useState(route.params?.date ? new Date(route.params.date) : new Date());

    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState('date');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(route.params?.theme || currentTheme);

    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', async () => {
            await saveAndGoBack();
            return true;
        });

        return () => backHandler.remove();
    }, [title, date, selectedTheme]);

    const saveAndGoBack = async () => {
        try {
            const saved = await saveReminderByID(id, title, date.toISOString(), selectedTheme);
            if (saved) {
                await scheduleNotification(date, title);
            }
            navigation.navigate('Home', {
                shouldNavigateToReminder: true
            });
        } catch (error) {
            console.error('Error saving reminder:', error);
        }
    };

    const onDeleteInput = async () => {
        await deleteReminderByID(id);
        navigation.navigate('Home', {
            shouldNavigateToReminder: true
        });
    };

    // DateTimePicker event handler
    const onChange = (event, selectedDate) => {
        setShowPicker(Platform.OS === 'ios');
        if (selectedDate) {
            if (pickerMode === 'date') {
                const currentDate = new Date(date);
                currentDate.setFullYear(selectedDate.getFullYear());
                currentDate.setMonth(selectedDate.getMonth());
                currentDate.setDate(selectedDate.getDate());
                setDate(currentDate);

                setPickerMode('time');
                setShowPicker(true);
            } else if (pickerMode === 'time') {
                const currentDate = new Date(date);
                currentDate.setHours(selectedDate.getHours());
                currentDate.setMinutes(selectedDate.getMinutes());
                setDate(currentDate);
            }
        }
    };


    const showDatepicker = () => {
        setPickerMode('date');
        setShowPicker(true);
    };

    async function registerForPushNotificationsAsync() {
        const { status } = await Notifications.getPermissionsAsync();

        let finalStatus = status;
        if (status !== 'granted') {
            const { status: askedStatus } = await Notifications.requestPermissionsAsync();
            finalStatus = askedStatus;
        }

        if (finalStatus !== 'granted') {
            alert('Bildirim izni verilmedi!');
            return false;
        }

        return true;
    }

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });

        return () => subscription.remove();
    }, []);


    async function scheduleNotification(date, title) {
        const trigger = date.getTime() - Date.now();

        console.log('Notification trigger in ms:', trigger);

        if (trigger <= 0) {
            return;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: title || 'Hatırlatıcı',
                body: 'Hatırlatıcı zamanı geldi!',
                sound: 'default',
            },
            trigger: {
                seconds: Math.floor(trigger / 1000),
                repeats: false,
            },
        });

    }

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: selectedTheme.primaryColor
            }]}
        >
            <View style={styles.topNavContainer}>
                <TouchableOpacity onPress={saveAndGoBack}>
                    <MaterialCommunityIcons
                        name="arrow-left-thick"
                        size={24}
                        style={{ color: selectedTheme.secondaryColor }}
                    />
                </TouchableOpacity>

                <View style={{
                    paddingLeft: 16,
                    gap: 24,
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                }}>
                    <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
                        <MaterialCommunityIcons name="delete-outline" size={24} color={selectedTheme.errorColor} />
                    </TouchableOpacity>
                </View>
            </View>

            <TextInput
                placeholder="Title"
                placeholderTextColor={selectedTheme.placeholderText}
                value={title}
                maxLength={60}
                numberOfLines={1}
                onChangeText={setTitle}
                style={[styles.title, { color: selectedTheme.titleColor }]}
            />

            <View style={styles.reminderSection}>
                <CountdownTimer
                    targetDate={date}
                    style={{
                        fontSize: 32,
                        color: selectedTheme.secondaryColor,
                        fontWeight: 'bold'
                    }}
                />

                <View>
                    <TouchableOpacity
                        onPress={showDatepicker}
                        style={[
                            styles.dateButton,
                            {
                                backgroundColor: selectedTheme.buttonBg
                            }]}
                    >
                        <Text
                            style={{
                                color: selectedTheme.buttonText
                            }}
                        >Select Date & Time</Text>
                    </TouchableOpacity>

                    {showPicker && (
                        <DateTimePicker
                            value={date}
                            mode={pickerMode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )}

                    <TouchableOpacity
                        onPress={saveAndGoBack}
                        style={{
                            marginTop: 16,
                            backgroundColor: selectedTheme.secondaryColor,
                            padding: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: selectedTheme.primaryColor,
                                fontWeight: 'bold'
                            }}>Save Reminder</Text>
                    </TouchableOpacity>
                </View>




            </View>

            <DeleteModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                currentTheme={currentTheme}
                onDeleteInput={onDeleteInput}
                message={"Are you sure you want to delete this note?"}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        paddingTop: 48,
        flex: 1,
    },
    topNavContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        position: 'absolute',
        top: 48,
        left: 8,
        right: 8,
        height: 56,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginTop: 64,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    reminderSection: {
        marginTop: 20,
        height: '78%',
        justifyContent: 'space-between'
    },
    dateButton: {

        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
});

export default Reminder;
