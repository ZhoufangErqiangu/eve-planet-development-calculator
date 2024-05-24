<template>
  <el-select v-model="localValue" :disabled="disabled" :placeholder="$t('Please select R0')">
    <el-option v-for="item in filteredR0" :key="item.name" :label="$t(item.name)" :value="item.name" />
  </el-select>
</template>

<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus";
import "element-plus/es/components/option/style/css";
import "element-plus/es/components/select/style/css";
import { computed, watch } from "vue";
import R0Json from "../assets/json/planet-development/r0.json";

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  plantType: {
    type: String,
    default: undefined,
  }
});
const emits = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits("update:modelValue", value);
  },
});
const filteredR0 = computed(() => {
  if (!props.plantType) {
    return R0Json;
  }
  return R0Json.filter((item) => {
    if (!props.plantType) return true;
    return item.from.includes(props.plantType);
  });
});

watch(() => props.plantType, (val, old) => {
  if (val === old) return;
  localValue.value = undefined;
});
</script>

<style lang="less" scoped></style>
