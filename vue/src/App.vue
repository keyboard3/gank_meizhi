<template>
	<div id="app">
		<div class="header horizontal-layout">{{title}}</div>
		<div class="horizontal-layout container">
				<div class="vertical-layout box" v-for="item in list" :key="item._id">
					<img :src="item.imageUrl"/>
					<div class="title">{{item.desc}}</div>
				</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app',
  data: function (){
    return ({
      title: '妹纸&gank.io',
      list: []
    });
  },
  created() {
		this.loadData();
  },
  methods: {
    async loadData() {
			let videosRequest = axios.get('http://gank.io/api/data/休息视频/10/1');
      let welfaresRequest = axios.get('http://gank.io/api/data/福利/10/1');
			let [videosResult, welfaresResult] = await Promise.all([videosRequest, welfaresRequest]);

			let videos = videosResult.data.results;
			let welfares = welfaresResult.data.results;
			
			videos.forEach((currentValue, index) => {
				currentValue.imageUrl = welfares[index].url;
				currentValue.desc = currentValue.publishedAt.substr(currentValue.publishedAt.indexOf("-") + 1, 5) 
														+ currentValue.desc;
			});
			this.list = videos;
    }
  }
}
</script>

<style>
[v-lock] {
	display: none;
}
body{
	margin: 0;
	background: #F5FCFF;
}
.vertical-layout {
	display: flex;
	flex-direction: column;
}
.horizontal-layout {
	display: flex;
	flex-direction: row;
}
.header {
	width: 100%;
	height: 50px;
	background: #191111;
	color: white;
	font-size: 14px;
	position: fixed;
}
.header.horizontal-layout {
	align-items: center;
	padding-left: 8px;
	margin-top: -50px;
}
.container {
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 0px 2.5vw;
	margin-top: 50px;
}
img {
	width: 45vw;
}
.title {
	color: #626262;
  font-size: 14px;
  margin: 5px;
}
.box {
	width: 45vw;
  margin: 2px 0;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #CECECE;
}
</style>
