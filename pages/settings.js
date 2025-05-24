import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme_context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ChangePasswordModal from '../components/change_password';
import DeleteModal from '../components/delete_modal';


// ... importlar aynı

export default function SettingsScreen({ navigation }) {
    const { currentTheme, toggleTheme, isDarkTheme } = useTheme();
    const [isChangePasswordModalVisible, setChangePasswordModalVisible] = React.useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const toggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    const clearData = async () => {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            Alert.alert('Hata', 'Veriler temizlenemedi.');
        }
    };

    const onDeleteInput = async () => {
        clearData()
    }

    const styles = getStyles(currentTheme);

    return (
        <View style={styles.container}>
            <StatusBar style={isDarkTheme ? 'light' : 'dark'} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons
                        name="arrow-back-ios-new"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Ayarlar</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Account */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hesap</Text>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => setChangePasswordModalVisible(true)}
                    >
                        <Text style={styles.optionText}>Şifre Değiştir</Text>
                    </TouchableOpacity>


                </View>

                {/* App Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Uygulama Ayarları</Text>

                    <View style={styles.switchRow}>
                        <Text style={styles.optionText}>Bildirimleri etkinleştir</Text>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={toggleNotifications}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.optionText}>Karanlık tema</Text>
                        <Switch
                            value={isDarkTheme}
                            onValueChange={toggleTheme}
                        />
                    </View>
                </View>

                {/* Storage */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Depolama</Text>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => setShowDeleteModal(true)}
                    >
                        <Text style={[styles.optionText, { color: 'red' }]}>
                            Tüm verileri sil
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.optionText}>Version: v0.6</Text>
                    <Text style={styles.optionText}>Developer: @</Text>
                </View>
            </ScrollView>

            <ChangePasswordModal
                visible={isChangePasswordModalVisible}
                onClose={() => setChangePasswordModalVisible(false)}
            />

            {/* Delete Note Modal */}
            <DeleteModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                currentTheme={currentTheme}
                onDeleteInput={onDeleteInput}
                message={'Are you sure you want to clear all data!'}
            ></DeleteModal>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.primaryColor,
    },
    header: {
        height: 72,
        marginTop: 16,
        paddingTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: theme.primaryColor,
    },
    backButton: {
        paddingHorizontal: 4,
        paddingVertical: 14,
    },
    backIcon: {
        color: theme.secondaryColor,
        fontSize: 24,
        fontWeight: '900',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.secondaryColor,
        marginLeft: 8,
    },
    content: {
        padding: 16,
        gap: 32,
    },
    section: {
        backgroundColor: theme.containerBg,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.secondaryColor,
        marginBottom: 16,
    },
    option: {
        paddingVertical: 12,
    },
    optionText: {
        color: theme.secondaryColor,
        fontSize: 15,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,

    },
});
