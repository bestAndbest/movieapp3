<template>
    <div class="filmbox">
        <div class="indexBox">
            <div class="header" @click="goBack"><p class="iconfont icon-arrow1"></p><h3>{{storeData.name}}</h3></div>
            <div class="filmtitle">
                <h3>{{storeData.name}}</h3>
                <p @click="showServe"><span v-for="ele in storeData.services">{{ele.name}}</span><b class="iconfont icon-arrow"></b></p>
            </div>
            <div class="contact">
                <b class="iconfont icon-Location" ></b>
                <b>{{storeData.address}}</b>
                <b class="iconfont icon-phone"></b>
            </div>
            <div class="swiper1">
                <swiper :options="swiperOption" ref="mySwiper" >
                    <swiper-slide v-for="(ele,index) in moviesDate" :index="index">
                        <img  :src="ele.poster" />
                    </swiper-slide>
                </swiper>
            </div>
            <dl class="movieInfo" @click="gotoMovieData(movieInfo.filmId)">
                <dt><span>{{movieInfo.name}}</span><b><i>{{movieInfo.grade}}</i>&nbsp;分</b></dt>
                <dd>
                    <span>{{movieInfo.category}}</span>
                    <span>&nbsp;|&nbsp;{{movieInfo.runtime}}分钟&nbsp;|&nbsp;</span>
                    <span>{{movieInfo.director}}&nbsp;|&nbsp;</span>
                    <span v-for="ele in movieInfo.actors">{{ele.name}}</span>
                </dd>
                <dd class="toMovieData iconfont icon-arrow"></dd>
            </dl>
            <div class="swiper2">
                <swiper :options="swiperOption2"  >
                    <swiper-slide v-for="(ele,index) in movieInfo.showDate" >
                        <div @click="clickHandler(ele,index)" :class="{'color':selected===index}">
                            {{$moment(ele*1000).format('MM月DD日')}}
                            <p :class="{'bb':selected===index}"></p>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
                <ul  class="ticketList" v-if="have" ref="TL" >
                    <li v-for="ele in schedules">
                        <dl class="first_dl">
                            <dt>{{$moment(ele.showAt*1000).format('HH:mm')}}</dt>
                            <dd>{{$moment(ele.endAt*1000).format('HH:mm')}}散场</dd>
                        </dl>
                        <dl class="second_dl">
                            <dt>{{ele.filmLanguage}}</dt>
                            <dd>{{ele.hallName}}</dd>
                        </dl>
                        <div class="pribuy">
                           <div><b>￥</b><span>{{ele.salePrice/100}}</span></div>
                            <div class="buy">购票</div>
                        </div>
                    </li>
                </ul>
            <div class="without" v-else>
                <img src="../../assets/imgs/without.png"/>
                <p>暂无场次</p>
            </div>
        </div>
        <div class="servicesBox" ref="services">
            <div class="header" @click="toIndex"><p class="iconfont icon-arrow1"></p></div>
            <div class="services">
                <h2>{{storeData.name}}</h2>
               <div>
                   <dl v-for="serve in storeData.services">
                       <dt><span>{{serve.name}}</span></dt>
                       <dd>{{serve.description}}</dd>
                   </dl>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState,mapActions} from 'vuex'
    export default {
        name: "Film",
        data(){
            return{
               moviesDate:[],
                movieInfo:{},
                ms:0,
                isIndex:false,
                selected:0,
                cinemaId:0,
                cssFlag:true,
                swiperOption:{
                    slidesPerView: 3,
                    spaceBetween: 30,
                    centeredSlides: true,
                    loop: true,
                },
                swiperOption2:{
                    slidesPerView: 3,
                }
            }
        },
        mounted(){
            //更新当前所选中电影的信息
            this.swiper.on('transitionEnd', ()=> {
                let img_center=document.getElementsByClassName('swiper-slide-active')[0]
                this.movieInfo=this.moviesDate[img_center.getAttribute('index')]
                let mi= this.movieInfo
                this.selected=0
                this.$store.dispatch('getDay1Movie',{filmId:mi.filmId,cinemaId:this.cinemaId,t:mi.showDate[0]})
                console.log('movieInfo',this.movieInfo);
            })
        },
        computed:{
            ...mapState(['schedules','have','storeData']),
            swiper() {
                return this.$refs.mySwiper.swiper
            },

        },
        methods:{
            //显示服务信息
            showServe(){
                this.$refs.services.style.display='block'
            },
            //隐藏服务信息
            toIndex(){
                this.$refs.services.style.display='none'
            },
            gotoMovieData(id){
                console.log(id);
                this.$router.push('/moviedetail/'+id)
            },
            goBack(){
                this.$router.back()
            },
            clickHandler(ele,index){
                this.selected=index
                this.$store.dispatch('getDay1Movie',{filmId:this.movieInfo.filmId,cinemaId:this.cinemaId,t:ele})
                if(this.cssFlag){
                  this.$refs.TL.setAttribute('class','ticketList animated fadeInLeft')
                }
                setTimeout(()=>{
                    this.$refs.TL.setAttribute('class','ticketList')
                },800)
            },


            //获取电影数据
            getMoviesDate(id){
                let url='https://m.maizuo.com/gateway/?cinemaId='+id+'&k=6841864'
                this.$axios({
                    url,
                    methods: 'get',
                    headers:{
                        'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15728699844239132721697","bc":"440300"}',
                        'X-Host': 'mall.film-ticket.film.cinema-show-film'
                    }
                }).then(res=>{
                    if(res.status===200 && res.data.msg==='ok'){
                        let {films}=res.data.data
                        this.moviesDate=films
                        this.movieInfo=this.moviesDate[0]
                        //获取今天影票数据
                        this.$store.dispatch('getDay1Movie',{filmId:this.movieInfo.filmId,cinemaId:this.cinemaId,t:this.movieInfo.showDate[0]})
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            //获取影票信息
            getTicketData(s){
                let url='https://m.maizuo.com/gateway/?filmId=4920&cinemaId='+this.cinemaId+'&date='+s+'&k=2726446'
                this.$axios({
                    url,
                    methods: 'get',
                    headers:{
                        'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15728699844239132721697","bc":"440300"}',
                        'X-Host': 'mall.film-ticket.schedule.list'
                    }
                }).then(res=>{
                    if(res.status===200 && res.data.msg==='ok'){
                        let {schedules}=res.data.data
                        console.log('res',schedules);
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
        },
        created() {
            //获取当前时间戳（毫秒）
            let s=new Date().getTime()
            this.cinemaId=this.$route.params.id
            this.getMoviesDate(this.cinemaId)
            this.$store.dispatch('getStoreDate',this.cinemaId)
            // this.$store.dispatch('getDay1Movie',{filmId:this.movieInfo.filmId,cinemaId:this.cinemaId,t:ele})
        },
        mounted() {
            console.log('this.storeData',this.storeData);
        }
    }
</script>

<style lang="scss" scoped>
    .filmbox{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        .indexBox{
            .header{
                display: flex;
                padding: 14px;
                font-weight: 600;
                align-items: center;
                h3{
                    display: none;
                }
            }
            .filmtitle h3,.header h3{
                text-align: center;
                width: 100%;
                font-size: 18px;
                font-weight: 400;
            }
            .filmtitle{
                p{
                    padding: 0 5px;
                    margin-top: 10px;
                    display: flex;
                    justify-content: center;
                    color: orange;
                    span{
                        font-size: 10px;
                        display: inline-block;
                        padding:2px 5px ;
                        margin-right: 6px;
                        text-align: center;
                        border: 1px solid orange;
                    }
                }
            }
            .contact{
                display: flex;
                padding: 10px 30px 16px 30px;
                justify-content: space-between;
                b{
                    color: #999;
                }
                b:nth-child(2){
                    display: inline-block;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    width: 80%;
                    font-size: 16px;
                    color: #333;
                }
            }
            .swiper1 {
                width: 100%;
                background-color: #000;
                padding: 16px 0 ;
                .swiper-slide {
                    text-align: center;
                    background: #000;
                    display: flex;
                    align-items: center;
                    transition: 300ms;
                    transform: scale(.8);
                    width: 30%;
                    img{
                        width: 100%;
                    }
                }
                .swiper-slide-active,.swiper-slide-duplicate-active{
                    transform: scale(1);
                }
            }
            .swiper2{
                border-top: 1px solid #F6F6F6;
                background-color: #fff;
                padding-top: 10px;
                .swiper-container{
                    text-align: center;
                    font-size: 14px;
                    .swiper-slide{
                        touch-action:none;
                        .color{
                            color: #FF5F16;
                        }
                        .bb{
                            width: 70%;
                            margin: 0px auto;
                            margin-top: 10px;
                            border-bottom: 2px solid #FF5F16;
                        }
                    }
                }
            }
            .movieInfo{
                width: 100%;
                position: relative;
                margin-top: 14px;
                text-align: center;
                dt{
                    span{
                        margin-right: 10px;
                        font-size: 14px;
                    }
                    b{
                        color: orange;
                        i{
                            font-size: 14px;
                        }
                    }
                }
                dd{
                    width: 76%;
                    margin: 6px auto;
                    height: 40px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    color: #797d82;
                    font-size: 13px;

                }
                .toMovieData{
                    width: 26px;
                    position: absolute;
                    top: 50%;
                    right: 10px;
                    transform: translateY(-50%);
                    font-size: 26px;
                }
            }
            .ticketList{
                width: 100%;
                background-color: #fff;
                li{
                    display: flex;
                    justify-content: space-around;
                    border-top: 1px solid #F6F6F6;
                    background-color: #fff;
                    align-items: center;
                    padding: 10px 0;
                    .first_dl dt,.second_dl dt{
                        color: #333;
                        font-size: 15px;
                    }
                    .first_dl dd,.second_dl dd{
                        color: #797d82;
                        font-size: 12px;
                    }
                    .second_dl{
                        width: 20%;
                        dd{
                            width: 100%;
                            text-overflow:ellipsis ;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                    }
                    .pribuy{
                        color: #df5000;
                        display: flex;
                        justify-content: space-between;
                        width: 26%;
                        div{
                            span{
                                font-size: 14px;
                            }
                        }
                        .buy{
                            padding:2px 6px;
                            border: 1px solid #FFCDB6;
                            border-radius: 3px;
                        }
                    }
                }
            }
            .without{
                border-top: 1px solid #F6F6F6;
                background-color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                padding: 10px 0 30px 0;
                img{
                    width: 20%;
                }
                p{
                    color: #bdc0c5;
                    font-size: 14px;
                }

            }
            .mint-indicator-wrapper{
                z-index: 400!important;
            }.mint-indicator-mask{
                 z-index: 400;
             }
        }
        .servicesBox{
            display: none;
            height: 100%;
            width: 100%;
            background-color: #fff;
            position: fixed;
            top: 0;
            z-index: 999;
            .header{
                padding: 16px;
                box-sizing: border-box;
            }
            .services{
                width: 100%;
                h2{
                    margin-bottom: 16px;
                    width: 100%;
                    text-align: center;
                    left: 30px;
                }
                div{
                    dl{
                        font-size: 12px;
                        box-sizing: border-box;
                        padding: 8px 16px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        /*border-bottom: 1px solid #f6f6f6;*/

                        dt{
                            width: 26%;
                            span{
                                font-weight: 200;
                               padding:1px 5px;
                               border: 1px solid #FFE3B2;
                                color: #FFB232;
                           }
                        }
                        dd{
                            color: #797d82;
                            width: 74%;
                        }
                    }
                }
            }
        }

    }
</style>