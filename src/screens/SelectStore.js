import React, {useState, isValidElement, useEffect } from 'react';
import { Form, Input, Item, Label, Button, Card, CheckBox } from 'native-base';
import { StyleSheet, View, Text, Dimensions, KeyboardAvoidingView, TextInput, ImageBackground, Alert, FlatList, ListViewBase } from 'react-native';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';  
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import StaticTextBox from "../components/StaticTextBox"

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

    const stores=[{"name": "Vons", "address": "3993 Governor Dr", "id": 0, "state": "CA"}, 
    {"name": "Vons", "address": "7788 Regents Rd", "id": 1, "state": "CA"},
     {"name": "Vons", "address": "7554 Girard Ave", "id": 2, "state": "CA"},
     {"name": "Vons", "address": "4725 Clairemont Dr", "id": 3, "state": "CA"}]

    const { listItems } = route.params;
    const {listName} = route.params;

    const [pathArray, setPathArray] = useState([])
    const [nodeOrder, setNodeOrder] = useState([])
    const [currentNodes, setCurrentNodes] = useState([])
    const [searchString, setSearchString] = useState("")
    const [chosen, setChosen] = useState(false)
    const [buttonColor, setButtonColor] = useState(Colors.lightGray)
    const [buttonText, setButtonText] = useState("")

    const store = require("../stores/vons.json")
    const nodeData = store.nodes

    function goPressed() {
        const orderedNodes = new Array()

        for (i=0; i<nodeOrder.length; i++) {
            const nodeID = nodeOrder[i]
            orderedNodes.push(currentNodes.find((node) => {return node.category == nodeData[nodeID].type}))
        }


        navigation.navigate("MapScreen", {
            pathArray: pathArray,
            nodes: orderedNodes,
            nodeOrder: nodeOrder,
            listName: listName
            
        })
    }

    function parseNodes(items) {

        const arr = new Array()

        for (i = 0; i <items.length;i++) {
            if (!arr.includes(items[i].categoryID)) {
                arr.push(items[i].categoryID)
            }
        }

        return arr


    }

    function createPathArray() {
        const visitedNodes = parseNodes(listItems)
        const arr = createPath(visitedNodes)
        setPathArray(arr[0])
        setNodeOrder(arr[1])
        //console.log("PathArray: ",pathArray)
        
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

        setCurrentNodes(nodes)

        //console.log("Nodes: ", nodes)


    }

    

    useEffect(() => {
        createPathArray()
    }, [])

    useEffect(() => {
        createNodes()
    }, [nodeOrder])

    function dropDownComplete() {
        return (
            <FlatList 
                data={stores} 
                renderItem={({item}) => {
                    return (
                        <View style={styles.dropDownItems}>
                            <TouchableOpacity onPress={() => {setButtonColor(Colors.darkGreen); setButtonText("GO"); setSearchString(""); setChosen(true)}} style={{borderRadius: 10, flexDirection: "row", alignItems: "center", flexGrow: 1, }}>
                                <Text style={{width: width*.25, fontFamily: Fonts.default, fontWeight: "100", fontSize: 20, marginLeft: 0 }}>  {item.name}</Text>
                                <Text style={{width: width*.44, fontFamily: Fonts.default, fontStyle: "italic", fontWeight: "100", fontSize: 16, marginLeft: 0 }}>{item.address}</Text>
                                <Text style={{fontFamily: Fonts.default, fontStyle: "italic", fontWeight: "100", fontSize: 16, marginLeft: 0 }}>{item.state}  </Text>


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

    function showStore() {
        return (
            <View style={styles.item}>
                <View style={{ alignContent: "center", flexDirection: "row", justifyContent: 'center', alignSelf: "center", alignItems: 'center' }}>
                    <Text style={{width: width*.2, fontFamily: Fonts.default, fontSize: 20, marginLeft: 15 }}>Vons</Text>
                    <Text style={{ fontFamily: Fonts.default, fontStyle: "italic", fontSize: 15, marginLeft: 5, marginRight: 15 }}>3993 Governor Dr</Text>

                </View>
            </View>
        )
    }

    function emptyView() {
        return (
            <View>

            </View>
        )
    }

    function emptyView2() {
        return (
            <View style={{marginTop: 150, marginBottom: 3, height: height*.07,}}>
                <View style={{ alignContent: "center", justifyContent: 'center', alignSelf: "center", alignItems: 'center' }}>
                    <Text style={{width: width*.7, fontFamily: Fonts.default, fontSize: 20, marginLeft: 45 }}></Text>
                </View>
            </View>
        )
    }
 
 
   return (
    <View style={{backgroundColor: Colors.smoke, flex: 1, alignItems: "center"}}>
        <View style={{marginTop: "5%"}}></View>
        <View style={{flexDirection: "row", marginTop: "5%"}}>
            <Text style={styles.headerText}>Select a Store </Text>
        </View>
        <View style={{marginTop: "5%"}}></View>
        <View style={{alignItems: "center", backgroundColor: Colors.gray, flex: 1, borderRadius: 30, width: width*.93, marginBottom: "20%"}}>
            <View style={styles.searchBar}>
                <StaticTextBox placeholder="Search Stores..." text={searchString} onChange={(string) => {setSearchString(string)}} onPress={() => {}}/>
            </View>  
            
            <View style={{borderBottomEndRadius: 20, borderBottomStartRadius: 20, marginTop: 47, width: width*.85, backgroundColor: Colors.smoke, position: "absolute", zIndex: 1}}>
                {searchString.length > 0 ? dropDownComplete() : emptyView()}
            </View>
            <View>
                { chosen == true ? showStore() : emptyView2()}
            </View>
            <View style={styles.routeButton}>
                <Button style={{ width: width*.45, borderRadius: 30, justifyContent: "center", backgroundColor: buttonColor}} onPress={() => {goPressed()}}>
                    <Text style={{fontFamily: Fonts.default}}>{buttonText}</Text>
                </Button>
            </View>

            
        </View>
       
        
                  
        
    </View> 
    );
        
        
    
}

let { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    item: {
        backgroundColor: Colors.lightGray,
        height: height*.07,
        borderRadius: 10,
        marginTop: 150,
        marginBottom: 3,
        justifyContent: "center",
        alignSelf: "center"
    }, 
    routeButton: {
        
        marginTop: width*.4, 
        borderRadius: 30,
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
    searchBar: {
        flex: .3,
        paddingTop: "8%",
        marginBottom: 10,
        zIndex: 2
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
    listsView: {
    },
    headerText: {
        fontSize: 40,
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