
<template>
  <div>
    <a-row style="text-align: center">
      <a-col class="headStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">
        <span @click="goBack" style="display: inline-block;position: absolute;left: 0;font-size: 18px"><a-icon type="left" /> 返回</span>
        <span>编辑微小水体</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col class="bodyStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">
        <div style="padding-bottom: 10px">
          <span style="display: inline-block;width: 25%">水系名称：</span>
          <a-input  style="width: 75%" v-model="list.riverName" placeholder="标题不超过20字" />
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
            :headers="token"
            @change="uploadImage"
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
            :headers="token"
            :remove="handleVideoRemove"
            action="http://61.240.12.212:9088/v5/upload/upload"
            :fileList="videoFileList"
          >
            <a-button style="background-color:skyblue;color: whitesmoke" icon="upload">视频上传</a-button>
          </a-upload>
        </div>
        <div style="margin:40px auto;text-align: center">
          <a-button @click="saveMessage" style="width: 30%;background-color: skyblue;color: white">保存</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
    import {get,post} from "../../util/axios";
    import BASE_URL from "../../config/config"

    export default {
        name: "microWaterEdit",
        data() {
            return {
                riverName: '',
                riverRemark: '',
                imageFileList: [],
                previewVisible: false,
                previewImage: '',
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
                }
                post(`http://61.240.12.212:9088/v5/river/findRiverById`,params).then(res=>{
                    if (res.code === 200) {
                        this.list = res.results.river;
                    }
                })
            },
            saveMessage() {
                this.loading = false;
                const fileUrl= this.imageFileList.filter(item=>item.responseUrl).map(item=>item.responseUrl);
                const imageList=fileUrl.join(',');
                const VideoUrl= this.videoFileList.filter(item=>item.responseUrl).map(item=>item.responseUrl);
                const videoList=fileUrl.join(',');
                const params = {
                    userId: '',
                    riverId: this.riverId,
                    riverName: this.list.riverName,
                    riverText: this.list.riverText,
                    riverStatus: this.list.riverStatus,
                    riverImage: this.image,
                    riverVideo: this.video,

                };
                post(`http://61.240.12.212:9088/v5/river/updateRiver`,params).then(res=>{
                    if (res.code == 200) {
                        this.loading = false;
                        this.$message.success('保存成功');
                        this.$nextTick(() => {this.$router.push({path: '/microWaterBody/microWaterNewList'})});
                    }else{
                        this.$message.error('保存失败，请重试')
                    }
                })
            },
            goBack() {
                this.$router.go(-1);
            },
            uploadImage({ fileList }) {
                this.imageFileList = fileList;
                this.image = fileList[0].response.results.relativePath;
            },
            uploadVideo({fileList}) {
                this.videoFileList = fileList;
                this.video = fileList[0].response.results.relativePath;
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
