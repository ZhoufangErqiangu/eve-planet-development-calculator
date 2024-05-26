<template>
  <el-form :model="localValue">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-form-item :label="$t('Planet type')" prop="planetType">
          <PlanetTypeSelect v-model="plantType" />
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form v-for="rf, index in rfs" :key="rf.id" :model="rf">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item :label="$t('Resource')" prop="r0">
                {{ rf.r0 ? $t(rf.r0) : '' }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('Density') + ' %'" prop="r0">
                <PercentInput :model-value="rf.value" :precision="0"
                  @update:model-value="(val) => updateR0Value(index, val)" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" :icon="Close" @click="onClose" />
      </el-col>
    </el-row>
  </el-form>
  <el-divider />
</template>

<script lang="ts" setup>
import { Close } from "@element-plus/icons-vue";
import { ElButton, ElCol, ElDivider, ElForm, ElFormItem, ElRow } from "element-plus";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/col/style/css";
import "element-plus/es/components/divider/style/css";
import "element-plus/es/components/form-item/style/css";
import "element-plus/es/components/form/style/css";
import "element-plus/es/components/row/style/css";
import { computed, type PropType } from "vue";
import R0Json from "../../assets/json/planet-development/r0.json";
import PercentInput from "../../components/PercentInput.vue";
import PlanetTypeSelect from "../../components/PlanetTypeSelect.vue";
import { uuid } from "../../utils/uuid";
import { type PlanetForm, type PlanetR0Form } from "./types";

const props = defineProps({
  modelValue: {
    type: Object as PropType<PlanetForm>,
    required: true
  },
});
const emits = defineEmits(["update:modelValue", "close"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits("update:modelValue", value);
  },
});
const plantType = computed({
  get: () => localValue.value.planetType,
  set: (value) => {
    emits("update:modelValue", { ...localValue.value, planetType: value });
  },
});
const rfs = computed<PlanetR0Form[]>({
  get: () => {
    if (!localValue.value.planetType) return [];
    const r = R0Json.filter((item) => {
      if (!localValue.value.planetType) return false;
      return item.from.includes(localValue.value.planetType);
    });
    return r.map((e, i) => {
      const er = localValue.value.r0s[i];
      if (er) {
        return er;
      } else {
        return {
          id: uuid(),
          r0: e.name,
          value: 0
        };
      }
    });
  },
  set: (val) => {
    emits("update:modelValue", { ...localValue.value, r0s: val });
  },
});

function updateR0Value(index: number, value: number) {
  const r = [...rfs.value];
  r[index].value = value;
  rfs.value = r;
}

function onClose() {
  emits("close", localValue.value.id);
}
</script>

<style lang="less" scoped></style>
