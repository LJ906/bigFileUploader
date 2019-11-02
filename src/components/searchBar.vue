<template>
  <div class="con-search-bar">
    <Form
      ref="searchBarForm"
      class="searchBarForm"
      :model="value"
      size="small"
      :label-width="labelWidth"
    >
      <Row>
        <!-- :lg="{span: condition.span ? condition.span : 5}"
        :xl="{span: condition.span ? condition.span : 4}"-->
        <i-col
          :span="condition.span ? condition.span : 4"
          v-for="(condition, i) in conditions"
          :hidden="condition.hidden"
          :key="condition.prop + i"
        >
          <template v-if="!condition.hidden">
            <FormItem
              :label="condition.label"
              :prop="condition.prop"
              class="search-bar-item"
              :labelWidth="condition.labelWidth"
            >
              <!-- {{value[condition.prop]}} -->
              <Select
                v-if="condition.type === 'select'"
                v-model="condition.value"
                :disabled="condition.disabled"
                :placeholder="condition.placeholder? condition.placeholder : '请选择'"
                @on-change="hanldeSelectChange(condition, condition.value)"
                :clearable="condition.clearable !== undefined ? condition.clearable : true"
              >
                <Option v-for="(v, k) in condition.options" :key="k + v" :label="v" :value="k"></Option>
              </Select>

              <DatePicker
                v-else-if="condition.type == 'date' || condition.type == 'datetime'"
                :type="condition.type"
                :disabled="condition.disabled"
                v-model="condition.value"
                placeholder="选择日期"
                clearable
                :value-format="condition.type == 'date'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
              ></DatePicker>

              <i-input
                v-else
                clearable
                :type="condition.type"
                :disabled="condition.disabled"
                v-model.trim="condition.value"
                autocomplete="off"
                @on-change="handleInpChange(condition, condition.value)"
                :placeholder="condition.placeholder? condition.placeholder : '请输入'"
              ></i-input>
            </FormItem>
          </template>
        </i-col>

        <!-- 操作项 -->
        <i-col :span="operationsBtnSpan" v-if="operationsBtn && operationsBtn.length">
          <template v-for="(operation, i) in operationsBtn">
            <Button
              class="operationsBtn"
              :key="i"
              :type="operation.type"
              :icon="operation.icon"
              @click="operationsBtnClick(operation, reservedParams)"
            >{{operation.label}}</Button>
          </template>
          <slot :queryForm="reservedParams"></slot>
        </i-col>
      </Row>
    </Form>
  </div>
</template>

<script>
/**
 * 参数说明：详见README.md 
 *  { 
 *    prop: 'name',  // form绑定的prop 不能重复,后台提交时的字段
 *    label: '姓名',  // 显示的名字
 *    type: 'text', // 输入框的类型， 常用的：text，select, date, datetime， 默认是text，
 *    placeholder:  '请输入', // 默认 ’请输入‘, 
 *    span: 4 // 每项 i-col的份数， 默认4
 *    options: {id: '张三'}, // type是select时的选项，Object格式，值绑定的key, 显示的 value，即传给后台的值是此处的id
 *    value: '', // 默认值
 *    event: 'eventName', // 输入框的或下拉框的on-change触发的事件名称， 记得在父组件中监听， 参数为 包含所有字段的value， 
 *    hidden: true, // 显示隐藏， false 不显示此项
 *    labelWidth: 100, // 单个项的 label 宽度, 可不传，默认100，
    }

 */

export default {
  props: {
    value: {
      type: Object
    },
    conditions: Array, // 查询项组成的数组
    labelWidth: {
      type: Number,
      default: 100
    },
    operationsBtn: Array,
    operationsBtnSpan: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      queryForm: {}
    };
  },
  mounted() {
    // 设置默认值
    // this.conditions.forEach(o => {
    //     if (o.value) {
    //         this.$set(this.value, o.prop, o.value)
    //     }
    // })
  },
  methods: {
    /**
     * 下拉框change事件
     * @param {Object} condition: 当前项的信息，
     * @param {Object} queryForm : 包含所有筛选项的值的对象 value
     * 如果当前项有event则触发自己的事件, 并将所有参数值传递出去
     */
    hanldeSelectChange(condition, currentVal) {
      if (condition.event) {
        // this.$emit(condition.event, queryForm)
        condition.event(currentVal, { ...this.reservedParams });
      }
    },

    // 输入框输入事件
    handleInpChange(condition, currentVal) {
      if (condition.event) {
        // this.$emit(condition.event, queryForm)
        condition.event(currentVal, { ...this.reservedParams });
      }
    },
    // 操作项点击事件
    operationsBtnClick(operation) {
      operation.event({ ...this.reservedParams });
    }
  },
  computed: {
    reservedParams() {
      let params = this.conditions.reduce((result, n) => {
        // 处理多选 转成 ',' 连接的字符串
        if (n.multiple && n.type === "select") {
          result[n.prop] = n.value && n.value.length ? n.value.join(",") : "";
        } else {
          result[n.prop] = n.value;
        }
        return result;
      }, {});

      return params;
    }
  }
};
</script>

<style scoped>
.con-search-bar {
  padding : 10px 10px 0;
  background: #fff;
  border-radius: 5px;
}
.con-search-bar .search-bar-item {
  width: 100%;
  margin-bottom: 10px;
  margin-top: 0;
}
.con-search-bar .operationsBtn {
  margin-left: 10px;
}
.con-search-bar .operations-btn-wrp {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>
