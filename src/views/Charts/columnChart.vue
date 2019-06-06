
<template>
  <div ref="chartData" :id="id" :option="option" style="height: 600px"></div>
</template>

<script>
import Highcharts from "highcharts/highstock";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsDrilldown from "highcharts/modules/drilldown";
import Highcharts3D from "highcharts/highcharts-3d";
HighchartsMore(Highcharts);
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);

import json from './json'
export default {
  props: ["option"],
  name: "highcharts",
  data() {
    return {
      chart: null, // chart实例
      id: 'chartData',
      options: {
        credits: {
            enabled: false // 禁用版权信息
        },
        chart: {
            type: 'column' //柱状图
        },
        title: {
            text: '核电厂乏燃料池贮存情况' // chart 标题
        },
        exporting: { // 导出功能
            enabled: false
        },
        subtitle: {
          text: "子主题"
        },
        yAxis: {
            title: {
                 text: "数量"
            }, 
            // type: 'logarithmic',
            // tickInterval: 1,
            visible: true,
            labels: {
              style: {
                color: 'black',//颜色
                fontSize: '14px'  //字体
              }
            }
        },

        xAxis: {
            title: {
                text: "年份"
            },
            tickInterval: 1, // x轴刻度标签的间隔如：1： 1，2，3 ； 设置2： 1，3，5
            categories: [2008, 2009, 2020, 2090],
            visible: true
          },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle"
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            // pointStart: 2008
          }
        },
        series: [
          {
            name: "中核集团",
            data: [90, 100, 80, 100, 170]
          },
          {
            name: "中广集团",
            data: [120, 90, 240, 150, 120]
          },
          {
            name: "华能集团",
            data: [120, 90, 80, 170, 120]
          },
          {
            name: "国电投",
            data: [120, 190, 140, 130, 120 ]
          }
        ],
        noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030'
            }
        },
          
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom"
                }
              }
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
    //   this.chart = new Highcharts.Chart(this.id, this.options);
      this.chart = new Highcharts.Chart(this.id, this.options);
    }
  }
};
</script>

<style lang="scss">
.highcharts-container {
  width: 800px;
  height: 400px;
}
</style>