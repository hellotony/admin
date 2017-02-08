(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.channel-info', {
                url: '/channel-info',
                views: {
                    '@': {
                        templateUrl: 'templates/channel-info/channel-info.tpl.html',
                    }
                }
            })
            .state('root.channel-user', {
                url: '/channel-user',
                views: {
                    '@': {
                        templateUrl: 'templates/channel-info/channel-user.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('channel-info', [])
        .config(config)
        .controller('channelInfo', function($scope, $state, DataService, $rootScope) {
            $scope.channel = {
                pageIndex: 1,
                pageCount: 20
            }
            $scope.transBool = function(txt, flag) {
                //flag无值默认为正变换，否则为反变换
                if (!flag) {
                    return (txt == true ? '1' : '0');
                } else {
                    return (txt == '0' ? false : true);
                }
            }
            $scope.loadChannelInfo = function() {
                DataService.run("channelQueryAll", $scope.channel,
                    function(response) {
                        $scope.channelInfoList = response.rows;
                        $scope.pageInfo = response.pageInfo;
                        $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
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
                        $scope.businessList.unshift({id: null, name:"请选择企业"});
                    },
                    function(response) {

                    });
            }
            $scope.pageChanged = function() {
                $scope.channel.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadChannelInfo();
            }

            $scope.loadBusiness();
            $scope.loadChannelInfo();

            $scope.openModal = function(flag, channelInfo) {
                $scope.opration = flag;
                $rootScope.modalStus(true);
                if (flag == "show") {
                    $scope.channelInfoShow = channelInfo;
                } else {
                    if (channelInfo) {
                        $scope.channelInfoEdit = angular.copy(channelInfo);
                        $scope.channelInfoEdit.enable = $scope.transBool($scope.channelInfoEdit.enable);
                    } else {
                        $scope.channelInfoEdit = {
                            name: null,
                            channelNumber: null,
                            businessId: null,
                            limitType: 0,
                            maxCountOfChannel: null,
                            summaryCount: null,
                            maxAskCountOfPerUser: null,
                            type: 0,
                            enable: '0',
                            productIds: null,
                        }
                    }
                }

                $scope.modalShow = "show";

            }

            $scope.transId = function(businessId) {
                for (var i=1; i<$scope.businessList.length; i++) {
                    if ($scope.businessList[i].id == businessId) {
                        return $scope.businessList[i].name;
                    }
                }
            }

            $scope.saveChannelInfoEdit = function() {
                var serviceName = "";
                var pageIndex = 1;
                if ($scope.opration == 'create') {
                    serviceName = 'channelCreate';
                } else if ($scope.opration == 'edit') {
                    serviceName = 'channelUpdate';
                    pageIndex = $scope.channel.pageIndex;

                }
                $scope.channelInfoEdit.enable = $scope.transBool($scope.channelInfoEdit.enable, 'convert');
                DataService.run(serviceName, $scope.channelInfoEdit,
                    function(response) {
                        // alert(JSON.stringify(response));
                        $scope.channel.pageIndex = pageIndex;
                        $scope.loadChannelInfo();
                        $scope.closeModal();
                    },
                    function(response) {

                    });

            }
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.opration = null;
                $scope.channelInfoEdit = {};
                $scope.channelInfoShow = {};
                $rootScope.modalStus(false);
            }
            $scope.setLocalStorage = function(channelId) {
                DataService.setChannelId(channelId);
            }

        })
        .controller('channelUser', function($scope, $state, DataService, $rootScope) {
            $scope.channel = {
                channelId: DataService.getInitialParam("channelQueryAllUser").channelId,
                pageIndex: 1,
                pageCount: 20
            }
            $scope.loadChannelUserInfo = function() {
                DataService.run("channelQueryAllUser", $scope.channel,
                    function(response) {
                        $scope.channelUserInfoList = response.rows;
                        $scope.pageInfo = response.pageInfo;
                        $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                    },
                    function(response) {

                    });
            }

            $scope.pageChanged = function() {
                $scope.channel.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadChannelUserInfo();
            }

            $scope.loadChannelUserInfo();

            $scope.openModal = function(channelUserInfo) {
                $scope.opration = "show";
                $rootScope.modalStus(true);
                $scope.channelUserInfo = channelUserInfo;
                $scope.modalShow = "show";
            }
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.channelUserInfo = {};
                $rootScope.modalStus(false);
            }
        });
})();