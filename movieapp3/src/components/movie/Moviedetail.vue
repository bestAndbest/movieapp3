<template>
    <div class="moviedetail">
        <div class="iconfont icon-arrow1 goback " @click="gobackFn"></div>
        <!--展示图片-->
        <div ref="hide_all" class="hide_all">
            <mt-header :title="imgindex+'/'+photosNum">
                <mt-button  slot="left" class="iconfont icon-delete" @click="delFn"></mt-button>
            </mt-header>
            <img class="imgcenter" ref="imgcenter"/>
        </div>
        <!--展示所有图片-->
        <div ref="photos" class="photos">
            <mt-header :title="'剧照('+photosNum+')'">
                <mt-button  slot="left" class="iconfont icon-arrow1" @click="gotoMovieData"></mt-button>
            </mt-header>
           <div class="allimgs">
               <img :src="url" v-for="(url,i) in movieData.photos" alt="" @click="showphoto(url,i,'all')"/>
           </div>
        </div>
        <div ref="mainbox">
              <div class="imgbox" >
                  <img :src="movieData.poster"/>
              </div>
              <div class="content" ref="content">
                  <div class="title" ref="namegrade">
                      <h2>{{movieData.name}}<span>{{name}}</span></h2>
                      <b id="delgrade"><i>{{movieData.grade}}</i>&nbsp;分</b>
                  </div>
                  <div class="fontcolor">
                      <p>{{movieData.category}}</p>
                      <p>{{premiereAtFn}}上映</p>
                      <p>{{movieData.nation}}&nbsp;|&nbsp;{{movieData.runtime}}分钟</p>
                      <div class="detailinfo">{{movieData.synopsis}}</div>
                  </div>
              </div>
            <div :class="animateCss" @click="UpDownCss"><b :class="updowncss"></b></div>
            <div class="actors">
                <p>演职人员</p>
                <swiper :options="swiperOption"  >
                        <swiper-slide v-for="actor in movieData.actors">
                            <div class="imgdiv"><img :src="actor.avatarAddress" alt=""/></div>
                            <div>{{actor.name}}</div>
                            <p>{{actor.role}}</p>
                        </swiper-slide>
                </swiper>
            </div>
            <div class="juzhaobox">
                <p @click="showAllPotos"><span>剧照</span><b>全部({{photosNum}})<b class="iconfont icon-arrow"></b></b></p>
                <swiper :options="swiperOption2"  >
                    <!-- slides -->
                    <swiper-slide v-for="(photo,index) in movieData.photos">
                       <img id="juzhao" :src="photo" @click="showphoto(photo,index)"/>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <div class="nowbuy" ref="nowbuy">
            立即购买
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import moment from 'moment'
    export default {
        name: "Moviedetail",
        data(){
          return{
            movieData:[],
              name:'',
              imgindex:0,
              photosNum:0,
              updowncss:'iconfont icon-arrow-down',
              animateCss:'arr',
              isGo:true,
              swiperOption:{
                  slidesPerView :3
              },
              swiperOption2:{
                  slidesPerView :2
              }
          }
        },
        computed:{
            premiereAtFn(){
                let time=moment(this.movieData.premiereAt*1000).format('YYYY-MM-DD')
                return time
            }
        },
        watch:{
            movieData:{
                //如果没有成绩则移除
                handler(){
                    if(this.movieData.grade==undefined){
                       console.log(this.movieData.grade==undefined)
                        let grade=document.getElementById('delgrade')
                        this.$refs.namegrade.removeChild(grade)

                    }
                },
                deep:true
            }
        },
        methods:{
            SAP(){
                this.$refs.mainbox.style.display='none'
                this.$refs.hide_all.style.display='none'
                this.$refs.photos.style.display='block'
            },
            showAllPotos(){
                this.isGo=false
                this.$refs.nowbuy.style.display='none'
                this.SAP()
            },
            //返回
            gobackFn(){
                this.$router.back()

            },
            //展用户所点击图片
            showphoto(imgurl,index,info){
                if(info==='all'){
                    this.isGo=false
                }else{
                    this.isGo=true
                }
                this.imgindex=index
                this.$refs.mainbox.style.display='none'
                this.$refs.photos.style.display='none'
                this.$refs.nowbuy.style.display='none'
                this.$refs.hide_all.style.display='block'
                this.$refs.imgcenter.src=imgurl
            },
            gotoMovieData(){
                this.$refs.mainbox.style.display='block'
                this.$refs.hide_all.style.display='none'
                this.$refs.photos.style.display='none'
                this.$refs.nowbuy.style.display='block'
            },
            delFn(){

                if(this.isGo){
                    this. gotoMovieData()
                }else{
                    this.SAP()
                }
                this.$refs.nowbuy.style.display='block'
            },
            //展开收缩内容
            UpDownCss(){
                if(this.updowncss==='iconfont icon-arrow-down'){
                    this.updowncss='iconfont icon-arrow-up'
                    this.$refs.content.style.height='auto'
                    this.animateCss='arr animated slideInDown'
                }else{
                    this.updowncss='iconfont icon-arrow-down'
                    this.$refs.content.style.height='142px'
                    this.animateCss='arr animated slideInUp'
                }

            },
            //获取当前电影信息
           getMovieDate(id){
                let url='https://m.maizuo.com/gateway?filmId='+id+'&k=8313602'
                axios({
                    url,
                    methods: 'get',
                    headers:{
                        'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15728699844239132721697","bc":"440300"}',
                        'X-Host': 'mall.film-ticket.film.info'
                    }
                }).then(res=>{
                    this.movieData=res.data.data.film
                    this.name=this.movieData.item.name
                    this.photosNum=this.movieData.photos.length
                    console.log(this.movieData);
                }).catch(err=>{
                    console.log(err)
                })

            }
        },
        created() {
            this.getMovieDate(this.$route.params.id)
            //自适应显示图片张数
            this.swiperOption2.slidesPerView=document.body.clientWidth/160
        },
    }
</script>

<style lang="scss" scoped>
    .moviedetail{
        background-color: #fff;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        .goback{
            width: 26px;
            height: 26px;
           border-radius: 50%;
            background-color: #fff;
            opacity: .6;
            text-align: center;
            line-height: 26px;
            top: 5px;
            left: 5px;
            position: absolute;
            color: #000;
            font-size: 16px;
            z-index: 22;
        }
        .hide_all,.photos{
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 444;
            display: none;
            .mint-header{
                padding: 5px;
                margin-bottom: 40px;
                color: #333;
                font-size: 18px;
                background-color: #fff;
                position: relative;
                z-index: 222;
                .icon-delete{
                    font-size: 26px;
                }
            }
        }
        .hide_all{
            background-color: #000;
            .imgcenter{
                width: 100%;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
            }
        }
        .photos{
            background-color: #fff;
            .mint-header{
                background-color: #fff;
                color: #333;
            }
            .allimgs{
              height: 100%;
                img{
                    float: left;
                    width: 31%;
                    height: 20%;
                    margin-left: 1.7%;
                    margin-top: 20px;
                }
            }
        }
        .imgbox{
            position: relative;
            top: 0;
            overflow: hidden;
            height: 180px;

            img{
                width: 100%;
                max-height: 300px;
                position: absolute;
                bottom: 0px;
            }
        }
        .content{
            width: 100%;
            padding: 16px 16px 0 16px;
            height: 142px;
            overflow: hidden;
            box-sizing: border-box;

            .title{
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                h2{
                    position: relative;
                    width: 86%;
                    span{
                        position: absolute;
                        margin-left: 5px;
                        padding: 1px;
                        font-size: 10px;
                        color: #fff;
                        background-color: #d2d6dc;
                        border-radius: 2px;
                    }
                }
                b{
                    color: orange;
                    i{
                        font-size: 16px;
                    }
                }
            }
            .fontcolor {
                font-size: 13px;

                color: #797d82;
                p{
                    margin-top: 4px;
                }
                div{
                    margin-top: 4px;
                }

            }
        }
        .arr{
            position: relative;
            z-index: 6;
            width: 100%;
            height: 26px;
            text-align: center;
            line-height: 26px;
            background-color: #fff;
            border-bottom: 10px solid #F4F4F4;
        }
        .actors{
            box-sizing: border-box;
            padding: 16px;
            padding-bottom: 0;
            border-bottom: 10px solid #F4F4F4;
            p{
                font-size: 16px;
               padding-bottom: 16px;
            }
            .swiper-container{
                .swiper-wrapper{
                    width: 100%;
                    display: flex;
                    flex-wrap: nowrap;
                    flex-direction: row;

                  .swiper-slide{
                      text-align: center;
                      width: 85px;
                      .imgdiv{
                          width: 85px;
                          overflow: hidden;
                          height: 96px;
                          img{
                              margin-top: -10px;
                              width: 85px;
                          }
                      }
                      div,p{
                          width: 85px;
                      }
                      p{
                          font-size: 12px;
                          color: #797d82;;
                      }
                  }
                }
            }

        }
        .juzhaobox{
            padding: 14px ;
            background-color: #fff;
            margin-bottom: 49px;
            border-bottom: 10px solid #F4F4F4;
            p{
                display: flex;
                line-height: 36px;
                justify-content: space-between;
                span{
                    font-size: 16px;
                }
                b{
                    font-size: 13px;
                    color: #797d82;
                }
            }
            .mint-cell{
                border: 0;
            }
            #juzhao{
                width: 92%;
                height: 100px;
                object-fit: cover;
                /*background-size: cover;*/
            }
        }
        .nowbuy{
            position: fixed;
            bottom: 0;
            z-index: 222;
            text-align: center;
            line-height: 49px;
            width: 100%;
            height: 49px;
            font-size: 16px;
            color: #fff;
            background-color: #FF4201;
        }

    }
</style>