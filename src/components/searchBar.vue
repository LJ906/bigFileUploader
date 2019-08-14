<template>
    <div class="con-search-bar">
        <Form 
            inline 
            ref="searchBarForm" 
            :model="value"  
            :label-width="labelWidth">
            <Row>
                <i-col 
                    :span="condition.span ? condition.span : 4" 
                    v-for="(condition, i) in conditions" 
                    :hidden="condition.hidden"
                    :key="condition.prop + i">
                    <template v-if="!condition.hidden">
                        <FormItem :label="condition.label" :prop="condition.prop" class="search-bar-item" :labelWidth="condition.labelWidth">
                            <!-- {{value[condition.prop]}} -->
                            <Select 
                                v-if="condition.type==='select'"
                                v-model="value[condition.prop]" 
                                :placeholder="condition.placeholder? condition.placeholder : '请选择'" 
                                @on-change="hanldeSelectChange(condition, value)"
                                clearable>
                                <Option 
                                    v-for="(v, k) in condition.options" 
                                    :key="k + v" 
                                    :label="v" 
                                    :value="k"></Option>
                            </Select>

                            <DatePicker
                                v-else-if="condition.type == 'date' || condition.type == 'datetime'"
                                :type="condition.type"
                                v-model="value[condition.prop]"
                                placeholder="选择日期"
                                clearable
                                :value-format="condition.type == 'date'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
                            ></DatePicker>

                            <i-input
                                v-else 
                                clearable
                                :type="condition.type"
                                v-model.trim="value[condition.prop]"
                                autocomplete="off"
                                @on-change="handleInpChange(condition, value)"
                                :placeholder="condition.placeholder? condition.placeholder : '请输入'"
                            ></i-input>
                        </FormItem>
                    </template>
                </i-col>

                <!-- 操作项 -->
                <i-col :span="operationsBtnSpan" v-if="operationsBtn && operationsBtn.length" align="right">
                    <Button 
                        class="operationsBtn"
                        v-for="(operation, i) in operationsBtn" 
                        :key="i" 
                        :type="operation.type"
                        :icon="operation.icon"
                        @click="operationsBtnClick(operation, value)"
                    >{{operation.label}}</Button>
                </i-col>
            </Row>
        </Form>
    </div>
</template>

<script>
/**
 * 参数说明：详见README.md 
 * 
 * 
 */

export default {
    props: {
        value: {
            type: Object,
            required: true 
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
    mounted() {
        // 设置默认值
        this.conditions.forEach(o => {
            if (o.value) {
                this.$set(this.value, o.prop, o.value)
            }  
        })
    },
    watch: {
        conditions: {
             handler(val, old) {
                val.forEach((o, i) => {
                    let oldOptVal = old.find(item => item.prop == o.prop).value
                    if (o.value != oldOptVal) {
                        this.$set(this.value, o.prop, o.value)
                    } else {
                        this.$set(this.value, o.prop, o.value)
                    }
                })
            }, 
            deep: true
        }
    },
    methods: {
        /**
         * 下拉框change事件
         * @param {Object} condition: 当前项的信息，
         * @param {Object} queryForm : 包含所有筛选项的值的对象 value
         * 如果当前项有event则触发自己的事件, 并将所有参数值传递出去
         */
        hanldeSelectChange (condition, queryForm) {
            if (condition.event) {
                this.$emit(condition.event, queryForm)
            }
        }, 

        // 输入框输入事件
        handleInpChange (condition, queryForm) {
            if (condition.event) {
                this.$emit(condition.event, queryForm)
            }
        }, 
        // 操作项点击事件
        operationsBtnClick (operation) {
            this.$emit(operation.event, this.value)
        }

    }
}
</script>

<style scoped>
    .con-search-bar {
        padding: 10px 10px 0;
        background:#fff;
        border-radius:5px;
    }
    .search-bar-item {
        width: 100%;
    }
    .con-search-bar >>> .ivu-form-item{
        margin-bottom: 10px; 
    }
    .operationsBtn {
        margin-left: 20px;
    }
</style>
