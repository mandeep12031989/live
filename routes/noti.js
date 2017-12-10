'use strict';                                   // Strictly follow latest JS standards

// Required Dependencies
var express = require('express');
var router = express.Router();
var sanitize = require('mongo-sanitize');       // To stop NoSQL injections - any req starts with $ will be emitted
var Noti = require('../models/noti.js');
var User = require('../models/user.js');
var Verify = require('./verify.js');

router.route('/fac_noti')
.get(Verify.verifyOrdinaryUser, Verify.verifyFacilitator, function(req, res, next){                  // Give all keywords in ascending order
    
	User.findOne({_id: req.decoded._id}, {firstname: true, lastname: true})
		.exec(function(e, f){
			Noti.find({facilitator_name: f.firstname + ' ' + f.lastname}).sort('-date').limit(50)
				.exec(function(err, noti){
					if(err)
						next(err);
					res.status(200).json(noti);
				});
		});
});

router.route('/')
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){                  // Give all keywords in ascending order
    
    Noti.find().sort('-date').limit(50)
    .exec(function(err, noti){
        if(err)
            next(err);
        res.status(200).json(noti);
    });
})

.post(Verify.verifyOrdinaryUser, function(req, res, next){
    var body = sanitize(req.body);      // NoSQL injection prevention
    
    body.date = new Date();
    Noti.create(body, function(err, noti){
        if(err)
            next(err);
        res.status(200).json(noti);
    });
});

router.route('/:id')
.put(Verify.verifyOrdinaryUser, Verify.verifyFacilitator, function(req, res, next){
    var body = sanitize(req.body);      // NoSQL injection prevention
    
    Noti.findOneAndUpdate({_id: sanitize(req.params.id)}, {$set: req.body}, {new: true})
    .exec(function(err, noti){
        if(err)
            return next(err);
        return res.status(200).json({message: "Done"});
    });

});

module.exports = router;