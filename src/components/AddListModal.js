import React, {useState, isValidElement, useEffect } from 'react';
import { TextInput, Text, StyleSheet, View, Dimensions, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Form, Input, Item, Label, Button, Card, CheckBox } from 'native-base';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

import Icon from 'react-native-vector-icons/Ionicons';
import firebase, {firestore} from "../db/Firebase";

import Colors from "../util/Colors";
import Fonts from "../util/Fonts";
import Modal from 'react-native-modal';
import DismissKeyboard from "../components/DimissKeyboard";

import StaticTextBox from "../components/StaticTextBox"



export default function AddListModal({listID, listData, listName, show, onClosePressed}) {

    const [searchString, setSearchString] = useState("")
    const [searching, setIsSearching] =  useState(false)
    const [listItems, setListItems] = useState(listData)
    const [contacts, setContacts] = useState({})
    const [deleting, setDeleting] = useState(false)

    var user = firebase.auth().currentUser;
    var name, email, uid;
    if (user != null) {
        name = user.displayName;
        email = user.email;
        uid = user.uid;  
    }

    function addItem() {
        
        firestore.collection("lists").doc(user.uid).collection("user_lists").doc(listID).collection("items").add({
            itemName: searchString,
        }).then(docRef => {
            var item = {name: searchString, id: docRef.id}
            setListItems(listItems.concat(item))
        })

    }

    function deleteItem(item){
        const index = listItems.indexOf(item);

        console.log(listItems)

        if (index > -1) {
            listItems.splice(index, 1);
            setListItems(listItems)
        }
        setDeleting(!deleting)

    }

    function displayList() {
        return (
            <SwipeListView
                disableRightSwipe
                data={listItems}
                renderItem={({item}) => {
                    return (
                        <View style={styles.contact}>
                            <View style={{flex:8, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={{fontFamily: Fonts.default, fontSize: 20, marginLeft: 15 }}>{item.name}</Text>
                            </View>
                        </View>
                    )
                }}
                renderHiddenItem={({item}) => {
                    return (
                        <View style={styles.delete}>
                            <TouchableOpacity 
                                style={{flex:8, justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.deleteRed }}
                                onPress={() => {deleteItem(item)}}
                            >
                                <Icon name={"ios-add"} size={40} color={Colors.defaultBlack} />

                            </TouchableOpacity>                           
                        </View>
                    )
                }}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                }}
                extraData={deleting}
                showsHorizontalScrollIndicator={false}
                rightOpenValue={-50}
                keyExtractor={item => item.id}
                contentContainerStyle={{
                    flexGrow: 1,
                    width: width*.9,
                    borderRadius: 10,
                }}
                contentInset={{bottom: 60}}
                contentInsetAdjustmentBehavior={'automatic'}
            />
        )
    }

    function closeModal() {
        firestore.collection("lists").doc(user.uid).collection("user_lists").doc(listID).set({
            listName: listName,
        }).then(() =>{
            console.log("i hope?")
        })
        setListItems([])
        onClosePressed()
    }

    
    return (
        <View>
            <Modal 
                isVisible = {show}
                style={styles.modal}
            >
                <View> 
                    <View style={styles.modalView}>
                        <View style={styles.searchBar}>
                            <StaticTextBox placeholder="Add Item..." onChange={(string) => {setSearchString(string)}} onPress={() => addItem()}/>
                        </View>  
                        <View style={{paddingTop: 10, height: height*.5}}>
                            {displayList()}
                        </View>
                        <View style={styles.button}>
                            <TouchableOpacity onPress={() => closeModal()}>
                                <Icon name={"ios-close-circle-outline"} size={50} color={Colors.defaultBlack} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ View>
            </Modal>
        </View>
    )
}


let { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    contact: {
        backgroundColor: Colors.smoke,
        height: height*.07,
        borderRadius: 0,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: "flex-start",
        flexDirection: "row",
    }, 
    delete: {
        height: height*.069,
        borderRadius: 0,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: "flex-start",
        flexDirection: "col",
    }, 
    button: {
        flex: .7,
        alignItems: "center",
        marginTop: 80
    },
    searchBar: {
        flex: .3,
        paddingTop: "8%",
        marginBottom: 10
    }, 
    modalView: {
        alignItems: "center"
    },
    modal: {
        flex:1,
        marginTop: height*.12,
        borderRadius: 20,
        margin: 0,
        backgroundColor: Colors.lightGray,
        alignItems: "center",
    },
})

