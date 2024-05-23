<template>
  <el-row class="h100" justify="space-between" align="middle">
    <el-col :span="1">
      <el-space alignment="center">
        <el-button :icon="collapseIcon" @click="layoutStore.toggleMenuCollapse" />
      </el-space>
    </el-col>
    <el-col :span="6" style="text-align: end;">
      <el-space alignment="center">
        <LanguageSelect v-model="lang" @change="onLangChange" />
        <el-switch v-model="layoutStore.isDark" :active-action-icon="MoonNight" :inactive-action-icon="Sunny" />
      </el-space>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { Expand, Fold, MoonNight, Sunny } from "@element-plus/icons-vue";
import { ElButton, ElCol, ElRow, ElSpace, ElSwitch } from "element-plus";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/col/style/css";
import "element-plus/es/components/row/style/css";
import "element-plus/es/components/space/style/css";
import "element-plus/es/components/switch/style/css";
import { computed, ref } from "vue";
import LanguageSelect from "../components/LanguageSelect.vue";
import { defaultLang, setLang } from "../locale";
import { useLayoutStore } from "../stores/layout";

const layoutStore = useLayoutStore();

const collapseIcon = computed(() => {
  return layoutStore.menuCollapse ? Expand : Fold;
});

const lang = ref(localStorage.getItem("lang") ?? defaultLang);
function onLangChange(val: string) {
  setLang(val);
}
</script>

<style lang="less" scoped>
.img1 {
  height: 32px;
}
</style>
