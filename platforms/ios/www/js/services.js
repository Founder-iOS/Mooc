var DEBUG = true;

angular.module('starter.services', [])


.factory('deviceService', function($cordovaDevice) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var device ;
  return {
    get: function() {
    document.addEventListener("deviceready", function () {

    var device = $cordovaDevice.getDevice();

    var cordova = $cordovaDevice.getCordova();

    var model = $cordovaDevice.getModel();

    var platform = $cordovaDevice.getPlatform();

    var uuid = $cordovaDevice.getUUID();

    var version = $cordovaDevice.getVersion();
    alert('version is'+ version);
   }, false);
       return device;
    }
  };
})

.factory('dbService', function($ionicPlatform,$cordovaSQLite) {
  var user;
  var courses;
  var lesson;
  return {
    getUser: function() {
       return user;
    },
    saveUser : function(user,$scope){
     $ionicPlatform.ready(function() {
         if(DEBUG) {
             console.log("save user: " + user.id);
         }
      var query = "INSERT INTO user (id,name,true_name) VALUES (?,?,?)";
      var db = $cordovaSQLite.openDB("mooc.db",0);
      $cordovaSQLite.execute(db, query, [user.id,user.name,user.true_name]).then(function(res) {
        console.log("insertId: " + res.insertId);
          if(DEBUG){
              console.log("insert db result: " + res);
          }
      }, function (err) {
        console.error(err);
       });
     });
    },
    getCourses:function(){
       return courses;
    },
    saveCourse:function(courses){

    },
    getCourseDetail:function(courseId){
    },
    saveCourseDetail:function(course){

    },
    getLesson:function(lessonId){

    },
    saveLesson:function(lesson){
    }
  };
})
.service('moocService', function($http, $q){
  var baseUrl = 'http://42.62.16.168:8080/api?method=';
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
      deferred.reject('There was an error');
    })
    return deferred.promise;
  }
  // 用户登录
  this.signIn = function(user,device){
    //var parms = 'userAuth&user_name='+ user.username +'&user_pwd='+ user.password +'&udid='+'11111';
    var parms = 'userAuth&user_name='+ user.username +'&user_pwd='+ user.password +'&udid='+'11111' +'&type=1';    ///<! 明文密码
    console.log('parms is '+ parms);
    var finalUrl = makeUrl(parms);
    console.log('finalUrl is ' + finalUrl);
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
})

.service('testService', function(){
    var courses = function(){
        var res = [];
        var courseNum = 10;
        var i = 0;
        while(i++ < courseNum){
            var _course = {
                course_id: i,
                course_name: "我的课程"+i,
            cover_url: function(){
                    return "/img/" + (Math.floor(Math.random()*4)+1) + ".jpg";
                }(),
                study_num: Math.floor(Math.random() * 50),
                open_time: (Date.now() + Math.floor(Math.random()*1000))/1000
            };
            res.push(_course);
        }
        return res;
    }();
    
    this.getCourses = function(){
        return courses;
    }
});

