(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.business-employee', {
                url: '/business-employee',
                views: {
                    '@': {
                        templateUrl: 'templates/business-employee/business-employee.tpl.html',
                        controller: 'createBusinessmployee'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('business-employee', [])
        .config(config)
        .controller('createBusinessmployee', function($scope, $state, DataService, $rootScope) {
            $scope.createEmployee = false;
            $scope.addEmployeeName = null;
            $scope.addNotice = null;
            loadEmployeeList();

            function loadEmployeeList() {
                DataService.run("businessEmployeeQuery", null,
                    function(response) {
                        //alert(JSON.stringify(response));
                        $scope.employeeList = response["model"];
                    },
                    function(response) {

                    });
            }
            $scope.openModal = function(employeeId, employeeIdName,notice) {
                $scope.createEmployee = true;
                $rootScope.modalStus(true);
                if (employeeId) {
                    $scope.employeeId = employeeId;
                    $scope.addEmployeeName = employeeIdName;
                    $scope.addNotice = notice;
                } else {
                    $scope.employeeId = null;
                }
            }

            //删除企业人群，该模块现已删除
            // $scope.confirmDel = function(employeeId) {
            //     var deleParam = DataService.getInitialParam("businessEmployeeDelete");
            //         deleParam.id = employeeId;

            //         DataService.run("businessEmployeeDelete", null,
            //             function(response) {
            //                 //alert(JSON.stringify(response));
            //                 loadEmployeeList();
            //                 // alert("删除企业人群成功");
            //             },
            //             function(response) {

            //             });
            // }
            // $scope.deleteEmployee = function(employeeId) {
            //     $rootScope.showToast("confirm", "删除后该人群下所有员工将移入默认分组，且该操作不可恢复，确定删除吗？", $scope.confirmDel, employeeId);
            // }      
            
            $scope.closeModal = function() {
                $scope.createEmployee = false;
                $scope.addEmployeeName = null;
                $scope.addNotice = null;
                $rootScope.modalStus(false);
            }
            $scope.saveCreateEmployee = function() {
                var parame = "";
                var msg = "";
                if (!$scope.employeeId) {
                    parame = DataService.getInitialParam("businessEmployeeCreate");
                    parame.name = $scope.addEmployeeName;
                    parame.notice = $scope.addNotice;
                    DataService.run("businessEmployeeCreate", null,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.addEmployeeName = null;
                            $scope.addNotice = null;
                            $scope.createEmployee = false;
                            $rootScope.modalStus(false);
                            loadEmployeeList();
                            // alert("创建企业人群成功");
                        },
                        function(response) {

                        });

                } else {
                    parame = DataService.getInitialParam("businessEmployeeUpdate");
                    parame.name = $scope.addEmployeeName;
                    parame.notice = $scope.addNotice
                    parame.id = $scope.employeeId;
                    DataService.run("businessEmployeeUpdate", null,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.addEmployeeName = null;
                            $scope.addNotice = null;
                            $scope.createEmployee = false;
                            $rootScope.modalStus(false);
                            loadEmployeeList();
                            // alert("修改企业人群成功");
                        },
                        function(response) {

                        });
                }
            }
            $scope.setLocalStorage = function(employeeId) {
                    DataService.setEmployeeId(employeeId);
                }
        });
})();