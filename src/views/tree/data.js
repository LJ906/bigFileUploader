let res = [
    {
        "name": "山东省总公司",
        "pId": "0",
        "id": "1",
        "pIds": "0,"
    },
    {
        "name": "国防科工局",
        "pId": "0",
        "id": "27",
        "pIds": "0,"
    },
    {
        "name": "公司领导",
        "pId": "1",
        "id": "2",
        "pIds": "0,1,"
    },
    {
        "name": "综合部",
        "pId": "1",
        "id": "3",
        "pIds": "0,1,"
    },
    {
        "name": "市场部",
        "pId": "1",
        "id": "4",
        "pIds": "0,1,"
    },
    {
        "name": "技术部",
        "pId": "1",
        "id": "5",
        "pIds": "0,1,"
    },
    {
        "name": "研发部",
        "pId": "1",
        "id": "6",
        "pIds": "0,1,"
    },
    {
        "name": "济南市分公司",
        "pId": "1",
        "id": "7",
        "pIds": "0,1,"
    },
    {
        "name": "公司领导",
        "pId": "7",
        "id": "8",
        "pIds": "0,1,7,"
    },
    {
        "name": "综合部",
        "pId": "7",
        "id": "9",
        "pIds": "0,1,7,"
    },
    {
        "name": "市场部",
        "pId": "7",
        "id": "10",
        "pIds": "0,1,7,"
    },
    {
        "name": "技术部",
        "pId": "7",
        "id": "11",
        "pIds": "0,1,7,"
    },
    {
        "name": "历城区分公司",
        "pId": "7",
        "id": "12",
        "pIds": "0,1,7,"
    },
    {
        "name": "公司领导",
        "pId": "12",
        "id": "13",
        "pIds": "0,1,7,12,"
    },
    {
        "name": "综合部",
        "pId": "12",
        "id": "14",
        "pIds": "0,1,7,12,"
    },
    {
        "name": "市场部",
        "pId": "12",
        "id": "15",
        "pIds": "0,1,7,12,"
    },
    {
        "name": "技术部",
        "pId": "12",
        "id": "16",
        "pIds": "0,1,7,12,"
    },
    {
        "name": "高新区分公司",
        "pId": "7",
        "id": "22",
        "pIds": "0,1,7,"
    },
    {
        "name": "历下区分公司",
        "pId": "7",
        "id": "17",
        "pIds": "0,1,7,"
    },
    {
        "name": "公司领导",
        "pId": "22",
        "id": "23",
        "pIds": "0,1,7,22,"
    },
    {
        "name": "公司领导",
        "pId": "17",
        "id": "18",
        "pIds": "0,1,7,17,"
    },
    {
        "name": "综合部",
        "pId": "22",
        "id": "24",
        "pIds": "0,1,7,22,"
    },
    {
        "name": "综合部",
        "pId": "17",
        "id": "19",
        "pIds": "0,1,7,17,"
    },
    {
        "name": "市场部",
        "pId": "17",
        "id": "20",
        "pIds": "0,1,7,17,"
    },
    {
        "name": "市场部",
        "pId": "22",
        "id": "25",
        "pIds": "0,1,7,22,"
    },
    {
        "name": "技术部",
        "pId": "17",
        "id": "21",
        "pIds": "0,1,7,17,"
    },
    {
        "name": "技术部",
        "pId": "22",
        "id": "26",
        "pIds": "1,7,22,"
    }
];

export default res


let result = res.filter(o => o.pId == 0) // 一级 [ children:[]]

function formTreeData (data, result) {
    result.forEach(item => {
        item.children = []
        data.forEach(ele => {
            if (item.id == ele.pId) {
                // console.log('进来了', ele)
                item.children.push(ele)
            } 
        });
        formTreeData(data, item.children)
    })
    console.log('一级：', result)
}

formTreeData (res, result)