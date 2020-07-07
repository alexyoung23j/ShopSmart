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
import { setLightEstimationEnabled } from 'expo/build/AR';


export default function ListModal({editTitle, listID, listData, listName, show, onClosePressed}) {


    const itemData = require("../stores/categories.json")
    const date = new Date().toLocaleString()



    const [searchString, setSearchString] = useState("")
    const [listItems, setListItems] = useState(listData)
    const [deleting, setDeleting] = useState(false)
    const [showTitleEdit, setShowTitleEdit] = useState(true)
    const [newListName, setNewListName] = useState(listName)
    const [currentListID, setCurrentListID] = useState(listID)
    const [currentSearchResults, setCurrentSearchResults] = useState(itemData)


    var user = firebase.auth().currentUser;
    var name, email, uid;
    if (user != null) {
        name = user.displayName;
        email = user.email;
        uid = user.uid;  
    }


    function createList() {

        firestore.collection("lists").doc(user.uid).collection("user_lists").add({
            listName: newListName,
            date: date
        }).then(docRef => {
            setCurrentListID(docRef.id)
        })
    }


    function addItem(name, category, categoryID) {  
        firestore.collection("lists").doc(user.uid).collection("user_lists").doc(currentListID).collection("items").add({
            itemName: name,
            date: date, 
            category: category, 
            categoryID: categoryID
        }).then(docRef => {
            var item = {name: name, id: docRef.id, category: category, categoryID: categoryID}
            setListItems(listItems.concat(item))
        })

        setCurrentSearchResults(itemData)

        setSearchString("")
    }

    function deleteItem(item){
        const index = listItems.indexOf(item);

        if (index > -1) {
            listItems.splice(index, 1);
            setListItems(listItems)
        }
        setDeleting(!deleting)

        firestore.collection("lists").doc(user.uid).collection("user_lists").doc(currentListID).collection("items").doc(item.id).delete()

    }

    function updateListName() {
        firestore.collection("lists").doc(user.uid).collection("user_lists").doc(currentListID).set({
            listName: newListName,
            date: date
        })
    }

    function closeModal() {
        setCurrentListID("")
        setListItems([])
        setNewListName("")
        setSearchString("")
        onClosePressed()
        
    }

    function routeMe() {
        updateListName()
        console.log("off to the next page")
    }

    function onNextPressed() {
        
        if (newListName.length > 0) {
            if (currentListID == "") {
                createList()
            } else {
                updateListName()
            }
            
            setShowTitleEdit(!showTitleEdit)
        }
    }

    function updateListItems(string) {
        setSearchString(string)

        const validResults = itemData.filter(item => 
            item.name.toLowerCase().startsWith(string.toLowerCase()) == true
        )
        setCurrentSearchResults(validResults)
    }

    useEffect(() => {
        setShowTitleEdit(editTitle)
    }, [editTitle])

    useEffect(() => {
        updateListItems(searchString)
    }, [searchString])

    useEffect(() => {
        setCurrentListID(listID)
    }, [listID])

    useEffect(() => {
        setNewListName(listName)
    }, [listName])

    useEffect(() => {
        setListItems(listData)
    }, [listData])

    

    function displayList() {
        return (
            <SwipeListView
                showsVerticalScrollIndicator={false}
                disableRightSwipe
                data={listItems}
                renderItem={({item}) => {
                    return (
                        <View style={styles.item}>
                            <View style={{flex:8,flexDirection: "row", alignContent: "center", justifyContent: 'flex-start', alignSelf: "center", alignItems: 'flex-start' }}>
                                <Text style={{width: width*.35, fontFamily: Fonts.default, fontSize: 20, marginLeft: 15 }}>{item.name}</Text>
                                <Text style={{fontFamily: Fonts.default, fontStyle: "italic", fontSize: 15, marginLeft: 30, paddingTop: 3}}>{item.category}</Text>
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

    

    function dropDownComplete() {
        return (
            <FlatList 
                data={currentSearchResults} 
                renderItem={({item}) => {
                    return (
                        <View style={styles.dropDownItems}>
                            <TouchableOpacity onPress={() => addItem(item.name, item.category, item.categoryID)} style={{flexDirection: "row", alignItems: "center", flexGrow: 1}}>
                                <Text style={{width: width*.4, fontFamily: Fonts.default, fontWeight: "100", fontSize: 15, marginLeft: 0 }}>{item.name}</Text>
                                <Text style={{width: width*.3, fontFamily: Fonts.default, fontStyle: "italic", fontWeight: "100", fontSize: 13, marginLeft: 0 }}>{item.category}</Text>
                                <View style={{width: width*.2,}}>
                                    <Icon name={"ios-add"} size={30} color={Colors.defaultBlack} />
                                </View>

                            </TouchableOpacity>
                        </View>
                    )
                }}
                keyExtractor={item => item.id}
                style={styles.dropDownComplete}
                initialNumToRender={10}
            />
        )
    }

    function emptyView() {
        return (
            <View>

            </View>
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
                        animationOut="fadeOut"
                    >
                            <View style={styles.textEntryView}>
                                <TextInput
                                    autoCapitalize="words"
                                    autoCorrect = {false}
                                    style={styles.titleEntryField}
                                    placeholder="Title" 
                                    defaultValue={newListName}
                                    onChangeText={(text) => setNewListName(text)}
                                    maxLength = {10}
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
                            <StaticTextBox placeholder="Add Item..." text={searchString} onChange={(string) => {updateListItems(string)}} onPress={() => setSearchString("")}/>
                        </View>  
                        
                        <View style={{borderBottomEndRadius: 20, borderBottomStartRadius: 20, marginTop: 47, width: width*.85, backgroundColor: Colors.smoke, position: "absolute", zIndex: 1}}>
                            {searchString.length > 0 ? dropDownComplete() : emptyView()}
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
                            <View style={styles.editTitleButton}>
                                <TouchableOpacity onPress={()=> setShowTitleEdit(!showTitleEdit)}>
                                    <Icon name="ios-create" size={20} color={Colors.defaultBlack}></Icon>
                                </TouchableOpacity>
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
    dropDownItems: {
        height: height*.065,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.smoke,
        borderColor: Colors.gray,
        borderTopWidth: .3,
    }, 
    dropDownComplete: {
        marginTop: 28,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 10
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
    editTitleButton: {
        marginTop: 5, 
        paddingLeft: 77,
        paddingRight: 10
    },
    searchBar: {
        flex: .3,
        paddingTop: "8%",
        marginBottom: 10,
        zIndex: 2
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

