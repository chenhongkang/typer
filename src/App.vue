<template>
  <div id="app" @click="cancelFocus">
    <Typer 
      @focus="typerFocus" 
      :focus="isTyperFocus" 
      :copyModel="copyModel" 
      :config="{inputWidth}"
      :model="model"
    />
    <div class="btn-group">
      <button @click="changeModel(1)">方式1</button>
      <button @click="changeModel(2)">方式2</button>
      <button @click="changeModel(3)">方式3</button>
      <button @click="changeModel(4)">方式4</button>
      <button @click="changeModel(5)">方式5</button>
      <button @click="changeCopyModel(false)">普通模式</button>
      <button @click="changeCopyModel(true)">复制模式</button>
      <label for="inputWidth">长度</label>
      <input name="inputWidth" type="text" v-model="inputWidth">
    </div>
  </div>
</template>

<script>
import Typer from './components/Typer.vue'

export default {
  name: 'app',
  components: {
    Typer
  },
  data: () => {
    return {
      isTyperFocus: true,
      model: 1,
      copyModel: false,
      inputWidth: 500,
      sleep: 200
    }
  },
  methods: {
    typerFocus: function(){
      this.isTyperFocus = true
    },
    cancelFocus: function(){
      this.isTyperFocus = false
    },
    changeModel: function(model){
      this.model = model
    },
    changeCopyModel: function(copySwitch){
      this.copyModel = copySwitch
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 500px;
}
.btn-group {
  margin-top: 30px;
}
</style>
