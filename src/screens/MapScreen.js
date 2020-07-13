import React, {useState, isValidElement, useEffect, useRef } from 'react';
import { Form, Input, Item, Label, Card, CheckBox } from 'native-base';
import { StyleSheet, View, Text, Dimensions, KeyboardAvoidingView, TextInput, ImageBackground, Alert, FlatList, ListViewBase, Button } from 'react-native';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';  
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Svg, Rect, Path, Line, Circle, Image, G, Polyline } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';


import StaticTextBox from "../components/StaticTextBox"

import Modal from 'react-native-modal';


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



import { AnimatedSVGPath } from 'react-native-svg-animations';
import SvgPanZoom, { SvgPanZoomElement } from 'react-native-svg-pan-zoom';


export default function MapScreen({route, navigation}) {

    const { pathArray } = route.params;
    const { nodes } = route.params;
    const { nodeOrder } = route.params
    const { listName } = route.params;

    const store = require("../stores/vons.json")
    const nodeData = store.nodes
    const zoomRef = useRef(null)

    const [currentTargetNode, setCurrentTargetNode] = useState(nodes[1])
    const [showCancel, setShowCancel] = useState(false)
    const [showBackOption, setShowBackOption] = useState(true)
    const [currentTargetNodeInfo, setCurrentTargetNodeInfo] = useState(nodes[1])
    const [pointerCoordinates, setPointerCoordinates] = useState([551, 2220])
    const [targetCoordinates, setTargetCoordinates] = useState([551, 2220])
    const [targetNodeIdx, setTargetNodeIdx] = useState(1)
    const [zoomFocus, setZoomFocus] = useState([555, 2220])
    const [currentPath, setCurrentPath] = useState("M 555 2220")
    const [erasePath, setErasePath] = useState("M 555 2220")

    const map = require('../maps/VonsMap.png')
    const cart = require("../maps/cart.png")
    const arrow = require("../maps/arrow.png")

    
    function setPath() {
        setCurrentPath(pathArray[0])
        const targetNodeID = nodeOrder[targetNodeIdx]
        const targetNodeData = nodeData[targetNodeID]
        setTimeout(() => {
            setTargetCoordinates([targetNodeData.x * 10, targetNodeData.y * 10])
        }, 4000)
        
    }
  //  console.log(nodes)


    function onNextPressed() {
        if (targetNodeIdx < nodeOrder.length-1) {
            moveToNextNode()
        } else {
            const targetNodeID = nodeOrder[targetNodeIdx]
            const targetNodeData = nodeData[targetNodeID]
            setPointerCoordinates([targetNodeData.x * 10, targetNodeData.y * 10])
            setShowBackOption(false)
            setShowCancel(true)
            setErasePath(currentPath)
            setZoomFocus([targetNodeData.x * 10, targetNodeData.y * 10])
            setTimeout(() => {
                setErasePath("M 0 0")
                setCurrentPath("M 0 0")
    
            }, 4510)

        }
    }

    function moveToNextNode() {
        const targetNodeID = nodeOrder[targetNodeIdx]
        const targetNodeData = nodeData[targetNodeID]

        setCurrentTargetNode(nodes[targetNodeIdx+1])

        setTargetNodeIdx((targetNodeIdx + 1))
       
        setErasePath(currentPath)
        setZoomFocus([targetNodeData.x * 10, targetNodeData.y * 10])
        setPointerCoordinates([targetNodeData.x * 10, targetNodeData.y * 10])

        if (targetNodeIdx < nodeOrder.length-1) {
            const nextNodeID = nodeOrder[targetNodeIdx+1]
            const nextNodeData = nodeData[nextNodeID]
            setTimeout(() => {
                setTargetCoordinates([nextNodeData.x * 10, nextNodeData.y * 10])
    
            }, 4500)
        }

        setTimeout(() => {
            setCurrentTargetNodeInfo(nodes[targetNodeIdx+1])

        }, 4500)


    }



    function zoomFit() {
        setCurrentPath("M 0 0")
        setTimeout(() => {
            zoomRef.current.zoomToPoint(zoomFocus[0], zoomFocus[1] - height*.3, .25, 1500)
        }, 1000)
        setTimeout(() => {
            zoomRef.current.zoomToPoint(zoomFocus[0], zoomFocus[1] - height*.3, .45, 1500)
        }, 3000)

        setTimeout(()=> {
            setErasePath("M 0 0")
            setCurrentPath(pathArray[targetNodeIdx-1])

        }, 4500)

        
    }

    function goHome() {
        setTimeout(() => {
            navigation.navigate("ShoppingLists", {showNewUserMessage: false})
        }, 1000)
        
    }

    useEffect(() => {
        zoomFit()
        setPath()
    }, [pathArray])

    useEffect(() => {
        zoomFit()
    }, [zoomFocus])
    
    
    function basePath() {
        return (
                <AnimatedSVGPath
                    strokeColor={Colors.darkGreen}
                    duration={3000}
                    strokeWidth={20}
                    zIndex={2}
                    height={2244}
                    width={3174}
                    scale={1}

                    delay={40}
                    d={currentPath}
                    loop={false}
                />  
            
        )
    }

    function clearPath() {
        return (
            <AnimatedSVGPath
                    strokeColor={Colors.lightGray}
                    duration={3000}
                    strokeWidth={20}
                    
                    height={2244}
                    width={3174}
                    scale={1}

                    delay={100}
                    d={erasePath}
                    loop={false}
                />  
        )
    }

    function headerText() {
        if (showCancel == true) {
            return (
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={{marginLeft: 20}}>
                        <Icon name="ios-checkmark-circle" size={35} color={Colors.smoke}></Icon>
                    </View>
                    <View style={{flexGrow: .6, alignItems: "center", flexDirection: "row"}}>
                        <Text style={{paddingLeft: "8%", fontFamily: Fonts.default, fontStyle: "italic", fontWeight: "400", fontSize: 30, marginLeft: 0, color: Colors.smoke}}>Checkout Now!</Text>
                        
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={{marginLeft: 20}}>
                        <Icon name="ios-arrow-dropright" size={35} color={Colors.smoke}></Icon>
                    </View>
                    <View style={{marginLeft: "10%", alignItems: "center", justifyContent: "center", flexDirection: "row", borderLeftWidth: 2, borderLeftColor: Colors.smoke}}>
                        <Text style={{paddingLeft: "10%", fontFamily: Fonts.default, fontWeight: "400", fontSize: 20, marginLeft: 0, color: Colors.smoke}}>{currentTargetNodeInfo.category.toUpperCase().slice(0, 14)}</Text>
                    </View>
                </View>
                
            )
        }
    }

    function bottomDetails() {
        if (showCancel == false) {
            return (
                <View style={{ marginLeft: 4, height: height*.18, position: "absolute", flexDirection: "row", alignItems: "center",  marginTop: 550, borderTopEndRadius: 20, borderTopStartRadius: 20, backgroundColor: Colors.darkGray, width: width*.98}}>
                       <TouchableOpacity onPress={() => onNextPressed()} style={{width: width*.2, height: height*.09, marginLeft: 10, backgroundColor: Colors.green, borderRadius: 10,  alignItems: "center", justifyContent: "center"}}>
                            <Text style={{ fontFamily: Fonts.default, fontWeight: "400", fontSize: 25, marginLeft: 0, color: Colors.smoke}}>next</Text>
                        </TouchableOpacity>
                       <FlatList 
                            data={currentTargetNodeInfo.items} 
                            renderItem={({item}) => {
                                return (
                                    <View style={styles.dropDownItems}> 
                                        <Text style={{ fontFamily: Fonts.default, fontWeight: "400", fontSize: 20, marginLeft: 0, color: Colors.smoke}}>{item.slice(0, 14)}</Text>
                                    </View>
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ alignContent: "center", alignSelf: "center",  borderWidth: 1, borderColor: Colors.smoke, borderRadius: 10, marginLeft: 15, paddingBottom: 5, paddingTop: 5}}
                        />

                        

                        <TouchableOpacity onPress={() => setShowCancel(true)}style={{width: width*.2, height: height*.09, marginLeft: 15, marginRight: 10,  backgroundColor: Colors.deleteRed, borderRadius: 10,  alignItems: "center", justifyContent: "center"}}>
                            <Text style={{ fontFamily: Fonts.default, fontWeight: "400", fontSize: 25, marginLeft: 0, color: Colors.smoke}}>exit</Text>
                        </TouchableOpacity>

    
                </View>
            )
        } else {
            return (
                <View style={{ marginLeft: 4, height: height*.14, position: "absolute", flexDirection: "row", alignItems: "center",  marginTop: 580, justifyContent: "center", borderTopEndRadius: 20, borderTopStartRadius: 20, backgroundColor: Colors.darkGray, width: width*.98}}>
                       
                       {returnButton()}
                       <TouchableOpacity onPress={() =>  goHome()} style={{width: width*.5, height: height*.09,  backgroundColor: Colors.deleteRed, borderRadius: 10,  alignItems: "center", justifyContent: "center"}}>
                            <Text style={{ fontFamily: Fonts.default, fontWeight: "400", fontSize: 25, marginLeft: 0, color: Colors.smoke}}>exit navigation</Text>
                        </TouchableOpacity>
                </View>
            )
        } 
        
    }

    function returnButton() {
        if (showBackOption == true) {
            return (
                <TouchableOpacity onPress={() =>  setShowCancel(false)} style={{width: width*.1, height: height*.09, borderRadius: 10, marginRight: 40, alignItems: "center", justifyContent: "center"}}>
                    <Icon name="ios-arrow-back" size={40} color={Colors.smoke}/>
                </TouchableOpacity>
            ) 
        } else {
            return (
                <View>

                </View>
            )
        }
    }

   
   


    return (
        <View style={{flex:1}}>
            <View style={{ overflow: "hidden", width: "100%", paddingBottom: "20%", height: height, backgroundColor: Colors.lighterGray}}>  
                <View style={{justifyContent: "center", marginLeft: 17, height: height*.1, zIndex: 1, width: width*.9, flexGrow: .05, marginTop: 15, backgroundColor: Colors.darkGray, borderRadius: 20,}}>
                    { headerText()}
                </View>  
                <SvgPanZoom
                    canvasHeight  = {2244}
                    canvasWidth   = {3174}
                    minScale      = {.3}
                    ref={zoomRef}
                    //initialZoom   = {.5}
                    //onZoom        = {(zoom) => { console.log("yo") }}
                    //canvasStyle   = {{ backgroundColor: 'yellow' }}
                    >
                        <Image
                            href={map} 
                        /> 
                        
                        { basePath() }
                        { clearPath() }
                        <Circle cx={pointerCoordinates[0]} cy={pointerCoordinates[1]} r={18} stroke={Colors.darkGreen} strokeWidth={7} fill={Colors.darkGreen}/>
                        <Circle cx={targetCoordinates[0]} cy={targetCoordinates[1]} r={13} stroke={Colors.darkGreen} strokeWidth={7} fill={Colors.darkGreen}/>
                        


                </SvgPanZoom>
                
              
               { bottomDetails()}
           
            </View>     
            
    </View>
            
            
    )
}


let { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    dropDownItems: {
        height: height*.038,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
    }, 
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