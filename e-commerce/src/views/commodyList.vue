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
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" >
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
        this.clickTop();
      },
      SetSort() {
        this.priceSort = !this.priceSort;
        this.getGoodList(true);
      },
      loadMore(){
        
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodList(true);
          this.busy = false;
        }, 500);
      },
      getGoodList(bool) {
        let param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.priceSort ? 1 : -1
        }
        axios.get('/goods', {
          params: param
        }).then((response) => {
          let res = response.data;
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
      }
    },
    mounted() {
      this.getGoodList(false);
    },
  }

</script>
