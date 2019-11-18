<template></template>
<script>
  export default {
    data(){
      return{
        socket: null
      }
    },
    methods:{
      socketOpen(){
        // console.log('socketOpen')
      },
      socketMessage(event){
        if (event && event.data){
          this.$emit('getMessage',JSON.parse(event.data))
        };
      },
      socketError(){
        let timer = setTimeout(()=>{
          clearTimeout(timer)
          this.socketInit()
        },5000)
      },
      socketClose(){
        // console.log('socketClose')

        /*setTimeout(()=>{
          this.socketInit()
        },5000)*/
      },
      socketInit(){
        /*this.$socket.onopen = this.socketOpen;
        this.$socket.onmessage = this.socketMessage;
        this.$socket.onerror = this.socketError;
        this.$socket.onclose = this.socketClose;*/
        this.socket && this.socket.close();

        this.socket = new WebSocket(this.socketUrl);
        this.socket.onmessage = this.socketMessage;
        this.socket.onopen = this.socketOpen;
        this.socket.onerror = this.socketError;
        this.socket.onclose = this.socketClose;

      },

    },
    created() {
      this.socketInit()
    },
    beforeDestroy() {
      if (!this.socket) {
        return
      }
      this.socket.close();
      this.socket = null;
    }
  };
</script>

<style scoped>

</style>
