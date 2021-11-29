<template>
  <el-form
    ref="form"
    size="small"
    :inline="inline"
    :class="inline?'':'search-box'"
    :model="params"
    :label-width="labelWidth ? (labelWidth + 'px') : ''"
    @submit.native.prevent="searchHandler()"
  >
    <el-form-item
      v-for="(form, index) in forms"
      :key="index"
      :class="inline?'':'search-box-item'"
      :prop="form.itemType != 'daterange' ? form.prop : (datePrefix + index)"
      :label="form.label"
      :rules="form.rules || []"
      :label-width="form.labelWidth ? (form.labelWidth + 'px') : ''"
    >
      <el-input
        v-if="form.itemType === 'input' || form.itemType === undefined"
        v-model="params[form.modelValue]"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :size="form.size ? form.size : size"
        :readonly="form.readonly"
        :disabled="form.disabled"
        :autofocus="form.autofocus"
        :suffix-icon="form.suffixIcon"
        :prefix-icon="form.prefixIcon"
        :clearable="form.clearable"
        @keyup.enter.native="searchHandler"
      />
      <el-autocomplete
        v-if="form.itemType === 'autocomplete'"
        v-model="params[form.modelValue]"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :autofocus="form.autofocus"
        :suffix-icon="form.suffixIcon"
        :prefix-icon="form.prefixIcon"
        :trigger-on-focus="form.triggerOnFocus"
        :fetch-suggestions="form.querySearch"
        @select="item=>handleSelect(item,form.prop)"
        @keyup.enter.native="searchHandler"
      ></el-autocomplete>
      <el-select
        v-else-if="form.itemType === 'select'"
        v-model="params[form.modelValue]"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :size="form.size ? form.size : size"
        filterable
        :disabled="form.disabled"
        :clearable="form.clearable === false ? false : true"
      >
        <el-option
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex + '_local'"
          :value="(typeof option === 'object') ? option[form.valueKey || 'value'] : option"
          :label="(typeof option === 'object') ? option[form.labelKey || 'label'] : option"
        />
        <el-option
          v-for="(op, opIndex) in selectOptions[selectOptionPrefix + index]"
          :key="opIndex + '_remote'"
          :value="(typeof op === 'object') ? op[form.valueKey || 'value'] : op"
          :label="(typeof op === 'object') ? op[form.labelKey || 'label'] : op"
        />
      </el-select>
      <el-select
        v-else-if="form.itemType === 'select2-1'"
        v-model="params[form.modelValue]"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :size="form.size ? form.size : size"
        :disabled="form.disabled"
        filterable
        clearable
        @visible-change="visibleChangeSub($event,form.visibleChange)"
        @change="form.selChangeVal"
        @clear="ClearSub(form.onClear)"
      >
        <el-option
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex + '_local'"
          :value="(typeof option === 'object') ? option[form.valueKey || 'value'] : option"
          :label="(typeof option === 'object') ? option[form.labelKey || 'label'] : option"
        />
      </el-select>
      <el-select
        v-else-if="form.itemType === 'select2-2'"
        v-model="params[form.modelValue]"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :size="form.size ? form.size : size"
        :disabled="form.disabled"
        filterable
        clearable
      >
        <el-option
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex + '_local'"
          :value="(typeof option === 'object') ? option[form.valueKey || 'value'] : option"
          :label="(typeof option === 'object') ? option[form.labelKey || 'label'] : option"
        />
      </el-select>
      <el-cascader
        v-else-if="form.itemType=='cascader'"
        v-model="params[form.modelValue]"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :props="form.props"
        :options="selectOptions[cascaderPrefix + index]"
        clearable
        @change="form.onchange"
      ></el-cascader>
      <el-checkbox
        v-if="form.itemType === 'checkbox'"
        v-model="params[form.modelValue]"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :disabled="form.disabled"
        :checked="form.checked"
        :suffix-icon="form.suffixIcon"
        :prefix-icon="form.prefixIcon"
        @change="searchHandler"
      >{{form.placeholder}}</el-checkbox>
      <el-radio-group
        v-else-if="form.itemType === 'radio'"
        v-model="params[form.modelValue]"
        :disabled="form.disabled"
        @change="searchHandler"
      >
        <el-radio
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex"
          :label="option.value"
        >{{option.label}}</el-radio>
      </el-radio-group>
      <el-radio-group
        v-else-if="form.itemType === 'radio-button'"
        v-model="params[form.modelValue]"
        :disabled="form.disabled"
        @change="searchHandler"
      >
        <el-radio-button
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex"
          :label="option.value"
        >{{option.label}}</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-else-if="form.itemType === 'date'"
        v-model="params[form.modelValue]"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        :size="form.size ? form.size : size"
        :disabled="form.disabled"
        :readonly="form.readonly"
        :editable="form.editable"
        :picker-options="form.pickerOptions || {}"
      />
      <el-date-picker
        v-else-if="form.itemType === 'daterange'"
        v-model="params[form.modelValue]"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :size="form.size ? form.size : size"
        :disabled="form.disabled"
        :readonly="form.readonly"
        :editable="form.editable"
        :picker-options="form.pickerOptions || {}"
        @change="date => changeDate(date, form.prop[0], form.prop[1])"
      />
      <el-date-picker
        v-else-if="form.itemType === 'datetimerange'"
        v-model="params[form.modelValue]"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        type="datetimerange"
        end-placeholder="结束时间"
        start-placeholder="开始时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        :size="form.size ? form.size : size"
        :disabled="form.disabled"
        :readonly="form.readonly"
        :editable="form.editable"
        :picker-options="form.pickerOptions || {}"
      />
    </el-form-item>
    <el-form-item label v-if="inline">
      <el-button
        type="primary"
        :size="size"
        :loading="submitLoading"
        @click="searchHandler"
      >{{ submitBtnText }}</el-button>
      <el-button
        v-if="showResetBtn"
        type="primary"
        :plain="true"
        :size="size"
        :loading="submitLoading"
        @click="resetForm"
      >{{ resetBtnText }}</el-button>
    </el-form-item>
    <el-form-item label :class="{'btn-add':addBtnText}">
      <el-button v-if="addHandler" type="primary" :size="size" @click="addHandler">{{addBtnText}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'JSearch',
  props: {
    forms: {
      type: Array,
      required: true,
    },
    inline: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'small',
    },
    labelWidth: Number,
    itemWidth: Number,
    beforeSearch: Function,
    submitLoading: {
      type: Boolean,
      default: false,
    },
    submitHandler: Function,
    submitBtnText: {
      type: String,
      default: '查询',
    },
    showResetBtn: {
      type: Boolean,
      default: false,
    },
    resetBtnText: {
      type: String,
      default: '重置',
    },
    addBtnText: String,
    addHandler: Function,
    fuzzy: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const { forms, fuzzy } = this.$props;
    const datePrefix = 'daterange-prefix';
    const selectOptionPrefix = 'select-option-prefix';
    const cascaderPrefix = 'cascader-prefix';
    const dataObj = {
      selectOptions: {},
    };
    const params = {};
    const format = {};
    const fuzzyOps = {};
    forms.forEach((v, i) => {
      const propType = typeof v.prop;
      if (propType === 'string') {
        v.modelValue = v.prop;
        params[v.prop] = '';
        fuzzyOps[v.prop] = v.fuzzy ? v.fuzzy : fuzzy;
        if (v.format) {
          format[v.prop] = v.format;
        }
        if (v.defaultValue !== undefined) {
          params[v.prop] = v.defaultValue;
        }
      } else if (
        propType === 'object'
        && Object.prototype.toString.call(v.prop) === '[object Array]'
      ) {
        v.prop.forEach((vv) => {
          params[vv] = '';
          if (v.format) {
            format[vv] = v.format;
          }
          fuzzyOps[vv] = v.fuzzy ? v.fuzzy : fuzzy;
        });
      }
      if (v.itemType === 'daterange') {
        params[datePrefix + i] = '';
        v.modelValue = datePrefix + i;
      }
      if (v.itemType === 'datetimerange') {
        if (v.defaultValue !== undefined) {
          params[v.prop] = v.defaultValue;
        } else {
          params[v.prop] = [
            this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            this.$moment().format('YYYY-MM-DD HH:mm:ss'),
          ];
        }
      }
      if (v.itemType === 'select' && (v.selectFetch || v.selectUrl)) {
        const dataKey = selectOptionPrefix + i;
        dataObj.selectOptions[dataKey] = [];
        this.getRemoteData(
          v.selectUrl,
          v.selectParams,
          v.selectResultField,
          v.selectResultHandler,
          dataKey,
        );
      }
      if (v.itemType === 'cascader' && (v.selectFetch || v.selectUrl)) {
        params[v.prop] = [];
        const dataKey = cascaderPrefix + i;
        dataObj.selectOptions[dataKey] = [];
        this.getRemoteData(
          v.selectUrl,
          v.selectParams,
          v.selectResultField,
          v.selectResultHandler,
          dataKey,
        );
      }
    });
    return {
      params,
      datePrefix,
      selectOptionPrefix,
      cascaderPrefix,
      ...dataObj,
      format,
      fuzzyOps,
    };
  },
  computed: {
    itemStyle() {
      const { itemWidth } = this;
      if (itemWidth) {
        return `width: ${itemWidth}px;`;
      }
      return '';
    },
  },
  methods: {
    searchHandler() {
      if (this.beforeSearch) {
        this.beforeSearch();
      }
      this.getParams((error, params) => {
        if (!error) {
          const { submitHandler } = this;
          if (submitHandler) {
            submitHandler(params);
          } else {
            throw new Error('Need to set attribute: submitHandler !');
          }
        }
      });
    },
    visibleChangeSub(event, visibleChange) {
      if (event) {
        visibleChange();
      }
    },
    ClearSub(onClear) {
      const _this = this;
      _this.forms.forEach((v) => {
        if (v.itemType === 'select2-2') {
          _this.params[v.prop] = '';
        }
      });
      onClear();
    },
    selChange() {
      const _this = this;
      _this.forms.forEach((v) => {
        if (v.itemType === 'select2-2') {
          _this.params[v.prop] = '';
        }
      });
    },
    getParams(callback) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { params, datePrefix, format } = this;
          const formattedForm = {};
          Object.keys(params).forEach((v) => {
            if (v.indexOf(datePrefix) === -1) {
              formattedForm[v] = format[v]
                ? format[v](params[v], v)
                : params[v];
            }
          });
          if (callback) callback(null, formattedForm);
        } else if (callback) callback(new Error());
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    changeDate(date, startDate, endDate) {
      let dates;
      if (date === null) {
        this.params[startDate] = '';
        this.params[endDate] = '';
        return;
      }
      if (typeof date === 'string') {
        dates = date.split(' - ');
      } else if (date && date.hasOwnProperty('length')) {
        const firstDate = date[0];
        const secondDate = date[1];
        dates = [
          `${firstDate.getFullYear()}-${`0${firstDate.getMonth() + 1}`.substr(
            -2,
          )}-${`0${firstDate.getDate()}`.substr(-2)}`,
          `${secondDate.getFullYear()}-${`0${secondDate.getMonth() + 1}`.substr(
            -2,
          )}-${`0${secondDate.getDate()}`.substr(-2)}`,
        ];
      }
      this.params[startDate] = dates[0];
      this.params[endDate] = dates[1];
    },
    getRemoteData(url, param, listField, resultHandler, dataKey) {
      const _this = this;
      this.$api.post(url, param, null).then(
        (res) => {
          let result = res;
          if (res && !(res instanceof Array)) {
            if (listField && listField.indexOf('.') > 0) {
              listField.split('.').forEach((vv) => {
                result = result[vv];
              });
            } else {
              result = res[listField];
            }
          }
          if (!result || !(result instanceof Array)) {
            console.warn(
              `The result of key:${listField} is not Array. 接口返回的字段:${listField} 不是一个数组`,
            );
          }
          _this.selectOptions[dataKey] = result;
        },
        (error) => {
          console.log(error);
        },
      );
    },
    handleSelect(item, prop) {
      this.params[prop] = item;
    },
  },
};
</script>

<style scoped>
.el-form {
  position: relative;
}
.btn-add {
  position: absolute;
  right: -10px;
}
</style>
