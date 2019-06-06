const res = {
    "code": 2000,
    "status": "SUCCESS",
    "message": "成功",
    "data": [
        { "isNewRecord": true, "name": "国电投", "count": 1, "times": "2015" },
        { "isNewRecord": true, "name": "中核集团", "count": 2, "times": "2015" },
        { "isNewRecord": true, "name": "中广核集团", "count": 3, "times": "2015" },
        { "isNewRecord": true, "name": "华能", "count": 4, "times": "2015" },
        { "isNewRecord": true, "name": "国电投", "count": 5, "times": "2016" },
        { "isNewRecord": true, "name": "中核集团", "count": 6, "times": "2016" },
        { "isNewRecord": true, "name": "中广核集团", "count": 3, "times": "2016" },
        { "isNewRecord": true, "name": "华能", "count": 5, "times": "2016" },
        { "isNewRecord": true, "name": "国电投", "count": 9, "times": "2017" },
        { "isNewRecord": true, "name": "中核集团", "count": 0, "times": "2017" },
        { "isNewRecord": true, "name": "中广核集团", "count": 0, "times": "2017" },
        { "isNewRecord": true, "name": "华能", "count": 8, "times": "2017" },
        { "isNewRecord": true, "name": "国电投", "count": 0, "times": "2018" },
        { "isNewRecord": true, "name": "中核集团", "count": 1, "times": "2018" },
        { "isNewRecord": true, "name": "中广核集团", "count": 0, "times": "2018"},
        { "isNewRecord": true, "name": "华能", "count": 8, "times": "2018" },
        { "isNewRecord": true, "name": "国电投", "count": 9, "times": "2019" },
        { "isNewRecord": true, "name": "中核集团", "count": 1, "times": "2019" },
        { "isNewRecord": true, "name": "中广核集团", "count": 90, "times": "2019" },
        { "isNewRecord": true, "name": "华能", "count": 20, "times": "2019" }
    ]
}

// 转成数据结构
// var chartsdata = [
//     {
//         name: '中广核集团',
//         data: []
//     },
//     {
//         name: '中核集团',
//         data: []
//     }
// ]

// 转table 数据
// [
//     {
//         name: '',
//         years1: '',
//         years2: '', 
//         years3: '',
//         year4: '',
//         year5: '' 

//     }
// ]
// 转chart数据
let chartsdata = [];
let tableDataArr=[]

function formResponse(res) {
    const data = res.data;
    let conditionVal = {};
    // 获取时间x轴标签
    // let years = _.sortBy(_.uniq(_.map(data, 'times')), o => o);
    let years =  _.uniq(_.map(data, 'times'));// ["2010",  "2012", "2013", ...]
    // 2. 先转成 {name: [{count: 99, times: 2029, name: 集团}, value2]}
    const obj = {}; // 临时中间变量
    const tableObj = {}
    data.forEach(item => {
        if(obj[item.name]) {
            obj[item.name].push({
                count: item.count,
                times: item.times,
                [item.times]: item.count  
            })
        }else {
            obj[item.name] = [
                {
                    count: item.count,
                    times: item.times,
                    [item.times]: item.count 
                }
            ]
        }
    });
    const seriesData = []; 
    // console.log('obj', obj) // {name:}

    for(let k in obj) {
        // chart 数据格式
        var countdataArr = _.map(obj[k], 'count')
        seriesData.push({
            name: k,
            data: countdataArr
        })
        // table 数据格式
        let tableobj = {} // {name: xx, 2008: 2, 2009: 4}
        tableobj.name = k;
        obj[k].forEach((ele, i) => {
            if (years[i] in ele) {
                // console.log('存在', ele, years[i])
                tableobj['years'+[i]] = ele[years[i]]
                tableobj = {...tableobj, ...ele}
            }else {
                console.log('乱序列', ele, years[i])
            }
        })
        tableDataArr.push(tableobj)
        
    }

    console.log('tableDataArr', tableDataArr)
    return  {
        xCartgories: years,
        data: seriesData
    }

}
formResponse (res)
 


