<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text" :style="{height:this.contentHeight+'px'}">
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
import { uploadFileUrl } from "@/api/file.js";
export default {
  data() {
    return {
      editor: null,
      info_: null
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    isClear: {
      type: Boolean,
      default: false
    },
    contentHeight: {
      type: String
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
    value(val) {
      // 使用 v-model 时，设置初始值
      this.editor.txt.html(val);
    }
  },
  mounted() {
    this.seteditor();
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);

      // 关闭粘贴样式的过滤
      this.editor.customConfig.pasteFilterStyle = true;
      // 忽略粘贴内容中的图片
      this.editor.customConfig.pasteIgnoreImg = true;

      this.editor.customConfig.uploadImgShowBase64 = false; // base 64 存储图片
      this.editor.customConfig.uploadImgServer = this.uploadFileParamsUrl; // 配置服务器端地址
      this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
      this.editor.customConfig.uploadFileName = "file"; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 1; // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 5 * 1000; // 设置超时时间
      // 配置菜单
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "video", // 插入视频
        "code", // 插入代码
        "undo", // 撤销
        "redo" // 重复
      ];
      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
          this.$message.error("图片上传错误");
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
          this.$message.error("图片上传错误");
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
          this.$message.error("图片上传错误");
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
          let url = this.baseImgUrl + result.data.path;

          console.log(url);
          setTimeout(() => {
            insertImg(url);
          });
        }
      };
      this.editor.customConfig.customAlert = function(info) {
        // info 是需要提示的内容
        console.log("customAlert：" + info);
      };
      /*this.editor.customConfig.customUploadImg = function (files, insert) {
          // files 是 input 中选中的文件列表
          // insert 是获取图片 url 后，插入到编辑器的方法

          // 上传代码返回结果之后，将图片插入到编辑器中
          // insert(imgUrl)
        }*/
      this.editor.customConfig.onchange = content => {
        if (content == "" && !content) return "";
        let str = content;

        let reg = new RegExp("<!--(.*?)-->", "g");
        str = str.replace(reg, "");

        str = str.replace(/<\/?SPANYES[^>]*>/gi, ""); //  Remove  all  SPAN  tags
        str = str.replace(/<xml>[\s\S]*?<\/xml>/gi, "");
        str = str.replace(/<style>[\s\S]*?<\/style>/gi, "");

        // str = str.replace(/<(\w[^>]*)  class=([^|>]*)([^>]*)/gi, "<$1$3");  //  Remove  Class  attributes
        // str = str.replace(/<(\w[^>]*)  style="([^"]*)"([^>]*)/gi, "<$1$3");  //  Remove  Style  attributes
        str = str.replace(/<(\w[^>]*)  lang=([^|>]*)([^>]*)/gi, "<$1$3"); //  Remove  Lang  attributes
        //str = str.replace(/<\\?\?xml[^>]*>/gi, "");//  Remove  XML  elements  and  declarations
        str = str.replace(/<\/?\w+:[^>]*>/gi, ""); //  Remove  Tags  with  XML  namespace  declarations:  <o:p></o:p>
        //str = str.replace(/&nbsp;/, "");//  Replace  the  &nbsp;
        str = str.replace(/\n(\n)*( )*(\n)*\n/gi, "\n");

        this.info_ = str;
        // console.log('1****', this.info_);
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
    }
  },
  beforeDestroy() {
    this.editor.txt.clear();
    this.editor.txt.html("");
    this.editor = null;
    this.info_ = null;
  }
};
</script>

<style lang="scss">
  .w-e-text-container{
    z-index: 1000!important;
  }
.editor {
  width: 100%;
  margin: 0 auto;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  height: 500px;
}
</style>
