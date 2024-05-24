<template>
  <h1>
    {{ $t("P2 Forecast") }}
  </h1>
  <el-tabs v-model="activeTab">
    <el-tab-pane :label="$t('Input')" name="form">
      <PlanetInput v-for="pf, index in planetForms" :key="pf.id" :model-value="pf"
        @update:model-value="(val) => updatePlanetForm(index, val)" @close="removePlant" />
      <el-button :icon="Plus" :disabled="planetForms.length >= 6" @click="addPlant">
        {{ $t("Add planet") }}
      </el-button>
      <el-button type="warning" :icon="DocumentAdd" @click="load">
        {{ $t('Load') }}
      </el-button>
      <el-button type="primary" :icon="DocumentCopy" @click="save">
        {{ $t('Save') }}
      </el-button>
      <el-button type="danger" :icon="DocumentDelete" @click="clear">
        {{ $t('Clear') }}
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
import { DocumentAdd, DocumentCopy, Plus, DocumentDelete } from "@element-plus/icons-vue";
import { ElButton, ElCol, ElDivider, ElRow, ElTabPane, ElTabs } from "element-plus";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/col/style/css";
import "element-plus/es/components/divider/style/css";
import "element-plus/es/components/row/style/css";
import "element-plus/es/components/tab-pane/style/css";
import "element-plus/es/components/tabs/style/css";
import { computed, onMounted, ref, watch } from "vue";
import { uuid } from "../../utils/uuid";
import PlanetInput from "./PlanetInput.vue";
import { calculateP1, calculateP2, type PlanetP1Result, type PlanetP2 } from "./calculate";
import { type PlanetForm } from "./types";

const activeTab = ref("form");

const planetForms = ref<PlanetForm[]>([]);
addPlant();

function updatePlanetForm(index: number, val: PlanetForm) {
  planetForms.value[index] = val;
}

function addPlant() {
  planetForms.value.push({
    id: uuid(),
    r0s: [],
  });
}
function removePlant(id: string) {
  const i = planetForms.value.findIndex(pf => pf.id === id);
  if (i >= 0) {
    planetForms.value.splice(i, 1);
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
function clear() {
  planetForms.value = [];
  addPlant();
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
