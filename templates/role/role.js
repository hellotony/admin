(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.role', {
                url: '/role',
                views: {
                    '@': {
                        templateUrl: 'templates/role/role.tpl.html',
                        controller: 'roleCtrl'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('role', [])
        .config(config)
        .controller('roleCtrl', function($scope, $state, DataService, $rootScope) {
            $scope.modalShow = null;
            $scope.roleEdit = {
                name: null
            };

            loadRoleList();

            function loadRoleList() {
                DataService.run("roleQueryAll", null,
                    function(response) {
                        $scope.roleList = response["model"];
                    },
                    function(response) {

                    });
            }

            $scope.openModal = function(role) {
                if (!role) {
                    $scope.modalShow = 'new';
                }else {
                    $scope.modalShow = 'modify';
                    $scope.roleEdit.name = role.name;
                    $scope.roleEdit.id = role.id;
                }
                $rootScope.modalStus(true);
            }

            //删除角色
            $scope.deleteRole = function(roleId) {
                $rootScope.showToast("confirm", "确定删除吗？", function() {
                    DataService.run("roleDelete", {id: roleId},
                        function(response) {
                            loadRoleList();
                        },
                        function(response) {

                        });
                }, null);
            }      
            
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.roleEdit.name = null;
                if ($scope.roleEdit.id) {
                    delete $scope.roleEdit.id;
                }
                $rootScope.modalStus(false);
            }

            $scope.saveRoleEdit = function() {
                var serviceName = "", params = angular.copy($scope.roleEdit);
                if ($scope.modalShow && $scope.modalShow == 'new') {
                    serviceName = "roleCreate";
                } else if ($scope.modalShow && $scope.modalShow == 'modify') {
                    serviceName = "roleUpdate";
                }
                DataService.run(serviceName, params,
                        function(response) {
                            $scope.closeModal();
                            loadRoleList();
                        },
                        function(response) {

                        });
            }
        });
})();