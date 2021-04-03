<template>
    <b-container fluid class="login-screen">
        <b-row no-gutters class="h-100">
            <b-col col md="4" sm="12">
                <register-form />
            </b-col>
            <b-col col md="8" sm="12" class="text-center">
                <register-header />
                <b-img :src="loginImage" v-bind="loginImageProps" />
                <register-footer />
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
  import RegisterForm from '../components/Register/RegisterForm'
  import RegisterHeader from "../components/Register/RegisterHeader";
  import RegisterFooter from "../components/Register/RegisterFooter";
  import loginImage from '../assets/images/login_image.png'

  export default {
    name: "Register",
    components: { RegisterFooter, RegisterHeader, RegisterForm },
    data: function () {
      return {
        loginImage,
        loginImageProps: { class: 'home-image' }
      };
    }
  }
</script>

<style lang="scss">
    .login-screen {
        height: 100vh;
        padding: 0 !important;
    }

    .home-image {
        max-height: calc(100% - 12rem);
        max-width: 90%;
    }
</style>
