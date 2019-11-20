
<template>
  <div>
<!--    <a-row style="text-align: center">-->
<!--      <a-col class="headStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">-->
<!--        <span @click="goBack" style="display: inline-block;position: absolute;left: 0;font-size: 18px"><a-icon type="left" /> 返回</span>-->
<!--        <span>我上报的微小水体</span>-->
<!--      </a-col>-->
<!--    </a-row>-->
    <a-row style="margin-bottom: 25px">
      <a-col class="bodyStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">
        <div @click="handlerTableClick">
          <a-table
            :rowKey="record => record.riverId"
            :columns="columns"
            :dataSource="data"
            :pagination="false"
            :loading="loading"
          >
            <span slot="riverName" slot-scope="item">
              <span data-method="riverName" :data-id="item.riverId" class="table-operation" >{{item.riverName}}</span>
            </span>
            <span slot="action" slot-scope="item">
              <span data-method="action" :data-id="item.riverId" class="table-operation">编辑</span>
            </span>
          </a-table>
        </div>
      </a-col>
    </a-row>
    <a-row style="text-align: center;position: fixed;bottom: 0;width: 100%">
      <a-col class="footerStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">
        <span @click="report" style="display: inline-block;width: 100%;height: 100%">上报微小水体</span>
      </a-col>
    </a-row>
    <a-modal
      title=""
      :destroyOnClose="true"
      :closable="true"
      :visible="modalVisible"
      :footer="null"
      @cancel="modalVisible=false"
    >
      <div style="padding-bottom: 10px;margin-top: 20px">
        <span style="width: 25%;color: skyblue">水系名称：</span>
        <span style="width: 75%;margin-left: 10px">{{selected.riverName}}</span>
      </div>
      <div style="padding-bottom: 10px">
        <span style="width: 25%;color: skyblue">水系描述：</span>
        <span style="width: 75%;margin-left: 10px">{{selected.riverText}}</span>
      </div>
      <div style="padding-bottom: 10px">
        <span style="width: 25%;display: block;color: skyblue">水系照片：</span>
        <img @click="showImage" v-for="(item, index) in imageCounter" style="width: 33%;height: 70px;border-radius: 10px;border: silver 3px solid" :key="index" :src="item" alt="照片">
        <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false" style="text-align: center;">
          <img alt="照片" style="width: 100%;margin: 25px 0 0 0;" :src="imageUrl" />
          <div style="margin-top: 5px">水系名称：{{selected.riverName}}</div>
          <div>水系描述：{{selected.riverText}}</div>
        </a-modal>
      </div>
      <div style="padding-bottom: 10px">
        <span style="width: 25%;display: block;color: skyblue">水系视频：</span>
        <video v-if="this.selected.riverVideo" style="width: 100%" controls :src="videoUrl"></video>
      </div>
    </a-modal>
  </div>
</template>

<script>
    import {post, get} from "../../util/axios";
    import axios from "axios";
    import {BASE_URL, BASE_URLimg} from "../../config/config";

    const columns = [
        {title:'水系名称', key: 'riverName', scopedSlots: { customRender: 'riverName' },align: 'center'},
        {title:'水系描述', dataIndex:'riverText', align: 'center'},
        {title:'操作', key: 'action', scopedSlots: { customRender: 'action' },align: 'center',width:'20%'},
    ];
    export default {
        name: "microWaterNewList",
        data() {
            return {
                columns,
                data:[],
                BASE_URL,
                imageCounter: [],
                loading:false,
                modalVisible:false,
                previewVisible:false,
                imageUrl: "",
                videoUrl: "",
                list:[],
                selected:{},
                userId: '',
            }
        },
        mounted() {
            this.getList();
            this.getUserNameId();
        },
        methods: {
            getUserNameId(){
                var url = location.search; //获取url中"?"符后的字串
                if (url.indexOf("?") != -1) {
                    const str = url.split("userId=")[1];
                    const strstr = str.split("&")[0];
                    this.userId = strstr.join('');
                    this.$message.warn('路由传参获取userId' + this.userId);
                };
                if (!this.userId) {
                    const myId = getUserId();
                    this.$message.warn('调用方法获取userId' + this.userId);
                    this.userId = myId;
                }

            },
            getList() {
                const params = {
                    'userId':"ee67b73bf4bc11e9a71f0242ac110005",//this.userId,
                    'pageNo':1
                };
                axios({
                    method: 'post',
                    url: `${BASE_URL}/v5/river/getIdRiverList`,
                    // headers: {
                    //     'token': '',
                    // },
                    params:params
                }).then(res=>{
                        console.log(res)
                        if (res.status == 200) {
                            this.handleData(res.data.results.list);
                        }else {
                            this.$message.error('服务器出错')
                        }
                    })
                    // .catch(error=>{//需要理解一下
                    //     console.log(error);
                    // })

            },
            handleData(list) {
                list.forEach((item, index) => {
                    item.index = index + 1;
                });
                this.data = list;
            },
            handlerTableClick(e) {//表格点击操作
                this.imageCounter = [];
                this.videoUrl =  "";
                const id = e.target.dataset.id;
                const method = e.target.dataset.method;
                if (id && method) {
                    if (method === 'riverName') {//查看详情
                        //请求详情数据
                        const params = {'riverId': id};
                        axios({
                            method: 'post',
                            url: `${BASE_URL}/v5/river/findRiverById`,
                            // headers: {
                            //     'token': '',
                            // },
                            params:params
                        }).then(res=>{
                            if (res.status == 200) {
                                console.log(res);
                                this.selected = res.data.results.river;
                                // console.log(this.selected);
                                if (this.selected.imageList) {
                                    const allUrl = this.selected.imageList;
                                    allUrl.forEach(item=>{
                                        item = BASE_URLimg + item;
                                        this.imageCounter.push(item)
                                    })
                                };
                                this.videoUrl = BASE_URLimg + this.selected.riverVideo;
                            }
                        })
                        this.modalVisible = true;
                    }else if(method === 'action') {//编辑每条数据
                        this.$router.push({path: '/microWaterBody/microWaterEdit',query:{'riverId':id,'userId':this.userId}});
                    }
                }
            },
            report(){//上报后路由跳转至详情页
                this.$router.push({path: '/microWaterBody/microWaterNew',query:{'userId':this.userId}});
            },
            goBack() {
                this.$router.go(-1);
            },
            showImage(value) {
                this.previewVisible = true;
                this.imageUrl = value.target.currentSrc;
            },
        }
    }
</script>

<style scoped>
  .headStyle{
    background-color: skyblue;
    height: 70px;
    line-height: 70px;
    font-size: 22px;
    color: whitesmoke;
  }
  .bodyStyle{
    padding: 20px 20px  ;
  }
  .ant-upload.ant-upload-select-picture-card{
    width: 40px;
    height: 40px;
  }
  .table-operation{
    color: cornflowerblue;
  }
  .footerStyle{
    background-color: skyblue;
    height: 50px;
    line-height: 50px;
    font-size: 22px;
    color: whitesmoke;
    border-radius: 5px 5px;
  }
</style>
