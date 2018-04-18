var express = require('express');
var bodyParser = require('body-parser');
var assert = require('assert');

var Verify = require('./verify');
var MCQarray = require('../models/openMCQ');

var quesRouter = express.Router();

quesRouter.use(bodyParser.json());

/* Route '/' */

quesRouter.route('/getAll')
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    MCQarray.find().sort({"qID":1})
        .exec(function (err, mcqs) {
        if (err) next(err);
//		mcqs.sort(function(a, b){return a.qID-b.qID;});
//        console.log(mcqs);
        res.json(mcqs);
    });
});

quesRouter.route('/')
.get(function (req, res, next) {
    MCQarray.find({}, {correct: 0, _id: 0}).sort({"qID":1})
        .exec(function (err, mcqs) {
        if (err) next(err);
//		mcqs.sort(function(a, b){return a.qID-b.qID;});
//        console.log(mcqs);
        res.json(mcqs);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    MCQarray.create(req.body, function (err, mcqs) {
        if (err) throw err;
        //console.log('Heading created!');
        
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end('Added');
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    MCQarray.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

quesRouter.route('/:typeId')
.get(function (req, res, next) {
    MCQarray.findById(req.params.typeId)
        .exec(function (err, mcqs) {
        if (err) next(err);
        res.json(mcqs);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
	//console.log(req.body);
    MCQarray.findByIdAndUpdate(req.params.typeId, {$set: req.body}, {new: true}, function (err, mcqs) {
        if (err) throw err;
		//console.log(mcqs);
        res.json(mcqs);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        MCQarray.findByIdAndRemove(req.params.typeId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

quesRouter.route('/:typeId/keywords')

.get(function (req, res, next) {
    MCQarray.findById(req.params.typeId)
        .populate('keywords.postedBy')
        .exec(function (err, mcqs) {
        if (err) next(err);
        res.json(mcqs.keywords);
    });
})

.post(Verify.verifyOrdinaryUser,function (req, res, next) {
    MCQarray.findById(req.params.typeId, function (err, mcqs) {
        if (err) next(err);
        req.body.postedBy = req.decoded._id;
        mcqs.keywords.push(req.body);
        mcqs.save(function (err, mcqs) {
            if (err) throw err;
            console.log('Updated keywords!');
            res.json(mcqs);
        });
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function (req, res, next) {
    MCQarray.findById(req.params.typeId, function (err, mcqs) {
        if (err) throw err;
        for (var i = (mcqs.keywords.length - 1); i >= 0; i--) {
            mcqs.keywords.id(mcqs.keywords[i]._id).remove();
        }
        mcqs.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all keywords!');
        });
    });
});

quesRouter.route('/:typeId/keywords/:keyId')
.get(Verify.verifyOrdinaryUser,function (req, res, next) {
    MCQarray.findById(req.params.typeId)
        .populate('keywords.postedBy')
        .exec(function (err, mcqs) {
        if (err) next(err);
        res.json(mcqs.keywords.id(req.params.keyId));
    });
})

.put(Verify.verifyOrdinaryUser,function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    MCQarray.findById(req.params.typeId, function (err, mcqs) {
        if (err) next(err);
        mcqs.keywords.id(req.params.keyId).remove();
                req.body.postedBy = req.decoded._id;
        mcqs.keywords.push(req.body);
        mcqs.save(function (err, mcqs) {
            if (err) throw err;
            console.log('Updated keywords!');
            res.json(mcqs);
        });
    });
})

.delete(Verify.verifyOrdinaryUser,function (req, res, next) {
    MCQarray.findById(req.params.typeId, function (err, mcqs) {
        if (mcqs.keywords.id(req.params.keyId).postedBy!= req.decoded._id) {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        mcqs.keywords.id(req.params.keyId).remove();
        mcqs.save(function (err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });
});


module.exports = quesRouter
