import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	Image,
	FlatList,
	TouchableWithoutFeedback,
	Modal,
	View
} from 'react-native';
import Dimensions from 'Dimensions';

const instructions = Platform.select({
	ios: 'Press Cmd+R to reload,\n' +
			'Cmd+D or shake for dev menu',
	android: 'Double tap R on your keyboard to reload,\n' +
			'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
	static navigationOptions = {
		title: '妹纸&gank.io'
	} 
	constructor(props) {
		super(props);
		//构造state
		this.state = { results: [],refreshing:false,currentPage:1, modalVisible: false, bigImage:''};
	}
	componentDidMount(){
		this._getData(1);
	}
	async _getData(page) {
		this.setState({ refreshing: true });
		let url = 'http://gank.io/api/data/休息视频/10/' + page;
		let results = [];
		await fetch(url)
			.then((response) => response.json())
			.then((responseJson) => {
				results = responseJson.results;
			})
			.catch(error => {
				console.log('error', error);
				this.setState({ refreshing: false });
			});
		url = 'http://gank.io/api/data/福利/10/' + page;
		await fetch(url)
			.then((response) => response.json())
			.then((responseJson) => {
				results.forEach((currentValue, index, arr) => {
						currentValue.imageUrl = responseJson.results[index].url;
						currentValue.desc = currentValue.publishedAt.substr(currentValue.publishedAt.indexOf("-") + 1, 5) + currentValue.desc;
				});
				if(page>1){
					this.setState({ results: this.state.results.concat(results)});
				}else{
					this.setState({ results: results });
				}
				console.log('state.results', this.state.results);
			})
			.catch(error => {
				console.log('error', error);
			}).then(()=>{
				this.setState({ refreshing: false });
			});
    }
  _listItem = ({item}) => {
		return (
			<View style={{
				marginLeft: 5,
				marginTop: 5,
				marginRight: 5,
				flexDirection: 'column', 
				backgroundColor: 'white', 
				borderWidth: 1, 
				borderRadius: 4,
				borderColor: '#CECECE'}}>
				<TouchableWithoutFeedback
					onPress={() => {
						console.log('item', { bigImage: item.imageUrl, modalVisible: true });
						this.setState({ bigImage: item.imageUrl, modalVisible: true });
					}}>
					<Image style={{
						width: Dimensions.get('window').width/2-10,
						height: 250,
						borderRadius: 4,
						resizeMode: Image.resizeMode.cover}}
						source={{ uri: item.imageUrl }}/>
				</TouchableWithoutFeedback>
				<Text onPress={() => {
					let date = item.publishedAt.substring(0, 10).replace(/-/g, '/');
					let url = `http://gank.io/${date}`;
					this.props.navigation.navigate("Detail", { url: url, title: date });
				}}
				style={{
					width: Dimensions.get('window').width / 2 - 20,
					margin:5,
				}}
				>{item.desc}</Text>
			</View>
		);
	}
	render() {
		let self=this;
		return (
			<View>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						alert('Modal has been closed.');
					}}>
					<TouchableWithoutFeedback
						onPress={() => {
							this.setState({modalVisible:false});
						}}>
						<Image style={{
							width: Dimensions.get('window').width,
							height: Dimensions.get('window').height,
							backgroundColor: 'black',
							resizeMode: Image.resizeMode.contain
						}}
							source={{ uri: this.state.bigImage }}>
						</Image>
					</TouchableWithoutFeedback>
				</Modal>
				<FlatList
					style={{marginLeft:5,marginRight:5}}
					data={this.state.results}
					numColumns={2}
					keyExtractor={(item) => item.desc}
					refreshing={false}
					onRefresh={() => {
						this.setState({ currentPage:1});
						this._getData(this.state.currentPage)
					}}
					onEndReachedThreshold={0}
					onEndReached={(distanceFromEnd)=>{
						console.log('onEndReached');
						this._getData(this.state.currentPage+1)
					}}
					renderItem={this._listItem}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});
