<template>
  <div class="lang-select">
    <div v-if="title" class="title">
      {{ title }}
    </div>
    <el-select v-model="localValue" size="small" @change="onChange">
      <el-option v-for="l in LangList" :key="l.tag" :label="l.label" :value="l.tag" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ElSelect, ElOption } from "element-plus";
import LangList from "../assets/json/language.json";
import { type PropType, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String as PropType<string | undefined>,
    default: undefined
  },
  title: {
    type: String,
    default: undefined
  }
});
const emits = defineEmits(["update:modelValue", "change"]);

const localValue = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emits("update:modelValue", val);
  }
});

function onChange(val: string) {
  emits("change", val);
}
</script>

<style lang="less" scoped>
.lang-select {
  width: 80px;
}

.title {
  margin-bottom: 3px;
  color: #A0A4AB;
  font-size: 8px;
  font-weight: 300;
  line-height: 50%;
}
</style>
