/**
 * Created by agescura on 4/11/15.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var OpenDataSchema = require('../models/OpenDataSchema');

/* GET structure list page. */
router.get('/', function(req, res, next) {
    OpenDataSchema.find({}, function(err, schemas) {
        if (err) throw err;
        res.render('structures/index', { structures: schemas});
    });
});

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}

/* GET :id structure page. */
router.get('/:id', function(req, res, next) {
    OpenDataSchema.find({ 'name' : req.params.id }, function(err, schema) {
        if (err) throw err;
        res.render('structures/structure', { structure: schema[0]});
    });
});

router.post('/create', function (req, res, next) {

    var newOpenDataSchema = new OpenDataSchema({
        name        : req.body.name,
        description : req.body.description,
        contact     : req.body.contact,
        mySchema    :{}
    });

    newOpenDataSchema.center.lat = req.body.lat;
    newOpenDataSchema.center.lng = req.body.lng;
    newOpenDataSchema.center.zoom = req.body.zoom;

    newOpenDataSchema.save(function(err) {
        if (err) throw err;
        res.redirect('/structures');
    });
});

router.post('/:name/create', function (req, res, next) {
    var name = req.body.name;
    var type = req.body.type;
    var description = req.body.description;
    var required = req.body.required;
    if (required == 'on') { required = true; }
    else { required = false; }

    keyvalue = {};
    keyvalue[name] = {};
    keyvalue[name]["type"] = type;
    keyvalue[name]["required"] = required;
    keyvalue[name]["description"] = description;

    OpenDataSchema.update({'name': req.params.name}, {$addToSet: { "fields" : keyvalue }}, function(err) {
        if (err) throw err;
        res.redirect('/structures/' + req.params.name);
    });
});

router.get('/:name/:key/delete', function (req, res, next) {
    var key = req.params.key;
    keyvalue = {};
    keyvalue[key] = 1;

    OpenDataSchema.update({'name': req.params.name}, {$pop:  { "fields": keyvalue}}, function(err) {
        if (err) throw err;
        res.redirect('/structures/' + req.params.name);
    });
});

router.get('/:name/delete', function (req, res, next) {
    OpenDataSchema.remove({'name': req.params.name}, function(err) {
        if (err) throw err;
        res.redirect('/structures/');
    });
});

router.post('/:name/import', function (req, res, next) {
    var url = req.body.url;
    console.log(url);

    var request = require("request");
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            OpenDataSchema.find({ 'name' : req.params.name }, function(err, schema) {
                if (err) throw err;
                // check if params is correct
                console.log(schema[0].fields);
                console.log(body.content[0]);

                // if true
                var importDataset = new mongoose.Schema({
                }, { strict: false});

                var importD = mongoose.model(req.params.name, importDataset);

                for (var i=0; i < body.content.length; i++) {
                    var value = body.content[i];
                    delete value._id;
                    delete value.__v;

                    var thing = new importD( value );
                    thing.save(function (err) {
                        if (err) console.log(err);
                        console.log('good');
                    });
                }
            });
        }
    });

    res.redirect('/structures/' + req.params.name);
});

module.exports = router;