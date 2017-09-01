lark.addService('catService', [function () {
    var service = {};

    service.cats = [
        {
            name: "lonely cat",
            src: "assets/images/cat.jpg",
            counter: 0
        },
        {
            name: 'cute cat',
            src: "assets/images/cat2.jpg",
            counter: 1
        },
        {
            name: 'lazy cat',
            src: "assets/images/cat-vet.jpg",
            counter: 2
        },
        {
            name: 'funny cat',
            src: "assets/images/cat3.jpg",
            counter: 3
        },
        {
            name: 'stone cat',
            src: "assets/images/cat4.jpg",
            counter: 4
        }
    ];

    service.currentCat = null;

    return service;
}]);