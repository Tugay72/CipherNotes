import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';

const fontFamilies = [
    'system',
    'monospace',
    'sans-serif',
    'serif',
    'Roboto',
    'normal',
];


export default function StylingModal({
    stylizeVisible,
    setStylizeVisible,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    bgImage,
    setBgImage,
    bgColor,
    setBgColor,
    selectedTheme,
    setSelectedTheme,
    applyTheme,
    themes,
}) {
    const [fontMenuOpen, setFontMenuOpen] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={stylizeVisible}
            onRequestClose={() => setStylizeVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Styles</Text>

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

                    <Text style={styles.modalLabel}>Font Family</Text>
                    <View style={[styles.dropdownContainer, { zIndex: 101 }]}>
                        {/* Selected Font (toggle dropdown) */}
                        <TouchableOpacity
                            style={styles.selectedFontBox}
                            onPress={() => setFontMenuOpen((prev) => !prev)}
                        >
                            <Text style={[styles.selectedFontText, { fontFamily }]}>
                                {fontFamily}
                            </Text>
                        </TouchableOpacity>

                        {/* Font Options (dropdown) */}
                        {fontMenuOpen && (
                            <ScrollView style={styles.dropdownMenu} showsVerticalScrollIndicator={false}>
                                {fontFamilies.map((font) => (
                                    <TouchableOpacity
                                        key={font}
                                        style={[
                                            styles.fontOptionBox,
                                            fontFamily === font && styles.fontOptionSelected
                                        ]}
                                        onPress={() => {
                                            setFontFamily(font);
                                            setFontMenuOpen(false);
                                        }}
                                    >
                                        <Text style={[styles.fontSampleText, { fontFamily: font }]}>
                                            {font}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>



                    {/* Theme Selection */}
                    <Text style={styles.modalLabel}>Theme</Text>
                    <View style={styles.dropdownContainer}>
                        {/* Selected Theme (toggle dropdown) */}
                        <TouchableOpacity
                            style={[
                                styles.selectedThemeBox,
                                { backgroundColor: themes ? themes.find(t => t === selectedTheme)?.primaryColor : 'black' }
                            ]}
                            onPress={() => setThemeMenuOpen(prev => !prev)}
                        >
                            <View
                                style={[
                                    styles.secondaryDot,
                                    { backgroundColor: themes ? themes.find(t => t === selectedTheme)?.secondaryColor : 'white' }
                                ]}
                            />
                        </TouchableOpacity>

                        {/* Theme Options (dropdown) */}
                        {themeMenuOpen && (
                            <ScrollView style={[styles.dropdownMenu, { backgroundColor: '#2a2a2a', padding: 8 }]} showsVerticalScrollIndicator={false}>
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
                                            setThemeMenuOpen(false);
                                        }}
                                    >
                                        <View
                                            style={[styles.secondaryDot, { backgroundColor: theme.secondaryColor }]}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>


                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setStylizeVisible(false)}
                    >
                        <Text style={{ color: 'white' }}>OK</Text>
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
        overflow: 'visible',
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
        marginBottom: 8,
    },
    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    modalCloseButton: {
        marginTop: 164,
        alignSelf: 'flex-end',
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },

    // Dropdown system
    dropdownContainer: {
        marginBottom: 16,
        position: 'relative',
        zIndex: 10,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 58,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        maxHeight: 200,
        paddingVertical: 4,
        zIndex: 100,
    },

    // Font dropdown
    selectedFontBox: {
        padding: 12,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
    selectedFontText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#000',
    },
    fontOptionBox: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    fontOptionSelected: {
        backgroundColor: '#ddd',
        borderRadius: 8,
    },
    fontSampleText: {
        fontSize: 16,
        color: '#000',
    },

    // Theme dropdown
    selectedThemeBox: {
        padding: 20,
        backgroundColor: '#eee',
        borderRadius: 8,
        alignItems: 'center'
    },
    secondaryDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'white',
    },
    colorBox: {
        width: '100%',
        height: 32,
        marginVertical: 4,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorBoxSelected: {
        borderWidth: 2,
        borderColor: '#000',
    },
});

