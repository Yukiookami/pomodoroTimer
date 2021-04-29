<template>
  <div @mousemove="showVolumeBar"
  @mouseleave="showVolumeBar('out')"
  class="volume-main"
  :class="{'volume-main-show': showButtonIcon}">
    <div class="volume-button">
      <div v-if="!muteFlag" class="volume-icon" @click="mute"
      :style="{background: `url(icon/volumeButton-w.svg)`}"></div>

      <div v-else class="volume-icon" @click="mute"
      :style="{background: `url(icon/muteButton-w.svg)`}"></div>
    </div>

    <div @mousemove="moveVolume"
    @mousedown="move('start')"
    @mouseup="move('end')"
    v-if="volumeBarFlag" class="volume-pro">
      <div class="border-radius">
        <progress @click="getVolume" 
        class="play-pro-item" 
        max="100" :value="value"></progress>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['vol'],
    data () {
      return {
        iconImg: 'volumeButton-w',
        // 判断当前是否静音
        muteFlag: false,
        // 音量
        value: 100,
        // 记录静音前音量
        oldValue: 0,
        // 判断音量条是否打开
        volumeBarFlag: false,
        // 判断是否按下鼠标
        mousedownFlag: false
      }
    },
    computed: {
      showButtonIcon () {
        return this.$store.state.showButtonIcon
      }
    },
    watch: {
      vol (val) {
        this.value = val

        if (val === 0) {
          this.muteFlag = true
        } else {
          this.muteFlag = false
        }
      }
    },
    methods: {
      // 是否静音
      mute () {
        if (this.muteFlag) {
          // 停止静音
          // this.iconImg = 'volumeButton-w'
          if (this.oldValue) {
            this.value = this.oldValue
          } else {
            this.value = 10
          }
          this.sendVolume(this.value)
        } else {
          // 静音
          // this.iconImg = 'muteButton-w'
          this.oldValue = this.value
          this.value = 0
          this.sendVolume(this.value)
        }

        this.muteFlag = !this.muteFlag
      },
      // 获取音量
      getVolume (val) {
        this.value = val.offsetX
        this.sendVolume(this.value)
      },
      // 获得音量回调
      sendVolume (val) {
        this.$emit('getVolume', val)
      },
      // 拖动改变音量
      moveVolume (val) {
        if(this.mousedownFlag) {
          this.value = val.offsetX
          this.sendVolume(this.value)
        }
      },
      /**
       * 判断是否开始移动
       * @param {String} flag start为按下鼠标，end为鼠标松开
       */ 
      move (flag) {
        if (flag === 'start') {
          this.mousedownFlag = true
        } else {
          this.mousedownFlag = false
        }
      },
      // 打开/关闭音量条
      showVolumeBar (falg) {
        if (falg === 'out') {
          this.volumeBarFlag = false
        } else {
          this.volumeBarFlag = true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.volume-main {
  position: absolute;
  top: 0;
  opacity: 0;
  transition: all ease-in-out .4s;
  // top: 40px;

  .volume-pro {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    left: -115px;
    top: 4px;
    transform: rotate(180deg);
    transition: all .2s ease-in-out; 
    // box-shadow: 0 0 5px rgba(0, 0, 0, .5);
    // background-color: rgba(255, 255, 255, .6);
    // background-color: rgba(0, 0, 0, .1);

    .border-radius {
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 4px;
      border-radius: 20px;

      .play-pro-item {
        width: 100px;
        height: 4px;
        background-color: #c53e2a;
        transition: all .2s ease-in-out;
        opacity: .8;
        cursor: pointer;
      }

      .play-pro-item::-webkit-progress-bar{     
        background-color: rgba(0, 0, 0, .5);
      }

      .play-pro-item::-webkit-progress-value {
        background-color: #c53e2a;
      }
    }
  }

  .volume-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background-image: radial-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 0));
    cursor: pointer;

    .volume-icon {
      height: 90%;
      width: 90%;
      background-repeat: no-repeat !important;
      background-size: 65% !important;
      background-position: center !important;
    }
  }
}

// 显示动画
.volume-main-show {
  top: 40px;
  opacity: 1;
}
</style>