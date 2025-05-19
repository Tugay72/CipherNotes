import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';

import { useTheme } from '../theme_context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import DeleteModal from '../components/delete_modal';

const Reminder = ({ navigation, route }) => {
    const { id, saveReminderByID, deleteReminderByID } = route.params;
    const { currentTheme } = useTheme();

    const [title, setTitle] = useState(route.params?.title || '');
    const [date, setDate] = useState(route.params?.date ? new Date(route.params.date) : new Date());

    // showMode = 'date' or 'time'
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState('date');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(route.params?.theme || currentTheme);

    const goBack = async () => {
        saveReminderByID(id, title, date.toISOString(), selectedTheme);
        navigation.navigate('Home');
    };

    const onDeleteInput = async () => {
        await deleteReminderByID(id);
        navigation.navigate('Home');
    };

    // DateTimePicker event handler
    const onChange = (event, selectedDate) => {
        setShowPicker(Platform.OS === 'ios'); // On iOS keep picker open, on Android close after selection
        if (selectedDate) {
            if (pickerMode === 'date') {
                // Set date part, keep current time
                const currentDate = new Date(date);
                currentDate.setFullYear(selectedDate.getFullYear());
                currentDate.setMonth(selectedDate.getMonth());
                currentDate.setDate(selectedDate.getDate());
                setDate(currentDate);

                // Show time picker next
                setPickerMode('time');
                setShowPicker(true);
            } else if (pickerMode === 'time') {
                // Set time part, keep current date
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

    return (
        <View style={[styles.container, { backgroundColor: selectedTheme.primaryColor }]}>
            <View style={styles.topNavContainer}>
                <TouchableOpacity onPress={goBack}>
                    <MaterialCommunityIcons
                        name="arrow-left-thick"
                        size={24}
                        style={{ color: selectedTheme.secondaryColor }}
                    />
                </TouchableOpacity>

                <View style={{ paddingLeft: 16, gap: 24, flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                <View style={{ gap: 24 }}>
                    <Text style={
                        {
                            alignSelf: 'center',
                            fontSize: 32,
                            color: selectedTheme.secondaryColor

                        }}>
                        {date.toLocaleString()}
                    </Text>

                    <TouchableOpacity
                        onPress={showDatepicker}
                        style={[styles.dateButton, { backgroundColor: selectedTheme.buttonBg }]}
                    >
                        <Text style={{ color: selectedTheme.secondaryColor }}>Select Date & Time</Text>
                    </TouchableOpacity>
                </View>



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
                    onPress={goBack}
                    style={{
                        marginTop: 24,
                        backgroundColor: selectedTheme.secondaryColor,
                        padding: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: selectedTheme.primaryColor, fontWeight: 'bold' }}>Save Reminder</Text>
                </TouchableOpacity>
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
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
});

export default Reminder;
