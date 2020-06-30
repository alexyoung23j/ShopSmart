import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';

export default function DismissKeyboard({children}) {
  return ( 
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {children}
    </TouchableWithoutFeedback>
  );
};