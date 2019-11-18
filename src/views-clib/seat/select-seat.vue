<template>
  <el-container>
    <el-aside>
      <controller-aside
        @markSeats="markSeats"
        @clearSeat="clearSeat"
        @confirm="confirm"
        :prop_x="x"
        :prop_y="y"
        :prop_templeteName="templeteName"
        :prop_templetePrice="templetePrice"
        :prop_isAdd="isAdd"
      />
    </el-aside>
    <el-main>
      <coordinate-system ref="coordinateSystem"
                         :prop_x="x"
                         :prop_y="y"
                         :prop_templeteId="templeteId"
                         :prop_seatList="seatList"/>
    </el-main>
  </el-container>
</template>

<script>
  import ControllerAside from './components/ControllerAside'
  import CoordinateSystem from './components/CoordinateSystem'
  import { getSeatDatas } from "@/api/clib/space";
  import { mapActions, mapState, mapMutations } from 'vuex'
  export default {
    components: {
      ControllerAside,
      CoordinateSystem
    },
    props: {},
    data () {
      return {
        seatList: [],
        templeteId: null,
        isAdd:true
      }
    },
    watch: {},
    computed: {
      ...mapState({
        fullscreen: state => state.seat.fullscreen,
        x: state => state.seat.x,
        y: state => state.seat.y,
        templeteName: state => state.seat.templeteName,
        templetePrice: state => state.seat.templetePrice
      }),
    },
    methods: {
      ...mapMutations([
        'makeFullscreen'
      ]),
      ...mapMutations([
        'changeX',
        'changeY',
        'changeTempleteName',
        'changeTempletePrice']),
      ...mapActions([
        'clearHallSeat'
      ]),
      getSeatList (templeteId) {
        let that = this;
        getSeatDatas(templeteId).then(res=>{
          if (res.code == 200) {
            let coordinate = res.data.coordinate;
            if (coordinate && coordinate.length) {
              that.isAdd = false;
              that.changeX(coordinate[0]);
              that.changeY(coordinate[1]);
              let list = [];
              res.data.seatVOS.forEach(e => {
                let obj = {
                  x:e.abscissa,
                  y:e.ordinate,
                  type:e.type,
                  name:e.seatNumber
                };
                list.push(obj);
              })
              that.seatList = list;
            }
          }
        })
      },
      markSeats (e) {
        this.$refs.coordinateSystem.markSeats(e)
      },
      clearSeat () {
        this.$refs.coordinateSystem.clearSeat()
      },
      confirm () {
        this.$refs.coordinateSystem.confirm()
      },
    },
    created () {},
    mounted () {
      let templeteId = this.$route.params.id
      if (templeteId !== undefined) {
        this.templeteId = templeteId
        this.clearHallSeat().then(() => {
          this.getSeatList(templeteId)
        })

      }
    },
    beforeRouteLeave (to, from, next) {
      this.clearHallSeat().then(() => {
        next()
      })
    }
  }
</script>
<style lang="scss" scoped>
  .el-container{
    color : rgba(0,0,0,0.4);
    .el-main{
      background-color: #E9EEF3;
      text-align: center;
      padding : 0;
    }

    .el-aside{
      height:100vh;
      text-align: center;
    }

  }

</style>
