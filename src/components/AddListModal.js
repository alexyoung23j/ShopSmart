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


export default function AddListModal({editTitle, listID, listData, listName, show, onClosePressed}) {

    const [searchString, setSearchString] = useState("")
    const [searching, setIsSearching] =  useState(false)
    const [listItems, setListItems] = useState(listData)
    const [contacts, setContacts] = useState({})
    const [deleting, setDeleting] = useState(false)
    const [showTitleEdit, setShowTitleEdit] = useState(true)
    const [newListName, setNewListName] = useState("")

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

        setSearchString("")
    }

    function deleteItem(item){
        const index = listItems.indexOf(item);

        if (index > -1) {
            listItems.splice(index, 1);
            setListItems(listItems)
        }
        setDeleting(!deleting)

        firestore.collection("lists").doc(user.uid).collection("user_lists").doc(listID).collection("items").doc(item.id).delete()

    }

    function updateListName() {
        firestore.collection("lists").doc(user.uid).collection("user_lists").doc(listID).set({
            listName: newListName,
        })
    }

    function closeModal() {
        updateListName()
        setListItems([])
        setSearchString("")
        onClosePressed()
        
    }

    function routeMe() {
        console.log("off to the next page")
    }

    function onNextPressed() {
        setShowTitleEdit(!showTitleEdit)
    }

    useEffect(() => {
        setShowTitleEdit(editTitle)
    }, [editTitle])

    function displayList() {
        return (
            <SwipeListView
                showsVerticalScrollIndicator={false}

                disableRightSwipe
                data={listItems}
                renderItem={({item}) => {
                    return (
                        <View style={styles.item}>
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
                                style={{flex:8, borderRadius: 10, paddingRight: 10, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: Colors.deleteRed }}
                                onPress={() => {deleteItem(item)}}
                            >
                                <Text style={{fontFamily: Fonts.default, opacity: .5}}>delete</Text>

                            </TouchableOpacity>                           
                        </View>
                    )
                }}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                }}
                extraData={deleting}
                showsHorizontalScrollIndicator={false}
                rightOpenValue={-60}
                keyExtractor={item => item.id}
                
                contentContainerStyle={{
                    flexGrow: 1,
                    width: width*.8,
                }}
                
                //contentInsetAdjustmentBehavior={'automatic'}
            />
        )
    }


    
    return (
        <View>
            <Modal 
                isVisible = {show}
                style={styles.modal}
            >
                <View>
                    <Modal
                        isVisible={showTitleEdit}
                        style={styles.titleModal}
                    >
                            <View style={styles.textEntryView}>
                                <TextInput
                                    autoCorrect = {false}
                                    style={styles.titleEntryField}
                                    placeholder="list title" 
                                    defaultValue={listName}
                                    onChangeText={(text) => setNewListName(text)}
                                />
                                
                            </View>
                            <View style={styles.saveTitle}>
                                <TouchableOpacity onPress={() => {onNextPressed()}}>
                                    <Icon name="ios-arrow-forward" size={35} color={Colors.defaultBlack}></Icon>
                                </TouchableOpacity>
                            </View>
                    </Modal>
                </View>
                
                <View> 
                    <View style={styles.modalView}>
                        <View style={styles.searchBar}>
                            <StaticTextBox placeholder="Add Item..." text={searchString} onChange={(string) => {setSearchString(string)}} onPress={() => addItem()}/>
                        </View>  
                        <View style={{paddingTop: 20, height: height*.65}}>
                            {displayList()}
                        </View>
                        <View style={styles.buttons}>
                            <View paddingLeft={10} marginTop={10}>
                                <TouchableOpacity onPress={() => closeModal()}>
                                    <Icon name={"ios-arrow-back"}  size={40} color={Colors.defaultBlack} />
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.routeButton}>
                                <Button style={{ width: width*.35, borderRadius: 30, justifyContent: "center", backgroundColor: Colors.darkGreen}} onPress={() => routeMe()}>
                                    <Text style={{fontFamily: Fonts.default, opacity: .8}}>ROUTE ME</Text>
                                </Button>
                            </View>
                            <View style={styles.deleteButton}>
                                <Icon name={"ios-close"}  size={55} color={Colors.defaultBlack} />
                            </View>
                        </View>
                    </View>
                </ View>
            </Modal>
        </View>
    )
}


let { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    item: {
        backgroundColor: Colors.smoke,
        height: height*.07,
        borderRadius: 10,
        marginTop: 3,
        marginBottom: 3,
        justifyContent: "flex-start",
        flexDirection: "row",
    }, 
    delete: {
        height: height*.065,
        borderRadius: 3,
        width: width*.79,
        marginTop: 4.5,
        marginBottom: 3,
        justifyContent: "flex-start",
        flexDirection: "row",
    }, 
    buttons: {
        flex: .65,
        alignItems: "center",
        alignSelf: "center",
        flexDirection: "row",
        marginBottom: 10,
        borderRadius: 10,
        borderTopColor: Colors.gray, 
        borderTopWidth: 1,
    },
    routeButton: {
        paddingLeft: 81,
        marginTop: 10, 
        borderRadius: 30,
    },
    deleteButton: {
        marginTop: 5, 
        paddingLeft: 76,
        paddingRight: 10
    },
    searchBar: {
        flex: .3,
        paddingTop: "8%",
        marginBottom: 10
    }, 
    titleEntryField: {
        fontSize: 16, 
        fontFamily: Fonts.default,
        color: Colors.defaultBlack
    },
    textEntryView: {
        justifyContent: "center",
        height: height*.06,
        width: width *.5,
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 0.5,
        paddingLeft: "10%",
        flexDirection: "column"
    },
    saveTitle: {
        alignItems: "center",
        paddingTop: "9%"
    }, 
    modalView: {
        alignItems: "center",
    },
    modal: {
        flex:1,
        marginTop: height*.12,
        borderRadius: 20,
        margin: 0,
        backgroundColor: Colors.lightGray,
        alignItems: "center",
    },
    titleModal: {
        flex:.4,
        marginTop: height*.35,
        borderRadius: 20,
        margin: width*.2,
        backgroundColor: Colors.gray,
        alignItems: "center",
    },
})

