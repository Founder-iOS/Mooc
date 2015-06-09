var ON_BROWSER = false;
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','starter.controllers','starter.services','starter.directives'])

    .run(function($ionicPlatform,dbService) {
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
            dbService.initDB();
//            dbService.addChapter();
//            dbService.updaterChapter();
//            dbService.getAllChapters();
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
            .state('tab.downloaded', {
                url: '/downloaded',
                views: {
                    'tab-downloaded': {
                        templateUrl: 'templates/tab-downloaded.html',
                        controller: 'DownloadedCtrl'
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
            .state('tab.lesson-history', {
                url: '/lesson-history',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/lesson-history.html',
                        controller: 'LessonHistoryCtrl'
                    }
                }
            })
            .state('tab.about', {
                url: '/about',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/about.html',
                        controller: 'AboutCtrl'
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
            .state('tab.lesson.outline', {
                url: '/outline',
                views: {
                    '': {
                        templateUrl: 'templates/about.html',
                        controller: 'aboutCtrl'
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

       $urlRouterProvider.otherwise('/sign-in');
//         $urlRouterProvider.otherwise('/tab/courses/4CF65748-DF66-3546-788F-6BA54FF642D3');
//        $urlRouterProvider.otherwise('/tab/lesson/2209F611-7FE9-1BF9-CD89-CD328F7D2F67');

    });
