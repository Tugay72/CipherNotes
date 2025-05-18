import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import Slider from '@react-native-community/slider';

export default function StylingModal({
    stylizeVisible,
    setStylizeVisible,
    fontSize,
    setFontSize,
    bgImage,
    setBgImage,
    bgColor,
    setBgColor,
    selectedTheme,
    setSelectedTheme,
    applyTheme,
    themes,
}) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={stylizeVisible}
            onRequestClose={() => setStylizeVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Stylize Note</Text>

                    {/* Font Size */}
                    <Text style={styles.modalLabel}>Font Size</Text>
                    <View style={styles.optionRow}>
                        <Text style={{ color: '#aaa', marginBottom: 8 }}>{fontSize}</Text>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={8}
                            maximumValue={32}
                            step={1}
                            minimumTrackTintColor="#888"
                            maximumTrackTintColor="#444"
                            thumbTintColor="#ddd"
                            value={fontSize}
                            onValueChange={setFontSize}
                        />
                    </View>

                    {/* Background Color */}
                    <Text style={styles.modalLabel}>Background Color</Text>
                    <View style={styles.optionRow}>
                        {['#000000', '#ffffff'].map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorBox,
                                    { backgroundColor: color },
                                    bgColor === color && !bgImage && styles.colorSelected
                                ]}
                                onPress={() => {
                                    setBgColor(color);
                                    setBgImage(null);
                                }}
                            />
                        ))}
                    </View>

                    {/* Theme Selection */}
                    <Text style={styles.modalLabel}>Choose a Theme</Text>
                    <View style={styles.optionRow}>
                        {themes.map((theme) => (
                            <TouchableOpacity
                                key={theme.name}
                                style={[
                                    styles.colorBox,
                                    { backgroundColor: theme.primaryColor },
                                    selectedTheme === theme.name && styles.colorBoxSelected
                                ]}
                                onPress={() => {
                                    applyTheme(theme);
                                    setSelectedTheme(theme);
                                }}
                            >
                                <View
                                    style={[styles.secondaryDot, { backgroundColor: theme.secondaryColor }]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setStylizeVisible(false)}
                    >
                        <Text style={{ color: 'white' }}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalContainer: {
        backgroundColor: '#1a1a1a',
        padding: 20,
        borderRadius: 12,
        width: '90%',
        height: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    modalLabel: {
        color: '#ccc',
        marginTop: 10,
        marginBottom: 4,
    },
    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    optionButton: {
        backgroundColor: '#333',
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        borderRadius: 6,
    },
    colorBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        margin: 8,
        borderWidth: 2,
        borderColor: 'none',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 4,
    },
    colorSelected: {
        borderWidth: 2,
        borderColor: '#fff',
    },
    colorBoxSelected: {
        borderColor: '#ffffff',
        borderWidth: 3,
    },
    modalCloseButton: {
        marginTop: 16,
        alignSelf: 'flex-end',
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    secondaryDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00000033',
    },
});
