(function() {
  'use strict';

  footerCtrl.$inject = ["$log"];
  function footerCtrl($log) {
    $log.debug('Footer loaded');
  }

  angular.module('common.footer', [])
    .controller('FooterCtrl', footerCtrl);
})();

(function() {
  'use strict';

  headerCtrl.$inject = ["$log"];
  function headerCtrl($log) {
    $log.debug('Header loaded');
  }

  angular.module('common.header', [])
    .controller('HeaderCtrl', headerCtrl);
})();

(function() {
    'use strict';

    menuCtrl.$inject = ["$log", "$scope", "$rootScope", "$state"];
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
                            return stateName
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
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
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
        .controller('appManager', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
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
        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
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
        .controller('business', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
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
        }])
        
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
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
        .controller('createBusiness', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
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



        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.business-employee', {
                url: '/business-employee',
                views: {
                    '@': {
                        templateUrl: 'templates/business-employee/business-employee.tpl.html',
                        controller: 'createBusinessmployee'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('business-employee', [])
        .config(config)
        .controller('createBusinessmployee', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.createEmployee = false;
            $scope.addEmployeeName = null;
            $scope.addNotice = null;
            loadEmployeeList();

            function loadEmployeeList() {
                DataService.run("businessEmployeeQuery", null,
                    function(response) {
                        //alert(JSON.stringify(response));
                        $scope.employeeList = response["model"];
                    },
                    function(response) {

                    });
            }
            $scope.openModal = function(employeeId, employeeIdName,notice) {
                $scope.createEmployee = true;
                $rootScope.modalStus(true);
                if (employeeId) {
                    $scope.employeeId = employeeId;
                    $scope.addEmployeeName = employeeIdName;
                    $scope.addNotice = notice;
                } else {
                    $scope.employeeId = null;
                }
            }

            //删除企业人群，该模块现已删除
            // $scope.confirmDel = function(employeeId) {
            //     var deleParam = DataService.getInitialParam("businessEmployeeDelete");
            //         deleParam.id = employeeId;

            //         DataService.run("businessEmployeeDelete", null,
            //             function(response) {
            //                 //alert(JSON.stringify(response));
            //                 loadEmployeeList();
            //                 // alert("删除企业人群成功");
            //             },
            //             function(response) {

            //             });
            // }
            // $scope.deleteEmployee = function(employeeId) {
            //     $rootScope.showToast("confirm", "删除后该人群下所有员工将移入默认分组，且该操作不可恢复，确定删除吗？", $scope.confirmDel, employeeId);
            // }      
            
            $scope.closeModal = function() {
                $scope.createEmployee = false;
                $scope.addEmployeeName = null;
                $scope.addNotice = null;
                $rootScope.modalStus(false);
            }
            $scope.saveCreateEmployee = function() {
                var parame = "";
                var msg = "";
                if (!$scope.employeeId) {
                    parame = DataService.getInitialParam("businessEmployeeCreate");
                    parame.name = $scope.addEmployeeName;
                    parame.notice = $scope.addNotice;
                    DataService.run("businessEmployeeCreate", null,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.addEmployeeName = null;
                            $scope.addNotice = null;
                            $scope.createEmployee = false;
                            $rootScope.modalStus(false);
                            loadEmployeeList();
                            // alert("创建企业人群成功");
                        },
                        function(response) {

                        });

                } else {
                    parame = DataService.getInitialParam("businessEmployeeUpdate");
                    parame.name = $scope.addEmployeeName;
                    parame.notice = $scope.addNotice
                    parame.id = $scope.employeeId;
                    DataService.run("businessEmployeeUpdate", null,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.addEmployeeName = null;
                            $scope.addNotice = null;
                            $scope.createEmployee = false;
                            $rootScope.modalStus(false);
                            loadEmployeeList();
                            // alert("修改企业人群成功");
                        },
                        function(response) {

                        });
                }
            }
            $scope.setLocalStorage = function(employeeId) {
                    DataService.setEmployeeId(employeeId);
                }
        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.msglist', {
                url: '/msglist/:bussinessId',
                views: {
                    '@': {
                        templateUrl: 'templates/business-msg/list.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('msglist', ['underscore'])
        .config(config)
        .controller('msglist', ["$scope", "$state", "DataService", "$rootScope", "_", function($scope, $state, DataService, $rootScope, _) {
            $scope.bussinessId = $state.params.bussinessId;
            $scope.paramInitial = function() {
                $scope.NewsAction = {
                    pageIndex: 1,
                    pageCount: 20,
                    createStartTime: null,
                    createEndTime: null,
                    orderBy: "id",
                    sort: "desc",
                    businessId: $scope.bussinessId
                }
            }
            $scope.operationTypeList = [{
                "value": 1,
                "text": "普通消息"
            }];



            function loadNews() {
                if ($scope.createStartTime) {
                    $scope.NewsAction.createStartTime = date2string($scope.createStartTime);
                }
                if ($scope.createEndTime) {
                    $scope.NewsAction.createEndTime = date2string($scope.createEndTime);
                }
                DataService.run("newsQueryAll", $scope.NewsAction,
                    function(response) {

                        $scope.NewsList = response.rows;
                        $scope.pageInfo = response.pageInfo;
                        $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);


                        DataService.run("businessEmployeeQuery", {
                            businessId: $scope.bussinessId
                        }, function(response) {
                            $scope.employeeType = response.model;
                        })
                    },
                    function(response) {

                    });
            }
            $scope.pageChanged = function() {
                //console.log($scope.pageInfo.pageIndex);
                $scope.NewsAction.pageIndex = $scope.pageInfo.pageIndex;
                loadNews();
            }
            $scope.init = function() {
                $scope.paramInitial();
                $scope.createStartTime = null;
                $scope.createEndTime = null;
                loadNews();
            }
            $scope.showModal = false;
            $scope.collapseId = null;
            $scope.init();

            $scope.search = function() {
                loadNews();
            }
            $scope.sortByString = function() {
                $scope.orderBy = null;
                var className = event.target.getAttribute("class");
                $scope.sortString = event.target.getAttribute("aria-label");

                if (className == "sorting" || (className.indexOf("sorting_asc") > -1)) {
                    $scope.orderBy = "DESC";
                } else {
                    $scope.orderBy = "ASC";
                }
                $scope.NewsAction.orderBy = $scope.sortString;
                $scope.NewsAction.sort = $scope.orderBy;
                $scope.NewsAction.pageIndex = 1;
                loadNews();
            }
            $scope.openModal = function(flag, originNewsDetail) {
                var newsDetail;
                if (originNewsDetail) {
                    newsDetail = JSON.parse(JSON.stringify(originNewsDetail));
                }

                $scope.opration = flag;
                $rootScope.modalStus(true);
                // if (flag == "show") {
                //    $scope.newsItem = newsDetail;
                // } else {
                if (newsDetail) {
                    if (!newsDetail.employeeTypeNewsList) {
                        newsDetail.employeeTypeNewsList = [];
                    }

                    //将已选的人群设置为true
                    _.each(newsDetail.employeeTypeNewsList,
                        function(item) {
                            item.businessEmployeeType && (item.name = item.businessEmployeeType.name);
                            item.selected = true;
                        });
                    //与企业已有人群进行合并
                    _.each($scope.employeeType, function(item) {
                        //遍历原消息的人群，如果没有发现该人群，则添加
                        var matchItem = _.find(newsDetail.employeeTypeNewsList, function(typeItem) {
                            return typeItem.employeeTypeId == item.id;
                        })
                        if (matchItem) {
                            //如果有相同对象，则把属性拷贝过去
                            angular.extend(matchItem, item);

                        } else {
                            //如果没有相同对象，则push

                            newsDetail.employeeTypeNewsList.push(item);
                        }
                    });

                    newsDetail.employeeTypeNewsList = _.sortBy(newsDetail.employeeTypeNewsList, function(item) {
                        return item.id;
                    });

                    //修改
                    $scope.newsItem = newsDetail;


                } else {
                    //新增
                    $scope.newsItem = {
                            title: null,
                            businessId: $scope.bussinessId,
                            type: 1,
                            content: null,
                            enable: true,
                            employeeTypeNewsList: $scope.employeeType,
                            startDate: null,
                            endDate: null


                        }
                        // }

                }

                $scope.modalShow = "show";

            }
            $scope.chooseStartDate = function($event) {
                $scope.startDateStatus.opened = true;
            };

            $scope.startDateStatus = {
                opened: false
            };

            $scope.chooseEndDate = function($event) {
                $scope.endDateStatus.opened = true;
            };

            $scope.endDateStatus = {
                opened: false
            };

            $scope.saveNews = function() {
                var selectedList=_.filter($scope.newsItem.employeeTypeNewsList,
                    function(item) {
                        return item.selected == true;
                    });

                 if (selectedList.length == 0) {
                    alert("请选择推送人群")
                    return;
                }

                //过滤掉未选中的
                $scope.newsItem.employeeTypeNewsList = selectedList;

               
                //服务端不认id ,只认employeeTypeId 需要赋值
                _.each($scope.newsItem.employeeTypeNewsList,
                    function(item) {
                        item.employeeTypeId = item.id;
                    });


                if ($scope.opration == 'create') {
                    DataService.run("newsCreate", $scope.newsItem,
                        function(response) {
                            // alert(JSON.stringify(response));
                            $scope.NewsAction.pageIndex = 1;
                            loadNews();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                } else if ($scope.opration == 'edit') {
                    DataService.run("newsUpdate", $scope.newsItem,
                        function(response) {
                            //alert(JSON.stringify(response));
                            //$scope.serviceQueryParam.pageIndex = 1;
                            loadNews();
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

            $scope.showDetail = function(News) {
                var param = DataService.getInitialParam("newsQuery");
                param.id = News.id;
                DataService.run("newsQuery", null,
                    function(response) {
                        //alert(JSON.stringify(response));
                        // if (response.model.length == 0) {
                        //     // alert("未查找到符合要求的信息。");
                        // } else {
                        $scope.detailList = response.model;
                        $scope.showModal = true;
                        $rootScope.modalStus(true);
                        // }
                    },
                    function(response) {

                    });
            }
            $scope.hideModal = function() {
                $scope.showModal = false;
                $scope.comment = null;
                $scope.detailList = null;
                $scope.contentList = null;
                $rootScope.modalStus(false);
            }
            $scope.showDetailContent = function(id) {
                var param = DataService.getInitialParam("newsQuery");
                param.NewsId = id;
                DataService.run("newsQuery", null,
                    function(response) {
                        // //alert(JSON.stringify(response));
                        // if (response.model.length == 0) {
                        //     // alert("未查找到符合要求的信息。");

                        // } else {
                        $scope.contentList = response.model;
                        // }
                    },
                    function(response) {

                    });
                //expand <-> collapse
                var status = event.target.getAttribute("data-action");
                if (status == "expand") {
                    $scope.collapseId = id;
                    $scope.detailContentId = id;
                } else {
                    $scope.collapseId = null;
                    $scope.detailContentId = null;
                }
            }
            $scope.startDayOpen = function($event) {
                $scope.startDay.opened = true;
            };

            $scope.startDay = {
                opened: false
            };
            $scope.endDayOpen = function($event) {
                $scope.endDay.opened = true;
            };

            $scope.endDay = {
                opened: false
            };
        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.business-service', {
                url: '/business-service',
                views: {
                    '@': {
                        templateUrl: 'templates/business-service/business-service.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('business-service', [])
        .config(config)
        .controller('businessService', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.loadCommonService = function() {
                DataService.run("serviceQueryAll", null,
                    function(response) {
                        $scope.serviceList = response.rows;
                        $scope.loadBusinessService();
                    },
                    function(response) {

                    });
            }
            $scope.loadCommonService();

            $scope.loadBusinessService = function() {
                DataService.run("businessServiceQuery", null,
                    function(response) {
                        $scope.businessServicePool = response.model;
                        // $scope.$apply();
                        var i, j;
                        for (i = 0; i < $scope.businessServicePool.length; i++) {
                            for (j = 0; j < $scope.serviceList.length; j++) {
                                if ($scope.businessServicePool[i].serviceId == $scope.serviceList[j].id) {
                                    $scope.businessServicePool[i].name = $scope.serviceList[j].name;
                                    break;
                                }
                            }
                        }
                        $scope.serviceAvailableList = [];
                        for (i = 0; i < $scope.serviceList.length; i++) {
                            $scope.serviceAvailableList.push({
                                id: $scope.serviceList[i].id,
                                name: $scope.serviceList[i].name,
                                enable: $scope.serviceList[i].enable,
                            });
                        }
                        //查找其中的可用服务
                        for (i = 0; i < $scope.businessServicePool.length; i++) {
                            for (j = 0; j < $scope.serviceAvailableList.length; j++) {
                                // console.log($scope.serviceAvailableList.length);
                                if ($scope.businessServicePool[i].serviceId == $scope.serviceAvailableList[j].id) {
                                    $scope.serviceAvailableList.splice(j, 1);
                                    // console.log($scope.serviceAvailableList);
                                }
                            }
                        }
                        for (var i = 0; i < $scope.serviceAvailableList.length; i++) {
                            if ($scope.serviceAvailableList[i].enable == false) {
                                // console.log($scope.serviceAvailableList[i].name);
                                $scope.serviceAvailableList[i].name = $scope.serviceAvailableList[i].name + "（该服务未启用）";
                            }
                        }
                    },
                    function(response) {

                    });
            }

            $scope.openModal = function(flag, serviceInfo) {
                $scope.opration = flag;
                if (flag == "show") {
                    //查看详情
                    $scope.businessServiceShow = serviceInfo;
                    //show name
                    $scope.modalShow = "show";
                    $rootScope.modalStus(true);
                } else {
                    if (serviceInfo) {
                        //修改
                        $scope.businessServiceName = serviceInfo.name;
                        $scope.businessServiceEdit = {
                            id: serviceInfo.id,
                            serviceId: serviceInfo.serviceId,
                            url: serviceInfo.url,
                            enable: serviceInfo.enable,
                        }
                        $scope.modalShow = "show";
                        $rootScope.modalStus(true);
                    } else {
                        //创建
                        if ($scope.serviceAvailableList.length == 0) {
                            $rootScope.showToast("error", "当前服务库中已经没有可创建的企业服务，请先在服务管理中创建服务后再创建企业服务。");
                        } else {
                            $scope.businessServiceEdit = {
                                serviceId: $scope.serviceAvailableList[0].id,
                                url: null,
                                enable: true,
                            }
                            $scope.modalShow = "show";
                            $rootScope.modalStus(true);
                        }
                    }
                }
            }
            $scope.saveServiceEdit = function() {
                if ($scope.opration == 'create') {
                    $scope.businessServiceEdit.businessId = DataService.getInitialParam("businessServiceCreate").businessId;
                    DataService.run("businessServiceCreate", $scope.businessServiceEdit,
                        function(response) {
                            // alert(JSON.stringify(response));
                            $scope.loadBusinessService();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                } else if ($scope.opration == 'edit') {
                    $scope.businessServiceEdit.businessId = DataService.getInitialParam("businessServiceUpdate").businessId;
                    DataService.run("businessServiceUpdate", $scope.businessServiceEdit,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.loadBusinessService();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                }

            }
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.opration = null;
                $scope.businessServiceeEdit = {};
                $scope.businessServiceShow = {};
                $rootScope.modalStus(false);
            }


        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.business-sms', {
                url: '/business-sms/:businessId',
                views: {
                    '@': {
                        templateUrl: 'templates/business-sms/business-sms.tpl.html',
                    }
                }
            })
            .state('root.business-sms-module', {
                url: '/business-sms-module/:businessId',
                views: {
                    '@': {
                        templateUrl: 'templates/business-sms/business-sms-module.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('business-sms', [])
        .config(config)
        .controller('smsManager', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.businessId = $state.params.businessId;
            $scope.titleInfo = {
                'title': "企业管理",
                'href': '#/business',
                'subtitle': '短信发送管理'
            };
            $scope.businessInfo = DataService.getBusinessInfo();
            $scope.initParam = function() {
                $scope.smsSearchInfo = {
                    'businessId': $scope.businessId,
                    'pageIndex': 1,
                    'pageCount': 20,
                    'employeeTypeId': null,
                    'name': null,
                    'mobile': null,
                    'tplKey': null,
                    'isSent': null,
                    'cardNo': null
                }
            }
            $scope.getEmployeeName = function(id) {
                if ($scope.employeeList) {
                    for (var i = 0; i < $scope.employeeList.length; i++) {
                        if (id == $scope.employeeList[i].id) {
                            return $scope.employeeList[i].name;
                        }
                    }
                }
            }
            $scope.loadSMSInfo = function() {
                $scope.smsSearchInfo.name == ""? $scope.smsSearchInfo.name = null:'';
                $scope.smsSearchInfo.mobile == ""? $scope.smsSearchInfo.mobile = null:'';
                $scope.smsSearchInfo.cardNo == ""? $scope.smsSearchInfo.cardNo = null:'';
                DataService.run("sendMessageQueryAll", $scope.smsSearchInfo,
                    function(response) {
                        $scope.smsManagerList = response.rows;
                        $scope.pageInfo = response.pageInfo;
                        $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                    },
                    function(response) {

                    });
            }
            $scope.loadEmployee = function() {
                var param = {
                    businessId: $scope.businessId
                }
                DataService.run("businessEmployeeQuery", param,
                    function(response) {
                        $scope.employeeList = response["model"] || [];
                        $scope.employeeList.unshift({
                            id: null,
                            'name': '请选择'
                        })
                    },
                    function(response) {

                    });
            }
            $scope.loadMsgTpl = function() {
                var params = angular.copy(DataService.getInitialParam("msgTplQueryAll"));
                params.pageCount = 100;
                DataService.run("msgTplQueryAll", params,
                    function(response) {
                        $scope.smsModuleList = response["rows"] || [];
                        $scope.smsModuleList.unshift({
                            tplKey: null,
                            'name': '请选择'
                        })
                    },
                    function(response) {

                    });
            }
            $scope.initParam();
            $scope.loadEmployee();
            $scope.loadMsgTpl();
            $scope.loadSMSInfo();

            $scope.pageChanged = function() {
                $scope.smsSearchInfo.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadSMSInfo();
            }

            $scope.openModal = function(flag, smsManagerInfo) {
                $scope.operation = flag;
                $rootScope.modalStus(true);
                if ($scope.operation == 'importInfo') {

                } else if ($scope.operation == 'importPsd') {


                } else if ($scope.operation == 'SMS') {
                    $scope.sms = {
                        employeeTypeId: null,
                        tplKey: null
                    }
                } else if ($scope.operation == 'show') {
                    $scope.smsManagerInfo = angular.copy(smsManagerInfo)
                }
                $scope.modalShow = "show";
            }

            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.operation = null;
                $rootScope.modalStus(false);
                $scope.smsManagerInfo ? $scope.smsManagerInfo = {} : "";
            }

            $scope.dataServiceRun = function(serviceName, params, func) {
                DataService.run(serviceName, params,
                    function(response) {
                        // alert(JSON.stringify(response));
                        $scope.closeModal();
                        setTimeout($scope.loadSMSInfo(), 500);
                        if (func) {
                            func();
                        }
                    },
                    function(response) {

                    });
            }

            $scope.saveSMSManagerInfo = function(flag, info) {

                var serviceName = "";
                var pageIndex = 1;
                var operation = $scope.operation;
                var needToast = false;
                var func = null;
                if (flag) {
                    operation = flag;
                }
                var params = {};
                if (operation == 'SMS') {
                    serviceName = 'sendMessageBatchSend';
                    params = angular.copy($scope.sms);
                    params.businessId = $scope.businessId;
                    func = function() {
                        $rootScope.showToast("success", "短信已发送！温馨提示：由于发送短信为异步操作，短信发送成功可能会稍有延迟，请稍后手动刷新页面查看短信发送状态，谢谢~");
                    }
                } else if (operation == 'importCard') {
                    needToast = true;
                    $rootScope.showToast("confirm", "请确认导入的卡密是否与导入的员工数量相匹配，如果卡密数量多于员工数量，会造成多于卡密的浪费，确定现在导入卡密吗？", function() {
                        serviceName = 'sendMessageImportCard';
                        params.file = $scope.fileBase64;
                        $scope.dataServiceRun(serviceName, params);
                    });

                } else if (operation == 'importUser') {
                    serviceName = 'sendMessageImportUser';
                    params.file = $scope.fileBase64;
                } else if (operation == 'clearCardSecret') {
                    needToast = true;
                    $rootScope.showToast("confirm", "确认清空未发送的卡密信息吗？", function() {
                        serviceName = 'sendMessageClearCardSecret';
                        params.businessId = $scope.businessId;
                        $scope.dataServiceRun(serviceName, params);
                    });

                } else if (operation == 'clearUnbindCard') {
                    needToast = true;
                    $rootScope.showToast("confirm", "确认清除未绑卡的数据吗？", function() {
                        serviceName = 'sendMessageClearUnbindCard';
                        params.businessId = $scope.businessId;
                        $scope.dataServiceRun(serviceName, params);
                    });

                } else if (operation == 'reSend') {
                    serviceName = 'sendMessageResend';
                    params.id = info.id;
                }
                if (!needToast) {
                    $scope.dataServiceRun(serviceName, params, func);
                }

            }

            $scope.chooseFile = function() {
                var file = event.target.files[0];
                if (file) {
                    //做格式校验 一般情况下，excel后缀是".xls"，在2007以及以后的版本中又增加了".xlsx"。excel的模板文件后缀名是".xlt"，启动宏的工作簿后缀名是".xlsm"。
                    var fileName = file.name;
                    var suffix = (fileName.lastIndexOf('.')>-1) && fileName.substring(fileName.lastIndexOf('.')+1) || '';
                    if (suffix != 'xls' && suffix != 'xlsx' && suffix != 'xlt' && suffix != 'xlsm') {
                        $rootScope.showToast("error", "导入文件格式不对，请选择正确格式的文件");
                        $rootScope.$apply();
                        event.target.value = "";
                        return;
                    }
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

        }])
        .controller('smsModule', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.businessId = $state.params.businessId;
            $scope.titleInfo = {
                title: '短信发送管理',
                href: '#/business-sms/' + $scope.businessId,
                subtitle: '短信模板管理'
            }

            $scope.title = 'Lorem Ipsum';
            $scope.link = "https://google.com";
            $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';

            $scope.smsParam = {
                pageIndex: 1,
                pageCount: 20,
                businessId: $scope.businessId
            }
            $scope.loadSMSModuleInfo = function() {
                DataService.run("msgTplQueryAll", $scope.smsParam,
                    function(response) {
                        $scope.smsManagerList = response.rows;
                        $scope.pageInfo = response.pageInfo;
                        $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                    },
                    function(response) {

                    });
            }
            $scope.loadSMSModuleInfo();

            $scope.openModal = function(flag, smsManagerInfo) {
                $scope.operation = flag;
                $rootScope.modalStus(true);
                if (smsManagerInfo) {
                    $scope.smsManagerInfo = angular.copy(smsManagerInfo);
                } else {
                    $scope.smsManagerInfo = {
                        name: null,
                        content: null,
                    }
                }
                $scope.modalShow = "show";
            }

            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.operation = null;
                $scope.smsManagerInfo = {};
                $rootScope.modalStus(false);
            }

            $scope.pageChanged = function() {
                $scope.smsParam.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadSMSModuleInfo();
            }

            $scope.saveSMSManagerInfo = function(id) {
                if (id) {
                    $scope.operation = 'del';
                }
                var serviceName = "";
                var pageIndex = 1;
                var operation = $scope.operation;
                var params = "";
                if ($scope.operation == 'del') {
                    serviceName = 'smsModuleDelete';
                    params = {
                        'id': id
                    };
                    $rootScope.showToast("confirm", "确认删除模板吗？", function() {
                        DataService.run(serviceName, params,
                            function(response) {
                                // alert(JSON.stringify(response));
                                $scope.smsParam.pageIndex = pageIndex;
                                $scope.loadSMSModuleInfo();
                                $scope.closeModal();
                            },
                            function(response) {

                            });
                    });

                } else {
                    $scope.smsManagerInfo.businessId = $scope.businessId;
                    params = $scope.smsManagerInfo;
                    if ($scope.operation == 'create') {
                        serviceName = 'msgTplCreate';
                    } else if ($scope.operation == 'edit') {
                        serviceName = 'msgTplUpdate';
                        pageIndex = $scope.smsParam.pageIndex;
                    }
                    DataService.run(serviceName, params,
                        function(response) {
                            // alert(JSON.stringify(response));
                            $scope.smsParam.pageIndex = pageIndex;
                            $scope.loadSMSModuleInfo();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                }


            }
        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.channel-info', {
                url: '/channel-info',
                views: {
                    '@': {
                        templateUrl: 'templates/channel-info/channel-info.tpl.html',
                    }
                }
            })
            .state('root.channel-user', {
                url: '/channel-user',
                views: {
                    '@': {
                        templateUrl: 'templates/channel-info/channel-user.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('channel-info', [])
        .config(config)
        .controller('channelInfo', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.channel = {
                pageIndex: 1,
                pageCount: 20
            }
            $scope.transBool = function(txt, flag) {
                //flag无值默认为正变换，否则为反变换
                if (!flag) {
                    return (txt == true ? '1' : '0');
                } else {
                    return (txt == '0' ? false : true);
                }
            }
            $scope.loadChannelInfo = function() {
                DataService.run("channelQueryAll", $scope.channel,
                    function(response) {
                        $scope.channelInfoList = response.rows;
                        $scope.pageInfo = response.pageInfo;
                        $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                    },
                    function(response) {

                    });
            }
            $scope.loadBusiness = function() {
                var businessParam = {
                    pageIndex: 1,
                    pageCount: 1000,
                    keywords: null,
                    sort: null,
                    orderBy: null
                };
                DataService.run("businessQueryAll", businessParam,
                    function(response) {
                        $scope.businessList = response.rows;
                        $scope.businessList.unshift({id: null, name:"请选择企业"});
                    },
                    function(response) {

                    });
            }
            $scope.pageChanged = function() {
                $scope.channel.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadChannelInfo();
            }

            $scope.loadBusiness();
            $scope.loadChannelInfo();

            $scope.openModal = function(flag, channelInfo) {
                $scope.opration = flag;
                $rootScope.modalStus(true);
                if (flag == "show") {
                    $scope.channelInfoShow = channelInfo;
                } else {
                    if (channelInfo) {
                        $scope.channelInfoEdit = angular.copy(channelInfo);
                        $scope.channelInfoEdit.enable = $scope.transBool($scope.channelInfoEdit.enable);
                    } else {
                        $scope.channelInfoEdit = {
                            name: null,
                            channelNumber: null,
                            businessId: null,
                            limitType: 0,
                            maxCountOfChannel: null,
                            summaryCount: null,
                            maxAskCountOfPerUser: null,
                            type: 0,
                            enable: '0',
                            productIds: null,
                        }
                    }
                }

                $scope.modalShow = "show";

            }

            $scope.transId = function(businessId) {
                for (var i=1; i<$scope.businessList.length; i++) {
                    if ($scope.businessList[i].id == businessId) {
                        return $scope.businessList[i].name;
                    }
                }
            }

            $scope.saveChannelInfoEdit = function() {
                var serviceName = "";
                var pageIndex = 1;
                if ($scope.opration == 'create') {
                    serviceName = 'channelCreate';
                } else if ($scope.opration == 'edit') {
                    serviceName = 'channelUpdate';
                    pageIndex = $scope.channel.pageIndex;

                }
                $scope.channelInfoEdit.enable = $scope.transBool($scope.channelInfoEdit.enable, 'convert');
                DataService.run(serviceName, $scope.channelInfoEdit,
                    function(response) {
                        // alert(JSON.stringify(response));
                        $scope.channel.pageIndex = pageIndex;
                        $scope.loadChannelInfo();
                        $scope.closeModal();
                    },
                    function(response) {

                    });

            }
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.opration = null;
                $scope.channelInfoEdit = {};
                $scope.channelInfoShow = {};
                $rootScope.modalStus(false);
            }
            $scope.setLocalStorage = function(channelId) {
                DataService.setChannelId(channelId);
            }

        }])
        .controller('channelUser', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.channel = {
                channelId: DataService.getInitialParam("channelQueryAllUser").channelId,
                pageIndex: 1,
                pageCount: 20
            }
            $scope.loadChannelUserInfo = function() {
                DataService.run("channelQueryAllUser", $scope.channel,
                    function(response) {
                        $scope.channelUserInfoList = response.rows;
                        $scope.pageInfo = response.pageInfo;
                        $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                    },
                    function(response) {

                    });
            }

            $scope.pageChanged = function() {
                $scope.channel.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadChannelUserInfo();
            }

            $scope.loadChannelUserInfo();

            $scope.openModal = function(channelUserInfo) {
                $scope.opration = "show";
                $rootScope.modalStus(true);
                $scope.channelUserInfo = channelUserInfo;
                $scope.modalShow = "show";
            }
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.channelUserInfo = {};
                $rootScope.modalStus(false);
            }
        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
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
        .controller('commonService', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
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

        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.employee-info', {
                url: '/employee-info',
                views: {
                    '@': {
                        templateUrl: 'templates/data-manager/employee-info.tpl.html',
                        controller: 'employeeInfo'
                    }
                }
            })
            .state('root.policy-info', {
                url: '/policy-info',
                views: {
                    '@': {
                        templateUrl: 'templates/data-manager/policy-info.tpl.html',
                        controller: 'policyInfo'
                    }
                }
            })
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('data-manager', [])
        .config(config)
        .controller('employeeInfo', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.activeStatusList = [{
                id: null,
                text: '请选择激活状态'
            }, {
                id: 1,
                text: '已激活'
            }, {
                id: 0,
                text: '未激活'
            }];
            $scope.paramsInit = function() {
                $scope.searchParams = {
                    activeStatus: null,
                    businessId: ($scope.businessList && $scope.businessList[0].id) || null,
                    businessName: null,
                    employeeTypeId: null,
                    employeeTypeName: null,
                    endActiveDate: null,
                    startActiveDate: null,
                    pageIndex: 1,
                    pageCount: 20
                };
                $scope.employeeList = [{
                    id: null,
                    text: "请选择人群"
                }];
            }

            $scope.loadEmployee = function(businessId) {
                $scope.employeeList = $scope.employeeList.slice(0, 1);
                $scope.searchParams.employeeTypeId = null;
                $scope.searchParams.employeeTypeName = null;
                if (businessId) {
                    DataService.run("businessEmployeeQuery", {
                            'businessId': businessId
                        },
                        function(response) {
                            if (response["model"].length > 0) {
                                $scope.employeeList = $scope.employeeList.concat(response["model"]);
                                for (var i = 1; i < $scope.employeeList.length; i++) {
                                    $scope.employeeList[i].text = $scope.employeeList[i].name + " (人群ID: " + $scope.employeeList[i].id + ")";
                                }
                            }
                        },
                        function(response) {

                        });
                }
            }

            $scope.transData = function(id, type) {
                var list = [],
                    name = "";
                if (type == "business") {
                    list = $scope.businessList;
                } else if ('employee') {
                    list = $scope.employeeList;
                }
                for (var i = 0; i < list.length; i++) {
                    if (id == list[i].id) {
                        name = list[i].name;
                        break;
                    }
                }
                return name;
            }

            $scope.loadData = function(pageIndex) {
                $scope.searchParams.businessName = $scope.transData($scope.searchParams.businessId, 'business');
                $scope.searchParams.employeeTypeName = $scope.transData($scope.searchParams.employeeTypeId, 'employee');
                $scope.searchParams.endActiveDate && typeof ($scope.searchParams.endActiveDate) != 'string' ? $scope.searchParams.endActiveDate = $rootScope.date2string($scope.searchParams.endActiveDate) : '';
                $scope.searchParams.startActiveDate && typeof ($scope.searchParams.startActiveDate) != 'string' ? $scope.searchParams.startActiveDate = $rootScope.date2string($scope.searchParams.startActiveDate) : '';

                if (pageIndex) {
                    $scope.searchParams.pageIndex = 1;
                }

                DataService.run("queryemployee", $scope.searchParams,
                    function(response) {
                        $scope.pageInfo = response.pageInfo;
                        $scope.employeeInfoList = response.rows;
                        $scope.businessName = $scope.searchParams.businessName;
                        var params = angular.copy($scope.searchParams);
                        delete params.pageIndex;
                        delete params.pageCount;
                        $scope.exportParams = params;
                    },
                    function(response) {

                    });
            }

            $scope.loadBusiness = function() {
                var businessParam = {
                    pageIndex: 1,
                    pageCount: 1000,
                    keywords: null,
                    sort: null,
                    orderBy: null
                };
                DataService.run("businessQueryAll", businessParam,
                    function(response) {
                        $scope.businessList = response.rows;
                        $scope.paramsInit();
                        if ($scope.businessList.length > 0) {
                            $scope.loadEmployee($scope.businessList[0].id);
                        }
                        $scope.loadData();
                    },
                    function(response) {

                    });
            }



            $scope.loadBusiness();

            $scope.pageChanged = function() {
                $scope.searchParams.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadData();
            }


            $scope._export = function() {
                var url = DataService.getUrl("exportemployee", $scope.exportParams);
                window.location.href = url;
            }

            $scope.startDayOpen = function($event) {
                $scope.startDay.opened = true;
            };

            $scope.startDay = {
                opened: false
            };
            $scope.endDayOpen = function($event) {
                $scope.endDay.opened = true;
            };

            $scope.endDay = {
                opened: false
            };
        }])
        .controller('policyInfo', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.paramsInit = function() {
                $scope.searchParams = {
                    endLeadtime: null,
                    endUndwrtDate: null,
                    startLeadtime: null,
                    startUndwrtDate: null,
                    pageIndex: 1,
                    pageCount: 20
                };
            }

            $scope.loadData = function(pageIndex) {
                $scope.searchParams.endLeadtime && typeof ($scope.searchParams.endLeadtime) != 'string' ? $scope.searchParams.endLeadtime = $rootScope.date2string($scope.searchParams.endLeadtime) : '';
                $scope.searchParams.endUndwrtDate && typeof ($scope.searchParams.endUndwrtDate) != 'string' ? $scope.searchParams.endUndwrtDate = $rootScope.date2string($scope.searchParams.endUndwrtDate) : '';
                $scope.searchParams.startLeadtime && typeof ($scope.searchParams.startLeadtime) != 'string' ? $scope.searchParams.startLeadtime = $rootScope.date2string($scope.searchParams.startLeadtime) : '';
                $scope.searchParams.startUndwrtDate && typeof ($scope.searchParams.startUndwrtDate) != 'string' ? $scope.searchParams.startUndwrtDate = $rootScope.date2string($scope.searchParams.startUndwrtDate) : '';
                
                if (pageIndex) {
                    $scope.searchParams.pageIndex = 1;
                }

                DataService.run("querypolicy", $scope.searchParams,
                    function(response) {
                        $scope.pageInfo = response.pageInfo;
                        $scope.policyInfoList = response.rows;
                        var params = angular.copy($scope.searchParams);
                        delete params.pageIndex;
                        delete params.pageCount;
                        $scope.exportParams = params;
                    },
                    function(response) {

                    });
            }
            $scope.paramsInit();
            $scope.loadData();
            $scope.pageChanged = function() {
                $scope.searchParams.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadData();
            }
            $scope._export = function() {
                var url = DataService.getUrl("exportpolicy", $scope.exportParams);
                window.location.href = url;
            }
            $scope.transType = function(code) {
                var type = "";
                switch (code) {
                    case '1':
                        type = "身份证";
                        break;
                    case '2':
                        type = "护照";
                        break;
                    case '3':
                        type = "军官证/士兵证";
                        break;
                    case '6':
                        type = "港澳通行证/回乡证或台胞证";
                        break;
                    default:
                        type = "其他";
                        break;
                }
                return type;
            }
        }])
})();
(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  config.$inject = ["$stateProvider"];
  DataTableDemo.$inject = ["$scope", "$log"];
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
    .controller('searchForm', ["$scope", function($scope) {
      $scope.search = function() {
         $scope.$$nextSibling.loadData();
      };
      $scope.clean = function() {
        $scope.$parent.paramInitial();
      };
    }])
    .controller('DataTableDemo', DataTableDemo)
    .controller('employeeList', ["$scope", "$http", "DataService", function($scope, $http, DataService) {
      $scope.loadData = function() {
        DataService.getAll($scope.$parent.param, function(data) {
          $scope.employees = data.dataList;
        });
      }
      $scope.loadData();


    }])
    .controller('PaginationDemoCtrl', ["$scope", function($scope) {


      $scope.pageChanged = function() {
        $scope.$parent.param.page = $scope.bigCurrentPage;
        $scope.$$prevSibling.loadData();
      };

      $scope.itemsPerPage = 3
      $scope.bigTotalItems = 6;
      $scope.bigCurrentPage = 1;


    }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
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
        .controller('employee', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService,$rootScope) {
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

        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.employee-service', {
                url: '/employee-service',
                views: {
                    '@': {
                        templateUrl: 'templates/employee-service/employee-service.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('employee-service', [])
        .config(config)
        .controller('employeeService', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {

            $scope.loadCommonService = function() {
                DataService.run("serviceQueryAll", null,
                    function(response) {
                        $scope.serviceList = response.rows;
                        $scope.loadBusinessService();
                    },
                    function(response) {

                    });
            }
            $scope.loadBusinessService = function() {
                DataService.run("businessServiceQuery", null,
                    function(response) {
                        $scope.businessServicePool = response.model;
                        var i, j;
                        for (i = 0; i < $scope.businessServicePool.length; i++) {
                            for (j = 0; j < $scope.serviceList.length; j++) {
                                if ($scope.businessServicePool[i].serviceId == $scope.serviceList[j].id) {
                                    $scope.businessServicePool[i].name = $scope.serviceList[j].name;
                                    break;
                                }
                            }
                        }
                        $scope.loadEmployeeService();
                    },
                    function(response) {

                    });
            }

            $scope.loadEmployeeService = function() {
                DataService.run("employeeTypeServiceQueryAll", null,
                    function(response) {
                        $scope.employeeTypeServicePool = response.model;
                        var i, j;
                        for (i = 0; i < $scope.employeeTypeServicePool.length; i++) {
                            for (j = 0; j < $scope.businessServicePool.length; j++) {
                                if ($scope.employeeTypeServicePool[i].businessServicePoolId == $scope.businessServicePool[j].id) {
                                    $scope.employeeTypeServicePool[i].name = $scope.businessServicePool[j].name;
                                    break;
                                }
                            }
                        }
                        $scope.serviceAvailableList = [];
                        for (i = 0; i < $scope.businessServicePool.length; i++) {
                            $scope.serviceAvailableList.push({
                                businessServicePoolId: $scope.businessServicePool[i].id,
                                name: $scope.businessServicePool[i].name,
                                enable: $scope.businessServicePool[i].enable,
                            });
                        }
                        //查找其中的可用服务
                        for (i = 0; i < $scope.employeeTypeServicePool.length; i++) {
                            for (j = 0; j < $scope.serviceAvailableList.length; j++) {
                                if ($scope.employeeTypeServicePool[i].businessServicePoolId == $scope.serviceAvailableList[j].businessServicePoolId) {
                                    $scope.serviceAvailableList.splice(j, 1);
                                }
                            }
                        }
                        for (i=0; i<$scope.serviceAvailableList.length; i++){
                            if ($scope.serviceAvailableList[i].enable == false){
                                $scope.serviceAvailableList[i].name += "（该服务未启用）";
                            }
                        }
                    },
                    function(response) {

                    });
            }

            $scope.loadCommonService();
            

            $scope.openModal = function(flag, serviceInfo) {
                $scope.opration = flag;
                $rootScope.modalStus(true);
                if (flag == "show") {
                    //查看详情
                    $scope.employeeTypeServiceShow = serviceInfo;
                    //show name
                    $scope.modalShow = "show";
                } else {
                    if (serviceInfo) {
                        //修改
                        $scope.employeeTypeServiceName = serviceInfo.name;
                        $scope.employeeTypeServiceEdit = {
                            enable: serviceInfo.enable,
                            businessServicePoolId: serviceInfo.businessServicePoolId,
                            id: serviceInfo.id
                        };
                        $scope.modalShow = "show";
                    } else {
                        //创建
                        if ($scope.serviceAvailableList.length == 0) {
                            alert("当前企业没有服务，请先在企业服务管理中创建企业服务后再创建人群服务。");
                        } else {
                            $scope.employeeTypeServiceEdit = {
                                businessServicePoolId: $scope.serviceAvailableList[0].businessServicePoolId,
                                enable: true,
                            }
                            $scope.modalShow = "show";
                         }
                    }
                }
            }
            $scope.saveServiceEdit = function() {
                if ($scope.opration == 'create') {
                    var param = DataService.getInitialParam("employeeTypeServiceCreate");
                    param.enable = $scope.employeeTypeServiceEdit.enable;
                    param.businessServicePoolId = $scope.employeeTypeServiceEdit.businessServicePoolId;
                    DataService.run("employeeTypeServiceCreate", null,
                        function(response) {
                            // alert(JSON.stringify(response));
                            $scope.loadEmployeeService();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                } else if ($scope.opration == 'edit') {
                    $scope.employeeTypeServiceEdit.employeeTypeId =  DataService.getInitialParam("employeeTypeServiceUpdate").employeeTypeId;
                    DataService.run("employeeTypeServiceUpdate", $scope.employeeTypeServiceEdit,
                        function(response) {
                            //alert(JSON.stringify(response));
                            $scope.loadEmployeeService();
                            $scope.closeModal();
                        },
                        function(response) {

                        });
                }

            }
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.opration = null;
                $rootScope.modalStus(false);
            }


        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.logger', {
                url: '/logger',
                views: {
                    '@': {
                        templateUrl: 'templates/logger/logger.tpl.html',
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('logger', [])
        .config(config)
        .controller('logger', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.paramInitial = function() {
                $scope.loggerAction = {
                    pageIndex: 1,
                    pageCount: 20,
                    staffName: null,
                    moduleName: null,
                    operationType: null,
                    operationDescription: null,
                    createStartTime: null,
                    createEndTime: null,
                    orderBy: null,
                    sort: null,
                }
            }
            $scope.operationTypeList = [{
                "value": null,
                "text": "请选择操作类型"
            }, {
                "value": 2,
                "text": "添加"
            }, {
                "value": 3,
                "text": "修改"
            }, {
                "value": 4,
                "text": "删除"
            }];

            function date2string(date) {
                console.log(date);
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

            function loadLogger() {
                if ($scope.createStartTime) {
                    $scope.loggerAction.createStartTime = date2string($scope.createStartTime);
                }
                if ($scope.createEndTime) {
                    $scope.loggerAction.createEndTime = date2string($scope.createEndTime);
                }
                DataService.run("loggerQuery", $scope.loggerAction,
                    function(response) {
                        //alert(JSON.stringify(response));
                        // if (response.rows.length == 0) {
                        //     alert("未查找到符合要求的信息。");
                        // } else {
                            $scope.loggerList = response.rows;
                            $scope.pageInfo = response.pageInfo;
                            $scope.totalPage = Math.ceil(response.pageInfo.totalCount / response.pageInfo.pageCount);
                        // }
                    },
                    function(response) {

                    });
            }
            $scope.pageChanged = function() {
                //console.log($scope.pageInfo.pageIndex);
                $scope.loggerAction.pageIndex = $scope.pageInfo.pageIndex;
                loadLogger();
            }
            $scope.init = function() {
                $scope.paramInitial();
                $scope.createStartTime = null;
                $scope.createEndTime = null;
                loadLogger();
            }
            $scope.showModal = false;
            $scope.collapseId = null;
            $scope.init();

            $scope.search = function() {
                loadLogger();
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
                $scope.loggerAction.orderBy = $scope.sortString;
                $scope.loggerAction.sort = $scope.orderBy;
                $scope.loggerAction.pageIndex = 1;
                loadLogger();
            }
            $scope.showDetail = function(logger) {
                var param = DataService.getInitialParam("loggerDetailQuery");
                param.actionId = logger.id;
                $scope.comment = logger.comment;
                DataService.run("loggerDetailQuery", null,
                    function(response) {
                        //alert(JSON.stringify(response));
                        // if (response.model.length == 0) {
                        //     // alert("未查找到符合要求的信息。");
                        // } else {
                            $scope.detailList = response.model;
                            $scope.showModal = true;
                            $rootScope.modalStus(true);
                        // }
                    },
                    function(response) {

                    });
            }
            $scope.hideModal = function() {
                $scope.showModal = false;
                $scope.comment = null;
                $scope.detailList = null;
                $scope.contentList = null;
                $rootScope.modalStus(false);
            }
            $scope.showDetailContent = function(id) {
                var param = DataService.getInitialParam("detailContentQuery");
                param.loggerId = id;
                DataService.run("detailContentQuery", null,
                    function(response) {
                        // //alert(JSON.stringify(response));
                        // if (response.model.length == 0) {
                        //     // alert("未查找到符合要求的信息。");

                        // } else {
                            $scope.contentList = response.model;
                        // }
                    },
                    function(response) {

                    });
                //expand <-> collapse
                var status = event.target.getAttribute("data-action");
                if (status == "expand") {
                    $scope.collapseId = id;
                    $scope.detailContentId = id;
                } else {
                    $scope.collapseId = null;
                    $scope.detailContentId = null;
                }
            }
            $scope.startDayOpen = function($event) {
                $scope.startDay.opened = true;
            };

            $scope.startDay = {
                opened: false
            };
            $scope.endDayOpen = function($event) {
                $scope.endDay.opened = true;
            };

            $scope.endDay = {
                opened: false
            };
        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
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
        .controller('showcaseInfo', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
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

        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.role-authorization', {
                url: '/role-authorization/:id',
                views: {
                    '@': {
                        templateUrl: 'templates/role/role-authorization.tpl.html',
                        controller: 'roleAuthCtrl'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('role-authorization', [])
        .config(config)
        .controller('roleAuthCtrl', ["$scope", "$state", "DataService", "$rootScope", "_", function($scope, $state, DataService, $rootScope, _) {
            $scope.roleId = $state.params.id;
            $scope.editflag = true;
            loadRoleAuth();

            function loadRoleAuth() {
                DataService.run("roleAuthQuery", {
                        roleId: $scope.roleId
                    },
                    function(response) {
                        if (response["success"] == false) {
                            // if (response["errorCode"] == 6002) {
                                $scope.roleAuthList = null;
                                $scope.roleOrigin = null;
                                $scope.roleEditList = null;
                            // }
                        } else {
                            $scope.roleAuthList = response["model"];
                            $scope.roleOrigin = angular.copy($scope.roleAuthList);
                            $scope.roleEditList = angular.copy($scope.roleAuthList);
                        }

                    },
                    function(response) {});
            }

            $scope.saveEdit = function() {
                if (_.isEqual($scope.roleOrigin, $scope.roleEditList)) {
                    $rootScope.showToast("error", "您并未做任何修改！");
                } else {
                    DataService.run("roleAuthUpdate", {
                            "roleAuthorizations": $scope.roleEditList
                        },
                        function(response) {
                            if (response["success"] == false) {
                                if (response["errorCode"] == 6002) {
                                    $scope.roleAuthList = angular.copy($scope.roleOrigin);
                                    $scope.roleEditList = angular.copy($scope.roleOrigin);
                                }
                            } else {
                                loadRoleAuth();
                                $rootScope.showToast('success', "修改成功！");
                            }
                        },
                        function(response) {

                        });
                }
            }
            $scope.changeVal = function(index, key) {
                $scope.roleEditList[index][key] = event.target.checked;
            }

        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
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
        .controller('roleMCtrl', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
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

        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.role-user', {
                url: '/role-user/:id',
                views: {
                    '@': {
                        templateUrl: 'templates/role/role-user.tpl.html',
                        controller: 'roleUserCtrl'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('role-user', [])
        .config(config)
        .controller('roleUserCtrl', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.roleId = $state.params.id;
            $scope.user = {
                roleId: $scope.roleId,
                staffName: null
            };
            loadRoleUserList();
            
            function loadRoleUserList() {
                DataService.run("getRoleUserByRoleId", {
                        roleId: $scope.roleId
                    },
                    function(response) {
                        $scope.roleUserList = response["model"];
                    },
                    function(response) {

                    });
            }

            $scope.openModal = function() {
                $scope.modalShow = 'new';
                $rootScope.modalStus(true);
            }

            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.user.staffName = null;
                $rootScope.modalStus(false);
            }

            $scope.deleteUser = function(id) {
                $rootScope.showToast("confirm", "确定删除吗？", function() {
                    DataService.run("roleUserDelete", {
                            id: id
                        },
                        function(response) {
                            loadRoleUserList();
                        },
                        function(response) {

                        });
                }, null);
            }

            $scope.saveUser = function() {
                DataService.run("roleUserCreate", $scope.user,
                        function(response) {
                            $scope.closeModal();
                            loadRoleUserList();
                        },
                        function(response) {

                        });
            }
        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.role', {
                url: '/role',
                views: {
                    '@': {
                        templateUrl: 'templates/role/role.tpl.html',
                        controller: 'roleCtrl'
                    }
                }
            });
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('role', [])
        .config(config)
        .controller('roleCtrl', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.modalShow = null;
            $scope.roleEdit = {
                name: null
            };

            loadRoleList();

            function loadRoleList() {
                DataService.run("roleQueryAll", null,
                    function(response) {
                        $scope.roleList = response["model"];
                    },
                    function(response) {

                    });
            }

            $scope.openModal = function(role) {
                if (!role) {
                    $scope.modalShow = 'new';
                }else {
                    $scope.modalShow = 'modify';
                    $scope.roleEdit.name = role.name;
                    $scope.roleEdit.id = role.id;
                }
                $rootScope.modalStus(true);
            }

            //删除角色
            $scope.deleteRole = function(roleId) {
                $rootScope.showToast("confirm", "确定删除吗？", function() {
                    DataService.run("roleDelete", {id: roleId},
                        function(response) {
                            loadRoleList();
                        },
                        function(response) {

                        });
                }, null);
            }      
            
            $scope.closeModal = function() {
                $scope.modalShow = null;
                $scope.roleEdit.name = null;
                if ($scope.roleEdit.id) {
                    delete $scope.roleEdit.id;
                }
                $rootScope.modalStus(false);
            }

            $scope.saveRoleEdit = function() {
                var serviceName = "", params = angular.copy($scope.roleEdit);
                if ($scope.modalShow && $scope.modalShow == 'new') {
                    serviceName = "roleCreate";
                } else if ($scope.modalShow && $scope.modalShow == 'modify') {
                    serviceName = "roleUpdate";
                }
                DataService.run(serviceName, params,
                        function(response) {
                            $scope.closeModal();
                            loadRoleList();
                        },
                        function(response) {

                        });
            }
        }]);
})();
(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    config.$inject = ["$stateProvider"];
    function config($stateProvider) {
        $stateProvider
            .state('root.statistic', {
                url: '/statistic',
                views: {
                    '@': {
                        templateUrl: 'templates/statistic/statistic.tpl.html',
                        controller: 'statistic'
                    }
                }
            })
    }

    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */

    angular.module('statistic', [])
        .config(config)
        .controller('statistic', ["$scope", "$state", "DataService", "$rootScope", function($scope, $state, DataService, $rootScope) {
            $scope.dataRangeList = [{
                id: '0',
                name: '日'
            }, {
                id: '1',
                name: '周'
            }, {
                id: '2',
                name: '月'
            }, {
                id: '3',
                name: '季度'
            }, {
                id: '4',
                name: '年'
            }];
            $scope.detailC = [{
                value: true,
                text: "明细"
            }, {
                value: false,
                text: "总计"
            }];
            $scope.paramsInit = function() {
                $scope.searchParams = {
                    businessId: null,
                    employeeTypeId: null,
                    dateRangeType: '0',
                    statisticType: '0',
                    detail: false,
                    pageIndex: 1,
                    pageCount: 20
                };
                $scope.employeeList = [{id: null, text: "请选择人群"}];
            }

            $scope.loadEmployee = function(businessId) {
                $scope.employeeList = $scope.employeeList.slice(0, 1);
                $scope.searchParams.employeeTypeId = null;
                if (businessId) {
                    DataService.run("businessEmployeeQuery", {
                            'businessId': businessId
                        },
                        function(response) {
                            if (response["model"].length > 0){
                                $scope.employeeList = $scope.employeeList.concat(response["model"]);
                                for (var i=1; i<$scope.employeeList.length; i++) {
                                    $scope.employeeList[i].text = $scope.employeeList[i].name+ " (人群ID: "+$scope.employeeList[i].id+ ")";
                                }
                            }
                        },
                        function(response) {

                        });
                }
            }

            $scope.loadBusiness = function() {
                var businessParam = {
                    pageIndex: 1,
                    pageCount: 1000,
                    keywords: null,
                    sort: null,
                    orderBy: null
                };
                DataService.run("businessQueryAll", businessParam,
                    function(response) {
                        $scope.businessList = response.rows;
                        $scope.businessList.unshift({id: null, name: "请选择企业"});
                    },
                    function(response) {

                    });
            }

            $scope.loadData = function() {
                DataService.run("statisticsQuery", $scope.searchParams,
                    function(response) {
                        $scope.show = {
                            tdFlag: $scope.searchParams.detail,
                            titleType:  $scope.searchParams.statisticType
                        };
                        $scope.pageInfo = response.pageInfo;
                        $scope.statisticList = response.rows;
                    },
                    function(response) {

                    });
            }

            $scope.init = function() {
                $scope.loadBusiness();
                $scope.paramsInit();
                $scope.loadData();
            }
            $scope.init();

            $scope.pageChanged = function() {
                $scope.searchParams.pageIndex = $scope.pageInfo.pageIndex;
                $scope.loadData();
            }

            $scope.transData = function(id, type) {
                var list = [], name = "";
                if (type == "business") {
                    list = $scope.businessList;
                } else if ('dataRange') {
                    list = $scope.dataRangeList;
                }
                for (var i=0; i<list.length; i++) {
                    if (id == list[i].id) {
                        name = list[i].name;
                        break;
                    }
                }
                return name;
            }
        }])
})();