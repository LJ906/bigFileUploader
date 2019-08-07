<template>

  <div>
    中国地图
    <my-map :option="option" id="chinaMap" ref="chinaMap" style="width: 100%; height: 1000px"></my-map>
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts/map/js/china.js";

import MyMap from "@/components/map";

export default {
  components: {
    MyMap
  },
  data() {

    let mapData = {
      "401所":{"设施":"401所","U":"1000KG","P":"100KG","组件":"0组","lat":39.9031324643,"lon":116.4010433787,"x":6763,"level":{"range":1,"level":1,"name":"研究院所"},"y":6381,"cityNo":1},
      "核动力院":{"设施":"核动力院","U":"2000KG","P":"200KG","组件":"0组","lat":30.6522796787,"lon":104.0725574128,"x":4387,"level":{"level":1,"range":1,"name":"研究院所"},"y":4304,"cityNo":5},
      "272厂":{"x":6039,"y":3400,"lat":26.8932449862,"lon":112.5719468941,"设施":"272厂","U":"8000T","P":"0KG","组件":"0组","level":{"level":2,"range":19,"name":"核设施"},"cityNo":6},
      "202厂":{"x":5573,"y":6566,"lat":40.6578106429,"lon":109.8402184261,"设施":"202厂","U":"5000T","P":"500T","组件":"1000组","level":{"level":2,"range":19,"name":"核设施"},"cityNo":6},
      "303库":{"x":5962,"y":4554,"lat":32.0090104857,"lon":112.1225535633,"设施":"303库","U":"20000T","P":"0KG","组件":"0组","level":{"level":2,"range":19,"name":"核设施"},"cityNo":6},
      "404厂":{"x":3454,"y":6495,"lat":39.8020850739,"lon":98.2153918660,"设施":"404厂","U":"12000T","P":"1000T","组件":"0组","level":{"level":2,"range":19,"name":"核设施"},"cityNo":6},
      "田湾核电站":{"设施":"田湾核电站","U":"1200T","P":"120T","组件":"1500组","lat":34.7597368296,"lon":119.3389225901,"x":7337,"level":{"level":3,"range":19,"name":"核电"},"y":5197,"cityNo":11},
      "秦山核电站":{"设施":"秦山核电站","U":"500T","P":"50T","组件":"1500组","lat":30.5255265872,"lon":120.9457728251,"x":7684,"level":{"level":3,"range":19,"name":"核电"},"y":4345,"cityNo":12},
      "秦山第二核电站":{"设施":"秦山第二核电站","U":"1000T","P":"100T","组件":"3500组","lat":30.3322704791,"lon":120.6335552442,"x":7624,"level":{"level":3,"range":19,"name":"核电"},"y":4199,"cityNo":13},
      "秦山第三核电站":{"name":"沈阳市","设施":"秦山第三核电站","U":"800T","P":"80T","组件":"30000组","lat":30.3322704791,"lon":121.2244498695,"x":7840,"level":{"level":3,"range":19,"name":"核电"},"y":4204,"cityNo":14}
    }


    return {
      option: {
        title: {},
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(166, 200, 76, 0.82)",
          borderColor: "#FFFFCC",
          showDelay: 0,
          hideDelay: 0,
          enterable: true,
          transitionDuration: 0,
          extraCssText: "z-index:100",
          formatter: function(params, ticket, callback) {
            if (params.seriesType == "effectScatter") {
              return "线路：" + params.data.name + "" + params.data.value[2];
            } else if (params.seriesType == "lines") {
              return (
                params.data.fromName +
                ">" +
                params.data.toName +
                "<br />" +
                params.data.value
              );
            } else {
              return params.name;
            }
          }
        },
        backgroundColor: "#2b2b2b",
        legend: {
          orient: "vertical",
          selectedMode: "multiple",
          top: "60%",
          left: "left",
          data: [
            { name: "北京", icon: "mtPath", textStyle: { color: "#fff" } },
            { name: "上海", icon: "serverPath", textStyle: { color: "#fff" } },
            { name: "贵州", icon: "planePath", textStyle: { color: "#fff" } }
          ]
        },
        geo: {
          map: "china",
          zoom: 1,
          label: {
            emphasis: {
              show: true,
              color: "#fff"
            }
          },
          roam: false, //是否允许缩放
          itemStyle: {
            normal: {
              color: "rgba(51, 69, 89, .5)", //地图背景色
              borderColor: "#516a89", //省市边界线00fcff 516a89
              borderWidth: 1
            },
            emphasis: {
              color: "rgba(37, 43, 61, .5)" //悬浮背景
            }
          }
        },
        series: []
      }, 
      series: []
    };
  },
  computed: {
    // echarts实例
    chinaMap() {
      return this.$refs.chinaMap.chart;
    }
  },
  mounted() {
    this.initMap();
    this.$nextTick(res => {
      // console.log('this.chinaMap实例', this.chinaMap)
      this.chinaMap.on("click", "series", res => {
        let { componentType, seriesType } = res; // geo /series/line
        // 如果点的是城市的点则触发事件
        if (componentType == "series" && seriesType === "graph") {
          console.log("城市点 == ：", res.name, res.data);
          this.initMap(res.data)
        } else {
          console.log("点击的路线", res.data);
        }
      });
    });
  },
  methods: {
    initMap(clickedCityData) {
      var chinaGeoCoordMap = {
        上海: [121.4648, 31.2891],
        浙江: [119.5313, 29.8773],
        江苏: [118.8062, 31.9208],

        北京: [116.4551, 40.2539],
        天津: [117.4219, 39.4189],
        河南: [113.4668, 34.6234],
        甘肃: [103.5901, 36.3043],

        贵州: [106.6992, 26.7682],
        广西: [108.479, 23.1152],
        江西: [116.0046, 28.6633],
        青岛: [120.4651, 36.3373],
        '401所': [116.4010, 39.9031],
        '核动力院': [104.0725, 30.6522],
        '272厂': [112.5719, 26.8932],
        '202厂': [109.84021, 40.6578],
        '303库': [112.1225, 32.0090],
        '303库': [112.1225, 32.0090],
        '404厂': [98.2153, 39.8020],
        '田湾核电站': [119.3389, 34.7597],
        '秦山核电站': [120.9457, 30.5255],
        '秦山第二核电站': [120.6335, 30.3322],
        '秦山第三核电站': [121.2244, 30.3322],
      };

      var SHData = [
        [{ name: "上海" }, { name: "上海" }],
        [{ name: "上海" }, { name: "浙江", type: "mt" }],
        [{ name: "上海" }, { name: "江苏", type: "mt" }]
      ];

      var BJData = [
        [{ name: "北京" }, { name: "北京" }],
        // [{ name: "北京" }, { name: "天津" }],
        [{ name: "北京" }, { name: "河南", type: "mt" }],
        [{ name: "北京" }, { name: "甘肃", type: "plane" }],
       
      ];

      var GZData = [
        [{ name: "贵州", alert: true }, { name: "贵州", alert: true }],
        [{ name: "贵州", alert: true }, { name: "广西" }],
        [{ name: "贵州" }, { name: "303库", type: "mt" }],
      ];

      var S401Data = [
        [{ name: "401所" }, { name: "401所" }],
        [{ name: "401所" }, { name: "303库", type: "mt" }],
         [{ name: "401所" }, { name: "秦山第三核电站", type: "mt" }],
      ]
      
      var HDLData = []
      // 路线数据
      let ruleData = {
        "401所": S401Data, 
        "核动力院": HDLData,
        "北京": BJData, 
        '贵州': GZData,
        '上海': SHData
      }

     
      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i];
          var fromCoord = chinaGeoCoordMap[dataItem[0].name];
          var toCoord = chinaGeoCoordMap[dataItem[1].name];
          if (fromCoord && toCoord) {
            var obj = {
              fromName: dataItem[0].name,
              toName: dataItem[1].name,
              coords: [fromCoord, toCoord],
              value: dataItem[1].value
            };
            console.log("起点", dataItem[1]);
            if (dataItem[0].alert) {
              obj.lineStyle = { normal: { color: "orange" } };
              obj.effect = {
                color: "red",
                symbolSize: 0
              };
            }

            // console.log(obj);

            res.push(obj);
          }
        }
        console.log("-------");
        return res;
      };

      var planePath =
        "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";

      var mtPath =
        "path://M752.151 866.527H579.133v-47.486c173.631-32.436 304.931-184.675 304.931-367.785 0-153.623-92.46-285.338-224.778-342.977-0.023 0.032-0.047 0.062-0.069 0.094-45.734-20.009-96.17-31.258-149.294-31.258s-103.559 11.249-149.292 31.257l-0.069-0.093c-132.32 57.64-224.78 189.355-224.78 342.977 0 183.11 131.3 335.349 304.93 367.785v47.486H267.694c-33.178 0-34.62 34.589-34.62 34.589v69.215h553.699v-69.215c0-19.054-15.533-34.589-34.622-34.589zM634.962 135.969c-32.767 30.62-76.618 49.472-125.039 49.472-48.422 0-92.272-18.851-125.038-49.473 38.734-15.516 80.86-24.269 125.038-24.269s86.304 8.752 125.039 24.27z m-308.89 315.286c0-101.556 82.229-183.82 183.85-183.82 101.554 0 183.851 82.264 183.851 183.82 0 101.585-82.297 183.849-183.851 183.849-101.62 0-183.85-82.264-183.85-183.849z m281.179 0c0-53.781-43.547-97.296-97.328-97.296-18.52 0-35.629 5.436-50.359 14.393 4.596-1.442 9.363-2.381 14.395-2.381 27.274 0 49.348 22.075 49.348 49.351 0 27.245-22.073 49.317-49.348 49.317-27.277 0-49.318-22.073-49.318-49.317 0-5.064 0.972-9.831 2.384-14.428-8.994 14.732-14.428 31.841-14.428 50.361 0 53.81 43.511 97.324 97.325 97.324 53.782 0.001 97.329-43.514 97.329-97.324z";
      var serverPath =
        "path://M960 320H64c-35.346 0-64-28.654-64-64V128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m224 496H64c-35.346 0-64-28.654-64-64v-128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m224 496H64c-35.346 0-64-28.654-64-64v-128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z";
      var color = ["#a6c84c", "#ffa022", "#46bee9"]; //航线的颜色
      var series = [];
// ["上海", SHData], 


      [["北京", BJData], ["贵州", GZData], ["401所", S401Data]].forEach(function(item, i) {
        series.push(
          {
            name: item[0], // 添加
            type: "lines",
            zlevel: 1,
            effect: {
              show: true,
              period: 1.5,
              trailLength: 0.7,
              color: color[i], //arrow箭头的颜色
              symbolSize: 3
            },
            lineStyle: {
              normal: {
                color: "#22AC38",
                width: 0,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          },
          {
            name: item[0],
            type: "lines",
            zlevel: 2,
            symbol: ["none"],
            symbolSize: 10,
            effect: {
              show: false
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 2,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          },
          {
            name: item[0],
            type: "graph",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              brushType: "stroke"
            },
            label: {
              normal: {
                show: true,
                position: "right",
                formatter: "{b}"
              }
            },

            symbolSize: 18,
            itemStyle: {
              normal: {
                color: color[i]
              },
              emphasis: {
                areaColor: "#2B91B7"
              }
            },
            data: item[1].map(function(dataItem) {
              return {
                symbol:
                  dataItem[1].type == "mt"
                    ? mtPath
                    : dataItem[1].type == "plane"
                    ? planePath
                    : serverPath,
                itemStyle: {
                  normal: { color: color[i] }
                },
                name: dataItem[1].name,
                value: chinaGeoCoordMap[dataItem[1].name].concat([
                  dataItem[1].value
                ])
              };
            })
          }, 
          // 线
         

          
        );
      });

      if(clickedCityData ) {
        let clickedCityName = clickedCityData.name
        let clickedLon = clickedCityData.value[0]
        let clickedLat = clickedCityData.value[1]
        let clickedFromCoord = [clickedLon, clickedLat]
        series.push(
           {
            type: "lines",
            zlevel: 3,
            lineStyle: {
              normal: {
                color: "#fff",
                width: 3,
                opacity: 0.5,
                curveness: 0, // 曲度
                type: "solid"
              }
            },
            data: [
              {
                fromName: clickedCityName,
                toName: "不知道",
                coords: [clickedFromCoord, [150.4651, 34.7597]]
              }
            ]
          }
        )
      }

      // console.log(series);
      var option = {
        title: {},
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(166, 200, 76, 0.82)",
          borderColor: "#FFFFCC",
          showDelay: 0,
          hideDelay: 0,
          enterable: true,
          transitionDuration: 0,
          extraCssText: "z-index:100",
          formatter: function(params, ticket, callback) {
            if (params.seriesType == "effectScatter") {
              return "线路：" + params.data.name + "" + params.data.value[2];
            } else if (params.seriesType == "lines") {
              return (
                params.data.fromName +
                ">" +
                params.data.toName +
                "<br />" +
                params.data.value
              );
            } else {
              return params.name;
            }
          }
        },
        backgroundColor: "#2b2b2b",
        legend: {
          orient: "vertical",
          selectedMode: "multiple",
          top: "60%",
          left: "left",
          data: [
            { name: "北京", icon: "mtPath", textStyle: { color: "#fff" } },
            { name: "上海", icon: "serverPath", textStyle: { color: "#fff" } },
            { name: "贵州", icon: "planePath", textStyle: { color: "#fff" } }
          ]
        },
        geo: {
          map: "china",
          zoom: 1,
          label: {
            emphasis: {
              show: true,
              color: "#fff"
            }
          },
          roam: false, //是否允许缩放
          itemStyle: {
            normal: {
              color: "rgba(51, 69, 89, .5)", //地图背景色
              borderColor: "#516a89", //省市边界线00fcff 516a89
              borderWidth: 1
            },
            emphasis: {
              color: "rgba(37, 43, 61, .5)" //悬浮背景
            }
          }
        },
        series: series
      };

      // 更新option
      // this.option.series = series;

      this.option = option
      // this.series = series;



      this.$nextTick(() => {
        // 切换图例
        this.chinaMap.on("legendselectchanged", function(params) {
          // console.log('图例的状态==', params)
          // 获取点击图例的选中状态
          var isSelected = params.selected[params.name];
          console.log(
            (isSelected ? "选中了" : "取消选中了") + "图例" + params
          );
          console.log("所有图例的状态", params.selected);
        });
      });
    },
 
  }
};
</script>

<style>
</style>
