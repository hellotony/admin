angular.module('directives.directives', [])
    .directive('hello', function() {
        return {
            restrict: 'E',
            template: '<div>Hi there</div>',
            replace: true
        };
    })
    .directive('notNull', function() {
        return {
            restrict: 'A',
            template: '<span class="fc_f00">* </span><span ng-transclude></span>',
            transclude: true,
        };
    })
    .directive('pageTitle', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/directive-templates/page-title.tpl.html',
            scope: {
                pageTitleInfo: '=info'
            }
        };
    })
    .directive('commonTab', ['$parse',
        function($parse) {
            // 表格
            return {
                restrict: 'AE',
                templateUrl: 'templates/directive-templates/common-tab.tpl.html',
                transclude: {
                    'tab': '?commonTabOperate',
                    'item': '?commonTabItemOperate',
                },
                scope: {
                    tabDataList: '=tabData'
                },
                link: function(scope, element, attrs) {
                    scope.tabTitle = attrs.tabTitle;
                    var tabInfo = JSON.parse(attrs.tabBody);
                    // console.log(attrs.tabBody, tabInfo);
                    scope.tabKey = [];
                    scope.tabValue = [];
                    scope.hasPagination = attrs.hasPagination;
                    // scope.tabEdit = JSON.parse(attrs.tabEdit || '[]');
                    // scope.itemEdit = JSON.parse(attrs.itemEdit || '[]');
                    for (key in tabInfo) {
                        if (tabInfo.hasOwnProperty(key)) {
                            scope.tabKey.push(key);
                            scope.tabValue.push(tabInfo[key]);
                        }
                    }
                    // if (scope.itemEdit.length != 0) {
                    //     scope.tabKey.push("");
                    // }
                }
            };
        }
    ])
    .directive('tabPage', function() {
        // 分页
        return {
            restrict: 'AE',
            templateUrl: 'templates/directive-templates/tab-page.tpl.html',
        };
    })
    .directive('modalEdit', function() {
        // modal
        return {
            restrict: 'A',
            template: '',
            transclude: true,
        };
    })
    .directive('commonTabOperate', function() {
        return {
            restrict: 'E',
            // template: '<a ng-transclude href="javascript:void(0);" class="btn btn-default mr-3"></a>',
            scope: {
                item: '=itemData'
            },
            link: function(scope, element, attrs) {
                // element.on('click', function(event) {
                //     if (scope.operation.handler) {
                //         scope.$apply(scope.operation.handler);
                //     }
                //     if (scope.operation.href) {
                //         location.href = scope.operation.href;
                //     }
                // })
            },
            // replace: true,
            // transclude: true,
        };
    })
    .directive('itemEdit', function() {
        return {
            restrict: 'E',
            template: '<a ng-transclude href="javascript:void(0);" class="btn btn-info btn-xs mr-3"></a>',
            link: function(scope, element, attrs) {

                element.on('click', function(event) {
                    var handler = scope.itemEditInfo.handler;
                    if (handler) {
                        var originParam = handler.substring(handler.indexOf("(") + 1, handler.indexOf(")"));
                        var param = scope.itemEditInfo.param || '';
                        if (param != "item") {
                            param = "item" + "['" + param + "']";
                        }
                        var handlerFunc = originParam == "" ? handler.substring(0, handler.indexOf(")")) + param + ")" : handler.substring(0, handler.indexOf(")")) + "," + param + ")";
                        scope.$apply(handlerFunc);

                    }
                    if (scope.itemEditInfo.href) {
                        location.href = scope.itemEditInfo.href;
                    }
                })
            },
            replace: true,
            transclude: true,
        };
    })
    .directive('infoShow', function() {
        return {
            restrict: 'E',
            template: function(element, attrs) {
                // console.log(element, attrs);
                return '<div class="form-group"><label class="col-sm-3 control-label no-padding-right">' + attrs.label + '：</label><div ng-transclude class="col-sm-9 pt-7"></div></div>'
            },
            link: function(scope, element, attrs) {

                element.on('click', function(event) {
                    if (scope.operation.handler) {
                        scope.$apply(scope.operation.handler);
                    }
                    if (scope.operation.href) {
                        location.href = scope.operation.href;
                    }
                })
            },
            replace: true,
            transclude: true,
        };
    })
    .directive('tabEmptyShow', ['$parse',
        function($parse) {
            // 表格查询数据为空
            return {
                restrict: 'E',
                scope: {
                    data: '=tabData'
                },
                template: function(element, attrs) {
                    return '<div class="row DTTTFooter tab-empty-info" ng-if="data.length==0">抱歉,无相应匹配信息</div>'
                }
            };
        }
    ])