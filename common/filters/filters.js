(function() {
  'use strict';

  function uppercase() {
    return function(text) {
      return text ? text.toUpperCase() : text;
    };
  }
  function businessType() {
  	return function(text) {
  		var type = "";
  		if (text==1){
  			type = "企业";
  		} else{
  			type = "会所"
  		}
  		return type;
  	};
  }
  function formatDate() {
  	return function(text) {
  		if (text) {
  			var date = new Date(text);
        var year = date.getFullYear();
        var month = (date.getMonth()+1);
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        month = month<10?("0"+month):month;
        day = day<10?("0"+day):day;
        hour = hour<10?("0"+hour):hour;
        minute = minute<10?("0"+minute):minute;
        second = second<10?("0"+second):second;
  			return (year+"/"+month+"/"+day+" "+hour+":"+minute+":"+second);
  		}
  	}
  }
  function booleanShow() {
    return function(text) {
      return text=='1'?"是":"否";
    }
  }
  function businessVerifyType() {
      return function(text) {
          if (text) {
              var temp = text.split(",");
              var type = [];
              for (var i = 0; i < temp.length; i++) {
                  if (temp[i] == '1') type.push("员工工号");
                  if (temp[i] == '2') type.push("证件号码");
                  if (temp[i] == '3') type.push("保单号/分单号");
              }
              return type.join();
          }
      }
  }
  function formatOperationType() {
    return function(text) {
      return text=='2'?"添加":(text=='3'?"修改":"删除");
    }
  }
  function formatLogType() {
    return function(text) {
      return text=='1'?"增加":(text=='2'?"修改":"删除");
    }
  }
// function formatServiceType() {
//     return function(text) {
//       return text=='1'?"普通服务":(text=='2'?"家庭医生":"体检服务");
//     }
//   }
function formatEmployeeSts() {
  return function(text) {
      return text=='1'?"在职":(text=='2'?"离职":"");
    }
}
function formatIdentityType() {
  return function(text) {
    var type = "";
      if (text=='1'){
        type = "身份证";
      } else if(text=='2') {
        type = "护照";
      } else if(text=='3') {
        type = "军官证/士兵证";
      } else if(text=='4') {
        type = "港澳通行证/回乡台胞证";
      } else if(text=='5') {
        type = "其他";
      }
      return type;
    }
}
function formatGmtTime(){
  return function(gmtTime){
    return new Date(gmtTime)
  }
}
function channelType() {
  return function(text) {
    var type = "";
    if (text == '0') {
        type = "试用问诊";
    } else if (text == '1') {
        type = "直接激活卡";
    }
    return type;
  }
}
function channelLimitType() {
  return function(text) {
    var type = "";
    if (text == '0') {
        type = "按人数";
    } else if (text == '1') {
        type = "按问诊数";
    }
    return type;
  }
}
function showcaseStus() {
  return function(status) {
      if (status == "10"){
        return "上线";
      } else if (status == "20"){
        return "下线";
      }
    }
}
function showcaseScene() {
  return function(Scene) {
      if (Scene == "0"){
        return "企业版";
      } else if (Scene == "1"){
        return "插件版";
      }
    }
}
function showcasePosition() {
  return function(position) {
      if (position == "0"){
        return "企业版首页";
      } else if (position == "1"){
        return "插件版热卖商品左侧";
      } else if (position == "2"){
        return "插件版热卖商品右侧";
      } else if (position == "3"){
        return "企业版首页广告位";
      } else if (position == "4"){
        return "企业公告logo";
      }
    }
}


  angular.module('common.filters.uppercase', [])
    .filter('uppercase', uppercase)
    .filter('businessType', businessType)
    .filter('formatDate', formatDate)
    .filter('booleanShow', booleanShow)
    .filter('businessVerifyType', businessVerifyType)
    .filter('formatOperationType', formatOperationType)
    .filter('formatLogType', formatLogType)
    .filter('formatEmployeeSts', formatEmployeeSts)
    .filter('formatIdentityType', formatIdentityType)
    .filter('formatGmtTime', formatGmtTime)
    .filter('channelType', channelType)
    .filter('channelLimitType', channelLimitType)
    .filter('showcaseStus', showcaseStus)
    .filter('showcaseScene', showcaseScene)
    .filter('showcasePosition', showcasePosition)
})();
