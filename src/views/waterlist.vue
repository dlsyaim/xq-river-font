<template>
  <a-layout>
    <Header header="水系末端调查处理系统"></Header>
    <a-layout>
      <a-modal
        title="微小水体编辑"
        v-model="visible_edit"
        :visible="visible_ee"
        :confirmLoading="confirmLoading"
        @ok="edit"
      >
        <p>水体说明:</p><input name="title" class="ant-input" type="text" v-model="riverText">
        <p>经度:</p><input name="title" class="ant-input" type="text" v-model="riverX">
        <p>纬度:</p><input name="title" class="ant-input" type="text" v-model="riverY">
        <p style="margin-top: 10px">状态：</p>
        <label>
          <select class="ant-input" v-model="riverStatus">
            <option value="1">已审核</option>
            <option value="0">未审核</option>
          </select>
        </label>
        <p style="margin-top: 10px">是否纳入管理：</p>
        <label>
          <select class="ant-input" v-model="riverStatus">
            <option value="1">是</option>
            <option value="0">否</option>
          </select>
        </label>
        <!--<p>一河一策:</p>-->
        <!--<input name="title" class="ant-input" type="text" v-model="riverOneToOne">-->

        <p>河长:</p><input name="title" class="ant-input" type="text" v-model="riverLong">
        <p style="margin-top: 10px">上传图片：</p>
        <a-upload name="file" :multiple="true" :action='uploadurl' :headers="token"
                  @change="handleChange_img">
          <a-button>
            <a-icon  type="upload"/>
            上传图片
          </a-button>
        </a-upload>
        <p style="margin-top: 10px">上传视频：</p>
        <a-upload name="file" :multiple="true" :action='uploadurl' :headers="token"
                  @change="handleChange_video">
          <a-button>
            <a-icon  type="upload"/>
            上传视频
          </a-button>
        </a-upload>
      </a-modal>
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
            <img v-for="name in riverImage" style="padding: 10px 10px 10px 10px;width: 20%" :src="name" alt="">
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
      <Sider></Sider>
      <a-layout-content id="c_content">
        <a-tabs defaultActiveKey="1" @change="callback" @click="cid">
          <a-tab-pane tab="所有微小水系列表" key="1">
            <a-table :columns="columns" :dataSource="data_all">
              <span slot="action" slot-scope="text, record">
                 <a :data-id="record.riverId" data-statu="det">预览</a>
                 <a-divider type="vertical"/>
                 <a :data-id="record.riverId" data-statu="edit">编辑</a>
                 <a-divider type="vertical"/>
                 <a :data-id="record.riverId" data-statu="del">删除</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane tab="未核实微小水系列表" key="2">
            <a-table :columns="columns" :dataSource="data_unread">
              <span slot="action" slot-scope="text, record">
                 <a :data-id="record.riverId" data-statu="det">预览</a>
                 <a-divider type="vertical"/>
                 <a :data-id="record.riverId" data-statu="edit">编辑</a>
                 <a-divider type="vertical"/>
                 <a :data-id="record.riverId" data-statu="del">删除</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane tab="已核实微小水系列表" key="3">
            <a-table :columns="columns" :dataSource="data_read">
              <span slot="action" slot-scope="text, record">
                 <a :data-id="record.riverId" data-statu="det">预览</a>
                 <a-divider type="vertical"/>
                 <a :data-id="record.riverId" data-statu="edit">编辑</a>
                 <a-divider type="vertical"/>
                 <a :data-id="record.riverId" data-statu="del">删除</a>
              </span>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
  import {get, post} from "../util/axios";
  import {BASE_URL} from "../config/config";
  import {getUrlKey} from "../config/config";
  import moment from 'moment';
  import {BASE_URLimg} from "../config/config";
  import {getCookie,setCookie,delCookie} from "../util/util";

  const columns = [{
    title: '水系名称',
    dataIndex: 'riverName',
  }, {
    title: '水系描述',
    dataIndex: 'riverText',
  }, {
    title: '水系状态',
    dataIndex: 'realstatus',
  }, {
    title: '发现人',
    dataIndex: 'findPeople',
  }, {
    title: '操作',
    scopedSlots: {customRender: 'action'},
  }];
  export default {
    data() {
      return {
        editid:'',
        confirmLoading: false,
        visible_ee: false,
        token:{
          'token': getCookie('v5Token')
        },
        data_all: [],
        data_unread: [],
        data_read: [],
        columns,
        visible_det: false,
        visible_edit: false,
        riverLong: '',
        riverStatus: '',
        riverText: '',
        riverVideo: '',
        riverImage: [],
        riverX: '',
        riverY: '',
        riverOneToOne: '',
        uploadurl:BASE_URL+'/v5/upload/upload',
        video:'',
        image:'',
      }
    },
    created() {
      this.newlist();
    },
    beforeCreate() {
    },
    methods: {
      edit(){
        this.confirmLoading = true;
        setTimeout(() => {
          const params = new URLSearchParams();
          params.append('riverId', this.editid);
          params.append('riverStatus', this.riverStatus);
          params.append('riverLong', this.riverLong);
          params.append('riverText', this.riverText);
          if(this.video){
            params.append('riverVideo', this.video);
          }
          if(this.image){
            params.append('riverImage', this.image);
          }
          params.append('riverX', this.riverX);
          params.append('riverY', this.riverY);
          params.append('riverOneToOne', this.riverOneToOne);
          post(BASE_URL + '/v5/river/updateRiver', null, params).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.$message.success(`成功`,2);
              this.newlist();
            } else {
              this.$message.error(`失败`,2);
            }
          });
          this.visible_edit = false;
          this.confirmLoading = false;
        }, 1000);
      },
      callback(key) {
        console.log(key)
      },
      newlist() {
        this.data_all = [];
        this.data_read = [];
        this.data_unread = [];
        post(`${BASE_URL}/v5/river/getIdRiverList`, null,).then(res => {
          if (res.code === 200) {
            let message = res.results.list;
            for (let j = 0; j < message.length; j++) {
              if (message[j].riverStatus == 1) {
                message[j].realstatus = '已核实';
              } else {
                message[j].realstatus = '未核实';
              }
            }
            this.data_all = message;
            for (let i = 0; i < message.length; i++) {
              if (message[i].riverStatus == 1) {
                this.data_read[i] = message[i];
              } else {
                this.data_unread[i] = message[i];
              }
            }
            this.data_read = this.filter_array(this.data_read);
            this.data_unread = this.filter_array(this.data_unread);
          }
        });
      },
      cid(e) {
        const id = e.target.dataset.id;
        const statu = e.target.dataset.statu;
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
              this.riverVideo = BASE_URLimg + res.results.river.riverVideo;
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
        } else if (id && statu == 'edit') {
          this.editid=id;
          const params = new URLSearchParams();
          params.append('riverId', id);
          post(BASE_URL + '/v5/river/findRiverById', null, params).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.showModal_edit();
              this.riverStatus = res.results.river.riverStatus;
              this.riverLong = res.results.river.riverLong;
              this.riverText = res.results.river.riverText;
              this.riverVideo = BASE_URL + res.results.river.riverVideo;
              this.riverX = res.results.river.riverX;
              this.riverY = res.results.river.riverY;
              this.riverOneToOne = res.results.river.riverOneToOne;
            } else {
            }
          });
        } else if (id && statu == 'del') {
          const params = new URLSearchParams();
          params.append('riverId', id);
          post(BASE_URL + '/v5/river/deleteRiver', null, params).then(res => {
            if (res.code === 200) {
              this.$message.success(`成功`,2);
              this.newlist();
            } else {
              this.$message.error(`失败`,2);
            }
          });
        }
      },
      filter_array(array) {
        return array.filter(item => item);
      },
      showModal_det() {
        this.visible_det = true
      },
      showModal_edit() {
        this.visible_edit = true
      },
      handleOk(e) {
        console.log(e);
        this.visible = false
      },
      claerinput(){
        this.riverStatus = '';
        this.riverLong = '';
        this.riverText = '';
        this.riverVideo = '';
        this.riverImage = '';
        this.riverX = '';
        this.riverY = '';
        this.riverOneToOne = '';
      },
      handleChange_video(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          this.$message.success(`${info.file.name} 视频上传成功`,2);
          this.video = info.file.response.results.relativePath;
          console.log(this.video);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 视频上传失败`,2);
        }
      },
      handleChange_img(info) {
        const img={};
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          this.$message.success(`${info.file.name} 图片上传成功`,2);

          for(let i=0;i<info.fileList.length;i++){
            img[i]=info.fileList[i].response.results.relativePath;
          }
          this.image =JSON.stringify(img);
          console.log(this.image);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 图片上传失败`,2);
        }
      },
    },
  };
</script>

<style>
  #sider .class1 {
    background-color: #4672cd;
    color: white;
  }

  #components-form-demo-normal-login .login-form {
    max-width: 300px;
  }

  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }

  #components-form-demo-normal-login .login-form-button {
    width: 100%;
  }

  #sider {
    background-color: rgb(236, 236, 236);
  }

  #sider ul {
    list-style: none;
    padding-left: 0;
    text-align: center;
  }

  #sider ul li {
    border: 1px rgb(223, 223, 223) solid;
    height: 53px;
    line-height: 53px;
    color: white;
  }

  #c_content {
    padding-left: 30px;
    padding-top: 30px;
    padding-right: 30px;
  }

  .ant-layout-sider-children ul li a {
    color: #6c6c6c;
  }
</style>
