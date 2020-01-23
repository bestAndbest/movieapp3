<template>
    <div class="seabox">
        <div class="search">
            <div class="sea">
                <div class="iconfont icon-search"></div><input type="text" v-model="value" placeholder="输入影城名称"/><div class="del" ref="del" @click="clearSea">X</div>
            </div>
            <div class="cancel" @click="cancelSea">取消</div>
        </div>
        <div class="fivecinemas" ref="five">
            <p>离你最近</p>
            <ul>
                <li v-for="item in fivecinemas" @click="toFilm(item.cinemaId)">{{item.name}}</li>
            </ul>
        </div>
        <ul class="list" ref="result">
            <li @click="toFilm(ele.cinemaId)" v-for="ele in result">
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
        <div class="imgtext"  ref="imgtext">
            <img src="../../assets/imgs/cinema.png"/>
            <h3>没有找到匹配的影院</h3>
            <p>提示：仅支持搜索”影院“，建议您</p>
            <p>检查输入的影院是否有误</p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import {mapState,mapMutations} from 'vuex'
    export default {
        name: "SeaFilm",
        data(){
            return{
                result:'',
                title:'',
                value:'',
                cinemas:[],
                fivecinemas:[],

            }
        },
        watch:{
            value(newVal,oldVal){
                this.$refs.five.style.display='none'
                this.$refs.del.style.display='block'
                this.$refs.result.style.display='block'
                let val=newVal.trim()
                if(val.length>0){
                    this.result=this.cinemas.filter((item)=>{
                        return item.address.indexOf(val)+1 ||item.name.indexOf(val)+1
                    })
                    if(this.result.length<=0){
                        this.$refs.imgtext.style.display='block'
                        this.$refs.result.style.display='none'
                    }

                } else if(val==''){
                    this.result=''
                    this.$refs.result.style.display='none'
                    this.$refs.five.style.display='block'
                    this.$refs.imgtext.style.display='none'
                    this.$refs.del.style.display='none'

                }else {
                    this.$refs.imgtext.style.display='block'
                    this.$refs.result.style.display='none'
                }
            }
        },
        methods:{
            //清除搜索框输入的内容
            clearSea(){
                this.value=''
                this.$refs.del.style.display='none'
            },
            //取消搜索
            cancelSea(){
                this.$router.back()
            },
            //点击搜索结果跳到对应影院
            toFilm(id){
                console.log(id);
                this.$router.push('/cinema/'+id+'/film')
            },

        },
        mounted(){

        },
        created() {
            let cinemas=JSON.parse(localStorage.getItem('cinemas'))||[]
            if(cinemas.length>0){
                this.cinemas=cinemas
                this.result=this.cinemas
                // this.fivecinemas=this.tempList.filter((item))
                for(let i=0;i<this.cinemas.length;i++){
                    if(i<5){
                        this.fivecinemas.push(this.cinemas[i])
                    }
                }
            }
            console.log(this.cinemas);
            console.log('this.fivecinemas',this.fivecinemas);

        },
    }
</script>

<style lang="scss" scoped>
    .seabox{
        height: 100%;
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
        .fivecinemas{
            padding: 0 15px 8px 16px;
            box-sizing: border-box;
            border-bottom: 1px solid #F6F6F6;
            p{
                font-size: 12px;
                color: #BDC0C5;
                padding: 10px 0;
            }
            ul{
                li{
                    width: 170px;
                    padding: 8px 10px;
                    background-color: #F9F9F9;
                    margin-top: 8px;
                    border-radius: 3px;
                    color: #555;
                }
            }
        }
        .imgtext{
            display: none;
            position: absolute;
            width: 100%;
            height: 147px;
            color: #BDC0C5;
            top: 50%;
            transform: translateY(-50%);
            img{
                width: 90px;
                height: 90px;
                margin: 0 auto;
            }
            p,h3{
              width: 100%;
              text-align: center;
            }
        }
        .list{
            display: none;
            width: 100%;
            top: 52px;
            background-color: #fff;
            box-sizing: border-box;
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