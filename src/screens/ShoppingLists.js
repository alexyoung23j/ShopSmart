import React, {useState, isValidElement, useEffect } from 'react';
import { Form, Input, Item, Label, Button, Card, Icon, CheckBox } from 'native-base';
import { StyleSheet, View, Text, KeyboardAvoidingView, TextInput, ImageBackground, Alert } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';

import FloatingTextBox from "../components/FloatingTextBox"
import ErrorShow from "../components/ErrorShow";
import AddListModal from "../components/AddListModal";
import Colors from "../util/Colors";
import Fonts from "../util/Fonts";

import registerUser from "../actions/register";

import firebase, {firestore} from "../db/Firebase";
import { getSupportedVideoFormats } from 'expo/build/AR';
import DismissKeyboard from '../components/DimissKeyboard';
import { set } from 'react-native-reanimated';

export default function ShoppingLists(props) {
    const { navigation } = props;
    const [showAddList, setShowAddList] = useState(false)
    const [newListName, setNewListName] = useState("")
    const [newListID, setNewListID] = useState("")

    var user = firebase.auth().currentUser;
    var name, email, uid;
    if (user != null) {
        name = user.displayName;
        email = user.email;
        uid = user.uid;  
    }


    function addNewList() { 
        setNewListName("testList")  
        firestore.collection("lists").doc(user.uid).collection("user_lists").add({
            listName: newListName,
        }).then(function(docRef) {
            setNewListID(docRef.id)
            console.log("we got here?")
            console.log(docRef.id)
        })    
        setShowAddList(true)  

    }
   
    return (
        <View>
            <View>
                <Button onPress={()=> addNewList()}/>
                <AddListModal listData={[]} listID={newListID} listName={newListName} show={showAddList} onClosePressed={()=>setShowAddList(false)}/> 
                <Text>Hello</Text>
            </View>
        </View>
        
        
    );
}

const styles = StyleSheet.create({
    modal: {
        height: 80,
        marginTop: "70%",
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 20,
        width: "100%",
        flex: 1,
        margin: 0,
    },
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