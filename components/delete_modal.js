import { StyleSheet, Modal, View, Text, TouchableOpacity } from "react-native";
import { useMemo } from "react";

export default function DeleteModal({
    showDeleteModal,
    setShowDeleteModal,
    currentTheme,
    onDeleteInput,
    message = 'Are you sure?'
}) {
    const styles = useMemo(() => getStyles(currentTheme), [currentTheme]);

    return (
        <Modal
            visible={showDeleteModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowDeleteModal(false)}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>Sil</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            onPress={() => setShowDeleteModal(false)}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>İptal</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                onDeleteInput();
                                setShowDeleteModal(false);
                            }}
                            style={styles.deleteButton}
                        >
                            <Text style={styles.deleteButtonText}>Sil</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
};

const getStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    content: {
        backgroundColor: theme.containerBg,
        padding: 24,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: theme.secondaryColor,
    },

    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        color: '#ff5151',
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },

    cancelButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 6,
        alignItems: 'center',
        backgroundColor: '#ccc',
    },

    cancelButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },

    deleteButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 6,
        alignItems: 'center',
        backgroundColor: '#d32f2f',
    },

    deleteButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
    },
});
