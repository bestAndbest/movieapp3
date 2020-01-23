<template>
    <div class="userbox">
        <div class="head">
            <p class="iconfont icon-my"></p>
            <h3 @click="toLogin">{{username||'立即登录'}}</h3>
        </div>
        <div class="orders">
            <div>
                <img src="../assets/imgs/movie.png"/>
                <div> 外卖</div>
            </div>
            <div>
                <img src="../assets/imgs/goods.png"/>
                <div>订单</div>
            </div>
        </div>
        <ul class="cell">
            <li>
                <div>
                    <img src="../assets/imgs/pack.png"/><b>优惠卷</b>
                </div>
                <div class="iconfont icon-arrow"></div>
            </li>
            <li>
                <div>
                    <img src="../assets/imgs/hongbao.png"/><span>组合红包</span>
                </div>
                <div class="iconfont icon-arrow"></div>
            </li>
            <li>
                <div>
                    <img src="../assets/imgs/money.png"/><span>余额</span>
                </div>
                <div class="iconfont icon-arrow"></div>
            </li>
            <li>
                <div>
                    <img src="../assets/imgs/set.png"/><span>设置</span>
                </div>
                <div class="iconfont icon-arrow"></div>
            </li>
        </ul>
        <tabbar></tabbar>
    </div>
</template>

<script>
    export default {
        name: "User",
        data(){
            return{
                username:'',
            }
        },
        methods:{
          toLogin(){
              this.$router.push('/login')
            },
        },
        created() {
            this.username=localStorage.getItem('login')
            let tab= document.getElementsByClassName('mint-tabbar')[0]
            tab.style.opacity=1
        }
    }
</script>

<style lang="scss" scoped>
    .userbox{
        width: 100%;
        height: 100%;
        .head{
            height: 26%;
            box-sizing: border-box;
            padding: 30px 20px;
            display: flex;
            align-items: center;
            background-color: #26A2FE;
            color: #fff;
            font-size: 16px;
            p{
                text-align: center;
                width: 60px;
                height: 60px;
                border: 2px solid #fff;
                border-radius: 50%;
                font-size: 50px;
                margin-right: 16px;
            }
        }
        .orders{
            height: 10%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 17px 0;
            border-bottom: 10px solid #F4F4F4;
          div{

              img{
                  width: 26px;
                  height: 26px;
              }
          }
        }
        .cell{
            height: 50%;
            border-bottom: 10px solid #F4F4F4;
            li{
                height: 25%;
                display: flex;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 13px 12px;
                border-bottom: 1px solid #F6F6F6;
                div{
                    display: flex;
                    align-items: center;
                    img{
                        width: 26px;
                        height: 26px;
                        margin-right: 10px;
                    }
                }
            }


        }
    }
</style>