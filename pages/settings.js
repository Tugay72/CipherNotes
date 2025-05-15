import React from 'react';
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


// ... importlar aynı

export default function SettingsScreen({ navigation }) {
    const { currentTheme, toggleTheme, isDarkTheme } = useTheme();
    const [isChangePasswordModalVisible, setChangePasswordModalVisible] = React.useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    const toggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    const clearData = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert('Başarılı', 'Tüm veriler temizlendi.');
        } catch (e) {
            Alert.alert('Hata', 'Veriler temizlenemedi.');
        }
    };

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

                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Account */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => setChangePasswordModalVisible(true)}
                    >
                        <Text style={styles.optionText}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => Alert.alert('Signed Out', 'You have been logged out.')}
                    >
                        <Text style={styles.optionText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>

                {/* App Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>

                    <View style={styles.switchRow}>
                        <Text style={styles.optionText}>Enable Notifications</Text>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={toggleNotifications}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.optionText}>Dark Theme</Text>
                        <Switch
                            value={isDarkTheme}
                            onValueChange={toggleTheme}
                        />
                    </View>
                </View>

                {/* Storage */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Storage</Text>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={clearData}
                    >
                        <Text style={[styles.optionText, { color: 'red' }]}>
                            Clear All Data
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.optionText}>Version: 1.0.0</Text>
                    <Text style={styles.optionText}>Developer: You 😎</Text>
                </View>
            </ScrollView>

            <ChangePasswordModal
                visible={isChangePasswordModalVisible}
                onClose={() => setChangePasswordModalVisible(false)}
            />
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: theme.primaryColor,
        borderBottomWidth: 1,
        borderBottomColor: theme.containerBg,
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
        marginBottom: 12,
    },
    option: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    optionText: {
        color: theme.secondaryColor,
        fontSize: 15,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
});
