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



export default function Login(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passError, setPassError] = useState("");
    const [nameError, setNameError] = useState("");

    const { navigation } = props;


    const isPassValid = (password) => {
        let length = password.trim().length;
        return length > 5 ? true : false;
    }

    const isNameValid = (name) => {
        let length = name.trim().length;
        return length > 3 ? true : false;
    }

    const isEmailValid = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return expression.test(String(email).toLowerCase())
    }

    const checkErrors = () => {
        isEmailValid(email) ? setEmailError("") : setEmailError("enter a valid email")
        isPassValid(password) ? setPassError("")  : setPassError("password must be 6 characters or longer")

        if (isEmailValid(email) && isPassValid(password)) {
            return true
        } else {
            return false
        }

    }

    const onSubmit = (event) => {
        event.preventDefault();
        let noErrors = checkErrors();

        if (noErrors) {
            firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
                navigation.navigate("ShoppingLists", {
                    showNewUserMessage: false
                })
            }
            ).catch(error =>{
                Alert.alert(error.message);
            })

        }
    }


    return (
        <DimissKeyboard >
            <View style={styles.imageContainer}>
            <KeyboardAvoidingView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Log In</Text>
                </View>
                <View style={styles.form}>
                    <FloatingTextBox 
                        placeholder = {"email"}
                        value = {email}
                        onChange = {(email) => setEmail(email)}
                    />
                    <FloatingTextBox 
                        placeholder = {"password"}
                        secure = {true}
                        value = {password}
                        onChange = {(password) => setPass(password)}
                    />
                </View>
                <ErrorShow style={styles.error} errors={[nameError, emailError, passError]}/>
                <View style={{paddingTop: "0%"}}>
                    <View style={{alignItems: 'center', width: "100%", position: 'relative'}}>
                        <View style={{alignItems: 'center', position: 'relative', width: "100%"}}>
                            <Button rounded outline style={styles.buttonCont} onPress={(event) => onSubmit(event)} >
                                <Text style={styles.button}>Login</Text>
                            </Button>
                        </View>
                    </View>
                </View>
                <View>
                    <TouchableOpacity style={{paddingTop: "5%"}}onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.button}>sign up</Text>
                    </TouchableOpacity>
                </View>
                
            </KeyboardAvoidingView>
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
        flex: 0.4, 
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