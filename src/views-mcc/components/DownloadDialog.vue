<template>
  <el-dialog :visible.sync="_show" append-to-body title="下载附件" width="800px">
    <section class="list-wraper">
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            row-key="id"
            highlight-current-row
            style="width: 100%;" border
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              label="操作"
              width="180">
              <template slot-scope="scope">
                <span class="download" @click="downloadClick(scope.row.url,scope.row.name)">下载</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-row>
    </section>
    <div slot="footer" class="dialog-footer">
      <el-button @click="_show = false">取 消</el-button>
      <el-button type="primary" :disabled="checkFiles.length>0?false:true" @click="downloadsClick">下 载</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {fileDetail, uploadFileUrl, getfiles} from '@/api/file.js'
  import download from 'ly-downloader'

  export default {
    data() {
      return {
        tableData: [],
        checkFiles: [],
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      ids: {
        type: String,
        default: ""
      }
    },
    computed: {
      _show: {
        get: function () {
          return this.show
        },
        set: function (newVal) {
          this.$emit('update:show', newVal)
        }
      }
    },
    watch: {
      ids(newVal) {
        this.tableData = [];
        this.getFileData();
      }
    },
    methods: {
      //获取客户列表
      getFileData() {
        if (this.ids) {
          getfiles({ids: this.ids}).then(res => {
            if (res.code == 200) {
              res.data.forEach(e => {
                this.tableData.push({name: e.name, url: this.baseImgUrl + e.path, id: e.id})
              })
            }
          })
        }

      },
      //下载确认按钮
      downloadsClick() {
        for (let i in this.checkFiles) {
          if (this.checkFiles[i] !== "") {
            let adress = this.checkFiles[i].url;
            let name = this.checkFiles[i].name;
            download(1,adress,name);
            // window.open(adress,"iframe_" + i)
            // setTimeout(function () {
            //   let frame = document.createElement("iframe");
            //   frame.setAttribute("id", "iframe_" + i);
            //   frame.src = adress;
            //   document.body.appendChild(frame);
            //   setTimeout(function () {
            //     document.body.removeChild(frame);
            //   }, 1000);
            // }, 100);
          }
        }
      },
      downloadClick(url,name){
        download(1,url,name);
      },
      handleSelectionChange(row) {
        this.checkFiles = row
      }
    },

  }
</script>

<style lang="scss" scoped>
  .download{
    color: #0079fe;
    cursor: pointer;
  }

</style>
