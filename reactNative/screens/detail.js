import React, { Component } from 'react';
import {
    WebView
} from 'react-native';

export default class App extends Component {
    constructor(){
        super();
        this.state = {url: ''};
    }

    static navigationOptions (navigation) {
        const { params } = navigation.state;
        return {title: params ? params.title: '详情'};
    }
    componentDidMount() {
        this.setState({ url: this.props.navigation.state.params.url });
    }
    render() {
        return (
            <WebView 
                source={{ uri: this.state.url }}
            />
        );
    }
}