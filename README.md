# ivew_demo
## 文件上传组件（globalUpload）使用说明
1. 全局挂载的文件上传组件
2. 和业务逻辑挂钩文件上传组件提供了以下入口：  
   
    （文件上传组件的事件需要用Bus 发布或监听）

    a. 组件提供了上传额外参数的入口， 可以传入业务逻辑参数， 使用方式，举例： 
    ```js
        openUploader () {
            Bus.$emit('openUploader', {
                id: '1111'  // 传入的参数
            })
        }
    ```

    b.  所有文件上传成功后的回调函数： onGlobalUploadComplete;
        使用方式，举例： 
    ```js
        /**
         *  所有文件上传成功后的回调
         *  @params {Array} fileList 包含上传文件的数组
         * 需要页面 挂载（mounted) 钩子函数中调用；
        */
        Bus.$on ('onGlobalUploadComplete', (fileList) => {
            console.log('监听到所有文件上传完了', fileList)
        })

    ```
    
    d. destroyed 钩子函数中需要销毁监听的事件


3. 举例： 
```html
<Button type="primary" @click="openUploader">打开文件上传</Button>
```

```js
import Bus from '@/utils/bus'; // 需引入Bus
export default {
    mounted() {
        Bus.$on ('onGlobalUploadComplete', (fileList) => {
            console.log('监听到所有文件上传完了', fileList)
        })
    },
    methods: {
        // 打开文件上传的组件并传入参数
        openUploader () {
            Bus.$emit('openUploader', {
                id: '1111'  // 传入的参数
            })
        }
    },
    destroyed() {
        Bus.$off('fileAdded');
        Bus.$off('fileSuccess');
        Bus.$off('onGlobalUploadComplete')
    },
}
```



## searchBar.vue 组件 使用说明

1. 参数说明：
    props: 参数
     - value  父组件 传v-model的对象，绑定所有字段的值
     - conditions 搜索项数组，[{Object}] 参数如下： 
        ```js
        { 
            prop: 'name',  // form绑定的prop 不能重复,后台提交时的字段
            label: '姓名',  // 显示的名字
            type: 'text', // 输入框的类型， 常用的：text，select, date, datetime， 默认是text，
            value: '', // 默认值
            placeholder:  '请输入', // 默认 ’请输入‘, 
            span: 4 // 每项 i-col的份数， 默认4
            options: {id: '张三'}, // type是select时的选项，Object格式，值绑定的key, 显示的 value，即传给后台的值是此处的id
            event: 'eventName', // 输入框的或下拉框的on-change触发的事件名称， 记得在父组件中监听， 参数为 包含所有字段的value， 
            hidden: true, // 显示隐藏， false 不显示此项
            labelWidth: 100, // 单个项的 label 宽度, 可不传，默认100，
        }


        // 举例： 使用input 类型
        {
            prop: 'name',   
            label: '姓名', 
            type: 'text',
            value: '',
            event: 'eventName'
        },

        // select 类型
        {
            prop: 'student',   
            label: '姓名', 
            type: 'select',
            value: '',
            options: {id1: '张三', id2: '李四'},  
            event: 'eventName'
        },


        ```
        - labelWidth  整个搜索框的标签宽度，  
            类型： Number， 默认 100

        - operationsBtn  操作项数组 [{Object}]， 参数如下：

        ```js
            {
                type: 'success', 
                label: '查询',
                icon: '',
                event: 'clickSearchBtn' // 点击事件名称，自定义即可此处为 举例,需父组件监听
            }
         
         ```
         - 组件调用代码参考
        ```html
            <!--  父组件 html -->
            <search-bar 
                v-model="queryForm"
                :conditions="conditions"
                :operationsBtn="searchOperationBtn"
                :operationsBtnSpan="5"
                @clickSearchBtn="clickSearchBtn"
                @clickRestBtn="clickRestBtn"
            ></search-bar>
        ```
        ```js
            // 父组件 js
        <script>
            import SearchBar from '@/components/searchBar'
            export default {
                components: {
                    SearchBar
                } ,
                data () {
                    return {
                        queryForm: {},
                        // 搜索项数组
                        conditions: [ 
                            {
                                prop: 'name',
                                label: '姓名 :',
                                type: 'select',
                                span: 3,
                                value: 'a',
                                options: {"id1": '张三', 'id2': '李四'},
                            },
                            {
                                prop: 'defaultSearchBatch',
                                label: '爱好',
                                hidden: false, // 是否显示此项
                                type: 'text',
                            },
                        ],
                        // 操作项数组
                        searchOperationBtn:[ 
                            {
                                type: 'success', 
                                label: '查询', 
                                event: 'clickSearchBtn'
                            },
                            {
                                type: 'success', 
                                label: '清空', 
                                event: 'clickRestBtn'
                            },
                        
                        ],
                    }
                },  
                methods: {
                    // 点击查询 queryForm 包含所有字段值的对象
                    clickSearchBtn (queryForm) {
                        console.log('查询', queryForm)
                    }, 
                    // 清空  queryForm 包含所有字段值的对象
                    clickRestBtn (queryForm) {
                        this.queryForm  = {}
                    }
                }
            }
        </script>

        ```



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
