<template>
  <div>
    <a-row style="text-align: center">
      <a-col class="headStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">
        <span @click="goBack" style="display: inline-block;position: absolute;left: 0;font-size: 18px"><a-icon type="left" /> 返回</span>
        <span>新建微小水体</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col class="bodyStyle" :md="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 6 }">
        <div style="padding-bottom: 10px">
          <span style="display: inline-block;width: 25%">水系名称：</span>
          <a-input required style="width: 75%" v-model="riverName" placeholder="标题不超过20字" />
        </div>
        <div style="padding-bottom: 10px;vertical-align: top">
          <span style="display: inline-block;width: 25%;position: relative;bottom: 38px">水系描述：</span>
          <a-textarea rows="4"  style="width: 75%" v-model="riverText" placeholder="描述不超过100字" />
        </div>
        <div style="">
          <span style="display: inline-block;width: 25%;position: relative;bottom: 55px">水系照片：</span>
          <a-upload
            name="file"
            :headers="token"
            style="display: inline-block"
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
            action="http://61.240.12.212:9088/v5/upload/upload"
            @change="uploadVideo"
            :headers="token"
            name="file"
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
    import {post} from "../../util/axios";

    export default {
        name: "microWaterNew",
        data() {
            return {
                riverName: '',
                riverText: '',
                imageFileList: [],
                previewVisible: false,
                previewImage: '',
                videoFileList: [],
                image: '',
                video: '',
                userId: '0032f877687c45a0812f25af27e8092d',
                token:{
                    'token': localStorage.getItem('v5Token')
                },
            }
        },
        methods: {
            saveMessage() {
                this.loading = true;
                const params = {
                    userId: this.userId,//userId为登录人id,需要获取
                    riverName: this.riverName,
                    riverText: this.riverText,
                    riverStatus: '0',
                    riverImage: this.image,
                    riverVideo: this.video,
                };
                post(`http://61.240.12.212:9088/v5/river/insertRiver`,params).then(res=>{
                    if (res.code == 200) {
                        this.loading = false;
                        this.$message.success('新增成功');
                        this.$router.push({path: '/microWaterBody/microWaterNewList',query:{id:this.userId}})
                    }else{
                        this.$message.error('新增失败，请重试')
                    }
                })
            },
            goBack() {
                this.$router.go(-1);
            },
            uploadImage({ fileList }) {
                this.imageFileList = fileList;
                console.log(fileList);
                this.image = (fileList[0].response.results.relativePath).toString();
            },
            uploadVideo({fileList}) {
                this.videoFileList = fileList;
                this.video = (fileList[0].response.results.relativePath).toString();
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
