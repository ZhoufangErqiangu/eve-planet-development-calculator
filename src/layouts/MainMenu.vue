<template>
  <el-menu class="h100" :router="true" :collapse="layoutStore.menuCollapse">
    <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path" :route="item.path">
      <el-icon size="22">
        <component :is="item.icon" />
      </el-icon>
      <span v-show="!layoutStore.menuCollapse">{{ $t(item.label) }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { Watermelon } from "@element-plus/icons-vue";
import { ElMenu, ElMenuItem } from "element-plus";
import "element-plus/es/components/menu-item/style/css";
import "element-plus/es/components/menu/style/css";
import { type Component } from "vue";
import { useLayoutStore } from "../stores/layout";

const layoutStore = useLayoutStore();

interface MenuItem {
  icon: Component;
  label: string
  path: string
}
const menuItems: MenuItem[] = [
  { icon: Watermelon, label: "P2 Forecast", path: "/p2-forecast" },
];
</script>
