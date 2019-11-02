<template>
  <div class="wrp">
    <Layout>
      <Content>
        <search-bar
          :conditions="conditions"
          :operationsBtn="searchOperationBtn"
          :operationsBtnSpan="4"
          @clickSearchBtn="clickSearchBtn"
          @clickRestBtn="clickRestBtn"
          v-model="queryForm"
        ></search-bar>
        <Table border id="alllist" class="tablehebing" :columns="columns" :data="tableData"></Table>
      </Content>
    </Layout>
  </div>
</template>

<script>
import $ from "jquery";

import SearchBar from "@/components/searchBar";
import { constants } from "crypto";
export default {
  components: {
    SearchBar
  },
  data() {
    return {
      queryForm: {},
      conditions: [
        {
          prop: "name",
          label: "姓名 :",
          type: "select",
          value: "a",
          options: { id1: "张三", id2: "李四" }
        },
        {
          prop: "name",
          label: "年龄 :",
          type: "select",
          value: "a",
          options: { id1: "张三", id2: "李四" }
        },
        {
          prop: "name",
          label: "机关单位 :",
          type: "select",
          value: "a",
          options: { id1: "张三", id2: "李四" }
        },
        {
          prop: "name",
          label: "其他信息:",
          type: "select",
          value: "a",
          options: { id1: "张三", id2: "李四" }
        },
        {
          prop: "name",
          label: "地址:",
          type: "select",
          value: "a",
          options: { id1: "张三", id2: "李四" }
        },
        {
          prop: "name",
          label: "运输机关:",
          type: "select",
          value: "a",
          options: { id1: "张三", id2: "李四" }
        },
        {
          prop: "name",
          label: "运输机关 :",
          type: "select",
          value: "a",
          options: { id1: "张三", id2: "李四" }
        },
        {
          prop: "defaultSearchBatch",
          label: "运输机关",
          hidden: false, // 是否显示此项
          type: "text"
        }
      ],
      searchOperationBtn: [
        {
          type: "success",
          label: "查询",
          event: this.clickSearchBtn
        },
        {
          type: "success",
          label: "清空",
          event: this.clickRestBtn
        }
      ],
      tableData: [
        {
          group: 2019,
          gender: "g",
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          group: 2019,
          gender: "g",
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          group: 2014,
          name: "Joe Black",
          gender: "b",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          group: 2014,
          gender: "b",
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        },
        {
          group: 2015,
          name: "Joe Black",
          gender: "C",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          group: 2015,
          gender: "C",
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ],

      columns: [
        {
          title: "group",
          key: "group",
          className: "collapse1"
        },
        {
          title: "gender",
          key: "gender",
          className: "collapse2"
        },
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Age",
          key: "age"
        },
        {
          title: "Address",
          key: "address"
        },
        {
          title: "Action",
          key: "action",

          width: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  }
                },
                "View"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  }
                },
                "Edit"
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    let tds1 = $(".tablehebing tr").find("td:first");
    // let tds2 = $(".tablehebing tr").find('td:nth-child(2)');
    let tds2 = $(".tablehebing tr").find(".collapse2");
    console.log("tds===", tds2);
    this.mergeTable(tds1);
    this.mergeTable(tds2);
  },
  methods: {
    clickSearchBtn(queryForm) {
      console.log("查询", queryForm);
    },
    clickRestBtn(queryForm) {
      // this.queryForm = {};
      console.log("清空");
    },
    mergeTable(tds) {
      let curr = $(tds[0]);
      console.log("curr", curr, curr.find("span").text());
      let idx = 0;
      for (let i = idx; i < tds.length; i++) {
        if (
          curr.find("span").text() ==
          $(tds[i])
            .find("span")
            .text()
        ) {
          idx++;
          if (idx != 1) {
            $(tds[i]).hide();
            // $(tds[i]).find("span").text('')
          }
        } else {
          curr.attr("rowspan", idx);
          idx = 1;
          curr = $(tds[i]);
        }
      }
    }
  }
};
</script>

<style lange="less">
td.collapse {
  background-color: red;
}

.wrp {
  width: 100%;
  height: 100%;
  background-color: red;
}

.width90 {
  width: 90%;
}
</style>
