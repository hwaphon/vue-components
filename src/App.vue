<template>
  <div id="app">
    <v-line-chart></v-line-chart>
  </div>
</template>

<script>

import LineChart from './views/linechart/index.vue'
export default {
  name: 'app',
  components: {
    'v-line-chart': LineChart
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
