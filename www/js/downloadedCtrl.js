angular.module('starter.controllers')
    .controller('DownloadedCtrl', function($scope,$ionicPlatform, $cordovaInAppBrowser,lesson) {
        $scope.resources = new Array();

        var initData = function(){
            lesson.getFinishDownloadResourceFromDB().then(function(res){
                var len = res.rows.length;
                for(var i=0;i<len;i++){
                    var resource =  res.rows.item(i);
                    $scope.resources.push(resource);
                }
            },function(err){

            },function(progress){
            });
        };
        var getFileName = function(o){
            var pos=o.lastIndexOf("/");
            return o.substring(pos+1);
        };
        var inAppBrower = function(filePath){
            alert('inAppBrower');
            var options = {
                location: 'yes',
                clearcache: 'no',
                toolbar: 'yes'
            };
            $cordovaInAppBrowser.open(filePath, '_blank', options)
                .then(function(event) {
                    // success
                    console.log('打开成功');
                })
                .catch(function(event) {
                    // error
                    console.log('打开失败');

                });
            //$cordovaInAppBrowser.close();

        };
        var fileOpener = function(filePath,type){
            alert('fileOpener')
            $cordovaFileOpener2.open(
                filePath,
                type
            ).then(function() {
                    // file opened successfully
                }, function(err) {
                    // An error occurred. Show a message to the user
                });
        };
        initData();
        $scope.openResource = function(resource){
            console.log(resource.file_path);
            $ionicPlatform.ready(function() {
                var url = resource.file_path;
                var file_name = getFileName(url);
                var filePath = cordova.file.documentsDirectory + file_name;
                console.log('filePath is ' + filePath);
                inAppBrower(filePath);
//                if(resource.mime_type == application/mmsepub){
//                    fileOpener(filePath,resource.mime_type)
//                }
//                else if(resource.mime_type == application/mmsdpub){
//                    fileOpener(filePath,resource.mime_type)
//                }
//                else if(resource.mime_type == application/ibooks){
//                    fileOpener(filePath,resource.mime_type)
//                }
//                else if(resource.mime_type == application/pdf){
//                    fileOpener(filePath,resource.mime_type)
//                }
//                else{
//                    inAppBrower(filePath);
//                }
            }, false);
        };

    });
