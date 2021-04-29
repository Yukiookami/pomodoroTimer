<template>
  <div class="time-mine-box">
    <!-- 拖拽栏 -->
    <div class="mark-darg">
      <!-- 自定义按键 -->
      <win-button type="close"></win-button>
      <win-button type="min"></win-button>
    </div>

    <!-- 主界面 -->
    <div class="time-back-box" 
    :style="{backgroundImage: `url(${bgImg})`}">


      <!-- 按钮收起栏 -->
      <div class="timer-button-sec">
        <!-- 收起展开按钮 -->
        <div @click="changeShowButtonIcon" class="timer-button-show">
          <div class="timer-button-show-icon"></div>
        </div>

        <!-- 音量键 -->
        <volume-button :vol="vol" @getVolume="getVolume"></volume-button>

        <!-- 设置按钮 -->
        <set-button @changeTime="changeTime"
        :workTime="timerData.workTime"
        :restTime="timerData.restTime"
        :tomatoFlag="tomato.tomatoFlag"></set-button>

        <!-- 番茄模式按钮 -->
        <div class="tomato-mode"
        @click="tomatoChange" 
        :class="{'tomato-mode-show': showButtonIcon}">
          <div :style="{backgroundImage: `url(${tomato.tomatoImg})`}"
          class="tomato-mode-icon"></div>

          <div class="tomato-count">{{tomato.tomatoCount}}</div>
        </div>

        <!-- 线上线下模式按钮 -->
        <div class="online-mode"
        @click="onlineChange" 
        :class="{'online-show': showButtonIcon}">
          <div :style="{backgroundImage: `url(${online.onlineImg})`}"
          class="online-icon"></div>
        </div>

        <!-- 暂停按钮 -->
        <div v-if="timerData.timerCount" 
        :class="{'time-keeper-show': showButtonIcon}"
        class="time-keeper">
          <div class="timer-keeper-button" 
          @click="theWorld"
          :style="{backgroundImage: `url(${timeKeeper.keeperImg})`}"></div>
        </div>

        <!-- 音乐切换键 -->
        <cut-button v-if="timerData.timerCount && timerData.timerSaver === 'G'" 
        @cut="cut"></cut-button>
      </div>

      <!-- 计时器 -->
      <div>
        <!-- 默认 工作时间2700s 休息时间900s -->
        <div class="time-show">{{timerData.beTime}}</div>
      </div>

      <!-- 播放器 -->
      <audio ref="video" loop :src="bgm"></audio>
      <!-- 音效 -->
      <audio ref="voice" :src="voiceBgm"></audio>

      <!-- 开始按钮 -->
      <button @click="changeButton" class="time-button" 
      :style="{backgroundImage: `url(${buttonImg})`}">
      </button>
    </div>
  </div>
</template>

<script>
  import bgData from '../assets/homeData/bgData.json'
  import mData from '../assets/homeData/musicData.json'
  import startData from '../assets/homeData/startData.json'
  import otuData from '../assets/homeData/otuData.json'
  import endData from '../assets/homeData/endData.json' 
  import {PrefixInteger, formatDecimal} from '../assets/js/common'
  import winButton from '../components/winButton'
  import volumeButton from '../components/volumeButton'
  import cutButton from '../components/cutButton'
  import setButton from '../components/setButton'

  export default {
    data () {
      return {
        // 线上线下模式按钮
        online: {
          // 线上模式图片
          onlineImg: 'icon/localhost.svg',
          // 是否开启番茄模式
          onlineFlag: false
        },
        // 番茄模式按钮
        tomato: {
          // 番茄按钮
          tomatoImg: 'icon/tomato.svg',
          // 番茄计数（进行了多少次番茄默认为0）
          tomatoCount: 0,
          // 是否开启番茄模式
          tomatoFlag: true
        },
        // 暂停/继续按钮
        timeKeeper: {
          // 暂停/继续按钮
          keeperImg: 'icon/stop.svg',
          // 暂停/继续按钮 判断flag
          keeperFlag: 0,
          // 用于判断是否为暂停后再播放
          keeperPlayFlag: 0
        },
        // bgm
        bgm: '',
        // 音效
        voiceBgm: '',
        // 计时器各项数据
        timerData: {
          // 计时器秒数
          timeNumber: '',
          // 计时器显示时间
          beTime: '',
          // 工作时间 默认1500
          workTime: 1500,
          // 休息时间 默认300
          restTime: 300,
          // 计时器运行次数（控制切换工作休息时间）
          timerCount: 0,
          // 存储当前计时器状态 判断当前为工作还是休息或者结束
          timerSaver: '',
        },
        // 背景图片
        bgImg: '',
        // 按钮文字
        buttonImg: '',
        // 按钮数组
        buttonList: [
          {
            url: 'img/start.png'
          },
          {
            url: 'img/end.png'
          }
        ],
        // 按钮是否点击flag
        buttonCount: 0,
        // 背景图数据
        bgList: [],
        // 音乐数据
        musicList: [],
        // 开始音数据,
        startList: [],
        // 中场休息数据
        otuList: [],
        // 结束音数据
        endList: [],
        // 计时器
        timer: '',
        // 音量条
        vol: 100
      }
    },
    created () {
      // 赋值json数据方便伪随机
      this.bgList = bgData
      this.musicList = mData
      this.startList = startData.voiceList
      this.otuList = otuData.voiceList
      this.endList = endData.voiceList

      let randomNum = this.getRandom(0, this.bgList.bgYList.length)
      let bgImgS = this.bgList.bgYList[randomNum]
  
      this.bgImg = bgImgS.musicUrl
      bgImgS.count++
      
      this.buttonImg = this.buttonList[0].url
    },
    computed: {
      showButtonIcon () {
        return this.$store.state.showButtonIcon
      }
    },
    watch: {
      // 计时器时间显示
      'timerData.timeNumber' (val) {
        if (val === '') {
          this.timerData.beTime = ''
        } else {
          let nowTime = ''
        
          let time = formatDecimal(val, 0)

          time >= 60 ? nowTime = `${PrefixInteger(formatDecimal(time / 60, 0), 2)}:${PrefixInteger(time % 60, 2)}`: 
          nowTime = `00:${PrefixInteger(time, 2)}`

          this.timerData.beTime = nowTime
        }
      }
    },
    methods: {
      /**
       * 获得范围内随机数
       * 
       * @param {Number} m 下限
       * @param {Number} n 上限
       * @returns {Number} 
       * */ 
      getRandom (m,n) {
        return Math.floor(Math.random()*(m - n) + n)
      },
      /**
       * 判断按钮是否点击并执行之后逻辑
       */
      changeButton () {
        if (this.buttonCount) {
          // 停止
          this.buttonCount = 0
          this.buttonImg = this.buttonList[0].url
          this.bgImg = this.pesRan(this.bgList.bgYList)

          // 结束计时
          this.timeSetter()
        } else {
          // 开始
          this.buttonCount++
          this.buttonImg = this.buttonList[1].url
          this.bgImg = this.pesRan(this.bgList.bgSList) 

          // 开始计时
          this.timeSetter('G')
        }
      },
      /**
       * 是否显示按钮
       */
      changeShowButtonIcon () {
        this.$store.commit('setShowButtonIcon', !this.showButtonIcon)
      },
      /**
       * 是否开启番茄模式
       */
      tomatoChange () {
        if (this.tomato.tomatoFlag) {
          // 关闭番茄模式
          this.tomato.tomatoImg = 'icon/tomato-ban.svg'
          this.tomato.tomatoCount = 0
        } else {
          // 开启番茄模式
          this.timerData.workTime = 1500
          this.timerData.restTime = 300
          this.tomato.tomatoImg = 'icon/tomato.svg'
        }
        
        this.tomato.tomatoFlag = !this.tomato.tomatoFlag
      },
      /**
       * 是否开启线上模式
       */
      onlineChange () {
        let video = this.$refs.video

        if (this.online.onlineFlag) {
          // 关闭线上模式
          this.online.onlineImg = 'icon/localhost.svg'
          this.cut()
        } else {
          // 开启线上模式
          this.online.onlineImg = 'icon/internet.svg'
          this.$http.get(`${this.$API}/getWorkBGM`)
            .then(res => {
              this.bgm = this.pesRan(res.data.list)
              setTimeout(() => video.play(), 0)
            })
        }

        this.online.onlineFlag = !this.online.onlineFlag
      },
      /**
       * 修改工作，休息时间
       * @param {Number} work 工作时间
       * @param {Number} rest 休息时间
       */
      changeTime (work, rest) {
        this.timerData.workTime = work * 60
        this.timerData.restTime = rest * 60
      },
      /**
       * 歌曲切换
       */
      cut () {
        let video = this.$refs.video

        this.bgm = this.pesRan(this.musicList.musicList)
        setTimeout(() => video.play(), 0)
      },
      /**
       * 全局监听键盘改变音量
       */
      changeVolumebar () {
        let video = this.$refs.video
        let vol = video.volume

        document.onkeydown = () => {
          let key = window.event.keyCode

          if (key === 38) {
            if (vol + 0.1 < 1) {
              vol = vol + 0.1
            } else {
              vol = 1
            }
          } else if (key === 40) {
            if (vol - 0.1 > 0) {
              vol = vol - 0.1
            } else {
              vol = 0
            }
          }

          video.volume = vol
          this.vol = vol * 100
        }
      },
      /**
       * 获得音量更改，修改video音量
       * @param {Number} val 当前音量，默认为100
       */
      getVolume (val) {
        let video = this.$refs.video
        this.vol = val

        video.volume = val / 100
      },
      /**
       * 伪随机
       * 
       * @param {Number} arr 需判断伪随机的数组
       * @returns {String}
       */
      pesRan (arr) {
        let spikList = []

        arr.forEach((ele, index) => {
          if(ele.count) {
            spikList.push(index)
          }
        })

        if (spikList.length - arr.length) {
          let randomNum = this.getRandom(0, arr.length)
          while (spikList.indexOf(randomNum) + 1) {
            randomNum = this.getRandom(0, arr.length)
          }
          
          arr[randomNum].count++

          return arr[randomNum].musicUrl
        } else {
          arr.forEach(ele => {
            ele.count = 0
          })
          let randomNum = this.getRandom(0, arr.length)

          arr[randomNum].count++

          return arr[randomNum].musicUrl
        }
      },
      /**
       * 暂停与继续
       */
      theWorld () {
        let voice = this.$refs.voice
        let video = this.$refs.video

        if (this.timeKeeper.keeperFlag % 2) {
          // 继续
          this.timeKeeper.keeperPlayFlag++
          this.timeKeeper.keeperImg = `icon/stop.svg`
          this.timeKeeper.keeperFlag++
          this.voiceBgm = this.pesRan(this.startList)

          if (this.timerData.timerSaver === 'G') {
            this.timeSetter('G')
  
            // 播放开始音效
            setTimeout(() => {
              video.play()
              voice.play()
            }, 0)
          } else if (this.timerData.timerSaver === 'Y') {
            this.timeSetter('Y')
          }
        } else {
          // 暂停
          this.timeKeeper.keeperImg = `icon/play.svg`
          this.timeKeeper.keeperFlag++
          clearInterval(this.timer)
          video.pause()
        }
      },
      /**
       * 计时器
       * 
       * @param {String} flag 判断开启哪一个计时器 G为工作计时器，Y为休息计时器，不输入则为结束清空计时器
       */
      timeSetter (flag) {
        let video = this.$refs.video
        let voice = this.$refs.voice

        if (!flag) {
          // 结束使用数据初始化
          this.timerData.timeNumber = ''
          this.timerData.timerSaver = ''
          this.timerData.timerCount = 0
          this.timeKeeper.keeperPlayFlag = 0
          this.timeKeeper.keeperFlag = 0
          this.tomato.tomatoCount = 0
          this.tomatoFlag = true
          clearInterval(this.timer)
          video.pause()

          // 播放结束音效
          this.voiceBgm = this.pesRan(this.endList)
          setTimeout(() => voice.play(), 0)
        } else if (flag === 'G') {
          // 工作时间
          this.timerData.timerSaver = 'G'
          
          if (this.timeKeeper.keeperPlayFlag) {
              this.timeKeeper.keeperPlayFlag = 0
          } else {
            // 计数第几个番茄
            if (this.tomato.tomatoFlag) {
              this.tomato.tomatoCount++
            }
            this.bgm = this.pesRan(this.musicList.musicList)
            this.voiceBgm = this.pesRan(this.startList)
          }

          // 播放开始音效
          setTimeout(() => {
            video.play()
            voice.play()
          }, 0)
          
          this.timer = setInterval(() => {
            if (this.timerData.timerCount >= this.timerData.workTime) { // 1500
              clearInterval(this.timer)
              this.timerData.timeNumber = 0
              this.bgImg = this.pesRan(this.bgList.bgYList)
              this.timerData.timerCount = 0

              return this.timeSetter('Y')
            } else {
              +this.timerData.timeNumber++ 
              +this.timerData.timerCount++
            }
          }, 1000)
        } else {
          // 休息时间
          this.timerData.timerSaver = 'Y'
          video.pause()

          // 判断是否有一个周期
          if (this.tomato.tomatoFlag) {
            if (this.tomato.tomatoCount % 4) {
              this.timerData.restTime = 300
            } else {
              this.timerData.restTime = 1500
            }
          }
          
          // 播放休息音效
          if (this.timeKeeper.keeperPlayFlag) {
            this.timeKeeper.keeperPlayFlag = 0
          } else {
            this.voiceBgm = this.pesRan(this.otuList)
            setTimeout(() => voice.play(), 0)
          }

          this.timer = setInterval(() => {
            if (this.timerData.timerCount >= this.timerData.restTime) { // 300
              clearInterval(this.timer)
              this.timerData.timeNumber = 0
              this.bgImg = this.pesRan(this.bgList.bgSList) 
              this.timerData.timerCount = 0

              return this.timeSetter('G')
            } else {
              +this.timerData.timeNumber++ 
              +this.timerData.timerCount++
            }
          }, 1000)
        }
      }
    },
    mounted () {
      this.changeVolumebar()
    },
    components: {
      // 自定义窗口按钮
      winButton,
      // 音量按钮，getVolume回调获取音量
      volumeButton,
      // 音乐切换按钮
      cutButton,
      // 设置按钮
      setButton
    }
  }
</script>

<style lang="scss" scoped>
.time-mine-box {
  position: relative;

  // 拖拽/顶端栏
  .mark-darg {
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 30px;
    width: 100vw;
    -webkit-app-region: drag;
    // background: #f5f5f5;
    // border-bottom: 1px solid #cbcbcb;

    & :first-child {
      margin-right: 5px;
    }
  }

  // 主区域
  .time-back-box {
    background-size: 100%;
    background-repeat: no-repeat;
    // height: calc(100vh - 30px);
    height: 100vh;
    width: 100vw;
    transition: .5s all ease-in-out; 
    background-color: #FFF;

    // 按钮收起区域
    .timer-button-sec {
      // overflow: hidden;
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      top: 10px;
      right: 10px;
      // height: 30px;
    
      // 收起展开按钮
      .timer-button-show {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background-image: radial-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 0));
        cursor: pointer;
        z-index: 99;

        .timer-button-show-icon {
          background: url('../../public/icon/more.svg') no-repeat center;
          background-size: 100%;
          height: 80%;
          width: 80%;
        }
      }

      // 番茄模式按钮
      .tomato-mode {
        position: absolute;
        top: 0;
        opacity: 0;
        transition: all ease-in-out .4s;
        // top: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background-image: radial-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 0));
        cursor: pointer;

        .tomato-mode-icon {
          height: 60%;
          width: 60%;
          background-repeat: no-repeat;
          background-size: 100%;
          background-position: center;
        }

        .tomato-count {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          bottom: 3px;
          right: 2px;
          height: 12px;
          width: 12px;
          background-color: #ce3c2f;
          font-size: 10px;
          color: #FFF;
          user-select: none;
        }
      }

      // 番茄按钮显示动画
      .tomato-mode-show {
        top: 120px;
        opacity: 1;
      }

      // 线上模式按钮
      .online-mode {
        position: absolute;
        top: 0;
        opacity: 0;
        transition: all ease-in-out .4s;
        // top: 160px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background-image: radial-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 0));
        cursor: pointer;

        .online-icon {
          height: 70%;
          width: 70%;
          background-repeat: no-repeat;
          background-size: 100%;
          background-position: center;
        }
      }

      // 线上按钮显示动画
      .online-show {
        top: 160px;
        opacity: 1;
      }
      
      // 暂停按钮
      .time-keeper {
        position: absolute;
        top: 0;
        opacity: 0;
        transition: all ease-in-out .4s;
        // top: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background-image: radial-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 0));
        cursor: pointer;

        .timer-keeper-button {
          height: 90%;
          width: 90%;
          background-repeat: no-repeat;
          background-size: 100%;
          background-position: center;
        }
      }

      // 暂停按钮显示动画
      .time-keeper-show {
        top: 200px;
        opacity: 1;
      }
    }

    // 计时器显示
    .time-show {
      position: absolute;
      top: calc(50vh - 37.5px);
      left: calc(50vw - 53px);
      text-shadow: 0 0 5px rgba(255, 255, 255, 1);
      font-size: 50px;
      font-family: 'Xingkai SC';
      user-select: none;
    }

    // 开始/结束按钮
    .time-button {
      position: absolute;
      bottom: 10px;
      right: calc(50vw - 85px);
      height: 50px;
      width: 170px;
      border: none;
      background-color: rgba(0, 0, 0, .5);
      box-shadow: 0 0 10px rgba(0, 0, 0, 1);
      border-radius: 15px;
      cursor: pointer;
      outline: none;
    }
  }
}
</style>