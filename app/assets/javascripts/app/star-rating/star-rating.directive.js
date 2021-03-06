// http://angulartutorial.blogspot.com/2014/03/rating-stars-in-angular-js-using.html

(function() {
  'use strict';

  angular
    .module(APP_NAME)
    .directive('starRating', starRating);

  function starRating() {
    return {
      restrict: 'EA',
      template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-click="toggle($index)">' +
        '    <span class="btn btn-xs" ng-class="{' + "'" + 'btn-danger' + "'" + ': star.filled, ' + "'" + 'btn-default' + "'" + ': !star.filled}">' +
        '      <span class="glyphicon glyphicon-flash"></span>' +
        '    </span>' +
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }
    };
  }
})();