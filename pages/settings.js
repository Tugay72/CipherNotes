import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';

import theme from '../theme';

export default function Settings({ navigation }) {


    return (
        <View style={styles.container}>

            {/* Top Navigation */}
            <View style={styles.topNavContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonText}>☚</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.content}>
                <Text style={styles.text}>aaaaa</Text>
            </View>

            <StatusBar style='auto' hidden={false} />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        paddingTop: 16,
        flex: 1,
    },

    topNavContainer: {
        width: '100%',
        height: 72,

        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'black',
        left: 0,

    },

    content: {
        flex: 1,
        marginTop: 48,
        padding: 16,
        gap: 16,
    },

    text: {
        fontSize: 16,
        color: theme.secondaryColor,
    },

    buttonText: {
        color: theme.secondaryColor,
        fontSize: 32,
        fontWeight: 'bold',
    },



});