<template>
    <div class="login-header">
        <b-button variant="secondary" class="account-btn" v-on:click="register">
            Create an account
            <font-awesome-icon icon="user-plus" />
        </b-button>
    </div>
</template>

<script>
  import router from "../../router";

  export default {
    name: "LoginHeader",
    methods: {
      register() {
        router.push({ name: 'register' })
      }
    }
  }
</script>

<style scoped lang="scss">
    .login-header {
        display: flex;
        width: 100%;
        padding: 2.0rem 2.0rem;

        .account-btn {
            float: right;
        }
    }
</style>
