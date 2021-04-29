<template>
  <div class="cut-sec"
  :class="{'cut-sec-show': showButtonIcon}">
    <div @click="cut" class="cut-button">
      <div class="cut-icon"></div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      // 歌曲切换
      cut () {
        this.$emit('cut')
      }
    },
    computed: {
      showButtonIcon () {
        return this.$store.state.showButtonIcon
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cut-sec {
    position: absolute;
    top: 0;
    opacity: 0;
    transition: all ease-in-out .4s;
    // top: 240px;

    .cut-button {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 30px;
      border-radius: 50%;
      background-image: radial-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 0));
      cursor: pointer;

      .cut-icon {
        background: url('../../public/icon/cut.svg') no-repeat center;
        background-size: 100%;
        height: 60%;
        width: 60%;
      }
    }
  }

  // 显示动画
  .cut-sec-show {
    top: 240px;
    opacity: 1;
  }
</style>