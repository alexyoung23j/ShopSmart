import React, {useState, isValidElement, useEffect } from 'react';
import { Form, Input, Item, Label, Button, Card, CheckBox } from 'native-base';
import { StyleSheet, View, Text, Dimensions, KeyboardAvoidingView, TextInput, ImageBackground, Alert, FlatList } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';


import FloatingTextBox from "../components/FloatingTextBox"
import ErrorShow from "../components/ErrorShow";
import ListModal from "../components/ListModal";
import Colors from "../util/Colors";
import Fonts from "../util/Fonts";

import registerUser from "../actions/register";

import firebase, {firestore} from "../db/Firebase";
import { getSupportedVideoFormats } from 'expo/build/AR';
import DismissKeyboard from '../components/DimissKeyboard';
import { set } from 'react-native-reanimated';

export default function ShoppingLists(props) {

    var user = firebase.auth().currentUser;
    var name, email, uid;
    if (user != null) {
        name = user.displayName;
        email = user.email;
        uid = user.uid;  
    }


    const { navigation } = props;
    const [showAddList, setShowAddList] = useState(false)
    const [currentListName, setCurrentListName] = useState("")
    const [newListID, setNewListID] = useState("")
    const [editListName, setEditListName] = useState(false)

    const [userLists, setUserLists] = useState([])

    var user = firebase.auth().currentUser;
    var name, email, uid;
    if (user != null) {
        name = user.displayName;
        email = user.email;
        uid = user.uid;  
    }

    function grabUserLists() {

        const listRef = firestore.collection("lists").doc(user.uid).collection("user_lists").get().then(
            (snapshot) => {
                snapshot.forEach(doc => {
                    console.log(doc.listName)
                })
            }
        );
        

     
    }

    useEffect(() => {
        grabUserLists()
    }, [])


    function addNewList() { 
        firestore.collection("lists").doc(user.uid).collection("user_lists").add({
            listName: "",
        }).then(function(docRef) {
            setNewListID(docRef.id)
        })    
        setEditListName(true)
        setShowAddList(true)  
        grabUserLists()

    }

    function modalClose() {
        setShowAddList(false)
        setEditListName(false)
        setCurrentListName("")
    }
 
   
   return (
        <View>
            <View style={{paddingTop: "10%", flexDirection: "row"}}>
                <Text style={styles.headerText}>Lists </Text>
                <TouchableOpacity style={styles.addNewButton} onPress={() => addNewList()}>
                    <Icon name="ios-create" size={25} color={Colors.defaultBlack}></Icon>
                </TouchableOpacity>
            </View>
            <View style={{borderWidth: .5, borderColor: Colors.gray, width: width*.9, alignSelf: "center"}}>
                <FlatList 
                    data={[]}
                
                />

            </View>
            
            <ListModal editTitle={editListName} listData={[]} listID={newListID} listName={currentListName} show={showAddList} onClosePressed={()=>modalClose()}/>             
            
        </View> 
    );
        
        
    
}

let { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    headerText: {
        fontSize: 50,
        fontFamily: Fonts.default,
        paddingLeft: 20
    }, 
    addNewButton: {
        paddingLeft: width*.55,
        paddingTop: 24
    },
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