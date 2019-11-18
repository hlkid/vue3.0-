<template>
<div class="pages"
  @mousedown.ctrl.left="start($event)"
  @mousemove="drag($event)"
  @mouseup="end($event)"
  @mouseleave="fix($event)">
  <div class="seatSelectArea" ref="seatSelectArea">
      <div class="seatArea" :style="{width:seatAreaWidth+'px',height:seatAreaHeight+ 'px'}" v-show="x!==0 && y!==0">
        <template v-for="(seatItem,index) in seatList">
          <div ref="seatItem" @click.alt.exact="handleCtrlClick(index)"  @click.exact="handleClick(index)" :x="seatItem.x" :y="seatItem.y" class="seatItem" :key="'x'+seatItem.x+'y'+seatItem.y+index"
          :style="{width:seatItemWidth+'px',height:seatItemWidth+'px',
          transform: 'translate3d(' + seatItem.translateX  + 'px,'+ seatItem.translateY + 'px,0px)',
          background:seatItem.background}" :index="index">
            <img v-if="seatItem.backimg" :src="seatItem.backimg">
            <span v-if="seatItem.backimg" class="seat-num">{{seatItem.name}}</span>
          </div>
        </template>
      </div>
  </div>
  <drag-div :left="left" :top="top" :width="width" :height="height" v-show="showDrag"></drag-div>

  <el-dialog title="设置座位号" :visible.sync="dialogVisible" append-to-body>
    <el-form ref="seatQuery" :model="seatQuery" :rules="seatrules"  inline size="small">
      <el-form-item label="X坐标" prop="x">
        <el-input v-model.trim="seatQuery.x" placeholder="请输入内容" @change="inputChange"></el-input>
      </el-form-item>
      <el-form-item label="Y坐标" prop="y">
        <el-input v-model.trim="seatQuery.y" @change="inputChange"></el-input>
      </el-form-item>
      <el-form-item label="座位号" prop="name">
        <el-input v-model.trim="seatQuery.name" placeholder="name">
        </el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogSure">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import { checkNumber } from "@/utils/validate";
import DragDiv from './DragDiv'
import { setSeatData } from "@/api/clib/space";

export default {
  components: {
    DragDiv
  },
  props: ['prop_x', 'prop_y', 'prop_seatList', 'prop_templeteId'],
  data () {
    return {
      seatItemWidth: 40,
      shifting: 10, // 偏移值
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      startX: 0,
      startY: 0,
      showDrag: false,
      seatList: [],
      seatListBack: null,
      unSelect: '#C6E2FF',
      selecting: '#409EFF',
      selected: '#E9EEF3',
      timer: null,
      normalImg: require('../img/0-0-1.png'),
      doorImg:require('../img/2-0-1.png'),
      windowImg:require('../img/1-0-1.png'),
      x: 0,
      y: 0,
      templeteId: null,

      dialogVisible:false,
      seatQuery:{x:"",y:"",name:'',oldx:'',oldy:"",index:''},
      seatrules:{
        x:[
          { required: true, message: '请输入x坐标'},{ validator:checkNumber}
        ],
        y:[
          { required: true, message: '请输入y坐标'},{ validator:checkNumber}
        ],
        name:[
          { required: true, message: '请输入座位号'}
        ],
      },
      seatDialogLsit:[],
      seatNumRuleInput:"`A${item.x}${item.y}`"
    }
  },
  watch: {
    prop_seatList (value) {
      this.seatListBack = value
    },
    prop_x (value) {
      this.x = value
      this.refreshDom()
    },
    prop_y (value) {
      this.y = value
      this.refreshDom()
    },
    prop_templeteId (value) {
      this.templeteId = value
    }
  },
  computed: {
    ...mapState({
      templeteName: state => state.seat.templeteName,
      templetePrice: state => state.seat.templetePrice,
      reset: state => state.seat.reset
    }),
    seatAreaWidth () {
      return (this.seatItemWidth + this.shifting) * this.x + this.shifting
    },
    seatAreaHeight () {
      return (this.seatItemWidth + this.shifting) * this.y + this.shifting
    },
    translateValue () {
      return this.seatItemWidth + this.shifting
    },
    selectingList () {
      let selectingList = []
      for (const index in this.seatList) {
        if (this.seatList[index].background === this.selecting) {
          let temp = { ...this.seatList[index] }
          temp.orgIndex = index
          selectingList.push(temp)
        }
      }
      var obj = {}
      for (let index in selectingList) {
        let seatRowList = selectingList[index].y
        if (seatRowList in obj) {
          obj[seatRowList].push(selectingList[index])
        } else {
          let seatArr = []

          seatArr.push(selectingList[index])
          obj[seatRowList] = seatArr
        }
      }
      return obj
    }
  },
  methods: {
    ...mapMutations([
      'changeConfirmButtonLoading']),
    ...mapActions([
      'clearHallSeat'
    ]),
    addSeatNumClick(){
      if(this.seatNumRuleInput){
        this.seatDialogLsit.map(item =>{
          item.name =  eval(this.seatNumRuleInput)
          return item
        })
      }
    },
    refreshDom () {
      let that = this
      let seatScale = 1
      let seatScaleX = 1
      let seatScaleY = 1
      let seatSelectAreaWidth = that.$refs.seatSelectArea.offsetWidth
      let seatSelectAreaHeight = that.$refs.seatSelectArea.offsetHeight
      let seatAreaWidth = 50 * that.x - that.shifting
      let seatAreaHeight = 50 * that.y - that.shifting
      if (seatAreaWidth > seatSelectAreaWidth) {
        seatScaleX = seatSelectAreaWidth / seatAreaWidth
      }
      if (seatAreaHeight > seatSelectAreaHeight) {
        seatScaleY = seatSelectAreaHeight / seatAreaHeight
      }
      if (seatScaleX < 1 || seatScaleY < 1) {
        seatScale = seatScaleX < seatScaleY ? seatScaleX : seatScaleY
      }
      that.seatItemWidth = 40 * seatScale
      that.shifting = 10 * seatScale
      that.seatList = []
      let data = {
        x: 0,
        y: 0,
        translateX: 0,
        translateY: 0,
        background: false,
        backimg: null,
        name:''
      };
      let isLen = (!that.reset && that.seatListBack != null && that.seatListBack.length > 0)
      let translateValue = that.translateValue;
      for (let x = 1; x <= that.x; x++) {
        for (let y = 1; y <= that.y; y++) {
          data.x = x;
          data.y = y;
          data.translateX = translateValue * (x - 1);
          data.translateY = translateValue * (y - 1);
          data.background = this.unSelect;
          data.backimg = null;
          data.name = '';
          if (isLen) {
            let temp = that.seatListBack.find((el) => (el.x === x && el.y === y))
            if (temp) {
              let backimg = null
              switch (temp.type) {
                case 0:
                  backimg = this.normalImg;
                  break
                case 1:
                  backimg = this.doorImg;
                  break
                case 2:
                  backimg = this.windowImg;
                  break
                default:
                  backimg = this.normalImg;
                  break
              }
              data.name = temp.name;
              data.background = this.selected;
              data.backimg = backimg;
            }
          }
          that.seatList.push(JSON.parse(JSON.stringify(data)));
        }
      }
      this.$nextTick(() => {
        let List =  JSON.parse(JSON.stringify(that.seatList));
        if ('seatItem' in that.$refs) {
          for (const item of that.$refs.seatItem) {
            let clientRect = item.getBoundingClientRect();
            // let index = that.seatList.findIndex((el) => (el.x === parseInt(item.attributes.x.value) && el.y === parseInt(item.attributes.y.value)))
            let index = item.getAttribute("index");
            let newObject = Object.assign({}, List[index], {
              top: clientRect.top,
              bottom: clientRect.bottom,
              left: clientRect.left,
              right: clientRect.right
            });
            List[index] = newObject
            // this.$set(that.seatList, index, newObject)
          }
          that.seatList = JSON.parse(JSON.stringify(List))
        }
      })
    },
    start (e) {
      let that = this;
      // 解决mousedown导致click失效
      if (that.timer) {
        clearTimeout(that.timer)
      }
      that.timer = setTimeout(function () {
        that.showDrag = true
      }, 100)
      let x = e.clientX
      let y = e.clientY
      that.left = x
      that.top = y
      that.startX = x
      that.startY = y
    },
    drag (e) {
      let that = this
      if (that.showDrag) {
        let x = e.clientX
        let y = e.clientY
        that.left = Math.min(x, that.startX)
        that.top = Math.min(y, that.startY)
        that.width = Math.abs(x - that.startX)
        that.height = Math.abs(y - that.startY)
      }
    },
    fix () {
      if (this.showDrag) {
        let that = this
        that.left = 0
        that.top = 0
        that.width = 0
        that.height = 0
        that.startX = 0
        that.startY = 0
        that.showDrag = false
      }
    },
    end () {
      clearTimeout(this.timer)
      if (this.showDrag) {
        // 首先求出 `元素左上角` 与 `选框左上角` 在X方向较大值与Y方向较大值的交点，记为M点
        // 然后求出 `元素右下角` 与` 选框右下角` 在X方向较小值与Y方向较小值的交点，记为N点。
        // 如果M点的X坐标和Y坐标值均比N点相应的X坐标和Y坐标值小，亦即M和N可以分别构成一个矩形的左上角点和右上角点，则两矩形相交；其余情况则不相交。
        let that = this
        let seatList = that.seatList
        let dragX0 = that.left
        let dragY0 = that.top
        let dragX1 = that.left + that.width
        let dragY1 = that.top + that.height
        for (const index in seatList) {
          let mX = Math.max(dragX0, seatList[index].left)
          let mY = Math.max(dragY0, seatList[index].top)
          let nX = Math.min(dragX1, seatList[index].right)
          let nY = Math.min(dragY1, seatList[index].bottom)
          if (mX < nX && mY < nY) {
            if (that.seatList[index].background === that.selecting) {
              if (that.seatList[index].backimg === '' || that.seatList[index].backimg === null) {
                this.$set(that.seatList[index], 'background', that.unSelect)
              } else {
                this.$set(that.seatList[index], 'background', that.selected)
              }
            } else if (that.seatList[index].background === that.unSelect) {
              this.$set(that.seatList[index], 'background', that.selecting)
            } else if (that.seatList[index].background === that.selected) {
              this.$set(that.seatList[index], 'background', that.selecting)
            }
          }
        }
        that.left = 0
        that.top = 0
        that.width = 0
        that.height = 0
        that.startX = 0
        that.startY = 0
        that.showDrag = false
      }
    },
    /**
     *座位号变更查询是否可变跟
     *  */
    inputChange (e) {

    },

    dialogSure(){
      let that = this;
      this.$refs['seatQuery'].validate(validator => {
        if(validator){
          if(that.seatQuery.x != that.seatQuery.oldx || that.seatQuery.y != that.seatQuery.oldy){
            let index = that.seatList.findIndex(e => (e.x == that.seatQuery.x&& e.y == that.seatQuery.y));
            console.log(index)
            if(index > -1){
              let obj = JSON.parse(JSON.stringify(that.seatList[index]));
              let obj1 = JSON.parse(JSON.stringify(that.seatList[that.seatQuery.index]));
              that.seatList[index].name = that.seatQuery.name;
              that.seatList[index].background =  obj1.background;
              that.seatList[index].backimg =  obj1.backimg;

              that.seatList[that.seatQuery.index].name = obj.name;
              that.seatList[that.seatQuery.index].background = obj.background;
              that.seatList[that.seatQuery.index].backimg = obj.backimg;
              that.dialogVisible = false
            } else {
              this.$message.error("你要替换的座位没有");
            }
          }else{
            that.seatList[that.seatQuery.index].name = that.seatQuery.name;
            that.dialogVisible = false;
          }
        }
      })
    },

    handleCtrlClick(index){
      console.log(1234)
      let that = this
     if (that.seatList[index].background === that.selecting) {
       if (that.seatList[index].backimg === '' || that.seatList[index].backimg === null) {
         this.$set(that.seatList[index], 'background', that.unSelect)
       } else {
         this.$set(that.seatList[index]  , 'background', that.selected)
       }
     } else if (that.seatList[index].background === that.unSelect) {
       this.$set(that.seatList[index], 'background', that.selecting)
     } else if (that.seatList[index].background === that.selected) {
       this.$set(that.seatList[index], 'background', that.selecting)
     }
    },

    handleClick (index) {
      let that = this
      if (that.seatList[index].backimg === this.normalImg){
        this.dialogVisible = true;
        this.seatQuery.x =  that.seatList[index].x;
        this.seatQuery.oldx =  that.seatList[index].x;
        this.seatQuery.y =  that.seatList[index].y;
        this.seatQuery.oldy =  that.seatList[index].y;
        this.seatQuery.name =  that.seatList[index].name;
        this.seatQuery.index =  index;
      }

    },
    markSeats (e) {
      let that = this
      let seatList = that.seatList
      if (e === 'normal') {
        for (const index in seatList) {
          if (that.seatList[index].background === that.selecting) {
            this.$set(that.seatList[index], 'background', that.selected)
            this.$set(that.seatList[index], 'backimg', that.normalImg)
          }
        }
      } else if (e === 'clear') {
        for (const index in seatList) {
          if (that.seatList[index].background === that.selecting) {
            if (that.seatList[index].backimg !== null) {
              this.$set(that.seatList[index], 'background', that.selected)
            } else {
              this.$set(that.seatList[index], 'background', that.unSelect)
            }
          }
        }
      } else if (e === 'road') {
        for (const index in seatList) {
          if (that.seatList[index].background === that.selecting) {
            this.$set(that.seatList[index], 'background', that.unSelect)
            this.$set(that.seatList[index], 'backimg', null)
          }
        }
      } else if(e === 'door') {
        //设置门
        for (const index in seatList) {
          if (that.seatList[index].background === that.selecting) {
            this.$set(that.seatList[index], 'background', that.selected);
            this.$set(that.seatList[index], 'backimg', that.doorImg);
          }
        }
        console.log(that.seatList)
      } else if(e === 'window') {
        //设置窗
        for (const index in seatList) {
          if (that.seatList[index].background === that.selecting) {
            this.$set(that.seatList[index], 'background', that.selected)
            this.$set(that.seatList[index], 'backimg', that.windowImg)
          }
        }
      }
    },
    clearSeat () {
      let that = this
      for (const index in that.seatList) {
        this.$set(that.seatList[index], 'background', that.unSelect)
        this.$set(that.seatList[index], 'backimg', null)
      }
    },
    confirm () {
      let that = this
      let confirmSeatList = []
      for (const index in this.seatList) {
        if (this.seatList[index].background === this.selected) {
          var temp = {}
          temp.abscissa = this.seatList[index].x;
          temp.ordinate = this.seatList[index].y;
          temp.seatNumber = this.seatList[index].name;
          if (this.seatList[index].backimg === this.normalImg) {
            temp.type = 0
          }
          if (this.seatList[index].backimg === this.doorImg) {
            temp.type = 1
          }
          if (this.seatList[index].backimg === this.windowImg) {
            temp.type = 2
          }
          confirmSeatList.push(temp)
        }
      }
      if (confirmSeatList.length <= 0) {
        this.$notify({
          title: '警告',
          message: '请至少编辑一个座位~',
          type: 'warning',
          duration: 2000
        })
        this.changeConfirmButtonLoading(false)
        return
      }
      for (let i = 0,len = confirmSeatList.length;i < len;i++) {
        if(confirmSeatList[i].type==0 && !confirmSeatList[i].seatNumber){
          that.$message.info('请设置所有的座位号')
          that.changeConfirmButtonLoading(false)
          return
        }
      }
      let coordinate = [this.x,this.y];
      setSeatData({
        idSpace:that.templeteId,
        coordinate:coordinate,
        seatDTOS:confirmSeatList
      }).then(res=>{
        if (res.code == 200) {
          that.$message.success('设置成功');
          that.changeConfirmButtonLoading(false);
        }
      }).catch(err=>{
        that.changeConfirmButtonLoading(false);
      })
    }
  },
  created () {},
  mounted () {

  },
  updated () {

  }
}
</script>
<style lang="scss" scoped>
.pages{
  width :100%;
  height: 100vh;
  padding :0 20px;
  box-sizing :border-box;
  .seatSelectArea{
    width:100%;
    height :100%;
    position :relative;
  }
  .seatArea{
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    padding :5px;
    border :2px dashed rgba(0,0,0,0.2);
    border-radius: 5px;
    .seatItem {
      position: absolute;
      color: white;
      line-height: 40px;
      border-radius: 5px;
      user-select: none;
      display: flex;

      img {
        width: 100%;
        height: 100%;
        border: none;
        object-fit: cover;
      }
      .seat-num{
        position: absolute;
        z-index: 999;
        font-size: 10px;
        color: #666666;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-align: center;
      }
    }
  }

}



</style>
