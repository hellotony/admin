(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.common-service', {
                url: '/common-service',
                views: {
                    '@': {
                        templateUrl: 'templates/common-service/common-service.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('common-service', [])
        .config(config)
        .controller('commonService', function($scope, $state, DataService, $rootScope) {
            $scope.tfsUrl = DataService.getTfsUrl();
            $scope.serviceIconShow = '';
            $scope.commonServiceTypeList = [{
                type: 1,
                name: "名医预约"
            }, {
                type: 2,
                name: "家庭医生",
            }, {
                type: 3,
                name: "体检服务",
            }, {
                type: 4,
                name: "基因检测",
            }, {
                type: 5,
                name: "慢病管理",
            }, {
                type: 6,
                name: "血压管理",
            }, {
                type: 8,
                name: "名医问诊",
            }, {
                type: 14,
                name: "挂号",
            }, {
                type: 15,
                name: "上门检测",
            }, {
                type: 17,
                name: "保险服务",
            }, {
                type: 18,
                name: "心理咨询",
            }];
            $scope.getName = function(type) {
                var serviceName = "";
                for (var i=0; i<$scope.commonServiceTypeList.length; i++){
                    if ($scope.commonServiceTypeList[i].type == type){
                        serviceName = $scope.commonServiceTypeList[i].name;
                        break;
                    }
                }
                return serviceName;
            }
            $scope.serviceQueryParam = {
                pageIndex: 1,
                pageCount: 20
            }
            $scope.loadService = function() {
                DataService.run("serviceQueryAll", $scope.serviceQueryParam,
                    function(response) {
                        //alert(JSON.stringify(response));
                        // if (response.rows.length == 0) {
                        //     // alert("未查找到符合要求的信息。");
                        // } else {
                            $scope.commonServicePool = response.rows;
                            for (var i=0; i<$scope.commonServicePool.length; i++){
                                $scope.commonServicePool[i].serviceName = $scope.getName($scope.commonServicePool[i].type)
                            }
                            $scope.pageInfo = response.pageInfo;
                            $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                        // }
                    },
                    function(response) {

                    });
            }
            $scope.pageChanged = function() {
                $scope.serviceQueryParam.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadService();
            }
            $scope.loadService();
            $scope.openModal = function(flag, serviceInfo) {
                $scope.opration = flag;
                $rootScope.modalStus(true);
                if (flag == "show") {
                    $scope.commonServiceShow = serviceInfo;
                    if ($scope.commonServiceShow.icon != null) {
                        $scope.serviceIconShow = $scope.tfsUrl + $scope.commonServiceShow.icon;
                    }
                } else {
                    if (serviceInfo) {
                        $scope.commonServiceEdit = {
                            id: serviceInfo.id,
                            name: serviceInfo.name,
                            orgIcon: null,
                            weight: serviceInfo.weight,
                            enable: serviceInfo.enable,
                            mustHave: serviceInfo.mustHave,
                            type: serviceInfo.type,
                            icon: serviceInfo.icon,
                            url: serviceInfo.url,
                            personal: serviceInfo.personal
                        }
                        if ($scope.commonServiceEdit.icon != null) {
                            $scope.serviceIconShow = $scope.tfsUrl + $scope.commonServiceEdit.icon;
                        }
                    } else {
                        $scope.commonServiceEdit = {
                            name: null,
                            orgIcon: null,
                            weight: null,
                            enable: true,
                            mustHave: false,
                            type: 1,
                            icon: null,
                            url: null,
                            personal: false
                        }
                    }

                }

                $scope.modalShow = "show";

            }
            $scope.forceDisabledHandler = function(serviceId) {
                var param = DataService.getInitialParam("forceDisableService");
                param.id = serviceId;
                DataService.run("forceDisableService", null,
                    function(response) {
                        // alert("该服务已经禁用。");
                        $scope.loadService();
                    },
                    function(response) {

                    });
            }
            $scope.forceDisabled = function(serviceId) {
                $rootScope.showToast("confirm", "是否强制禁用，该操作会影响所有添加该服务的企业？", $scope.forceDisabledHandler, serviceId);
            }
            $scope.saveServiceEdit = function() {
                if ($scope.opration == 'create') {
                    DataService.run("commonServiceCreate", $scope.commonServiceEdit,
                        function(response) {
                            // alert(JSON.stringify(response));
                            $scope.serviceQueryParam.pageIndex = 1;
                            $scope.loadService();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                } else if ($scope.opration == 'edit') {
                    DataService.run("commonServiceUpdate", $scope.commonServiceEdit,
                        function(response) {
                            //alert(JSON.stringify(response));
                            //$scope.serviceQueryParam.pageIndex = 1;
                            $scope.loadService();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                }

            }
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.opration = null;
                $scope.serviceIconShow = '';
                $scope.commonServiceEdit = {};
                $scope.commonServiceShow = {};
                $rootScope.modalStus(false);
            }
            $scope.chooseImg = function() {
                var img = event.target.files[0];
                //var id = event.target.id;
                //防呆判断
                readImg(img);
            }
            function readImg(imgObj) {
                if (imgObj) {
                    if (imgObj.size >= 2 * 1024 * 1024) {
                        //document.getElementById(id).value = "";
                        alert("允许上传的图片的最大为2M，请重新选择");
                    } else {
                        $scope.reader = new FileReader();
                        $scope.reader.onloadend = function(evt) {
                            //读取后触发，无论成功或者失败
                            if ($scope.reader.error) {
                                console.log("error");
                            } else {
                                var base64 = evt.target.result;
                                var img = new Image();
                                img.src = base64;
                                img.onload = function() {
                                    //var imgW = img.width;
                                    //var imgH = img.height;

                                    $scope.serviceIconShow = base64;
                                    $scope.commonServiceEdit.orgIcon = evt.target.result;

                                    $scope.$apply();
                                }

                            }
                        }
                        $scope.reader.readAsDataURL(imgObj);
                    }

                }
            }

        });
})();