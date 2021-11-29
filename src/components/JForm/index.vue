<template>
  <el-form
    ref="jformRef"
    :class="['form-container-css', {'inline-form': inline}, {'not-top-label-form': labelPosition !== 'top' && inline}, {'form-flex-box': labelPosition === 'top'}, {'none-border-form': itemBorder}]"
    :model="formData"
    :inline="inline"
    :size="size"
    :rules="rules"
    :label-width="labelWidth ? (labelWidth + 'px') : '100px'"
    :label-position="labelPosition"
    :disabled="disabled"
    @submit.native.prevent="submit()"
  >
    <el-form-item
      v-for="(form) in formOption"
      :key="form.prop"
      :prop="form.prop"
      :label="form.label"
      :style="(form.style || itemStyle) || {}"
      :label-width="form.labelWidth ? (form.labelWidth + 'px') : labelWidth + 'px'"
    >
      <el-input
        v-if="form.itemType === 'input' || form.itemType === undefined"
        v-model.trim="formData[form.prop]"
        :size="form.size ? form.size : size"
        :readonly="form.readonly"
        :disabled="!!form.disabled"
        :placeholder="form.placeholder || '请输入'"
        :autofocus="form.autofocus"
        :suffix-icon="form.suffixIcon"
        :prefix-icon="form.prefixIcon"
        :show-password="!!form.showPassword"
        :show-word-limit="(() => form.showWordLimit === undefined ? true:form.showWordLimit)()"
        :clearable="!!form.clearable || clearable"
        :maxlength="form.maxlength || null"
        @change="(val) => form.change ? form.change(val) : false"
      />
      <el-input
        v-if="form.itemType === 'input-number'"
        v-model.trim.number="formData[form.prop]"
        :size="form.size ? form.size : size"
        :readonly="form.readonly"
        :disabled="!!form.disabled"
        :placeholder="form.placeholder || '请输入'"
        :autofocus="form.autofocus"
        :suffix-icon="form.suffixIcon"
        :prefix-icon="form.prefixIcon"
        :clearable="!!form.clearable || clearable"
        :maxlength="form.maxlength || false"
        @change="(val) => form.change ? form.change(val) : false"
      />
      <el-checkbox
        v-if="form.itemType === 'checkbox'"
        v-model="formData[form.prop]"
        :checked="form.checked"
        :disabled="!!form.disabled"
        @change="(val) => form.change ? form.change(val) : false"
      >{{form.label}}</el-checkbox>
      <el-checkbox-group
        v-if="form.itemType === 'checkbox-button'"
        v-model="formData[form.prop]"
        size="small"
      >
        <el-checkbox-button
          v-for="btn in form.btns"
          :label="btn.value"
          :key="btn.value"
        >{{btn.label}}</el-checkbox-button>
      </el-checkbox-group>
      <el-select
        v-else-if="form.itemType === 'select'"
        v-model="formData[form.prop]"
        :size="form.size ? form.size : size"
        :disabled="!!form.disabled"
        :placeholder="form.placeholder"
        :clearable="form.clearable"
        :filterable="!!form.filterable"
        :remote="form.remote"
        :multiple="form.multiple"
        :remote-method="form.remoteMethod || null"
        @change="(val) => form.change ? form.change(val) : false"
      >
        <el-option
          v-for="(option) in form.options"
          :key="option.label"
          :value="option[form.valueKey || 'value']"
          :label="option[form.labelKey || 'label']"
        />
      </el-select>
      <el-radio-group
        v-else-if="form.itemType === 'radio'"
        v-model="formData[form.prop]"
        :disabled="!!form.disabled"
        @change="(val) => form.change ? form.change(val) : false"
      >
        <el-radio
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex"
          :label="option.value"
        >{{option.label}}</el-radio>
      </el-radio-group>
      <el-radio-group
        v-else-if="form.itemType === 'radio-button'"
        v-model="formData[form.prop]"
        :disabled="form.disabled"
        @change="(val) => form.change ? form.change(val) : false"
      >
        <el-radio-button
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex"
          :label="option.value"
        >{{option.label}}</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-else-if="form.itemType === 'date'"
        v-model="formData[form.prop]"
        :type="form.itemType"
        :placeholder="form.placeholder"
        :size="form.size ? form.size : size"
        :disabled="form.disabled"
        :clearable="!!form.clearable || clearable"
        :readonly="form.readonly"
        :editable="form.editable"
        :picker-options="form.pickerOptions || {}"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="(val) => form.change ? form.change(val) : false"
      />
      <el-date-picker
        v-else-if="form.itemType === 'daterange'"
        v-model="formData[form.prop]"
        :size="form.size ? form.size : size"
        :disabled="form.disabled"
        :readonly="form.readonly"
        :editable="form.editable"
        :clearable="!!form.clearable || clearable"
        :placeholder="form.placeholder"
        :picker-options="form.pickerOptions || {}"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="(val) => form.change ? form.change(val) : false"
      />
      <el-date-picker
        v-else-if="form.itemType === 'datetimerange'"
        v-model="formData[form.prop]"
        :size="form.size ? form.size : size"
        :disabled="form.disabled"
        :readonly="form.readonly"
        :clearable="!!form.clearable || clearable"
        :editable="form.editable"
        :placeholder="form.placeholder || ''"
        :picker-options="form.pickerOptions || {}"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="(val) => form.change ? form.change(val) : false"
      />
      <el-cascader
        v-else-if="form.itemType=='cascader'"
        v-model="formData[form.prop]"
        :placeholder="form.placeholder"
        :props="form.props"
        :options="form.options"
        :expand-trigger="form.trigger || 'click'"
        :clearable="!!form.clearable || clearable"
        @change="(val) => form.change ? form.change(val) : false"
      ></el-cascader>
      <el-cascader
        v-else-if="form.itemType=='cascader-filter'"
        v-model="formData[form.prop]"
        :placeholder="form.placeholder || ''"
        :options="form.options"
        :debounce="form.debounce || 500"
        :separator="form.separator || '/'"
        :size="form.size || size"
        :props="form.props || {}"
        :clearable="!!form.clearable || clearable"
        :disabled="form.disabled || false"
        :show-all-levels="form.showAllLevels || true "
        filterable
        @change="(val) => form.change ? form.change(val) : false"
      ></el-cascader>
      <div v-else-if="form.itemType=='upload'">
        <el-upload
          class="upload-demo"
          :ref="form.ref || '$upLoadRef'"
          :action="form.url"
          :accept="form.accept || ''"
          :limit="form.limit * 1 || 1"
          :name="form.paramsName || 'file'"
          :list-type="form.listType || 'text'"
          :on-preview="form.handlePreview || handlePreview"
          :on-remove="form.handleRemove || handleRemove"
          :before-remove="form.uploadBeforeRemove || uploadBeforeRemove"
          :before-upload="form.uploadBeforeUpload || uploadBeforeUpload"
          :on-success="(res, file, fileList) =>{form.uploadSuccess(res, form.prop, file, fileList) || uploadSuccess(res, form.prop, file, fileList)}"
          :on-error="(err, file, fileList) =>{form.uploadErr(err, form.prop, file, fileList) || uploadErr(err, form.prop, file, fileList)}"
          :on-change="form.change ||(() => {})"
          :file-list="formData[form.prop] || []"
          :auto-upload="form.autoUpload === false ? false : true"
          :disabled="form.disabled || false"
          :show-file-list="form.isShowFileList || false"
          :on-exceed="fileExceed"
          :wrapperClosable="form.wrapperClosable"
          :close-on-press-escape="form.escape"
        >
          <el-button slot="trigger" size="small" type="primary">
            <i class="el-icon-upload2"></i> 文件上传
          </el-button>
          <div v-if="form.addDesc" slot="tip" class="el-upload__tip">
            <span class="color-red">*</span>
            <span>{{`${form.addDesc}`}}</span>
          </div>
        </el-upload>
        <slot name="uploadSlot"></slot>
      </div>

      <el-input
        v-else-if="form.itemType=='textarea'"
        v-model="formData[form.prop]"
        :maxlength="form.maxlength || false"
        :placeholder="form.placeholder || ''"
        :clearable="form.clearable === false ? false : true"
        :disabled="form.disabled || false"
        type="textarea"
      />
      <el-tooltip
        v-if="form.helpMsg"
        :class="['form-item-helpMsg', { 'form-item-helpMsg-top-label': labelPosition === 'top' }]"
        :effect="form.theme || 'dark'"
        :content="form.helpMsg || 'top'"
        :placement="form.helpMsgPos || 'top'"
      >
        <i class="el-icon-question"></i>
      </el-tooltip>
    </el-form-item>
  </el-form>
</template>

<script>
function sizeValidator(value) {
  const methodTypes = ['large', 'small', 'mini'];
  const valid = methodTypes.indexOf(value.toLowerCase()) !== -1 || value === '';
  if (!valid) {
    throw new Error("Size must be one of ['large', 'small', 'mini']");
  }
  return valid;
}

export default {
  name: 'JForm',
  props: {
    // form绑定属性
    formData: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    // label位置
    labelPosition: {
      type: String,
      default: 'right',
    },
    // 全部item宽度百分比
    itemStyle: Object,
    // 控件大小
    size: {
      type: String,
      default: 'small',
      validator: sizeValidator,
    },
    // 表单布局
    inline: {
      type: Boolean,
      default: true,
    },
    // biao
    clearable: {
      type: Boolean,
      default: true,
    },
    itemBorder: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fuzzy: {
      type: Boolean,
      default: false,
    },
    labelWidth: [Number, String],
    formOption: {
      type: Array,
      required: true,
    },
  },
  model: {
    prop: 'formData',
    event: 'change',
  },
  data() {
    return {
      fileList: [],
    };
  },
  computed: {},
  methods: {
    handleChange() {},
    // 文件移除前钩子
    uploadBeforeRemove() {
      return true;
    },
    // 文件上传之前的钩子
    uploadBeforeUpload() {
      return true;
    },
    // 上传成功的钩子
    uploadSuccess(res, file, fileList) {
      this.$emit('uploadSuccess', res, file, fileList);
    },
    // 上传失败的钩子
    uploadErr(err, file, fileList) {
      this.$emit('uploadErr', err, file, fileList);
    },
    // 点击文件列表的钩子
    handlePreview(file) {
      this.$emit('handlePreview', file);
    },
    // 移除文件列表的钩子
    handleRemove(file, fileList) {
      this.$emit('handleRemove', file, fileList);
    },
    // 文件超出限制
    fileExceed(files, fileList) {
      // 只有limit为1的时候才会换
      if (fileList.length > 1) return;
      this.fileList = fileList.slice(-1);
    },
    isArray(value) {
      return (
        typeof value === 'object'
        && Object.prototype.toString.call(value) === '[object Array]'
      );
    },
    submit(callback) {
      this.$refs.jformRef.validate(valid => {
        if (valid) {
          callback();
          return true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.jformRef.resetFields();
      this.fileList = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.form-container-css {
  /deep/ .el-form-item {
    margin-right: 50px;
    .el-form-item__label {
      padding-bottom: 0px !important;
    }
    .el-select,
    .el-cascader {
      width: 100%;
    }
    .form-item-helpMsg {
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translate(100%, -50%);
      &.el-icon-question {
        color: #409eff;
        font-size: 20px;
        cursor: pointer;
      }
    }
    .el-textarea__inner {
      min-height: 100px !important;
    }
  }
}

.not-top-label-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    flex-wrap: nowrap;
    .el-form-item__label {
      flex-shrink: 0;
    }
    .el-form-item__content {
      flex: 1;
    }
  }
}
</style>
