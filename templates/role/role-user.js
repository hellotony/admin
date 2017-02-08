(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.role-user', {
                url: '/role-user/:id',
                views: {
                    '@': {
                        templateUrl: 'templates/role/role-user.tpl.html',
                        controller: 'roleUserCtrl'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('role-user', [])
        .config(config)
        .controller('roleUserCtrl', function($scope, $state, DataService, $rootScope) {
            $scope.roleId = $state.params.id;
            $scope.user = {
                roleId: $scope.roleId,
                staffName: null
            };
            loadRoleUserList();
            
            function loadRoleUserList() {
                DataService.run("getRoleUserByRoleId", {
                        roleId: $scope.roleId
                    },
                    function(response) {
                        $scope.roleUserList = response["model"];
                    },
                    function(response) {

                    });
            }

            $scope.openModal = function() {
                $scope.modalShow = 'new';
                $rootScope.modalStus(true);
            }

            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.user.staffName = null;
                $rootScope.modalStus(false);
            }

            $scope.deleteUser = function(id) {
                $rootScope.showToast("confirm", "确定删除吗？", function() {
                    DataService.run("roleUserDelete", {
                            id: id
                        },
                        function(response) {
                            loadRoleUserList();
                        },
                        function(response) {

                        });
                }, null);
            }

            $scope.saveUser = function() {
                DataService.run("roleUserCreate", $scope.user,
                        function(response) {
                            $scope.closeModal();
                            loadRoleUserList();
                        },
                        function(response) {

                        });
            }
        });
})();