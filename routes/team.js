'use strict';                                   // Strictly follow latest JS standards

// Required Dependencies
var express = require('express');
var router = express.Router();
var sanitize = require('mongo-sanitize');       // To stop NoSQL injections - any req starts with $ will be emitted
var TeamList = require('../models/team.js');
var User = require('../models/user.js');
var Verify = require('./verify.js');

router.route('/')
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    TeamList.find()
    .exec(function(err, teams){
        if(err)
            return next(err);
        res.status(200).json(teams);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    var body = sanitize(req.body);      // NoSQL injection prevention
    
	TeamList.find({}, {teamID: true}).sort('teamID')
	.exec(function(err, teams){
        if(err)
            return next(err);
		
		if(teams.length == 0)
			body.teamID = 'T001';
		else{
			var rhs;
			if(parseInt(teams[teams.length-1].teamID[3]) == 9)
				rhs = (parseInt(teams[teams.length-1].teamID[2]) + 1)+'0';
			else if(parseInt(teams[teams.length-1].teamID[3]) < 9)
				rhs = (parseInt(teams[teams.length-1].teamID[2]) ? parseInt(teams[teams.length-1].teamID[2]) : '0')+ '' +(parseInt(teams[teams.length-1].teamID[3]) + 1);
			
			body.teamID = ('T0'+rhs);
		}
		
        body.date = new Date();
		TeamList.create(body, function(err, teams){
			if(err)
				return next(err);
			res.status(200).json(teams);
		});
    });
    
});

router.route('/:id')
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    var body = sanitize(req.body);      // NoSQL injection prevention
	
	for(let k=0; k < body.members.length; k++){
		User.findOne({'username': body.members[k].emailID}, {'_id': 1, 'username': 1})
		.exec(function(er, user){
			if(er)
				return next(er);
			if(!user)
				body.members[k].userID = null;
			else
				body.members[k].userID = user._id;
			return;
		})
		.then(function(){
			if(k == body.members.length-1){
//				console.log(body);
				TeamList.findOneAndUpdate({_id: sanitize(req.params.id)}, {$set: body}, {new: true})
				.exec(function(err, teams){
					if(err)
						return next(err);
					return res.status(200).json({message: "Done"});
				});
			}
		});
		
	}
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
	TeamList.remove({_id: sanitize(req.params.id)}, function(err, fc){
		if(err)
			return next(err);
		res.status(200).json({message: "Removed Successfully !"});
	});
});

module.exports = router;