(function () {
    var app = angular.module("ktVideoApp", ['ui.bootstrap']);

    // var connectionString = "https://api.github.com/users/kiranbose";
    // http://capacityplan.azurewebsites.net/api/tblKTVideos/
    var connectionString = "http://capacityplan.azurewebsites.net/api/tblKTVideos/";

    var MainController = function ($scope, $http) {

       
            var doneCallbacks = function (response) {
            $scope.videos = response.data;
            //          console.log(response.data);
            $scope.totalItems = $scope.videos.length;
            $scope.numPerPage = 12;
            $scope.maxSize = Math.ceil($scope.totalItems/$scope.numPerPage);
            $scope.currentPage = 1;
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
        
           $scope.$watch('currentPage + numPerPage', function () {
               if(typeof($scope.videos) != 'undefined')
               {
              var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                  end = begin + $scope.numPerPage;

              $scope.filteredVideos = $scope.videos.slice(begin, end);
               }
        });
        
        $scope.applicationName = "KTVideo Store";

        $scope.playVideo = function (obj, $event) {
            //          console.log(obj);
            $scope.playingVideo = obj;
        }

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

    app.controller("MainController", ["$scope", "$http", MainController]);


}());


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