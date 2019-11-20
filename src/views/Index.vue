<template>
  <a-layout>
    <Header header="水系末端调查处理系统"></Header>
    <a-layout>
      <Sider></Sider>
      <a-layout-content id="c_content">
        <div id="mapDiv" style="float: left">
        </div>
        <div style="width: 30%;float: left;padding-left: 30px">
          <div style="background-color: #438afe;color: white;padding-left: 20px;padding-top: 10px;padding-bottom: 10px">
            <p style="margin: 0">微小水体详情</p>
          </div>
          <br>
          <div>
            <a-row>
              <a-col :span="12">水体名称： {{riverName}}</a-col>
              <a-col :span="12">水体说明：{{riverText}}</a-col>
              <a-col :span="12">状态： {{riverStatus}}</a-col>
              <a-col :span="12">河长：{{riverLong}}</a-col>
              <a-col :span="12">经纬度：{{riverX}}, {{riverY}}</a-col>
              <a-col :span="24">
                实拍图片：
                <a-row v-if="riverImage.length == 0">
                  <a-col :span="24">暂无图片</a-col>
                </a-row>
                <a-row>
                  <a-col :span="12" v-for="image_url in riverImage" :key='image_url' style="margin: 10px 0px;">
                    <img :src="image_url" alt="">
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="24">
                实拍视频：
              </a-col>
              <a-col :span="24">
                <video style="width: 100%;" :src="riverVideo"
                     controls="controls">
                  your browser does not support the video tag
                </video>
              </a-col>
            </a-row>
          </div>
        </div>
        <div id="resultDiv"></div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  import {get, post} from "../util/axios";
  import {BASE_URL,BASE_9081} from "../config/config";
  import {BASE_URLimg} from "../config/config";
  import {BASE_URLc} from "../config/config";
  import {GetQueryString} from "../config/config";
  import {getUrlKey} from "../config/config";
  import moment from 'moment';
  import {getCookie,setCookie,delCookie} from "../util/util";

  export default {
    data() {
      return {
        map: '',
        zoom: 12,
        center: '',
        localsearch: '',
        radius: 5000,
        infoWin: '',
        map_info: [],
        Explain: '',
        map_x:[],
        map_y:[],
        riverLong:'',
        riverStatus:'',
        riverText:'',
        riverName: '',
        riverVideo:'',
        riverImage:[],
        riverX:'',
        riverY:'',
        riverOneToOne:'',
      }
    },
    created() {
      // this.onLoad();
      // this.newlist('f57a0d43b59611e99ca320898447c666');
    },
    beforeCreate() {

    },
    mounted() {
      this.getmapinfo();
    },
    methods: {
      getmapinfo(){
        this.indexif();
      },
      index_c(){
        post(BASE_URL+'/v5/river/getRiverList', null, ).then(res => {
          if (res.code === 200) {
            for (let i=0; i<res.results.riverList.length; i++){
              this.map_x[i]=res.results.riverList[i].riverX;
              this.map_y[i]=res.results.riverList[i].riverY;
            }
            this.onLoad();
            this.attribute1();
          }
        });
      },
      attribute(e) {
        var p = e.target;
        // alert("map信息" + p.getLngLat().lng + "," + p.getLngLat().lat);
        const params = new URLSearchParams();
        params.append('x',  (p.getLngLat().lng).toFixed(5));
        params.append('y',  (p.getLngLat().lat).toFixed(5));
        post(BASE_URL+'/v5/river/getRiverByXY', null, params).then(res => {
          if (res.code === 200) {
            if(res.results.river.riverStatus==1){
              this.riverStatus='已审核';
            } else {
              this.riverStatus='未审核';
            }
            this.riverLong=res.results.river.riverLong;
            this.riverText=res.results.river.riverText;
            this.riverVideo=BASE_URLimg+res.results.river.riverVideo;
            this.riverName = res.results.river.riverName;

            if (res.results.river.imageList != null) {
              if (res.results.river.imageList.length>0 && res.results.river.imageList.length<=4){
                for(let i=0;i<res.results.river.imageList.length;i++){
                  // console.log(res.results.river.imageList[i]);
                  this.riverImage[i]=BASE_URLimg+res.results.river.imageList[i];
                }

              } else if(res.results.river.imageList.length>4){
                for(let i=res.results.river.imageList.length;i>res.results.river.imageList.length-4;i--){
                  for(let j=0;j<4;j++){
                    this.riverImage[j]=res.results.river.imageList[i];
                  }
                }
              }
            } else {
              this.riverImage=[];
            }
            console.log(this.riverImage);
            this.riverX=res.results.river.riverX;
            this.riverY=res.results.river.riverY;
            this.riverOneToOne=res.results.river.riverOneToOne;
          }
        });
      },
      attribute1() {
        const params = new URLSearchParams();
        params.append('x', this.map_x[0]);
        params.append('y', this.map_y[0]);
        console.log(params);
        post(BASE_URL+'/v5/river/getRiverByXY', null, params).then(res => {
          if (res.code === 200) {
            console.log("=====================");
            console.log(res.results);
            if(res.results.river.riverStatus==1){
              this.riverStatus='已审核';
            } else {
              this.riverStatus='未审核';
            }
            this.riverLong=res.results.river.riverLong;
            this.riverText=res.results.river.riverText;
            this.riverVideo=BASE_URLimg+res.results.river.riverVideo;
            this.riverName = res.results.river.riverName;
            if (res.results.river.imageList != null) {
              if (res.results.river.imageList.length>0 && res.results.river.imageList.length<=4){
                for(let i=0;i<res.results.river.imageList.length;i++){
                  // console.log(res.results.river.imageList[i]);
                  this.riverImage[i]=BASE_URLimg+res.results.river.imageList[i];
                }

              } else if(res.results.river.imageList.length>4){
                for(let i=res.results.river.imageList.length;i>res.results.river.imageList.length-4;i--){
                  for(let j=0;j<4;j++){
                    this.riverImage[j]=res.results.river.imageList[i];
                  }
                }
              }
            } else {
              this.riverImage=[];
            }
            this.riverX=res.results.river.riverX;
            this.riverY=res.results.river.riverY;
            this.riverOneToOne=res.results.river.riverOneToOne;
          }
        });
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
      onLoad() {
        // this.center = new T.LngLat(this.map_x[0], this.map_y[0]);
        this.center = new T.LngLat(117.0043082200, 39.1413676500);
        //初始化地图对象
        this.map = new T.Map("mapDiv");
        //设置显示地图的中心点和级别
        this.map.centerAndZoom(this.center, this.zoom);
        //创建信息窗口对象
        var bounds = this.map.getBounds();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var pointArray = new Array();
        var lngSpan = Math.abs(sw.lng - ne.lng);
        var latSpan = Math.abs(ne.lat - sw.lat);
        for (var i = 0; i < this.map_x.length; i++) {
          var point = new T.LngLat(this.map_x[i], this.map_y[i]);
          var marker = new T.Marker(point);// 创建标注
          this.map.addOverLay(marker);
          pointArray[i] = new T.LngLat(i, '这是第' + i + '个');
          marker.addEventListener("click", this.attribute);
        }
        // 随机向地图添加25个标注
        var infoWin1 = new T.InfoWindow();
        var sContent =
          "<div style='margin:0px;'>" +
          "<div style='margin:10px 10px; '>" +
          "<img style='float:left;margin:0px 10px' src='http://lbs.tianditu.gov.cn/images/logo.png' width='101' height='49' title='天安门'/>" +
          "<div style='margin:10px 0px 10px 120px;'>电话 : (010)88187700 <br>地址：北京市顺义区机场东路国门商务区地理信息产业园2号楼天地图大厦" +
          "</div>" +
          "<input  id='keyWord' value='机场' type='text' style='border: 1px solid #cccccc;width: 180px;height: 20px;line-height: 20px;padding-left: 10px;display: block;float: left;'>" +
          "<input style='margin-left:195px;  width: 80px;height: 24px; text-align: center; background: #5596de;color: #FFF;border: none;display: block;cursor: pointer;' type='button' value='周边搜索'  onClick=\"localsearch.searchNearby(document.getElementById('keyWord').value,center,radius)\">" +
          "</div>" +
          "</div>";
        // infoWin1.setContent(sContent);
        // marker.addEventListener("click", function () {
        //   marker.openInfoWindow(infoWin1);
        // });// 将标注添加到地图中
        var config = {
          pageCapacity: 10,	//每页显示的数量
          onSearchComplete: this.localSearchResult	//接收数据的回调函数
        };
        //创建搜索对象
        const localsearch = new T.LocalSearch(this.map, config);

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
        const methd = e.target.dataset.methd;
        const menuid = 'f57a0d43b59611e99ca320898447c666';
        if (id && methd == 'del') {
          const params = new URLSearchParams();
          params.append('newId', id);
          console.log(id);
          post(`${BASE_URLa}/v2/new/deleteNew`, null, params).then(res => {
            if (res.code === 200) {
              this.newlist('f57a0d43b59611e99ca320898447c666');
              this.$message.success(`成功`, 2);
            }
          });
        } else if (id && methd == 'edit') {
          this.$router.push({path: '/news/editnew', query: {id: id, menuid: menuid, typeid: 1}});
        } else if (id && methd == 'det') {
          this.$router.push({path: '/news/editnew', query: {id: id, menuid: menuid, typeid: 0}});
        }
      },
      newlist(e) {
        const params = new URLSearchParams();
        params.append('menuId', e);
        post(`${BASE_URLa}/v2/menu/findMenuById`, null, params).then(res => {
          if (res.code === 200) {
            const data = res.results.menu.newList;
            for (var i = 0; i < res.results.menu.newList.length; i++) {
              data[i].newtime = moment(data[i].createDate).format('L');
              data[i].status = data[i].status > 0 ? '发布' : '未发布';
              data[i].newId1 = i + 1;
            }
            this.data = data;
            console.log(this.data);
          }
        });
      },
      indexif() {
        if (getCookie('v5Token')) {
          const params = new URLSearchParams();
          params.append('token', getCookie('v5Token'));
          params.append('info', 'v5');
          post(`${BASE_URLc}/v1/auth/validToken`, null, params).then(res => {
            console.log(params);
            if (res.code === 200) {
              this.index_c();
            } else if (res.code === 411) {
              console.log('token 失效');
              // localStorage.clear();
              // window.location.href = BASE_9081 + "?info=v5&from=" + window.location.origin + window.location.pathname;
              delCookie('v5Token');
              window.location.href = BASE_9081 + "?info=v5&from=" + window.location.origin + window.location.pathname;
            }
          });
        }
        else {
          if (getUrlKey('ST')) {
            const params = new URLSearchParams();
            params.append('st', getUrlKey('ST'));
            params.append('info', 'v5');
            post(`${BASE_URLc}/v1/auth/validSt`, null, params).then(res => {
              console.log(params);
              if (res.code === 200) {
                console.log(res);
                let expireDays = 1000 * 60 * 60 * 24 ;
                setCookie('v5Token', res.results.token,expireDays);
                if(getCookie('v5Token')){
                  this.index_c();
                }
              }
            });
          } else {
            window.location.href = BASE_9081 + "?info=v5&from=" + window.location.origin + window.location.pathname;
          }
        }
      },
      logout() {
        // localStorage.clear();
        // window.location.href =BASE_9081;
        delCookie('v5Token');
        window.location.href = BASE_9081;
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
    },
  };
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
    height: 800px
  }

  input, b, p {
    margin-left: 5px;
    font-size: 14px
  }
</style>
