/**
 * Created by agescura on 5/11/15.
 */

var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var turf = require('turf');

var mongoose = require('mongoose');
var OpenDataSchema = require('../models/OpenDataSchema');

/* GET structure list page. */
router.get('/:name', function(req, res, next) {
    var db = mongo.db('mongodb://localhost:27017/MongosArray');
    var query = {};
    if (req.query) query = req.query;
    db.collection(req.params.name).find(query).toArray(function(err, result) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            db.collection("statistics").findAndModify({query: {"name": req.params.name}, update: { "v": { $inc: { "visited": 1 }}}, new: true, upsert: true});
            res.json(result);
        }
        db.close();
    });
});

router.get('/:name/envelope', function(req, res, next) {
    var db = mongo.db('mongodb://localhost:27017/MongosArray');
    var query = {};
    if (req.query) query = req.query;
    db.collection(req.params.name).find(query).toArray(function(err, result) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            console.log(req.params.name);
            OpenDataSchema.find({ 'name' : req.params.name }, function(err2, schema) {
                if (err2) throw err2;

                var geographicType = 'undefined';
                if ((schema[0]).fields.length) {
                    for (var i = 0; i < (schema[0]).fields.length; i++) {
                        var name = Object.keys((schema[0]).fields[i])[0];
                        if ((schema[0]).fields[i][name]["type"] == 'point' || (schema[0]).fields[i][name]["type"] == 'line' || (schema[0]).fields[i][name]["type"] == 'polygon') {
                            geographicType = name;
                        }
                    }
                }
                console.log(geographicType);

                console.log(result);

                var points = [];
                result.forEach(function(key) {
                    console.log(key);
                    points.push(JSON.parse(key[geographicType]));
                });

                var feature_collection = turf.featurecollection(points);
                var spatial = turf.envelope(feature_collection);
                res.json(spatial);
            });

/*

            */
        }
        db.close();
    });
});

router.get('/:name/nearest', function(req, res, next) {
    var db = mongo.db('mongodb://localhost:27017/MongosArray');
    var query = {};
    if (req.query) query = req.query;
    console.log(query);
    db.collection(req.params.name).find({}).toArray(function(err, result) {
        if (err) {
            res.status(500).send(err);
        }

        else {

            var myPoint = turf.point([req.query.lng,req.query.lat]);

            console.log(req.params.name);
            OpenDataSchema.find({ 'name' : req.params.name }, function(err2, schema) {
                if (err2) throw err2;

                var geographicType = 'undefined';
                if ((schema[0]).fields.length) {
                    for (var i = 0; i < (schema[0]).fields.length; i++) {
                        var name = Object.keys((schema[0]).fields[i])[0];
                        if ((schema[0]).fields[i][name]["type"] == 'point' || (schema[0]).fields[i][name]["type"] == 'line' || (schema[0]).fields[i][name]["type"] == 'polygon') {
                            geographicType = name;
                        }
                    }
                }

                var points = [];
                result.forEach(function(key) {
                    console.log(key);
                    if (geographicType == 'polygon') {
                        points.push(JSON.parse(turf.centroid(key[geographicType])));
                    } else {
                        points.push(JSON.parse(key[geographicType]));
                    }

                });

                var feature_collection = turf.featurecollection(points);

                var nearest = turf.nearest(myPoint, feature_collection);
                res.json(nearest);
            });

            /*

             */
        }
        db.close();
    });
});

/* GET structure list page. */
router.get('/:name/:id', function(req, res, next) {
    var db = mongo.db('mongodb://localhost:27017/MongosArray');
    db.collection(req.params.name).find({_id: mongo.helper.toObjectID(req.params.id)}).toArray(function(err, result) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json(result);
        }
        db.close();
    });
});

module.exports = router;