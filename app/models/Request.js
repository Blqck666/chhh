var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RequestSchema   = new Schema({
    src: String,
    des : String
});

module.exports = mongoose.model('Request', RequestSchema);