/**
 * Created by agescura on 1/12/15.
 */

var mongoose = require('mongoose');

// Dataset Schema
var DatasetSchema = mongoose.Schema({
});

var Dataset = module.exports = mongoose.model('structures', OpenDataSchema);