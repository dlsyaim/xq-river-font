<template>
  <a-locale-provider :locale="locale">
    <router-view/>
  </a-locale-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';

  export default {
    data() {
      return {
        locale: zhCN,
      }
    },
  }
</script>

<style>
  /*ztree设置*/
  .ztree span {
    font-size: 14px;
  }

  .ztree li[treenode] {
    padding: 1px 0;
  }

  /*卡片容器内边距*/
  .card-container {
    padding: 18px;
    height: 100%;
  }

  /*默认的下拉选择器宽度*/
  .default-select-width {
    width: 240px;
  }

  /*表格内边距*/
  #layout .ant-table-thead > tr > th, #layout .ant-table-tbody > tr > td {
    padding: 8px 12px;
  }

  #c_content .ant-table-thead > tr > th{
    background-color: #f0f2f5;
  }
  #c_content{
    background-color: white;
  }
</style>
