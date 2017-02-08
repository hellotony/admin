(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider
      .state('root.data-table-demo', {
        url: '/data-table-demo',
        views: {
          '@': {
            templateUrl: 'templates/data-table-demo/data-table-demo.tpl.html',
            controller: 'DataTableDemo as docs'
          }
        }
      });
  }

  /**
   * @name  gettingStartedCtrl
   * @description Controller
   */
  function DataTableDemo($scope, $log) {
    var docs = this;
    docs.someMethos = function() {
      $log.debug('I\'m a method');
    };
    $scope.paramInitial = function() {
      $scope.param = {
        page: 1,
        name: null,
        identifyType: null,
        identifyNo: null
      }
    }
    $scope.paramInitial();

  }

  angular.module('data-table-demo', [])
    .config(config)
    .controller('searchForm', function($scope) {
      $scope.search = function() {
         $scope.$$nextSibling.loadData();
      };
      $scope.clean = function() {
        $scope.$parent.paramInitial();
      };
    })
    .controller('DataTableDemo', DataTableDemo)
    .controller('employeeList', function($scope, $http, DataService) {
      $scope.loadData = function() {
        DataService.getAll($scope.$parent.param, function(data) {
          $scope.employees = data.dataList;
        });
      }
      $scope.loadData();


    })
    .controller('PaginationDemoCtrl', function($scope) {


      $scope.pageChanged = function() {
        $scope.$parent.param.page = $scope.bigCurrentPage;
        $scope.$$prevSibling.loadData();
      };

      $scope.itemsPerPage = 3
      $scope.bigTotalItems = 6;
      $scope.bigCurrentPage = 1;


    });
})();