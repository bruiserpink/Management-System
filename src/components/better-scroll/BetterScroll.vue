<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "BetterScroll",
    //将probeType设置为由组件传值
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    //组件创建完成后调用
    mounted() {
      //由于使用document获取的DOM元素为在全局查找的元素，但是我们并不确定全局是否存在同名为
      //.wrapper的元素，所以可以使用vue属性给想要在组件中获取的元素指定ref属性，然后使用
      //this.$refs.wrapper获取当前组件对象的元素
      this.scroll = new BScroll(this.$refs.wrapper,{
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
        mouseWheel: true
      });
      //监听滚动位置
      this.scroll.on('scroll', (position) => {
        //使用自定义事件发送position信息
        this.$emit('scroll',position);
      });
      //设置上拉加载更多
      if(this.pullUpLoad){
        this.scroll.on('pullingUp',()=>{
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      scrollTo(x,y,time) {
        this.scroll&&this.scroll.scrollTo(x,y,time);
      },
      //加载更多完成后调用方法使得可以进行下一次
      finishPullUp() {
        this.scroll&&this.scroll.finishPullUp();
      },
      //用来重新更新scroll对象计算的可滚动的值
      refresh() {
        //this.scroll&& 防止图片加载过快，加载完毕后scroll对象未生成，调用scroll方法失败报错
        this.scroll&&this.scroll.refresh();
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0;
      }
    }
  }

</script>

<style scoped>

</style>
