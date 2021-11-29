<template>
  <div class="el-table-container">
    <div>
      <el-table
        ref="etable"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="tableDataSub"
        :size="size"
        :border="border"
        :height="height"
        :max-height="maxHeight"
        :stripe="stripe"
        :fit="fit"
        :show-header="showHeader"
        :highlight-current-row="highlightCurrentRow"
        :current-row-key="currentRowKey"
        :header-cell-class-name="headerCellClassName"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :row-key="rowKey"
        :empty-text="emptyText"
        :default-expand-all="defaultExpandAll"
        :expand-row-keys="expandRowKeys"
        :default-sort="defaultSort"
        :tooltip-effect="tooltipEffect"
        :show-summary="showSummary"
        :sum-text="sumText"
        :summary-method="summaryMethod"
        @sort-change="sortChange"
        @selection-change="selection => emitEventHandler('selection-change', selection)"
      >
        <el-table-column v-if="no" type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column v-if="check" type="selection" width="50"></el-table-column>
        <el-table-column
          v-for="column in columns"
          :key="column.label"
          :column-key="column.columnKey"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :minWidth="column.minWidth"
          :fixed="column.fixed"
          :render-header="column.renderHeader"
          :sortable="column.sortable"
          :sort-method="column.sortMethod"
          :resizable="column.resizable"
          :formatter="column.formatter"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :align="column.align"
          :enterable="true"
          :header-align="headerAlign || column.align"
          :class-name="column.className"
          :label-class-name="column.labelClassName"
          :selectable="column.selectable"
          :reserve-selection="column.reserveSelection"
          :filters="column.filters"
          :filter-placement="column.filterPlacement"
          :filter-multiple="column.filterMultiple"
          :filter-method="column.filterMethod"
          :filtered-value="column.filteredValue"
        >
          <template slot-scope="scope">
            <span v-if="column.type=='select'" :row="scope.row">
              <el-select
                v-model="scope.row[column.prop]"
                :placeholder="column.placeholder? column.placeholder:'请选择'"
                size="small"
                style="width:100%"
                filterable
                :no-data-text="column.noDataText?column.noDataText:'无数据'"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                :disabled="column.disabled?column.disabled:false"
                @change="column.onchange?column.onchange(scope.row):false"
                @visible-change="column.visibleChange?column.visibleChange(scope.row):false"
              >
                <el-option
                  v-for="(item,index) in column.source"
                  :key="index"
                  :value="item[column.props.value]"
                  :label="item[column.props.label]"
                ></el-option>
              </el-select>
            </span>
            <span v-else-if="column.type=='select1'" :row="scope.row">
              <el-select
                v-model="scope.row[column.prop]"
                :placeholder="column.placeholder? column.placeholder:'请选择'"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                size="small"
                style="width:100%"
                filterable
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
                @change="column.onchange?column.onchange(scope.row):false"
                @visible-change="column.visibleChange?column.visibleChange(scope.row):false"
              >
                <el-option
                  v-for="(item,index) in column.source"
                  :key="index"
                  :value="item[column.props.value]"
                  :label="item[column.props.label]"
                ></el-option>
              </el-select>
            </span>
            <span v-else-if="column.type=='select2'" :row="scope.row">
              <el-select
                v-model="scope.row[column.prop]"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                size="small"
                style="width:100%"
                filterable
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
              >
                <el-option
                  v-for="(item,index) in scope.row.options"
                  :key="`prod-${index}`"
                  :value="item[column.props.value]"
                  :label="item[column.props.label]"
                ></el-option>
              </el-select>
            </span>
            <span v-else-if="column.type=='select_remote'" :row="scope.row">
              <el-select
                v-model="scope.row[column.prop]"
                :placeholder="column.placeholder"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                size="small"
                style="width:100%"
                remote
                filterable
                clearable
                :loading="column.loading"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
                :remote-method="column.remoteMethod"
                @change="column.onchange?column.onchange(scope.row):false"
                @visible-change="activeItem($event,scope)"
              >
                <el-option
                  v-for="(item,index) in scope.row.options"
                  :key="index"
                  :value="item[column.props.value]"
                  :label="item[column.props.label]"
                ></el-option>
              </el-select>
            </span>
            <span v-else-if="column.type=='text'">
              <el-input
                v-model="scope.row[column.prop]"
                :placeholder="column.placeholder"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                style="width:100%"
                size="small"
                clearable
                :disabled="column.disabled==undefined?false:column.disabled"
                @change="column.onchange?column.onchange(scope.row):false"
                @blur="column.onblur?column.onblur($event,scope.row):false"
                @clear="column.onclear?column.onclear($event,scope.row):false"
              >
                <template
                  slot="append"
                  v-if="column.suffix&&column.showSuffixMethod && column.showSuffixMethod(scope.row)"
                >%</template>
              </el-input>
            </span>
            <span v-else-if="column.type=='text_dynamic'">
              <el-input
                v-model="scope.row[column.prop]"
                :placeholder="column.placeholder"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                size="small"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
              ></el-input>
            </span>
            <span v-else-if="column.type=='cascader'">
              <div class="block">
                <el-cascader
                  v-if="column.onchange"
                  v-model="scope.row[column.prop]"
                  :placeholder="column.placeholder"
                  expand-trigger="hover"
                  size="small"
                  clearable
                  :props="column.props"
                  :options="column.source"
                  @change="column.onchange"
                ></el-cascader>
                <el-cascader
                  v-else
                  v-model="scope.row[column.prop]"
                  :placeholder="column.placeholder"
                  expand-trigger="hover"
                  size="small"
                  clearable
                  :props="column.props"
                  :options="column.source"
                ></el-cascader>
              </div>
            </span>
            <span v-else-if="column.type=='checkbox'">
              <el-checkbox
                v-if="column.onchange"
                v-model="scope.row[column.prop]"
                size="small"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
                @change="column.onchange(scope.row)"
              ></el-checkbox>
              <el-checkbox
                v-else
                v-model="scope.row[column.prop]"
                size="small"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
              ></el-checkbox>
            </span>
            <span v-else-if="column.type=='cmd'">
              <span v-for="(cmd,index) in column.cmds" :key="index">
                <el-button
                  v-if="cmd.rel=='del'"
                  :class="cmd.class"
                  :type="cmd.type"
                  size="small"
                  :disabled="scope.row[cmd.disabled]==undefined?false:scope.row[cmd.disabled]"
                  @click="delRow(scope.row)"
                >{{cmd.label}}</el-button>
                <el-button
                  v-else-if="cmd.cmd"
                  :class="cmd.class"
                  :type="cmd.type"
                  size="small"
                  :disabled="scope.row[cmd.disabled]==undefined?false:scope.row[cmd.disabled]"
                  @click="cmd.cmd(scope.row)"
                >{{cmd.label}}</el-button>
              </span>
            </span>
            <div v-else-if="column.type=='cmd_circle'" style="text-align: center;">
              <span v-for="(cmd,index) in column.cmds" :key="index">
                <img
                  v-if="cmd.rel=='add'"
                  src="@/assets/images/common/etable/add.png"
                  :class="cmd.class"
                  style="width: 20px;height: 20px;cursor:pointer"
                  :disabled="scope.row[cmd.disabled]==undefined?false:scope.row[cmd.disabled]"
                  @click="addRow(scope.row)"
                />
                <img
                  v-if="cmd.rel=='del'&&scope.row[cmd.disabled]==undefined?true:scope.row[cmd.disabled]"
                  src="@/assets/images/common/etable/reduce.png"
                  :class="cmd.class"
                  style="width: 20px;height: 20px;cursor:pointer;margin-left: 10px;"
                  @click="delRow(scope.row)"
                />
              </span>
            </div>
            <!--yangjing235 add at 2020-01-14 新增/删除事件调用cmd配置的事件-->
            <div v-else-if="column.type=='cmd_circle_cmdEvent'" style="text-align: center;">
              <span v-for="(cmd,index) in column.cmds" :key="index">
                <img
                  v-if="cmd.rel=='add'"
                  src="@/assets/images/common/etable/add.png"
                  :class="cmd.class"
                  style="width: 20px;height: 20px;cursor:pointer"
                  :disabled="scope.row[cmd.disabled]==undefined?false:scope.row[cmd.disabled]"
                  @click="cmd.cmd(scope.row)"
                />
                <img
                  v-if="cmd.rel=='del'&&scope.row[cmd.disabled]==undefined?true:scope.row[cmd.disabled]"
                  src="@/assets/images/common/etable/reduce.png"
                  :class="cmd.class"
                  style="width: 20px;height: 20px;cursor:pointer;margin-left: 10px;"
                  @click="cmd.cmd(scope.row)"
                />
              </span>
            </div>
            <span
              v-else
            >{{ column.prop==='table$index'?(scope.$index+1):(column.render ? column.render(scope.row) :scope.row[column.prop])}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "JEdittable",
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
    no: {
      type: Boolean,
      default: false,
    },
    check: {
      type: Boolean,
      default: false,
    },
    showAddButton: {
      type: Boolean,
      default: true,
    },
    buttonText: {
      type: String,
      default: "+条件设置",
    },
    showImportButton: {
      type: Boolean,
      default: false,
    },
    importButtonText: {
      type: String,
      default: "导入数据",
    },
    editMode: {
      type: Boolean,
      default: true,
    },
    // Element UI Table attributes
    height: [String, Number],
    maxHeight: [String, Number],
    stripe: { type: Boolean, default: true },
    border: { type: Boolean, default: true },
    fromAddTable: { type: Boolean, default: true },
    fit: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    headerAlign: {
      type: String,
      default: "center",
    },
    size: {
      type: String,
      default: "small",
    },
    highlightCurrentRow: Boolean,
    headerCellClassName: [String, Function],
    currentRowKey: [String, Number],
    rowClassName: [String, Function],
    rowStyle: [String, Function],
    rowKey: [String, Function],
    emptyText: String,
    defaultExpandAll: Boolean,
    expandRowKeys: Array,
    defaultSort: Object,
    tooltipEffect: String,
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function,
    // 分页部分
    pageSizes: {
      type: Array,
      default: () => {
        return [5, 10, 15, 20, 50, 100];
      },
    },
    isPagination: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultRow: { id: -1, delStatus: 0, insert: 1 },
    };
  },
  computed: {
    tableDataSub: function () {
      this.$emit("refreshTableDatas", this.tableData);
      return this.tableData.where(0, "delStatus");
    },
  },
  watch: {
    columns: function (value) {
      this.refreshColumns(value);
    },
  },
  mounted() {
    if (
      this.tableData.length > 0 &&
      this.defaultSort &&
      this.defaultSort.prop
    ) {
      this.sortChange(this.defaultSort);
    }
    if (this.columns && this.columns.length > 0) {
      this.refreshColumns(this.columns);
    }
  },
  methods: {
    activeItem(event, scope) {
      if (event) {
        this.$emit("activeIndex", scope.$index);
      }
    },
    refreshColumns(value) {
      this.columns = value;
      var row = { id: -1, delStatus: 0, insert: 1 };
      this.columns.forEach((column) => {
        if (column.type === "select" || column.type === "select_dynamic") {
          if (column.source.length > 0) {
            row[column.prop] = column.source[0][column.props.value];
          } else {
            row[column.prop] = "";
          }
        } else if (column.type === "cascader") {
          row[column.prop] = [];
        } else {
          if (column.prop && column.prop !== "") {
            row[column.prop] = "";
          }
        }
      });
      this.defaultRow = row;
      if (!this.editMode && this.tableData.length === 0) {
        var rowCopy = Object.assign({}, row);
        this.tableData.push(rowCopy);
      }
    },
    sortChange(sortOption) {
      var prop = sortOption.prop;
      var order =
        sortOption.order === "descending" ? "descending" : "ascending";
      if (this.tableData.length > 0 && prop && prop !== "") {
        this.tableData = this.tableData
          .slice()
          .sort(this.compareFunction(prop, order));
      }
    },
    compareFunction(propertyName, order) {
      return function (obj1, obj2) {
        var val1 = obj1[propertyName];
        var val2 = obj2[propertyName];
        if (order === "ascending") {
          return val1.localeCompare(val2, "zh") > 0 ? 1 : -1;
        } else if (order === "descending") {
          return val1.localeCompare(val2, "zh") > 0 ? -1 : 1;
        } else {
          return 0;
        }
      };
    },
    //table emit事件
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1));
    },
    // class报错
    validate1: function (val, rule, rowData) {
      var antiSQLInjReg2 = /^(select|update|create|alter|delete|truncate|join|union|exec|insert|drop|count|'|"|;|>|<|%|--)$/;
      if (antiSQLInjReg2.test(val)) {
        this.$message.error(
          "名称中不能只包含(select|update|create|alter|delete|truncate|join|union|exec|insert|drop|count|'|\"|;|>|<|%|--)"
        );
        return false;
      }
      // 如果没有rule,则不用校验，直接返回
      if (!rule) {
        return true;
      }
      var flag = true;
      var _this = this;
      flag = flag && !(rule && rule.notEmpty && _this.empty(val));
      if (!_this.empty(val)) {
        switch (rule.dataType) {
          case "int":
            flag = flag && _this.int(val);
            break;
          case "email":
            flag = flag && _this.email(val);
            break;
        }
        if (rule.pattern) {
          flag = flag && rule.pattern.test(val);
        }
      }
      if (flag) {
        if (rule.callback) {
          flag = rule.callback(val, rowData);
        }
      }
      return flag;
    },
    addRow() {
      var rowCopy = Object.assign({}, this.defaultRow);
      this.tableData.push(rowCopy);
      this.$emit("addRowData", rowCopy);
    },
    delRow: function (row) {
      if (
        (row.delStatus === 0 ||
          row.delStatus === "0" ||
          row.delStatus === "") &&
        row.id !== -1
      ) {
        row.delStatus = 1;
      } else {
        this.tableData.splice(row.srcIndex, 1);
      }
      if (this.tableData.length === 0) {
        this.tableData.push(this.defaultRow);
      }
    },
    // 以下为具体校验函数
    empty: function (v) {
      return !v === undefined || v === "" || v == null;
    },
    email: function (str) {
      if (str.length === 0) {
        return true;
      }
      var myRegExp = /[a-z0-9-.]{1,30}@[a-z0-9-]{1,65}.(com|net|org|info|biz|([a-z]{2,3}.[a-z]{2}))/;
      return myRegExp.test(str);
    },
    int: function (str) {
      if (str.length === 0) {
        return true;
      }
      var pattern = /^0$|^[1-9]\d*$/; // 匹配非负整数
      return pattern.test(str);
    },
  },
};
</script>

<style scoped>
</style>
