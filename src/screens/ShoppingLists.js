import React, {useState, isValidElement, useEffect } from 'react';
import { Form, Input, Item, Label, Button, Card, CheckBox } from 'native-base';
import { StyleSheet, View, Text, Dimensions, KeyboardAvoidingView, TextInput, ImageBackground, Alert, FlatList, ListViewBase } from 'react-native';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';  
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

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

    const date = new Date().toLocaleString()

    var user = firebase.auth().currentUser;
    var name, email, uid;
    if (user != null) {
        name = user.displayName;
        email = user.email;
        uid = user.uid;  
    }

    var grabbedLists = []

    const userListsRef = firestore.collection("lists").doc(user.uid).collection("user_lists").orderBy("date");
    userListsRef.get().then((snapshot) => {
        snapshot.forEach(doc => {
            const name = doc.get("listName")
            const docID = doc.id
            grabbedLists.push({name:name, id:docID})
        })
    });


    const { navigation } = props;
    const [showAddList, setShowAddList] = useState(false)
    const [currentListName, setCurrentListName] = useState("")
    const [newListID, setNewListID] = useState("")
    const [editListName, setEditListName] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [userLists, setUserLists] = useState(grabbedLists)
    const [currentListData, setCurrentListData] = useState([])


   
    
    async function grabUserLists() {

        var grabbedLists = []

        const userListsRef = firestore.collection("lists").doc(user.uid).collection("user_lists").orderBy("date");
        userListsRef.get().then((snapshot) => {
            snapshot.forEach(doc => {
                const name = doc.get("listName")
                const docID = doc.id
                const date = doc.get("date")
                grabbedLists.push({name:name, id:docID, date: date.slice(0, 8)})
            })
            setUserLists(grabbedLists)
        });
    }

    function deleteList(list) {
        const index = userLists.indexOf(list);

        if (index > -1) {
            userLists.splice(index, 1);
            setUserLists(userLists)
        }
        setDeleting(!deleting)

        firestore.collection("lists").doc(user.uid).collection("user_lists").doc(list.id).delete()
    }


    useEffect(() => {
        grabUserLists()
    }, [])

    

    

    function openAddNewList() {
        grabUserLists()
        setEditListName(true)
        setNewListID("")
        setCurrentListName("")
        setShowAddList(true)  
        
    }


    function modalClose() {
        grabUserLists()
        setEditListName(false)
        setCurrentListName("")
        setNewListID("")
        setShowAddList(false)

    }

    async function grabListItems(id) {
        var grabbedListItems = []

        const listItemsRef = firestore.collection("lists").doc(user.uid).collection("user_lists").doc(id).collection("items").orderBy("date");
        listItemsRef.get().then((snapshot) => {
            snapshot.forEach(doc => {
                const itemName = doc.get("itemName")
                const docID = doc.id
                const category = doc.get("category")
                const categoryID = doc.get("categoryID")
                grabbedListItems.push({name:itemName, id:docID, category: category, categoryID: categoryID})
            })
            setCurrentListData(grabbedListItems)
        });
        
    }

    function selectList(list) {
        setCurrentListName(list.name)
        setEditListName(false)
        setNewListID(list.id)
        grabListItems(list.id).then(() => {
            setShowAddList(true)
        })
    }

    function routeList(list) {
        setCurrentListName(list.name)
        setNewListID(list.id)
        var grabbedListItems = []
        const listItemsRef = firestore.collection("lists").doc(user.uid).collection("user_lists").doc(list.id).collection("items").orderBy("date");
        listItemsRef.get().then((snapshot) => {
            snapshot.forEach(doc => {
                const itemName = doc.get("itemName")
                const docID = doc.id
                const category = doc.get("category")
                const categoryID = doc.get("categoryID")
                grabbedListItems.push({name:itemName, id:docID, category: category, categoryID: categoryID})
            })
            console.log("current", grabbedListItems)
            navigation.navigate("SelectStore", {
                listItems: grabbedListItems, 
                listName: currentListName
            })
        });
    }


    function addNewListNote() {
        return (
            <View style={{alignItems: "center"}}>
                <Text style={{paddingTop: "15%", fontFamily: Fonts.default, fontStyle: "italic" ,fontWeight: "100", fontSize: 20}}>add a list!</Text>  
                <Text style={{paddingTop: "15%", fontFamily: Fonts.default, fontStyle: "italic" ,fontWeight: "100", fontSize: 20}}>swipe left to delete lists</Text>  
                <Text style={{paddingTop: "15%", fontFamily: Fonts.default, fontStyle: "italic" ,fontWeight: "100", fontSize: 20}}>swipe right for quick route</Text>  
            </View>
        )
    }

    function ListViews() {
        return (
            <SwipeListView
                showsVerticalScrollIndicator={false}
                
                data={userLists.filter(list => list.name != "ignore_this_document").reverse()}
                renderItem={({item}) => {
                    return (
                            <View style={{flexDirection: "row", alignItems: "center", paddingBottom: "3%", borderRadius: 10, backgroundColor: Colors.smoke,}}>
                                <Text style={{fontFamily: Fonts.default, fontWeight: "100", fontSize: 25, paddingLeft: 3}}>{item.name}</Text>
                                <View style={{flexDirection: "row", justifyContent: "flex-end", flex:8, alignItems: "center", marginTop: 2}}>
                                    <Text style={{fontFamily: Fonts.default, fontStyle: "italic" ,fontWeight: "100", fontSize: 15, paddingRight: 105}}>{item.date}</Text>  
                                    <TouchableOpacity style={{paddingRight: 10}} onPress={() => selectList(item)}>
                                        <Icon name="ios-arrow-forward" size={35} color={Colors.defaultBlack}></Icon>
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                    )
                }}
                renderHiddenItem={(list) => {
                    return (
                        <View style={{flexDirection: "row", flexGrow:1}}>
                            <View style={{flexDirection: "row", alignItems: "center", borderRadius: 11, justifyContent: "flex-start",  flex: 1, backgroundColor: Colors.darkGreen}}>
                                <TouchableOpacity onPress={() => routeList(list.item)} style={{alignSelf: "flex-start"}}>
                                    <Text style={{fontFamily: Fonts.default, fontWeight: "100", fontSize: 20, paddingLeft: 20, opacity: .5}}>route</Text>  
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center", borderRadius: 11, justifyContent: "flex-end",  flex: 1, backgroundColor: Colors.deleteRed}}>
                                <TouchableOpacity onPress={() => deleteList(list.item)} style={{alignSelf: "flex-end"}}>
                                    <Text style={{fontFamily: Fonts.default, fontWeight: "100", fontSize: 15, paddingRight: 10, opacity: .5}}>delete</Text>  
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    )
                    
                }}
                
                style={styles.listsView} 
                showsHorizontalScrollIndicator={false}
                rightOpenValue={-65}
                leftOpenValue={85}

                keyExtractor={list => list.id}
                contentContainerStyle={{
                    flexGrow: 1,
                    
                }}
                extraData={deleting}
            
            />
        )
    }
 
   return (
        <View style={{backgroundColor: Colors.smoke, flex: 1}}>
            <View style={{marginTop: "5%"}}></View>
            <View style={{flexDirection: "row", marginTop: "5%"}}>
                <Text style={styles.headerText}>Lists </Text>
                <TouchableOpacity style={styles.addNewButton} onPress={() => openAddNewList()}>
                    <Icon name="ios-create" size={25} color={Colors.defaultBlack}></Icon>
                </TouchableOpacity>
            </View>
            <View style={{width: width*.88, alignSelf: "center", height: height*.001, paddingBottom: 5, borderTopColor: Colors.gray, borderTopWidth: .5}}>
            </View>
            <View style={{width: width*.88, alignSelf: "center"}}>
                { userLists.length > 1 ? ListViews() : addNewListNote() } 
            </View>
            <ListModal navigation={navigation} editTitle={editListName} listData={currentListData} listID={newListID} listName={currentListName} show={showAddList} onClosePressed={()=>modalClose()}/>             
            
        </View> 
    );
        
        
    
}

let { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    delete: {
        height: height*.065,
        borderRadius: 3,
        width: width*.79,
        marginTop: 4.5,
        marginBottom: 3,
        justifyContent: "flex-start",
        flexDirection: "row",
    }, 
    listsView: {
    },
    headerText: {
        fontSize: 50,
        fontFamily: Fonts.default,
        paddingLeft: 20,
    }, 
    addNewButton: {
        paddingLeft: width*.55,
        paddingTop: 24, 
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