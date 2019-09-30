<template>
  <a-layout>
    <Header header="水系末端调查处理系统"></Header>
    <a-layout>
      <Sider></Sider>
      <a-layout-content id="c_content">
        <a-tabs defaultActiveKey="1" @change="callback" @click="cid">
          <a-tab-pane tab="所有消息列表" key="1">
            <a-table :columns="columns" :dataSource="data_all">
              <span slot="action" slot-scope="text, record">
                <a v-if="record.messageStatus==1" style="min-width: 100px;display: block;color: gray">已读</a>
                <a v-else :data-id="record.messageId" :data-statu="record.messageStatus" style="min-width: 100px;display: block">确认</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane tab="未读消息列表" key="2">
            <a-table :columns="columns" :dataSource="data_unread">
              <span slot="action" slot-scope="text, record">
                <a v-if="record.messageStatus==1" style="min-width: 100px;display: block;color: gray">已读</a>
                <a v-else :data-id="record.messageId" :data-statu="record.messageStatus" style="min-width: 100px;display: block">确认</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane tab="已读消息列表" key="3">
            <a-table :columns="columns" :dataSource="data_read">
              <span slot="action" slot-scope="text, record">
                <a v-if="record.messageStatus==1" style="min-width: 100px;display: block;color: gray">已读</a>
                <a v-else :data-id="record.messageId" :data-statu="record.messageStatus" style="min-width: 100px;display: block">确认</a>
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

  const columns = [{
    title: '消息内容',
    dataIndex: 'content',
  }, {
    title: '消息状态',
    dataIndex: 'realstatus',
  }, {
    title: '消息关联水体',
    dataIndex: 'riverId',
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
        data_all: [],
        data_unread: [],
        data_read: [],
        columns,
      }
    },
    created() {
      this.newlist();
    },
    beforeCreate() {
    },
    methods: {
      callback(key) {
        console.log(key)
      },
      newlist() {
        this.data_all=[];
        this.data_read=[];
        this.data_unread=[];
        post(`${BASE_URL}/v5/message/getMessageList`, null,).then(res => {
          if (res.code === 200) {
            let message=res.results.messageList;
            for (let j=0;j<message.length;j++){
              if(message[j].messageStatus==1){
                message[j].realstatus='已读';
              }
              else {
                message[j].realstatus='未读';
              }
            }
            this.data_all = message;
            for (let i = 0; i < message.length; i++) {
              if (message[i].messageStatus == 1) {
                this.data_read[i] = message[i];
              } else {
                this.data_unread[i] = message[i];
              }
            }
            this.data_read=this.filter_array(this.data_read);
            this.data_unread=this.filter_array(this.data_unread);
          }
        });
      },
      cid(e){
        const id=e.target.dataset.id;
        const statu=e.target.dataset.statu;
        if(id&&statu=='0'){
          const params = new URLSearchParams();
          params.append('messageId', id);
          post(BASE_URL+'/v5/message/updateStatus', null, params).then(res => {
            if (res.code === 200) {
              this.newlist();
            }
            else {
            }
          });
        }
      },
      filter_array(array){
        return array.filter(item=>item);
      }
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
