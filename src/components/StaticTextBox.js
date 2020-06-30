import React from 'react';
import { TextInput, Text, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import Colors from "../util/Colors";
import Fonts from "../util/Fonts";
import Icon from 'react-native-vector-icons/Ionicons';


export default function StaticTextBox({secure, text, placeholder, onChange, onEndEditing, error="", onPress}) {
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
            <View style={{flex:.15, justifyContent: "center"}}>
                <TouchableOpacity onPress={onPress}>
                    <Icon name={"ios-add"} size={40} color={Colors.defaultBlack} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

let { height, width } = Dimensions.get('window');


const styles = StyleSheet.create({
    TextField: {
        fontSize: 16, 
        flex:1,
        marginHorizontal: 20,
        fontFamily: Fonts.default,
    },
    TextFieldView: {
        justifyContent: "center",
        alignContent: "center",
        height: height*.07,
        width: width *.85,
        borderRadius: 20,
        backgroundColor: Colors.smoke,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 0.5,
        flexDirection: "row"

    }
})

