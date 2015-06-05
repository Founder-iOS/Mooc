var ON_BROWSER = false;
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','starter.controllers','starter.services','starter.directives'])

    .run(function($ionicPlatform,$cordovaSQLite) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
//            var arr = new Array();
//            arr.push('555');
//            arr.push('1111');
//            arr.push('21111');
//            arr.splice(arr.indexOf('1111'), 1);
//            arr.push('3');
//            console.log(arr);
//            console.log(arr);
//            console.log(arr[0]);
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
            //创建db文件
            var db = $cordovaSQLite.openDB("mooc.db",0);
            //创建用户表
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (id text primary key,name text,true_name text,email text,qq text,mobile text,phone text,address text,icon_path text,role integer,sex integer)",'');
            //创建课程表
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS course (id text primary key,name text,description text,teacher_id text,teacher_name text,study_num integer,open_time double,course_type integer,credit integer,period integer,professional text,cover_url text)",'');
            //章节表
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS chapter (id text primary key,name text)",'')
            //课时表
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS lesson(id text primary key,name text,creater text,ctime double,icon_path text,enter_time double,exit_time double,studyed bool)",'');

            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS resource (id text primary key,name text,original_name text,mime_type text,file_path text,progress float,downloading bool,finishDownload bool,lesson_id text)",'');

            //deviceService.get();
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.jsr
        $stateProvider
            // setup an abstract state for the tabs directive
            .state('signin', {
                url: '/sign-in',
                templateUrl: 'templates/sign-in.html',
                controller: 'SignInCtrl'
            })
            .state('tab', {
                url: '/tab',
                //abstract: true,
                templateUrl: "templates/tabs.html"
            })
            .state('tab.courses', {
                url: '/courses',
                views: {
                    'tab-courses': {
                        templateUrl: 'templates/tab-courses.html',
                        controller: 'CoursesCtrl'
                    }
                }
            })
            .state('tab.offline', {
                url: '/offline',
                views: {
                    'tab-offline': {
                        templateUrl: 'templates/tab-offline.html',
                        controller: 'OfflineCtrl'
                    }
                }
            })
            .state('tab.user', {
                url: '/user',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/tab-user.html',
                        controller: 'UserCenterCtrl'
                    }
                }
            })
            .state('tab.course-detail', {
                url: '/courses/:courseId',
                views: {
                    'tab-courses': {
                        templateUrl: 'templates/course-detail.html',
                        controller: 'CourseDetailCtrl'
                    }
                }
            })
            .state('tab.lesson', {
                url: "/lesson/:lessonId",
                views: {
                    'tab-courses': {
                        templateUrl: 'templates/course-lesson.html',
                        controller: 'LessonCtrl'
                    }
                }
            });


        // Each tab has its own nav history stack:
        // if none of the above states are matched, use this as the fallback

//   $urlRouterProvider.otherwise('/lesson/2209F611-7FE9-1BF9-CD89-CD328F7D2F67');

        //$urlRouterProvider.otherwise('tab/courses/1');
         $urlRouterProvider.otherwise('/sign-in');
       //$urlRouterProvider.otherwise('/tab/lesson/11');

    });
