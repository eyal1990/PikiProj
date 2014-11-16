var app = angular.module('piki', ['ngAnimate']);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('questionCtrl', function(){
    this.number = 1;

    var that = this;
    this.nextQuestion = function () {
        that.number++;
    };
});

app.directive('timer', ['$interval', function ($interval) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            interval: '@'
        },
        templateUrl: 'templates/timer.html',
        link: function(scope) {

            scope.minutes = Math.floor(scope.interval / 60);
            scope.seconds = scope.interval % 60 < 10 ? '0' + scope.interval % 60 : scope.interval % 60;

            function update() {
                scope.interval--;

                if (scope.interval <= 0) {
                    $interval.cancel(cancel);
                }

                scope.minutes = Math.floor(scope.interval / 60);
                scope.seconds = scope.interval % 60 < 10 ? '0' + scope.interval % 60 : scope.interval % 60;
            }

            var cancel = $interval(update, 1000);
        }
    }
}]);

app.controller('listCtrl', ['$location', '$anchorScroll', function($location, $anchorScroll) {
    this.scrollDown = function () {

        $location.hash('bottom');

        $anchorScroll();
    }
}]);

app.directive('progressbar', ['$interval', function($interval){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            percentages: '=',
            done: '&'
        },
        templateUrl: 'templates/progressbar.html',
        link: function(scope, element) {

            var progress = angular.element(element.children()[0]);
            scope.percentages = 0;

            function update() {
                scope.percentages += 1;
                progress.css('width', scope.percentages + '%');

                if (scope.percentages === 100) {
                    $interval.cancel(cancel);
                    scope.done();
                }
            }

            var cancel = $interval(update, 50);
        }
    }
}]);