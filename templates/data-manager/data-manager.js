(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.employee-info', {
                url: '/employee-info',
                views: {
                    '@': {
                        templateUrl: 'templates/data-manager/employee-info.tpl.html',
                        controller: 'employeeInfo'
                    }
                }
            })
            .state('root.policy-info', {
                url: '/policy-info',
                views: {
                    '@': {
                        templateUrl: 'templates/data-manager/policy-info.tpl.html',
                        controller: 'policyInfo'
                    }
                }
            })
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('data-manager', [])
        .config(config)
        .controller('employeeInfo', function($scope, $state, DataService, $rootScope) {
            $scope.activeStatusList = [{
                id: null,
                text: '请选择激活状态'
            }, {
                id: 1,
                text: '已激活'
            }, {
                id: 0,
                text: '未激活'
            }];
            $scope.paramsInit = function() {
                $scope.searchParams = {
                    activeStatus: null,
                    businessId: ($scope.businessList && $scope.businessList[0].id) || null,
                    businessName: null,
                    employeeTypeId: null,
                    employeeTypeName: null,
                    endActiveDate: null,
                    startActiveDate: null,
                    pageIndex: 1,
                    pageCount: 20
                };
                $scope.employeeList = [{
                    id: null,
                    text: "请选择人群"
                }];
            }

            $scope.loadEmployee = function(businessId) {
                $scope.employeeList = $scope.employeeList.slice(0, 1);
                $scope.searchParams.employeeTypeId = null;
                $scope.searchParams.employeeTypeName = null;
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
            }

            $scope.transData = function(id, type) {
                var list = [],
                    name = "";
                if (type == "business") {
                    list = $scope.businessList;
                } else if ('employee') {
                    list = $scope.employeeList;
                }
                for (var i = 0; i < list.length; i++) {
                    if (id == list[i].id) {
                        name = list[i].name;
                        break;
                    }
                }
                return name;
            }

            $scope.loadData = function(pageIndex) {
                $scope.searchParams.businessName = $scope.transData($scope.searchParams.businessId, 'business');
                $scope.searchParams.employeeTypeName = $scope.transData($scope.searchParams.employeeTypeId, 'employee');
                $scope.searchParams.endActiveDate && typeof ($scope.searchParams.endActiveDate) != 'string' ? $scope.searchParams.endActiveDate = $rootScope.date2string($scope.searchParams.endActiveDate) : '';
                $scope.searchParams.startActiveDate && typeof ($scope.searchParams.startActiveDate) != 'string' ? $scope.searchParams.startActiveDate = $rootScope.date2string($scope.searchParams.startActiveDate) : '';

                if (pageIndex) {
                    $scope.searchParams.pageIndex = 1;
                }

                DataService.run("queryemployee", $scope.searchParams,
                    function(response) {
                        $scope.pageInfo = response.pageInfo;
                        $scope.employeeInfoList = response.rows;
                        $scope.businessName = $scope.searchParams.businessName;
                        var params = angular.copy($scope.searchParams);
                        delete params.pageIndex;
                        delete params.pageCount;
                        $scope.exportParams = params;
                    },
                    function(response) {

                    });
            }

            $scope.loadBusiness = function() {
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
                        $scope.paramsInit();
                        if ($scope.businessList.length > 0) {
                            $scope.loadEmployee($scope.businessList[0].id);
                        }
                        $scope.loadData();
                    },
                    function(response) {

                    });
            }



            $scope.loadBusiness();

            $scope.pageChanged = function() {
                $scope.searchParams.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadData();
            }


            $scope._export = function() {
                var url = DataService.getUrl("exportemployee", $scope.exportParams);
                window.location.href = url;
            }

            $scope.startDayOpen = function($event) {
                $scope.startDay.opened = true;
            };

            $scope.startDay = {
                opened: false
            };
            $scope.endDayOpen = function($event) {
                $scope.endDay.opened = true;
            };

            $scope.endDay = {
                opened: false
            };
        })
        .controller('policyInfo', function($scope, $state, DataService, $rootScope) {
            $scope.paramsInit = function() {
                $scope.searchParams = {
                    endLeadtime: null,
                    endUndwrtDate: null,
                    startLeadtime: null,
                    startUndwrtDate: null,
                    pageIndex: 1,
                    pageCount: 20
                };
            }

            $scope.loadData = function(pageIndex) {
                $scope.searchParams.endLeadtime && typeof ($scope.searchParams.endLeadtime) != 'string' ? $scope.searchParams.endLeadtime = $rootScope.date2string($scope.searchParams.endLeadtime) : '';
                $scope.searchParams.endUndwrtDate && typeof ($scope.searchParams.endUndwrtDate) != 'string' ? $scope.searchParams.endUndwrtDate = $rootScope.date2string($scope.searchParams.endUndwrtDate) : '';
                $scope.searchParams.startLeadtime && typeof ($scope.searchParams.startLeadtime) != 'string' ? $scope.searchParams.startLeadtime = $rootScope.date2string($scope.searchParams.startLeadtime) : '';
                $scope.searchParams.startUndwrtDate && typeof ($scope.searchParams.startUndwrtDate) != 'string' ? $scope.searchParams.startUndwrtDate = $rootScope.date2string($scope.searchParams.startUndwrtDate) : '';
                
                if (pageIndex) {
                    $scope.searchParams.pageIndex = 1;
                }

                DataService.run("querypolicy", $scope.searchParams,
                    function(response) {
                        $scope.pageInfo = response.pageInfo;
                        $scope.policyInfoList = response.rows;
                        var params = angular.copy($scope.searchParams);
                        delete params.pageIndex;
                        delete params.pageCount;
                        $scope.exportParams = params;
                    },
                    function(response) {

                    });
            }
            $scope.paramsInit();
            $scope.loadData();
            $scope.pageChanged = function() {
                $scope.searchParams.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadData();
            }
            $scope._export = function() {
                var url = DataService.getUrl("exportpolicy", $scope.exportParams);
                window.location.href = url;
            }
            $scope.transType = function(code) {
                var type = "";
                switch (code) {
                    case '1':
                        type = "身份证";
                        break;
                    case '2':
                        type = "护照";
                        break;
                    case '3':
                        type = "军官证/士兵证";
                        break;
                    case '6':
                        type = "港澳通行证/回乡证或台胞证";
                        break;
                    default:
                        type = "其他";
                        break;
                }
                return type;
            }
        })
})();