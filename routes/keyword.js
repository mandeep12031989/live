'use strict';                                   // Strictly follow latest JS standards

// Required Dependencies
var express = require('express');
var router = express.Router();
var sanitize = require('mongo-sanitize');       // To stop NoSQL injections - any req starts with $ will be emitted
var Keyword = require('../models/keyword');     // Profile Model
var Verify = require('./verify');

router.route('/')
    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {                  // Give all keywords in ascending order

        Keyword.find().sort({ "keyword_id": 1 })
            .exec(function (err, keyword) {
                if (err)
                    next(err);
                res.status(200).json(keyword);
            });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {                 // Store keyword with extra-ordinary conditions
        //checking 3 things: 1=>checking respective length(s), 2=>checking whether keyword_id and section_id representing same profile number-section number pair or not, 3=> keyword_id with 7th index 'K'

        var body = sanitize(req.body);      // NoSQL injection prevention

        if (body.section_id.length == 6 && body.keyword_id.length == 9 && body.keyword_id[0] == 'P' && body.keyword_id[3] == 'S' && body.keyword_id[6] == 'K' && (body.section_id == body.keyword_id.substr(0, 6))) {
            Keyword.find({ keyword_id: body.keyword_id })
                .exec(function (err, key) {
                    if (err)
                        next(err);
                    if (!(key.length == 0))
                        res.status(501).send({ "message": "Keyword ID Exists Already!" });
                    else
                        Keyword.create(body, function (err, keyword) {
                            if (err)
                                next(err);
                            res.status(200).json(keyword);
                        });
                });
        }
        else
            res.status(501).send({ "message": "Please Enter Valid Section ID-Keyword ID Pair !" });

    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {               // Drop Whole Collection

        Keyword.find()
            .exec(function (err, keyword) {
                if (err)
                    next(err);

                var ver = keyword.length > 0 ? Keyword.collection.drop() : false;
                if (ver)
                    res.status(200).send({ "message": "Collection Removed" });
                else
                    res.status(501).send({ "message": "Collection Doesn't Exist" });
            });
    });

router.route('/tag')
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {                  // Sending information in BODY and then comparing tags

        Keyword.find().sort({ "keyword_id": 1 })
            .exec(function (err, keyword) {
                if (err)
                    next(err);

                var body = sanitize(req.body);
                var i = 0, j = 0, c = 0, key2 = [];

                for (i = 0; i < keyword.length; i++) {
                    for (j = 0; j < keyword[i].mini_descriptions.length; j++)
                        if (((keyword[i].mini_descriptions[j].tag.company == body.company) && (body.company == true)) || ((keyword[i].mini_descriptions[j].tag.competency == body.competency) && (body.competency == true)) || ((keyword[i].mini_descriptions[j].tag.personal == body.personal) && (body.personal == true)) || ((keyword[i].mini_descriptions[j].tag.professional == body.professional) && (body.professional == true))) {
                            key2[c++] = keyword[i].mini_descriptions[j];
                        }
                }
                res.status(200).json(key2);
            });
    });

router.route('/getLess/:profile_num')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        var profile_num = 'P' + sanitize(req.params.profile_num);     // NoSQL injection prevention

        Keyword.find({ keyword_id: { $regex: profile_num } }, { '_id': false, 'keyword_id': true, 'keyword': true, 'mini_descriptions.mini_description_id': true, 'mini_descriptions.mini_description': true }).sort('keyword_id')
            .exec(function (err, keyword) {
                if (err)
                    return next(err);

                return res.status(200).json(keyword);
            });
    });

router.route('/:profile_num')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        var profile_num = 'P' + sanitize(req.params.profile_num);     // NoSQL injection prevention

        Keyword.find({ keyword_id: { $regex: profile_num } }, { '_id': false, 'mini_descriptions.relate': false }).sort('keyword_id')
            .exec(function (err, keyword) {
                if (err)
                    return next(err);

                return res.status(200).json(keyword);
            });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        var profile_num = 'P' + sanitize(req.params.profile_num);     // NoSQL injection prevention

        Keyword.findOneAndRemove({ keyword_id: { $regex: profile_num } })
            .exec(function (err, keyword) {
                if (err)
                    next(err);

                res.status(200).send({ "message": "Removed" });
            });
    });

router.route('/:profile_num/:section_num')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        var num = 'P' + sanitize(req.params.profile_num) + 'S' + sanitize(req.params.section_num);     // NoSQL injection prevention

        Keyword.find({ keyword_id: { $regex: num } })
            .exec(function (err, keyword) {
                if (err)
                    next(err);
                res.status(200).json(keyword);
            });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        var num = 'P' + sanitize(req.params.profile_num) + 'S' + sanitize(req.params.section_num);     // NoSQL injection prevention

        Keyword.findOneAndRemove({ keyword_id: { $regex: num } })
            .exec(function (err, keyword) {
                if (err)
                    next(err);

                res.status(200).send({ "message": "Removed" });
            });
    });

router.route('/:profile_num/:section_num/:keyword_num')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        var num = 'P' + sanitize(req.params.profile_num) + 'S' + sanitize(req.params.section_num) + 'K' + sanitize(req.params.keyword_num);       // NoSQL injection prevention

        Keyword.find({ keyword_id: { $regex: num } })
            .exec(function (err, keyword) {
                if (err)
                    next(err);
                res.status(200).json(keyword);
            });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        var num = 'P' + sanitize(req.params.profile_num) + 'S' + sanitize(req.params.section_num) + 'K' + sanitize(req.params.keyword_num);       // NoSQL injection prevention

        Keyword.findOneAndUpdate({ keyword_id: { $regex: num } }, { $set: sanitize(req.body) }, { new: true })
            .exec(function (err, keyword) {
                if (err)
                    return next(err);

                return res.status(200).json(keyword);
            });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        var num = 'P' + sanitize(req.params.profile_num) + 'S' + sanitize(req.params.section_num) + 'K' + sanitize(req.params.keyword_num);       // NoSQL injection prevention

        if (num.length == 9 && num[0] == 'P' && num[3] == 'S' && num[6] == 'K') {
            Keyword.find({ keyword_id: num })
                .exec(function (err, key) {
                    if (err)
                        next(err);
                    if (!(key.length == 0))
                        res.status(501).send({ "message": "Keyword ID Exists Already!" });
                    else {
                        var body = sanitize(req.body);
                        body.keyword_id = num;
                        body.section_id = num.substr(0, 6);
                        Keyword.create(body, function (err, keyword) {
                            if (err)
                                next(err);
                            res.status(200).json(keyword);
                        });
                    }
                });
        }
        else
            res.status(501).send({ "message": "Please Enter Valid Section ID-Keyword ID Pair !" });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        var num = 'P' + sanitize(req.params.profile_num) + 'S' + sanitize(req.params.section_num) + 'K' + sanitize(req.params.keyword_num);     // NoSQL injection prevention

        Keyword.findOneAndRemove({ keyword_id: { $regex: num } })
            .exec(function (err, keyword) {
                if (err)
                    next(err);

                res.status(200).send({ "message": "Removed" });
            });
    });

router.route('/:profile_num/:section_num/:keyword_num/mini')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        var num = 'P' + sanitize(req.params.profile_num) + 'S' + sanitize(req.params.section_num) + 'K' + sanitize(req.params.keyword_num);       // NoSQL injection prevention

        Keyword.find({ keyword_id: { $regex: num } }, { 'mini_descriptions': true })
            .exec(function (err, keyword) {
                if (err)
                    next(err);
                res.status(200).json(keyword);
            });
    });

router.route('/:profile_num/:section_num/:keyword_num/mini/:mini_id')
    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        var num = 'P' + sanitize(req.params.profile_num) + 'S' + sanitize(req.params.section_num) + 'K' + sanitize(req.params.keyword_num);       // NoSQL injection prevention

        Keyword.findOne({ keyword_id: { $regex: num } }, { 'mini_descriptions': true })
            .exec(function (err, keyword) {
                if (err)
                    next(err);
                res.json(keyword.mini_descriptions.id(sanitize(req.params.mini_id)));
            });
    });

router.route('/miniByAssessor')
    .post(Verify.verifyOrdinaryUser, Verify.verifyFacilitator, function (req, res, next) {
        var body = sanitize(req.body.mini_descriptions);
        // console.log(body);

        Keyword.findOne({ keyword_id: { $regex: body.mini_description_id.substr(0, 6) }, keyword: sanitize(req.body.keyword) }, { keyword: true, mini_descriptions: true })
            .exec(function (err, keyword) {
                if (err) {
                    res.status(401).json({ success: false, message: err });
                    return;
                }
                else if (keyword) {
                    var max = keyword.mini_descriptions[0].mini_description_id;

                    keyword.mini_descriptions.forEach(function (mini, ind) {
                        if (mini.mini_description_id > max) {
                            max = mini.mini_description_id;
                        }
                    });

                    max = max.substr(0, 11) + parseInt(parseInt(max[11]) + 1);
                    body.mini_description_id = max;
                    keyword.mini_descriptions.push(body);
                    keyword.save(function (er, suc) {
                        if (er) {
                            res.json({ success: false, message: er });
                            return;
                        }
                        // console.log(suc);
                        res.status(200).json({ success: true, message: 'Mini-Description added in Keyword \'' + keyword.keyword + '\' !' });
                    });
                }
                else {
                    res.status(200).json({ success: false, message: 'Keyword Not Found, Kindly Add Keyword First !' });
                }
            });
    });

router.route('/keyByAssessor')
    .post(Verify.verifyOrdinaryUser, Verify.verifyFacilitator, function (req, res, next) {
        var body = sanitize(req.body);
        // console.log(body);

        Keyword.findOne({ keyword: body.keyword, keyword_id: { $regex: body.keyword_id.substr(0, 6) } }, function (errr, key) {
            // console.log(errr);
            if (errr) {
                return res.status(401).json({ success: false, message: errr });
            }
            else if (key) {
                return res.status(200).json({ success: true, message: "Already Exists !" });
            }
            else
                Keyword.aggregate([
                    { $match: { keyword_id: { $regex: body.keyword_id.substr(0, 6) } } },
                    { $group: { _id: null, max: { $max: '$keyword_id' } } }
                ], function (err, data) {
                    if (err) {
                        res.status(401).json({ success: false, message: err });
                        return;
                    }
                    // console.log(data);
                    body.keyword_id = data[0].max;
                    if (body.keyword_id[8] == '9')
                        body.keyword_id = body.keyword_id.substr(0, 7) + parseInt(parseInt(body.keyword_id.substr(8, 2)) + 1);
                    else
                        body.keyword_id = body.keyword_id.substr(0, 7) + '0' + parseInt(parseInt(body.keyword_id.substr(8, 2)) + 1);

                    body.linked_keyword = '';
                    body.section_id = body.keyword_id.substr(0, 6);

                    Keyword.create(body, function (er, suc) {
                        if (er) {
                            res.status(401).json({ success: false, message: er });
                            return;
                        }
                        res.status(200).json({ success: true, message: 'Keyword Added !' });
                    });

                });
        });

    });

module.exports = router;