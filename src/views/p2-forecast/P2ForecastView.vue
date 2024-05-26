<template>
  <h1>
    {{ $t("P2 Forecast") }}
  </h1>
  <el-tabs v-model="activeTab">
    <el-tab-pane :label="$t('Input')" name="form">
      <PlanetInput v-for="pf, index in planetForms" :key="pf.id" :model-value="pf"
        @update:model-value="(val) => updatePlanetForm(index, val)" @close="removePlant" />
      <el-button :icon="Plus" @click="addPlant">
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
      <el-card v-if="p2Result.length" :header="$t('P2')">
        <el-table :data="p2Result">
          <el-table-column :label="$t('P1a')">
            <template #default="{ row }">
              {{ $t(row.p1s[0].p1) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('P1b')">
            <template #default="{ row }">
              {{ $t(row.p1s[1].p1) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('P2')">
            <template #default="{ row }">
              {{ $t(row.p2) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('Density')">
            <template #default="{ row }">
              {{ (row.value * 100.0).toFixed(2) }} %
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-divider />
      <el-card v-if="p1Result.length" :header="$t('P1')">
        <el-table :data="p1Result">
          <el-table-column :label="$t('Planet index')">
            <template #default="{ row }">
              {{ row.planetIndex }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('Planet type')">
            <template #default="{ row }">
              {{ $t(row.planetType ?? "Unkown") }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('P1')">
            <template #default="{ row }">
              {{ $t(row.p1) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('Density')">
            <template #default="{ row }">
              {{ (row.value * 100.0).toFixed(2) }} %
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { DocumentAdd, DocumentCopy, DocumentDelete, Plus } from "@element-plus/icons-vue";
import { ElButton, ElCard, ElDivider, ElTabPane, ElTable, ElTableColumn, ElTabs } from "element-plus";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/card/style/css";
import "element-plus/es/components/divider/style/css";
import "element-plus/es/components/tab-pane/style/css";
import "element-plus/es/components/table-column/style/css";
import "element-plus/es/components/table/style/css";
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
