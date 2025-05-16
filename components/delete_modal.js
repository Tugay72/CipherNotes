import { StyleSheet, Modal, View, Text, TouchableOpacity } from "react-native";

export default function DeleteModal({
    showDeleteModal,
    setShowDeleteModal,
    currentTheme,
    onDeleteInput,
    message = 'Are you sure?'
}) {

    return (
        <Modal
            visible={showDeleteModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowDeleteModal(false)}
        >
            <View style={styles.deleteModalOverlay}>
                <View style={[styles.deleteModalContent, { backgroundColor: currentTheme.containerBg }]}>
                    <Text style={[styles.deleteModalTitle, { color: currentTheme.secondaryColor }]}>Delete Note</Text>
                    <Text style={[styles.deleteModalText, { color: '#ff5151' }]}>{message}</Text>

                    <View style={styles.deleteModalButtons}>
                        <TouchableOpacity
                            onPress={() => setShowDeleteModal(false)}
                            style={[styles.deleteModalButton, { backgroundColor: '#ccc' }]}
                        >
                            <Text style={styles.deleteModalButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                onDeleteInput();
                                setShowDeleteModal(false);
                            }}
                            style={[styles.deleteModalButton, { backgroundColor: '#d32f2f' }]}
                        >
                            <Text style={[styles.deleteModalButtonText, { color: '#fff' }]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    deleteModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    deleteModalContent: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',
    },

    deleteModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },

    deleteModalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        color: '#555',
    },

    deleteModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },

    deleteModalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 6,
        alignItems: 'center',
    },

    deleteModalButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },

})