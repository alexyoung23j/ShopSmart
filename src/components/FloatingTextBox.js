import React from 'react';
import { TextInput, Text, StyleSheet, View } from 'react-native';
import Colors from "../util/Colors";
import Fonts from "../util/Fonts";


export default function FloatingTextBox({secure, text, placeholder, onChange, onEndEditing, error=""}) {
    return (
        <View style={styles.TextFieldView}>
            <TextInput
                secureTextEntry = {secure}
                autoCorrect = {false}
                style={styles.TextField}
                placeholder={placeholder}
                value = {text}
                onChangeText = {onChange}
                onEndEditing = {onEndEditing}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    TextField: {
        fontSize: 16, 
        flex:1,
        marginHorizontal: 20,
        fontFamily: Fonts.default
    },
    TextFieldView: {
        justifyContent: "center",
        alignContent: "center",
        height: "27%",
        width: "95%",
        borderRadius: 20,
        marginTop: 5,
        backgroundColor: Colors.smoke,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 0.5,
        justifyContent: "center"
    }
})

