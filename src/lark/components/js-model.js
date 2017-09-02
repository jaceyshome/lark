lark.addComponent('jsModel', [function () {
    return function () {
        return {
            link: (function ($scope, $element) {
                var expression = $element.getAttribute('js-model') || $element.getAttribute('data-js-model');
                if (expression) {
                    $element.value = $scope.$getExpValue(expression);
                }

                $scope.$watch(expression, function (val) {
                    if ($element.value !== val) {
                        $element.value = (val === undefined) ? '' : val;
                    }
                });

                $element.addEventListener("keyup", (function () {
                    var oldValue = null;
                    return function (e) {
                        if (oldValue != e.target.value) {
                            $scope.$setExpValue(expression, e.target.value);
                            $scope.$update();
                        }
                        oldValue = e.target.value;
                        e.target.focus();
                    };
                })());
            })
        }
    }
}]);

