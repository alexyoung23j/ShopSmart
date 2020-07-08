import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainStackNavigator from './src/nav/Navigation';

console.disableYellowBox = true;
export default function App() {
  return (
    <MainStackNavigator />
  );
}

