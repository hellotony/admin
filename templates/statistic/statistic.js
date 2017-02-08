(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.statistic', {
                url: '/statistic',
                views: {
                    '@': {
                        templateUrl: 'templates/statistic/statistic.tpl.html',
                        controller: 'statistic'
                    }
                }
            })
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('statistic', [])
        .config(config)
        .controller('statistic', function($scope, $state, DataService, $rootScope) {
            $scope.dataRangeList = [{
                id: '0',
                name: '日'
            }, {
                id: '1',
                name: '周'
            }, {
                id: '2',
                name: '月'
            }, {
                id: '3',
                name: '季度'
            }, {
                id: '4',
                name: '年'
            }];
            $scope.detailC = [{
                value: true,
                text: "明细"
            }, {
                value: false,
                text: "总计"
            }];
            $scope.paramsInit = function() {
                $scope.searchParams = {
                    businessId: null,
                    employeeTypeId: null,
                    dateRangeType: '0',
                    statisticType: '0',
                    detail: false,
                    pageIndex: 1,
                    pageCount: 20
                };
                $scope.employeeList = [{id: null, text: "请选择人群"}];
            }

            $scope.loadEmployee = function(businessId) {
                $scope.employeeList = $scope.employeeList.slice(0, 1);
                $scope.searchParams.employeeTypeId = null;
                if (businessId) {
                    DataService.run("businessEmployeeQuery", {
                            'businessId': businessId
                        },
                        function(response) {
                            if (response["model"].length > 0){
                                $scope.employeeList = $scope.employeeList.concat(response["model"]);
                                for (var i=1; i<$scope.employeeList.length; i++) {
                                    $scope.employeeList[i].text = $scope.employeeList[i].name+ " (人群ID: "+$scope.employeeList[i].id+ ")";
                                }
                            }
                        },
                        function(response) {

                        });
                }
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
                        $scope.businessList.unshift({id: null, name: "请选择企业"});
                    },
                    function(response) {

                    });
            }

            $scope.loadData = function() {
                DataService.run("statisticsQuery", $scope.searchParams,
                    function(response) {
                        $scope.show = {
                            tdFlag: $scope.searchParams.detail,
                            titleType:  $scope.searchParams.statisticType
                        };
                        $scope.pageInfo = response.pageInfo;
                        $scope.statisticList = response.rows;
                    },
                    function(response) {

                    });
            }

            $scope.init = function() {
                $scope.loadBusiness();
                $scope.paramsInit();
                $scope.loadData();
            }
            $scope.init();

            $scope.pageChanged = function() {
                $scope.searchParams.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadData();
            }

            $scope.transData = function(id, type) {
                var list = [], name = "";
                if (type == "business") {
                    list = $scope.businessList;
                } else if ('dataRange') {
                    list = $scope.dataRangeList;
                }
                for (var i=0; i<list.length; i++) {
                    if (id == list[i].id) {
                        name = list[i].name;
                        break;
                    }
                }
                return name;
            }
        })
})();