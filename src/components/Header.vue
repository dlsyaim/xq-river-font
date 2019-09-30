<template>
  <a-layout style="height: 100%" id="layout">
    <a-layout-header id="layoutHeader">
      <div style="display: flex;align-items: center">
        <img src="../assets/logo.png" width="50"/>
        <h1 style="margin: 0 0 0 10px;white-space: nowrap;color: #fff;">{{header}}</h1>
      </div>
      <div style="display:flex;justify-content: center;align-items: center">
        {{ date }} <span style="color: white;margin-left: 30px;cursor: pointer" @click="logout">退出</span>
      </div>
    </a-layout-header>
  </a-layout>
</template>

<script>
  import {BASE_URL} from "../config/config";
  import {BASE_URLc} from "../config/config";
  import moment from 'moment';
  export default {
    data() {
      return {
        date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      }
    },
    props: ['header'],
    created() {
    },
    // 挂载完成时
    mounted() {
      let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
      this.timer = setInterval(() => {
        _this.date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss'); // 修改数据date
      }, 1000)
    },
    methods: {
      logout() {
        localStorage.clear();
        window.location.href=BASE_URLc;
      },
    },
    beforeDestroy: function () {   // 清除定时器
      if (this.timer) {
        clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
      }
// 创建完成时
    },
  }
</script>
<style scoped>
  #layout li span {
    font-size: 16px;
  }

  #layoutHeader {
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    background-color: #438AFE;
    color: #fff;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    z-index: 10;
  }

  .layout-sider {
    height: 100%;
    background-color: #438AFE;
    overflow-y: auto;
  }

  #menu {
    list-style: none;
    background-color: #3366ff;
    width: 100%;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
  }

  .menu-item {
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    color: #ffffff;
    font-size: 16px;
    border-bottom: 1px solid #438AFE;
    transition: all .3s ease-in-out;
  }

  .menu-item:hover {
    background-color: #2B52A8;
  }

  #subMenu {
    padding: 0;
    list-style: none;
    cursor: pointer;
    transition: all .3s ease-in-out;
  }

  .sub-menu-item {
    font-size: 16px;
    display: flex;
    width: 200px;
    align-items: center;
    justify-content: center;
    height: 50px;
  }

  .sub-menu-item:hover {
    background-color: #f2f2f2;
  }

  .layout-sider::-webkit-scrollbar {
    width: 4px;
  }

  .layout-sider::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }

  .layout-sider::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }


  /*页面切换动画*/
  .page-toggle-enter-active {
    transition: opacity .2s ease-in .25s;
  }

  .page-toggle-leave-active {
    transition: opacity .2s ease-out 0s;
  }

  .page-toggle-enter, .page-toggle-leave-to {
    opacity: 0;
  }
</style>
