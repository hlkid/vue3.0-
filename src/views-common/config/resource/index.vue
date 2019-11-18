<template>
  <section class="view-container tree-wraper">
    <el-form class="search-form" ref="searchForm" :model="searchForm" label-width="0" :inline="true" size="small">
      <el-form-item prop="menuName">
        <el-input v-model.trim="searchForm.menuName" placeholder="请输入菜单名称" @blur="querySearchForm"></el-input>
      </el-form-item>
      <!--<el-form-item prop="menuType">
        <el-select v-model="searchForm.menuType" placeholder="请选择菜单类型" @change="querySearchForm">
          <el-option :label="item.name" :value="item.type" v-for="(item,index) in menuTypeList" :key="index"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa fa-search fa-fw"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa fa-repeat fa-fw"></i>重置</el-button>
      </el-form-item>
    </el-form>

    <div class="tree-container">
      <div class="tree-head clearfix">
        <div class="fl node-name">名称</div>
        <div class="fr node-handle">操作</div>
        <div class="fr node-type">菜单类型</div>
        <div class="fr node-sort">菜单排序</div>
        <div class="fr node-url">菜单URL</div>
        <div class="fr node-url">编码识别</div>
        <!--<div class="fr node-sort">菜单编码</div>-->
      </div>

      <el-tree
      ref="tree"
      :data="treeData"
      :props="defaultProps"
      @node-expand="nodeExpand"
      :filter-node-method="filterNode"
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
      accordion>
      <span class="custom-tree-node clearfix" slot-scope="{ node, treeData }">
        <span :class="{fl:true,isBtn:node.data.menuType == 1}"><i :class="node.data.menuIcon+' fa-fw'" v-if="node.data.menuIcon"></i>{{ node.label }}</span>
        <span class="fr node-handle">
          <el-button
            type="text"
            size="small"
            v-if="node.data.menuType != 1 && hasButton('config_resource_add')"
            @click.stop="add(node,treeData)">
            <i class="fa fa-plus fa-fw"></i>添加
          </el-button>
          <el-button
            type="text"
            size="small"
            v-if="node.data.parentId && hasButton('config_resource_edit')"
            @click.stop="edit(node,treeData)">
            <i class="fa fa-pencil fa-fw"></i>编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            v-if="node.data.parentId && hasButton('config_resource_delete')"
            @click.stop="remove(node,treeData)">
            <i class="fa fa-trash-o fa-fw"></i>删除
          </el-button>

          <!--<el-button
            type="text"
            size="small"
            v-if="node.data.parentId"
            @click="view(node,treeData)">
            查看
          </el-button>-->
        </span>
        <span :class="{fr:true,'node-type':true,'is-menu':node.data.menuType == 0}">{{node.data.menuType == 0?'菜单':'按钮'}}</span>
        <span class="fr node-sort">{{node.data.menuSort}}</span>
        <span class="fr node-url">{{node.data.menuUrl?node.data.menuUrl:'--'}}</span>
        <span class="fr node-url">{{node.data.menuIdentify}}</span>
        <!--<span class="fr node-sort">{{node.data.menuNum}}</span>-->
      </span>
    </el-tree>
    </div>
    <!--添加-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false" :append-to-body='true'>
      <el-form class="dialog-form" ref="dialogForm" :model="dialogForm" label-width="100px" :rules="rules">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="dialogForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model="dialogForm.menuType" placeholder="菜单类型">
            <el-option :label="item.name" :value="item.type" v-for="(item,index) in menuTypeList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台类型" prop="platformType">
          <el-select v-model="dialogForm.platformType" placeholder="平台类型">
            <el-option label="管理后台" :value=1></el-option>
            <el-option label="小程序" :value=2></el-option>
          </el-select>
        </el-form-item>
        <!--编码专用-->
        <el-form-item label="编码识别" prop="menuIdentify">
          <el-input v-model="dialogForm.menuIdentify" placeholder="编码识别"></el-input>
        </el-form-item>
        <el-form-item label="菜单URL" prop="menuUrl">
          <el-input v-model="dialogForm.menuUrl" placeholder="菜单URL"></el-input>
        </el-form-item>
        <el-form-item label="菜单排序" prop="menuSort">
          <el-input v-model="dialogForm.menuSort" placeholder="菜单排序"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="menuIcon">
          <el-input v-model="dialogForm.menuIcon" placeholder="font-awesome字体图标"></el-input>
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
  import {outputTree} from '@/utils/common.js'
  import { addMenu,deleteMenu,editMenu,getMenuData } from '@/api/config.js'
  export default {
    data(){
      return{
        dataForm: {
          parentId: '',
          parentMenuNum: '',
          menuName: '',
          menuType: 0,//0菜单1按钮
          platformType: 1,
          menuUrl: '',
          menuIdentify: '',
          menuIcon: '',
          menuStatus: '',
          menuSort: ''
        },
        //对话框
        dialogForm: {},
        dialogShow: false,
        dialogTitle: '添加',
        dialogType: 'add',//点击操作按钮改变
        rules: {
          menuName:[{ required: true, message: '请输入菜单名称'}],
          menuType:[{ required: true, message: '请选择菜单类型'}],
          menuUrl:[{ required: true, message: '请选择菜单URL'}],
          menuSort:[{ required: true, message: '请选择菜单序号'}],
          menuIdentify:[{ required: true, message: '请输入编码识别'}],
        },
        //tree
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'menuName'
        },
        //查询条件
        searchForm:{
          menuName:'',
          menuType:''
        },
        //菜单类型
        menuTypeList:[
          {name:'菜单',type:0},
          {name:'按钮',type:1}
        ],
        defaultExpandedKeys:[],//默认展开的树节点
      }
    },
    components:{},
    methods:{
      //点击查询
      querySearchForm(){
        this.filterTree()
      },
      //点击重置
      resetSearchForm(){
        this.resetForm('searchForm');
        this.filterTree()
      },
      //对话框确定按钮
      sure(){
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.dialogType == 'add' && this.addMenu();
            this.dialogType == 'edit' && this.editMenu();
          }
        })
      },
      //操作按钮
      add(node){
        //console.log(node)
        this.dialogShow = true;
        this.dialogType = 'add';
        this.dialogTitle = '添加';

        this.dialogForm = JSON.parse(JSON.stringify(this.dataForm));
        this.dialogForm.parentId = node.data.id;
        this.dialogForm.parentMenuNum = node.data.menuNum;
      },
      remove(node){
        //console.log(node)
        this.commonDeleteDialog(this.deleteMenu,node.data.menuNum,'删除')
      },
      edit(node){
        //console.log(node)
        this.dialogShow = true;
        this.dialogType = 'edit';
        this.dialogTitle = '编辑';

        this.dialogForm = JSON.parse(JSON.stringify(node.data));
      },
      view(node){
        //console.log(node)
        this.dialogShow = true;
        this.dialogType = 'view';
        this.dialogTitle = '查看';
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },
      //添加菜单
      addMenu(){
        addMenu(this.dialogForm).then(res=>{
          if (res.code == 200){
            this.$message.success('添加成功')
            this.dialogShow = !this.dialogShow;
            this.getMenuData()
          }
        })
      },
      //删除菜单
      deleteMenu(menuNum){
        deleteMenu(menuNum).then(res=>{
          if (res.code == 200){
            this.$message.success('删除成功')
            this.getMenuData()
          }
        })
      },
      //编辑菜单
      editMenu(){
        editMenu(this.dialogForm).then(res=>{
          if (res.code == 200){
            this.$message.success('编辑成功')
            this.dialogShow = !this.dialogShow;
            this.getMenuData()
          }
        })
      },
      //获取菜单列表
      getMenuData(){
        getMenuData(this.searchForm).then(res=>{
          if (res.code == 200){
            this.treeData = outputTree(res.data,null,'menuSort');
            if (this.defaultExpandedKeys.length == 0){
              this.defaultExpandedKeys.push(this.treeData[0].id)
            };
          };

        })
      },
      filterNode(obj, data) {
        if (!obj.menuName) return true;
        return data.menuName.indexOf(obj.menuName) !== -1
      },
      //前端过滤
      filterTree() {
        this.$refs.tree.filter(this.searchForm);
      },
      //节点展开事件
      nodeExpand(data,node,self){
        //console.log(data,node,self)
        this.defaultExpandedKeys = [this.defaultExpandedKeys[0],data.id];
      }
    },
    created() {
      this.getMenuData()
    }
  };
</script>

<style lang="scss" scoped>
  .tree-container{
    min-height: 500px;
  }
</style>
