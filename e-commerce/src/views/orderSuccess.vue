<template>
    <div>
      <nav-header></nav-header>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{orderId}}</span>
              <span>Order total：{{orderCount | currency('￥')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link  class="btn btn--m" to="/cart">Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link  class="btn btn--m" to="/">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <list-footer></list-footer>
    </div>
</template>

<script>
    import NavHeader from "@/components/NavHeader";
    import Bread from '@/components/bread';
    import listFooter from '@/components/footer';
    import Model from '@/components/model';
    import axios from 'axios';
    export default {
        name: "orderSuccess",
        data(){
            return{
                orderId:'',
                orderCount:0
            }
        },
        mounted() {
            let orderId = this.$route.query.orderId;
            axios.get('/users/orderList',{
                params:{
                    orderId:orderId
                }
            }).then((respron)=>{
                    this.orderId = respron.data.result.orderId;
                    this.orderCount = respron.data.result.orderTotal

            })
        },
        methods:{

        },
        components:{
            NavHeader,
            Bread,
            listFooter
        }
    }
</script>

<style scoped>

</style>
