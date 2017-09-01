lark.addComponent('jsShow',[function(){
  return function(){
    return {
      link: (function($scope,$element){
        var expression = $element.getAttribute('js-show') || $element.getAttribute('data-js-show');
        $scope.$watch(expression,function(val){
          if(val){
            $element.style.display = 'block';
          }else{
            $element.style.display = 'none';
          }
        });
      })
    }
  }
}]);

