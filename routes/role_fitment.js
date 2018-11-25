'use strict';                                   // Strictly follow latest JS standards

// Required Dependencies
var express = require('express');
var router = express.Router();
var sanitize = require('mongo-sanitize');       // To stop NoSQL injections - any req starts with $ will be emitted
var Role = require('../models/role_fitment');     // Profile Model
var Verify = require('./verify');

router.route('/')
    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Role.findOne()
            .exec(function (err, roles) {
                if (err)
                    return next(err);
                res.status(200).json(roles);
            });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        var body = sanitize(req.body);      // NoSQL injection prevention

        if (body.sID.length == 6 && body.sID[0] == 'P' && body.sID[3] == 'N') {
            Role.find({ sID: body.sID })
                .exec(function (err, rec) {
                    if (err)
                        next(err);
                    if (!(rec.length == 0))
                        res.status(501).send({ "message": "Type-ID Exists Already!" });
                    else
                        Role.create(body, function (err, rec) {
                            if (err)
                                return next(err);
                            res.status(200).json(rec);
                        });
                });
        }
        else
            res.status(501).send({ "message": "Please Enter Valid Type-ID !" });

    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {               // Drop Whole Collection

        Role.find()
            .exec(function (err) {
                if (err)
                    next(err);

                var ver = Role.length > 0 ? Role.collection.drop() : false;
                if (ver)
                    res.status(200).send({ "message": "Collection Removed" });
                else
                    res.status(501).send({ "message": "Collection Doesn't Exist" });
            });
    });

router.route('/:pno')
    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Role.findOne({ profile_number: parseInt(sanitize(req.params.pno)) })
            .exec(function (err, roles) {
                if (err)
                    return next(err);
                res.status(200).json(roles);
            });
    });

router.route('/:pno/:section_name')
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        // console.log(req.body);
        const body = req.body;
        const section_name = req['params']['section_name'];

        if (['suitable_work', 'difficult_work'].indexOf(section_name) == -1)
            return res.status(404).json({ success: false, message: "Invalid Section !" });
        else {
            delete body._id;

            const query = { profile_number: parseInt(sanitize(req.params.pno)) };
            switch (section_name) {
                case 'suitable_work':
                    query.suitable_work = { sID: body.sID };
                    break;
                case 'difficult_work':
                    query.difficult_work = { sID: body.sID };
            }

            const proj = section_name == 'suitable_work' ? { 'suitable_work.$': 1 } : { 'difficult_work.$': 1 };

            Role.findOne(query, proj, function (err, data) {
                if (err)
                    return next(err);
                else if (data) {
                    const toSet = section_name == 'suitable_work' ? { 'suitable_work': { $each: [body], $sort: { 'sID': 1 } } } : { 'difficult_work': { $each: [body], $sort: { 'sID': 1 } } };

                    Role.update(query, { $set: body }, { new: true })
                        .exec(function (err, rec) {
                            // console.log(err);
                            if (err)
                                return next(err);
                            return res.status(200).json({ success: true, message: "Successfully Updated !" });
                        });
                }
                else {
                    const toPush = section_name == 'suitable_work' ? { 'suitable_work': { $each: [body], $sort: { 'sID': 1 } } } : { 'difficult_work': { $each: [body], $sort: { 'sID': 1 } } };

                    Role.update({ profile_number: parseInt(sanitize(req.params.pno)) }, { $push: toPush }, { new: true, upsert: true })
                        .exec(function (err, rec) {
                            // console.log(err);
                            if (err)
                                return next(err);
                            return res.status(200).json({ success: true, message: "Successfully Added !" });
                        });
                }
            });


        }

    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        // console.log(req.body);
        const body = req.body;
        const section_name = req['params']['section_name'];

        if (['suitable_work', 'difficult_work'].indexOf(section_name) == -1)
            return res.status(404).json({ success: false, message: "Invalid Section !" });
        else {
            //     const query = section_name == 'suitable_work' ? 'suitable_work.sID' : body.sID
            // } : { 'difficult_work.sID': body.sID };
            const project = section_name == 'suitable_work' ? { 'suitable_work': 1, _id: 0 } : { 'difficult_work': 1, _id: 0 };

            Role.aggregate([
                { $match: { profile_number: parseInt(sanitize(req.params.pno)) } },
                { $project: project },
                { $unwind: '$' + section_name },
                { $group: { _id: null, max: { $max: '$' + section_name } } },
                { $project: { sID: '$max.sID', _id: 0 } }],
                function (err, data) {
                    if (err)
                        return next(err);
                    else {
                        body.sID = data.length == 0 ? 'S01' : (parseInt(data[0].sID.substr(1)) + 1) > 9 ? 'S' + (parseInt(data[0].sID.substr(1)) + 1) : 'S0' + (parseInt(data[0].sID.substr(1)) + 1);
                        delete body._id;

                        const toPush = section_name == 'suitable_work' ? { 'suitable_work': { $each: [body], $sort: { 'sID': 1 } } } : { 'difficult_work': { $each: [body], $sort: { 'sID': 1 } } };

                        Role.update({ profile_number: parseInt(sanitize(req.params.pno)) }, { $push: toPush }, { new: true, upsert: true })
                            .exec(function (err, rec) {
                                // console.log(err);
                                if (err)
                                    return next(err);
                                return res.status(200).json({ success: true, message: "Successfully Added !" });
                            });
                    }
                });
        }

    });

module.exports = router;