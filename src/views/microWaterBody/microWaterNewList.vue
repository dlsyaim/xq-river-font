
<template>
  <div>
    <a-row style="text-align: center">
      <a-col class="headStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">
        <span @click="goBack" style="display: inline-block;position: absolute;left: 0;font-size: 18px"><a-icon type="left" /> 返回</span>
        <span>我上报的微小水体</span>
      </a-col>
    </a-row>
    <a-row>
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
        <img style="width: 100%;" :src="selected.imageList" alt="照片">
<!--        <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">-->
<!--          <img alt="照片" style="width: 100%" src="selected.imageList" />-->
<!--        </a-modal>-->
      </div>
      <div style="padding-bottom: 10px">
        <span style="width: 25%;display: block;color: skyblue">水系视频：</span>
        <video style="width: 100%" controls src="selected.videoList"></video>
      </div>
    </a-modal>
  </div>
</template>

<script>
    import {post, get} from "../../util/axios";
    import {BASE_URL} from "../../config/config";

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
                loading:false,
                modalVisible:false,
                previewVisible:false,
                list:[],
                selected:{},
                userId: '',
            }
        },
        mounted() {
            this.getList();
            this.userId = this.$route.query.id;
        },
        methods: {
            getList() {
                const params = {
                    'userId':"ee67b73bf4bc11e9a71f0242ac110005",//this.userId,
                    'pageNo':1
                };
                post(`${BASE_URL}/v5/river/getIdRiverList`,params)
                    .then(res=>{
                        if (res.code === 200) {
                            this.handleData(res.results.list);
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
                const id = e.target.dataset.id;
                const method = e.target.dataset.method;
                if (id && method) {
                    if (method === 'riverName') {//查看详情
                        //请求详情数据
                        post(`http://61.240.12.212:9088/v5/river/findRiverById?riverId=${id}`).then(res=>{
                            if (res.code == 200) {
                                this.selected = res.results.river;
                            }
                        })
                        this.modalVisible = true;
                    }else if(method === 'action') {//编辑每条数据
                        this.$router.push({path: '/microWaterBody/microWaterEdit',query:{riverId:id}});
                    }
                }
            },
            report(){//上报后路由跳转至详情页
                this.$router.push({path: '/microWaterBody/microWaterNew'});
            },
            goBack() {
                this.$router.go(-1);
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
