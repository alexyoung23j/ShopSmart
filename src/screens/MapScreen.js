import React, {useState, isValidElement, useEffect, useRef } from 'react';
import { Form, Input, Item, Label, Card, CheckBox } from 'native-base';
import { StyleSheet, View, Text, Dimensions, KeyboardAvoidingView, TextInput, ImageBackground, Alert, FlatList, ListViewBase, Button } from 'react-native';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';  
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Svg, Rect, Path, Line, Circle, Image } from 'react-native-svg';

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



import { AnimatedSVGPath } from 'react-native-svg-animations';
import SvgPanZoom, { SvgPanZoomElement } from 'react-native-svg-pan-zoom';


export default function MapScreen({route, props}) {

    const { pathArray } = route.params;
    const { nodes } = route.params;
    const { nodeOrder } = route.params
    const { listName } = route.params;


    const store = require("../stores/vons.json")
    const nodeData = store.nodes
    const zoomRef = useRef(null)

    const [currentTargetNode, setCurrentTargetNode] = useState(nodes[0])
    const [targetNodeIdx, setTargetNodeIdx] = useState(1)
    const [zoomFocus, setZoomFocus] = useState([555, 2220])
    const [currentPath, setCurrentPath] = useState(pathArray[1])
    const [currentDrawPath, setCurrentDrawPath] = useState(pathArray[1])
    const [erasePath, setErasePath] = useState("M 555 2220")

    const map = require('../maps/VonsMap.png')

    function setPath() {
        setCurrentPath(pathArray[0])
    }

    function moveToNextNode() {
        const targetNodeID = nodeOrder[targetNodeIdx]
        const targetNodeData = nodeData[targetNodeID]

        setTargetNodeIdx((targetNodeIdx + 1) % nodeOrder.length)
        setCurrentTargetNode(nodes.find((node) => {return node.key == targetNodeID}))
        setErasePath(currentPath)
        setZoomFocus([targetNodeData.x * 10, targetNodeData.y * 10])


    }



    function zoomFit() {
        setCurrentPath("M 0 0")
        setTimeout(() => {
            zoomRef.current.zoomToPoint(zoomFocus[0], zoomFocus[1] - height*2, .25, 1500)
        }, 500)
        setTimeout(() => {
            zoomRef.current.zoomToPoint(zoomFocus[0], zoomFocus[1] - height*1, .45, 1500)
        }, 3000)


        
        setTimeout(()=> {
            setCurrentDrawPath(pathArray[targetNodeIdx-1])
            setErasePath("M 0 0")
        }, 2500)

        setTimeout(()=> {
            setCurrentDrawPath("M 0 0")
            setCurrentPath(pathArray[targetNodeIdx-1])
        }, 6000)

        
    }

    useEffect(() => {
        zoomFit()
        setPath()
    }, [pathArray])

    useEffect(() => {
        zoomFit()
    }, [zoomFocus])
    
    function drawPath() {
        return (
            <AnimatedSVGPath
                strokeColor={"green"}
                duration={3000}
                strokeWidth={20}
                zIndex={2}
                height={2244}
                width={3174}
                scale={1}

                delay={40}
                d={currentDrawPath}
                loop={true}
            />  
        
        )
    }
    function basePath() {
        return (
                <AnimatedSVGPath
                    strokeColor={"green"}
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


    return (
        <View style={{flex:1}}>
            <View style={{ overflow: "hidden", width: "100%", height: height, paddingBottom: "20%", backgroundColor: Colors.lighterGray}}>  
                <View style={{marginLeft: 17, height: height*.1, zIndex: 1, width: width*.9, flexGrow: .05, marginTop: 10, backgroundColor: Colors.darkGray, borderRadius: 20,}}>

                </View>  
                <SvgPanZoom
                    canvasHeight  = {2244}
                    canvasWidth   = {3174}
                    minScale      = {.3}
                    ref={zoomRef}
                    //initialZoom   = {.5}
                    //onZoom        = {(zoom) => { console.log("yo") }}
                    //canvasStyle   = {{ backgroundColor: 'yellow' }}
                    //style={{height: "10%", paddingBottom: "10%", flex:1}}
                    >
                        <Image
                            href={map} 
                            
                        /> 
                        { basePath() }
                        { clearPath() }
                        { drawPath() }

                </SvgPanZoom>
              
                <View style={{position: "", marginLeft: 4, paddingTop: "10%", marginTop: height*.7, height: height*.9, borderTopEndRadius: 20, borderTopStartRadius: 20, backgroundColor: Colors.darkGray, width: width*.98}}>
                    <Button title="Next Node" onPress={() => {moveToNextNode()}}></Button>
                </View>
            </View>     
            
    </View>
            
            
    )
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