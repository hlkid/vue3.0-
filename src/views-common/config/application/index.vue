<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="name">
        <el-input v-model.trim="searchForm.name" clearable placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="type">
        <el-select v-model="searchForm.orgType" clearable placeholder="类型">
          <el-option :label="item.message" :value="item.code" v-for="item in typeList"
                     :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>

    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('config_app_add')"><i class="fa-fw fa fa-plus"></i>添加</el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            row-key="id"
            style="width: 100%;" stripe border>
            <el-table-column
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="orgTypeName"
              label="类型">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="appId"
              label="应用ID">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="appSecret"
              label="应用密钥">
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleDistribute(scope.row)" v-if="hasButton('config_app_dictionary')"><i class="fa fa-pencil fa-fw"></i>分配数据字典</el-button>

                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)" v-if="hasButton('config_app_edit')"><i class="fa fa-pencil fa-fw"></i>编辑</el-button>

                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)" v-if="hasButton('config_app_delete')"><i class="fa fa-trash-o fa-fw"></i>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>

    <!--添加-->
    <el-dialog :title="dialogType == 'add' ? '添加' : '编辑'" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" :append-to-body='true'>
      <el-form class="dialog-form" ref="dialogForm" :model="dialogForm" label-width="100px" :rules="rules" >
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="dialogForm.name" clearable></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="orgType" v-if="dialogType == 'add'">
          <el-select v-model="dialogForm.orgType" clearable>
            <el-option :label="item.message" :value="item.code" v-for="item in typeList"
                       :key="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配数据字典-->
    <el-dialog title="分配数据字典" :visible.sync="dialogDicShow" width="550px" :close-on-click-modal="false" :append-to-body='true'>
      <el-form class="dialog-form" ref="dialogDicForm" :model="dialogDicForm" label-width="100px" :rules="dicRules" >
        <el-form-item label="场馆列表" prop="venueNums">
          <el-select v-model="dialogDicForm.venueNums" multiple @change="changeVenue">
            <el-option :label="item.name" :value="item.venueNum" v-for="item in venueList"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <div style="max-height: 450px;overflow-y: scroll;">
          <el-tree
            ref="dicTree"
            @check="checkDicTree"
            :data="dicTree"
            show-checkbox
            node-key="id"
            :default-checked-keys="this.dialogDicForm.dicIds"
            :props="dicTreeProps">
          </el-tree>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDicShow = false">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="handleDistributeSure">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import { hbApplicationTypeEnum, hbApplicationDataPage, hbApplicationUpdate, hbApplicationCreate, hbApplicationDetail, hbApplicationDelete,
    getDicTypeCodeEnum, getDicListByTypeCode,
    applicationDictionaryCreate, applicationDictionaryData ,getDictionaryNode} from '@/api/config.js'

  import { getVenueData } from '@/api/mcc/venue.js'

  export default {
    components:{PageTemp},
      data() {
        return {
          dicTree: [],
          dicTreeProps:{
            children: 'children',
            label: 'label',
            isLeaf: 'leaf'
          },
          typeList: [],// 应用类型
          //检索条件
          searchForm:{
            pageNum:1,
            pageSize:10,
            name:'',
            orgType:''
          },

          tableData:[],
          total:0,

          dialogShow:false,
          dialogType:'add',
          dialogForm:{
            id:'',name:'',orgType:''
          },
          rules:{
            name:[{ required: true, message: '请输入名称'}],
            orgType:[{ required: true, message: '请选择类型'}]
          },

          /*分配字典*/
          distributeDicList: [],// 当前场馆分配的当前字典类型的字典列表
          dicTypeCodeEnum: [],// 字典类型
          dicList: [],// 字典列表
          venueList: [],// 字典列表
          dialogDicShow: false,
          dialogDicForm: {
            // typeCode:'',
            hbAppId: '',
            venueNums: [],
            dicIds: []
          },
          dicRules:{
            // venueNums:[{ required: true, message: '请选择场馆'}],
            // typeCode:[{ required: true, message: '请选择字典类型'}],
            //dicIds:[{ required: true, message: '请选择字典'}],
          },
        }
      },
      methods:{
        // 字典树
        checkDicTree(){
          let arr = this.$refs.dicTree.getCheckedNodes(true);
          this.dialogDicForm.dicIds = []
          arr.forEach(i=>{
            i.id && this.dialogDicForm.dicIds.push(i.id)
          })
        },
        // 对话框确认分配按钮
        handleDistributeSure(){
          this.$refs['dialogDicForm'].validate((valid) => {
            if (valid) {
              applicationDictionaryCreate(this.dialogDicForm).then(res=>{
                if (res.code == 200){
                  this.$nextTick(()=>{
                    this.$refs['dialogDicForm'].resetFields();
                    this.$refs['dialogDicForm'].clearValidate(); //移除校验结果
                    this.dialogDicForm.venueNums = []
                  })
                  this.$message.success('分配成功')
                  this.dialogDicShow = false
                }
              })
            }
          })
        },
        // 切换字典类型
        /*changeDicTypeCodeEnum(val){
          this.dicList = [];
          this.dialogDicForm.dicIds = [];
          this.getDicListByTypeCode(val,this.dicList)
          this.dialogDicForm.venueNums !== '' && this.applicationDictionaryData(this.dialogDicForm);
        },*/
        // 切换场馆
        changeVenue(val){
          if (val.length === 1){
            this.applicationDictionaryData({
              hbAppId: this.dialogDicForm.hbAppId,
              venueNum: val[0]
            });
          }
        },
        // 点击分陪字典按钮
        handleDistribute(row){
          this.dialogDicShow = true;
          this.dialogDicForm.hbAppId = row.appId;
          this.dialogDicForm.dicIds = []
          this.dialogDicForm.venueNums = []


          this.getVenueData({
            hbAppId: row.appId
          })

          this.$nextTick(()=>{
              this.$refs.dicTree.setCheckedKeys([]);

            this.applicationDictionaryData({
              hbAppId: row.appId,
              venueNum: ''
            });
          })

        },
        //获取场馆列表
        getVenueData(params){
          getVenueData(params).then(res=>{
            if (res.code == 200){
              this.venueList = res.data;
            };
          })
        },
        // 数字字典懒加载
        loadNode(node, resolve){
          // console.log(node)
          if (node.level === 0) {
            return resolve(this.dicTree);
          }
          if (node.data.code) {
            getDicListByTypeCode(node.data.code).then(res=>{
              if (res.code == 200){
                let arr = []
                res.data.forEach(item=>{
                  arr.push({
                    value:item.value,
                    id:item.id,
                    label:item.valueName,
                    leaf: true // 叶子节点
                  })
                })
                resolve(arr)
              }else{
                resolve([])
              }
            })
          }else{
            resolve([])
          }

        },
        // 已绑定字典类型查找
        applicationDictionaryData(data){
          this.dialogDicForm.dicIds = [];
          applicationDictionaryData(data).then(res=>{
            if (res.code == 200){
              this.distributeDicList = res.data;
              res.data.forEach(i=>{
                this.dialogDicForm.dicIds.push(i.id);
              })
              // console.log(this.dialogDicForm.dicIds)
              this.$nextTick(()=>{
                this.$refs.dicTree.setCheckedKeys(this.dialogDicForm.dicIds);
              })
            };
          })
        },
        //获取数据词典类型名称列表
        getDicTypeCodeEnum(data){
          getDicTypeCodeEnum().then(res=>{
            if (res.code == 200){
              this.dicTypeCodeEnum = res.data;
              /*this.dicTree = this.dicTypeCodeEnum.map(i=>{
                i.children = [];
                i.label = i.message;
                i.value = i.code;
                i.parent = true;
                i.leaf = false; // 非叶子节点
                // this.getDicListByTypeCode(i.code,i.children);
                return i
              })*/
            };
          })
        },
        // 数据词典树
        getDictionaryNode(){
          getDictionaryNode().then(res=>{
            if (res.code == 200){
              this.dicTree = res.data.map(i=>{
                i.label = i.codeName;
                i.value = i.typeCode;
                i.parent = true;
                i.children = i.nodeData.map(j=>{
                  j.label = j.valueName;
                  j.value = j.id;
                  return j
                });
                return i
              });
            }
          })
        },
        //查询
        querySearchForm(){
          this.hbApplicationDataPage()
        },
        //重置
        resetSearchForm(){
          this.searchForm.pageNum = 1;
          this.resetForm('searchForm');
          this.hbApplicationDataPage();
        },
        resetForm(formName) {
          this.$refs[formName] && this.$refs[formName].resetFields();
        },

        //操作按钮
        handleAdd(){
          this.dialogShow = true;
          this.dialogType = 'add';
          for (let key in this.dialogForm){
            this.dialogForm[key] = '';
          };
          this.$nextTick(()=>{
            this.$refs['dialogForm'].clearValidate(); //移除校验结果
          })
        },
        handleEdit(row){
          this.dialogShow = true;
          this.dialogType = 'edit';
          for (let key in this.dialogForm){
            this.dialogForm[key] = '';
          };
          this.$nextTick(()=>{
            this.$refs['dialogForm'].clearValidate(); //移除校验结果
          });

          this.hbApplicationDetail(row.id);

        },
        handleDelete(row){
          this.commonDeleteDialog(this.hbApplicationDelete,row.id,'删除')
        },

        sure(){
          this.$refs['dialogForm'].validate((valid) => {
            if (valid) {
              this.dialogType == 'add' && this.hbApplicationCreate();
              this.dialogType == 'edit' && this.hbApplicationUpdate();
            }
          })
        },


        //分页
        goSpecifiedPage(val){
          this.searchForm.pageNum = val;
          this.hbApplicationDataPage()
        },
        /*-新增-*/
        hbApplicationCreate(){
          let params =  this.dialogForm;
          delete  params.id;
          // console.log(params)
          hbApplicationCreate(params).then(res=>{
            if (res.code == 200){
              this.$message.success('添加成功')
              this.dialogShow = !this.dialogShow;
              this.hbApplicationDataPage()
            }
          })
        },
        /*-编辑-*/
        hbApplicationUpdate(){
          hbApplicationUpdate(this.dialogForm).then(res=>{
            if (res.code == 200){
              this.$message.success('编辑成功')
              this.dialogShow = !this.dialogShow;
              this.hbApplicationDataPage();
            }
          })
        },

        //分页查询
        hbApplicationDataPage(){
          hbApplicationDataPage(this.searchForm).then(res=>{
            if (res.code == 200){
              this.tableData = res.data.result;
              this.total = res.data.totalPages;
            };
          })
        },

        //删除
        hbApplicationDelete(id){
          hbApplicationDelete(id).then(res=>{
            if (res.code == 200){
              this.$message.success('删除成功')
              this.hbApplicationDataPage()
            }
          })
        },
        //发布
        /*wechatAccountUpdatePublishStatus(row){
          wechatAccountUpdatePublishStatus({
            id: row.id,
            publishStatus: row.publishStatus ? 0 : 1
          }).then(res=>{
            if (res.code == 200){
              if (!row.publishStatus){
                this.$message.success('发布成功')
              } else{
                this.$message.success('取消发布成功')
              }
              this.hbApplicationDataPage()
            }
          })
        },*/

        // 查询详情
        hbApplicationDetail(id){
          hbApplicationDetail(id).then(res=>{
            if (res.code == 200){
              for (let key in this.dialogForm){
                this.dialogForm[key] = res.data[key];
              };
            };
          })
        },

        // 类型
        hbApplicationTypeEnum(){
          hbApplicationTypeEnum().then(res=>{
            if (res.code == 200){
              this.typeList = res.data
            };
          })
        }

      },
      created(){
        this.getDictionaryNode();
        this.getVenueData();

        this.hbApplicationTypeEnum();
        this.hbApplicationDataPage();
      }
    }
</script>

<style scoped>

</style>
