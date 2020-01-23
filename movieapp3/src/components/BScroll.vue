<template>
    <div class="scrollBox" ref="scrollBox">
        <slot></slot>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    export default {
        name: "BScroll",
        props:{
            handlerToScroll :{
                type:Function,
                default:function () {}
            },
            handlerToTouchEnd :{
                type:Function,
                default:function () {}
            },
            pullUp :{
                type:Function,
                default:function () {}
            },

        },
        mounted(){
            let scroll=new BScroll(this.$refs.scrollBox,{
                tap:true,
                probeType:1,
                // scrollbar:true,//开启滚动条
                pullUpLoad: {
                    // 当上拉距离超过30px时触发 pullingUp 事件
                    threshold: -40
                },
            })
            //滚动条事件
            scroll.on('scroll',(pos)=>{
                this.handlerToScroll(pos)
            })
            //触碰事件
            scroll.on('touchEnd',(pos)=>{
                this.handlerToTouchEnd(pos)
            })
            scroll.on('pullingUp',()=>{
                this.pullUp()
                this.$nextTick(() => {
                    scroll.refresh() // DOM 结构发生变化后，重新初始化BScroll
                })
                scroll.finishPullUp()//// 上拉加载动作完成后调用此方法告诉BScroll完成一次上拉动作
            })
        }
    }
</script>

<style scoped>
    .scrollBox{
        height: 100%;
        transform: none;
    }
</style>