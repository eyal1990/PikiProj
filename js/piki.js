var app = angular.module('piki', []);

app.controller('questionCtrl', function(){
    this.number = 1;

    var that = this;
    this.nextQuestion = function () {
        that.number++
    };
});

