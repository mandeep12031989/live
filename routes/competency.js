'use strict';                                   // Strictly follow latest JS standards

// Required Dependencies
var express = require('express');
var router = express.Router();
var sanitize = require('mongo-sanitize');       // To stop NoSQL injections - any req starts with $ will be emitted
var Comps = require('../models/competency');     // Profile Model
var Verify = require('./verify');

router.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {                  // Give all recommends in ascending order

        Comps.find().sort({ "competency_id": 1 })
            .exec(function (err, recs) {
                if (err)
                    return next(err);
                res.status(200).json(recs);
            });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {                  // Give all recommends in ascending order
        // console.log(sanitize(req.body));
        Comps.create(sanitize(req.body), function (err, msg) {
            if (err) return res.status(501).json({ success: false, message: "Error Occured !", error: err });
            else return res.status(200).json({ success: true, message: "Success !", data: msg });
        });
    });

router.route('/:compId')
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        const body = sanitize(req.body);
        // console.log(body);

        Comps.findOneAndUpdate({ competency_id: sanitize(req.params.compId) }, { $set: body }, { new: true })
            .exec(function (err, rec) {
                if (err)
                    return next(err);
                // console.log(rec);
                res.status(200).json(rec);
            });
    });

module.exports = router;