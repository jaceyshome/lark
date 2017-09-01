/**
 * Service constructor
 * @param {String} id - service id
 * @returns {Object} service - a new instance of service
 * @constructor
 */
function Service(id) {
    var service = this;
    service.__id = id;
    return service;
}
