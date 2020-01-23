<template>
    <div class="selcinema">
        <div class="headbox">
       <ul class="header">
           <li class="iconfont icon-arrow1" @click="goback"></li>
           <li>{{movieName}}</li>
           <li class="iconfont icon-search" @click="toseaFilm"></li>
       </ul>
        <div class="swiper2">
            <swiper :options="swiperOption2"  >
                <swiper-slide v-for="(ele,index) in showCinemas">
                    <div @click="clickHandler(ele.cinemaList,index)" :class="{'color':selected===index}">
                       {{$moment(ele.showDate*1000).format('MM月DD日')}}
                        <p :class="{'bb':selected===index}"></p>
                    </div>
                </swiper-slide>
            </swiper>
        </div>

            <div class="header2">
                <!--头部全城和最近去过-->
                <p @click="selDistrict" :class="{'select':select==0}">全城<b class="iconfont icon-arrow-down"></b></p>
                <p @click="goto":class="{'select':select==1}">最近去过<b class="iconfont icon-arrow-down"></b></p>
            </div>
            <!--区切换-->
            <ul class="districts" ref="districts">
                <li :class="{'sel':sel==-1}" @click="selAll">全城</li>
                <li v-for="(item,i) in areasDate":class="{'sel':sel==i}" @click="changeDistrict(i,item)">{{item}}</li>
            </ul>
            <!--最近去过选项-->
            <ul class="gotochild" ref="gotochild">
                <li :class="{'gotostyle':gotoindex==0}" @click="gotoChild(0)">最近去过</li>
                <li :class="{'gotostyle':gotoindex==1}" @click="gotoChild(1)">离我最近</li>
            </ul>
        </div>
            <ul class="list">
                <li @click="toFilm(ele.cinemaId)" v-for="ele in cinemas">
                    <div>
                        <p>{{ele.name}}</p>
                        <span>{{ele.address}}</span>
                    </div>
                    <dl>
                        <dt>￥<b>{{ele.lowPrice/100}}</b>&nbsp;起</dt>
                        <dd>距离未知</dd>
                    </dl>
                </li>
            </ul>
            <div class="zhedang" ref="zhedang"></div>

    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "selCinema",
        data(){
            return {
                cinemaExtendList:[],
                showCinemas:[],
                movieName:'',
                cinemas:[],
                tempDate:[],
                swiperOption2:{
                    slidesPerView: 3,
                },
                selected:0,
                select:-1,
                sel:-1,
                isSel:'true',
                gotoindex:0,
                areasDate:[]
            }
        },
        computed:{
            ...mapState(['storeData']),
        },


        methods:{
            goback(){
                this.$router.back();
            },
            toseaFilm(){
                this.$router.push('/cinema/seafilm')
            },
            toFilm(id){
                console.log(id);
                this.$router.push('/cinema/'+id+'/film')
            },
            //选择全城区域
            selAll(){
                this.sel=-1
                this.cinemas=this.tempDir
                this.noneStatic()
            },
            noneStatic(){
                this.$refs.districts.style.display='none'
                this.$refs.zhedang.style.display='none'
                this.select=-1
                this.isSel=true
            },
            //用户改变所选区
            changeDistrict(index,name){
                this.sel=index
                this.cinemas= this.tempDir.filter((item)=>{
                    return item.district.name==name
                })

                this.noneStatic()
            },
            noneStatic(){
                this.$refs.districts.style.display='none'
                this.$refs.zhedang.style.display='none'
                this.select=-1
                this.isSel=true
            },
            // 显示区
            showDistrict(){
                let quarr = [];
                this.tempDir.forEach((item) => {
                    quarr.push(item.district.name)
                })
                // 过滤掉重复的区
                let areas = new Set(quarr);
                this.areasDate = [...areas]
            },
            //选择区
            selDistrict(){
                this.showDistrict()
                // console.log('qu', this.areasDate);
                this.$refs.gotochild.style.display='none'
                this.select=0
                if(this.isSel){
                    this.isSel=!this.isSel
                    this.$refs.districts.style.display='block'
                    this.$refs.zhedang.style.display='block'
                }else{
                    this.isSel=!this.isSel
                    this.$refs.districts.style.display='none'
                    this.$refs.zhedang.style.display='none'
                }
            },

            goto(){
                this.select=1
                this.$refs.districts.style.display='none'
                this.$refs.gotochild.style.display='block'
                this.isSel=true
            },
            gotoChild(i){
                this.gotoindex=i
                this.$refs.gotochild.style.display='none'
                this.$refs.zhedang.style.display='none'
                this.select=-1
            },
            clickHandler(list,index){

                console.log(list);
                //根据某天上映影院id帅选某天上映的电影院
                this.cinemas=[]
                for(let i=0;i<this.tempDate.length;i++){
                    for(let j=0;j<list.length;j++){
                        if(this.tempDate[i].cinemaId==list[j]){
                            this.cinemas.push(this.tempDate[i])
                        }
                    }
                }
                console.log(11111,this.cinemas);
                this.tempDir=this.cinemas;
                // console.log('tempDir',this.tempDir);
                this.selected=index
                // this.$store.dispatch('getDay1Movie',{filmId:this.movieInfo.filmId,cinemaId:this.cinemaId,t:ele})

            },
            //摔选上映当前用户要买的电影
            getfilmsData(filmId,cityId){
                let cinemas=localStorage.getItem('cinemas')||[];
                let showCinemas=localStorage.getItem('showCinemas')||[];
                let cinemaExtendList=localStorage.getItem('cinemaExtendList')||[];
                if(cinemas.length<=0||showCinemas.length<=0||cinemaExtendList.length<=0) {
                    let url = 'https://m.maizuo.com/gateway/?filmId=' + filmId + '&cityId=' + cityId + '&k=4119745'
                    this.$axios({
                        url,
                        method: 'get',
                        headers: {
                            'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15728699844239132721697","bc":"110100"}',
                            'X-Host': 'mall.film-ticket.cinema.film-show-cinema'
                        }
                    }).then(res => {
                        console.log(res);
                        if (res.status === 200 && res.data.status === 0) {

                            let {cinemaExtendList, showCinemas} = res.data.data
                            //获取上映电影的id
                            this.cinemaExtendList = cinemaExtendList
                            //showCinemas 获取某天会上映的全部影院id
                            this.showCinemas = showCinemas
                            // 第一次打开选择影院页面默认显示最早上映电影的那天电影院列表
                            let list = showCinemas[0].cinemaList
                            console.log('showCinemas', showCinemas);
                            for (let i = 0; i < this.tempDate.length; i++) {
                                for (let j = 0; j < list.length; j++) {
                                    if (this.tempDate[i].cinemaId == list[j]) {
                                        this.cinemas.push(this.tempDate[i])
                                    }
                                }
                            }
                            this.tempDir = this.cinemas;
                            localStorage.setItem('cinemas', JSON.stringify(this.cinemas))
                            localStorage.setItem('showCinemas', JSON.stringify(showCinemas))
                            localStorage.setItem('cinemaExtendList', JSON.stringify(cinemaExtendList))
                            console.log('第一天', this.cinemas);
                        }
                    }).catch(err => console.log(err))
                }else{
                    this.cinemas=JSON.parse(localStorage.getItem('cinemas'));
                    this.showCinemas=JSON.parse(localStorage.getItem('showCinemas'));
                    this.cinemaExtendList=JSON.parse(localStorage.getItem('cinemaExtendList'));
                    this.tempDir = this.cinemas;

                }
            },
            //获取当前城市的电影院
            getCinemaData(id){
                let url='https://m.maizuo.com/gateway?cityId='+id+'&ticketFlag=1&k=8921000'
                this.$axios({
                    url,
                    method: 'get',
                    headers: {
                        'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15728699844239132721697","bc":"440300"}',
                        'X-Host': 'mall.film-ticket.cinema.list'
                    }
                }).then(res=>{
                    if(res.status===200 && res.data.msg==='ok'){
                        setTimeout(()=>this.isLoading=false,1000)
                        let {cinemas}=res.data.data
                        localStorage.setItem('cinemas',JSON.stringify(cinemas))
                        // this.cinemas=cinemas
                        this.tempDate=cinemas
                        console.log(cinemas);
                    }

                }).catch(err=>{
                    console.log(err);
                })
            },

        },
        created() {
           this.movieName=localStorage.getItem('movieName')
            let filmId=this.$route.params.id
            console.log('filmId',filmId);
            let city=JSON.parse(localStorage.getItem('city'))
            this.getCinemaData(city.cityId)
            this.getfilmsData(filmId,city.cityId)

        },

    }
</script>

<style lang="scss" scoped>
    .selcinema{
        width: 100%;
        height: 100%;
        .header{
            display: flex;
            box-sizing: border-box;
            padding: 14px;
            justify-content: space-between;
            font-size: 18px;
            .iconfont{
                font-size: 18px;
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
        .headbox{
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 101;
            background-color: #fff;

            .header2{
                padding: 12px 20px;
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                border-bottom: 1px solid #F6F6F6;
                p{
                    b{
                        font-size: 12px;
                    }
                }
                .select{
                    color:#4DA7FD;

                }
            }
            .districts{
                box-sizing: border-box;
                padding: 0 0 10px 16px;
                display: none;
                li{
                    display: inline-block;
                    width: 20%;
                    height: 26px;
                    margin-right:4%;
                    margin-top: 10px;
                    text-align: center;
                    line-height: 26px;
                    font-size: 13px;
                    border: 1px solid #797D82;
                    color: #797D82;
                    border-radius: 3px;
                }

                .sel{
                    color: #4DA7FD;
                    border: 1px solid #ECF8F6;
                }
            }
            .gotochild{
                display: none;
                li{
                    padding: 10px 20px;
                    font-size: 13px;
                }
                li:first-child{
                    border-bottom: 1px solid #F6F6F6;
                }
                .gotostyle{
                    color:#4DA7FD;
                }
            }
        }

        .zhedang{
            display: none;
            position: fixed;
            bottom: 0;
            z-index: 100;
            width: 100%;
            height: 100%;
            background-color:rgba(179,179,179,.5);
        }
        .list{
            padding-top: 138px;
            li{
                padding: 16px;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #F6F6F6;
                div{
                    width: 64%;
                    p{
                        line-height: 30px;
                        font-size: 16px;
                    }
                    span{
                        display: block;
                        font-size: 12px;
                        color: #797d82;
                    }
                    p,span{
                        text-overflow:ellipsis ;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
                dl{
                    width: 21%;
                    text-align: left;
                    dt{

                        color: #FF5F16;
                        b{
                            line-height: 30px;
                            font-size: 16px;
                        }

                    }
                    dd{
                        color: #797d82;
                    }
                }
            }
        }
    }
</style>