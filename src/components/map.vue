<template>
    <div :ref="id" :style="{width:width, height:width}" @click="$emit('click', $event)" ></div>
</template>

<script>
// echart 按需引入
import echarts from "echarts/lib/echarts";
import 'echarts/map/js/china.js'
import "echarts/lib/chart/bar";
import "echarts/lib/component/title";

import debounce from "lodash/debounce";
import { addListener, removeListener } from "resize-detector";

export default {
  props: {
    option: {
      type: Object,
      default: () => {}
    },
    id: String, 
    width: {
        type: String, 
        default: '800px'
    },
    height: {
        type: String, 
        default: '800px'
    }

  },
  watch: {
    option(val) {
        console.log('newoption', val)
      this.chart.setOption(val);
    }
    // option: {
    //   handler(val) {
    //     this.chart.setOption(val);
    //   },
    //   deep: true
    // }
  },
  created() {
    this.resize = debounce(this.resize, 300);
  },
  mounted() {
    this.renderChart();
    addListener(this.$refs[this.id], this.resize);
  },
  beforeDestroy() {
    removeListener(this.$refs[this.id], this.resize);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    resize() {
      console.log("resize");
      this.chart.resize();
    },
    renderChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(this.$refs[this.id]);
      this.chart.setOption(this.option);
    }
  }
};
</script>

<style>

</style>
