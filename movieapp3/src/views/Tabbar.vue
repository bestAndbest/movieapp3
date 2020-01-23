<template>
    <mt-tabbar >
        <mt-tab-item id="电影">
            <router-link to="/" exact>
                <i class="iconfont icon-movie"></i>
                电影
            </router-link>
        </mt-tab-item>
        <mt-tab-item id="影院">
            <router-link to="/cinema">
                <i class="iconfont icon-cinema"></i>
                影院
            </router-link>
        </mt-tab-item>
        <mt-tab-item id="资讯">
            <router-link to="/info">
                <i class="iconfont icon-Chat"></i>
                资讯
            </router-link>
        </mt-tab-item>
        <mt-tab-item id="我的">
            <router-link to="/user">
                <i class="iconfont icon-my"></i>
                我的
            </router-link>
        </mt-tab-item>
    </mt-tabbar>
</template>

<script>
    export default {
        name: "Tabbar"
    }
</script>

<style lang="scss"  scoped>
    .mint-tabbar{
        z-index: 66;
        position: fixed;
        left: 0;
        bottom: 0;
    .mint-tab-item-label{
        font-size: 12px;

    }
    .router-link-active{
        color: #26A2FE;
    }
    .mint-tab-item-label i{
        display: block;
    }
    .iconfont{
        font-size: 22px;
    }
    }
</style>