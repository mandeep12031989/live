'use strict';                                   // Strictly follow latest JS standards

// Required Dependencies
var express = require('express');
var router = express.Router();
var sanitize = require('mongo-sanitize');       // To stop NoSQL injections - any req starts with $ will be emitted
var Ranks = require('../models/rank_strengths');     // Profile Model
var Verify = require('./verify');

router.route('/')
    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {                  // Give all recommends in ascending order

        Ranks.find().sort({ "sID": 1 })
            .exec(function (err, statements) {
                if (err)
                    return next(err);
                res.status(200).json(statements);
            });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {                // Store recommend with extra-ordinary conditions
        //checking 3 things: 1=>checking respective length(s), 2=>checking whether sID and section_id representing same profile number-section number pair or not, 3=> sID with 7th index 'K'

        var body = sanitize(req.body);      // NoSQL injection prevention

        Ranks.find({ sID: body.sID })
            .exec(function (err, rec) {
                if (err)
                    next(err);
                if (rec)
                    res.status(501).send({ "message": "Type-ID Exists Already!" });
                else
                    Ranks.create(body, function (err, rec) {
                        if (err)
                            return next(err);
                        res.status(200).json(rec);
                    });
            });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {               // Drop Whole Collection

        Ranks.find()
            .exec(function (err) {
                if (err)
                    next(err);

                var ver = Ranks.length > 0 ? Ranks.collection.drop() : false;
                if (ver)
                    res.status(200).send({ "message": "Collection Removed" });
                else
                    res.status(501).send({ "message": "Collection Doesn't Exist" });
            });
    });

router.route('/fetchKeywordsOnly')
    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {                  // Give all recommends in ascending order

        Ranks.find({}, { _id: 0, keyword: 1 }).sort({ "sID": 1 })
            .exec(function (err, statements) {
                if (err)
                    return next(err);
                res.status(200).json(statements.map(item => item['keyword']));
            });
    });

router.route('/:sid')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        const prof_num = sanitize(req.params.sid);

        Ranks.findOne({ sID: prof_num }).sort({ sID: 1 })
            .exec(function (err, recs) {
                if (err)
                    return next(err);
                res.status(200).json(recs);
            });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        const body = sanitize(req.body);
        delete body['__v'];
        // console.log(body, sanitize(req.params.sid));

        Ranks.update({ sID: sanitize(req.params.sid) }, { $set: body }, { new: true, upsert: true })
            .exec(function (err, rec) {
                // console.log(err, rec)
                if (err)
                    return next(err);
                // console.log(rec);
                res.status(200).json(rec);
            });
    });

module.exports = router;