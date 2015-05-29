angular.module('starter.services', [])

.factory('userService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var user ={
     username:'teacher201503',
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
  var makeUrl = function(parms){
    var finalUrl = baseUrl + parms + '&callback=JSON_CALLBACK';
    return finalUrl;
  }

  var request = function(finalUrl){
    var deferred = $q.defer();
    $http({
      method: 'JSONP',
      url:finalUrl
    }).success(function(data){
       console.log('success');
      
      deferred.resolve(data);
    }).error(function(){
       console.log('faild');
      deferred.reject('There was an error')
    })
    return deferred.promise;
  }
  // 用户登录
  this.signIn = function(user,device){
    //var parms = 'userAuth&user_name='+ user.username +'&user_pwd='+ user.password +'&udid='+'11111';
             var parms = 'userAuth&user_name='+ user.username +'&user_pwd='+ user.password +'&udid='+'11111' +'&type=1';
    console.log('parms is'+ parms);
    var finalUrl = makeUrl(parms);
    console.log('finalUrl is' + finalUrl);
    return request(finalUrl);

  }
  // 课程列表
  this.courseList = function(user,device){
    var parms = 'courseList&user_id=' + user.id;
    console.log('courseList parms is'+ parms);
        var finalUrl =makeUrl(parms);
    console.log('finalUrl is' + finalUrl);
    return request(finalUrl);

  }
  // 课程详情
  this.courseDetail = function(courseId){
    // var parms = 'courseDetail&course_id='+courseId;
    var parms = 'courseDetail&course_id=AB252A87-1C94-3ABA-40BC-1E4AFCD25012';
    console.log('parms is'+ parms);
    var finalUrl =makeUrl(parms);
    console.log('finalUrl is' +   finalUrl);
    return request(finalUrl);
  }
    //lesson详情
  this.lessonDetail = function(lessonId){
      var parms = 'courseDetail&course_id='+courseId;
      console.log('parms is'+ parms);
      var finalUrl = makeUrl(parms);
      console.log('finalUrl is' + finalUrl);
      return request(finalUrl);
    }
});

