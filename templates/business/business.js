(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.business', {
                url: '/business',
                views: {
                    '@': {
                        templateUrl: 'templates/business/business.tpl.html',
                        //controller: 'business'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */
    angular.module('business', [])
        .config(config)
        .controller('business', function($scope, $state, DataService, $rootScope) {
            $scope.orderBy = null;
            $scope.sortString = null;
            $scope.modalShow = false;
            $scope.paramInitial = function() {
                $scope.businessParam = {
                    pageIndex: 1,
                    pageCount: 20,
                    keywords: null,
                    sort: null,
                    orderBy: null
                }
            }

            $scope.createBusiness = function() {
                $state.go("root.business-create");
            }
            $scope.loadData = function() {
                DataService.run("businessQueryAll", $scope.businessParam,
                    function(response) {
                            $scope.businessList = response.rows;
                            $scope.pageInfo = response.pageInfo;
                            $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                    },
                    function(response) {

                    });
            }

            function init() {
                $scope.paramInitial();
                $scope.loadData();
            }
            init();
            $scope.pageChanged = function() {
                // console.log($scope.pageInfo.pageIndex);
                $scope.businessParam.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadData();
            }
            $scope.search = function() {
                //$scope.paramInitial();
                $scope.businessParam.keywords = $scope.keywords;
                $scope.businessParam.pageIndex = 1;
                $scope.loadData();
            };
            $scope.clean = function() {
                //这里清空默认查询，没有排序，没有关键字，显示第一页
                $scope.keywords = null;
                $scope.sortString = null;
                $scope.orderBy = null;
                $scope.paramInitial();
                //$scope.businessParam.keywords = null;
                $scope.loadData();
            };
            $scope.closeModal = function() {
                $scope.modalShow = false;
                $rootScope.modalStus(false);
            }
            $scope.businessModify = function(businessId) {
                var parame = DataService.getInitialParam("businessQuery");
                parame.id = businessId;
                DataService.run("businessQuery", null,
                    function(response) {
                        //alert(JSON.stringify(response));
                        $scope.businessEdit = response["model"]
                            //orgLogo orgSlogan orgStartLogo 置空
                        $scope.businessEdit.orgLogo = null;
                        $scope.businessEdit.orgSlogan = null;
                        $scope.businessEdit.orgStartLogo = null;

                        var tfsUtl = DataService.getTfsUrl();

                        $scope.orgLogoShow = "";
                        $scope.orgStartLogoShow = "";

                        if ($scope.businessEdit.logo) {
                            $scope.orgLogoShow = tfsUtl + $scope.businessEdit.logo;
                        }
                        if ($scope.businessEdit.startLogo) {
                            $scope.orgStartLogoShow = tfsUtl + $scope.businessEdit.startLogo;
                        }
                        $scope.verifyTypes = {
                            workNo: "",
                            idNo: "",
                            insNo: ""
                        }

                        var temp = ($scope.businessEdit.verifyTypes || "").split(",");
                        for(var i=0; i<temp.length; i++){
                            if (temp[i]=='1') $scope.verifyTypes.workNo = '1';
                            if (temp[i]=='2') $scope.verifyTypes.idNo = '2';
                            if (temp[i]=='3') $scope.verifyTypes.insNo = '3';
                        }
                        $rootScope.modalStus(true);
                        $scope.modalShow = true;
                        $scope.opration = "edit";
                    },
                    function(response) {

                    });

            }
            $scope.businessQuery = function(businessId) {
                $scope.logoShow = "";
                $scope.startLogoShow = "";
                var tfsUtl = DataService.getTfsUrl();
                $scope.businessShow = {};
                var parame = DataService.getInitialParam("businessQuery");
                parame.id = businessId;
                DataService.run("businessQuery", null,
                    function(response) {
                        //alert(JSON.stringify(response));
                        $scope.businessShow = response["model"];
                        if ($scope.businessShow.logo) {
                            $scope.logoShow = tfsUtl + $scope.businessShow.logo;
                        }
                        if ($scope.businessShow.startLogo) {
                            $scope.startLogoShow = tfsUtl + $scope.businessShow.startLogo;
                        }
                        $scope.opration = "show";
                        $rootScope.modalStus(true);
                        $scope.modalShow = true;
                    },
                    function(response) {

                    });
            }
            $scope.saveBusinessEdit = function() {
                var temp = [];
                for(var i in $scope.verifyTypes){
                    if ($scope.verifyTypes[i]!=""){
                        temp.push($scope.verifyTypes[i]);
                    }
                }
                $scope.businessEdit.verifyTypes = temp.join();

                DataService.run("businessUpdate", $scope.businessEdit,
                    function(response) {
                        $scope.businessEdit = null;
                        $scope.loadData();
                        $scope.closeModal();
                    },
                    function(response) {

                    });
            }
            
            $scope.rmStartLogo = function() {
                $scope.businessEdit.orgStartLogo = null;
                if ($scope.businessEdit.startLogo) {
                    DataService.run("deleteStartLogo", {businessId: $scope.businessEdit.id},
                    function(response) {
                        $scope.businessEdit.startLogo = "";
                        $rootScope.showToast('success', "删除成功");
                        $scope.orgStartLogoShow = "";
                    },
                    function(response) {

                    });
                } 
                
            }
            $scope.sortByString = function(target) {
                $scope.orderBy = null;
                var className = event.target.getAttribute("class");
                $scope.sortString = event.target.getAttribute("aria-label");
                console.log(className, $scope.sortString);
                if (className == "sorting" || className == "sorting_asc") {
                    $scope.orderBy = "DESC";
                } else {
                    $scope.orderBy = "ASC";
                }
                $scope.businessParam.orderBy = $scope.sortString;
                $scope.businessParam.sort = $scope.orderBy;
                $scope.businessParam.pageIndex = 1;
                $scope.loadData();
            }
            $scope.setLocalStorage = function(businessId) {
                    DataService.setBusinessId(businessId);
                }

            $scope.setBusinessInfo = function(businessInfo) {
                    DataService.setBusinessInfo(businessInfo);
                }
                //选择日期
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
            //选择图片
            function readImg(imgObj, id) {

                if (imgObj) {
                    //大小判断
                    if (imgObj.size > 1 * 1024 * 1024) {
                        document.getElementById(id).value = "";
                       // alert("允许上传的图片的最大为2M，请重新选择");
                       $rootScope.showToast("error", "允许上传的图片的最大为1M，请重新选择");
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
                                    var result = $scope.checkImg(id, imgW, imgH);
                                    if (result.flag == true) {
                                        // document.getElementById(id+"Show").src = base64;
                                        $scope[id + "Show"] = base64;
                                        $scope.businessEdit[id] = evt.target.result;
                                        $scope.$apply();
                                    } else {
                                        //删除选入的文件
                                        //alert(result.msg);
                                        $rootScope.showToast("error", result.msg);
                                        $rootScope.$apply();
                                    }
                                    document.getElementById(id).value = "";
                                }                        
                            }
                        }
                        $scope.reader.readAsDataURL(imgObj);
                    }
                }
            }
            $scope.chooseImg = function() {
                    var img = event.target.files[0];
                    var id = event.target.id;
                    //防呆判断
                    //文件格式判断，仅支持png
                    var imgName = img.name;
                    var suffix = (imgName.lastIndexOf('.') > -1) && imgName.substring(imgName.lastIndexOf('.') + 1) || '';
                    if (suffix != 'png') {
                        $rootScope.showToast("error", "请选择正确格式的图片，当前仅支持png格式！");
                        $rootScope.$apply();
                        event.target.value = "";
                        return;
                    }
                    readImg(img, id);
                }
                //判断照片的尺寸
            $scope.checkImg = function(id, width, height) {
                var flag = false;
                var result = {
                    flag: false,
                    msg: ""
                };
                if (id == "orgLogo") {
                    //logo  124*70
                    // (width > $rootScope.constant.orgLogo.width || height > $rootScope.constant.orgLogo.height) ? result.msg = "长不能超过" + $rootScope.constant.orgLogo.width + "px, 高不能超过" + $rootScope.constant.orgLogo.height + "px": result.flag = true;
                    result.flag  = true;
                } else if (id == "orgSlogan") {
                    //orgSlogan 640*82
                    (width > $rootScope.constant.orgSlogan.width || height > $rootScope.constant.orgSlogan.height) ? result.msg = "长不能超过" + $rootScope.constant.orgSlogan.width + "px, 高不能超过" + $rootScope.constant.orgSlogan.height + "px": result.flag = true;
                } else if (id == "orgStartLogo") {
                    //orgStartLogo 370*500
                    (width > $rootScope.constant.orgStartLogo.width || height > $rootScope.constant.orgStartLogo.height) ? result.msg = "长不能超过" + $rootScope.constant.orgStartLogo.width + "px, 高不能超过" + $rootScope.constant.orgStartLogo.height + "px": result.flag = true;
                }
                return result;
            }
        })
        
})();