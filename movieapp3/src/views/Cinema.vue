<template>
    <div class="cinemabox">
        <div class="headbox" ref="headbox">
            <mt-header title="影院">
                <mt-button slot="left" class="left" @click="goLocation">{{city.name}}<b class="iconfont icon-arrow-down"></b></mt-button>
                <mt-button class="iconfont icon-search" slot="right" @click="toseaFilm"></mt-button>
            </mt-header>
            <div class="header2">
                <p @click="selDistrict" :class="{'select':select==0}">全城<b class="iconfont icon-arrow-down"></b></p>
                <p @click="goto":class="{'select':select==1}">最近去过<b class="iconfont icon-arrow-down"></b></p>
            </div>
            <ul class="districts" ref="districts">
                <li :class="{'sel':sel==-1}" @click="selAll">全城</li>
                <li v-for="(item,i) in areasDate"@click="changeDistrict(i,item)" :class="{'sel':sel==i}">{{item}}</li>
            </ul>
            <ul class="gotochild" ref="gotochild">
                <li :class="{'gotostyle':gotoindex==0}" @click="gotoChild(0)">最近去过</li>
                <li :class="{'gotostyle':gotoindex==1}" @click="gotoChild(1)">离我最近</li>
            </ul>
        </div>
        <div class="zhedang" ref="zhedang"></div>
        <Scroll >

            <div>
                <Loading v-if="isLoading"></Loading>
                <ul class="list" v-else>
                    <li @tap="toFilm(ele.cinemaId)" v-for="ele in cinemasdata">
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
            </div>
        </Scroll>
        <tabbar></tabbar>
    </div>
</template>

<script>
    import axios from 'axios'
    import {mapState} from 'vuex'
    export default {
        name: "Cinema",
        data(){
            return {
                cinemasdata:[],
                tempDate:[],
                areasDate:[],
                city:{},
                select:-1,
                sel:-1,
                isSel:'true',
                gotoindex:0,
                isLoading:true
            }
        },
        computed:{
            ...mapState(['usercity'])
        },
        watch:{
            city(newVal,oldVal){
                console.log(newVal, oldVal);
            }
        },
        methods:{
            toseaFilm(){
                this.$router.push('/cinema/seafilm')
            },
            gotoChild(i){
                this.gotoindex=i
                this.$refs.gotochild.style.display='none'
                this.select=-1
            },
            selDistrict(){
                // this.$refs.districts.style.display='block'
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
            //选择区域
            selAll(){
                this.sel=-1
                this.cinemasdata=this.tempDate
                this.noneStatic()
            },
            changeDistrict(index,name){
                console.log(index);
                this.sel=index
                this.cinemasdata=this.tempDate.filter((item)=>{
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
            goLocation(){
                this.$router.push('/location')
            },
            toFilm(id){
                console.log(id);
                this.$router.push('/cinema/'+id+'/film')
            },
            getCinemaData(id){
                let url='https://m.maizuo.com/gateway?cityId='+id+'&ticketFlag=1&k=8921000'
                axios({
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
                        this.cinemasdata=cinemas
                        this.tempDate=cinemas
                        let quarr=[];
                        cinemas.forEach((item)=>{
                            quarr.push(item.district.name)
                        })
                        // 过滤掉重复的区
                        let areas=new Set(quarr);
                        this.areasDate=[...areas]
                        console.log('this.tempData', this.areasDate);
                    }

                }).catch(err=>{
                    console.log(err);
                })
            }
        },
        created() {
            let city=JSON.parse(localStorage.getItem('city'))
            console.log('city',city);
            if(city){
                this.city=city
                this.getCinemaData(city.cityId)
            }else{
                this.$router.push('/location')
            }
        }
    }
</script>

<style lang="scss" scoped>

    .cinemabox{
        box-sizing: border-box;
        height: 100%;
        .headbox{
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 101;
            background-color: #fff;
            .mint-header{
                height: 50px;
                background-color: #fff;
                padding-top: 10px;
                color: #333;
                font-size: 18px;
                .mint-header-button{
                    .left{
                        font-size: 14px;
                    }
                    .icon-search{
                        font-size: 22px;
                    }
                }
            }
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
            padding-top: 84px;
            padding-bottom: 50px;
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