'use strict';                                   // Strictly follow latest JS standards

// Required Dependencies
var express = require('express');
var router = express.Router();
var sanitize = require('mongo-sanitize');       // To stop NoSQL injections - any req starts with $ will be emitted
var Syn = require('../models/profile_synthesis');     // Profile Model
var Verify = require('./verify');

router.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {                  // Give all recommends in ascending order

        Syn.find().sort({ sID: 1 })
            .exec(function (err, recs) {
                if (err)
                    return next(err);
                res.status(200).json(recs);
            });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        // console.log(sanitize(req.body));
        Syn.create(sanitize(req.body), function (err, msg) {
            if (err) return res.status(501).json({ success: false, message: "Error Occured !", error: err });
            else return res.status(200).json({ success: true, message: "Success !", data: msg });
        });
    });

router.route('/:sid')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        const prof_num = sanitize(req.params.sid);

        Syn.find({ sID: new RegExp('P0' + prof_num, 'g') }).sort({ sID: 1 })
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

        Syn.update({ sID: sanitize(req.params.sid) }, { $set: body }, { new: true, upsert: true })
            .exec(function (err, rec) {
                // console.log(err, rec)
                if (err)
                    return next(err);
                // console.log(rec);
                res.status(200).json(rec);
            });
    });

module.exports = router;