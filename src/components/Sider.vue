<template>
  <a-layout-sider id="sider">
    <ul>
      <li v-for="name in sider">
        <router-link style="display:block;width: 100%" :to="name.path" exact-active-class = "_active">{{name.name}}</router-link>
      </li>
      <!--<li>-->
      <!--<a :data-menuid="name.path" style="width: 100%;height: 100%;display: block">{{ name.name }}</a>-->
      <!--</li>-->
    </ul>
  </a-layout-sider>
</template>

<script>
  import pdf from 'pdfobject';
  export default {
    data() {
      return {
        sider: [
          {"name": "首页", "path": '/', "index": 0},
          {"name": "消息管理", "path": '/news', "index": 1},
          {"name": "水系列表", "path": '/waterlist', "index": 2},
          {"name": "水系地图测算", "path": '/editnews', "index": 3}
        ],
      }
    },
    mounted() {
      pdf.embed(this.src, "#pdfContainer");
    },
  }
</script>
<style scoped>
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

  .ant-layout-sider-children ul li a {
    color: #6c6c6c;
  }
  #sider ._active{
    background: #1a52af;
    color: white;
  }
</style>
