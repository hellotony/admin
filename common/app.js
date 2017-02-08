(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

  function config($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {
    // $urlRouterProvider.otherwise('/data-table-demo');
    $urlRouterProvider.otherwise('/business');
    $logProvider.debugEnabled(false);
    $httpProvider.interceptors.push('httpInterceptor');
    $stateProvider
      .state('root', {
        views: {
          'header': {
            templateUrl: 'templates/header.tpl.html',
            controller: 'HeaderCtrl'
          },
          'menu': {
            templateUrl: 'templates/menu.tpl.html',
            controller: 'MenuCtrl'
          },
          'footer': {
            templateUrl: 'templates/footer.tpl.html',
            controller: 'FooterCtrl'
          }
        }
      });

      

  }

  function MainCtrl($log, $rootScope) {
    $log.debug('MainCtrl laoded!');
    $rootScope.isModalOpen = false;
    $rootScope.isLoading = false;
    $rootScope.message = null;
    // 配置logo startLogo尺寸，以便修改
    $rootScope.constant = {
      orgLogo: {
        width: 124,
        height: 80
      },
      orgSlogan: {
        width: 640,
        height: 82
      },
      orgStartLogo: {
        width: 370,
        height: 500
      },
      showcaseHomeP: {
        width: 750,
        height: 240
      },
      showcasePlugL: {
        width: 302,
        height: 327
      },
      showcasePlugR: {
        width: 302,
        height: 154
      }
    };

    $rootScope.modalStus = function(flag) {
      $rootScope.isModalOpen = flag;
      flag == true? document.querySelector("html").style.overflowY = "hidden" : document.querySelector("html").style.overflowY = "scroll";
    }
    $rootScope.showLoading = function() {
      $rootScope.isLoading = true;
    }
    $rootScope.hideLoading = function() {
      $rootScope.isLoading = false;
    }
    $rootScope.logout = function() {
      window.location = en_platform_apis.weblogin_logout + escape(window.location);
    }
    $rootScope.clearConfirmHandler = function() {
      $rootScope.handler = null;
      $rootScope.handlerData = null;
    }
    $rootScope.setConfirmHandler = function(handler, data) {
      $rootScope.clearConfirmHandler();
      $rootScope.handler = handler;
      if (data) {
        $rootScope.handlerData = data;
      }
    }
    $rootScope.clearConfirmHandler();
    $rootScope.hideToast = function(type, msg) {
      $rootScope.message = null;
      $rootScope.clearConfirmHandler();
    }
    $rootScope.confirmHandler = function() {
      if ($rootScope.handler){
        if ($rootScope.handlerData) {
          $rootScope.handler($rootScope.handlerData);
        } else{
          $rootScope.handler();
        }
      }
      $rootScope.hideToast();
    }
    
    $rootScope.showToast = function(type, msg, handler, data) {
      $rootScope.message = {
        type: type,
        msg: msg
      }
      if (type == "confirm"){
        $rootScope.setConfirmHandler(handler, data);
      }
    }

    $rootScope.date2string = function(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1);
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        month = month < 10 ? ("0" + month) : month;
        day = day < 10 ? ("0" + day) : day;
        // hour = hour < 10 ? ("0" + hour) : hour;
        // minute = minute < 10 ? ("0" + minute) : minute;
        // second = second < 10 ? ("0" + second) : second;
        // return (year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
        return (year + "-" + month + "-" + day);
    }
  }

  function run($log, $rootScope, $http) {
    $log.debug('App is running!');
    $rootScope.loadStaffInfo = function () {
        $rootScope.staffInfo = {};
        //每次路由启动时判断用户权限
        $http.get(en_platform_apis.staff_info_api,
            {withCredentials: true})
            .success(function (data) {
                if (data == null || (typeof(data) == 'string' && data === 'null')) {
                    //判断staff status是否为非2.
                    $http.get(en_platform_apis.staff_status_api,
                        {withCredentials: true})
                        .success(function (data) {
                            if (data != '2') {
                                window.location = en_platform_apis.weblogin_login + escape(window.location);
                            }
                        });
                } else {
                    $rootScope.staffInfo = data;
                    // $rootScope.$broadcast("$staff:ObtainStaffInfoSuccess");//需要用户信息的Controller可以监听该广播
                }
            }).error(function(){
                // window.location = en_platform_apis.weblogin_login + escape(window.location);
            });
    };
    $rootScope.loadStaffInfo();
  }

  angular.module('app', [
      'ui.router',
      // 'data-table-demo',
      'ui.bootstrap',
      // 'ngAnimate',
      // 'common.header',
      // 'common.footer',
      'common.menu',
      'common.services.data',
      'common.directives.version',
      'directives.directives',
      'common.filters.uppercase',
      'common.interceptors.http',
      'business',
      'business-create',
      'business-employee',
      'business-sms',
      'logger',
      'msglist',
      'common-service',
      'business-service',
      'employee-service',
      'employee',
      'channel-info',
      'showcase-info',
      'statistic',
      'data-manager',
      'role',
      'role-authorization',
      'role-user',
      'role-module',
      'property-insurance',
      'templates'
    ])
    .config(config)
    .run(run)
    .controller('MainCtrl', MainCtrl)
    .value('version', '1.1.0');
})();
