(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.business-sms', {
                url: '/business-sms/:businessId',
                views: {
                    '@': {
                        templateUrl: 'templates/business-sms/business-sms.tpl.html',
                    }
                }
            })
            .state('root.business-sms-module', {
                url: '/business-sms-module/:businessId',
                views: {
                    '@': {
                        templateUrl: 'templates/business-sms/business-sms-module.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('business-sms', [])
        .config(config)
        .controller('smsManager', function($scope, $state, DataService, $rootScope) {
            $scope.businessId = $state.params.businessId;
            $scope.titleInfo = {
                'title': "企业管理",
                'href': '#/business',
                'subtitle': '短信发送管理'
            };
            $scope.businessInfo = DataService.getBusinessInfo();
            $scope.initParam = function() {
                $scope.smsSearchInfo = {
                    'businessId': $scope.businessId,
                    'pageIndex': 1,
                    'pageCount': 20,
                    'employeeTypeId': null,
                    'name': null,
                    'mobile': null,
                    'tplKey': null,
                    'isSent': null,
                    'cardNo': null
                }
            }
            $scope.getEmployeeName = function(id) {
                if ($scope.employeeList) {
                    for (var i = 0; i < $scope.employeeList.length; i++) {
                        if (id == $scope.employeeList[i].id) {
                            return $scope.employeeList[i].name;
                        }
                    }
                }
            }
            $scope.loadSMSInfo = function() {
                $scope.smsSearchInfo.name == ""? $scope.smsSearchInfo.name = null:'';
                $scope.smsSearchInfo.mobile == ""? $scope.smsSearchInfo.mobile = null:'';
                $scope.smsSearchInfo.cardNo == ""? $scope.smsSearchInfo.cardNo = null:'';
                DataService.run("sendMessageQueryAll", $scope.smsSearchInfo,
                    function(response) {
                        $scope.smsManagerList = response.rows;
                        $scope.pageInfo = response.pageInfo;
                        $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                    },
                    function(response) {

                    });
            }
            $scope.loadEmployee = function() {
                var param = {
                    businessId: $scope.businessId
                }
                DataService.run("businessEmployeeQuery", param,
                    function(response) {
                        $scope.employeeList = response["model"] || [];
                        $scope.employeeList.unshift({
                            id: null,
                            'name': '请选择'
                        })
                    },
                    function(response) {

                    });
            }
            $scope.loadMsgTpl = function() {
                var params = angular.copy(DataService.getInitialParam("msgTplQueryAll"));
                params.pageCount = 100;
                DataService.run("msgTplQueryAll", params,
                    function(response) {
                        $scope.smsModuleList = response["rows"] || [];
                        $scope.smsModuleList.unshift({
                            tplKey: null,
                            'name': '请选择'
                        })
                    },
                    function(response) {

                    });
            }
            $scope.initParam();
            $scope.loadEmployee();
            $scope.loadMsgTpl();
            $scope.loadSMSInfo();

            $scope.pageChanged = function() {
                $scope.smsSearchInfo.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadSMSInfo();
            }

            $scope.openModal = function(flag, smsManagerInfo) {
                $scope.operation = flag;
                $rootScope.modalStus(true);
                if ($scope.operation == 'importInfo') {

                } else if ($scope.operation == 'importPsd') {


                } else if ($scope.operation == 'SMS') {
                    $scope.sms = {
                        employeeTypeId: null,
                        tplKey: null
                    }
                } else if ($scope.operation == 'show') {
                    $scope.smsManagerInfo = angular.copy(smsManagerInfo)
                }
                $scope.modalShow = "show";
            }

            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.operation = null;
                $rootScope.modalStus(false);
                $scope.smsManagerInfo ? $scope.smsManagerInfo = {} : "";
            }

            $scope.dataServiceRun = function(serviceName, params, func) {
                DataService.run(serviceName, params,
                    function(response) {
                        // alert(JSON.stringify(response));
                        $scope.closeModal();
                        setTimeout($scope.loadSMSInfo(), 500);
                        if (func) {
                            func();
                        }
                    },
                    function(response) {

                    });
            }

            $scope.saveSMSManagerInfo = function(flag, info) {

                var serviceName = "";
                var pageIndex = 1;
                var operation = $scope.operation;
                var needToast = false;
                var func = null;
                if (flag) {
                    operation = flag;
                }
                var params = {};
                if (operation == 'SMS') {
                    serviceName = 'sendMessageBatchSend';
                    params = angular.copy($scope.sms);
                    params.businessId = $scope.businessId;
                    func = function() {
                        $rootScope.showToast("success", "短信已发送！温馨提示：由于发送短信为异步操作，短信发送成功可能会稍有延迟，请稍后手动刷新页面查看短信发送状态，谢谢~");
                    }
                } else if (operation == 'importCard') {
                    needToast = true;
                    $rootScope.showToast("confirm", "请确认导入的卡密是否与导入的员工数量相匹配，如果卡密数量多于员工数量，会造成多于卡密的浪费，确定现在导入卡密吗？", function() {
                        serviceName = 'sendMessageImportCard';
                        params.file = $scope.fileBase64;
                        $scope.dataServiceRun(serviceName, params);
                    });

                } else if (operation == 'importUser') {
                    serviceName = 'sendMessageImportUser';
                    params.file = $scope.fileBase64;
                } else if (operation == 'clearCardSecret') {
                    needToast = true;
                    $rootScope.showToast("confirm", "确认清空未发送的卡密信息吗？", function() {
                        serviceName = 'sendMessageClearCardSecret';
                        params.businessId = $scope.businessId;
                        $scope.dataServiceRun(serviceName, params);
                    });

                } else if (operation == 'clearUnbindCard') {
                    needToast = true;
                    $rootScope.showToast("confirm", "确认清除未绑卡的数据吗？", function() {
                        serviceName = 'sendMessageClearUnbindCard';
                        params.businessId = $scope.businessId;
                        $scope.dataServiceRun(serviceName, params);
                    });

                } else if (operation == 'reSend') {
                    serviceName = 'sendMessageResend';
                    params.id = info.id;
                }
                if (!needToast) {
                    $scope.dataServiceRun(serviceName, params, func);
                }

            }

            $scope.chooseFile = function() {
                var file = event.target.files[0];
                if (file) {
                    //做格式校验 一般情况下，excel后缀是".xls"，在2007以及以后的版本中又增加了".xlsx"。excel的模板文件后缀名是".xlt"，启动宏的工作簿后缀名是".xlsm"。
                    var fileName = file.name;
                    var suffix = (fileName.lastIndexOf('.')>-1) && fileName.substring(fileName.lastIndexOf('.')+1) || '';
                    if (suffix != 'xls' && suffix != 'xlsx' && suffix != 'xlt' && suffix != 'xlsm') {
                        $rootScope.showToast("error", "导入文件格式不对，请选择正确格式的文件");
                        $rootScope.$apply();
                        event.target.value = "";
                        return;
                    }
                    $scope.reader = new FileReader();
                    $scope.reader.onloadend = function(evt) {
                        //读取后触发，无论成功或者失败
                        if ($scope.reader.error) {
                            console.log("error");
                        } else {
                            var base64 = evt.target.result;
                            $scope.fileBase64 = base64;
                        }
                    }
                    $scope.reader.readAsDataURL(file);
                }
            }

        })
        .controller('smsModule', function($scope, $state, DataService, $rootScope) {
            $scope.businessId = $state.params.businessId;
            $scope.titleInfo = {
                title: '短信发送管理',
                href: '#/business-sms/' + $scope.businessId,
                subtitle: '短信模板管理'
            }

            $scope.title = 'Lorem Ipsum';
            $scope.link = "https://google.com";
            $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';

            $scope.smsParam = {
                pageIndex: 1,
                pageCount: 20,
                businessId: $scope.businessId
            }
            $scope.loadSMSModuleInfo = function() {
                DataService.run("msgTplQueryAll", $scope.smsParam,
                    function(response) {
                        $scope.smsManagerList = response.rows;
                        $scope.pageInfo = response.pageInfo;
                        $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                    },
                    function(response) {

                    });
            }
            $scope.loadSMSModuleInfo();

            $scope.openModal = function(flag, smsManagerInfo) {
                $scope.operation = flag;
                $rootScope.modalStus(true);
                if (smsManagerInfo) {
                    $scope.smsManagerInfo = angular.copy(smsManagerInfo);
                } else {
                    $scope.smsManagerInfo = {
                        name: null,
                        content: null,
                    }
                }
                $scope.modalShow = "show";
            }

            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.operation = null;
                $scope.smsManagerInfo = {};
                $rootScope.modalStus(false);
            }

            $scope.pageChanged = function() {
                $scope.smsParam.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadSMSModuleInfo();
            }

            $scope.saveSMSManagerInfo = function(id) {
                if (id) {
                    $scope.operation = 'del';
                }
                var serviceName = "";
                var pageIndex = 1;
                var operation = $scope.operation;
                var params = "";
                if ($scope.operation == 'del') {
                    serviceName = 'smsModuleDelete';
                    params = {
                        'id': id
                    };
                    $rootScope.showToast("confirm", "确认删除模板吗？", function() {
                        DataService.run(serviceName, params,
                            function(response) {
                                // alert(JSON.stringify(response));
                                $scope.smsParam.pageIndex = pageIndex;
                                $scope.loadSMSModuleInfo();
                                $scope.closeModal();
                            },
                            function(response) {

                            });
                    });

                } else {
                    $scope.smsManagerInfo.businessId = $scope.businessId;
                    params = $scope.smsManagerInfo;
                    if ($scope.operation == 'create') {
                        serviceName = 'msgTplCreate';
                    } else if ($scope.operation == 'edit') {
                        serviceName = 'msgTplUpdate';
                        pageIndex = $scope.smsParam.pageIndex;
                    }
                    DataService.run(serviceName, params,
                        function(response) {
                            // alert(JSON.stringify(response));
                            $scope.smsParam.pageIndex = pageIndex;
                            $scope.loadSMSModuleInfo();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                }


            }
        });
})();