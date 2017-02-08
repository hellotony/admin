(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.app-manager', {
                url: '/app-manager',
                views: {
                    '@': {
                        templateUrl: 'templates/app-manager/app-manager.tpl.html',
                        //controller: 'appManager'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('app-manager', [])
        .config(config)
        .controller('appManager', function($scope, $state, DataService, $rootScope) {
            $scope.showDetail = false;
            $scope.tfsUrl = DataService.getTfsUrl();

            $scope.init = function() {
                DataService.run("aboutusQuery", null,
                    function(response) {
                        //alert(JSON.stringify(response));
                        $scope.appInfoList = response["rows"];
                    },
                    function(response) {

                    });
            }
            $scope.paramInitial = function() {
                $scope.aboutUs = {
                    id: null,
                    title: null,
                    versionNo: null,
                    versionCode: null,
                    orgPicture: null,
                    picture: null,
                    url: null,
                    forceUpdate: null,
                    updateDate: null,
                    size: null,
                    platform: null,
                    changeLog: null,
                    description: null,
                    enable: null
                }
            }
            $scope.init();

            $scope.showDetailTab = function(appInfoId) {
                if (appInfoId) {
                    $scope.showDetailId = appInfoId;
                } else {
                    $scope.showDetailId = null;
                }
            }
            $scope.createAPPInfoFlag = "";

            $scope.openModal = function(aboutUs) {
                $scope.paramInitial();
                $scope.pictureShow = "";
                $rootScope.modalStus(true);
                if (aboutUs) {
                    $scope.createAPPInfoFlag = "modify";
                    $scope.aboutUs.id = aboutUs.id;
                    $scope.aboutUs.title = aboutUs.title;
                    $scope.aboutUs.versionNo = aboutUs.versionNo;
                    $scope.aboutUs.versionCode = aboutUs.versionCode;
                    $scope.aboutUs.picture = aboutUs.picture;
                    $scope.aboutUs.url = aboutUs.url;
                    $scope.aboutUs.forceUpdate = aboutUs.forceUpdate;
                    $scope.aboutUs.size = aboutUs.size;
                    $scope.aboutUs.platform = aboutUs.platform;
                    $scope.aboutUs.description = aboutUs.description;
                    $scope.aboutUs.enable = aboutUs.enable;
                    $scope.aboutUs.updateDate = aboutUs.updateDate;
                    $scope.aboutUs.changeLog = aboutUs.changeLog;
                    if ($scope.aboutUs.picture) {
                        var tfsUtl = DataService.getTfsUrl();
                        $scope.pictureShow = tfsUtl + $scope.aboutUs.picture;
                    }
                } else {
                    $scope.createAPPInfoFlag = "create";
                    $scope.aboutUs.enable = false;
                    $scope.aboutUs.forceUpdate = true;
                    $scope.aboutUs.platform = "IOS";
                }
                //console.log($scope.aboutUs);
            }
            $scope.closeModal = function() {
                $scope.createAPPInfoFlag = "";
                $rootScope.modalStus(false);
            }
            $scope.chooseImg = function() {
                var img = event.target.files[0];
                var id = event.target.id;
                //防呆判断
                readImg(img, id);
            }

            $scope.chooseDayOpen = function($event) {
                $scope.startStatus.opened = true;
            };

            $scope.startStatus = {
                opened: false
            };


            function readImg(imgObj, id) {
                if (imgObj) {
                    if (imgObj.size >= 2 * 1024 * 1024) {
                        document.getElementById(id).value = "";
                        // alert("允许上传的图片的最大为2M，请重新选择");
                        $rootScope.showToast("error", "允许上传的图片的最大为2M，请重新选择");
                        $rootScope.$apply();
                    } else {
                        $scope.reader = new FileReader();
                        $scope.reader.onloadend = function(evt) {
                            //读取后触发，无论成功或者失败
                            if ($scope.reader.error) {
                                console.log("error");
                            } else {
                                //尺寸判断
                                var base64 = evt.target.result;
                                var img = new Image();
                                img.src = base64;
                                img.onload = function() {
                                    var imgW = img.width;
                                    var imgH = img.height;

                                    $scope.pictureShow = base64;
                                    $scope.aboutUs.orgPicture = evt.target.result;

                                    // var result = $scope.checkImg(id, imgW, imgH);
                                    // if (result.flag == true) {
                                    //     // document.getElementById(id+"Show").src = base64;
                                    //     $scope.pictureShow = base64;
                                    //     $scope.aboutUs.orgPicture = evt.target.result;
                                    // } else {
                                    //     //删除选入的文件
                                    //     document.getElementById(id).value = "";
                                    //     alert(result.msg);
                                    // }

                                    $scope.$apply();
                                }

                            }
                        }
                        $scope.reader.readAsDataURL(imgObj);
                    }

                }
            }

            $scope.saveCreateEmployee = function() {
                console.log($scope.aboutUs);
                if ($scope.createAPPInfoFlag == 'create') {
                    //创建
                    DataService.run("aboutusCreate", $scope.aboutUs,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.createAPPInfoFlag = "";
                            // alert("创建成功！");
                            $scope.init();
                        },
                        function(response) {

                        });
                } else {
                    //修改
                    DataService.run("aboutusUpdate", $scope.aboutUs,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.createAPPInfoFlag = "";
                            // alert("修改成功！");
                            $scope.init();
                        },
                        function(response) {

                        });
                }
            }
        });
})();