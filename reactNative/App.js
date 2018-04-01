/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import HomeScreen from "./screens/home";
import DetailScreen from "./screens/detail";
const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Detail:{
      screen: DetailScreen,
    }
  },
  {
    initialRouteName: 'Home',
    navigationOptions:{
      headerStyle: {
        backgroundColor: '#231614',
      },
      headerTintColor: 'white'
    }
  }
);

export default class App extends Component {
  render() {
    return (
      <RootStack/>
    );
  }
}
