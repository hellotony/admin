(function() {
    'use strict';

    function menuCtrl($log, $scope, $rootScope, $state) {
        $log.debug('menu loaded');
        $scope.menuList = [{
            "attr": "fa-gears",
            "content": "root.business",
            "name": "企业管理",
        }, {
            "attr": "fa-bar-chart-o",
            "content": "root.common-service",
            "name": "服务管理"
        }, {
            "attr": "fa-th-list",
            "content": "root.channel-info",
            "name": "渠道管理"
        }, {
            "attr": "fa-picture-o",
            "content": "root.showcase-info",
            "name": "橱窗信息"
        }, {
            "attr": "fa-tasks",
            "content": "root.statistic",
            "name": "数据统计"
        }, {
            "attr": "fa-file",
            "content": "root.data-manager",
            "name": "数据管理",
            "open": false,
            "submenu": [{
                "content": "root.employee-info",
                "name": "员工信息",
            }, {
                "content": "root.policy-info",
                "name": "保单信息",
            }]
        }, {
            "attr": "fa-users",
            "content": "root.role-manager",
            "name": "角色管理",
            "open": false,
            "submenu": [{
                "content": "root.role-module",
                "name": "管理模块",
            }, {
                "content": "root.role",
                "name": "用户和权限管理",
            }]
        }, {
            "attr": "fa-tags",
            "content": "root.logger",
            "name": "日志管理"
        }];

        function initStateName(stateName) {
            if (stateName) {
                for (var i = 0; i < $scope.menuList.length; i++) {
                    if ($scope.menuList[i].content == stateName) {
                        if (!$scope.menuList[i].include) {
                            return stateName;
                        }
                    }
                }
            } else {
                return false;
            }

        }
        //初始值
        // $rootScope.currentContent = $state.current.name || $scope.menuList[0].content;
        function init() {
            if (!$state.current.name) {
                $rootScope.currentContent = $scope.menuList[0].content;
            } else {
                $rootScope.currentContent = {
                    "root.business-service": "root.business",
                    "root.business-employee": "root.business",
                    "root.employee": "root.business",
                    "root.msglist": "root.business",
                    "root.business-sms": "root.business",
                    "root.business-sms-module": "root.business",
                    "root.employee-service": "root.business",
                    "root.business-create": "root.business",
                    "root.role-authorization": "root.role",
                    "root.role-user": "root.role",
                    "root.channel-user": "root.channel-info"
                }[$state.current.name];

                if (!$rootScope.currentContent) {
                    $rootScope.currentContent = $state.current.name;
                }
            }
        }

        init();

        $scope.chooseMenu = function(ml) {
            if (ml.submenu) {
                ml.open = !ml.open;
            } else {
                $state.go(ml.content);
                $rootScope.currentContent = ml.content;

            }

        }

        $scope.setLi = function(ml) {
            if (!ml.submenu) {
                if ($rootScope.currentContent == ml.content) {
                    return 'active';
                }
            } else {
                if (ml.open == true) {
                    return 'open';
                } else if (ml.open == false) {
                    for (var i = 0; i < ml.submenu.length; i++) {
                        if (ml.submenu[i].content == $rootScope.currentContent) {
                            return 'active';
                        }
                    }
                    return '';
                }
            }
        }

    }

    angular.module('common.menu', [])
        .controller('MenuCtrl', menuCtrl);
})();