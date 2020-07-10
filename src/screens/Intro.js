import React, {useState, isValidElement, useEffect } from 'react';
import { Form, Input, Item, Label, Button, Card, Icon } from 'native-base';
import { StyleSheet, View, Text, KeyboardAvoidingView, TextInput, ImageBackground, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import FloatingTextBox from "../components/FloatingTextBox"
import DimissKeyboard from "../components/DimissKeyboard";
import ErrorShow from "../components/ErrorShow";
import Colors from "../util/Colors";
import Fonts from "../util/Fonts";

import registerUser from "../actions/register";

import firebase from "../db/Firebase";



export default function Intro(props) {
    

    const { navigation } = props;


  

    return (
        <DimissKeyboard >
        
                <View>
                    <TouchableOpacity style={{paddingTop: "50%"}} onPress={() => navigation.navigate("ShoppingLists", {
                        showNewUserMessage: true
                    })}>
                        <Text style={styles.button}>sign up</Text>
                    </TouchableOpacity>
                </View>
                
    
        </DimissKeyboard>
        
        
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        backgroundColor: Colors.smoke,
    },
    header: {
        justifyContent: "center",
        paddingLeft: "20%",
        flex: 0.24
    },
    title: {
        color: "#404852",
        fontSize: 45,
        fontFamily: Fonts.default,
        fontWeight: "700",
        letterSpacing: 2,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "17%"
    },
    container: {
        flex: 1,
    },
    form: {
        flex: 0.5, 
        paddingTop: "10%", 
        paddingLeft: "10%", 
        paddingRight: "10%",
        position: 'relative', 
        width: "90%", 
        alignSelf: 'center', 
        alignItems: "center"
    },
    buttonCont: {
        width: "50%",
        backgroundColor: Colors.lightGray,
        flexDirection: "row",
        justifyContent: "center",
    },
    button: {
        fontSize: 17,
        fontFamily: Fonts.default,
        fontWeight: "500",
        alignItems: 'center',
        textAlign: 'center',
        color: Colors.defaultBlack
    },
    error: {
        fontSize: 17,
        fontFamily: Fonts.default,
        fontWeight: "500",
        alignItems: 'center',
        textAlign: 'center',
        color: Colors.indianRed,
    }
});