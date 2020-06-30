import React from 'react';
import { Text } from 'react-native';

export default function ErrorShow({errors, style}) {
    var i = 0;
    while (errors[i] == "") {
        i++
        
    } 
    return ( 
        <Text style={style}>{errors[i]}</Text>
    );
};
