angular.module('starter.services', [])

.factory('userService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var user ={
     username:'founder2013_tlhaojob3',
     password:'111111',
            };
  return {
    get: function() {
       return user;
    },
    saveUser : function(user){
    }
  };
})

.factory('deviceService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var device ={
     version:'1.0',
     udid:'lileichuan111fffffffff',
            };
  return {
    get: function() {
       return device;
    }
  };
})

.factory('courses', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var courses = [{
    id: 0,
    name: '计算机基础教程',
    studynum: '选课人数:10',
    studytime: '开课时间:2015-03-1',
    image: 'img/1.jpg'
  }, {
    id: 1,
    name: '计算机基础教程',
    studynum: '选课人数:10',
    studytime: '开课时间:2015-03-1',
    image: 'img/2.jpg'
  },{
    id: 2,
    name: '计算机基础教程',
    studynum: '选课人数:10',
    studytime: '开课时间:2015-03-1',
    image: 'img/3.jpg'
  }, {
    id: 3,
    name: '计算机基础教程',
    studynum: '选课人数:10',
    studytime: '开课时间:2015-03-1',
    image: 'img/4.jpg'
  }, {
    id: 4,
    name: '计算机基础教程',
    studynum: '选课人数:10',
    studytime: '开课时间:2015-03-1',
    image: 'img/1.jpg'
  }];

  return {
    all: function() {
      return courses;
    },
    remove: function(course) {
      courses.splice(courses.indexOf(course), 1);
    },
    get: function(courseId) {
      for (var i = 0; i < courses.length; i++) {
        if (courses[i].id === parseInt(courseId)) {
          return courses[i];
        }
      }
      return null;
    }
  };
})


.factory('chapters', function() {
  // Might use a resource here that returns a JSON array
  // Some fake testing data
  var chapters = [{
    id: 0,
    name: '计算机基础教程',
    lessons:[{
      id:0,
      name:'初中生物分支测验'},{
      id:1,  
      name:'生态系统分支测验'}]
  },{
    id: 1,
    name: '计算机基础教程',
    lessons:[{
      id:0,
      name:'初中生物分支测验'},{
      id:1,  
      name:'生态系统分支测验'}]
  },{
    id: 2,
    name: '计算机基础教程',
    lessons:[{
       id:0,
      name:'初中生物分支测验'},{
      id:1,  
      name:'生态系统分支测验'}]
  }];
  return {
    all: function() {
      return chapters;
    }
  };
})

.service('moocService', function($http, $q){
  var baseUrl = 'http://172.19.43.88:8080/api?method=';
          //var baseUrl = 'http://42.62.16.168:88/api?method=';
  var _finalUrl = '';
  var makeUrl = function(parms){
    _finalUrl = baseUrl + parms + '&callback=JSON_CALLBACK';
    return _finalUrl;
  }
  // 用户登录
  this.signIn = function(user,device){
    //var parms = 'userAuth&user_name='+ user.username +'&user_pwd='+ user.password +'&udid='+'11111';
             var parms = 'userAuth&user_name='+ user.username +'&user_pwd='+ user.password +'&udid='+'11111' +'&type=1';
    console.log('parms is'+ parms);
    makeUrl(parms);
    console.log(_finalUrl);
    var deferred = $q.defer();
    $http({
      method: 'JSONP',
      url: _finalUrl
    }).success(function(data){
       console.log('success');
      
      deferred.resolve(data);
    }).error(function(){
       console.log('faild');
      deferred.reject('There was an error')
    })
    return deferred.promise;
  }
  // 课程列表
  this.courseList = function(user,device){
    var parms = 'courseList&userId=11A3AAE7-6DC9-06E4-CB22-F6F033C64352';
    console.log('courseList parms is'+ parms);
    makeUrl(parms);
    console.log(_finalUrl);
    var deferred = $q.defer();
    $http({
      method: 'JSONP',
      url: _finalUrl
    }).success(function(data){
       console.log('success');
      deferred.resolve(data);
    }).error(function(){
       console.log('faild');
      deferred.reject('There was an error')
    })
    return deferred.promise;
  }
  // 课程详情
  this.courseDetail = function(user,device){
    alert('111');
    var parms = 'userAuth&user_name='+ user.username +'&user_pwd='+ user.password +'&udid='+'11111';
    console.log('parms is'+ parms);
    makeUrl(parms);
    console.log(_finalUrl);
    var deferred = $q.defer();
    $http({
      method: 'JSONP',
      url: _finalUrl
    }).success(function(data){
       console.log('success');
      deferred.resolve(data);
    }).error(function(){
       console.log('faild');
      deferred.reject('There was an error')
    })
    return deferred.promise;
  }


});

