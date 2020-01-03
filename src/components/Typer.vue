<template>
  <div 
    class="type-input"
    @click.stop="handleFocus"
  >
    <span 
      v-for="(item, index) in outputShow" 
      :key="index+Date.now()" 
      class="char-item"
      :class="modelClass | isAnimateInit(item.isInit)"
      :style="charItemStyle"
    >
      {{ item.content  }}
    </span>
    <div class="focus" v-show="focus"></div>
    <input 
      type="text"
      ref="input"
      class="hide-input"
      @input="handleInput"
      @keydown.delete="backInput"
      @compositionstart="lockInput"
      @compositionend="unlockInput"
    >
  </div>
</template>



<script>
export default {
  name: 'Typer',
  props: {
    model: {
      type: Number,
      default: 1
    },
    config: {
      type: Object,
      default: () => {}
    },
    focus: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
      output: [],
      modelClass: "",
      charQueue: "",
      startInput: false,
      defaultConfig: {
        color: "#000",
        sleep: 200,
        charWidth: 15,
        inputWidth: 500,
      },
      charItemStyle: {
        width: "",
        color: ""
      }
    }
  },
  methods: {
    //组建获取焦点
    handleFocus: function() {
      this.$emit("focus")
      this.$refs.input.focus()
    },
    //处理组件的输入
    handleInput: function(e) {
      if(e.data !== null){
        this.addCharQueue(e.data)
      }
    },
    //将输入放入输入队列
    addCharQueue: function(content) {
      setTimeout(() => {
        if(!this.cpLock){
          this.charQueue += content
          if(!this.startInput){
            this.startInput = true
            this.handleInputGradual()
          }
        }
      }, 100)

    },
    //渐入式输入
    handleInputGradual: async function() {
      const {sleep} = this.defaultConfig
      // for(let item of this.charQueue){
      //   await this.sleep(sleep)
      //   this.output.push({
      //     content: item,
      //     isInit: false
      //   })
      //   this.charQueue = this.charQueue.split().shift()
      // }
      while(this.charQueue.length > 0){
        await this.sleep(sleep)
        // this.hasInit()
        let tempQueue = this.charQueue.split("")
        let firstChar = tempQueue.shift()
        window.console.log(tempQueue, firstChar)
        this.charQueue = tempQueue.join("")
        this.output.push({
          content: firstChar,
          isInit: false
        })
        //这里用nextTick没有效果，只有强行去等待
        setTimeout(() => {this.hasInit()}, sleep)
      }
      this.startInput = false
    },
    //删除输入
    backInput: function(){
      if(this.output.length > 0 && !this.cpLock){
        this.output.pop()
      }
    },
    //isInit完成
    hasInit: function(){
      // this.output.map(item => item.isInit = true)
      let length = this.output.length
      if(length){
        this.output[length - 1].isInit = true
      }
    },
    //等待函数
    sleep: (sleepTime) => {
      return new Promise(resolve => setTimeout(resolve, sleepTime))
    },
    // 消除拼音的影响
    lockInput: function() {
      this.cpLock = true
    },
    unlockInput: function() {
      this.cpLock = false
    }
  },
  computed: {
    outputShow: function(){
      const {charWidth, inputWidth} = this.defaultConfig
      const maxItemNum = Math.floor(inputWidth / charWidth)
      const length = this.output.length
      if(length > maxItemNum){
        return this.output.slice(length - maxItemNum, length)
        //return this.output
      }
      else {
        return this.output
      }
    }
  },

  filters: {
    trim: content => {
      return content.trim()
    },
    isAnimateInit: (typeClass, isInit) => {
      if(!isInit) {
        return typeClass
      }
      else {
        return ""
      }
    }
  },

  mounted: function(){
    Object.assign(this.defaultConfig, this.config)
    //确定字符样式
    this.charItemStyle.width = this.defaultConfig.charWidth + "px"
    this.charItemStyle.color = this.defaultConfig.color
  },
  updated: function() {
    //获得字符输入效果class
    const allModelClass = ["gradual-item", "flyin-item", "scale-item", "shake-item", "scale-rotate-item"];
    this.modelClass = allModelClass[this.model - 1]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  * {
    padding: 0;
    margin: 0;
  }
  @keyframes cursor {
    0%, 49% {
      opacity: 1;
    }
    50%, 99% {
      opacity: 0;
    }
  }
  @keyframes itemEntry{
    from {
        top: 300px;
        opacity: 0;
    }
    to {
        top: 0;
        opacity: 1;
    }
  }
  @keyframes itemEntryScale {
    from {
       transform: scale(10)
    }
    to {
        transform: scale(1)
    }
  }

  @keyframes itemEntryShake {
    10%, 90% {
      transform: translateX(-50%) translate3d(-3px, 0, 0);
    }
    20%, 80% {
     transform: translateX(-50%) translate3d(4px, 0, 0);
    }
    30%, 50%, 70% {
      transform: translateX(-50%) translate3d(-2px, 0, 0);
    }
    40%, 60% {
      transform: translateX(-50%) translate3d(4px, 0, 0);
    }
  }
  @keyframes itemEntryScaleRotate{
    from {
        top: 300px;
        color: #03a9f4;
        transform: scale3d(10, 10, 10) rotate(1080deg);
    }
    to {
        top: 0;
        color: black;
        transform: scale3d(0, 0, 0) rotate(0)
    }
  }
  
  .type-input {
    position: relative;
    width: 500px;
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    border: 1px solid #888;
    cursor: text;
    text-align: left;
  }
  .focus {
    animation: cursor 1.2s linear infinite;
    background-color: #03a9f4;
    height: 15px;
    width: 1px;
    margin-left: 3px;
    display: inline-block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .hide-input {
    opacity: 0;
  }

  .char-item {
    display: inline-block;
    text-align: center;
  }
  .flyin-item {
    position: relative;
    top: 300px;
    opacity: 1;
    border: none;
    animation: itemEntry .2s ease-in;
    animation-fill-mode: forwards;
  }
  .scale-item {
    animation: itemEntryScale .2s ease-in;
    animation-fill-mode: forwards;
    transform: rotate(10)
  }
  .shake-item {
    animation: itemEntryShake .2s ease-in;
    animation-fill-mode: forwards;
  }
  .scale-rotate-item{
      position: relative;
      transform: scale3d(10, 10, 10) rotate(1080deg);
      animation: itemEntryScaleRotate .2s ease-in;
      animation-fill-mode: forwards;
  }
</style>
