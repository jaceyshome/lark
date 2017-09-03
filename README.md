# Lark #

## Requirements ##

* NodeJs 6.1.0
* [Chimp.js](https://chimp.readme.io/) 
* Chrome (60+)

## Overview ##
Lark is a tiny MVC framework which is written in ES5, it doesn't have any dependencies on other javascript libraries. It provides an easy to write components and use dependecny injection to manage componenent dependencies. More information on how to create components is provided below.

## Setup ##
If you haven't used node version manager [NVM](https://github.com/creationix/nvm/blob/master/README.md), recommend to install it, so you can switch different node version for different projects easily. After the installation, 6.1.0 has been tested and is working. Please report issues if the version doesn't work for you.
To use a version, for example 6.1.0
```
nvm install 6.1.0
```
Check the version 6.1.0 with
```
node -v 
```

You can install NVM with [Homebrew](https://brew.sh/)
```
brew update
brew install nvm
mkdir ~/.nvm
nano ~/.bash_profile
```

Install library
```
[sudo] npm install -g chimp
[sudo] npm install
```

Then run gulp watch to try out the app is via the built-in server: (http://localhost:9000/demo/)
```
gulp watch
```


## Project structure ##

```
- src                   //source code
    - app               //demo application 
    - asssets           //demo application assets (bootstrap.css, video, images etc.)
    - lark              //framework file
    
- demo 
    - partials          //page partials (footer libs, header libs etc.)
    index.html          //demo page
    
- features              //End to end test features
    
    - _support          //supporting code, use for different test components
    helper.js     //helper class
    
    - components        //source code of test components       
    
    - features          //test features and scenrios
         
- gulp                   
    - tasks             //Gulp build task, (gulp release)
    config.js           //gulp tasks configuration (source and destination paths)  
        
- output                //test log
    
.editorconfig           //IDE default configuration, it is for Intellij EditorConfig plugin
test.config.js          //Tes global configuration for server and envirnment
chimp.conf.js           //ChimpJs configuration
```

## Dependencies ##
It uses dependency injection technique to manage the dependency. This project is using the gulp `build-app` `build-lark` to concat source files together, the source file order is config in `gulp/config.js`. 

## Predefined Components ##

### js-repeat ###
It instantiates a html tempalte once per item from a collection or an array. Each instance gets its own scope, where the given loop variable is set to the current collection item, and $index is set to the item index or key.
```
<ul>
     <li data-js-repeat="task in tasks" >
         <p>{{task.name}}</p>
     </li>
</ul>
```
After rendering
```
<ul>
     <li data-js-repeat="task in tasks" >
         <p>task A</p>
     </li>
     <li data-js-repeat="task in tasks" >
         <p>task B</p>
     </li>
     <li data-js-repeat="task in tasks" >
         <p>task C</p>
     </li>
</ul>
```
Component template 
```
<data-component-country>
    <h3>{{country.name}}</h3>
    <p>{{country.intro}}</p>
</data-component-country>
<div data-js-repeat="country in countries" data-component-country data-country="country"></div>
```

### js-show / js-hide ###
The element is shown or hidden based on the {{expression}} of the `data-js-show` or `data-js-hide` attribute onto the element. 
```
<form data-js-show="isOpened">...</form>
```
If $scope.isOpened is `true` show the form
```
<form data-js-hide="isClosed">...</form>
```
If $scope.isClosed is `true` hide the form

### js-if ###
It removes or recreates the DOM element based on the {{expression}} of `data-js-if` attribute onto the element.
```
<form data-js-if="isOpened">...</form>
```
If $scope.isOpened is `true` add the form element, otherwise remove the form element

### Custom element behaviours ###
It provides custom behaviour for element itself.
The list of the behaviours
```
data-js-click, data-js-dblclick, data-js-mousedown, data-js-mouseup, data-js-mouseover, data-js-mouseout, data-js-mousemove, data-js-mouseenter, data-js-mouseleave, data-js-keydown, data-js-keyup, data-js-keypress, data-js-submit, data-js-focus, data-js-blur, data-js-copy, data-js-cut, data-js-paste
```
Example
```
<button type="button" data-js-click="removeMe()">Delete</button>
```
It provides click behaviour, on click this delete button, it will execute `$scope.removeMe()` method. 

### js-model ###
It uses for the form interaction elements, binds the textinput, textarea or select to a property defined in the corresponding scope model. It Binds the view into the scope model, which otherelements such as input, textarea or select require.
```
<input class="form-control" data-js-model="currentTask.name" placeholder="Name" id="taskName"/>

```
Scope model 
```
$scope.currentTask.name
```


## Predefined services ##
### $template ###
It creates the collection of all component templates before setting up components
A template has `type="text/x-lark-template"`  `id` is in the reference in the component. A template can be used for different component models
For example

```
<script type="text/x-lark-template" id="component-new-task-template" >
    <button type="button" class="btn btn-primary" data-js-click="create()">Create</button>
</script>
```
templateId equals `component-new-task-template`
```
lark.addComponent('newTask', [function() {
    return function () {
        return {
            scope: {},
            templateId: "component-new-task-template",
            link: (function ($scope, $element) {
                
            })
        }
    }
}]);
```

### $refresh ###
It provides the method `lark.$refresh.loop()` to scanner the whole scope tree, validate the binding properties and update the view. it is the same to call `$scope.$update()`. It uses for the situation when you want to manually update the view. In the future, it will provides the ability to update particular part of the scope tree.


## Event handlers ##


### Development ###