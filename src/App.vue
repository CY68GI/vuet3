<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
// import FilterBar from './components/FilterBar.vue';
// import DataTable from './components/DataTable.vue';
// import TableRow from './components/TableRow.vue';
// import ActionButton from './components/ActionButton.vue';
// import PaginationBar from './components/PaginationBar.vue';
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite 标志" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue 标志" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue 应用" />
  <!-- <FilterBar />
  <DataTable />
  <TableRow />
  <ActionButton />
  <PaginationBar /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
