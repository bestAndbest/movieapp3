import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    schedules:[],
    schedules1:[],
    filmId:0,
    cinemaId:0,
    have:true,
    usercity:'',
    atcity:'',
    storeData:[],
  },
  mutations: {

    saveDateMovie(state,payload){
       state.schedules=payload

    },
    saveCity(state,payload){
       state.usercity=payload
        localStorage.setItem('city',JSON.stringify(payload))
      console.log('payload',payload);
    },
      atCity(state,payload){
       state.atcity=payload
    },
    savecinema(state,payload){
      state.storeData=payload
    }

  },
 getters:{
   getDay(state,ms){
     let day= new Date(ms).getDay()
     let today=new Date().getDay()
     let d=new Date().getTime()
     let tomorrow=new Date(d+24*60*60*1000).getDay()
     let houtian=new Date(d+24*60*60*1000*2).getDay()
     if(day==today){
       return '今天'
     }else if(day==tomorrow){
       return '明天'
     }else if(day==houtian){
       return '后天'
     }
     else if(day==0 ){
       return'周日'
     }else if(day==1){
       return'周一'
     }
     else if(day==2){
       return'周二'
     }
     else if(day==3){
       return'周三'
     } else if(day==4){
       return'周四'
     }else if(day==5){
       return'周五'
     }else if(day==6){
       return'周六'
     }

   },

 },
  actions: {
    //获取影店数据
    getStoreDate(store,id){
      let url='https://m.maizuo.com/gateway/?cinemaId='+id+'&k=2680902'
      axios({
        url,
        methods: 'get',
        headers:{
          'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15728699844239132721697","bc":"440300"}',
          'X-Host': 'mall.film-ticket.cinema.info'
        }
      }).then(res=>{
        if(res.status===200 && res.data.msg==='ok'){
          let {cinema}=res.data.data
          store.commit('savecinema',cinema)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    getXYbyIP(store,payload) {
        var url="https://api.map.baidu.com/location/ip?ak=HQi0eHpVOLlRuIFlsTZNGlYvqLO56un3&coor=bd09ll";//百度
      $.ajax({
        url:url,
        type: 'POST',
        dataType: 'JSONP',
        async: false,
        cache: true,
        success: function (data) {
          console.log('data',data.content.point);
          let length=data.content.address_detail.city.length
          let city=data.content.address_detail.city.substring(0,length-1)
          console.log(city);
          //存取当前城市id
          let city2=payload.filter((item)=>{
              return item.name==city
          })
            store.commit('atCity',city)
            store.commit('saveCity',{name:city,cityId:city2[0].cityId})
        },
        error: function (data) {
          console.log(data);
        }
      });

    },
      getDay1Movie(store,payload){
        let s1=store.state.schedules1
        let id=store.state.filmId
        console.log('payload',payload);
        if(s1.length<=0 || payload.filmId!=id){
          store.state.filmId=payload.filmId
          let url='https://m.maizuo.com/gateway/?filmId='+payload.filmId+'&cinemaId='+payload.cinemaId+'&date='+payload.t+'&k=1169094'
          axios({
            url,
            method:'get',
            headers:{
              'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15728699844239132721697"}',
              'X-Host':' mall.film-ticket.schedule.list'
            }
          }).then(res=>{
            if(res.status==200 && res.data.status==0){
                console.log('不同',res);
                let schedules =res.data.data.schedules
                //设置今天
                store.state.schedules1=schedules
                store.commit('saveDateMovie',schedules)
                console.log('schedules',schedules);
              store.state.have=true
            }else{
             store.state.have=false
            }

          }).catch(err=>{
            console.log(err);
          })
        }else {
          store.commit('saveDateMovie',store.state.schedules1)
        }
      },

  },

})
