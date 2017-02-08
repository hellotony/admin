(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.msglist', {
                url: '/msglist/:bussinessId',
                views: {
                    '@': {
                        templateUrl: 'templates/business-msg/list.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('msglist', ['underscore'])
        .config(config)
        .controller('msglist', function($scope, $state, DataService, $rootScope, _) {
            $scope.bussinessId = $state.params.bussinessId;
            $scope.paramInitial = function() {
                $scope.NewsAction = {
                    pageIndex: 1,
                    pageCount: 20,
                    createStartTime: null,
                    createEndTime: null,
                    orderBy: "id",
                    sort: "desc",
                    businessId: $scope.bussinessId
                }
            }
            $scope.operationTypeList = [{
                "value": 1,
                "text": "普通消息"
            }];



            function loadNews() {
                if ($scope.createStartTime) {
                    $scope.NewsAction.createStartTime = date2string($scope.createStartTime);
                }
                if ($scope.createEndTime) {
                    $scope.NewsAction.createEndTime = date2string($scope.createEndTime);
                }
                DataService.run("newsQueryAll", $scope.NewsAction,
                    function(response) {

                        $scope.NewsList = response.rows;
                        $scope.pageInfo = response.pageInfo;
                        $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);


                        DataService.run("businessEmployeeQuery", {
                            businessId: $scope.bussinessId
                        }, function(response) {
                            $scope.employeeType = response.model;
                        })
                    },
                    function(response) {

                    });
            }
            $scope.pageChanged = function() {
                //console.log($scope.pageInfo.pageIndex);
                $scope.NewsAction.pageIndex = $scope.pageInfo.pageIndex;
                loadNews();
            }
            $scope.init = function() {
                $scope.paramInitial();
                $scope.createStartTime = null;
                $scope.createEndTime = null;
                loadNews();
            }
            $scope.showModal = false;
            $scope.collapseId = null;
            $scope.init();

            $scope.search = function() {
                loadNews();
            }
            $scope.sortByString = function() {
                $scope.orderBy = null;
                var className = event.target.getAttribute("class");
                $scope.sortString = event.target.getAttribute("aria-label");

                if (className == "sorting" || (className.indexOf("sorting_asc") > -1)) {
                    $scope.orderBy = "DESC";
                } else {
                    $scope.orderBy = "ASC";
                }
                $scope.NewsAction.orderBy = $scope.sortString;
                $scope.NewsAction.sort = $scope.orderBy;
                $scope.NewsAction.pageIndex = 1;
                loadNews();
            }
            $scope.openModal = function(flag, originNewsDetail) {
                var newsDetail;
                if (originNewsDetail) {
                    newsDetail = JSON.parse(JSON.stringify(originNewsDetail));
                }

                $scope.opration = flag;
                $rootScope.modalStus(true);
                // if (flag == "show") {
                //    $scope.newsItem = newsDetail;
                // } else {
                if (newsDetail) {
                    if (!newsDetail.employeeTypeNewsList) {
                        newsDetail.employeeTypeNewsList = [];
                    }

                    //将已选的人群设置为true
                    _.each(newsDetail.employeeTypeNewsList,
                        function(item) {
                            item.businessEmployeeType && (item.name = item.businessEmployeeType.name);
                            item.selected = true;
                        });
                    //与企业已有人群进行合并
                    _.each($scope.employeeType, function(item) {
                        //遍历原消息的人群，如果没有发现该人群，则添加
                        var matchItem = _.find(newsDetail.employeeTypeNewsList, function(typeItem) {
                            return typeItem.employeeTypeId == item.id;
                        })
                        if (matchItem) {
                            //如果有相同对象，则把属性拷贝过去
                            angular.extend(matchItem, item);

                        } else {
                            //如果没有相同对象，则push

                            newsDetail.employeeTypeNewsList.push(item);
                        }
                    });

                    newsDetail.employeeTypeNewsList = _.sortBy(newsDetail.employeeTypeNewsList, function(item) {
                        return item.id;
                    });

                    //修改
                    $scope.newsItem = newsDetail;


                } else {
                    //新增
                    $scope.newsItem = {
                            title: null,
                            businessId: $scope.bussinessId,
                            type: 1,
                            content: null,
                            enable: true,
                            employeeTypeNewsList: $scope.employeeType,
                            startDate: null,
                            endDate: null


                        }
                        // }

                }

                $scope.modalShow = "show";

            }
            $scope.chooseStartDate = function($event) {
                $scope.startDateStatus.opened = true;
            };

            $scope.startDateStatus = {
                opened: false
            };

            $scope.chooseEndDate = function($event) {
                $scope.endDateStatus.opened = true;
            };

            $scope.endDateStatus = {
                opened: false
            };

            $scope.saveNews = function() {
                var selectedList=_.filter($scope.newsItem.employeeTypeNewsList,
                    function(item) {
                        return item.selected == true;
                    });

                 if (selectedList.length == 0) {
                    alert("请选择推送人群")
                    return;
                }

                //过滤掉未选中的
                $scope.newsItem.employeeTypeNewsList = selectedList;

               
                //服务端不认id ,只认employeeTypeId 需要赋值
                _.each($scope.newsItem.employeeTypeNewsList,
                    function(item) {
                        item.employeeTypeId = item.id;
                    });


                if ($scope.opration == 'create') {
                    DataService.run("newsCreate", $scope.newsItem,
                        function(response) {
                            // alert(JSON.stringify(response));
                            $scope.NewsAction.pageIndex = 1;
                            loadNews();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                } else if ($scope.opration == 'edit') {
                    DataService.run("newsUpdate", $scope.newsItem,
                        function(response) {
                            //alert(JSON.stringify(response));
                            //$scope.serviceQueryParam.pageIndex = 1;
                            loadNews();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                }

            }

            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.opration = null;
                $scope.serviceIconShow = '';
                $scope.commonServiceEdit = {};
                $scope.commonServiceShow = {};
                $rootScope.modalStus(false);
            }

            $scope.showDetail = function(News) {
                var param = DataService.getInitialParam("newsQuery");
                param.id = News.id;
                DataService.run("newsQuery", null,
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
                var param = DataService.getInitialParam("newsQuery");
                param.NewsId = id;
                DataService.run("newsQuery", null,
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