<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>

      <el-form-item label="" prop="typeCode">
        <el-select v-model="searchForm.typeCode" filterable clearable placeholder="请选择字典类型名称">
          <el-option :label="item.message" :value="item.code" v-for="(item,index) in dicTypeCodeEnum" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="valueName">
        <el-input v-model="searchForm.valueName" clearable placeholder="请输入字典值名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('config_dictionary_add')"><i class="fa-fw fa fa-plus"></i>添加</el-button>
      </el-row>
      <el-row class="table-wraper">
        <template v-if="tableShow">
          <el-table
            ref="multipleTable"
            :data="tableData"
            row-key="id"
            style="width: 100%;" stripe border
            lazy
            :load="getDictionaryChildes"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            :expand-row-keys="expandRowKeys"
            @expand-change="expandChange">
            <el-table-column
              prop="dicNum"
              label="编码">
            </el-table-column>
            <el-table-column
              prop="typeCode"
              label="类型编码">
            </el-table-column>
            <el-table-column
              prop="typeName"
              label="类型名称">
            </el-table-column>
            <el-table-column
              prop="value"
              label="字典值">
            </el-table-column>
            <el-table-column
              prop="valueName"
              label="字典值名称">
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <!--<el-button
                  size="mini"
                  type="primary"
                  @click="handleAdd(scope.row)" v-if="hasButton('config_dictionary_child_add')"><i class="fa fa-plus fa-fw"></i>添加子级</el-button>
                -->
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)" v-if="hasButton('config_dictionary_edit')"><i class="fa fa-pencil fa-fw"></i>编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)" v-if="hasButton('config_dictionary_delete')"><i class="fa fa-trash-o fa-fw"></i>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <page-temp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>


    <!--添加-->
    <el-dialog :title="dialogType == 'add' ? '添加' : '编辑'" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false" :append-to-body='true'>
      <el-form class="dialog-form" ref="dialogForm" :model="dialogForm" label-width="100px" :rules="rules">
        <el-form-item label="类型名称" prop="typeCode">
          <el-select v-model="dialogForm.typeCode" filterable clearable placeholder="请选择字典类型名称" @change="changeTypeCode">
            <el-option :label="item.message" :value="item.code" v-for="(item,index) in dicTypeCodeEnum" :key="item.code"></el-option>
          </el-select>
        </el-form-item>

        <!--<el-form-item label="类型编码" prop="typeCode">
          <el-input v-model="dialogForm.typeCode" clearable placeholder="类型编码" :disabled="dialogType == 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="dialogForm.typeName" clearable placeholder="类型名称"></el-input>
        </el-form-item>-->
        <el-form-item label="字典值" prop="value">
          <el-input type="number" min="0" v-model.number="dialogForm.value" clearable placeholder="字典值：只能输入数字"></el-input>
        </el-form-item>
        <el-form-item label="字典值名称" prop="valueName">
          <el-input v-model="dialogForm.valueName" clearable placeholder="字典值名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import { addDictionary,deleteDictionary,editDictionary,getDictionaryChildes,getDictionaryDataPage,getDicTypeCodeEnum } from '@/api/config.js'
  import PageTemp from '@/components/PageTemp'
  export default {
    data(){
      return{
        //对话框
        dialogShow:false,
        dialogType:'add',//点击操作按钮改变
        dialogForm:{
          parentId:'',
          parentDicNum:'',
          typeCode:'',
          typeName:'',
          value:'',
          valueName:''
        },
        rules:{
          typeCode:[{ required: true, message: '请输入类型编码'}],
          typeName:[{ required: true, message: '请输入类型名称'}],
          value:[{ required: true, message: '请输入字典值'}],
          valueName:[{ required: true, message: '请字输入字典值名称'}]
        },
        //数据词典列表 的检索条件
        searchForm:{
          pageNum:1,
          pageSize:10,
          typeCode:'',
          typeName:'',
          valueName:'',
        },
        expandRowKeys:[],
        tableData:[],
        total:0,
        tableShow:true,
        dicTypeCodeEnum:[],//字典类型名称

      }
    },
    components:{PageTemp},
    methods:{

      //下拉选择changeTypeCode
      changeTypeCode(val){
        this.dicTypeCodeEnum.forEach(item=>{
          if (val == item.code){
            this.dialogForm.typeName = item.message;
          };
        })
      },
      //操作按钮
      handleAdd(row){
        this.dialogShow = true;
        this.dialogType = 'add';
        for (let key in this.dialogForm){
          this.dialogForm[key] = '';
        };
        if (row.id){ //添加子级
          this.dialogForm.parentId = row.id;
          this.dialogForm.parentDicNum = row.dicNum;
        };
        this.$nextTick(()=>{
          this.$refs['dialogForm'].clearValidate(); //移除校验结果
        })
      },
      handleEdit(row){
        this.dialogShow = true;
        this.dialogType = 'edit';
        this.dialogForm = {
          id:row.id,
          parentId:row.parentId,
          parentDicNum:row.dicNum,
          typeCode:row.typeCode,
          typeName:row.typeName,
          value:row.value,
          valueName:row.valueName
        };
        this.$nextTick(()=>{
          this.$refs['dialogForm'].clearValidate(); //移除校验结果
        })
      },
      handleDelete(row){
        this.commonDeleteDialog(this.deleteDictionary,row.dicNum,'删除')
      },
      expandChange(node,expanded){
        //console.log(node,expanded)
      },
      //对话框
      sure(){
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.dialogType == 'add' && this.addDictionary();
            this.dialogType == 'edit' && this.editDictionary();
          }
        })
      },
      //查询
      querySearchForm(){
        this.getDictionaryDataPage()
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.resetForm('searchForm');
        this.getDictionaryDataPage();
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },

      //列表
      //添加
      addDictionary(){
        addDictionary(this.dialogForm).then(res=>{
          if (res.code == 200){
            this.$message.success('添加成功')
            this.dialogShow = !this.dialogShow;
            this.getDictionaryDataPage()
          }
        })
      },
      //删除
      deleteDictionary(dicNum){
        deleteDictionary(dicNum).then(res=>{
          if (res.code == 200){
            this.$message.success('删除成功')
            this.getDictionaryDataPage()
          }
        })
      },
      //编辑
      editDictionary(){
        editDictionary(this.dialogForm).then(res=>{
          if (res.code == 200){
            this.$message.success('编辑成功')
            this.dialogShow = !this.dialogShow;
            this.getDictionaryDataPage()
          }
        })
      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getDictionaryDataPage()
      },
      //获取子级数据词典列表
      getDictionaryChildes(tree, treeNode, resolve) {
        //console.log(tree, treeNode, resolve)
        getDictionaryChildes(tree.id).then(res=>{
          if (res.code == 200){
            resolve(res.data)
          }else{
            resolve([])
          };
        })
      },
      //获取数据词典列表
      getDictionaryDataPage(){
        getDictionaryDataPage(this.searchForm).then(res=>{
          if (res.code == 200){
            this.tableData = res.data.result;
            this.total = res.data.totalPages;

            //刷新表格dom
            this.tableShow = false;
            this.$nextTick(()=>{
              this.tableShow = true;
            })
          };
        })
      },
      //获取数据词典类型名称列表
      getDicTypeCodeEnum(){
        getDicTypeCodeEnum().then(res=>{
          if (res.code == 200){
            this.dicTypeCodeEnum = res.data;
          };
        })
      }
    },
    created() {
      this.getDictionaryDataPage()
      this.getDicTypeCodeEnum()
    }
  };
</script>

<style lang="scss" scoped>

</style>
