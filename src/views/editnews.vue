<template>
  <a-layout>
    <Header header="水系末端调查处理系统"></Header>
    <a-layout>
      <Sider></Sider>
      <a-layout-content id="c_content" style="position: relative">
        <div id="mapDiv" style="float: left;">
        </div>
        <div class="proMgr-map-tool ng-scope" ng-if="objOpera != 'view'" style="z-index: 99999;top: 30px;left: 30px">
          <ul class="drawTool">
            <li v-on:click="openPolylineTool" class=""><a id="doDraw" href="javascript:void(0);" title="开始绘制">
              <a-icon type="edit"/>
            </a></li>
            <li v-on:click="clearinfo" class=""><a id="clearDraw" href="javascript:void(0);" title="清除">
              <a-icon type="delete"/>
            </a></li>
            <li v-on:click="getmap" class=""><a id="showDraw" href="javascript:void(0);" title="显示">
              <a-icon type="message"/>
            </a></li>
          </ul>
        </div>
        <a-modal
          title="微小水体详情"
          v-model="visible_det"
          @ok="handleOk"
        >
          <a-row>
            <a-col :span="12">
              水体说明：
              <p>{{riverText}}</p>
            </a-col>
            <a-col :span="12">
              实拍视频：
              <p style="margin-top: 20px">
                <video style="width: 70%;margin-left: 15%" :src="riverVideo"
                       controls="controls">
                  your browser does not support the video tag
                </video>
              </p>
            </a-col>
            <a-col :span="24">
              <p>实拍图片：</p>
              <img v-for="name in riverImage" style=";padding: 10px 10px 10px 10px;width: 20%" :src="name" alt="">
            </a-col>
            <a-col>
              <p>经纬度：{{riverX}},{{riverY}}</p>
            </a-col>
            <a-col v-if="riverStatus==1" :span="12">状态：已审核</a-col>
            <a-col v-else :span="12">状态：未审核</a-col>
            <a-col v-if="riverStatus==1" :span="12">是否纳入管理：是</a-col>
            <a-col v-else :span="12">是否纳入管理：否</a-col>
            <!--<a-col style="margin-top: 10px" :span="12">一河一策：{{riverOneToOne}}</a-col>-->
            <a-col style="margin-top: 10px" :span="12">河长：：{{riverLong}}</a-col>
          </a-row>
        </a-modal>
        <div style="width: 30%;float: left;padding-left: 30px" @click="cid">
          <div style="margin-bottom: 10px">
            <a-input-search
              placeholder="搜索微小水体名称或描述"
              @search="onSearch"
              enterButton></a-input-search>
          </div>
          <a-table :columns="columns" :dataSource="data_all">
             <span slot="action1" slot-scope="text, record">
                 <a :data-x="record.riverX" :data-y="record.riverY" :data-id="record.riverId"
                    data-statu="edit">{{record.riverName}}</a>
              </span>
            <span slot="action" slot-scope="text, record">
                 <a :data-id="record.riverId" data-statu="det">预览</a>
              </span>
          </a-table>
        </div>
        <div id="xx" style="float: left;width: 70%;padding-top: 30px">
          <a-button style="width: 100%" type="primary" v-on:click="saveriver">保存绘制</a-button>
        </div>
        <div id="resultDiv"></div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  import {get, post} from "../util/axios";
  import {BASE_URL} from "../config/config";
  import {BASE_URLimg} from "../config/config";
  import {GetQueryString} from "../config/config";
  import {getUrlKey} from "../config/config";
  import moment from 'moment';

  const columns = [{
    title: '水系名称',
    dataIndex: 'riverName',
    scopedSlots: {customRender: 'action1'},
  }, {
    title: '水系状态',
    dataIndex: 'realstatus',
  }, {
    title: '操作',
    scopedSlots: {customRender: 'action'},
  }];
  export default {
    data() {
      return {
        confirmLoading: false,
        visible_ee: false,
        visible_det: false,
        visible_edit: false,
        columns,
        data_all: [],
        map: '',
        zoom: 12,
        center: '',
        localsearch: '',
        radius: 5000,
        infoWin: '',
        map_info: [],
        Explain: '',
        map_x: [],
        map_y: [],
        riverLong: '',
        riverStatus: '',
        riverText: '',
        riverVideo: '',
        riverImage: [],
        riverX: '',
        riverY: '',
        riverOneToOne: '',
        polygonTool: '',
        handler: '',
        riverMap: '',
        riverId: '',
        mapList: '',
      }
    },
    created() {
      // this.indexif();
      // this.onLoad();
      // this.newlist('f57a0d43b59611e99ca320898447c666');
    },
    beforeCreate() {

    },
    mounted() {
      // this.getmapinfo();
      this.newlist();
    },
    methods: {
      onSearch (value) {
        const params = new URLSearchParams();
        params.append('queryStr', value);
        post(`${BASE_URL}/v5/river/getRiverByNameAndText`, null,params).then(res => {
          if (res.code === 200) {
            let message = res.results;
            if(message.length>0){
              for (let j = 0; j < message.length; j++) {
                if (message[j].riverStatus == 1) {
                  message[j].realstatus = '已核实';
                } else {
                  message[j].realstatus = '未核实';
                }
              }
              this.data_all = message;
              this.riverId = message[0].riverId;
              if (message[0].mapList !== null) this.mapList = message[0].mapList[0];
              this.onLoad(message[0].riverX, message[0].riverY);
            }
            else {
              this.data_all = res.results;
              this.$message.error(`无搜索记录`, 2);
            }
          }
        });
      },
      newlist() {
        this.data_all = [];
        post(`${BASE_URL}/v5/river/getRiverList`, null,).then(res => {
          if (res.code === 200) {
            let message = res.results.riverList;
            for (let j = 0; j < message.length; j++) {
              if (message[j].riverStatus == 1) {
                message[j].realstatus = '已核实';
              } else {
                message[j].realstatus = '未核实';
              }
            }
            this.data_all = message;
            this.riverId = message[0].riverId;
            if (message[0].mapList !== null) this.mapList = message[0].mapList[0];
            this.onLoad(message[0].riverX, message[0].riverY);
          }
        });
      },
      attribute(e) {
        var p = e.target;
        // alert("map信息" + p.getLngLat().lng + "," + p.getLngLat().lat);
        const params = new URLSearchParams();
        params.append('x', p.getLngLat().lng);
        params.append('y', p.getLngLat().lat);
        post(BASE_URL + '/v5/river/getRiverByXY', null, params).then(res => {
          if (res.code === 200) {
            if (res.results.river.riverStatus == 1) {
              this.riverStatus = '已审核';
            } else {
              this.riverStatus = '未审核';
            }
            this.riverLong = res.results.river.riverLong;
            this.riverText = res.results.river.riverText;
            this.riverVideo = BASE_URL + res.results.river.riverVideo;
            if(res.results.river.imageList.length>0 && res.results.river.imageList.length<=9){
              for(let i=0;i<res.results.river.imageList.length;i++){
                // console.log(res.results.river.imageList[i]);
                this.riverImage[i]=BASE_URLimg+res.results.river.imageList[i];
              }

            }
            else if(res.results.river.imageList.length>9){
              for(let i=res.results.river.imageList.length;i>res.results.river.imageList.length-9;i--){
                for(let j=0;j<4;j++){
                  this.riverImage[j]=res.results.river.imageList[i];
                }
              }
            }
            else {
              this.riverImage=[];
            }
            this.riverX = res.results.river.riverX;
            this.riverY = res.results.river.riverY;
            this.riverOneToOne = res.results.river.riverOneToOne;
          }
        });
      },
      attribute1() {
        const params = new URLSearchParams();
        params.append('x', this.map_x[0]);
        params.append('y', this.map_y[0]);
        console.log(params);
        post(BASE_URL + '/v5/river/getRiverByXY', null, params).then(res => {
          if (res.code === 200) {
            if (res.results.river.riverStatus == 1) {
              this.riverStatus = '已审核';
            } else {
              this.riverStatus = '未审核';
            }
            this.riverLong = res.results.river.riverLong;
            this.riverText = res.results.river.riverText;
            this.riverVideo = BASE_URL + res.results.river.riverVideo;
            this.riverImage = res.results.river.riverImage;
            this.riverX = res.results.river.riverX;
            this.riverY = res.results.river.riverY;
            this.riverOneToOne = res.results.river.riverOneToOne;
          }
        });
      },
      map_move(x, y) {
        const points = [];
        this.map.clearOverLays();
        this.center = new T.LngLat(x, y);
        //设置显示地图的中心点和级别
        this.map.centerAndZoom(this.center, this.zoom);
        var point = new T.LngLat(x, y);
        var marker = new T.Marker(point);// 创建标注
        this.map.addOverLay(marker);
        for (let i = 0; i < this.mapList.length; i++) {
          points.push(new T.LngLat(this.mapList[i].y, this.mapList[i].x));
        }
        var line = new T.Polyline(points);
        //向地图上添加线
        this.map.addOverLay(line);
      },
      draw_xq_map(result) {
        if(result.getStatus() == 100) {
          var data = result.getData();
          for(var i = 0; i < data.length; i++){
            if(data[i].points){
              // 绘制行政区划
              // polygon(data[i].points);
              var pointsArr = [];
              for (var j = 0; j < data[i].points.length; j++) {
                var regionLngLats = [];
                var regionArr = data[i].points[j].region.split(",");
                for (var m = 0; m < regionArr.length; m++) {
                  var lnglatArr = regionArr[m].split(" ");
                  var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);
                  regionLngLats.push(lnglat);
                  pointsArr.push(lnglat);
                }
                //创建面对象
                var polygon = new T.Polygon(regionLngLats,{color: "green", opacity: 1, fillColor: "none", fillOpacity: 0.3});
                //向地图上添加行政区划面
                this.map.addOverLay(polygon);
              }
              //显示最佳比例尺
              this.map.setViewport(pointsArr);
            }
          }
        } else {
          result.getMsg();
        }
      },
      onLoad(x, y) {
        // this.center = new T.LngLat(this.map_x[0], this.map_y[0]);
        this.center = new T.LngLat(x, y);
        //初始化地图对象
        this.map = new T.Map("mapDiv");
        //设置显示地图的中心点和级别
        this.map.centerAndZoom(this.center, this.zoom);
        var point = new T.LngLat(x, y);
        var marker = new T.Marker(point);// 创建标注
        this.map.addOverLay(marker);
        const points = [];

        for (let i = 0; i < this.mapList.length; i++) {
          points.push(new T.LngLat(this.mapList[i].y, this.mapList[i].x));
        }
        var line = new T.Polyline(points);
        //向地图上添加线
        this.map.addOverLay(line);
        marker.addEventListener("click", this.attribute);
        var config = {
          showLabel: true,
          color: "blue", weight: 3, opacity: 0.5, fillColor: "#FFFFFF", fillOpacity: 0.5
        };
        //创建标注工具对象
        this.polygonTool = new T.PolygonTool(this.map, config);
        // 设置西青区行政区划图
        // 创建对象
        var administrative = new T.AdministrativeDivision();
        var config_map = {
          needSubInfo: false,
          needAll: false,
          needPolygon: true,
          needPre: true,
          searchType: 1,
          searchWord: "西青区"
        };
        administrative.search(config_map, this.draw_xq_map);
      },
      localsearchResult(result) {
        //清空地图及搜索列表
        clearAll();
        //创建圆
        createCircle();
        //解析点数据结果
        pois(result.getPois());
      },
      pois(obj) {
        if (obj) {
          //坐标数组，设置最佳比例尺时会用到
          var zoomArr = [];
          for (var i = 0; i < obj.length; i++) {
            //闭包
            (function (i) {
              //名称
              var name = obj[i].name;
              //地址
              var address = obj[i].address;
              //坐标
              var lnglatArr = obj[i].lonlat.split(" ");
              var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);

              var winHtml = "地址:" + address;

              //创建标注对象
              var marker = new T.Marker(lnglat);
              //地图上添加标注点
              this.map.addOverLay(marker);
              //注册标注点的点击事件
              marker.addEventListener("click", function () {
                this.showPosition(marker, name, winHtml);
              }, this);
              this.zoomArr.push(lnglat);

              //在页面上显示搜索的列表
              var a = document.createElement("a");
              a.href = "javascript://";
              a.innerHTML = name;
              a.onclick = function () {
                showPosition(marker, name, winHtml);
              }

            })(i);
          }
        }
      },
      createCircle() {
        var config = {
          color: "blue", //折线颜色
          fillColor: "#fff",    //填充颜色。当参数为空时，折线覆盖物将没有填充效果
          weight: "3", //折线的宽度，以像素为单位
          opacity: 0.5,    //折线的透明度，取值范围0 - 1
          fillOpacity: 0.4,
          lineStyle: "solid" //折线的样式，solid或dashed
        };
        //定义该矩形的显示区域
        var circle = new T.Circle(this.center, this.radius, config);
        this.map.addOverLay(circle);
      },
      showPosition(marker, name, winHtml) {
        if (this.infoWin) {
          this.map.removeOverLay(this.infoWin);
          this.infoWin = null;
        }
        var html = "<h3>" + name + "</h3>";
        html += winHtml;
        this.infoWin = new T.this.infoWindow(html);
        marker.openthis.infoWindow(this.infoWin);
      },
      clearAll() {
        this.map.clearOverLays();
      },
      addnew() {
        const menuid = 'f57a0d43b59611e99ca320898447c666';
        this.$router.push({path: '/news/editnew', query: {menuid: menuid}});
      },
      cid(e) {
        const id = e.target.dataset.id;
        let x = e.target.dataset.x;
        let y = e.target.dataset.y;
        const statu = e.target.dataset.statu;
        this.riverId = id;
        if (id && statu == 'det') {
          const params = new URLSearchParams();
          params.append('riverId', id);
          console.log(id);
          post(BASE_URL + '/v5/river/findRiverById', null, params).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.showModal_det();
              this.riverStatus = res.results.river.riverStatus;
              this.riverLong = res.results.river.riverLong;
              this.riverText = res.results.river.riverText;
              this.riverVideo = BASE_URL + res.results.river.riverVideo;
              if(res.results.river.imageList.length>0 && res.results.river.imageList.length<=9){
                for(let i=0;i<res.results.river.imageList.length;i++){
                  // console.log(res.results.river.imageList[i]);
                  this.riverImage[i]=BASE_URLimg+res.results.river.imageList[i];
                }

              }
              else if(res.results.river.imageList.length>9){
                for(let i=res.results.river.imageList.length;i>res.results.river.imageList.length-9;i--){
                  for(let j=0;j<4;j++){
                    this.riverImage[j]=res.results.river.imageList[i];
                  }
                }
              }
              else {
                this.riverImage=[];
              }
              this.riverX = res.results.river.riverX;
              this.riverY = res.results.river.riverY;
              this.riverOneToOne = res.results.river.riverOneToOne;
            } else {
            }
          });
        } else if (x && y && id) {
          this.riverId = id;
          const params = new URLSearchParams();
          params.append('riverId', id);
          post(BASE_URL+'/v5/river/findRiverById', null, params).then(res => {
            if (res.code === 200) {
              this.riverX=res.results.river.riverX;
              this.riverY=res.results.river.riverY;
              console.log(res);
              this.mapList = res.results.river.mapList[0];
              this.map_move(this.riverX, this.riverY);
            }
          });
        }
      },
      indexif() {
        if (localStorage.getItem('v2Token')) {
          const params = new URLSearchParams();
          params.append('token', localStorage.getItem('v2Token'));
          params.append('info', 'v2');
          post(`${BASE_URL}/v1/auth/validToken`, null, params).then(res => {
            console.log(params);
            if (res.code === 200) {
            } else if (res.code === 411) {
              localStorage.clear();
              window.location.href = "http://61.240.12.212:9081?info=v2";
            }
          });
        } else {
          if (getUrlKey('ST')) {
            const params = new URLSearchParams();
            params.append('st', getUrlKey('ST'));
            params.append('info', 'v2');
            post(`${BASE_URL}/v1/auth/validSt`, null, params).then(res => {
              console.log(params);
              if (res.code === 200) {
                console.log(res);
                localStorage.setItem('v2Token', res.results.token);
              }
            });
          } else {
            window.location.href = "http://61.240.12.212:9081?info=v2";
          }
        }
      },
      logout() {
        localStorage.clear();
        window.location.href = "http://61.240.12.212:9081";
      },
      showModal() {
        this.visible = true
      },
      handleOk(e) {
        this.ModalText = 'The modal will be closed after two seconds';
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      handleCancel(e) {
        console.log('Clicked cancel button');
        this.visible = false
      },
      slider_active(e) {
        console.log(e);
        switch (e) {
          case 'f57a0d43b59611e99ca320898447c563':
            this.title_left = "新闻动态列表";
            break;
          case '2f455c04b59411e99ca320898447c543':
            this.title_left = "政策法规动态列表";
            break;
          case 'f57a0d43b59611e99ca320898447c543':
            this.title_left = "信息公开动态列表";
            break;
          case '21585d54ba8a11e9aba20242ac110002':
            this.title_left = "党政工作动态列表";
            break;
          case '682a0a21ba8a11e9aba20242ac110002':
            this.title_left = "水务动态列表";
            break;
          case '6e5cfec8ba8a11e9aba20242ac110002':
            this.title_left = "河长动态列表";
            break;
          case '732a97edba8a11e9aba20242ac110002':
            this.title_left = "两会建议动态列表";
            break;
          case '797ac176ba8a11e9aba20242ac110002':
            this.title_left = "防汛建议动态列表";
            break;
          case '8b0f6bc6ba8a11e9aba20242ac110002':
            this.title_left = "两会提案动态列表";
            break;
          case '982ebcf9ba8a11e9aba20242ac110002':
            this.title_left = "政民零距离动态列表";
        }
      },
      showModal_det() {
        this.visible_det = true
      },
      openPolylineTool() {
        let ccc = this.map.getOverlays();
        if (ccc.length > 1) {
          this.$message.error(`请先删除上段河流轨迹`, 2);
          return;
        }

        if (this.handler) this.handler.close();
        this.handler = new T.PolylineTool(this.map);
        this.handler.open();
      },
      clearinfo() {
        let ccc = this.map.getOverlays();
        if (ccc[1]) {
          this.map.removeOverLay(ccc[1]); //从地图上移除。
        } else {
          this.$message.error(`请先绘制河流轨迹`, 2);
        }
      },
      getmap() {
        let ccc = this.map.getOverlays();
        if (ccc[1]) {
          const river_map = [];
          river_map['lat'];
          river_map['lng'];
          console.log(river_map);
          for (let i = 0; i < ccc[1].jt.CO.ht.length; i++) {
            river_map[i] = [ccc[1].jt.CO.ht[i].lat, ccc[1].jt.CO.ht[i].lng];
          }
          this.riverMap = JSON.stringify(river_map);
          this.$message.success(`河流轨迹为${this.riverMap}`, 2);
        } else {
          this.$message.error(`请先绘制河流轨迹`, 2);
        }
        return this.riverMap;
        // console.log(river_map);
      },
      saveriver() {
        let ccc = this.map.getOverlays();
        if (ccc[1]) {
          const river_map = [];
          river_map['lat'];
          river_map['lng'];
          console.log(river_map);
          for (let i = 0; i < ccc[1].jt.CO.ht.length; i++) {
            river_map[i] = [ccc[1].jt.CO.ht[i].lat, ccc[1].jt.CO.ht[i].lng];
          }
          this.riverMap = JSON.stringify(river_map);
          const params = new URLSearchParams();
          params.append('riverId', this.riverId);
          params.append('riverMap', this.riverMap);
          post(BASE_URL + '/v5/river/insertMapById', null, params).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.$message.success(`成功`, 2);
            } else {
            }
          });
        }
      },
    }
  }
</script>

<style>
  #components-form-demo-normal-login .login-form {
    max-width: 300px;
  }

  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }

  #components-form-demo-normal-login .login-form-button {
    width: 100%;
  }

  #c_content {
    padding-left: 30px;
    padding-top: 30px;
    padding-right: 30px;
  }

  .ant-layout-sider-children ul li a {
    color: #6c6c6c;
  }

  #mapDiv {
    width: 70%;
    height: 760px
  }

  input, b, p {
    margin-left: 5px;
    font-size: 14px
  }

  .esriSimpleSliderTL {
    top: 20px;
    left: 20px;
  }

  .esriSimpleSlider {
    position: absolute;
    text-align: center;
    border: 1px solid #57585A;
    background-color: #FFF;
    color: #4C4C4C;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -o-border-radius: 5px;
    border-radius: 5px;
  }

  .esriSimpleSliderVertical .esriSimpleSliderIncrementButton {
    border-bottom: 1px solid #57585A;
    -webkit-border-radius: 5px 5px 0 0;
    border-radius: 5px 5px 0 0;
  }

  .esriSimpleSlider div {
    width: 30px;
    height: 30px;
    font-size: 24px;
    font-family: verdana, helvetica;
    line-height: 25px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
  }

  .esriSimpleSlider div {
    width: 30px;
    height: 30px;
    font-size: 24px;
    font-family: verdana, helvetica;
    line-height: 25px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
  }

  .esriIconFallbackText {
    clip: rect(0 0 0 0);
    overflow: hidden;
    position: absolute;
    height: 1px;
    width: 1px;
  }

  .proMgr-map-tool {
    position: absolute;
    top: 15px;
    z-index: 1;
    border: 1px solid #4c4949;
    border-radius: 6px;
    background-color: #fff;
    overflow: hidden;
  }

  .proMgr-map-tool {
    position: absolute;
    top: 15px;
    z-index: 1;
    border: 1px solid #4c4949;
    border-radius: 6px;
    background-color: #fff;
    overflow: hidden;
  }

  .proMgr-map-tool .drawTool {
    margin: 0;
    padding: 0;
  }

  .proMgr-map-tool .drawTool {
    margin: 0;
    padding: 0;
  }

  .proMgr-map-tool .drawTool li:first-child {
    border-right: 1px solid #b9b7b7;
  }

  .proMgr-map-tool .drawTool li {
    list-style: none;
    float: left;
    border-right: 1px solid #b9b7b7;
  }

  .proMgr-map-tool .drawTool li {
    list-style: none;
    float: left;
    /* border: 1px solid #4c4949; */
  }

  .proMgr-map-tool .drawTool li a {
    padding: 0;
    width: 40px;
    height: 36px;
    line-height: 38px;
    text-align: center;
    display: inline-block;
    font-size: 16px;
  }

  .proMgr-map-tool .drawTool li a {
    padding: 5px;
    width: 40px;
    height: 35px;
    line-height: 24px;
    text-align: center;
    display: inline-block;
  }
</style>
