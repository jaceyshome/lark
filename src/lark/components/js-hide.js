/**
 * Hide and show component
 */
lark.addComponent('jsHide', [function () {
    return function () {
        return {
            //TODO provide ability to add custom show class and hide class
            scope: {
                showClass: "="
            },
            link: (function ($scope, $element) {
                var expression = $element.getAttribute('js-hide') || $element.getAttribute('data-js-hide');
                $scope.$watch(expression, function (val) {
                    if (val) {
                        $element.style.display = 'none';
                    } else {
                        $element.style.display = 'block';
                    }
                });
            })
        }
    }
}]);