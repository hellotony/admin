(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.business-create', {
                url: '/business-create',
                views: {
                    '@': {
                        templateUrl: 'templates/business-create/business-create.tpl.html',
                        controller: 'createBusiness'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('business-create', [])
        .config(config)
        .controller('createBusiness', function($scope, $state, DataService, $rootScope) {
            $scope.createSts = "businessCreate";
            // $scope.createSts = "crowdCreate";
            $scope.createBusiness = {
                name: null,
                type: 1,
                orgLogo: null,
                // orgSlogan: null,
                orgStartLogo: null,
                outUserId: null,
                needVerify: true,
                verifyType: 1,
                enable: false,
                startDate: null,
                endDate: null,
                verifyAll: false,
                verifyTypes: null
            };

            $scope.verifyTypes={
                workNo: "",
                idNo: "",
                insNo: ""
            };

            $scope.firstCreateCrowd = true;
            $scope.imgShow = "";
            $scope.saveBusiness = function() {
                var temp = [];
                for(var i in $scope.verifyTypes){
                    if ($scope.verifyTypes[i]!=""){
                        temp.push($scope.verifyTypes[i]);
                    }
                }
                $scope.createBusiness.verifyTypes = temp.join();
                console.log($scope.createBusiness);
                DataService.run("businessCreate", $scope.createBusiness,
                    function(response) {
                        //alert(JSON.stringify(response));
                        // alert("创建企业成功！");
                        $scope.imgShow = "";
                        $scope.createSts = "crowdCreate";
                        //$scope.$apply();
                        DataService.setBusinessId(response['model']['id']);
                    },
                    function(response) {

                    });
            }
            $scope.saveCrowd = function() {
                var parame = DataService.getInitialParam("businessEmployeeCreate");
                parame.name = $scope.employeeCreateName;
                DataService.run("businessEmployeeCreate", null,
                    function(response) {
                        //alert(JSON.stringify(response));
                        // alert("创建企业人群成功！");
                        $scope.employeeCreateName = null;
                        $scope.firstCreateCrowd = false;
                    },
                    function(response) {

                    });
            }
            $scope.createCrowdComplete = function() {
                $state.go('root.business');
            }

            function readImg(imgObj, editSts) {
                if (imgObj) {
                    if (imgObj.size > 1 * 1024 * 1024) {
                        document.getElementById(editSts).value = "";
                        $scope.createBusiness[editSts] = null;
                        $scope.imgShow = "";
                        // alert("允许上传的图片的最大为1M，请重新选择");
                        $rootScope.showToast("error", "允许上传的图片最大为1M，请重新选择！");
                        $rootScope.$apply();
                    } else {
                        $scope.reader = new FileReader();
                        $scope.reader.onloadend = function(evt) {
                            //读取后触发，无论成功或者失败
                            if ($scope.reader.error) {
                                console.log("error");
                            } else {
                                if (editSts == 'show') {
                                    $scope.imgShow = evt.target.result;
                                    $scope.$apply();
                                } else {
                                    //尺寸判断
                                    // var base64 = evt.target.result;
                                    var img = new Image();
                                    img.src = evt.target.result;
                                    img.onload = function() {
                                        var imgW = img.width;
                                        var imgH = img.height;
                                        var flag = $scope.checkImg(editSts, imgW, imgH);
                                        if (flag == true) {
                                            $scope.createBusiness[editSts] = evt.target.result;
                                            $scope.$apply();
                                        } else {
                                            //删除选入的文件
                                            document.getElementById(editSts).value = "";
                                            $scope.createBusiness[editSts] = null;
                                            $scope.imgShow = "";
                                            // alert(flag);
                                            $rootScope.showToast("error", flag);
                                            $rootScope.$apply();
                                            // $scope.$apply();
                                        }
                                    }

                                }
                                
                            }
                        }
                        $scope.reader.readAsDataURL(imgObj);
                    }
                }
            }
            $scope.chooseImg = function() {
                //alert(event.target.id)
                var img = event.target.files[0];
                var id = event.target.id;
                $scope.imgShow = "";
                //文件格式判断，仅支持png
                var imgName = img.name;
                var suffix = (imgName.lastIndexOf('.')>-1) && imgName.substring(imgName.lastIndexOf('.')+1) || '';
                if (suffix != 'png') {
                    $rootScope.showToast("error", "请选择正确格式的图片，当前仅支持png格式！");
                    $rootScope.$apply();
                    event.target.value = "";
                    return;
                }
                //防呆判断
                readImg(img, id);
            }
            $scope.show = function(id) {
                var img = document.getElementById(id).files[0];
                readImg(img, "show")
            }
            $scope.checkImg = function(id, width, height) {
                var flag = true;
                if (id == "orgLogo") {
                    //logo 124*70
                    // (width > $rootScope.constant.orgLogo.width || height > $rootScope.constant.orgLogo.height) ? flag = "长不能超过" + $rootScope.constant.orgLogo.width + "px, 高不能超过" + $rootScope.constant.orgLogo.height + "px": flag = true;
                } else if (id == "orgStartLogo") {
                    //orgStartLogo 370*500
                    (width > $rootScope.constant.orgStartLogo.width || height > $rootScope.constant.orgStartLogo.height) ? flag = "长不能超过" + $rootScope.constant.orgStartLogo.width + "px, 高不能超过" + $rootScope.constant.orgStartLogo.height + "px": flag = true;
                }
                return flag;
            }

            // $scope.today = function() {
            //     $scope.dt = new Date();
            // };
            // $scope.today();

            // $scope.clear = function() {
            //     $scope.dt = null;
            // };

            $scope.disabledEndDay = function(date, mode) {
                //console.log(date, mode);
                if ($scope.createBusiness.startDate) {
                    // return (mode=='day' && (date <= $scope.createBusiness.startDate))
                }
            }
            $scope.disabledStartDay = function(date, mode) {
                //console.log(date, mode);
                if ($scope.createBusiness.endDate) {
                    // return (mode=='day' && (date => $scope.createBusiness.endDate))
                }
            }

            $scope.startStatusOpen = function($event) {
                $scope.startStatus.opened = true;
            };
            $scope.endStatusOpen = function($event) {
                $scope.endStatus.opened = true;
            };

            $scope.startStatus = {
                opened: false
            };
            $scope.endStatus = {
                opened: false
            };



        });
})();