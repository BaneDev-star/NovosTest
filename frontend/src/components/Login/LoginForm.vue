<template>
    <div class="login-form text-center">
        <form @submit.prevent="logIn()">
            <h1 class="title">Bane Novos Home Task</h1>
            <div class="position-relative">
                <b-form-input id="l-email" v-model="form.email" type="email" name="email" v-validate="'required|email'"
                              placeholder="Enter email"
                              :class="{ 'is-invalid': submitted && errors.has('email') }"></b-form-input>
                <div class="position-absolute span-container">
                    <font-awesome-icon icon="envelope-open" />
                </div>
            </div>
            <div class="position-relative">
                <b-form-input id="l-password" v-model="form.password" type="password" name="password"
                              v-validate="'required'" placeholder="Password"
                              :class="{ 'is-invalid': submitted && errors.has('password') }">
                </b-form-input>
                <div class="position-absolute span-container">
                    <font-awesome-icon icon="unlock-alt" />
                </div>
            </div>

            <b-button variant="primary" class="continue-btn" size="lg" type="submit">
                SignIn
                <font-awesome-icon icon="sign-in-alt" />
            </b-button>
        </form>
    </div>
</template>

<script>
  import authService from '@/service/authService'

  export default {
    name: "LoginForm",
    data() {
      return {
        form: {
          password: '',
          email: ''
        },
        submitted: false
      }
    },
    methods: {
      logIn: async function() {
        this.submitted = true;
        this.$validator.validateAll().then(async result => {
          if (result) {
            let result = await authService.signIn({
              email: this.form.email,
              password: this.form.password
            });
            if (result.data.success) {
              authService.setAuthData(result.data.token, this.form.email);
              this.$notify({
                group: 'foo',
                title: 'Login',
                text: 'Success to login'
              });

              this.$router.push('/');
            } else {
              this.$notify({
                group: 'foo',
                title: 'Login',
                text: result.data.message
              });
            }
          }
        });

      }
    }
  }
</script>

<style scoped lang="scss">
    .login-form {
        background: #1E1B52;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
        padding: 0 5rem;
        color: white;

        #l-password {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }

        #l-email {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }

        .title {
            margin-bottom: 3.0rem;
        }

        .continue-btn {
            margin-top: 10rem;
            margin-bottom: 2rem;
            width: 10rem;
            color: black;
        }

        .span-container {
            left: 3px;
            top: 0;
            padding-right: 0.5rem;
            padding-left: 0.5rem;
            color: #C45BED;
            height: 100%;
            display: flex;
            align-items: center;
        }

        .form-control {
            min-width: 240px;
            border-width: 1px !important;
            padding-left: 40px;
        }
    }

    .is-invalid {
        border-color: red !important;
    }
</style>
