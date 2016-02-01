/**
 * Created by agescura on 19/1/16.
 */

var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var mongoose = require('mongoose');
var turf = require('turf');

var OpenDataSchema = require('../models/OpenDataSchema');

/* GET structure list page. */
router.get('/', function(req, res, next) {
    OpenDataSchema.find({}, function(err, schemas) {
        if (err) throw err;
        res.render('docs/index', { structures: schemas});
    });
});

/* GET dataset page. */
router.get('/:id', function(req, res, next) {
    var db = mongo.db('mongodb://localhost:27017/MongosArray');
    OpenDataSchema.find({'name': req.params.id}, function (err, structure) {
        if (err) throw err;
        mongoose.connection.db.collection(req.params.id).find({}).toArray( function (err2, dataset) {
            if (err2) throw err2;
            res.render('docs/dataset', {title: req.params.id, dataset: dataset, structure: structure[0] });
        });
    });
});

module.exports = router;