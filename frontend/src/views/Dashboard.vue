<template>
    <div>
        <b-row align-h="between">
            <b-col>
                <h2 class="pricing-plan">My Plans</h2>
            </b-col>
        </b-row>
        <b-card class="dashboard-container custom-card">
            <b-row class="bank-form">
                <b-col cols="12">
                    <b-form>
                        <h4>New Session Bank</h4>
                        <b-form-group
                                id="title-group"
                                label="Title:"
                                label-for="txt-title"
                                description="Plan Title"
                        >
                            <b-form-input
                                    id="txt-title"
                                    v-model="form.title"
                                    type="text"
                                    placeholder="Enter the title"
                                    required
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group
                                id="title-group"
                                label="Description:"
                                label-for="txt-description"
                                description="Plan Description"
                        >
                            <b-form-textarea
                                    id="txt-description"
                                    v-model="form.description"
                                    type="text"
                                    rows="5"
                                    placeholder="Enter the description"
                                    required
                            ></b-form-textarea>
                        </b-form-group>
                        <div class="text-right">
                            <b-button type="submit" variant="primary" @click="addBankSession">Add Bank</b-button>
                        </div>
                    </b-form>
                </b-col>
            </b-row>
        </b-card>

        <b-card class="dashboard-container custom-card">
            <b-row class="plan-content">
                <b-col col md="6" cols="12">
                    <div class="plan-table table-responsive">
                        <div class="plan-header">
                            <h6 class="title">My training plan</h6>
                            <span role="button" @click="ClearAllPlan" class="clear-all">Clear All</span>
                        </div>
                        <draggable class="list-group" tag="ul" v-model="list" v-bind="dragOptions" :move="onMove"
                                   @start="isDragging=true" @end="isDragging=false" v-on:change="changePlanOrder">
                            <transition-group type="transition" :name="'flip-list'">
                                <li class="list-group-item" v-for="(element, index) in list" :key="element._id">
                                    <div class="session-item">
                                        <font-awesome-icon icon="stream" />
                                        <div class="content-div">
                                            <div>{{element.title}}</div>
                                            <div>{{element.description}}</div>
                                        </div>
                                        <div class="action-div">
                                            <span role="button" class="btn-complete"
                                                  :class="{'active': element.isCompleted}"
                                                  @click="completePlan(index)">
                                                <font-awesome-icon icon="plus" />
                                            </span>
                                            <span role="button" class="btn-remove"
                                                  @click="assignBankSession(index, false)">
                                                <font-awesome-icon icon="trash" />
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            </transition-group>
                        </draggable>
                    </div>
                </b-col>
                <b-col col md="6" cols="12">
                    <div class="plan-table table-responsive">
                        <div class="plan-header">
                            <h6 class="title">Training sessions bank</h6>
                        </div>
                        <draggable element="span" v-model="list2" v-bind="dragOptions" :move="onMove"
                                   v-on:change="changeBankOrder">
                            <transition-group name="no" class="list-group" tag="ul">
                                <li class="list-group-item" v-for="(element, index) in list2" :key="element._id">
                                    <div class="session-item">
                                        <div>
                                            <font-awesome-icon icon="stream" />
                                        </div>
                                        <div class="content-div">
                                            <div>{{element.title}}</div>
                                            <div>{{element.description}}</div>
                                        </div>
                                        <div class="action-div">
                                            <span role="button" class="btn-complete"
                                                  @click="assignBankSession(index, true)">
                                                <font-awesome-icon icon="plus" />
                                            </span>
                                            <span role="button" class="btn-remove"
                                                  @click="removeBankSession(index)">
                                                <font-awesome-icon icon="trash" />
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            </transition-group>
                        </draggable>
                    </div>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
  import draggable from "vuedraggable";
  import authService from '@/service/authService';

  export default {
    name: 'dashboard',
    components: {
      draggable
    },
    data() {
      return {
        form: {
          title: '',
          description: ''
        },
        list: [],
        list2: [],
        editable: true,
        isDragging: false,
        delayedDragging: false
      }
    },
    methods: {
      onMove({ relatedContext, draggedContext }) {
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        return (
          (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
        );
      },

      async ClearAllPlan() {
        this.list = [];
        await authService.clearPlans(this.token);
      },

      async changeBankOrder(evt) {
        console.log("evt = ", evt);
        if (evt.moved) {
          const orderedIds = this.list2.map(item => item._id);
          await authService.updateBankOrder(this.token, {
            orderedIds: orderedIds
          })
        }
      },

      async changePlanOrder(evt) {
        console.log("evt1 = ", evt);
        if (evt.moved) {
          const orderedIds = this.list.map(item => item._id);
          await authService.updatePlanOrder(this.token, {
            orderedIds: orderedIds
          });
        } else if (evt.removed) {
          await this.assignBankSession(evt.removed.element._id, false);
        } else if (evt.added) {
          await this.assignBankSession(evt.added.element._id, true);
        }
      },

      async addBankSession(evt) {
        evt.preventDefault();
        this.$validator.validateAll().then(async result => {
          if (result) {
            const res = await authService.addBankSession(this.token, {
              title: this.form.title,
              description: this.form.description,
              order: this.list2.length + 1
            });
            this.form.title = "";
            this.form.description = "";
            if (res.data.success) {
              this.$notify({
                group: 'foo',
                title: 'New Bank',
                text: 'Success to add new training session bank'
              });
              this.list2.push(res.data.data);
            }
          }
        });
      },

      async getBankSessions() {
        const response = await authService.getBankSessions(this.token);
        this.list2 = response.data.banks;
      },

      async getPlans() {
        const response = await authService.getPlans(this.token);
        this.list = response.data.plans;
      },

      async assignBankSession(index, assign) {
        const element = assign ? this.list2[index] : this.list[index];
        const res = await authService.assignPlan(this.token, element._id, assign, assign ? this.list.length + 1 : this.list2.length + 1);
        if (assign) {
          this.list2.splice(index, 1);
          this.list.push({
            ...element,
            _id: res.data.data._id,
            order: this.list.length + 1,
            isCompleted: false
          })
        } else {
          this.list.splice(index, 1);
          this.list2.push({
            ...element,
            _id: res.data.data._id,
            order: this.list2.length + 1
          })
        }
      },

      async removeBankSession(index) {
        await authService.deleteBankSession(this.token, this.list2[index]._id);
        this.list2.splice(index, 1);
      },

      async completePlan(index) {
        await authService.completePlan(this.token, this.list[index]._id, true);
        this.list[index].isCompleted = true;
        console.log("list = ", this.list);
      }
    }
    ,
    computed: {
      dragOptions() {
        return {
          animation: 0,
          group: "description",
          disabled: !this.editable,
          ghostClass: "ghost"
        };
      }
      ,
    }
    ,
    watch: {
      isDragging(newValue) {
        if (newValue) {
          this.delayedDragging = true;
          return;
        }
        this.$nextTick(() => {
          this.delayedDragging = false;
        });
      }
    }
    ,
    async mounted() {
      this.token = authService.getAuthToken();
      if (!this.token) {
        this.$router.push({ name: 'login' })
      } else {
        this.getBankSessions();
        this.getPlans();
      }
    }
  }
</script>
<style lang="scss">
    @import '@/assets/custom/_variables.scss';

    $default-font-size: 16px;
    .custom-card {
        border: none !important;
        -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.125);
        -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.125);
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.125);
        color: black;
        margin-bottom: 20px;
    }

    .plan-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .title {
            color: #C45BED;
            font-weight: 600;
        }
    }

    .session-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;

        .content-div {
            flex: 1;
        }

        .action-div {
            display: flex;
        }
    }

    .hidden-header {
        display: none;
    }

    .clear-all {
        &:hover {
            color: #ff253a;
        }
    }

    .dashboard-container {
        padding: 30px;

        .flip-list-move {
            transition: transform 0.5s;
        }

        .no-move {
            transition: transform 0s;
        }

        .ghost {
            opacity: 0.5;
            background: #c8ebfb;
        }

        .list-group {
            min-height: 20px;
        }

        .list-group-item {
            cursor: move;
        }

        .list-group-item i {
            cursor: pointer;
        }

        .pricing-plan {
            color: $default;
            font-size: 26px;
        }

        .plan-content {
            font-size: $default-font-size;

            .plan-title {
                margin-bottom: 30px;
                font-size: 46px;

                span {
                    font-size: $default-font-size;
                }
            }


            .btn-complete,
            .btn-remove {
                width: 30px;
                height: 30px;
                border-radius: 100%;
                background: #ddd;
                display: flex;
                align-items: center;
                cursor: pointer;

                svg {
                    margin: auto;
                }
            }

            .btn-complete {
                &.active {
                    background: $primary;
                }

                &:hover {
                    background: $primary;
                }
            }

            .btn-remove {
                margin-left: 10px;

                &:hover {
                    background: #ff253a;
                }
            }
        }
    }

    @media screen and (min-width: $screen-medium-size) {
        .plan-content {
            .col:nth-child(3n+0),
            .col:nth-child(3n+2) {
                border-left: 1px solid #d8d8d8;
                padding-left: 30px;
            }
        }
    }

    @media screen and (max-width: $screen-medium-size) {
        .plan-content {
            .col {
                margin-bottom: 20px;
            }
        }
        .dashboard-container {
        }
    }

    .vue-switcher-theme--bulma.vue-switcher-color--default.vue-switcher--unchecked div {
        background-color: $primary;
    }

    .vue-switcher--bold div {
        top: 8px;
        margin: 0px 10px;
    }
</style>
