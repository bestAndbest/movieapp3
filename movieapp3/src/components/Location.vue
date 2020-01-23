<template>
    <div class="locationbox">
        <div class="search">
            <div class="sea">
                <div class="iconfont icon-search"></div><input type="text" v-model.trim="value"  placeholder="搜索"/><div class="del" ref="del" @click="clearSea">X</div>
            </div>
            <div class="cancel" @click="cancelSea">取消</div>
        </div>
        <div class="seaok" ref="seaok" v-show="isOk">
            <p v-for="city in result" @click="selCity({name:city.name,cityId:city.cityId})">{{city.name}}</p>
        </div>
        <div class="seaerr">
            <div class="left">
                <div class="city_hot">
                    <h2>GPS定位你所在城市</h2>
                    <ul class="clearfix">
                        <li ref="ps" @click="e=>getPosition(e)">定位失败</li>
                    </ul>
                    <h2>热门城市</h2>
                    <ul class="clearfix">
                        <li v-for="item in hotCity"  @click="selCity({name:item.name,cityId:item.cityId})">{{ item.name }}</li>
                    </ul>
                </div>
                <div class="allcitys" v-for="item in cityList">
                    <div class="index">{{item.index}}</div>
                    <ul class="city" v-for="ele in item.cities">
                        <li @click="selCity({name:ele.name,cityId:ele.cityId})">{{ele.name}}</li>
                    </ul>
                </div>
            </div>
            <div class="right">
                <p v-for="item in cityList" @click="toAlphabt(item.index)">{{item.index}}</p>
            </div>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    import {mapState,mapMutations} from 'vuex'
    export default {
        name: "Location",
        data(){
            return{
                result:'',
                title:'',
                value:'',
                //城市列表
                cityList:[],
                //热门城市列表
                hotCity:[],
                tempList:[],
                isOk:false

            }
        },

        computed:{
            ...mapState(['usercity','atcity']),
        },
        watch:{
            //确定当前定位城市
            atcity(newVal,oldVal){
                setTimeout(()=>{this.$Indicator.close();
                    if(newVal){
                        this.$refs.ps.innerHTML=newVal
                    }
                },800)

            },
            //监控搜索框的值变化
            value(newVal,oldVal){
                this.$refs.del.style.display='block'
                this.$refs.seaok.style.display='block'
                let chinaword=/^[\u4e00-\u9fa5]+$/
                let word=/^[a-zA-Z]+$/
                console.log('tempList',this.tempList);
                let val=newVal.trim()

                if(chinaword.test(val)){
                    this.result=this.tempList.filter((item)=>{
                        return item.name.indexOf(val)+1
                    })
                    this.isOk=true
                    console.log(this.result);

                }else if(word.test(val)){
                    console.log('字母');
                    this.result=this.tempList.filter((item)=>{
                        return item.pinyin.indexOf(val)+1
                    })
                    this.isOk=true
                    console.log(this.result);
                }else if(val==''){
                    this.result=''
                    this.$refs.seaok.style.display='none'
                    this.$refs.del.style.display='none'
                }
            }
        },
        methods:{
            toAlphabt(index){
                let arr=document.getElementsByClassName('index')
                let left=document.getElementsByClassName('left')[0]

                for(let i=0;i<arr.length;i++){
                    if(arr[i].innerHTML==index){
                        let arrHeight=arr[i].offsetTop
                        left.scrollTop=arrHeight-50
                    }
                }
            },
            goBack(){
                this.$router.back()
            },
            //清除搜索框输入的内容
            clearSea(){
                this.value=''
                this.$refs.del.style.display='none'
            },
            //取消搜索
            cancelSea(){
                this.$router.back()
            },
            //选择城市
           selCity(city){
                //派发任务存储用户所选城市
                this.$store.commit('saveCity',city)
                this.$router.back()
            },
            //用户选择定位成功，返回上一步
            getPosition(e){
                console.log(e.target.innerHTML);
                if(e.target.innerHTML!=='定位失败'){
                    this.$router.back()
                }
                // console.log('e.target.innerHTML',this.usercity);
            },

            //整理城市数据按字母排序
            getCityList(cities){
                let citylist=[]
                let hotcity=[]
                for(let i=0;i<cities.length;i++){
                    var index=cities[i].pinyin.substring(0,1).toUpperCase()
                    if(toCom(index)){
                        citylist.push({'index':index,'cities':[{'cityId':cities[i].cityId,'name':cities[i].name,'pinyin':cities[i].pinyin,'isHot':cities[i].isHot}]})
                    }else{
                        for(let j=0;j<citylist.length;j++){
                            if(citylist[j].index==index){
                                citylist[j].cities.push({'cityId':cities[i].cityId,'name':cities[i].name,'pinyin':cities[i].pinyin,'isHot':cities[i].isHot})
                            }
                        }
                    }
                }
               this.cityList= citylist.sort((n1,n2)=>{
                    if(n1.index>n2.index){
                        return 1
                    }else if(n1.index<n2.index){
                        return -1
                    }else {
                        return 0
                    }
                })
               this.hotCity= hotcity= cities.filter((item)=>{
                    if(item.isHot){
                        return true
                    }
                })

                function toCom(index){
                    for(let k=0;k<citylist.length;k++){
                        if(citylist[k].index==index){
                            return false
                        }
                    }
                    return true
                }

                localStorage.setItem('citylist',JSON.stringify(citylist))
                localStorage.setItem('hotcity',JSON.stringify(hotcity))
            },
            getCitiesData(){
                let data=JSON.parse(localStorage.getItem('cities'))||[]
                if(data.length<=0){
                    let url= 'https://m.maizuo.com/gateway?k=2177782'
                    axios({
                        url,
                        method: 'get',
                        headers: {
                            'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15728699844239132721697","bc":"331100"}',
                            'X-Host': 'mall.film-ticket.city.list'
                        }
                    }).then(res=>{
                        if(res.status===200 && res.data.msg==='ok'){
                            let {cities}=res.data.data
                            this.getCityList(cities)
                            this.result=cities
                            this.$store.dispatch('getXYbyIP',cities)
                            localStorage.setItem('cities',JSON.stringify(cities))
                        }

                    }).catch(err=>{
                        console.log(err);
                    })
                }else{
                    this.result=data
                    this.tempList=data
                    this.$store.dispatch('getXYbyIP',data)
                    console.log('有城市数据了');
                }

            },
            //显示定位的indicator
            showPositionIndicator(){
                let indicator= document.getElementsByClassName('mint-indicator-wrapper')[0]
                indicator.style.zIndex=333
                indicator.style.padding='16px'
            }
    },
        mounted(){
            this.showPositionIndicator()
            let seaerr=document.getElementsByClassName('seaerr')[0]
        },
        beforeCreate(){

        },
        created() {
            this.getCitiesData()
            //解决刷新定位城市不变的情况，（第一次由空变为城市名会触发watch，后面刷新则不会
            if(this.atcity){
                setTimeout(()=>{
                    this.$Indicator.close()
                    this.$refs.ps.innerHTML=this.atcity
                },1000)
            }
            this.$Indicator.open({
                text: '定位中...',
            })

            this.cityList=JSON.parse(localStorage.getItem('citylist'))
            this.hotCity=JSON.parse(localStorage.getItem('hotcity'))

        },
    }
</script>

<style lang="scss" scoped>
    .locationbox{
        position: relative;
        width:100%;
        height: 106.68%;
        background-color: #fff;
        z-index: 222;
        .search{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 9.5px 15px;
            box-sizing: border-box;
            border-bottom: 1px solid #F6F6F6;
            .sea{
                background-color: #F4F4F4;
                display: flex;
                align-items: center;
                flex: 8;
                .iconfont{
                    padding: 3px;
                }
                .del{
                    display: none;
                    width: 14px;
                    height: 14px;
                    text-align: center;
                    line-height: 14px;
                    font-size: 12px;
                    border-radius: 50%;
                    background-color: #797D82;
                }
                input{
                    width: 80%;
                    height: 30px;
                    background-color: #F4F4F4;
                    border: 0;
                }
            }
            .cancel{
                flex: 1;
                margin-left: 20px;
                font-size: 14px;
            }
        }
        .seaerr{
            display: flex;
            height: 91%;
            align-items: center;
            .left{
                height: 100%;
                overflow: scroll;
                flex: 11;
                .city_hot{
                    h2{ padding-left: 15px; line-height: 30px; font-size: 14px; background:#F0F0F0; font-weight: normal;}
                    ul{
                    margin: 10px 0 16px 0;
                    display: flex;
                    flex-wrap: wrap;
                     li{  background: #f4f4f4; width: 29%; height: 33px; margin-top: 10px; margin-left: 3%; padding: 0 4px; border: 1px solid #e6e6e6; border-radius: 3px; line-height: 33px; text-align: center; box-sizing: border-box;}
                    }
                }
                .allcitys{
                    font-size: 14px;
                    .index{
                        padding: 7px 16px;
                        box-sizing: border-box;
                        background: #F0F0F0;

                    }
                    .city{
                        padding: 10px 16px;
                        box-sizing: border-box;
                        border-bottom: 1px solid #f6f6f6;
                    }
                }
            }
            .right{
                font-size: 13px;
                text-align: center;
                flex:2;
                height: 100%;
                p{
                    width: 100%;
                    height: 4.5%;
                }
            }
        }
        .seaok{
            width: 100%;
            height: 91%;
            overflow: scroll;
            p{
               box-sizing: border-box;
                padding: 16px 10px;
                border-bottom: 1px solid #f6f6f6;
            }
        }
    }
</style>