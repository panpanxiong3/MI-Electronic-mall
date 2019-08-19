<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdshow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <button class="md-close" @click="closeModel">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="modelName"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="colseModel"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="mdshow" @click="closeModel"></div>
  </div>
</template>

<script>
    export default {
        data(){
            return{

            }
        },
        name: "model",
        props:['mdshow'],
        methods:{
            closeModel(){
                  this.$emit('close');
            }
        },


    }
</script>

<style scoped>

</style>
