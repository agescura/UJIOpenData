/**
 * Created by agescura on 29/11/15.
 */

var mongoose = require('mongoose');

// Open Data Schema
var OpenDataSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    description: {
        type: String
    },
    contact: {
        type: String
    },
    center: {
        lat: Number,
        lng: Number,
        zoom: Number
    },
    fields: [],
    mySchema: {}
});

OpenDataSchema.post('save', function(doc) {
    console.log(doc);
});

OpenDataSchema.post('update', function() {
    console.log(this);
    //this.update({},{ $set: { updatedAt: new Date() } });
});

var OpenData = module.exports = mongoose.model('structures', OpenDataSchema);

