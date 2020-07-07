import React, {useState, isValidElement, useEffect, useRef } from 'react';
import { View, Text, ImageBackground, Button } from 'react-native';
import { Svg, Rect, Path, Line, Circle, Image } from 'react-native-svg';

import { AnimatedSVGPath } from 'react-native-svg-animations';
import SvgPanZoom, { SvgPanZoomElement } from 'react-native-svg-pan-zoom';
import Test from "../maps/test.svg"
import MapSvg from "../maps/Map2.svg"


export default function SvgTest() {

    const map = require('../maps/VonsMapTest1.png')
    
    const zoomRef = useRef(null)

    function doIt() {
        zoomRef.current.zoomToPoint(546, 2222, 1)
    }
    

   /*  useEffect(() => {
        doIt()
    }, [])
 */

    return (
        <View style={{overflow: "hidden"}}>
            <View style={{flex:1, paddingBottom: "20%", paddingTop: 10}}>
            </View>  
            <View style={{overflow: "hidden", width: "100%", height: "90%", paddingBottom: "20%"}}>  
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

                           <AnimatedSVGPath
                                    strokeColor={"green"}
                                    duration={4000}
                                    strokeWidth={20}
                                    
                                    height={2244}
                                    width={3174}
                                    scale={1}

                                    delay={100}
                                    d="M 2140 1370 L 2140 1100 L 2130 1090 L 2120 1060 L 2110 1050 L 2100 730 L 2090 280 L 1960 270 L 1940 280 L 1880 270 L 1870 260 L 1430 250 L 1420 240 L 1410 230 L 1400 220 L 1260 210 L 1250 200 L 1230 190 L 1220 180 L 1210 170 L 1200 160"
                                    loop={false}
                            />  

                        

                </SvgPanZoom>
            </View>     
            <View style={{ zIndex: 1, backgroundColor: "#808080"}}>
                <Button title="Yo" onPress={() => doIt()}></Button>
            </View>
    </View>
            
            
    )
}