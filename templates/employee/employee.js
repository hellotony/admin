(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.employee', {
                url: '/employee',
                views: {
                    '@': {
                        templateUrl: 'templates/employee/employee.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('employee', [])
        .config(config)
        .controller('employee', function($scope, $state, DataService,$rootScope) {
            $scope.businessId = DataService.getInitialParam("employeeQuery").businessId;
            $scope.employeeList = {};
            $scope.paramInitial = function() {
                var param = DataService.getInitialParam("employeeQuery");
                $scope.employeeQuery = {
                    pageIndex: 1,
                    pageCount: 20,
                    businessId: param.businessId,
                    employeeTypeId: null,
                    keywords: null,
                    userId: null,
                    cardNo: null,
                    mobile: null,
                    orderBy: null,
                    sort: null,
                    outUserId: null
                }
                // $scope.sortString = null;
            }
            $scope.loadeBusinessEmployee = function() {
                DataService.run("businessEmployeeQuery", null,
                    function(response) {
                        //alert(JSON.stringify(response));
                        $scope.businessEmployeeList = response["model"];
                        $scope.businessEmployeeListTmp = new Array();
                        for (var i = 0; i < $scope.businessEmployeeList.length; i++){
                            $scope.businessEmployeeListTmp.push($scope.businessEmployeeList[i]);
                        }
                        $scope.businessEmployeeListTmp.unshift({id:null, name:"选择所属人群"});
                        $scope.employeeQuery.employeeTypeId = $scope.businessEmployeeListTmp[0].id;
                    },
                    function(response) {

                    });
            }

            $scope.loadEmployee = function() {
                DataService.run("employeeQuery", $scope.employeeQuery,
                    function(response) {
                        //alert(JSON.stringify(response));
                        // if (response.rows.length == 0) {
                        //     //alert("未查找到符合要求的信息。");
                        // } else {
                            $scope.employeeList = response.rows;
                            $scope.pageInfo = response.pageInfo;
                            $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                        // }
                    },
                    function(response) {

                    });
            }
            $scope.paramInitial();
            $scope.loadeBusinessEmployee();
            $scope.loadEmployee();
            $scope.transNull = function(argv) {
                return argv == ""? null: argv;
            }
            $scope.search = function() {
                $scope.employeeQuery.mobile = $scope.transNull($scope.employeeQuery.mobile);
                $scope.employeeQuery.cardNo = $scope.transNull($scope.employeeQuery.cardNo);
                $scope.employeeQuery.userId = $scope.transNull($scope.employeeQuery.userId);
                $scope.loadEmployee();
            }
            $scope.clean = function() {
                $scope.orderBy = null;
                $scope.sortString = null;
                $scope.paramInitial();
                $scope.loadEmployee();
            }
            $scope.openModal = function(flag, employeeInfo) {
                $scope.opration = flag;
                $rootScope.modalStus(true);
                if (flag == "show") {
                    //查看
                    $scope.employeeShow = employeeInfo;
                    //转换人群id为name
                    if ($scope.employeeShow.employeeTypeId) {
                        for (var i = 0; i < $scope.businessEmployeeList.length; i++) {
                            if ($scope.businessEmployeeList[i].id == $scope.employeeShow.employeeTypeId) {
                                $scope.employeeShow.employeeTypeName = $scope.businessEmployeeList[i].name;
                                break;
                            }
                        }
                    }

                } else if (flag == "import") {

                } else {
                    if (employeeInfo) {
                        //修改
                        $scope.employeeEdit = {
                            id: employeeInfo.id,
                            name: employeeInfo.name,
                            staffId: employeeInfo.staffId,
                            identityType: employeeInfo.identityType,
                            identityId: employeeInfo.identityId,
                            businessId: $scope.businessId,
                            employeeTypeId: employeeInfo.employeeTypeId,
                            enable: employeeInfo.enable,
                            status: employeeInfo.status,
                            insuranceId: employeeInfo.insuranceId,
                            mobile: employeeInfo.mobile,
                        }
                    } else {
                        //创建
                        $scope.employeeEdit = {
                            name: null,
                            staffId: null,
                            identityType: 1,
                            identityId: null,
                            businessId: $scope.businessId,
                            employeeTypeId: $scope.businessEmployeeList[0].id,
                            enable: true,
                            status: 1,
                            mobile: null,
                        };
                    }
                }
                $scope.modalShow = "open";
            }
            $scope.chooseFile = function() {
                var file = event.target.files[0];
                if (file) {
                    $scope.reader = new FileReader();
                    $scope.reader.onloadend = function(evt) {
                        //读取后触发，无论成功或者失败
                        if ($scope.reader.error) {
                            console.log("error");
                        } else {
                            var base64 = evt.target.result;
                            $scope.fileBase64 = base64;
                        }
                    }
                    $scope.reader.readAsDataURL(file);
                }
            }
            $scope.saveEmployeeEdit = function() {
                if ($scope.opration == "create") {
                    $scope.employeeEdit.businessId = $scope.businessId;
                    DataService.run("employeeCreate", $scope.employeeEdit,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.loadEmployee();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                } else if ($scope.opration == "import") {
                    var param = DataService.getInitialParam("employeeImport");
                    param.file = $scope.fileBase64;
                    DataService.run("employeeImport", null,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.loadEmployee();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                } else {
                    $scope.employeeEdit.businessId = $scope.businessId;
                    DataService.run("employeeUpdate", $scope.employeeEdit,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.loadEmployee();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                }

            }

            $scope.closeModal = function() {
                $scope.modalShow = null;
                $rootScope.modalStus(false);
            }
            $scope.sortByString = function() {
                $scope.orderBy = null;
                var className = event.target.getAttribute("class");
                $scope.sortString = event.target.getAttribute("aria-label");

                if (className == "sorting" || className == "sorting_asc") {
                    $scope.orderBy = "DESC";
                } else {
                    $scope.orderBy = "ASC";
                }
                $scope.employeeQuery.orderBy = $scope.sortString;
                $scope.employeeQuery.sort = $scope.orderBy;
                $scope.employeeQuery.pageIndex = 1;
                $scope.loadEmployee();
            }
            $scope.pageChanged = function() {
                $scope.employeeQuery.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadEmployee();
            }

        });
})();