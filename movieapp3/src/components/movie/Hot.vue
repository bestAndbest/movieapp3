<template>
        <div class="listbox">
                <div >
                    <Loading v-if="isLoading"></Loading>
                   <div v-else>
                       <ul v-for="ele in hotList" @tap="toDetail(ele.filmId)">
                           <li class="firstli">
                               <img :src="ele.poster">
                           </li>
                           <li class="secondli">
                               <div><h3 >{{ele.name}}</h3><span>{{ele.item.name}}</span></div>
                               <p class="grade">观众评分：<b>{{ele.grade}}</b></p>
                               <p class="actorsbox">主演：<b v-for="actor in ele.actors"><span>{{actor.name}}&nbsp;</span></b></p>
                               <p>{{ele.nation}}&nbsp;|&nbsp;{{ele.runtime}}分钟</p>
                           </li>
                           <li class="thirdli" @tap="e=>buyTicket(e,ele.filmId,ele.name)"><div>购票</div></li>
                       </ul>
                   </div>
                </div>
        </div>
</template>

<script>
    export default {
        name: "Hot",
        props:['num'],
        data(){
            return{
                hotList:[],
                isLoading:true,
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
            //传递电影id并跳到选择电影页页面
            buyTicket(e,filmId,name){
                e.cancelBubble=true
                console.log('buy',filmId);
                localStorage.setItem('movieName',name)
                this.$router.push('/selcinema/'+filmId)
            },
            toDetail(id){
                this.$router.push('/moviedetail/'+id)
            },

            getMovies(){
                this.hotList=JSON.parse(localStorage.getItem('data'))
                var url='https://m.maizuo.com/gateway?cityId=440300&pageNum='+this.num+'&pageSize=10&type=1&k=8473518'
                this.$axios({
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
                                let fivemovies=data.filter((item,index)=>{
                                    return index<=3
                                })
                                localStorage.setItem('fivemovies',JSON.stringify(fivemovies))
                                localStorage.setItem('data',JSON.stringify(data))
                            }else{
                                for(let i=0;i<data.length;i++){
                                    this.hotList.push(data[i])
                                }
                                localStorage.setItem('data',JSON.stringify(this.hotList))
                            }
                        }
                        console.log(data)
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
         },
        created() {
            console.log('this.num',this.num);
            this.getMovies()

        },

    }
</script>

<style lang="scss" scoped>
    .listbox{
       width: 100%;
        background-color: #fff;
        box-sizing: border-box;
        overflow: hidden;
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
                    align-self: center;
                    width: 18%;
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