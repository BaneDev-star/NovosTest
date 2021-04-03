<template>
  <div class="home">
    <top-bar></top-bar>
    <div class="container-fluid">
      <b-row class="main-content">
        <b-col >
          <router-view/>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
export default {
  name: 'home',
  components: {
    TopBar
  }
}
</script>
<style lang="scss">
  .main-content {
    max-width: 1140px;
    margin:50px auto 0 auto!important;
  }
</style>
