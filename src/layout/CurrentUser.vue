<template>
  <a-dropdown>
    <div style="display: flex;align-items: center">
      <span>超级管理员</span>
      <a-avatar :size="48" icon="user"/>
    </div>
    <a-menu slot="overlay">
      <a-menu-item>
        <a-icon type="user" style="font-size: 16px"/><span>个人信息</span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting" style="font-size: 16px"/><span>修改密码</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item>
        <a-icon type="logout" style="font-size: 16px"/><span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
  export default {
    data() {
      return {}
    }
  }
</script>

<style scoped>
span{
  padding:0 10px 0 4px;
}
  li{
    display: flex;
    align-items: center;
  }
</style>
