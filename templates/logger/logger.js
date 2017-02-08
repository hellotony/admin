(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.logger', {
                url: '/logger',
                views: {
                    '@': {
                        templateUrl: 'templates/logger/logger.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('logger', [])
        .config(config)
        .controller('logger', function($scope, $state, DataService, $rootScope) {
            $scope.paramInitial = function() {
                $scope.loggerAction = {
                    pageIndex: 1,
                    pageCount: 20,
                    staffName: null,
                    moduleName: null,
                    operationType: null,
                    operationDescription: null,
                    createStartTime: null,
                    createEndTime: null,
                    orderBy: null,
                    sort: null,
                }
            }
            $scope.operationTypeList = [{
                "value": null,
                "text": "请选择操作类型"
            }, {
                "value": 2,
                "text": "添加"
            }, {
                "value": 3,
                "text": "修改"
            }, {
                "value": 4,
                "text": "删除"
            }];

            function date2string(date) {
                console.log(date);
                var year = date.getFullYear();
                var month = (date.getMonth() + 1);
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                month = month < 10 ? ("0" + month) : month;
                day = day < 10 ? ("0" + day) : day;
                // hour = hour < 10 ? ("0" + hour) : hour;
                // minute = minute < 10 ? ("0" + minute) : minute;
                // second = second < 10 ? ("0" + second) : second;
                // return (year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
                return (year + "-" + month + "-" + day);
            }

            function loadLogger() {
                if ($scope.createStartTime) {
                    $scope.loggerAction.createStartTime = date2string($scope.createStartTime);
                }
                if ($scope.createEndTime) {
                    $scope.loggerAction.createEndTime = date2string($scope.createEndTime);
                }
                DataService.run("loggerQuery", $scope.loggerAction,
                    function(response) {
                        //alert(JSON.stringify(response));
                        // if (response.rows.length == 0) {
                        //     alert("未查找到符合要求的信息。");
                        // } else {
                            $scope.loggerList = response.rows;
                            $scope.pageInfo = response.pageInfo;
                            $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                        // }
                    },
                    function(response) {

                    });
            }
            $scope.pageChanged = function() {
                //console.log($scope.pageInfo.pageIndex);
                $scope.loggerAction.pageIndex = $scope.pageInfo.pageIndex;
                loadLogger();
            }
            $scope.init = function() {
                $scope.paramInitial();
                $scope.createStartTime = null;
                $scope.createEndTime = null;
                loadLogger();
            }
            $scope.showModal = false;
            $scope.collapseId = null;
            $scope.init();

            $scope.search = function() {
                loadLogger();
            }
            $scope.sortByString = function() {
                $scope.orderBy = null;
                var className = event.target.getAttribute("class");
                $scope.sortString = event.target.getAttribute("aria-label");

                if (className == "sorting" || className == "sorting_asc") {
                    $scope.orderBy = "DESC";
                } else {
                    $scope.orderBy = "ASC";
                }
                $scope.loggerAction.orderBy = $scope.sortString;
                $scope.loggerAction.sort = $scope.orderBy;
                $scope.loggerAction.pageIndex = 1;
                loadLogger();
            }
            $scope.showDetail = function(logger) {
                var param = DataService.getInitialParam("loggerDetailQuery");
                param.actionId = logger.id;
                $scope.comment = logger.comment;
                DataService.run("loggerDetailQuery", null,
                    function(response) {
                        //alert(JSON.stringify(response));
                        // if (response.model.length == 0) {
                        //     // alert("未查找到符合要求的信息。");
                        // } else {
                            $scope.detailList = response.model;
                            $scope.showModal = true;
                            $rootScope.modalStus(true);
                        // }
                    },
                    function(response) {

                    });
            }
            $scope.hideModal = function() {
                $scope.showModal = false;
                $scope.comment = null;
                $scope.detailList = null;
                $scope.contentList = null;
                $rootScope.modalStus(false);
            }
            $scope.showDetailContent = function(id) {
                var param = DataService.getInitialParam("detailContentQuery");
                param.loggerId = id;
                DataService.run("detailContentQuery", null,
                    function(response) {
                        // //alert(JSON.stringify(response));
                        // if (response.model.length == 0) {
                        //     // alert("未查找到符合要求的信息。");

                        // } else {
                            $scope.contentList = response.model;
                        // }
                    },
                    function(response) {

                    });
                //expand <-> collapse
                var status = event.target.getAttribute("data-action");
                if (status == "expand") {
                    $scope.collapseId = id;
                    $scope.detailContentId = id;
                } else {
                    $scope.collapseId = null;
                    $scope.detailContentId = null;
                }
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
        });
})();