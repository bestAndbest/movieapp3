<template>
    <div class="InfoBox">
        <div id="infobox" ref="infobox">
        </div>
        <tabbar></tabbar>
    </div>
</template>

<script>

    import axios from 'axios'
    export default {
        name: "Info",
        data:function () {
            return{
                infos:''
            }
        },
        methods:{
            getCinemas: function () {
                var url = 'https://m.maizuo.com/gateway?actId=ElzMZU125260';
                axios({
                    url,
                    method: 'get',
                    headers: {

                        'X-Host': 'mall.act.static-page.info'
                    }

                }).then(response => {
                    if( response.status === 200 && response.data.status === 0){
                        this.$refs.infobox.innerHTML=response.data.data.data.content;
                        var str1='';
                        var str2='';
                        var p1=document.getElementsByTagName('p')
                        var ass=document.getElementsByTagName('a')

                        for(var i=0;i<ass.length;i++){
                            if(ass[i].href.indexOf('AppBridge')+1){
                                str1=ass[i].href.slice(ass[i].href.indexOf('https'))
                                str2=str1.slice(0,str1.indexOf('}')-1)
                                ass[i].href=str2;
                            }
                        }

                    }

                }).catch(error => {
                    console.log(error);
                });
            }
        },
        created() {
            this.getCinemas()
        }
    }
</script>

<style lang="scss" scoped>
    .InfoBox{
     .main {
            text-align: center;
        }
        .detailContent img{
            display: block!important;
        }
    }
</style>