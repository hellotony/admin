(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.showcase-info', {
                url: '/showcase-info',
                views: {
                    '@': {
                        templateUrl: 'templates/showcase-info/showcase-info.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('showcase-info', [])
        .config(config)
        .controller('showcaseInfo', function($scope, $state, DataService, $rootScope) {
            $scope.tfsUrl = DataService.getTfsUrl();
            $scope.scenceList = [{value: null, text: '请选择使用位置'}];
            $scope.timingOffDateOpen = function($event) {
                $scope.timingOffDate.opened = true;
            };
            $scope.timingOffDate = {
                opened: false
            };
            $scope.timingOnDateOpen = function($event) {
                $scope.timingOnDate.opened = true;
            };

            $scope.timingOnDate = {
                opened: false
            };
            $scope.showcase = {
                scene: null,
                position: null,
                pageIndex: 1,
                pageCount: 20
            }

            $scope.changeScene = function(scene, position, flag) {
                var List = [];
                if (scene == 0) {
                    List = [{
                        value: null, 
                        text: '请选择使用位置'
                    },{
                        value: 3,
                        text: '企业版首页广告位' 
                        // text: '企业版首页广告位' + (position == 'search' ? '' : (' (' + $rootScope.constant.showcaseHomeP.width + 'px * ' + $rootScope.constant.showcaseHomeP.height + 'px)'))
                    }];
                } else if (scene == 1) {
                    List = [{
                        value: null,
                        text: '请选择使用位置'
                    },{
                        value: 1,
                        text: '插件版热卖商品左侧' + (position == 'search' ? '' : (' (' + $rootScope.constant.showcasePlugL.width + 'px * ' + $rootScope.constant.showcasePlugL.height + 'px)'))
                    },{
                        value: 2,
                        text: '插件版热卖商品右侧' + (position == 'search' ? '' : (' (' + $rootScope.constant.showcasePlugR.width + 'px * ' + $rootScope.constant.showcasePlugR.height + 'px)'))
                    }]
                } else {
                    List = [{value: null, text: '请选择使用位置'}];
                }
                if (position == 'search') {
                    $scope.showcase.position = null;
                    $scope.scenceList = angular.copy(List);
                } else if (position == 'modal'){
                    $scope.senceEditList = angular.copy(List);
                    if (flag) {
                        $scope.showcaseInfoEdit.position = null;
                    }
                }
                 
                
            }
            $scope.loadShowcaseInfo = function(opration) {
                if (opration && opration == "clean") {
                    $scope.showcase = {
                        scene: null,
                        position: null,
                        pageIndex: 1,
                        pageCount: 20
                    }
                }
                $scope.showcase.scene == "null" ? $scope.showcase.scene = null : "";
                $scope.showcase.position == "null" ? $scope.showcase.position = null : "";
                DataService.run("showcaseQueryAll", $scope.showcase,
                    function(response) {
                        $scope.showcaseInfoList = response.rows;
                        $scope.pageInfo = response.pageInfo;
                        $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                    },
                    function(response) {

                    });
            }
            $scope.loadList = function() {
                var businessParam = {
                    pageIndex: 1,
                    pageCount: 1000,
                    keywords: null,
                    sort: null,
                    orderBy: null
                };
                var channelParam = {
                    pageIndex: 1,
                    pageCount: 1000
                }
                DataService.run("businessQueryAll", businessParam,
                    function(response) {
                        $scope.businessList = response.rows;
                        $scope.businessList.unshift({id: null, name:"请选择企业"});
                    },
                    function(response) {

                    });
                DataService.run("channelQueryAll", channelParam,
                    function(response) {
                        $scope.channelInfoList = response.rows;
                        $scope.channelInfoList.unshift({id: null, name:"请选择渠道"});
                    },
                    function(response) {

                    });
            }

            $scope.pageChanged = function() {
                $scope.showcase.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadShowcaseInfo();
            }

            $scope.resetLinkId = function() {
                $scope.showcaseInfoEdit.linkId = null;
            }

            $scope.loadList();
            $scope.loadShowcaseInfo();

            $scope.openModal = function(flag, showcase) {
                $scope.opration = flag;
                $rootScope.modalStus(true);
                if (flag == "show") {
                    $scope.showcaseInfoShow = showcase;
                    if ($scope.showcaseInfoShow.imgUrl != null) {
                        $scope.showcaseImgShow = $scope.tfsUrl + $scope.showcaseInfoShow.imgUrl;
                    }
                } else {
                    if (showcase) {
                        $scope.showcaseInfoEdit = angular.copy(showcase);
                        $scope.changeScene($scope.showcaseInfoEdit.scene, 'modal');
                        // console.log($scope.showcaseInfoEdit.position);
                        $scope.showcaseInfoEdit.orgImgUrl = null;
                        if ($scope.showcaseInfoEdit.imgUrl) {
                            $scope.showcaseImgShow = $scope.tfsUrl + $scope.showcaseInfoEdit.imgUrl;
                        }

                    } else {

                        $scope.showcaseInfoEdit = {
                            title: null,
                            summary: null,
                            status: 10,
                            scene: 0,
                            linkId: null,
                            position: null,
                            operationContent: null,
                            orgImgUrl: null,
                            serialNo: null,
                            timingOnDate: null,
                            timingOffDate: null,
                            group: '1'
                        }
                        $scope.changeScene($scope.showcaseInfoEdit.scene, 'modal');
                    }
                }

                $scope.modalShow = "show";

            }
            $scope.changeShowcase = function() {
                var serviceName = "";
                var pageIndex = 1;
                if ($scope.opration == 'create') {
                    serviceName = 'showcaseCreate';
                } else if ($scope.opration == 'edit') {
                    serviceName = 'showcaseUpdate';
                    pageIndex = $scope.showcase.pageIndex;
                }
                DataService.run(serviceName, $scope.showcaseInfoEdit,
                    function(response) {
                        // alert(JSON.stringify(response));
                        $scope.showcase.pageIndex = pageIndex;
                        $scope.loadShowcaseInfo();
                        $scope.closeModal();
                    },
                    function(response) {

                    });
            }

            $scope.saveShowcaseEdit = function() {
                if ($scope.showcaseImgShow && $scope.showcaseImgShow != "") {
                    var img = new Image();
                    img.src = $scope.showcaseImgShow;
                    var flag = true;
                    img.onload = function() {
                        var imgW = img.width;
                        var imgH = img.height;
                        var flag = checkImg(imgW, imgH);
                        if (flag != true) {
                            $rootScope.showToast("error", flag);
                            $rootScope.$apply();
                        } else {
                            $scope.changeShowcase();
                        }
                    }
                } else {
                    //用于创建/修改时，没有添加图片的场景
                    $scope.changeShowcase();
                }


            }
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.opration = null;
                $scope.showcaseImgShow = '';
                $scope.showcaseInfoEdit = {};
                $scope.showcaseInfoShow = {};
                $rootScope.modalStus(false);
            }
            $scope.transLinkId = function(linkId, scene) {
                var name = "";
                if (scene == '0' ) {
                    var tmp = $scope.businessList;
                } else if (scene == '1') {
                    var tmp = $scope.channelInfoList;
                }
                for (var i=0; i<tmp.length; i++) {
                    if (linkId == tmp[i].id) {
                        name = tmp[i].name;
                        break;
                    }
                }
                return name;
            }
            $scope.chooseImg = function() {
                var img = event.target.files[0];
                //var id = event.target.id;
                //防呆判断
                readImg(img, event.target);
            }

            function readImg(imgObj, target) {
                if (imgObj) {
                    if (imgObj.size > 2 * 1024 * 1024) {
                        //document.getElementById(id).value = "";
                        $rootScope.showToast("error", "允许上传的图片的最大为2M，请重新选择");
                        $rootScope.$apply();
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
                                    var imgW = img.width;
                                    var imgH = img.height;
                                    var flag = checkImg(imgW, imgH);
                                    if (flag == true) {
                                        $scope.showcaseImgShow = base64;
                                        $scope.showcaseInfoEdit.orgImgUrl = evt.target.result;
                                        $scope.$apply();
                                    } else {
                                        //删除选入的文件
                                        target.value = "";
                                        $rootScope.showToast("error", flag);
                                        $rootScope.$apply();
                                    }
                                }
                            }
                        }
                        $scope.reader.readAsDataURL(imgObj);
                    }

                }
            }

            function checkImg(width, height) {
                var flag = true;
                var position = $scope.showcaseInfoEdit.position;
                if (position == 0) {
                    //企业版首页 320*150 已经废弃
                    (width > 320 || height > 150) ? flag = "长不能超过320px, 高不能超过150px": flag = true;
                } else if (position == 1) {
                    //插件版热卖商品左侧 302*327
                    (width > $rootScope.constant.showcasePlugL.width || height > $rootScope.constant.showcasePlugL.height) ? flag = "长不能超过" + $rootScope.constant.showcasePlugL.width + "px, 高不能超过" + $rootScope.constant.showcasePlugL.height + "px": flag = true; 
                } else if (position == 2) {
                    //插件版热卖商品右侧 302*154
                    (width > $rootScope.constant.showcasePlugR.width || height > $rootScope.constant.showcasePlugR.height) ? flag = "长不能超过" + $rootScope.constant.showcasePlugR.width + "px, 高不能超过" + $rootScope.constant.showcasePlugR.height + "px": flag = true;
                } else if (position == 3) {
                    //企业版首页广告位(新版) 750*320px
                    // (width > $rootScope.constant.showcaseHomeP.width || height > $rootScope.constant.showcaseHomeP.height) ? flag = "长不能超过" + $rootScope.constant.showcaseHomeP.width + "px, 高不能超过" + $rootScope.constant.showcaseHomeP.height + "px": flag = true;
                }

                return flag;
            }

        });
})();