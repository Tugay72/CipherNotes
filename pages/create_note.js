import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function CreateNote({ navigation }) {

    const goBack = () => {
        navigation.navigate('Home');
    }

    const saveNote = () => {
        navigation.navigate('Home');
    }

    return (
        <View style={styles.container}>

            {/* Top Navigation */}
            <View style={styles.topNavContainer}>
                <TouchableOpacity style={styles.createNoteButton} onPress={goBack}>
                    <Text style={styles.buttonText}>⬅</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createNoteButton} onPress={saveNote}>
                    <Text style={styles.buttonText}>✔</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.text}>Aaaaaa</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        paddingTop: 16,
        flex: 1,
    },

    topNavContainer: {
        width: '100%',
        height: 64,

        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'black',
        position: 'absolute',
        top: 0,
        left: 0,

    },

    content: {
        flex: 1,
        marginTop: 48,
        padding: 16,

    },

    title: {
        color: '#2995D9',
        fontSize: 16,
        fontWeight: 'bold',
    },

    text: {
        fontSize: 14,
        color: '#F2F2F2',
    },

    exitButton: {
    },

    saveButton: {
        // Button styles go here
    },

    buttonText: {
        color: 'white',
        fontSize: 24,
    }
});
