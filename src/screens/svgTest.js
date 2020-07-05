import React from 'react';
import { View, Text, ImageBackground, Button } from 'react-native';
import { Svg, Rect, Path, Line, Circle, Image } from 'react-native-svg';

import { AnimatedSVGPath } from 'react-native-svg-animations';
import SvgPanZoom, { SvgPanZoomElement } from 'react-native-svg-pan-zoom';
import Test from "../maps/test.svg"
import MapSvg from "../maps/Map2.svg"


export default function SvgTest() {

    const map = require('../maps/Map2.png')


    return (
        <View style={{overflow: "hidden"}}>
            <View style={{flex:.1, paddingBottom: "20%", backgroundColor: "#808080"}}>
                <Text>
                    Hello
                </Text>
            </View>  
            <View style={{overflow: "hidden", width: "100%", height: "90%", paddingBottom: "20%"}}>  
                <SvgPanZoom
                    canvasHeight  = {2244}
                    canvasWidth   = {3174}
                    minScale      = {.1}
                    initialZoom   = {.5}
                    onZoom        = {(zoom) => { console.log("yo") }}
                    canvasStyle   = {{ backgroundColor: 'yellow' }}
                    //style={{height: "10%", paddingBottom: "10%", flex:1}}
                    >
                            <Image
                                href={map} 
                                
                            /> 

                            <AnimatedSVGPath
                                    strokeColor={"green"}
                                    duration={4000}
                                    strokeWidth={40}
                                    
                                    height={2244}
                                    width={3174}
                                    scale={1}

                                    delay={100}
                                    d='M 1480 2080 L 1470 2010 L 1420 2010 L 1400 2000 L 1390 1990 L 1120 1980 L 1120 1960 L 870 1960 L 870 1630 L 850 1630 L 850 660 L 850 370 L 840 250 L 280 250 L 280 280 L 270 360 L 260 370'
                                    loop={true}
                            /> 

                            <AnimatedSVGPath
                                    strokeColor={"white"}
                                    duration={4000}
                                    strokeWidth={40}
                                    
                                    height={2244}
                                    width={3174}
                                    scale={1}

                                    delay={5000}
                                    d='M 1480 2080 L 1470 2010 L 1420 2010 L 1400 2000 L 1390 1990 L 1120 1980 L 1120 1960 L 870 1960 L 870 1630 L 850 1630 L 850 660'
                                    loop={false}
                            />



                </SvgPanZoom>
            </View>     
            <View style={{ backgroundColor: "#808080"}}>
                <Button title="Yo" onPress={() => console.log("yoyo")}></Button>
            </View>
    </View>
            
            
    )
}