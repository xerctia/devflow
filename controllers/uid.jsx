const uid = function () {
    var id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    return id;
};

export default uid;