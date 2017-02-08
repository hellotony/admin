(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.role-authorization', {
                url: '/role-authorization/:id',
                views: {
                    '@': {
                        templateUrl: 'templates/role/role-authorization.tpl.html',
                        controller: 'roleAuthCtrl'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('role-authorization', [])
        .config(config)
        .controller('roleAuthCtrl', function($scope, $state, DataService, $rootScope, _) {
            $scope.roleId = $state.params.id;
            $scope.editflag = true;
            loadRoleAuth();

            function loadRoleAuth() {
                DataService.run("roleAuthQuery", {
                        roleId: $scope.roleId
                    },
                    function(response) {
                        if (response["success"] == false) {
                            // if (response["errorCode"] == 6002) {
                                $scope.roleAuthList = null;
                                $scope.roleOrigin = null;
                                $scope.roleEditList = null;
                            // }
                        } else {
                            $scope.roleAuthList = response["model"];
                            $scope.roleOrigin = angular.copy($scope.roleAuthList);
                            $scope.roleEditList = angular.copy($scope.roleAuthList);
                        }

                    },
                    function(response) {});
            }

            $scope.saveEdit = function() {
                if (_.isEqual($scope.roleOrigin, $scope.roleEditList)) {
                    $rootScope.showToast("error", "您并未做任何修改！");
                } else {
                    DataService.run("roleAuthUpdate", {
                            "roleAuthorizations": $scope.roleEditList
                        },
                        function(response) {
                            if (response["success"] == false) {
                                if (response["errorCode"] == 6002) {
                                    $scope.roleAuthList = angular.copy($scope.roleOrigin);
                                    $scope.roleEditList = angular.copy($scope.roleOrigin);
                                }
                            } else {
                                loadRoleAuth();
                                $rootScope.showToast('success', "修改成功！");
                            }
                        },
                        function(response) {

                        });
                }
            }
            $scope.changeVal = function(index, key) {
                $scope.roleEditList[index][key] = event.target.checked;
            }

        });
})();