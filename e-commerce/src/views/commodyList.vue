<template>
  <div id="app">
    <list-heard></list-heard>
    <list-bread>
      <span slot='bread'>List</span>
    </list-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="SetSort">Price <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterTop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" :class="{'cur':priceCheck == 'all'}" @click="priceSet('all')">All</a>
              </dd>
              <dd v-for="(price, index) in  priceFilter" :key="index">
                <a href="javascript:void(0)" :class="{'cur':priceCheck==index}"
                  @click="priceSet(index)">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(items,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#"><img v-lazy="'static/' + items.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{items.productName}}</div>
                    <div class="price">{{items.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(items.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" >
                <img src="./../assets/loading-spinning-bubbles.svg" alt="" v-show="loading">
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='md-overlay' v-show="overShow" @click="clickTop"></div>
    <list-footer></list-footer>
  </div>
</template>
<script>
  import '@/assets/base.css';
  import '@/assets/checkout.css';
  import '@/assets/product.css';
  import listHeard from '@/components/hearder';
  import listFooter from '@/components/footer';
  import listBread from '@/components/bread';
  import axios from 'axios'
  export default {
    data() {
      return {
        goodsList: [],
        priceFilter: [{
            startPrice: '0.00',
            endPrice: '300.00'
          },
          {
            startPrice: '300.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
        ],
        priceCheck: 'all',
        filterBy: false,
        overShow: false,
        priceSort: true,
        loading:false, // 加載的圖片是否顯示
        busy:true,
        page: 1,
        pageSize: 8,
      }
    },
    components: {
      listHeard,
      listFooter,
      listBread,
    },
    methods: {
      showFilterTop() {
        this.filterBy = true;
        this.overShow = true;
      },
      clickTop() {
        this.filterBy = false;
        this.overShow = false;
      },
      priceSet(index) {
        if (index == 'all') {
          this.priceCheck = 'all';
        } else {
          this.priceCheck = index;
        };
        this.clickTop();//
        this.page = 1;
        this.getGoodList();//請求接口
      },
      SetSort() {
        this.priceSort = !this.priceSort;
        this.page =1;
        this.getGoodList(false);
      },
      loadMore(){
        this.busy = true;
        setTimeout(() => {
          this.page ++;
          this.busy = false;
          if(this.page <= 3 ){
              this.getGoodList(true);
          }
        }, 1000);

      },
      getGoodList(bool) {
        let param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.priceSort ? 1 : -1,
          priceLeave :this.priceCheck
        };
        this.loading = true; //顯示加載圖片
        axios.get('/goods', {
          params: param
        }).then((response) => {
          let res = response.data;
          this.loading = false; //隱藏加載的圖片
          if (res.status == "0") {
            if(bool){
               this.goodsList =  this.goodsList.concat(res.result.list);
               if(res.result.count == 0){
                 this.busy = true;
               }else{
                 this.busy = false;
               }
            }else{
              this.goodsList = res.result.list;
              this.busy = false;
            }

          } else {
            this.goodsList = [];
          }
        })
      },
      addCart(id){
          axios.post('/goods/addCart',{
              productId:id
          }).then((res) => {
              if(res.data.status == 0){
                  alert('加入成功');
              }else {
                  alert(res.msg);
              }
          })
      }
    },
    mounted() {
      this.getGoodList(false);
    },
  }

</script>
