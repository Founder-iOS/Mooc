var DEBUG = true;

angular.module('starter.services', [])

.factory('users', function($localstorage,dbService,moocService) {
    var user = {
         username:'xiaoyu0915',
         password: '111111'
    };
    $localstorage.setObject('lastLoginUser',user) ;
  return {
    get: function(userId) {
      return user;
    },
    lastLoginUser: function() {
         return user = $localstorage.getObject('lastLoginUser');
     },
    requestUser: function(name,password){
         return moocService.signIn(name,password);
    }
  };
})

.factory('courses', function(dbService,moocService) {
   var courses;
  return {
       get: function(userId) {
          moocService.courseList(userId)
            .then(function(data){
                  console.log('返回成功' + eval(data).success);
                  if(eval(data).success === 1){
                    courses  =eval(data).data;
                    return courses;
                    //$scope.$broadcast('scroll.refreshComplete');
                  }
                  else{
                    alert(eval(data).message);
                  }
                  }, function(data){
                      console.log('返回失败' + data);
               })
   }
  };

})

.factory('courseDetail', function(dbService,moocService) {
   var course;
   return {
    get: function(courseId) {
     moocService.courseDetail(courseId)
    .then(function(data){
          console.log('课程详情返回成功' + eval(data).success);
          if(eval(data).success === 1){
               return  eval(data).data;;
               //$scope.course  =eval(data).data;
              if(DEBUG){
                  console.log($scope.course);
              }
             }else{
               alert(eval(data).message);
            }        
           }, function(data){
             console.log('课程详情返回失败' + data);
    })
   }
  };

})


.factory('lesson', function($sce,dbService,moocService,$q) {
    var baseUrl = function(username,password,lessonId) {
      var url = moocService.getServerAddress() + "/admin/auth/login?name=" + username + "&password="+ password + "&rediurl="+moocService.getServerAddress()+"/default/study/clientindex/fromouter/1/iscourse/1/id/"+lessonId + "/clienttype/";
      return url;
    };
  return {
    outlineUrl: function(username,password,lessonId) {
      var url = $sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'gscontent');
      return url;
    },
    homeworkUrl: function(username,password,lessonId) {
      var url =$sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'assignment');
      return url;
    },
    quizUrl: function(username,password,lessonId) {
      var url =$sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'quiz');
      return url;
    },
    postUrl: function(username,password,lessonId) {
      var url = $sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'post');
      return url;
    },
    notesUrl: function(username,password,lessonId) {
      var url = $sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'notes');
      return url;
    },
    evaluationUrl: function(username,password,lessonId) {
      var url = $sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'evaluation');
      return url;
    },
    getResources: function(lessonId){
        var deferred =$q.defer();
        moocService.lessonDetail(lessonId)
          .then(function(data){
                  console.log('课时详情返回成功' + eval(data).success);
                  if(eval(data).success === 1){
                     console.log('11' + eval(data).data.resources);
                     deferred.resolve(eval(data).data.resources);
                     console.log("moocService success");
                  }else{
                     deferred.reject(eval(data).message);
                  }
                }, function(data){
                    deferred.reject(data);
                    console.log('课时详情返回失败' + data);
              });
        return deferred.promise;
   }

  };
})


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


.factory('$localstorage', ['$window', function($window) {
                           return {
                           set: function(key, value) {
                           $window.localStorage[key] = value;
                           },
                           get: function(key, defaultValue) {
                           return $window.localStorage[key] || defaultValue;
                           },
                           setObject: function(key, value) {
                           $window.localStorage[key] = JSON.stringify(value);
                           },
                           getObject: function(key) {
                           return JSON.parse($window.localStorage[key] || '{}');
                           }
                           }
    }])

.factory('downloadService', function($ionicPlatform,$cordovaFileTransfer) {
       return {
        getFileName:function(o){
            var pos=o.lastIndexOf("/");
            return o.substring(pos+1);
          }, 
         addDownloadTask: function(resouce) {
              $ionicPlatform.ready(function(){
                      var url = resource.file_path;
                      var file_name = getFileName(url);
                      var fileDir = cordova.file.documentsDirectory + file_name;
                      console.log('full fileDir is:' + fileDir);
                      var download = $cordovaFileTransfer.download(url, fileDir).then(function (success) {
                      console.log("success " + JSON.stringify(success));
            $timeout(function () {
                     $scope.downloadProgress = 100
          }, 1000);
        }, function (error) {
          console.log("Error " + JSON.stringify(error));
        }, function (progress) {
          $timeout(function () {
              console.log("progress" + resource.id  + 'is' +$scope.downloadProgress);
            // $scope.downloadProgress = (progress.loaded / progress.total) * 100;
            //         console.log(" $scope.downloadProgress " + resource.id  + $scope.downloadProgress);
          });
        });
        if ($scope.downloadProgress > 0.1) {
          download.abort();
        }
      })
      },
      removeDownloadTask: function(resouce) { 
       }
     }
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
  var serverAddress = 'http://42.62.16.168:8080';
  var baseUrl = 'http://42.62.16.168:8080/api?method=';
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
    });
    return deferred.promise;
  }
   this.getServerAddress = function(){
       return serverAddress;
   } 
  // 用户登录
  this.signIn = function(name,password){
    //var parms = 'userAuth&user_name='+ user.username +'&user_pwd='+ user.password +'&udid='+'11111';
    var parms = 'userAuth&user_name='+ name +'&user_pwd='+ password +'&udid='+'11111' +'&type=1';    ///<! 明文密码
    console.log('parms is '+ parms);
    var finalUrl = makeUrl(parms);
    console.log('finalUrl is ' + finalUrl);
    return request(finalUrl);
  }
  // 课程列表
  this.courseList = function(userId){
    var parms = 'courseList&user_id=' + userId;
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
      var parms ='getSingleStudyPlan&studyplan_id='+lessonId;
      console.log('parms is'+ parms);
      var finalUrl = makeUrl(parms);
      console.log('finalUrl is' + finalUrl);
      return request(finalUrl);
    }
})

.service('testService', function(){
    /// course profile
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
    
    /// course details
    var courseDetails = function(){
        var chapters = [];
        var res = {
            success:1,
            message:"",
            data:chapters
        };
        
    }();
    
    this.getCourses = function(){
        return courses;
    }
    
    this.getCourseDetails = function(){
        return {"success":1,"message":"","data":{"course_id":"AB252A87-1C94-3ABA-40BC-1E4AFCD25012","course_name":"sfdfsdf","teacher_id":"E2AE0797-96AB-D468-84D4-3A70718985A4","teacher_name":"\u9648\u56fd\u51ac\u8001\u5e08","study_num":"111","open_time":"1425139200","end_time":"1427731200","course_type":"1427731200","credit":"11","period":"11","professional":"\u6863\u6848\u7ba1\u7406","description":"sdfsfwfsdfsdfsdfsf","cover_url":"http:\/\/172.19.43.88:8080\/data\/uploads\/Courses\/AB252A87-1C94-3ABA-40BC-1E4AFCD25012\/bdf624560206c7829dcf13552bcc3735.jpg","chapters":[{"id":"5BF482ED-B5FF-A8FE-3FD1-C34BCE750AAA","name":"1","studyplans":[{"id":"8996590F-E596-9F0B-7713-6A834BAB75D9","name":"78ad497936ad973b3df916b5eae0c0df","pId":"5BF482ED-B5FF-A8FE-3FD1-C34BCE750AAA","creater":"\u9648\u56fd\u51ac\u8001\u5e08","ctime":"1431485564","icon_path":"\/public\/admin\/images\/default1.png"},{"id":"6919F23F-A079-9EB5-20A5-B44B0B050BC6","name":"78ad497936ad973b3df916b5eae0c0df","pId":"5BF482ED-B5FF-A8FE-3FD1-C34BCE750AAA","creater":"\u9648\u56fd\u51ac\u8001\u5e08","ctime":"1431485616","icon_path":"\/public\/admin\/images\/default1.png"},{"id":"D748AB70-7FAA-7E23-3960-918EAAD3C201","name":"78ad497936ad973b3df916b5eae0c0df","pId":"5BF482ED-B5FF-A8FE-3FD1-C34BCE750AAA","creater":"\u9648\u56fd\u51ac\u8001\u5e08","ctime":"1431485645","icon_path":"\/public\/admin\/images\/default1.png"},{"id":"EBCE0BD1-AD24-ACBB-7875-615124321C23","name":"78ad497936ad973b3df916b5eae0c0df","pId":"5BF482ED-B5FF-A8FE-3FD1-C34BCE750AAA","creater":"\u9648\u56fd\u51ac\u8001\u5e08","ctime":"1431502158","icon_path":"\/public\/admin\/images\/default1.png"}]},{"id":"6D5CB29A-BFE4-19E4-3A08-3A4F229D8583","name":"232121","studyplans":[{"id":"DFD2DCBE-7835-2327-A746-CA0A8CDEB96E","name":"q3","pId":"6D5CB29A-BFE4-19E4-3A08-3A4F229D8583","creater":"\u9648\u56fd\u51ac\u8001\u5e08","ctime":"1432882105","icon_path":"http:\/\/172.19.43.88:8080\/data\/uploads\/Courses\/DFD2DCBE-7835-2327-A746-CA0A8CDEB96E\/5881202fe8e50696fcb9dc907aaafa43.jpg"}]}]}};
    }
});

