<template>
    <div class="login">
        <div class="iconfont icon-arrow1" @click="goBack"></div>
        <div class="logo">
            <img  src="../../assets/imgs/login.png"/>
        </div>
        <form @submit="form_submit()">
          <input type="text" placeholder="用户名" v-model.trim="username" />
           <input type="password" placeholder="密码" v-model.trim="password" />
           <input type="submit" value="登录" class="tologin"/>
        </form>
    </div>

</template>

<script>
    import axios from 'axios'
    export default {
        name: "Login",
        data(){
            return{
                username:'',
                password:''
            }
        },
        methods:{
            goBack(){this.$router.back()},
           async form_submit(){
               console.log(this.username);
               console.log(this.password);
               if(this.username=='admin' && this.password=='123456'){
                  await this.$Toast({
                       message: '登录成功。。。',
                       position: 'center',
                       duration: 1000
                   });

                  localStorage.setItem('login',this.username)
                   this.$router.back()

               }else{
                  this.$Toast({
                       message: '用户名或密码错误',
                       position: 'top',
                       duration: 2000
                   });

               }
            },
        },
        created() {
            let tab= document.getElementsByClassName('mint-tabbar')[0]
            tab.style.opacity=0
        }
    }
</script>

<style lang="scss" scoped>
    .login{
        width: 100%;
        height: 100%;
        .icon-arrow1{
            position: fixed;
            box-sizing: border-box;
            top: 10px;
            left: 10px;
            font-size: 24px;
        }
        .logo{
            width: 100%;
            height: 30%;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 70px;
            }
        }
        form{
            box-sizing: border-box;
           padding: 0 26px;
            input{
                font-size: 14px;
              width: 100%;
                min-height: 48px;
                border: 0;
                border-bottom: 1px solid #F6F6F6;
            }
            .tologin{
                margin-top: 60px;
                background-color: #26A2FE;
                color: #fff;
            }
        }
    }


</style>