<template>
  <h1>
    {{ $t("P2 Forecast") }}
  </h1>
  <el-tabs v-model="activeTab">
    <el-tab-pane :label="$t('Input')" name="form">
      <el-form v-for="pf in planetForms" :key="pf.id" :model="pf">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item :label="$t('Planet type')" prop="planetType">
              <planetTypeSelect v-model="pf.planetType" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form v-for="rf in pf.r0s" :key="rf.id" :model="rf">
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-form-item :label="$t('Resource')" prop="r0">
                    <R0Select v-model="rf.r0" :plant-type="pf.planetType" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('Density %')" prop="r0">
                    <PercentInput v-model="rf.value" />
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-button type="danger" :icon="Close" @click="() => removeR0(pf, rf)" />
                </el-col>
              </el-row>
            </el-form>
            <el-button :icon="Plus" :disabled="pf.r0s.length >= 5" @click="() => addR0(pf)">
              {{ $t("Add resource") }}
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" :icon="Close" @click="() => removePlant(pf)" />
          </el-col>
        </el-row>
        <el-divider />
      </el-form>
      <el-button :icon="Plus" :disabled="planetForms.length >= 6" @click="addPlant">
        {{ $t("Add planet") }}
      </el-button>
      <el-button type="warning" :icon="DocumentAdd" @click="load">
        {{ $t('Load') }}
      </el-button>
      <el-button type="primary" :icon="DocumentCopy" @click="save">
        {{ $t('Save') }}
      </el-button>
    </el-tab-pane>
    <el-tab-pane :label="$t('Result')" name="res">
      <h2>{{ $t('P1') }}</h2>
      <div v-for="p1 in p1Result" :key="p1.id">
        <el-row :gutter="10">
          <el-col :span="4">
            {{ $t('Planet type') }}: {{ $t(p1.planetType ?? "Unkown") }}
          </el-col>
          <el-col :span="4">
            {{ $t('Planet index') }}: {{ p1.planetIndex }}
          </el-col>
          <el-col :span="4">
            {{ $t('P1') }}: {{ $t(p1.p1) }}
          </el-col>
        </el-row>
        <el-divider />
      </div>
      <h2>P2</h2>
      <div v-for="p2 in p2Result" :key="p2.id">
        <el-row :gutter="10">
          <el-col :span="4">
            {{ $t('P1a') }}: {{ $t(p2.p1s[0].p1) }}
          </el-col>
          <el-col :span="4">
            {{ $t('P1b') }}: {{ $t(p2.p1s[1].p1) }}
          </el-col>
          <el-col :span="4">
            {{ $t('P2') }}: {{ $t(p2.p2) }}
          </el-col>
          <!-- <el-col :span="4">
            Value: {{ p2.value * 3000 * 3000 }}
          </el-col> -->
        </el-row>
        <el-divider />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { Close, DocumentAdd, DocumentCopy, Plus } from "@element-plus/icons-vue";
import { ElButton, ElCol, ElDivider, ElForm, ElFormItem, ElRow, ElTabPane, ElTabs } from "element-plus";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/col/style/css";
import "element-plus/es/components/divider/style/css";
import "element-plus/es/components/form-item/style/css";
import "element-plus/es/components/form/style/css";
import "element-plus/es/components/row/style/css";
import "element-plus/es/components/tab-pane/style/css";
import "element-plus/es/components/tabs/style/css";
import { computed, onMounted, ref, watch } from "vue";
import PercentInput from "../../components/PercentInput.vue";
import planetTypeSelect from "../../components/PlanetTypeSelect.vue";
import R0Select from "../../components/R0Select.vue";
import { uuid } from "../../utils/uuid";
import { calculateP1, calculateP2, type PlanetP1Result, type PlanetP2 } from "./calculate";

const activeTab = ref("form");

interface PlanetR0Form {
  id: string;
  r0?: string;
  value?: number;
}
interface PlanetForm {
  id: string;
  planetType?: string;
  r0s: PlanetR0Form[];
}
const planetForms = ref<PlanetForm[]>([]);
addPlant();
addR0(planetForms.value[0]);

function addPlant() {
  planetForms.value.push({
    id: uuid(),
    r0s: [],
  });
  addR0(planetForms.value[planetForms.value.length - 1]);
}
function removePlant(pf: PlanetForm) {
  const i = planetForms.value.indexOf(pf);
  if (i >= 0) {
    planetForms.value.splice(i, 1);
  }
}
function addR0(pf: PlanetForm) {
  pf.r0s.push({
    id: uuid(),
  });
}
function removeR0(pf: PlanetForm, rf: PlanetR0Form) {
  const i = pf.r0s.indexOf(rf);
  if (i >= 0) {
    pf.r0s.splice(i, 1);
  }
}

function load() {
  const data = localStorage.getItem("planetForms");
  if (data) {
    planetForms.value = JSON.parse(data);
  }
}
function save() {
  localStorage.setItem("planetForms", JSON.stringify(planetForms.value));
}

const plantP1Result = ref<PlanetP1Result[]>([]);
const p1Result = computed(() => {
  const p1r: Array<{ id: string; planetIndex: number, planetType?: string, p1: string, value: number; }> = [];
  for (let i = 0; i < plantP1Result.value.length; i++) {
    const plant = plantP1Result.value[i];
    plant.p1s.forEach(p1 => {
      p1r.push({
        id: p1.id,
        planetIndex: i + 1,
        planetType: plant.planetType,
        p1: p1.p1,
        value: p1.value,
      });
    });
  }
  p1r.sort((a, b) => a.value - b.value);
  return p1r;
});

const p2Result = ref<PlanetP2[]>([]);

watch(activeTab, (val) => {
  if (val === "res") {
    // do calculate
    plantP1Result.value = calculateP1(planetForms.value);
    p2Result.value = calculateP2(plantP1Result.value).sort((a, b) => a.value - b.value);
  };
});

onMounted(() => {
  load();
});
</script>

<style lang="less" scoped></style>
