/**
 * hide and show component
 */
lark.addComponent('jsHide', [function () {
    return function () {
        return {
            scope: {
                showClass: "="
            },
            link: (function ($scope, $element) {
                var expression = $element.getAttribute('js-hide') || $element.getAttribute('data-js-hide');
                $scope.$watch(expression, function (val) {
                    if (val) {
                        $element.style.display = 'none';
                    } else {
                        $element.style.display = $scope.showClass || 'block';
                    }
                });
            })
        }
    }
}]);