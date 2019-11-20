<template>
  <div>
<!--    <a-row style="text-align: center">-->
<!--      <a-col class="headStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">-->
<!--        <span @click="goBack" style="display: inline-block;position: absolute;left: 0;font-size: 18px"><a-icon type="left" /> 返回</span>-->
<!--        <span>新建微小水体</span>-->
<!--      </a-col>-->
<!--    </a-row>-->
    <a-row>
      <a-col class="bodyStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">
        <div style="padding-bottom: 10px">
          <span style="display: inline-block;width: 25%">水系名称：</span>
          <a-input style="width: 75%" v-model="riverName" placeholder="标题不超过20字"/>
        </div>
        <div style="padding-bottom: 10px">
          <span style="display: inline-block;width: 25%">水系经度：</span>
          <a-input style="width: 75%" v-model="riverX"/>
        </div>
        <div style="padding-bottom: 10px">
          <span style="display: inline-block;width: 25%">水系纬度：</span>
          <a-input style="width: 75%" v-model="riverY"/>
        </div>
        <div style="padding-bottom: 10px;vertical-align: top">
          <span style="display: inline-block;width: 25%;position: relative;bottom: 38px">水系描述：</span>
          <a-textarea rows="4"  style="width: 75%" v-model="riverText" placeholder="描述不超过100字" />
        </div>
        <div style="">
          <span style="display: inline-block;width: 25%;position: relative;bottom: 55px">水系照片：</span>
          <a-upload
            name="file"
            style="display: inline-block"
            v-on:click="uploadImage"
            @preview="handlePreview"
            accept=".png,.jpg,.jpeg"
            :action="BASE_URL + '/v5/upload/upload'"
            listType="picture-card"
            :fileList="imageFileList"
          >
            <div  v-if="imageFileList.length < 3">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
            <img alt="previewName" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
        <div style="padding-bottom: 10px">
          <span style="display: inline-block;width: 25%">水系视频：</span>
          <a-upload
            :action="BASE_URL + '/v5/upload/upload'"
            @click="uploadVideo"
            name="file"
            :fileList="videoFileList"
          >
            <a-button style="background-color:skyblue;color: whitesmoke" icon="upload">视频上传</a-button>
          </a-upload>
        </div>
        <div style="margin:40px 0;text-align: center;width: 100%;">
          <a-button @click="saveMessage" style="width: 100%;background-color: skyblue;color: white">保存</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
    import {post} from "../../util/axios";
    import {BASE_URL,BASE_URLimg} from "../../config/config";
    import axios from "axios";

    export default {
        name: "microWaterNew",
        data() {
            return {
                riverName: '',
                BASE_URL,
                BASE_URLimg,
                riverText: '',
                imageFileList: [],
                previewVisible: false,
                previewImage: '',
                previewName: '',
                videoFileList: [],
                riverX: '',
                riverY: '',
                // userId: '0032f877687c45a0812f25af27e8092d',
                userId: '',
                token:{
                    'token': localStorage.getItem('v5Token')
                },
            }
        },
        mounted() {
            this.city();
            this.userId = this.$route.query.id;
            this.$message.warn(this.userId);
            alert('this.userId');
        },
        methods: {
            //获取用户位置
            city(){
                // const that =this;
                // const map = new BMap.Map("allmap");
                // const geolocation = new BMap.Geolocation();
                // geolocation.getCurrentPosition(function(r){
                //     if(this.getStatus() == BMAP_STATUS_SUCCESS){
                //         that.riverX = (r.longitude).toString();
                //         that.riverY = (r.latitude).toString();
                //     } else {
                //         alert('暂时无法获取你的位置')
                //     }
                // });
                const myGeolocation = HezzNativeHandler.getLocation();
                const value = JSON.parse(myGeolocation);
                this.riverX = value.longitude;
                this.riverY = value.latitude;
                if(this.riverX && this.riverY){
                    that.$message.success('经纬度获取成功');
                } else {
                    that.$message.warn('经纬度获取失败');
                }
                // if(myGeolocation.Longitude && myGeolocation.Latitude){
                //     that.riverX = myGeolocation.Longitude;
                //     that.riverY = myGeolocation.Latitude;
                // } else {
                //     alert('暂时无法获取你的位置')
                // }
            },
            saveMessage() {
                if (this.riverName != '') {
                    this.loading = true;
                    const imageUrlArray= this.imageFileList.filter(item=>item.responseUrl).map(item=>item.responseUrl);
                    const image =imageUrlArray.join(',');
                    const videoUrlArray= this.videoFileList.filter(item=>item.responseUrl).map(item=>item.responseUrl);
                    const video =videoUrlArray.join(',');
                    const params = {
                        userId: this.userId,//userId为登录人id,需要获取
                        riverName: this.riverName,
                        riverText: this.riverText,
                        riverStatus: '0',
                        riverImage: image,
                        riverVideo: video,
                        riverX: this.riverX,//经度
                        riverY: this.riverY,//纬度
                    };
                    axios({
                        method: 'post',
                        url: `${BASE_URL}/v5/river/insertRiver`,
                        // headers: {
                        //     'token': '',
                        // },
                        params:params
                    })
                        .then(res=>{
                            if (res.status == '200') {
                                this.loading = false;
                                this.$message.success('新增成功');
                                this.$router.push({path: '/microWaterBody/microWaterNewList'})
                            }else{
                                this.$message.error('新增失败，请重试')
                            }
                        })
                }else {
                    this.$message.warn('请输入水系名称')
                }
            },
            goBack() {
                this.$router.go(-1);
            },
            uploadImage({file, fileList}){//图片上传
                this.imageFileList=fileList;
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
