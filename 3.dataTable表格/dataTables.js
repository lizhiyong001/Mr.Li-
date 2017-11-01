/**
 * Created by lizhiyong on 2017/11/01.
 * named as 表格
 */
define(['dataTable'],function(){
    function table(emptyInfo,obj,tableParam,URL,columns,outParam,initComplete){
        //提示信息
        var lang = {
            "sProcessing": "processing...",
            "sLengthMenu": "每页 _MENU_ 项",
            "sZeroRecords": emptyInfo,
            "sInfo": "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
            "sInfoEmpty": "当前显示第 0 至 0 项，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sEmptyTable": "",
            "sLoadingRecords": "Loading...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页",
                "sJump": "跳转"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        };
        //初始化表格
        var table = $(obj).dataTable({
            language:lang,  //提示信息
            autoWidth: false,  //禁用自动调整列宽
            stripeClasses: ["odd", "even"],  //为奇偶行加上样式，兼容不支持CSS伪类的场合
            processing: false,  //隐藏加载提示,自行处理
            serverSide: true,  //启用服务器端分页
            searching: false,  //禁用原生搜索
            orderMulti: false,  //启用多列排序
            ordering: false,
            paging:true,
            lengthChange:false,
            pageLength: tableParam.pageLength,
            destroy: true,
            order: [],  //取消默认排序查询,否则复选框一列会出现小箭头
            pagingType: "full_numbers",  //分页样式：simple,simple_numbers,full,full_numbers
            ajax: function (data, callback,settings) {
                //封装请求参数
                var param = {};
                param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
                param.start = data.start;//开始的记录序号
                param.page = (data.start / data.length)+1;//当前页码
                param.outParam = outParam;
                //ajax请求数据
                $.ajax({
                    type: "post",
                    url: URL,
                    cache: false,  //禁用缓存
                    data: param,  //传入组装的参数
                    dataType: "json",
                    success: function (result) {
                        //setTimeout仅为测试延迟效果
                        $('#tableList_length').css('display','none');
                        setTimeout(function () {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.total;//返回当前条件下数据全部记录
                            returnData.recordsFiltered = result.data.total;//后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.data;//返回的数据列表
                            if(outParam.hideObj){
                                returnData.orderTotal = result.data.orderTotal;  // 全部条件下总数据条数
                                $(outParam.hideObj).text('('+returnData.orderTotal+')');
                                if(returnData.orderTotal == 0){
                                    $(outParam.hideObj).parent().hide();
                                }
                            }
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        }, 200);
                    }
                });
            },
            //列表表头字段
            columns: columns,
            initComplete:initComplete
        }).api();
        //此处需调用api()方法,否则返回的是JQuery对象而不是DataTables的API对象
    }
    //初始化会议详情数据

    var init = function(emptyInfo,obj,tableParam,URL,columns,outParam,initComplete){
        $.fn.dataTable.ext.errMode = 'none';
        table(emptyInfo,obj,tableParam,URL,columns,outParam,initComplete);
    };
    return {
        table: init
    }
});