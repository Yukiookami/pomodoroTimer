<template>
  <div class="set-button"
  :class="{'set-button-show': showButtonIcon}">
    <div @click="showMask" class="set-button-icon"></div>

    <div v-if="show" class="set-mask-box">
      <div class="set-mask" @click="showMask"></div>

      <div class="set-main">
        <div class="set-box">
          <div>
            <span>工作时间</span>
            <input type="tel" maxlength="2" v-model="workTimeNow">
            <span>分</span>
          </div>

          <div>
            <span>休息时间</span>
            <input type="tel" maxlength="2" v-model="restTimeNow">
            <span>分</span>
          </div>
        </div>

        <div class="set-check-box">
          <div class="check re" @click="reTime"></div>
          <div class="check" @click="changeTime"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['workTime', 'restTime', 'tomatoFlag'],
    data () {
      return {
        show: false,
        restTimeNow: 0,
        workTimeNow: 0
      }
    },
    computed: {
      showButtonIcon () {
        return this.$store.state.showButtonIcon
      }
    },
    created () {
      this.workTimeNow = this.workTime / 60
      this.restTimeNow = this.restTime / 60
    },
    methods: {
      showMask () {
        if (this.tomatoFlag) {
          this.$Message.warning('番茄模式中不能自由设置时间～')
        } else {
          this.show = !this.show
        }
      },
      changeTime () {
        if (isNaN(this.workTimeNow) || isNaN(this.restTime)) {
          this.$Message.warning('请正确输入数值')
        } else {
          this.$emit('changeTime', +this.workTimeNow, +this.restTimeNow)
          this.$Message.success('修改成功')
          this.showMask()
        }
      },
      reTime () {
        this.workTimeNow = 25
        this.restTimeNow = 5
      }
    }
  }
</script>

<style lang="scss" scoped>
.set-button {
  position: absolute;
  top: 0;
  opacity: 0;
  transition: all ease-in-out .4s;
  // top: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-image: radial-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 0));
  cursor: pointer;

  .set-button-icon {
    height: 60%;
    width: 60%;
    background: url('../../public/icon/set.svg') no-repeat center;
    background-size: 100%;
  }

  .set-mask-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;

    .set-mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .6);
      z-index: 100;
      cursor: default;
      z-index: 9999;
    }

    .set-main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 70px;
      width: 260px;
      padding: 10px;
      background-color: #fff;
      border-radius: 15px;
      z-index: 999;
      box-shadow: 0 0 15px rgba(0, 0, 0, .6);
      cursor: default;
      color: #999;
      transition: all .2s ease-in-out;
      z-index: 9999;

      .set-box {
        display: flex;
        justify-content: space-between;
        width: 100%;
        user-select: none;

        span {
          font-size: 12px;
        }

        input {
          margin: 0 10px;
          border: none;
          width: 30px;
          box-shadow: 0 0 1px rgba(0, 0, 0, .6);
          border-radius: 5px;
          text-align: center;
          font-size: 12px;
          color: #999;
          outline: none;
        }
      }

      .set-check-box {
        display: flex;
        justify-content: space-between;
        width: 20%;

        .check {
          height: 15px;
          width: 15px;
          border-radius: 50%;
          background-image: url('../../public/icon/check.svg');
          background-size: 100%;
          // box-shadow: 0 0 3px rgba(0, 0, 0, .6);
          line-height: 0;
          cursor: pointer;
        }

        .re {
          background-image: url('../../public/icon/re.svg')
        }
      }
    }
  }
}

// 显示动画
.set-button-show {
  top: 80px;
  opacity: 1;
}
</style>