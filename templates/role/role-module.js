(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.role-module', {
                url: '/role-module',
                views: {
                    '@': {
                        templateUrl: 'templates/role/role-module.tpl.html',
                        controller: 'roleMCtrl'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('role-module', [])
        .config(config)
        .controller('roleMCtrl', function($scope, $state, DataService, $rootScope) {
            loadModule();

            function loadModule() {
                DataService.run("moduleQueryAll", null,
                    function(response) {
                        $scope.moduleList = response["model"];
                    },
                    function(response) {

                    });
            }

            $scope.saveEdit = function(item) {
                var params = angular.copy(item);
                params.enable = !params.enable;
                DataService.run("moduleUpdate", params,
                    function(response) {
                        loadModule();
                        $rootScope.showToast('success', "修改成功！");
                    },
                    function(response) {

                    });
            }

        });
})();