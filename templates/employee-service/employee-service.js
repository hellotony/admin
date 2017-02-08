(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.employee-service', {
                url: '/employee-service',
                views: {
                    '@': {
                        templateUrl: 'templates/employee-service/employee-service.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('employee-service', [])
        .config(config)
        .controller('employeeService', function($scope, $state, DataService, $rootScope) {

            $scope.loadCommonService = function() {
                DataService.run("serviceQueryAll", null,
                    function(response) {
                        $scope.serviceList = response.rows;
                        $scope.loadBusinessService();
                    },
                    function(response) {

                    });
            }
            $scope.loadBusinessService = function() {
                DataService.run("businessServiceQuery", null,
                    function(response) {
                        $scope.businessServicePool = response.model;
                        var i, j;
                        for (i = 0; i < $scope.businessServicePool.length; i++) {
                            for (j = 0; j < $scope.serviceList.length; j++) {
                                if ($scope.businessServicePool[i].serviceId == $scope.serviceList[j].id) {
                                    $scope.businessServicePool[i].name = $scope.serviceList[j].name;
                                    break;
                                }
                            }
                        }
                        $scope.loadEmployeeService();
                    },
                    function(response) {

                    });
            }

            $scope.loadEmployeeService = function() {
                DataService.run("employeeTypeServiceQueryAll", null,
                    function(response) {
                        $scope.employeeTypeServicePool = response.model;
                        var i, j;
                        for (i = 0; i < $scope.employeeTypeServicePool.length; i++) {
                            for (j = 0; j < $scope.businessServicePool.length; j++) {
                                if ($scope.employeeTypeServicePool[i].businessServicePoolId == $scope.businessServicePool[j].id) {
                                    $scope.employeeTypeServicePool[i].name = $scope.businessServicePool[j].name;
                                    break;
                                }
                            }
                        }
                        $scope.serviceAvailableList = [];
                        for (i = 0; i < $scope.businessServicePool.length; i++) {
                            $scope.serviceAvailableList.push({
                                businessServicePoolId: $scope.businessServicePool[i].id,
                                name: $scope.businessServicePool[i].name,
                                enable: $scope.businessServicePool[i].enable,
                            });
                        }
                        //查找其中的可用服务
                        for (i = 0; i < $scope.employeeTypeServicePool.length; i++) {
                            for (j = 0; j < $scope.serviceAvailableList.length; j++) {
                                if ($scope.employeeTypeServicePool[i].businessServicePoolId == $scope.serviceAvailableList[j].businessServicePoolId) {
                                    $scope.serviceAvailableList.splice(j, 1);
                                }
                            }
                        }
                        for (i=0; i<$scope.serviceAvailableList.length; i++){
                            if ($scope.serviceAvailableList[i].enable == false){
                                $scope.serviceAvailableList[i].name += "（该服务未启用）";
                            }
                        }
                    },
                    function(response) {

                    });
            }

            $scope.loadCommonService();
            

            $scope.openModal = function(flag, serviceInfo) {
                $scope.opration = flag;
                $rootScope.modalStus(true);
                if (flag == "show") {
                    //查看详情
                    $scope.employeeTypeServiceShow = serviceInfo;
                    //show name
                    $scope.modalShow = "show";
                } else {
                    if (serviceInfo) {
                        //修改
                        $scope.employeeTypeServiceName = serviceInfo.name;
                        $scope.employeeTypeServiceEdit = {
                            enable: serviceInfo.enable,
                            businessServicePoolId: serviceInfo.businessServicePoolId,
                            id: serviceInfo.id
                        };
                        $scope.modalShow = "show";
                    } else {
                        //创建
                        if ($scope.serviceAvailableList.length == 0) {
                            alert("当前企业没有服务，请先在企业服务管理中创建企业服务后再创建人群服务。");
                        } else {
                            $scope.employeeTypeServiceEdit = {
                                businessServicePoolId: $scope.serviceAvailableList[0].businessServicePoolId,
                                enable: true,
                            }
                            $scope.modalShow = "show";
                         }
                    }
                }
            }
            $scope.saveServiceEdit = function() {
                if ($scope.opration == 'create') {
                    var param = DataService.getInitialParam("employeeTypeServiceCreate");
                    param.enable = $scope.employeeTypeServiceEdit.enable;
                    param.businessServicePoolId = $scope.employeeTypeServiceEdit.businessServicePoolId;
                    DataService.run("employeeTypeServiceCreate", null,
                        function(response) {
                            // alert(JSON.stringify(response));
                            $scope.loadEmployeeService();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                } else if ($scope.opration == 'edit') {
                    $scope.employeeTypeServiceEdit.employeeTypeId =  DataService.getInitialParam("employeeTypeServiceUpdate").employeeTypeId;
                    DataService.run("employeeTypeServiceUpdate", $scope.employeeTypeServiceEdit,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.loadEmployeeService();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                }

            }
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.opration = null;
                $rootScope.modalStus(false);
            }


        });
})();