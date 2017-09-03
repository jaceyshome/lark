/**
 * Remove and Add the dom element base on the condition
 * 
 */
lark.addComponent('jsIf', [function () {
    return function () {
        return {
            link: (function ($scope, $element) {
                var expression = $element.getAttribute('js-if') || $element.getAttribute('data-js-if');
                var $parentNode = $element.parentNode;
                $scope.$watch(expression, function (val) {
                    if (val && !$element.parentNode != $parentNode) {
                        $parentNode.appendChild($element);
                    } else {
                        $parentNode.removeChild($element);
                    }
                });
            })
        }
    }
}]);

