<template>
    <b-navbar toggleable="lg" class="top-bar" type="dark">
        <b-navbar-brand class="nav-logo">
            <b-img :src="novosLogo" alt="Novos" width="60" height="60" />
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="left-nav-bar">
                <b-nav-item @click="goToRouter('Dashboard')"
                            :class="{'selected-nav-item':isSelectedRoute('Dashboard')}">
                    <font-awesome-icon icon="rocket" />
                    Dashboard
                </b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="left-nav-bar right-nav-bar">
                <b-nav-item>
                    <span v-text="email"></span>
                </b-nav-item>
                <b-nav-item @click="logOut()">
                    <i class="fa fa-unlock-alt"></i>
                    <font-awesome-icon icon="unlock-alt" />
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
  import authService from '@/service/authService'
  import novosLogo from '@/assets/images/novos-logo.png'

  export default {
    name: 'TopBar',
    data() {
      return {
        novosLogo,
        email: authService.getEmail()
      }
    },
    methods: {
      goToRouter(routeName) {
        this.$router.push({ name: routeName });
      },
      isSelectedRoute(routeName) {
        var currentRouteName = this.$route.name;
        return currentRouteName == routeName;
      },
      logOut() {
        authService.cleanAuthData();
        this.$router.push('/login');
      }
    }
  }
</script>

<style lang="scss">
    @import '@/assets/custom/_variables.scss';

    .top-bar {
        background: $default;
        color: white;
        padding: 0 !important;

        #nav-collapse {
            background: $default;
            justify-content: space-between;
        }

        .nav-logo {
            width: 70px;
            height: 100%;
            text-align: center;
        }

        .left-nav-bar {
            margin-left: 20px;

            .nav-item {
                margin-right: 20px;

                i {
                    margin-right: 5px;
                }
            }
        }

        .right-nav-bar {
            .nav-item {
                margin-right: 15px;
            }
        }

        .navbar-nav {
            a {
                font-size: 16px;
                color: white !important;

                i {
                    font-size: 18px;
                }
            }
        }

        .selected-nav-item {
            i {
                color: $primary !important;
            }
        }
    }
</style>
