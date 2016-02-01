/**
 * Created by agescura on 3/11/15.
 */

var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var mongoose = require('mongoose');
var turf = require('turf');

var OpenDataSchema = require('../models/OpenDataSchema');

/* GET dataset page. */
router.get('/:id', function(req, res, next) {
    var db = mongo.db('mongodb://localhost:27017/MongosArray');
    OpenDataSchema.find({'name': req.params.id}, function (err, structure) {
        if (err) throw err;
        mongoose.connection.db.collection(req.params.id).find({}).toArray( function (err2, dataset) {
            if (err2) throw err2;
            console.log(dataset);
            console.log(structure[0]);
            res.render('datasets/dataset', {title: req.params.id, dataset: dataset, structure: structure[0] });
        });
    });
});

router.post('/:id/add', function (req, res, next) {
    delete req.body.submit;
    var db = mongo.db('mongodb://localhost:27017/MongosArray');
    db.collection(req.params.id).insert(req.body, function(err) {
        if (err) throw err;
        else {
            res.redirect('/datasets/' + req.params.id);
        }
        db.close();
    });
});

router.get('/:name/:id/delete', function (req, res, next) {
    var db = mongo.db('mongodb://localhost:27017/MongosArray');
    db.collection(req.params.name).remove({ _id : mongo.helper.toObjectID(req.params.id) }, function(err) {
        if (err) throw err;
        else {
            res.redirect('/datasets/' + req.params.name);
        }
        db.close();
    });
});

router.get('/:name/:id', function (req, res, next) {
    var db = mongo.db('mongodb://localhost:27017/MongosArray');
    OpenDataSchema.find({'name': req.params.name}, function (err, structure) {
        if (err) throw err;
        mongoose.connection.db.collection(req.params.name).find({_id: mongo.helper.toObjectID(req.params.id)}).toArray(function (err2, dataset) {
            if (err2) throw err2;
            res.render('datasets/edit', {dataset: dataset[0], structure: structure[0]});
        });
    });
});

router.post('/:name/:id/edit', function (req, res, next) {
    delete req.body.submit;
    var db = mongo.db('mongodb://localhost:27017/MongosArray');
    db.collection(req.params.name).update({_id: mongo.helper.toObjectID(req.params.id)},{$set: req.body}, function(err) {
        if (err) throw err;
        else {
            res.redirect('/datasets/' + req.params.name);
        }
        db.close();
    });
});

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}


module.exports = router;