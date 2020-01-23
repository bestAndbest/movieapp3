<template>
    <div class="listbox">
        <!--<Scroll :handlerToScroll="handlerToScroll" :handlerToTouchEnd="handlerToTouchEnd">-->
            <div >
                <Loading v-if="isLoading"></Loading>
                <div v-else>
                    <ul v-for="ele in hotList" @tap="toDetail(ele.filmId)">
                        <li class="firstli">
                            <img :src="ele.poster">
                        </li>
                        <li class="secondli">
                            <div><h3 >{{ele.name}}</h3><span>{{ele.item.name}}</span></div>
                            <p class="actorsbox">主演：<b v-for="actor in ele.actors"><span>{{actor.name}}&nbsp;</span></b></p>
                            <p>上映时间：{{$moment(ele.premiereAt*1000).format('MM月DD日')}}</p>
                        </li>
                        <li class="thirdli"><div>购票</div></li>
                    </ul>
                </div>
            </div>
        <!--</Scroll>-->
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "ComingSoon",
        props:['num'],
        data(){
            return{
                hotList:[],
                isLoading:true
            }
        },
        watch:{
            num(newVal, oldVal){
                console.log('newVal',newVal);
                if(newVal<=5){
                    this.getMovies()
                }
            }
        },
        methods:{
            toDetail(id){
                this.$router.push('/moviedetail/'+id)
            },
            handlerToScroll(pos){
                console.log('handlerToScroll',pos);
            },
            handlerToTouchEnd(pos){
                console.log('handlerToTouchEnd',pos);
            },
            getMovies(){
                var url='https://m.maizuo.com/gateway?cityId=440300&pageNum='+this.num+'&pageSize=10&type=2&k=4508968'
                axios({
                    url,
                    method:'get',
                    headers:{
                        'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15728699844239132721697","bc":"230600"}',
                        'X-Host': 'mall.film-ticket.film.list'
                    }
                }).then(res=>{

                    if(res.status===200 && res.data.status===0){
                        setTimeout(()=>this.isLoading=false,1000)
                        let data=res.data.data.films
                        if(data.length<=0){
                            console.log('没数据了');
                        }else{
                            if(this.num==1){
                                this.hotList=data
                                localStorage.setItem('data',JSON.stringify(data))
                            }else{
                                for(let i=0;i<data.length;i++){
                                    this.hotList.push(data[i])
                                }
                                localStorage.setItem('data',JSON.stringify(this.hotList))
                            }
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        },
        created() {
            this. getMovies()
        },

    }
</script>

<style lang="scss" scoped>
    .listbox{
        width: 100%;
        height: 100%;
        /*padding-bottom: 42px;*/
        box-sizing: border-box;

        div{
            overflow: hidden;
            ul{
                width: 100%;
                display: flex;
                padding: 10px;
                box-sizing: border-box;
                .firstli{
                    width: 25%;
                    img{
                        width: 100%;
                    }
                }
                .secondli{
                    width: 57%;
                    box-sizing: border-box;
                    padding: 8px;
                    p{
                        font-size: 13px;
                        margin-top: 4px;
                        color: #797d82;
                    }

                    .grade b{
                        color: orange;
                        font-size: 14px;
                    }
                    div{
                        color: #333;
                        font-size: 16px;
                        font-weight: 400;
                        display: flex;
                        h3{
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        span{
                            margin-left: 5px;
                            padding: 1px;
                            height: 12px;
                            font-size: 10px;
                            color: #fff;
                            background-color: #d2d6dc;
                            border-radius: 2px;

                        }
                    };
                    .actorsbox{
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .thirdli{
                    width: 18%;
                    align-self: center;
                    div{
                        width: 50px;
                        height: 25px;
                        text-align: center;
                        line-height: 25px;
                        border: 1px solid #ff5f16;
                        border-radius: 4px;
                        color: #ff5f16;
                    }

                }
            }
        }
    }
</style>