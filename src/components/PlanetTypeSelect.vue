<template>
  <el-select v-model="localValue" :disabled="disabled" :placeholder="$t('Please select planet type')">
    <el-option v-for="item in PlantTypeJson" :key="item" :label="$t(item)" :value="item" />
  </el-select>
</template>

<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus";
import "element-plus/es/components/option/style/css";
import "element-plus/es/components/select/style/css";
import { computed } from "vue";
import PlantTypeJson from "../assets/json/planet-development/planet-type.json";

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});
const emits = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits("update:modelValue", value);
  },
});
</script>

<style lang="less" scoped></style>
