(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.business-service', {
                url: '/business-service',
                views: {
                    '@': {
                        templateUrl: 'templates/business-service/business-service.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('business-service', [])
        .config(config)
        .controller('businessService', function($scope, $state, DataService, $rootScope) {
            $scope.loadCommonService = function() {
                DataService.run("serviceQueryAll", null,
                    function(response) {
                        $scope.serviceList = response.rows;
                        $scope.loadBusinessService();
                    },
                    function(response) {

                    });
            }
            $scope.loadCommonService();

            $scope.loadBusinessService = function() {
                DataService.run("businessServiceQuery", null,
                    function(response) {
                        $scope.businessServicePool = response.model;
                        // $scope.$apply();
                        var i, j;
                        for (i = 0; i < $scope.businessServicePool.length; i++) {
                            for (j = 0; j < $scope.serviceList.length; j++) {
                                if ($scope.businessServicePool[i].serviceId == $scope.serviceList[j].id) {
                                    $scope.businessServicePool[i].name = $scope.serviceList[j].name;
                                    break;
                                }
                            }
                        }
                        $scope.serviceAvailableList = [];
                        for (i = 0; i < $scope.serviceList.length; i++) {
                            $scope.serviceAvailableList.push({
                                id: $scope.serviceList[i].id,
                                name: $scope.serviceList[i].name,
                                enable: $scope.serviceList[i].enable,
                            });
                        }
                        //查找其中的可用服务
                        for (i = 0; i < $scope.businessServicePool.length; i++) {
                            for (j = 0; j < $scope.serviceAvailableList.length; j++) {
                                // console.log($scope.serviceAvailableList.length);
                                if ($scope.businessServicePool[i].serviceId == $scope.serviceAvailableList[j].id) {
                                    $scope.serviceAvailableList.splice(j, 1);
                                    // console.log($scope.serviceAvailableList);
                                }
                            }
                        }
                        for (var i = 0; i < $scope.serviceAvailableList.length; i++) {
                            if ($scope.serviceAvailableList[i].enable == false) {
                                // console.log($scope.serviceAvailableList[i].name);
                                $scope.serviceAvailableList[i].name = $scope.serviceAvailableList[i].name + "（该服务未启用）";
                            }
                        }
                    },
                    function(response) {

                    });
            }

            $scope.openModal = function(flag, serviceInfo) {
                $scope.opration = flag;
                if (flag == "show") {
                    //查看详情
                    $scope.businessServiceShow = serviceInfo;
                    //show name
                    $scope.modalShow = "show";
                    $rootScope.modalStus(true);
                } else {
                    if (serviceInfo) {
                        //修改
                        $scope.businessServiceName = serviceInfo.name;
                        $scope.businessServiceEdit = {
                            id: serviceInfo.id,
                            serviceId: serviceInfo.serviceId,
                            url: serviceInfo.url,
                            enable: serviceInfo.enable,
                        }
                        $scope.modalShow = "show";
                        $rootScope.modalStus(true);
                    } else {
                        //创建
                        if ($scope.serviceAvailableList.length == 0) {
                            $rootScope.showToast("error", "当前服务库中已经没有可创建的企业服务，请先在服务管理中创建服务后再创建企业服务。");
                        } else {
                            $scope.businessServiceEdit = {
                                serviceId: $scope.serviceAvailableList[0].id,
                                url: null,
                                enable: true,
                            }
                            $scope.modalShow = "show";
                            $rootScope.modalStus(true);
                        }
                    }
                }
            }
            $scope.saveServiceEdit = function() {
                if ($scope.opration == 'create') {
                    $scope.businessServiceEdit.businessId = DataService.getInitialParam("businessServiceCreate").businessId;
                    DataService.run("businessServiceCreate", $scope.businessServiceEdit,
                        function(response) {
                            // alert(JSON.stringify(response));
                            $scope.loadBusinessService();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                } else if ($scope.opration == 'edit') {
                    $scope.businessServiceEdit.businessId = DataService.getInitialParam("businessServiceUpdate").businessId;
                    DataService.run("businessServiceUpdate", $scope.businessServiceEdit,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.loadBusinessService();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                }

            }
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.opration = null;
                $scope.businessServiceeEdit = {};
                $scope.businessServiceShow = {};
                $rootScope.modalStus(false);
            }


        });
})();