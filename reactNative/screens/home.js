/**
 * @file 首页
 * @author keyboard3
 */

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	Image,
	FlatList,
	TouchableWithoutFeedback,
	Modal,
	View
} from 'react-native';
import Dimensions from 'Dimensions';
import axios from 'axios';

type Props = {};
export default class App extends Component<Props> {

	static navigationOptions = {
		title: '妹纸&gank.io'
	} 

	constructor(props) {
		super(props);
		this.state = { results: [], refreshing:false, currentPage:1, modalVisible: false, bigImage:''};
	}

	componentDidMount(){
		this.getData(1);
	}

	render() {
		let self = this;
		return (
			<View>
				<Modal
					animationType = "slide"
					transparent = {false}
					visible = {this.state.modalVisible}
					onRequestClose = {() => alert('Modal has been closed.')}
				>
						<TouchableWithoutFeedback
							onPress = {() => this.setState({modalVisible:false}) }
						>
								<Image style={styles.bigMeitu}
									source={{ uri: this.state.bigImage }}
								>
							</Image>
						</TouchableWithoutFeedback>
				</Modal>
				<FlatList
					style={{marginLeft: 5,marginRight: 5}}
					data = {this.state.results}
					numColumns = {2}
					keyExtractor = {item=> item._id}
					refreshing = {false}
					onRefresh = {() => {
						this.setState({ currentPage:1 });
						this.getData(this.state.currentPage)
					}}
					onEndReachedThreshold = {0}
					onEndReached = {(distanceFromEnd) => this.getData(this.state.currentPage + 1)}
					renderItem = {this.renderListItem}
				/>
			</View>
		);
	}

	renderListItem(data) {
		let item = data.item;
		return (
			<View style={styles.listItem}
			>
				<TouchableWithoutFeedback
					onPress = {() => this.setState({ bigImage: item.imageUrl, modalVisible: true }) }
				>
						<Image style={styles.meitu}
							source={{ uri: item.imageUrl }}
						/>
				</TouchableWithoutFeedback>

				<Text onPress = {() => this.navigateDetail(item)}
					style={styles.desc}
				>
					{item.desc}
				</Text>
			</View>
		);
	}

	async getData(page) {
		this.setState({ refreshing: true });
		let results = [];
		
		try {
			let videosRequest = axios.get('http://gank.io/api/data/休息视频/10/'+page);
			let welfaresRequest = axios.get('http://gank.io/api/data/福利/10/'+page);
			let [videosResult, welfaresResult] = await Promise.all([videosRequest, welfaresRequest]);
			this.setState({ refreshing: false });

			let videos = videosResult.data.results;
			let welfares = welfaresResult.data.results;
			
			videos.forEach((currentValue, index) => {
				currentValue.imageUrl = welfares[index].url;
				currentValue.desc = currentValue.publishedAt.substr(currentValue.publishedAt.indexOf("-") + 1, 5) 
														+ currentValue.desc;
			});
			results = videos;
			if (page > 1){
				this.setState({ results: this.state.results.concat(results)});
			}else {
				this.setState({ results: results });
			} 
		} catch (error) {
			console.error(error);
		}
	}

	navigateDetail(item) {
		let date = item.publishedAt.substring(0, 10).replace(/-/g, '/');
		let url = `http://gank.io/${date}`;
		this.props.navigation.navigate("Detail", { url: url, title: date });
	}
}

const styles = StyleSheet.create({
	listItem: {
		marginLeft: 5,
		marginTop: 5,
		marginRight: 5,
		flexDirection: 'column', 
		backgroundColor: 'white', 
		borderWidth: 1, 
		borderRadius: 4,
		borderColor: '#CECECE'
	},
	meitu: {
		width: Dimensions.get('window').width / 2 - 10,
		height: 250,
		borderRadius: 4,
		resizeMode: Image.resizeMode.cover
	},
	bigMeitu: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		backgroundColor: 'black',
		resizeMode: Image.resizeMode.contain
	},
	desc: {
		width: Dimensions.get('window').width / 2 - 20,
		margin:5
	}
});
