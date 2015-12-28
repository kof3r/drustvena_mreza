/**
 * Created by Domagoj on 28.12.2015..
 */
var Content = require('../models/content');
function getPost(id){
    return Content.where({id: id, content_type_id: 1}).fetch();
}

module.exports = {
    getPost: getPost
}