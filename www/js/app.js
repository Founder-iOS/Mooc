// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','starter.controllers','starter.services','starter.directives'])

.run(function($ionicPlatform,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);         
    }              
    
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    //创建db文件
    var db = $cordovaSQLite.openDB("mooc.db",0);
                       alert('1111');
    //创建用户表
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (id text primary key,name text,true_name text,email text,qq text,mobile text,phone text,address text,icon_path text,role integer,sex integer)",'');
    //创建课程表
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS course (id text primary key,name text)",'');

    //deviceService.get();
  });
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  // setup an abstract state for the tabs directive
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })
  .state('lesson', {
    url: "/lesson/:lessonId",
    templateUrl: "templates/lesson.html",
    controller: 'LessonCtrl'
  })
  .state('courses', {
    url: "/courses",
    templateUrl: "templates/courses.html",
    controller: 'CoursesCtrl'
  })
  .state('course-detail', {
      url: '/courses/:courseId',
      templateUrl: 'templates/course-detail.html',
      controller: 'CourseDetailCtrl'
   })
  // Each tab has its own nav history stack:
  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/sign-in');
}); 