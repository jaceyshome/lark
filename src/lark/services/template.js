/**
 * Service $template
 * Loop though the whole scope tree, execute watchers of each scope
 */
lark.addService('$template', [function () {
    var $template = {}, templates = {};

    /**
     * Get template by its id
     * @param {String} id - template id
     */
    $template.get = function(id) {
        return templates[id];
    };

    /**
     *
     */
    $template.init = function(mainContainer) {
        var list = document.querySelectorAll('[type="text/x-lark-template"]');
        Array.prototype.forEach.call(list, function(template){
            add(template.id, template.innerHTML);
        });
        console.log("templates", templates);
    };

    /**
     * Add template to templates
     * @param {String} id
     * @param template
     * @return template
     */
    function add(id, template) {
        if(templates[id] !== undefined && templates[id] !== template){
            console.warn("template: " + id + "has been registered");
            return templates[id];
        }
        templates[id] = template;
        return templates[id];
    }

    return $template;
}]);