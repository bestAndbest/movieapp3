<template>
  <div class="home">
    <Scroll :pullUp="pullUp">

    <div>
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="ele in fivemovies" ><img :src="ele.imgUrl" alt="" @tap="toMovieData(ele.actionData)"/></swiper-slide>
      </swiper>
      <ul class="tabs" ref="tabs">
        <li :class="{bottomborder:currentcomponent==='hot'}" @tap="tohot">正在热映</li>
        <li :class="{bottomborder:currentcomponent==='comingsoon'}" @tap="tocomingsoon">即将上映</li>
      </ul>
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <keep-alive>
              <component :is="currentcomponent" :num="num"></component>
            </keep-alive>
        </transition>
    </div>
    </Scroll>
    <tabbar></tabbar>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import hot from '@/components/movie/Hot.vue'
import comingsoon from '@/components/movie/ComingSoon.vue'

export default {
  name: 'movie',
  data(){
    return{
      swiperOption:{
        loop:true,
        autoplay:true,
        // preventClicksPropagation : true,
      },
      currentcomponent:'hot',
      num:1,
      fivemovies:[],
    }
  },
  components: {
    hot,
    comingsoon
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  methods:{
   toMovieData(actionData){
       let index=actionData.indexOf(':')
       let id=actionData.substring(index+2,index+6)
       this.$router.push('/moviedetail/'+id)
   },
    pullUp(){
      this.num++
    },
    tohot(){
      this.currentcomponent='hot'
    },
    tocomingsoon(){
      this.currentcomponent='comingsoon'
    },
  },
    created(){
      let city=JSON.parse(localStorage.getItem('city'))
      if(city){
        console.log('cityId',city.cityId);
      }else{
        this.$router.push('/location')
      }

      let url='https://m.maizuo.com/gateway?type=2&cityId=110100&k=1317497'
        this.$axios({
            url,
            method:'get',
            headers:{
                'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15728699844239132721697","bc":"310100"}',
                'X-Host': 'mall.cfg.common-banner'
            }
        }).then(res=>{
            if(res.status===200 && res.data.status===0){
                console.log(res.data.data);
                this.fivemovies=res.data.data
            }
        }).catch(err=>{
            console.log(err)
        })
    },
}
</script>
<style lang="scss" scoped>
  .home{
    height: 100%;
    .swiper-container{
      width:100%;
      box-sizing: border-box;
      background: rgb(249, 249, 249);
      img{
        width:100%;
      }
    }
    .tabs{
      width: 100%;
      top: 0;
      z-index: 999;
      display: flex;
      padding-top: 14px;
      justify-content: space-around;
      border-bottom: 1px solid #999;
      background-color: #fff;
      font-size: 14px;
      li{
        padding-bottom: 10px;
      }
      .bottomborder{
        color: #26A2FE;
        border-bottom: 4px solid #26A2FE;
      }
    }
  }



</style>
