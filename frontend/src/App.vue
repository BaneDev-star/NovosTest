<template>
  <div id="app">
    <router-view/>
    <notifications group="foo"></notifications>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #2c3e50;
  color: white;
  min-height: 100vh;
}
</style>
