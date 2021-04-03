<template>
    <div class="register-header">
        <b-button variant="secondary" class="account-btn" v-on:click="login">
            Sign In
            <font-awesome-icon icon="sign-in-alt" />
        </b-button>
    </div>
</template>

<script>
  import router from "../../router";

  export default {
    name: "RegisterHeader",
    methods: {
      login() {
        router.push({ name: 'login' })
      }
    }
  }
</script>

<style scoped lang="scss">
    .register-header {
        display: flex;
        width: 100%;
        padding: 2.0rem 2.0rem;

        .account-btn {
            float: right;
        }
    }
</style>
