<template>
  <h1>
    Home
  </h1>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();
void router.push({ name: "p2-forecast" });
</script>

<style lang="less" scoped></style>
