/**
 * Show and hide component
 */
lark.addComponent('jsShow', [function () {
    return function () {
        return {
            //TODO provide ability to add custom show class and hide class
            scope: {
                showClass: "="
            },
            link: (function ($scope, $element) {
                var expression = $element.getAttribute('js-show') || $element.getAttribute('data-js-show');
                $scope.$watch(expression, function (val) {
                    if (val) {
                        $element.style.display = 'block';
                    } else {
                        $element.style.display = 'none';
                    }
                });
            })
        }
    }
}]);

