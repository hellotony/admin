(function() {
    'use strict';

    function dataService($http, $rootScope) {
        var serverUrl = null;
        var tfsPath = null;
        //var serverUrl = "http://10.0.78.15/insmall/employ/";
        if (location.host.indexOf("pre.jk.cn") != -1 || location.host.indexOf("pre.pajk-ent.com") != -1) {
            //预发环境
            serverUrl = "http://ecenter.pre.pajk-ent.com/";
            tfsPath = 'http://static.jk.cn/';
        } else if (location.host.indexOf("jk.cn") != -1 || location.host.indexOf("pajk-ent.com") != -1) {
            //正式环境
            serverUrl = "http://ecenter.pajk-ent.com/";
            tfsPath = 'http://static.jk.cn/';
        } else if (location.host.indexOf("test.pajkdc.com") != -1) {
            // 测试环境
            serverUrl = "http://ecenter.test.pajkdc.com/";
            tfsPath = 'http://static.test.pajkdc.com/v1/tfs/';
        } else {
            //开发环境
            // serverUrl = "http://10.0.74.126:8080/";
            serverUrl = "http://ecenter.dev.pajkdc.com/";
            // serverUrl = "http://ecenter.test.pajkdc.com/";

            tfsPath = 'http://static.dev.pajkdc.com/v1/tfs/';
        }
        serverUrl = serverUrl+"admin/";
        var serverActions = null;

        function setBusinessId(businessId) {
            window.localStorage.setItem("businessId", businessId);
            initialServerAction();
        }

        function setBusinessInfo(businessInfo) {
            window.localStorage.setItem("businessInfo", JSON.stringify(businessInfo));
            initialServerAction();
        }

        function setEmployeeId(employeeId) {
            window.localStorage.setItem("employeeTypeId", employeeId);
            initialServerAction();
        }

        function setChannelId(channelId) {
            window.localStorage.setItem("channelId", channelId);
            initialServerAction();
        }

        function getBusinessId() {
            var businessId = window.localStorage.getItem("businessId");
            return businessId;
        }

        function getBusinessInfo() {
            var businessInfo = JSON.parse(window.localStorage.getItem("businessInfo"));
            return businessInfo;
        }

        function getEmployeeId() {
            var employeeTypeId = window.localStorage.getItem("employeeTypeId");
            return employeeTypeId;
        }

        function getChannelId() {
            var channelId = window.localStorage.getItem("channelId");
            return channelId;
        }

        function getTfsUrl() {
            return tfsPath;
        }

        function initialServerAction() {
            serverActions = {
                //根据关键字筛选企业
                "businessQueryAll": {
                    action: "business/queryAll",
                    method: "GET",
                    initailParam: {
                        keywords: null,
                        orderBy: null,
                        sort: null,
                        pageIndex: null,
                        pageCount: 20
                    },
                    response: {},
                    isMock: false,
                    mockUrl: 'common/mockdata/businessList.json'

                },
                //查看企业
                "businessQuery": {
                    action: "business/query",
                    method: "GET",
                    initailParam: {
                        id: null
                    },
                    response: {}
                },
                //创建企业
                "businessCreate": {
                    action: "business/create",
                    method: "POST",
                    initailParam: {

                    },
                    response: {}
                },
                //修改企业
                "businessUpdate": {
                    action: "business/update",
                    method: "POST",
                    initailParam: {

                    },
                    response: {}
                },
                //删除企业logo
                "deleteStartLogo": {
                    action: "business/deleteStartLogo",
                    method: "DELETE",
                    initailParam: {
                        
                    },
                    response: {}
                },
                //查看企业人群
                "businessEmployeeQuery": {
                    action: "businessEmployeeType/query",
                    method: "GET",
                    initailParam: {
                        businessId: getBusinessId()
                    },
                    response: {}
                },
                //修改企业人群
                "businessEmployeeUpdate": {
                    action: "businessEmployeeType/update",
                    method: "POST",
                    initailParam: {
                        id: null,
                        name: null,
                        businessId: getBusinessId(),
                    },
                    response: {}
                },
                //创建企业人群
                "businessEmployeeCreate": {
                    action: "businessEmployeeType/create",
                    method: "POST",
                    initailParam: {
                        name: null,
                        businessId: getBusinessId(),
                    },
                    response: {}
                },
                //APP查询
                "aboutusQuery": {
                    action: "aboutus/queryAll",
                    method: "GET",
                    initailParam: {},
                    response: {}
                },
                //APP信息修改
                "aboutusUpdate": {
                    action: "aboutus/update",
                    method: "PUT",
                    initailParam: {
                        id: null,
                        title: null,
                        versionNo: null,
                        versionCode: null,
                        orgPicture: null,
                        picture: null,
                        url: null,
                        forceUpdate: null,
                        updateDate: null,
                        size: null,
                        platform: null,
                        changeLog: null,
                        description: null,
                        enable: null
                    },
                    response: {}
                },
                //APP信息创建
                "aboutusCreate": {
                    action: "aboutus/create",
                    method: "POST",
                    initailParam: {
                        id: null,
                        title: null,
                        versionNo: null,
                        versionCode: null,
                        orgPicture: null,
                        picture: null,
                        url: null,
                        forceUpdate: null,
                        updateDate: null,
                        size: null,
                        platform: null,
                        changeLog: null,
                        description: null,
                        enable: false
                    },
                    response: {}
                },
                //查看操作行为日志
                "loggerQuery": {
                    action: "logger/query",
                    method: "GET",
                    initailParam: {},
                    response: {}
                },
                //查看某个操作行为影响的数据表
                "loggerDetailQuery": {
                    action: "logger/detail",
                    method: "GET",
                    initailParam: {
                        actionId: null
                    },
                    response: {}
                },
                //查看某个数据表日志的详细信息
                "detailContentQuery": {
                    action: "logger/detailContent",
                    method: "GET",
                    initailParam: {
                        loggerId: null
                    },
                    response: {}
                },
                //查看全部服务信息
                "serviceQueryAll": {
                    action: "commonServicePool/queryAll",
                    method: "GET",
                    initailParam: {},
                    response: {}
                },
                //创建服务信息
                "commonServiceCreate": {
                    action: "commonServicePool/create",
                    method: "POST",
                    initailParam: {},
                    response: {}
                },
                //修改服务信息
                "commonServiceUpdate": {
                    action: "commonServicePool/update",
                    method: "PUT",
                    initailParam: {},
                    response: {}
                },
                //强制禁用服务
                "forceDisableService": {
                    action: "commonServicePool/forceDisable",
                    method: "GET",
                    initailParam: {
                        id: null
                    },
                    response: {}
                },
                //查询员工列表
                "employeeQuery": {
                    action: "employee/queryByBusiness",
                    method: "GET",
                    initailParam: {
                        businessId: getBusinessId()
                    },
                    response: {}
                },
                //创建员工
                "employeeCreate": {
                    action: "employee/create",
                    method: "POST",
                    initailParam: {},
                    response: {}
                },
                //修改员工
                "employeeUpdate": {
                    action: "employee/update",
                    method: "PUT",
                    initailParam: {},
                    response: {}
                },
                //批量导入员工数据
                "employeeImport": {
                    action: "employee/import",
                    method: "POST",
                    initailParam: {
                        businessId: getBusinessId(),
                        file: null
                    },
                    response: {}
                },
                //查看全部企业服务信息
                "businessServiceQuery": {
                    action: "businessServicePool/queryAll",
                    method: "GET",
                    initailParam: {
                        businessId: getBusinessId(),
                    },
                    response: {}
                },
                //创建企业服务信息
                "businessServiceCreate": {
                    action: "businessServicePool/create",
                    method: "POST",
                    initailParam: {
                        businessId: getBusinessId(),
                    },
                    response: {}
                },
                //修改服务信息
                "businessServiceUpdate": {
                    action: "businessServicePool/update",
                    method: "PUT",
                    initailParam: {
                        businessId: getBusinessId(),
                    },
                    response: {}
                },
                //查看某个企业人群服务信息
                "employeeTypeServiceQuery": {
                    action: "employeeTypeServicePool/query",
                    method: "GET",
                    initailParam: {},
                    response: {}
                },
                //查看全部企业人群服务信息
                "employeeTypeServiceQueryAll": {
                    action: "employeeTypeServicePool/queryAll",
                    method: "GET",
                    initailParam: {
                        employeeTypeId: getEmployeeId(),
                    },
                    response: {}
                },
                //创建企业人群服务信息
                "employeeTypeServiceCreate": {
                    action: "employeeTypeServicePool/create",
                    method: "POST",
                    initailParam: {
                        employeeTypeId: getEmployeeId(),
                        businessServicePoolId: null,
                        enable: null,
                    },
                    response: {}
                },
                //修改企业人群服务信息
                "employeeTypeServiceUpdate": {
                    action: "employeeTypeServicePool/update",
                    method: "PUT",
                    initailParam: {
                        employeeTypeId: getEmployeeId(),
                        businessServicePoolId: null,
                        enable: null,
                    },
                    response: {}
                },
                //查看全部企业消息
                "newsQueryAll": {
                    action: "/news/queryAll",
                    method: "GET",
                    initailParam: {
                        businessId: 0, //  企业ID
                        title: null, //   标题（可空）
                        type: null, //   消息类型（可空）
                        orderBy: null, // 排序字段（可空）
                        sort: null, //   升降序（默认降序）
                        pageIndex: 1, //   页数（默认1）
                        pageCount: 20, //  每页数据（默认20）
                    },

                    isMock: false,
                    mockUrl: 'common/mockdata/NewsList.json',
                    response: {}
                },
                //根据ID查看企业消息
                "newsQuery": {
                    action: "/news/query",
                    method: "GET",
                    initailParam: {
                        id: 0, //  消息ID
                    },
                    isMock: true,
                    mockUrl: 'common/mockdata/NewsDetail.json',
                    response: {}
                },
                //创建企业消息
                "newsCreate": {
                    action: "/news/create",
                    method: "POST",
                    initailParam: {
                        title: null,
                        businessId: null,
                        type: null,
                        content: null,
                        enable: null,
                        gmtCreate: null,
                        gmtModified: null,
                        employeeTypeNewsList: [{
                            employeeTypeId: null
                        }]
                    },
                    response: {}
                },
                //修改企业服务信息
                "newsUpdate": {
                    action: "/news/update",
                    method: "PUT",
                    initailParam: {
                        id: null,
                        title: null,
                        businessId: null,
                        type: null,
                        content: null,
                        enable: null,
                        gmtCreate: null,
                        gmtModified: null,
                        employeeTypeNewsList: [{
                            employeeTypeId: null
                        }]
                    },
                    response: {}
                },
                // 根据ID查看渠道用户详情
                "channelQuery": {
                    action: "channel/queryUser",
                    method: "GET",
                    initailParam: {
                        id: null,
                    },
                    response: {}
                },
                // 查看渠道信息列表
                "channelQueryAll": {
                    action: "channel/queryAll",
                    method: "GET",
                    initailParam: {
                        pageIndex: null,
                        pageCount: null
                    },
                    response: {}
                },
                // 创建渠道信息
                "channelCreate": {
                    action: "channel/create",
                    method: "POST",
                    initailParam: {},
                    response: {}
                },
                // 修改渠道信息
                "channelUpdate": {
                    action: "channel/update",
                    method: "PUT",
                    initailParam: {},
                    response: {}
                },
                //根据ID查看橱窗信息
                "showcaseQuery": {
                    action: "showcase/query",
                    method: "GET",
                    initailParam: {
                        id: null,
                    },
                    response: {}
                },
                //查看橱窗信息列表
                "showcaseQueryAll": {
                    action: "showcase/queryAll",
                    method: "GET",
                    initailParam: {
                        businessId: null,
                        pageIndex: null,
                        pageCount: 20,
                    },
                    response: {}
                },
                //修改橱窗信息
                "showcaseUpdate": {
                    action: "showcase/update",
                    method: "PUT",
                    initailParam: {},
                    response: {}
                },
                // 查看渠道用户列表
                "channelQueryAllUser": {
                    action: "channel/queryAllUser",
                    method: "GET",
                    initailParam: {
                        channelId: getChannelId(),
                        pageIndex: 1,
                        pageCount: 20
                    },
                    response: {}
                },

                //创建橱窗信息
                "showcaseCreate": {
                    action: "showcase/create",
                    method: "POST",
                    initailParam: {},
                    response: {}
                },
                //查看发送数据列表
                "sendMessageQueryAll": {
                    action: "sendMessage/queryAll ",
                    method: "PUT",
                    initailParam: {},
                    response: {},
                    isMock: false,
                    mockData: {}
                },
                //通过EXCEL文件批量导入用户信息
                "sendMessageImportUser": {
                    action: "sendMessage/import/user",
                    method: "POST",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //通过EXCEL文件批量导入卡密信息
                "sendMessageImportCard": {
                    action: "sendMessage/import/card",
                    method: "POST",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //批量发送短信
                "sendMessageBatchSend": {
                    action: "sendMessage/batchSend",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //清空未发送的卡密信息
                "sendMessageClearCardSecret": {
                    action: "sendMessage/clearCardSecret",
                    method: "DELETE",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //清除未绑卡的数据
                "sendMessageClearUnbindCard": {
                    action: "sendMessage/clearUnbindCard",
                    method: "DELETE",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //重发短信
                "sendMessageResend": {
                    action: "sendMessage/reSend",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //查询短信模板
                "msgTplQueryAll": {
                    action: "messageTemplate/queryAll",
                    method: "GET",
                    initailParam: {
                        businessId: getBusinessInfo() && getBusinessInfo()["id"] || "",
                        pageIndex: 1,
                        pageCount: 20,
                    },
                    response: {},
                    isMock: false,
                    mockData: {
                        "pageInfo": {
                            "pageCount": 20,
                            "pageIndex": 1,
                            "totalCount": 1
                        },
                        "rows": [{
                            "id": 1001,
                            "name": "模板1",
                            "content": "模板1内容"
                        }, {
                            "id": 1002,
                            "name": "模板2",
                            "content": "模板2内容"
                        }, {
                            "id": 1003,
                            "name": "模板3",
                            "content": "模板3内容"
                        }]
                    }
                },
                //创建短信模板
                "msgTplCreate": {
                    action: "messageTemplate/create",
                    method: "POST",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //修改短信模板
                "msgTplUpdate": {
                    action: "messageTemplate/update",
                    method: "PUT",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //删除短信模板
                "smsModuleDelete": {
                    action: "messageTemplate/delete",
                    method: "DELETE",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //数据统计查询
                "statisticsQuery": {
                    action: "statistic/queryAll",
                    method: "POST",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //查询企业员工集合信息
                "queryemployee": {
                    action: "datamgt/queryemployee",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //导出企业员工集合信息
                "exportemployee": {
                    action: "datamgt/exportemployee",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //查询保单集合信息
                "querypolicy": {
                    action: "datamgt/querypolicy",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //导出保单集合信息
                "exportpolicy": {
                    action: "datamgt/exportpolicy",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //创建角色
                "roleCreate": {
                    action: "role/create",
                    method: "POST",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //删除角色
                "roleDelete": {
                    action: "role/delete",
                    method: "DELETE",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //修改角色
                "roleUpdate": {
                    action: "role/update",
                    method: "PUT",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //查看角色列表
                "roleQueryAll": {
                    action: "role/queryAll",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //查看角色
                "roleQuery": {
                    action: "role/query",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //查看角色拥有的权限
                "roleAuthQuery": {
                    action: "roleAuth/queryByRoleId",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                    needSpecialFunc: true
                },
                //修改角色拥有的权限
                "roleAuthUpdate": {
                    action: "roleAuth/update",
                    method: "PUT",
                    initailParam: {},
                    response: {},
                    isMock: false,
                    // needSpecialFunc: true
                },
                //创建角色用户
                "roleUserCreate": {
                    action: "roleUser/create",
                    method: "POST",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //删除角色用户
                "roleUserDelete": {
                    action: "roleUser/delete",
                    method: "DELETE",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //查看角色用户
                "getRoleUserByRoleId": {
                    action: "roleUser/queryByRoleId",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //查看全部管理模块
                "moduleQueryAll": {
                    action: "module/queryAll",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //修改管理模块
                "moduleUpdate": {
                    action: "module/update",
                    method: "PUT",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //查看已绑定的产险数据关系
                "getAllBoundRelation": {
                    action: "propertyInsuranceRelation/queryAll/bound",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //绑定产险数据关系
                "bindRelation": {
                    action: "propertyInsuranceRelation/update",
                    method: "POST",
                    initailParam: {},
                    response: {},
                    isMock: false,
                },
                //获取产险礼品数据
                "getNotBoundRelation": {
                    action: "propertyInsuranceRelation/queryAll/notBound",
                    method: "GET",
                    initailParam: {},
                    response: {},
                    isMock: false,
                }
            }
        }

        initialServerAction();

        return {
            setBusinessId: setBusinessId,
            setEmployeeId: setEmployeeId,
            setChannelId: setChannelId,
            setBusinessInfo: setBusinessInfo,
            getBusinessId: getBusinessId,
            getEmployeeId: getEmployeeId,
            getChannelId: getChannelId,
            getBusinessInfo: getBusinessInfo,
            getTfsUrl: getTfsUrl,
            getUrl: function(actionName, data) {
                var curAction = serverActions[actionName];
                var httpConfig = {
                    method: curAction.method,
                    withCredentials: true,
                    url: serverUrl + curAction.action
                };
                data = data || {};

                var finalData = angular.extend({}, curAction.initialParam, data);

                var params = [];
                for (var d in finalData) {
                    if (finalData[d] != null) {
                        params.push(d + "=" + finalData[d]);
                    }
                }
                return httpConfig.url += "?" + encodeURI(params.join("&"));
            },
            getInitialParam: function(actionName) {
                var curAction = serverActions[actionName];
                return curAction.initailParam;
            },
            getResponse: function(actionName) {
                return serverActions[actionName].response;
            },
            run: function(actionName, data, successFunc, errFunc) {
                //  actionName为serverActions的key 
                //  data为参数，如果不传，则使用初始化时那个对象
                var curAction = serverActions[actionName];

                // get 请求暂时不显示loading
                if (curAction.method.toUpperCase() != "GET") {
                    $rootScope.showLoading();
                }


                // mock逻辑判断
                if (curAction.isMock) {
                    // var url = null;
                    // $rootScope.hideLoading();
                    // if (curAction.isMock && curAction.mockUrl) {
                    //     url = curAction.mockUrl;
                    // }
                    // $http({
                    //     method: 'get',
                    //     withCredentials: true,
                    //     params: data,
                    //     url: url
                    // }).success(function(result) {
                    //     if (successFunc) successFunc(result);
                    // })
                    console.log(data || curAction.initailParam);
                    $rootScope.hideLoading();
                    curAction.response = curAction.mockData;
                    successFunc(curAction.mockData);
                } else {
                    var httpConfig = {
                        method: curAction.method,
                        withCredentials: true,
                        headers: {
                            // 'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        url: serverUrl + curAction.action
                    };

                    var finalData = (data || curAction.initailParam);

                    if (curAction.method.toUpperCase() != "GET" && curAction.method.toUpperCase() != "DELETE") {
                        httpConfig.data = finalData;
                    } else {
                        httpConfig.params = finalData;
                    }

                    $http(httpConfig).success(function(result, status, header, config) {
                        $rootScope.hideLoading();
                        curAction.response = result;
                        // 处理异常
                        if (result["success"] == false) {
                            // if (result["errorCode"] === en_platform_need_login_error) {
                            if (en_platform_need_login(result["errorCode"])) {

                                // no valid login found
                                // alert("您无操作权限，或者操作权限已过期，请重新登录！");
                                window.location = en_platform_apis.weblogin_login + escape(window.location);
                                return;
                            } else {
                                // alert("错误码：" + result["errorCode"] + "，\n错误详情：" + result["errorMsg"]);
                                var msg = {
                                    errorCode: result["errorCode"],
                                    errorMsg: result["error"]
                                }
                                $rootScope.showToast("error", msg);
                                if (!curAction.needSpecialFunc) {
                                    return;
                                }

                            }

                        }
                        //异常提示


                        //如果设置了缓存，则缓存数据
                        if (curAction.needCache) {
                            window.localStorage.setItem(curAction.action, JSON.stringify(result))
                        }
                        if (successFunc) successFunc(result, status, header, config);
                        // }

                    }).error(function(result) {
                        $rootScope.hideLoading();
                        if (errFunc) errFunc(result);
                    });

                }
            },
            get: function() {
                return ['some', 'data'];
            },
            getAll: function(params, successFunc, errFunc) {
                var pageUrl;
                if (params.page == 1) {
                    pageUrl = 'common/mockdata/EmployeeList_1.json';
                } else {
                    pageUrl = 'common/mockdata/EmployeeList_2.json';
                }

                $http({
                    method: 'get',
                    withCredentials: true,
                    params: params,
                    url: pageUrl
                }).success(function(result) {
                    if (successFunc) successFunc(result);
                }).error(function(result) {
                    if (errFunc) errFunc(result);
                });

            },
        };
    }

    angular.module('common.services.data', [])
        .factory('DataService', dataService);

    angular.module('underscore', []).factory('_', ['$window',
        function($window) {
            return $window._; // assumes underscore has already been loaded on the page
        }
    ]);

})();