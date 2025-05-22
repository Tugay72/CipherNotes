import Signature from 'react-native-signature-canvas';
import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const DrawingCanvas = ({ onSave, onCancel }) => {
    const ref = useRef();

    const handleOK = (signature) => {
        onSave(signature);
    };

    const handleClear = () => {
        ref.current.clearSignature();
    };

    const handleSave = () => {
        ref.current.readSignature();
    };

    return (
        <View style={{ flex: 1 }}>
            <Signature
                ref={ref}
                onOK={handleOK}
                onEmpty={() => console.log("Boş çizim")}
                webStyle={`
                    .m-signature-pad--footer { display: none; }
                    body,html { margin:0; padding:0; }
                `}
                autoClear={false}
            />

            {/* Alt Butonlar */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={handleClear}>
                    <Text style={styles.buttonText}>Temizle</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={onCancel}>
                    <Text style={styles.buttonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={handleSave}>
                    <Text style={[styles.buttonText, { color: '#fff' }]}>Kaydet</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 12,
        backgroundColor: '#f0f0f0',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default DrawingCanvas;
