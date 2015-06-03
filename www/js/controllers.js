var DEBUG = true;

angular.module('starter.controllers', [])

.controller('UserCenterCtrl', function() {
})

.controller('OfflineCtrl', function() {
})

.controller('SignInCtrl', function($scope,$rootScope,$ionicPlatform,$state,users) {
  $rootScope.user = user.lastLoginUser();
  $scope.signIn = function(user) {
            users.requestUser(user.username,user.password).then(
                                                            function(data){
                                                            $rootScope.user = data;
                                                            console.log("signin success");
                                                                $state.go('tab-courses');
                                                            },
                                                            function(err){
                                                            console.log("signin fail");
                                                            }
                                                            );
            console.log('$scope.resources is'+ ' ' +$scope.resources);
        };
  }
})

.controller('CoursesCtrl', function($scope,$ionicPlatform,$rootScope,courses,testService) {
    console.log('开始请求课程列表');
      $rootScope.user = {
     username:'xiaoyu0915',
     password:'111111',
     id :'111'
  };
    /*
    moocService.clientActive()
    .then(function(data){
        console.log(data);
      }, function(data){5

        console.log('结束');
      })
*/
            
//            $scope.downloadFile = function () {
//            $ionicPlatform.ready(function() {
//                                  console.log('开始download');
//                                 var db = $cordovaSQLite.openDB({ name: "my.db", bgType: 1 });
//                                 
//                                 $scope.execute = function() {
//                                 var query = "INSERT INTO test_table (data, data_num) VALUES (?,?)";
//                                 if(db){
//                                 console.log('开始download111');
//                                 }
//                                 $cordovaSQLite.execute(db, query, ["test", 100]).then(function(res) {
//                                                                                       console.log("insertId: " + res.insertId);
//                                                                                       }, function (err) {
//                                                                                       console.error(err);
//                                                                                       });
//                                 };
//                                 });
//
//            };
//            $scope.downloadFile();


  $scope.getItemHeight = function(item, index) {
    //使索引项平均都有10px高，例如
    return 280;
  };
  $scope.remove = function(course) {
    Courses.remove(chat);
  };
  $scope.gotoCourseDetail = function(courseId) {
    Courses.remove(chat);
  };
 
  $scope.doRefresh = function() {
   $scope.courses = courses.get($rootScope.user.id);
  };
 // $scope.doRefresh();
    $scope.courses = testService.getCourses();
})
.controller('CourseDetailCtrl', function($scope,$stateParams,courseDetail) {
  $scope.index = 1;
  $scope.learningLesson = {chapterNo:0, lessonNo:3};      ///< 正在学习的课程
  $scope.course;
  if(DEBUG){
    console.log('course detail id: ' + $stateParams.courseId);
  }
  $scope.course =courseDetail.get($stateParams.courseId);
  if(DEBUG){
        $scope.course = testService.getCourseDetails().data;
        console.log("faked data");
        console.log($scope.course);
  }
  $scope.navItems = [{title:'简介',index:0},{title:'课时',index:1}];
  $scope.navViews = [{title:'简介',index:0},{title:'课时',index:1}];
  $scope.goPage = function(index){
     $scope.index = index;
  };
  $scope.goStudyPlan = function(lessonId) {
        ///< 跳转到lessonId页面
  }
})
.controller('LessonCtrl', function($scope,$rootScope,$stateParams,$cordovaFileTransfer, $ionicPlatform,$cordovaInAppBrowser,$cordovaFileOpener2,lesson) {
  $rootScope.user = {
           name:'xiaoyu0915',
           password: '111111'
  };
   console.log($rootScope.user.name);
  $scope.openResource = function(resource){
    console.log(resource.file_path);
     var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };
    $ionicPlatform.ready(function(){
        //内置reader打开
        var url = resource.file_path;
        var file_name = $scope.getFileName(url);
        var fileDir = cordova.file.documentsDirectory + file_name;
        $cordovaFileOpener2.open(
                        fileDir,
                         'application/pdf'
               ).then(function() {
                                                        // file opened successfully
          }, function(err) {
                                                        // An error occurred. Show a message to the user
        });
                        
    //内置浏览器打开
//    $cordovaInAppBrowser.open(resource.file_path, '_blank', options)
//      .then(function(event) {
//        // success
//            console.log('打开成功');
//      })
//      .catch(function(event) {
//        // error
//             console.log('打开失败');
//
//      });
    //$cordovaInAppBrowser.close();
  }, false);

  };
  $scope.getFileName = function(o){
            var pos=o.lastIndexOf("/");
            return o.substring(pos+1);
    };
  $scope.downloadResource = function(resource){

  };

   $scope.outlineUrl = lesson.outlineUrl($rootScope.user.name,$rootScope.user.password,$stateParams.lessonId);
   $scope.homeworkUrl =lesson.homeworkUrl($rootScope.user.name,$rootScope.user.password,$stateParams.lessonId);;
   $scope.quizUrl = lesson.quizUrl($rootScope.user.name,$rootScope.user.password,$stateParams.lessonId);;
   $scope.postUrl = lesson.postUrl($rootScope.user.name,$rootScope.user.password,$stateParams.lessonId);;
   $scope.notesUrl = lesson.notesUrl($rootScope.user.name,$rootScope.user.password,$stateParams.lessonId);;
   $scope.evaluationUrl = lesson.evaluationUrl($rootScope.user.name,$rootScope.user.password,$stateParams.lessonId);;
   console.log('$scope.outlineUrl is' + $scope.outlineUrl);
   console.log($scope.lesson);
   $scope.doRefresh = function() {
   lesson.getResources($stateParams.lessonId).then(
         function(data){
             $scope.resources = data;
             console.log("getResources success");
         },
         function(err){
             console.log("getResources fail");
         }
     );
     console.log('$scope.resources is'+ ' ' +$scope.resources);
  };       
   $scope.doRefresh();


})

