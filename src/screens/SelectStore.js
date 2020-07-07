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

import createPath from "../actions/createPath";


import firebase, {firestore} from "../db/Firebase";
import { getSupportedVideoFormats } from 'expo/build/AR';
import DismissKeyboard from '../components/DimissKeyboard';
import { set } from 'react-native-reanimated';



export default function SelectStore({route, navigation }) {

    const { listItems } = route.params;
    const {listName} = route.params;

    const [pathArray, setPathArray] = useState([])
    const [nodeOrder, setNodeOrder] = useState([])

    const store = require("../stores/vons.json")
    const nodeData = store.nodes


    function createPathArray() {
        const arr = createPath(listItems)
        setPathArray(arr[0])
        setNodeOrder(arr[1])
        console.log("listItems: ",listItems)
    }

    function createNodes() {
        nodes = new Array()

        for (i=0; i<nodeOrder.length-1; i++) {
            nodes.push({category: nodeData[nodeOrder[i+1]].type, items: []})
            for (j=0; j < listItems.length; j++) {
                if (listItems[j].categoryID == nodeOrder[i+1]) {
                    nodes[i].items.push(listItems[j].name)
                }
            }
        }

        console.log(nodes)


    }

    function navToMap() {
        navigation.navigate("StoreMap", {
            pathArray: pathArray,

        })
    }

 
   return (
        <View style={{backgroundColor: Colors.smoke, flex: 1}}>
            <Button onPress={() => createPathArray()} />
            <Button onPress={() => console.log(pathArray)} />
            <Button onPress={() => createNodes()} />
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