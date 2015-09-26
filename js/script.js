(function () {
    var app = angular.module("ktVideoApp", ['ui.bootstrap']);
    var itemsPerPage = 12;
    // var connectionString = "https://api.github.com/users/kiranbose";
    // http://capacityplan.azurewebsites.net/api/tblKTVideos/
    var connectionString = "http://capacityplan.azurewebsites.net/api/tblKTVideos/";

    var MainController = function ($scope, $http, $log) {

        $scope.headingText = "All Videos";

        var doneCallbacks = function (response) {
            $scope.videos = response.data;
            $scope.allVideos = $scope.videos;
            //          console.log(response.data);
            $scope.totalItems = $scope.videos.length;
            $scope.numPerPage = itemsPerPage;
            $scope.maxSize = Math.ceil($scope.totalItems / $scope.numPerPage);
            $scope.currentPage = 1;
            $scope.flag = 10;
            $scope.filteredVideos = [];

            console.log($scope.totalItems);
            console.log($scope.numPerPage);
            console.log($scope.maxSize);
        };

        var failCallbacks = function (response) {
            $scope.error = "Could not fetch videos";
            console.log("Could not fetch videos");
        };

        $scope.getAll = function () {
            $http.get(connectionString).then(doneCallbacks, failCallbacks);
        }();

        var searchComplete = function (response) {
            $scope.videos = response.data;
            //          console.log(response.data);
            $scope.totalItems = $scope.videos.length;
            $scope.numPerPage = itemsPerPage;
            $scope.maxSize = Math.ceil($scope.totalItems / $scope.numPerPage);
            $scope.currentPage = 1;
            $scope.flag++;
            $scope.filteredVideos = [];
        }

        $scope.searchVideo = function (searchText) {
            $("#backbutton").removeClass("hidden");
            $scope.headingText = "Search Results for \"" + searchText + "\"";
            $http.get(connectionString + "searchktVideos/" + searchText).then(searchComplete, failCallbacks);
            if ($('#searchBox').val() == '')
                $('html,body').animate({
                        scrollTop: $("#searchdiv").offset().top
                    },
                    'slow');
        };

        $scope.$watch('currentPage + numPerPage + flag', function () {
            if (typeof ($scope.videos) != 'undefined') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                    end = begin + $scope.numPerPage;

                $scope.filteredVideos = $scope.videos.slice(begin, end);
            }
        });

        $scope.applicationName = "KTVideo Store";
        
        var addedViewCount = function(response){
            $log.log("Video view count added for " + $scope.playingVideo.VideoName);   
        }
        
        var failAddVewCount = function(response){
            $log.log("Add view count failed, reason : " + response.data);   
        }
        
        var addvideoCount = function(obj){
            $http.get(connectionString + "addviewcount/" + obj.VideoID).then(addedViewCount, failAddVewCount);
        }

        $scope.playVideo = function (obj, $event) {
            //          console.log(obj);
            $scope.playingVideo = obj;
            addvideoCount(obj);
            $('html,body').animate({
                scrollTop: 0
            }, 'fast');
        }

        /* Searching ***********************/

        $scope.$watch('searchText', function (newValue, oldValue) {
            if (!(newValue === oldValue) && newValue != '') {
                console.log(newValue);
                $scope.searchVideo(newValue);

            } else if (newValue === '') {
                $scope.loadAllVideos();
            }
        });

        $scope.loadAllVideos = function () {
            $("#backbutton").addClass("hidden");
            $scope.headingText = "All Videos";
            $scope.flag = 10;
            $scope.videos = $scope.allVideos;
            $scope.totalItems = $scope.videos.length;
            $scope.numPerPage = itemsPerPage;
            $scope.maxSize = Math.ceil($scope.totalItems / $scope.numPerPage);
            $scope.currentPage = 1;
        };

        /******for anim*************/
        $scope.$watch('playingVideo', function (newValue, oldValue) {
            if (typeof (oldValue) === 'undefined' && typeof (newValue) != 'undefined') {
                console.log('Changed!');
                //                $("#videoplayerid").addClass("scale");
                //                $("#videoplayerid").slideDown( "slow" );
            }
        });
        /******for anim*************/

        $scope.isSelected = function (section) {
            return $scope.selected === section;
        }

    };
    app.controller("MainController", ["$scope", "$http", "$log", MainController]);
}());

////on video load start
//$("#videoId").on("loadstart", function (e) {
//    console.debug("Video startedplaying. Current time of videoplay: " + e.target.currentTime);
//});

$(window).scroll(function () {
    if ($(this).scrollTop() > 1) {
        $('nav').addClass("sticky");
        $("#logo").addClass("domoLogoMin");
        $("#videoSec").addClass("scale");
    } else {
        $('nav').removeClass("sticky");
        $("#logo").removeClass("domoLogoMin");
        $("#videoSec").removeClass("scale");
    }
});