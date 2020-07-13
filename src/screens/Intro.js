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
import { Polygon } from 'react-native-svg';



export default function Intro(props) {
    
    const [showCount, setShowCount] = useState(0)
    const [moveOn, setMoveOn] = useState(false)
    const { navigation } = props;

    function empty() {
        return (
            <View></View>
        )
    }

    function update() {
        setShowCount(showCount+1)
        if (showCount > 1) {
            setMoveOn(true)
        } 
    }

    


    function part1() {
        return (
            <View style={{marginTop: 0, justifyContent: "center", alignItems: "center", }}>
                <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "100", paddingTop: 30, fontSize: 20, marginLeft: 0 }}>We save you time and energy</Text>
                <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "100", paddingTop: 10, fontSize: 20, marginLeft: 0 }}>at the store by simplifying</Text>
                <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "100", paddingTop: 10, fontSize: 20, marginLeft: 0 }}>the process of navigating.</Text>

            </View>
        )
    }

    function part2() {
        return (
            <View style={{marginTop: 45, justifyContent: "center", alignItems: "center", paddingTop: 0}}>
                <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "100", paddingTop: 0, fontSize: 20, marginLeft: 0 }}>By adopting a heuristic</Text>
                <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "100", paddingTop: 10, fontSize: 20, marginLeft: 0 }}>approach to the Traveling </Text>
                <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "100", paddingTop: 10, fontSize: 20, marginLeft: 0 }}>Salesman Problem, ShopSmart</Text>
                <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "100", paddingTop: 10, fontSize: 20, marginLeft: 0 }}>calculates the fastest route</Text>
                <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "100", paddingTop: 10, fontSize: 20, marginLeft: 0 }}>through a store while ensuring</Text>
                <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "100", paddingTop: 10, fontSize: 20, marginLeft: 0 }}>you find everything on your list.</Text>

            </View>
        )
    }

    function part3() {
        return (
            <View style={{marginTop: 45, justifyContent: "center", alignItems: "center", paddingTop: 0}}>
                <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "100", paddingTop: 10, fontSize: 20, marginLeft: 0 }}>We hope you enjoy!</Text>
                

            </View>
        )
    }

    function button() {
        if (moveOn == false) {
            return (
                <View style={{position: "absolute", marginTop: 600}}>
                    <TouchableOpacity onPress={() => update()}>
                        <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "100", fontStyle: "italic", paddingTop: 10, fontSize: 15, marginLeft: 0 }}>next</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{position: "absolute", marginTop: 600}}>
                    <TouchableOpacity onPress={() => navigation.navigate("ShoppingLists", 
                    {showNewUserMessage: true})}>
                        <Text style={{fontFamily: Fonts.default, width: "100%" ,fontWeight: "400", fontStyle: "italic", color: Colors.green, paddingTop: 10, fontSize: 15, marginLeft: 0 }}>get started</Text>
                    </TouchableOpacity>
                </View>
            )
            
        }
    }
  

    return (
        <DimissKeyboard >
                <View style={{flex:1, justifyContent: "flex-start", alignItems: "center"}}>
                    <Text style={{fontFamily: Fonts.default, fontWeight: "500", fontSize: 30, marginTop:45 }}>Welcome to ShopSmart</Text>

                    {showCount > 0 ? part1() : empty()}
                    {showCount > 1 ? part2() : empty()}
                    {showCount > 2 ? part3() : empty()}

                    {button()}
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