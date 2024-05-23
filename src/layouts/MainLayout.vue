<template>
  <el-container class="h100">
    <el-aside width="auto">
      <MainMenu />
    </el-aside>
    <el-container class="h100">
      <el-header>
        <MainHeader />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ElAside, ElContainer, ElHeader, ElMain } from "element-plus";
import "element-plus/es/components/container/style/css";
import MainHeader from "./MainHeader.vue";
import MainMenu from "./MainMenu.vue";
</script>

<style lang="less" scoped></style>
