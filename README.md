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


## Component Development ##

### Develop a service ###
Normally, you use a service to manage data used for different components or talk to the web server. 
For example a `taskService`
```
lark.addService('taskService', ['HttpService', function (HttpService) {
    var service = {};

    var _tasks = [];

    service.list = function() {
        _tasks = HttpService.fetchTasks()
        ...
        return _tasks;
    };

    service.update = function(candidate) { };

    service.add = function(candidate) { };

    service.get = function(candidate) { };

    service.remove = function(candidate) {};
    
    return service;

}]);
```

### Develop a component template ###
The component template element has `type="text/x-lark-template"` for the `script` tag or (TODO)`data-type="text/x-lark-template"` for custom tag (`<div data-type="text/x-lark-template" >`) For example
```
<script type="text/x-lark-template" id="component-task-list-template">
    <div class="container">
        <div data-js-repeat="task in tasks" data-task-avatar data-task="task" style="margin-bottom: 20px;"></div>
    </div>
</script>
```
A component template can be shared with different controller. For this project, it is using gulp `build-template` task to concat all templates into single file `dist/app/templates.html`, which is included in the demo page with using ssi `<!--#include virtual="app/templates.html" -->`

### Develop a component Controller ###
A component controller controls the presentation logic. On components set up, it gets a new instance of the Scope object. An example
```
lark.addComponent('componentName', ['ServiceName', function (ServiceName) {
       return function () {
           return {
               scope: { },     //configurable object
               template: '',   //view template
               link: (function ($scope, $element) {}) //controller
           }
       }
   }]);
```

The `scope` parameter is a collection of Strings, it is optional, it collects optional properties in the component $scope object. You can use it to get and set the data between sharing scope components or set the configurable options for the component.

Get and set the value between components like the parent and the child component.
The value is the property of the parent $scope. For example

Parent and child component templates
```
 <div data-parent-component >
      <div data-child-component data-parent-name="name" >
           {{parentName}}
      </div>
 </div>
```
Parent component
```
lark.addComponent('parentComponent', [function () {
       return function () {
           return {
               link: (function ($scope, $element) {
                   $scope.parentName = "radish";
               })
           }
       }
}]);
```

Child component 
```
lark.addComponent('childComponent', [function () {
  return function () {
      return {
          scope: {
              parentName: "="
          },
          link: (function ($scope, $element) {
              console.log($scope.parentName); //Radish
          })
      }
  }
}]);
```

Get the value of the component scope
```
<div data-featured-panel data-colour="dark" class="{{panelClass}}">
 ...
</div>
```

Example
```
lark.addComponent('featuredPanel', [function () {
  return function () {
      return {
          scope: {
              colour: "="
          },
          link: (function ($scope, $element) {
              if($scope.colour == "dark") {
                  $scope.panelClass = "dark-panel";
              }
          })
      }
  }
}]);
```
After initialisation, the rendered view is
```
<div data-featured-panel data-colour="dark" class="dark-panel">
  ...
</div>
```

### Develop a page ###
The project uses nodejs `ssi` library to control server side include, the gulp task `gulp build-template` will set the `sitePathValue` and make partials ready in dist folder, for example the `dist/demo/index.html` 
```
<!--#set var="sitePath" value="<%=sitePathValue%>" -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Lark demo</title>
    <!--#include virtual="demo/partials/head-libs.html" -->
</head>

<body>
<div class="container" id="mainContainer">
    application code 
</div>

<!--#include virtual="app/templates.html" -->
<!--#include virtual="demo/partials/footer-libs.html" -->
</body>
</html>
```

### Manage dependencies ###
This project simply uses gulp task to manage the source code dependency, `gulp build-lark` and `gulp build-app`. Those two tasks will concat the source files into `dist/lark.js` and `dist/app/app.js`, they register in `demo/partials/footer-libs.html` 


## Test ##
It uses [Chimp.js](https://chimp.readme.io/) to develop test case. Before run the test locally, you should start the local server by `gulp serve` or `gulp watch`
The configuration file is `test.config.js` which has the global configuration and `chimp.conf.js` which has the default configuration.

Add `@watch` tag in a feature or scenario, then run `chimp --watch`, you should see your chrome browser pops up
Run `chimp` in terminal to run all test cases

## Release ##
The project follows the git-flow methodology, uses [semver version numbers](http://semver.org/) and JSPM and Bower for distribution. Releases are created by merging `develop` to `master`, building the release code and tagging the `master` branch with a version number.

First, check the latest develop branch is release-ready:

```
$ git checkout develop
$ git pull
$ git push
```
Then merge the release-ready code to master

```
$ git checkout master
$ git pull
$ git merge develop

$ git commit
```

Then, while still on `master`, the process of building, updating version numbers and tagging the release can be done using `gulp release`. By default `gulp release` will increment the bugfix version, it supports `--bump` options are `major`, `minor`,  and `patch` but the major and minor versions can be incremented using the `--bump` flag, for example:

```
gulp release --bump patch
```

Finally, push new release to remote master branch and push new release tag to remote master branch. 

```
git push
git push --tags
```


## TODO ##
Fix scope destroy doesn't handle empty scope for js-repeat component
Add router component to control router


## Acknowledgments ##
Test framework uses  [Chimp.js](https://chimp.readme.io/)
Release uses [gulp release](https://www.npmjs.com/package/gulp-release) package
Demo application uses [Bootstrap](http://getbootstrap.com/)