
<template>
  <div>
<!--    <a-row style="text-align: center">-->
<!--      <a-col class="headStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">-->
<!--        <span @click="goBack" style="display: inline-block;position: absolute;left: 0;font-size: 18px"><a-icon type="left" /> 返回</span>-->
<!--        <span>编辑微小水体</span>-->
<!--      </a-col>-->
<!--    </a-row>-->
    <a-row>
      <a-col class="bodyStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">
        <div style="padding-bottom: 10px">
          <span style="display: inline-block;width: 25%">水系名称：</span>
          <a-input  style="width: 75%" v-model="list.riverName" placeholder="标题不超过20字"/>
        </div>
        <div style="padding-bottom: 10px;vertical-align: top">
          <span style="display: inline-block;width: 25%;position: relative;bottom: 38px">水系描述：</span>
          <a-textarea rows="4"  style="width: 75%" v-model="list.riverText" placeholder="描述不超过100字" />
        </div>
        <div style="">
          <span style="display: inline-block;width: 25%;position: relative;bottom: 55px">水系照片：</span>
          <a-upload
            style="display: inline-block"
            name="file"
            @change="uploadImage"
            @preview="handlePreview"
            accept=".png,.jpg,.jpeg"
            action="http://61.240.12.212:9088/v5/upload/upload"
            listType="picture-card"
            :fileList="imageFileList"
          >
            <div  v-if="imageFileList.length < 3">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
        <div style="padding-bottom: 10px">
          <span style="display: inline-block;width: 25%">水系视频：</span>
          <a-upload
            @change="uploadVideo"
            name="file"
            action="http://61.240.12.212:9088/v5/upload/upload"
            :fileList="videoFileList"
          >
            <a-button style="background-color:skyblue;color: whitesmoke" icon="upload">视频上传</a-button>
          </a-upload>
        </div>
        <div style="margin:40px 0;text-align: center">
          <a-button @click="saveMessage" style="width: 100%;background-color: skyblue;color: white">保存</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
    import {get,post} from "../../util/axios";
    import axios from "axios";
    import {BASE_URL,BASE_URLimg} from "../../config/config"

    export default {
        name: "microWaterEdit",
        data() {
            return {
                BASE_URLimg,
                riverName: '',
                riverRemark: '',
                imageFileList: [],
                previewVisible: false,
                previewImage: '',
                previewName: '',
                videoFileList: [],
                riverId:'',
                list: {},
                image: '',
                video: '',
                token:{
                    'token': localStorage.getItem('v5Token')
                },
            }
        },
        mounted() {
            this.riverId = this.$route.query.riverId;
            this.getEditDetail();
        },
        methods: {
            getEditDetail() {
                const params = {
                    riverId: this.riverId,
                };
                axios({
                    method: 'post',
                    url: 'http://61.240.12.212:9088/v5/river/findRiverById',
                    // headers: {
                    //     'token': '',
                    // },
                    params:params
                }).then(res=>{
                    if (res.status === 200) {
                        console.log(res);
                        this.list = res.data.results.river;
                        // this.imageFileList.responseUrl = res.results.imageList;
                        // console.log(this.imageFileList.responseUrl);
                    }
                })
            },
            saveMessage() {
                if (this.list.riverName != '') {
                    this.loading = false;
                    const imageUrl= this.imageFileList.filter(item=>item.responseUrl).map(item=>item.responseUrl);
                    const image=imageUrl.join(',');
                    const VideoUrl= this.videoFileList.filter(item=>item.responseUrl).map(item=>item.responseUrl);
                    const video=VideoUrl.join(',');
                    const params = {
                        userId: '',
                        riverId: this.riverId,
                        riverName: this.list.riverName,
                        riverText: this.list.riverText,
                        riverStatus: this.list.riverStatus,
                        riverImage: image,
                        riverVideo: video,

                    };
                    axios({
                        method: 'post',
                        url: 'http://61.240.12.212:9088/v5/river/updateRiver',
                        // headers: {
                        //     'token': '',
                        // },
                        params:params
                    }).then(res=>{
                        if (res.status == 200) {
                            this.loading = false;
                            this.$message.success('保存成功');
                            this.$nextTick(() => {this.$router.push({path: '/microWaterBody/microWaterNewList'})});
                        }else{
                            this.$message.error('保存失败，请重试')
                        }
                    })
                }else {
                    this.$message.error('请输入水系名称')
                }
            },
            goBack() {
                this.$router.go(-1);
            },
            uploadImage({file, fileList}){//图片上传
                this.imageFileList=fileList;
                console.log(this.imageFileList);
                if (file.status === 'done') {
                    this.$message.success('上传成功');
                    this.imageFileList.forEach(item=>{
                        if(item.uid===file.uid){
                            item.responseUrl=file.response.results.relativePath;
                        }
                    });
                } else if (file.status === 'error') {
                    this.$message.error('上传失败');
                }
            },
            handlePreview(file) {
                this.previewImage =BASE_URLimg + file.response.results.relativePath;
                this.previewName = file.name;
                this.previewVisible = true;
            },
            uploadVideo({file, fileList}){//视屏上传
                this.videoFileList=fileList;
                if (file.status === 'done') {
                    this.$message.success('上传成功');
                    this.videoFileList.forEach(item=>{
                        if(item.uid===file.uid){
                            item.responseUrl=file.response.results.relativePath;
                        }
                    });
                } else if (file.status === 'error') {
                    this.$message.error('上传失败');
                }
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
</style>
