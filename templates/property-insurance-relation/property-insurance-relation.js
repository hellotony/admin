(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.property-insurance', {
                url: '/property-insurance',
                views: {
                    '@': {
                        templateUrl: 'templates/property-insurance-relation/property-insurance-relation.tpl.html',
                        controller: 'propertyInsurance'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('property-insurance', [])
        .config(config)
        .controller('propertyInsurance', function($scope, $state, DataService, $rootScope, _) {
            // 初始化数据
            $scope.initData = function() {
                $scope.bindInfo = {
                    id: null,
                    businessId: null,
                    employeeTypeId: null,
                    tplKey: null
                };
                $scope.employeeList = [{
                    id: null,
                    text: "请选择人群"
                }];
                $scope.smsModuleList = [{
                    'tplKey': null,
                    'name': '请选择'
                }];
            };
            // 获取企业列表
            $scope.loadBusinessId = function() {
                var businessParam = {
                    pageIndex: 1,
                    pageCount: 1000,
                    keywords: null,
                    sort: null,
                    orderBy: null
                };
                DataService.run("businessQueryAll", businessParam,
                    function(response) {
                        $scope.businessList = response.rows;
                        $scope.businessList.unshift({
                            id: null,
                            name: "请选择企业"
                        });
                    },
                    function(response) {

                    });
            };
            // 根据企业获取企业人群列表
            $scope.loadEmployeeType = function(businessId) {
                $scope.employeeList = $scope.employeeList.slice(0, 1);
                $scope.bindInfo.employeeTypeId = null;
                if (businessId) {
                    DataService.run("businessEmployeeQuery", {
                            'businessId': businessId
                        },
                        function(response) {
                            if (response["model"].length > 0) {
                                $scope.employeeList = $scope.employeeList.concat(response["model"]);
                                for (var i = 1; i < $scope.employeeList.length; i++) {
                                    $scope.employeeList[i].text = $scope.employeeList[i].name + " (人群ID: " + $scope.employeeList[i].id + ")";
                                }
                            }
                        },
                        function(response) {

                        });
                }
            };
            // 根据企业获取企业短信模板
            $scope.loadMsgTpl = function(businessId) {
                var params = {
                    businessId: businessId,
                    pageIndex: 1,
                    pageCount: 100
                };
                $scope.bindInfo.tplKey = null;
                DataService.run("msgTplQueryAll", params,
                    function(response) {
                        $scope.smsModuleList = response["rows"] || [];
                        $scope.smsModuleList.unshift({
                            tplKey: null,
                            'name': '请选择'
                        });
                    },
                    function(response) {

                    });
            };
            // 获取产险礼品数据
            $scope.loadNotBoundRelation = function() {
                DataService.run("getNotBoundRelation", {
                        pageIndex: 1,
                        pageCount: 20
                    },
                    function(response) {
                        $scope.notBoundRelList = response["model"] || [];
                        $scope.notBoundRelList.unshift({
                            'id': null,
                            'giftName': '请选择产险礼品'
                        });
                    },
                    function(response) {

                    });

            };
            // 查看已绑定的产险数据关系
            $scope.loadBindRelation = function(pageIndex) {
                var paramPageIndex = pageIndex ? pageIndex : 1;
                DataService.run("getAllBoundRelation", {
                        pageIndex: paramPageIndex,
                        pageCount: 20
                    },
                    function(response) {
                        $scope.BoundRelList = response["rows"] || [];
                    },
                    function(response) {

                    });
            };
            // 页面初始化
            $scope.init = function() {
                $scope.initData();
                $scope.loadNotBoundRelation();
                $scope.loadBusinessId();
                $scope.loadBindRelation();
            };
            // 绑定产险数据关系
            $scope.bind = function() {
                DataService.run("bindRelation", $scope.bindInfo,
                    function(response) {
                        $scope.initData();
                        $scope.loadNotBoundRelation();
                        $scope.loadBindRelation();
                    },
                    function(response) {

                    });
            };
            $scope.init();
        });
})();