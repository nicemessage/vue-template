<template>
  <div class="el-table-container">
    <JSearch
      v-if="formOptions"
      ref="searchForm"
      :forms="formOptions.forms"
      :size="formOptions.size"
      :fuzzy="formOptions.fuzzy"
      :inline="formOptions.inline"
      :label-width="formOptions.labelWidth"
      :item-width="formOptions.itemWidth"
      :submit-handler="searchHandler"
      :before-search="beforeSearch"
      :submit-loading="loading"
      :showResetBtn="formOptions.showResetBtn"
      :submitBtnText="formOptions.submitBtnText"
      :resetBtnText="formOptions.resetBtnText"
      :otherBtns="formOptions.otherBtns"
    >
    </JSearch>
    <slot name="form" :loading="loading" :search="searchHandler" />
    <!-- statistics插槽是列表和搜索框中间工具栏 zhangziyi  20200323 -->
    <slot name="statistics"></slot>
    <el-table
      v-loading.lock="loading"
      ref="table"
      :data="tableData"
      :border="border"
      :stripe="stripe"
      :height="height"
      :max-height="maxHeight"
      :fit="fit"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :current-row-key="currentRowKey"
      :row-class-name="rowClassName"
      :row-style="rowStyle"
      :row-ket="rowKey"
      :header-cell-class-name="headerCellClassName"
      :empty-text="emptyText"
      :default-expand-all="defaultExpandAll"
      :expand-row-keys="expandRowKeys"
      :default-sort="defaultSort"
      :tooltip-effect="tooltipEffect"
      :show-summary="showSummary"
      :sum-text="sumText"
      :summary-method="summaryMethod"
      :size="size"
      @select="(selection, row) => emitEventHandler('select', selection, row)"
      @select-all="selection => emitEventHandler('select-all', selection)"
      @selection-change="selection => emitEventHandler('selection-change', selection)"
      @cell-mouse-enter="(row, column, cell, event) => emitEventHandler('cell-mouse-enter', row, column, cell, event)"
      @cell-mouse-leave="(row, column, cell, event) => emitEventHandler('cell-mouse-leave', row, column, cell, event)"
      @cell-click="(row, column, cell, event) => emitEventHandler('cell-click', row, column, cell, event)"
      @cell-dblclick="(row, column, cell, event) => emitEventHandler('cell-dblclick', row, column, cell, event)"
      @row-click="(row, event, column) => emitEventHandler('row-click', row, event, column)"
      @row-dblclick="(row, event) => emitEventHandler('row-dblclick', row, event)"
      @row-contextmenu="(row, event) => emitEventHandler('row-contextmenu', row, event)"
      @header-click="(column, event) => emitEventHandler('header-click', column, event)"
      @sort-change="sortChange"
      @filter-change="filters => emitEventHandler('filter-change', filters)"
      @current-change="(currentRow, oldCurrentRow) => emitEventHandler('current-change', currentRow, oldCurrentRow)"
      @header-dragend="(newWidth, oldWidth, column, event) => emitEventHandler('header-dragend', newWidth, oldWidth, column, event)"
      @expand-change="(row, expanded) => emitEventHandler('expand-change', row, expanded)"
    >
      <slot name="prepend" />
      <el-table-column v-if="check" type="selection" width="50" :selectable="selectable"></el-table-column>
      <el-table-column
        v-if="no"
        type="index"
        :index="indexMethod"
        width="50"
        label="序号"
        align="center"
      ></el-table-column>
      <template v-for="(column, columnIndex) in columns">
        <el-table-column
          :key="columnIndex"
          v-if="column.show==undefined || column.show"
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
          :header-align="headerAlign||column.headerAlign || column.align"
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
          <template slot-scope="scope" :scope="newSlotScope ? 'scope' : false ">
            <span v-if="column.filter">{{ Vue.filter(column['filter'])(scope.row[column.prop]) }}</span>
            <span v-else-if="column.slotName">
              <slot :name="column.slotName" :row="scope.row" :$index="scope.$index" />
            </span>
            <span v-else-if="column.cmds">
              <span class="handle-btn-box" v-for="(cmd, cmdIndex) in column.cmds" :key="cmdIndex">
                <span v-if="cmd.showConditon==undefined || cmd.showConditon(scope.row)">
                  <el-dropdown
                    @command="cmd.cmd"
                    v-if="cmd.type=='dropdown'"
                    size="small"
                    style="padding-right: 15px"
                  >
                    <el-button
                      type="text"
                      size="small"
                      style="padding-top: 0px;padding-bottom: 0px;"
                      :disabled="!(cmd.auth==undefined?true:cmd.auth)"
                    >
                      {{cmd.label}}
                      <i
                        class="el-icon-arrow-down el-icon--right"
                        style="font-size: 12px"
                      ></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(children, childrenIndex) in cmd.childrens"
                        :key="childrenIndex"
                        :disabled="(children.disableMethod && children.disableMethod(scope.row))"
                        :command="cmdChildren(scope.row,children.command)"
                      >{{children.commandtext}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button
                    v-else
                    size="small"
                    :type="cmd.type"
                    :class="cmd.class"
                    :disabled="(cmd.disableMethod && cmd.disableMethod(scope.row))||!(cmd.auth==undefined?true:cmd.auth)"
                    @click="cmd.cmd(scope.row)"
                  >{{cmd.transfer==1?cmd.transferLabel[scope.row[cmd.transferKey]]:cmd.label}}</el-button>
                </span>
              </span>
            </span>
            <span v-else-if="column.elswitch">
              <el-switch
                v-model="scope.row[column.prop]"
                :active-text="column.elswitch.activeText"
                :inactive-text="column.elswitch.inactiveText"
                :active-value="column.elswitch.activeValue"
                :active-color="column.elswitch.activeColor"
                :inactive-color="column.elswitch.inactiveColor"
                :inactive-value="column.elswitch.inactiveValue"
                @change="column.elswitch.change(scope.row)"
              ></el-switch>
            </span>
            <span v-else-if="column.progressArr">
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="initColValue(scope.row,column.prop)"
                :color="customColorMethod"
              ></el-progress>
            </span>
            <span v-else-if="column.links">
              <!--超链接-->
              <span
                v-if="column.showProp"
              >{{ column.render ? column.render(scope.row) :initColValue(scope.row,column.prop)}}</span>
              <template v-for="(link, linkIndex) in column.links">
                <a
                  :class="link.class"
                  :title="link.title"
                  style="margin-right: 4px;"
                  :key="linkIndex"
                  size="small"
                  @click="link.click(scope.row)"
                  v-if="link.showConditon==undefined ||link.showConditon(scope.row)"
                >
                  <span v-if="link.ishtml">
                    <span v-html="link.html"></span>
                  </span>
                  <span
                    v-else
                  >{{link.type==0?(link.transfer==1?link.transferLabel[scope.row[link.transferKey]]:link.label):scope.row[column.prop]}}</span>
                </a>
              </template>
            </span>
            <!-- v-html元素添加绑定事件 yrx -->
            <span v-else-if="column.html">
              <div
                v-html="column.render ? column.render(scope.row) :initColValue(scope.row,column.prop)"
                @click="() => column.handleClick ? column.handleClick(scope.row) : false"
              ></div>
            </span>
            <span
              v-else-if="column.formatter"
            >{{column.formatter ? column.formatter(scope.row) : column.prop}}</span>
            <span v-else-if="column.progress">
              <el-tooltip v-if="scope.row[column.prop]===1" placement="bottom" effect="light">
                <div slot="content">
                  {{column.progressStatusTitle(scope.row)}}
                  <br />
                  {{column.progressStatusContent(scope.row)}}
                </div>
                <el-button
                  size="small"
                  type="text"
                  style="padding-top: 0px;padding-bottom: 0px;"
                  :class="column.class"
                >{{column.progress.render ? column.progress.render(scope.row) :initColValue(scope.row,column.prop)}}</el-button>
              </el-tooltip>
              <span
                v-else
                size="small"
                style="padding-top: 0px;padding-bottom: 0px;"
              >{{column.progress.render ? column.progress.render(scope.row) :initColValue(scope.row,column.prop)}}</span>
            </span>
            <span v-else-if="column.input">
              <el-input v-model="scope.row[column.prop]" size="small" readonly></el-input>
            </span>
            <span
              v-else
            >{{ column.render ? column.render(scope.row) :initColValue(scope.row,column.prop) || '--'}}</span>
          </template>
        </el-table-column>
      </template>
      <slot name="append" />
    </el-table>
    <div v-if="showPagination" style="margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageIndex"
        :page-sizes="pageSizes"
        :page-size="pagination.pageSize"
        :layout="paginationLayout"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "JTable",

  props: {
    // 新增按钮插槽 zhangziyi 20200324
    showSearchSlot: {
      type: Boolean,
      default: false,
    },
    // Element UI Table attributes
    saveParams: {
      type: Boolean,
      default: false,
    },
    check: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Function,
      default: function () {
        return true;
      },
    },
    no: {
      type: Boolean,
      default: true,
    },
    height: [String, Number],
    maxHeight: [String, Number],
    stripe: { type: Boolean, default: true },
    border: { type: Boolean, default: true },
    fit: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: "small",
    },
    headerAlign: {
      type: String,
      default: "center",
    },
    emptyText: {
      type: String,
      default: "暂无数据",
    },
    highlightCurrentRow: Boolean,
    currentRowKey: [String, Number],
    headerCellClassName: [String, Function],
    rowClassName: [String, Function],
    rowStyle: [String, Function],
    rowKey: [String, Function],
    defaultExpandAll: Boolean,
    expandRowKeys: Array,
    defaultSort: String,
    defaultSortField: String,
    tooltipEffect: String,
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function,
    beforeSearch: Function,
    // custom attributes
    url: { type: String },
    server: { type: String },

    headers: {
      type: Object,
      default: () => {
        return {};
      },
    },
    totalField: {
      type: String,
      default: "data.totalCount",
    },
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formOptions: {
      type: Object,
    },
    autoLoad: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "remote",
      validator(value) {
        const types = ["remote", "local"];
        const validType = types.indexOf(value) !== -1;
        if (!validType) {
          throw new Error(
            `Invalid type of '${value}', please set one type of 'remote' or 'local'.`
          );
        }
        return validType;
      },
    },
    data: {
      type: Array,
    },
    dataHandler: {
      type: Function,
    },
    columns: {
      type: Array,
      required: true,
      // // Element UI table-column attribute
      // columnKey: String,
      // label: {
      //   type: String,
      //   required: true
      // },
      // prop: {
      //   type: String,
      //   required: true
      // },
      // width: Number,
      // minWidth: Number,
      // fixed: [Boolean, String],
      // renderHeader: Function,
      // sortable: [Boolean, String],
      // sortMethod: Function,
      // resizable: {
      //   type: Boolean,
      //   default: true
      // },
      // formatter: Function,
      // showOverflowTooltip: Boolean,
      // align: {
      //   type: String,
      //   default: 'left'
      // },
      headerAlign: {
        type: String,
        default: "center",
      },
      //
      // className: {
      //   type: String,
      //   default: ''
      // },
      // labelClassName: {
      //   type: String,
      //   default: ''
      // },
      // selectable: Function,
      // reserveSelection: Boolean,
      // filters: Array,
      // filterPlacement: String,
      // filterMultiple: {
      //   type: Boolean,
      //   default: true
      // },
      // filterMethod: Function,
      // filteredValue: Array,
      // // custom table-column attribute
      // filter: {
      //   type: String
      // },
      // render: {
      //   type: Function
      // },
      // slotName: {
      //   type: String
      // }
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
    query: {
      type: Boolean,
      default: false,
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 15, 20, 50, 100];
      },
    },
    paginationLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    pageIndexKey: {
      type: String,
      default: "pageIndex",
    },
    pageSizeKey: {
      type: String,
      default: "pageSize",
    },
  },
  data() {
    const _this = this;
    return {
      pagination: {
        pageIndex: 1,
        pageSize: (() => {
          const { pageSizes } = _this;
          if (pageSizes.length > 0) {
            var height = document.documentElement.clientHeight;
            return height > 768 ? pageSizes[1] : pageSizes[0];
          }
          return 20;
        })(),
      },
      total: 0,
      loading: false,
      tableData: [],
      cacheLocalData: [],
    };
  },
  computed: {
    newSlotScope() {
      return Number(Vue.version.replace(/\./g, "")) >= 250;
    },
  },
  methods: {
    customColorMethod(percentage) {
      if (percentage < 30) {
        return "#F56C6C";
      } else if (percentage < 70) {
        return "#E6A23C";
      } else {
        return "#67C23A";
      }
    },
    haveNothing(row) {
      // 判断cmds中的按钮是否都不显示，也就是没东西
      let cmds = this.columns[this.columns.length - 1].cmds;
      if (cmds != undefined && cmds.length > 0) {
        for (let j = 0; j < cmds.length; j++) {
          let cmd = cmds[j];
          if (cmd.showConditon && !cmd.showConditon(row)) {
            // 有显示的东西（按钮等）
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },
    resetForm() {
      this.$refs.searchForm.resetForm();
    },
    cmdChildren(row, cmd) {
      var tmpRow = Object.assign({}, row);
      tmpRow.command = cmd;
      return tmpRow;
    },
    initColValue(row, prop) {
      let result = row;
      if (prop && prop.indexOf(".") !== -1) {
        prop.split(".").forEach((vv) => {
          result = result[vv];
        });
      } else {
        result = result[prop] === null ? "--" : result[prop];
      }
      return result;
    },
    indexMethod(index) {
      return (
        index + 1 + this.pagination.pageSize * (this.pagination.pageIndex - 1)
      );
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.dataChangeHandler();
    },
    handleCurrentChange(pageIndex) {
      this.pagination.pageIndex = pageIndex;
      this.dataChangeHandler();
    },
    // beforeSearch() {
    //   if (this.beforeSearch)
    //     this.beforeSearch();
    // },
    searchHandler() {
      this.pagination.pageIndex = 1;
      this.dataChangeHandler(arguments[0]);
    },
    dataChangeHandler() {
      const { type } = this;
      if (type === "local") {
        this.dataFilterHandler(arguments[0]);
      } else if (type === "remote") {
        if (this.formOptions) {
          this.$refs["searchForm"].getParams((error, formParams) => {
            if (!error) {
              this.fetchHandler(formParams);
            }
          });
        } else {
          this.fetchHandler(this.params);
        }
      }
    },
    dataFilter(data) {
      if (!this.showPagination) {
        return data;
      }
      const { pageIndex, pageSize } = this.pagination;
      return data.filter((v, i) => {
        return i >= (pageIndex - 1) * pageSize && i < pageIndex * pageSize;
      });
    },
    dataFilterHandler(formParams) {
      const { cacheLocalData, params, pagination } = this;
      const mergeParams = Object.assign(params, formParams);
      const validParamKeys = Object.keys(mergeParams).filter((v) => {
        return mergeParams[v] !== undefined && mergeParams[v] !== "";
      });
      const searchForm = this.$refs["searchForm"];
      let paramFuzzy;
      if (searchForm) {
        paramFuzzy = searchForm.getParamFuzzy();
      }
      if (validParamKeys.length > 0) {
        const validData = cacheLocalData.filter((v) => {
          let valids = [];
          validParamKeys.forEach((vv) => {
            if (typeof v[vv] === "number") {
              valids.push(
                paramFuzzy && paramFuzzy[vv]
                  ? String(v[vv]).indexOf(String(mergeParams[vv])) !== -1
                  : String(v[vv]) === String(mergeParams[vv])
              );
            } else {
              valids.push(
                paramFuzzy && paramFuzzy[vv]
                  ? v[vv].indexOf(mergeParams[vv]) !== -1
                  : v[vv] === mergeParams[vv]
              );
            }
          });
          return valids.every((vvv) => {
            return vvv;
          });
        });
        this.tableData = this.dataFilter(validData);
        this.total = validData.length;
      } else {
        this.total = cacheLocalData.length;
        this.tableData = this.dataFilter(cacheLocalData);
      }
    },
    fetchHandler(formParams = {}) {
      this.loading = true;
      let {
        url,
        server,
        loading,
        headers,
        pageIndexKey,
        pageSizeKey,
        totalField,
        showPagination,
        emptyText,
        pagination,
      } = this;
      let _this = this;
      let params = Object.assign({}, this.params);
      params = JSON.parse(JSON.stringify(Object.assign(params, formParams)));

      // 新加请求体数据格式
      if(this.query) {
        params = {
          [pageIndexKey]: pagination.pageIndex,
          [pageSizeKey]: pagination.pageSize,
          query: {
            ...params,
          }
        }
      }

      

      // if (showPagination) {
      //   params = Object.assign(
      //     { params: params },
      //     {
      //       [pageIndexKey]: pagination.pageIndex,
      //       [pageSizeKey]: pagination.pageSize
      //     }
      //   );
      // }

      // if (showPagination) {
      //   params = Object.assign(params, {
      //     page: {
      //       [pageIndexKey]: pagination.pageIndex,
      //       [pageSizeKey]: pagination.pageSize,
      //       orderBy: this.defaultSortField,
      //       orderType: this.defaultSort || "desc",
      //     },
      //   });
      // }

      /* if (params.outer) {
          delete params['outer'];
        } */

      let requestObject = null;
      loading = false;

      if (this.saveParams) {
        var paramsClone = $.extend(true, {}, params);

        this.$store.commit("searchParams", paramsClone);
      }
      
      this.$api.post(url, params, null).then(
        (res) => {
          let result = res;
          if (res && !(res instanceof Array)) {
            result = res.list;
          }
          if (!result || !(result instanceof Array)) {
            _this.loading = false;
            return false;
          }
          if (_this.dataHandler) {
            this.tableData = result.map(_this.dataHandler);
          } else {
            _this.tableData = result;
          }
          if (showPagination) {
            _this.total = res.total;
          }
          _this.loading = false;
        },
        (error) => {
          this.tableData = [];
          _this.loading = false;
          console.log(error);
        }
      );
    },
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1));
    },
    loadLocalData(data) {
      if (!data) {
        // this.emptyText = "返回数据格式错误";
        this.showPagination = false;
        return false;
      }
      const cacheData = JSON.parse(JSON.stringify(data));
      this.tableData = this.dataFilter(cacheData);
      this.cacheLocalData = cacheData;
      this.total = cacheData.length;
    },
    sortChange(event) {
      this.defaultSortField = event.prop;
      this.defaultSort = event.order == "descending" ? "desc" : "asc";
      this.searchHandler();
    },
    handlerSearchSlotSend() {
      this.$emit("searchSlotClick", true);
    },
  },
  mounted() {
    // event: expand changed to `expand-change` in Element v2.x
    this.$refs["table"].$on("expand", (row, expanded) =>
      this.emitEventHandler("expand", row, expanded)
    );
    const { type, autoLoad, data, formOptions } = this;
    if (type === "remote" && autoLoad) {
      if (formOptions) {
        /* if (this.params.outer) {
            //删除outer标志
            var paramsClone = $.extend(true, {}, this.params);
            delete paramsClone['outer'];
            this.params = paramsClone;
            //设置其他参数
            this.$refs['searchForm'].params = paramsClone;
          } */
        this.$refs["searchForm"].getParams((error, formParams) => {
          if (!error) {
            this.fetchHandler(Object.assign(formParams, this.params));
          }
        });
      } else {
        this.fetchHandler(this.params);
      }
    } else if (type === "local") {
      this.loadLocalData(data);
    }
  },
  created() {
    if (this.showPagination && this.params.outer) {
      // 设置页码
      if (this.params.page) {
        this.pagination.pageIndex = this.params.page.pageIndex + 1;
        this.pagination.pageSize = this.params.page.pageSize;
      }
    }
  },
  watch: {
    data: function (value) {
      this.loadLocalData(value);
    },
    params: function (value) {
      this.pagination.pageIndex = 1;
      this.fetchHandler(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table-container {
  .el-button {
    padding: 0;
    margin: 0 3px;
  }
}
.el-pagination {
  text-align: right;
}

.el-table .no-read {
  color: #0067b0 !important;
  font-weight: bold;
}
.el-dropdown-menu__item {
  color: #409eff !important;
  font-size: 12px !important;
}
</style>
