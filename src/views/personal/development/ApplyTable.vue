<template>
  <div class="page page-personal page-apply-table">
    <div class="page-body">
      <JTable
        ref="jtableRef"
        class="jtable"
        type="remote"
        headerCellClassName="headerCellClassName"
        url="/asset-supplier/supplier-info-show"
        pageIndexKey="pageNum"
        :query="true"
        :columns="columns"
        :form-options="formOptions"
      ></JTable>
    </div>

    <!-- 操作记录弹框 -->
    <DialogWrap
      v-dialogDrag
      :dialogCfg="recordDialogCfg"
      @handleConfrim="DiHandleConfrim"
      @handleCencel="DiHandleCencel"
      @openCallback="DiOpenCallback"
      @closeCallback="DicloseCallback"
    >
      <div class="style_show">
        <div class="class_write">白色透明</div>
        <div class="class_black">黑色透明</div>
        <div class="class_triangle_t"></div>
        <div class="class_triangle_b"></div>
        <div class="class_triangle_l"></div>
        <div class="class_triangle_r"></div>
        <div class="class_animate">平移</div>
      </div>
    </DialogWrap>

    <!-- 修改/新建抽屉 -->
    <DrawerWrap
      :drawerCfg="editDrawerCfg"
      @openCallback="DrOpenCallback"
      @handleConfirm="DrHandleConfirm"
      @handleCancel="DrHandleCancel"
      @beforeClose="DrBeforeClose"
      @closeCallback="DrCloseCallback"
    >
      <jForm
        ref="jFormRef"
        v-model="drawerFormData"
        :rules="drawerRules"
        :formOption="drawerContent"
        :itemStyle="{
          width: '45%'
        }"
        :inline="true"
        labelWidth="100"
        labelPosition="top"
      />
    </DrawerWrap>
  </div>
</template>

<script>
export default {
  name: 'ApplyTable',
  components: {},
  data() {
    const stockRatio = (r, val, cb) => {
      const reg = /^([0-9]*\d*\.?\d{1,2})$/;
      if (!val || (reg.test(val) && val <= 100)) {
        cb();
      } else {
        cb(new Error('请输入0~100范围且最多保留两位小数的数字'));
      }
    };
    const httpValidator = (r, val, cb) => {
      const domain = /^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/;
      const ip = /((25[0-5])|bai(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}/;
      if (!val || domain.test(val) || ip.test(val)) {
        cb();
      } else {
        cb(new Error('请输入有效IP/域名'));
      }
    };
    return {
      // jtable表格相关参数
      columns: [
        {
          prop: 'businessId',
          label: '供应商ID',
          align: 'center',
          minWidth: 100,
          showOverflowTooltip: true,
          headerAlign: 'center',
        },
        {
          prop: 'supplierAbbr',
          label: '供应商简称',
          headerAlign: 'center',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
        },
        {
          prop: 'companyName',
          label: '供应商全称',
          headerAlign: 'center',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          showOverflowTooltip: true,
          html: true,
          minWidth: 100,
          render(row) {
            return row.status
              ? '<span class="icon-status"><i class="iconfont icon-gongkai"></i>公开</span>'
              : '<span class="icon-status"><i class="iconfont icon-yincang"></i>隐藏</span>';
          },
        },
        {
          prop: 'createdTime',
          label: '首次同步时间',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 150,
        },
        {
          prop: 'modifiedTime',
          label: '最后更新时间',
          align: 'center',
          showOverflowTooltip: true,
          headerAlign: 'center',
          minWidth: 150,
        },
        {
          label: '操作',
          prop: '',
          width: 250,
          align: 'center',
          fixed: 'right',
          cmds: [
            {
              type: 'text',
              label: '修改',
              cmd: this.handleAddOrEdit,
            },
            {
              type: 'text',
              label: '成员管理',
              cmd: this.handleMember,
            },
            {
              type: 'text',
              label: '数据查询',
              cmd: this.handleSearch,
            },
            {
              type: 'text',
              label: '操作记录',
              cmd: this.handleRecord,
            },
          ],
        },
      ],
      formOptions: {
        submitBtnText: '查询',
        addBtnText: '新建应用表',
        addHandler: this.handleAdd,
        forms: [
          {
            prop: 'categoryId',
            label: '',
            placeholder: '级联（直接请求）',
            itemWidth: 200,
            itemType: 'cascader',
            props: { multiple: true, expandTrigger: 'hover' },
            onchange: false,
          },
          {
            prop: 'categoryId',
            label: '',
            placeholder: '存储类型',
            itemWidth: 200,
            itemType: 'select',
            options: [
              { value: 0, label: 'MySQL' },
              { value: 1, label: 'Hbase' },
              { value: 2, label: 'MySQL分库分表' },
              { value: 3, label: 'ES' },
            ],
          },
          {
            prop: 'likeKey',
            label: '',
            placeholder: '表中文名/表英文名/描述/创建人/负责人',
            itemWidth: 300,
            autofocus: true,
            prefixIcon: 'el-icon-search',
          },
        ],
      },

      // 操作记录弹框相关
      recordDialogCfg: {
        title: '操作记录',
        visible: false,
        loading: false,
      },
      dialogFormData: {
        file: '',
      },
      dialogRules: {},

      // 修改抽屉相关参数
      editDrawerCfg: {
        title: '修改/新建抽屉',
        visible: false,
        loading: false,
      },
      drawerFormData: {
        companyName: '',
        business: '',
        dataManagerConditions: '',
        stockRatio: '',
        url: '',
        status: '',
        companyDesc: '',
      },
      drawerRules: {
        companyName: [
          { required: true, message: '公司名称不可为空', trigger: 'blur' },
        ],
        business: [
          { required: true, message: '经营业务不可为空', trigger: 'blur' },
        ],
        stockRatio: [
          { required: false, validator: stockRatio, trigger: 'change' },
        ],
        tag: [{ required: true, message: '业务标签不可为空', trigger: 'blur' }],
        url: [{ required: false, validator: httpValidator, trigger: 'change' }],
        companyDesc: [
          { required: true, message: '公司简介不可为空', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    dialogContent() {
      return [
        {
          itemType: 'upload',
          url:
            process.env.NODE_ENV === 'prod'
              ? '/galaxy-data-asset/data-asset/asset-company/import_asset_company_Excel'
              : '/api/data-asset/asset-company/import_asset_company_Excel',
          prop: 'file',
          label: '文件导入：',
          ref: 'componyUploadRef',
          accept: '.xlsx,.xls',
          addDesc: '只支持excel文件，且不可超过50M',
          paramsName: 'multipartFile',
          isShowFileList: true,
          autoUpload: false,
          style: { width: '100%' },
          handleRemove: this.handleRemove,
          uploadSuccess: this.uploadSuccess,
          uploadErr: this.uploadErr,
          change: this.uploadChange,
        },
      ];
    },
    drawerContent() {
      return [
        {
          prop: 'companyName',
          label: '公司名称:',
          placeholder: '请输入公司名称',
          maxlength: 200,
          helpMsg: '只能包含英文字母、数字和下划线，且英文字母或下划线开头',
        },
        {
          prop: 'business',
          label: '经营业务:',
          placeholder: '请输入经营业务',
          maxlength: 200,
        },
        {
          prop: 'dataManagerConditions',
          label: '数据管控状况:',
          placeholder: '请输入数据管控状况',
          maxlength: 200,
        },
        {
          prop: 'stockRatio',
          label: '控股情况(%):',
          placeholder: '请输入控股情况',
        },
        {
          prop: 'url',
          label: '公司网址:',
          placeholder: 'http://www.jd.com',
        },
        {
          prop: 'status',
          label: '状态:',
          itemType: 'select',
          placeholder: '请选择状态',
          options: [
            { value: 1, label: '公开' },
            { value: 0, label: '隐藏' },
          ],
        },
        {
          itemType: 'upload',
          url:
            process.env.NODE_ENV === 'prod'
              ? '/galaxy-data-asset/asset-file/uploadIcon'
              : '/api/asset-file/uploadIcon',
          prop: 'file',
          label: '文件上传:',
          accept: '.png,.jpg,.bmp',
          paramsName: 'multipartFile',
          addDesc: '只支持png/jpg/bmp, 最大1M的图片, 分辨率200*100',
          isShowFileList: true,
          // style: { width: '100%' },
          // handleRemove: this.handleRemove,
          // uploadSuccess: this.uploadSuccess,
          // uploadErr: this.uploadErr,
        },
        {
          itemType: 'textarea',
          prop: 'companyDesc',
          label: '公司简介:',
          placeholder: '请输入公司简介',
          style: { width: '100%' },
        },
      ];
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {},

    // 点击修改/新建
    handleAddOrEdit(row) {
      this.editDrawerCfg = {
        title: row ? '修改' : '新建',
        visible: true,
        loading: false,
      };
    },

    // 修改新建抽屉开启
    DrOpenCallback() {},

    // 修改新建抽屉提交
    DrHandleConfirm() {
      this.$refs.jFormRef.submit(async () => {
        await this.$confirm('您确认提交当前内容吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        this.editDrawerCfg.visible = true;
        this.editDrawerCfg.loading = true;
        setTimeout(() => {
          this.editDrawerCfg.visible = false;
          this.editDrawerCfg.loading = false;
          this.$message.success('提交成功');
        }, 1000);
      });
    },

    // 修改新建抽屉取消
    DrHandleCancel() {
      this.editDrawerCfg.visible = false;
    },

    // 修改新建抽屉关闭之前
    DrBeforeClose() {},

    // 修改新建抽屉关闭
    DrCloseCallback() {},

    // 点击操作记录
    handleRecord() {
      this.recordDialogCfg.visible = true;
    },
    // 记录弹窗开启
    DiOpenCallback() {},

    // 记录弹窗确认
    DiHandleConfrim() {
      this.recordDialogCfg = {
        title: '操作记录',
        visible: true,
        loading: true,
      };
      setTimeout(() => {
        this.recordDialogCfg = {
          title: '操作记录',
          visible: false,
          loading: false,
        };
      }, 1000);
    },

    // 记录弹窗取消
    DiHandleCencel() {
      this.recordDialogCfg.visible = false;
    },

    // 记录弹窗关闭
    DicloseCallback() {},
  },
};
</script>

<style lang="scss" scoped>
.jtable {
  padding: 10px;
  background-color: #fff;
}

.style_show {
  div {
    margin: 10px;
  }
  .class_write {
    color: _white(0.8);
    background-color: #000;
  }
  .class_black {
    color: _black(0.5);
    @include boxshadow(10px, 10px, 10px, red);
  }
  .class_triangle_t {
    transform: translate(20px);
    @include regulaTriangle(top, red, 10px);
  }
  .class_triangle_b {
    transform: translate(40px);
    @include regulaTriangle(bottom, green, 15px);
  }
  .class_triangle_l {
    @include regulaTriangle(left, #ff0, 20px);
  }
  .class_triangle_r {
    @include regulaTriangle(right, #f0f, 25px);
  }
  .class_animate {
    animation: move 5s infinite alternate;
  }
}

@include keyframes(move) {
   0% {
       transform: translate(0);
   }
   100% {
       transform: translateX(200px);
   }
}
</style>
<style lang="scss">
</style>
