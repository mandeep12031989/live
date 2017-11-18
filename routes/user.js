'use strict';

var express = require('express');
var router = express.Router();
var sanitize = require('mongo-sanitize');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var child_process = require('child_process');

var User = require('../models/user.js');
var Keyword = require('../models/keyword.js');
var Verify = require('./verify');
var authe = require('../authenticate.js');

router.route('/list')
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    User.find({}).sort('-important_date.registration')
    .exec(function(err, user){
        if(err)
            next(err);        
        res.status(200).json(user);
    });
});

router.route('/')
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    
    User.findOne({_id: id}).sort({'profile.profile_content.keyword_id': 1})
    .exec(function(err, user){
        if(err)
            next(err);
        res.status(200).json(user);
    });
});

router.route('/name')
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    
    User.findOne({_id: id}, {'_id': false, 'firstname': true, 'lastname': true})
    .exec(function(err, user){
        if(err)
            next(err);
        res.status(200).json(user);
    });
});

router.route('/personal')
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    
    User.findOne({_id: id}, {'_id': false, 'important_date': false, 'OauthId': false, 'OauthToken': false, 'password': false, 'password_reset_token': false, 'are_you': false, 'profile': false, 'question': false, 'device_details': false})
    .exec(function(err, user){
        if(err)
            next(err);
        res.status(200).json(user);
    });
});

router.route('/details')
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    
    User.findOne({_id: id}, {'age': true, 'sex': true, 'facilitator_name': true, 'work_details': true})
    .exec(function(err, user){
        if(err)
            next(err);
        res.status(200).json(user);
    });
})
.post(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    
    User.findOneAndUpdate({_id: id}, {$set: req.body}, {new: true})
    .exec(function(err, user){
        if(err)
            return next(err);
        return res.status(200).json({message: "Done"});
    });
});

router.route('/questions')
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    
    User.findOne({_id: id}, {'question': true})
    .exec(function(err, user){
        if(err)
            next(err);
        res.status(200).json(user);
    });
});

//FACILITATOR NAME OR ID
router.route('/candidate/:fac_name')
.get(Verify.verifyOrdinaryUser, Verify.verifyFacilitator, function(req, res, next){
    var fac_name = sanitize(req.params.fac_name);
    
    User.find({'facilitator_name': fac_name}, {'firstname': true, 'lastname': true, 'facilitator_name': true})
    .exec(function(err, user){
        if(err)
            next(err);
        res.status(200).json(user);
    });
});

router.route('/profile/insertProfile')                          // will use req.decoded._id later
.post(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    var body = sanitize(req.body);
    
    //console.log(body);
    if(!(body.profile_number > 0 && body.profile_number < 10))                    //profile_num is string here
        return res.status(501).send({message: "Invalid Request !", success: false});
    
    var pr_num = parseInt(body.profile_number);
    body.profile_number = 'P0' + body.profile_number;
        
    Keyword.find({keyword_id: { $regex: body.profile_number }}/*, {'comment': false, 'mini_descriptions.relate': false}*/).sort({ keyword_id: 1 })
    .exec(function(err, keyword){
        if(err)
            next(err);
        return keyword;
    })
    .then(function(key){
        //console.log(key);
        User.findOne({_id: id})
        .exec(function(err_u, user){
            if(err_u)
               return next(err_u);
            user.profile = {};
            user.profile.profile_number = pr_num;
            user.profile.profile_content = key;
            user.save(function(e, us){
                if(e)
                    return next(e);
                res.status(200).send({message: "success !", success: true});
            });

        });
    });
});

//RESPONSES COULD CACHE HERE, SO TESTING NEEDED LATER, IF IT FAILS THEN WILL USE INDIVDUAL ROUTE OF EACH MODULE - /module1, /module2, /module3
router.route('/profile/insertProfile/module/:m')                          // will use req.decoded._id later
.put(function(req, res, next){
    var body = sanitize(req.body), key;
    
    if(body.profile_num.length!=2 || body._id.length==0)                    //profile_num is string here
        return res.status(501).send({"message": "Invalid Request !"});
    
    var pr_num = parseInt(body.profile_num);
    body.profile_num = 'P' + body.profile_num;
    
    var m = parseInt(sanitize(req.params.m));
    
    if(m == 1){
        Keyword.find({$or:[{keyword_id: { $regex: body.profile_num + "S01" }}, {keyword_id: { $regex: body.profile_num + "S02" }}, {keyword_id: { $regex: body.profile_num + "S03" }}]}, {'section_id': true, 'keyword_id': true, 'mini_descriptions.mini_description_id': true, 'version': true, '_id': false, 'keyword': true, 'linked_keyword': true, 'balancing_description': true, 'mini_descriptions.mini_description': true, 'mini_descriptions.tag': true}).sort({ keyword_id: 1 })
        .exec(function(err, keyword){
            if(err)
                next(err);
            key = keyword;
        });
    }
    else if(m == 2){
        Keyword.find({$or:[{keyword_id: { $regex: body.profile_num + "S04" }}, {keyword_id: { $regex: body.profile_num + "S05" }}, {keyword_id: { $regex: body.profile_num + "S06" }}]}, {'section_id': true, 'keyword_id': true, 'mini_descriptions.mini_description_id': true, 'version': true, '_id': false, 'keyword': true, 'linked_keyword': true, 'balancing_description': true, 'mini_descriptions.mini_description': true, 'mini_descriptions.tag': true}).sort({ keyword_id: 1 })
        .exec(function(err, keyword){
            if(err)
                next(err);
            key = keyword;
        });
    }
    else if(m == 3){
        Keyword.find({$or:[{keyword_id: { $regex: body.profile_num + "S07" }}, {keyword_id: { $regex: body.profile_num + "S08" }}, {keyword_id: { $regex: body.profile_num + "S09" }}]}, {'section_id': true, 'keyword_id': true, 'mini_descriptions.mini_description_id': true, 'version': true, '_id': false, 'keyword': true, 'linked_keyword': true, 'balancing_description': true, 'mini_descriptions.mini_description': true, 'mini_descriptions.tag': true}).sort({ keyword_id: 1 })
        .exec(function(err, keyword){
            if(err)
                next(err);
            key = keyword;
        });
    }
    
    User.findOne({_id: body._id})
    .exec(function(err_u, user){
        if(err_u)
           next(err_u);
        if(!key)
            return res.status(501).send({"message": "Some Error Occured !"});
        
        if(user.profile.profile_content.length == 0 && user.profile.module1 == false && m == 1){
            user.profile.module1 = true;
            user.profile.profile_number = pr_num;
            user.profile.profile_content = key;
            user.save(function(e, us){
                if(e)
                    next(e);
                res.status(200).send({"message": "Success !"});
            });
        }
        else if((user.profile.module1 == true && user.profile.module2 == false && m == 2)||(user.profile.module1 == true && user.profile.module2 == true && user.profile.module3 == false && m == 3)){
            if(m==2)    user.profile.module2 = true;
            else        user.profile.module3 = true;
            user.profile.profile_number = pr_num;
            var i, j=0;
            for(i = user.profile.profile_content.length; j<key.length; i++,j++)
                user.profile.profile_content.push(key[j]);
            user.save(function(e, us){
                if(e)
                    next(e);
                res.status(200).send({"message": "Success !"});
            });
        }
        else
            res.status(501).send({"message": "Some Error Occured !"});
    });
});

router.route('/profile/:id/tag')
.put(function(req, res, next){                  // Sending information in BODY and then comparing tags
    var id = sanitize(req.params.id);
    
    User.findOne({_id: id}).sort({"profile.profile_content.keyword_id":1})
    .exec(function(err, user){
        if(err)
            next(err);
        
        var body = sanitize(req.body);
        var i=0,j=0,c=0, key2 = [];
        
        for(i=0; i < user.profile.profile_content.length; i++){
            for(j=0; j < user.profile.profile_content[i].mini_descriptions.length; j++)
                if(((user.profile.profile_content[i].mini_descriptions[j].tag.company == body.company)&&(body.company == true)) || ((user.profile.profile_content[i].mini_descriptions[j].tag.competency == body.competency)&&(body.competency == true)) ||((user.profile.profile_content[i].mini_descriptions[j].tag.personal == body.personal)&&(body.personal == true)) || ((user.profile.profile_content[i].mini_descriptions[j].tag.professional == body.professional)&&(body.professional == true))){
                    key2[c++] = user.profile.profile_content[i].mini_descriptions[j];                    
                }
        }
        res.status(200).json(key2);
    });
});

router.route('/profile/getProfile')
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    
    User.findOne({_id: id}, {'profile': true})
    .exec(function(err, user){
        if(err)
            next(err);
        res.status(200).json(user);
    });
});

//FINDING ON THE BASIS OF _id
router.route('/profile/getKeyword/:key_id')                         // will use req.decoded._id later
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    var key_id = sanitize(req.params.key_id);
    
    User.findOne({_id: id},{'profile': true}).sort({'profile.profile_content.keyword_id': 1})
    .exec(function(err, user){
        if(err)
            next(err);
        var data = user.profile.profile_content.id(key_id);
        
        res.status(200).json(data);
    });
});

router.route('/profile/getKeyword/:key_id/getMini/:mini_id')                         // will use req.decoded._id later
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    var key_id = sanitize(req.params.key_id);
    var mini_id = sanitize(req.params.mini_id);
    
    User.findOne({_id: id},{'profile': true}).sort({'profile.profile_content.keyword_id': 1})
    .exec(function(err, user){
        if(err)
            next(err);
        var data = user.profile.profile_content.id(key_id).mini_descriptions.id(mini_id);        
        res.status(200).json(data);
    });
});

//FINDING ON THE BASIS OF Section, Keyword or Mini-Description Number
router.route('/profile/:whole_id')                         // will use req.decoded._id later
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    var whole_id = sanitize(req.params.whole_id);
    
    if(whole_id.length != 6 && whole_id.length != 9 && whole_id.length != 12)
        return res.status(501).send({"message":"Invalid Request !"});
    
    User.findOne({_id: id},{'profile': true})
    .exec(function(err, user){
        if(err)
            next(err);
        
        var data = [], c=0, i=0, j=0;
        // searching for particular section's keywords
        if(whole_id.length == 6)
            for(i=0; i<user.profile.profile_content.length; i++){
                if(user.profile.profile_content[i].keyword_id.substr(0,6) == whole_id)
                    data[c++] = user.profile.profile_content[i];
            }
        // searching for section's particular keyword
        else if(whole_id.length == 9){
            for(i=0; i<user.profile.profile_content.length; i++){
                if(user.profile.profile_content[i].keyword_id == whole_id){
                    data = user.profile.profile_content[i];
                    break;
                }
            }
        }
        // searching for keyword's particular mini_desc
        else if(whole_id.length == 12){
            for(i=0; i<user.profile.profile_content.length; i++){
                if(user.profile.profile_content[i].keyword_id.substr(0,9) == whole_id.substr(0,9)){
                    data = user.profile.profile_content[i];
                    for(j=0; j<data.mini_descriptions.length; j++){
                        if(data.mini_descriptions[j].mini_description_id == whole_id){
                            data = data.mini_descriptions[j];
                            j=0;
                            break;
                        }
                    }
                    if(j != 0)
                        return res.status(501).send({"message":"Nothing Found !"});
                    break;
                }
            }
        }
        else
            return res.status(501).send({"message":"Invalid Request !"});
    
        res.status(200).json(data);        
    });
});

router.route('/analysis')
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    var to_send = { dates: [],
                    user: [],
                    variant_profile_num: []
                  };
    var child = child_process.fork(__dirname + '/analysis.js', [], {});
            
    //child.send(user);
    //child.on('message', message => {
    //    res.status(200).json(message);
    //});
    
    User.aggregate([{$group : {_id : "$profile.profile_number", total : {$sum : 1}}}]).sort('_id')
        .exec(function(e, r){
            if(e)
                return next(e);
            //console.log(r);
            to_send.variant_profile_num = r;
            //console.log(sending);
        });
    
    var d = new Date();
    d.setMonth(d.getMonth() - 12);
    d.setDate(0);
    d.setHours(23);
    d.setMinutes(59);
    d.setSeconds(59);
    //console.log(d.toLocaleString());
    User.find({'important_date.registration': {$gt: d}}, {'_id': false, 'important_date.registration': true}).sort('-important_date.registration')
        .exec(function(err, dates){
            if(err) return next(err);
            
            to_send.dates = dates;
        
            User.find({}, {'_id': true, 'are_you': true})
                .exec(function(err, user){
                    if(err) return next(err);
                    
                    to_send.user = user;
                    //console.log(to_send);
                    child.send(to_send);

                    child.on('message', message => {
                        res.status(200).json(message);
                    });
                });
    });
});

router.route('/completion')
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    var id = req.decoded._id;
    
    User.findOne({_id: id}, {'question': true, 'profile': true})
    .exec(function(err, user){
        if(err)
            next(err);
        
        var per = 0;
        if(user.question.RQ1 != '' && user.question.RQ1 != undefined)
            per += 4;
        if(user.question.RQ2 != '' && user.question.RQ2 != undefined)
            per += 5;
        if(user.question.RQ3 != '' && user.question.RQ3 != undefined)
            per += 5;
        if(user.feedback.submitted)
            per += 14;
        //console.log(user.question.RQ1 + ' | ' + user.question.RQ2 + ' | ' + user.question.RQ3 + ' | ' + user.feedback.submitted + ' = ' + per);
        
        // 14 % for questionnaire
		var que_filled = false;
		if(user.question.questionnaire.length != 0){
			for(var q = 0; q < 36; q++){
				//console.log(q);
				if(parseInt(user.question.questionnaire[q]) != 0){
					per += 14;
					que_filled = true;
					break;
				}
			}
		}
        
        if(user.profile.profile_content.length){
            var sec1 = true, sec2 = true, sec3 = true, sec4 = true;
            for(var k = 0; k < user.profile.profile_content.length; k++){
                for(var p = 0; p < user.profile.profile_content[k].mini_descriptions.length; p++){
                    
                    if(user.profile.profile_content[k].keyword_id[5] == 1){
                        if(!user.profile.profile_content[k].mini_descriptions[p].relate)
                            sec1 = false;
                        continue;
                    }
                    else if(user.profile.profile_content[k].keyword_id[5] == 2){
                        if(!user.profile.profile_content[k].mini_descriptions[p].relate)
                            sec2 = false;
                        continue;
                    }
                    else if(user.profile.profile_content[k].keyword_id[5] == 3){
                        if(!user.profile.profile_content[k].mini_descriptions[p].relate)
                            sec3 = false;
                        continue;
                    }
                    else if(user.profile.profile_content[k].keyword_id[5] == 4){
                        if(!user.profile.profile_content[k].mini_descriptions[p].relate)
                            sec4 = false;
                        continue;
                    }
                }
            }
            if(sec1)
                per += 14;
            if(sec2)
                per += 15;
            if(sec3)
                per += 14;
            if(sec4)
                per += 15;
        }
		
		//questionnaire left
        
        var final_obj = {
            percentage: per,
            reflective_filled: user.question.RQ1!='' && user.question.RQ1 != undefined && user.question.RQ2!='' && user.question.RQ2 != undefined && user.question.RQ3!='' && user.question.RQ3 != undefined,
            questionnaire_filled: que_filled,
            profile_filled: sec1 && sec2 && sec3 && sec4
        };
        //console.log(sec1 + ' | ' + sec2 + ' | ' + sec3 + ' | ' + sec4 + ' = ' + per);
        res.status(200).json(final_obj);
    });
})
;

router.route('/resetpsw/:email')                            // Client Side Needed
.post(function(req, res, next) {
    User.findOne({ username: sanitize(req.params.email) })
        .exec(function(err, user) {
		if (err) throw err; // Throw error if cannot connect
		if (!user) {
            return res.status(501).json({ success: false, message: 'Username was not found' }); // Return error if username is not found in database
        }
        
        //MAIL CONTENT HERE
					
        user.save(function (err,user) {
            if(err)
                next(err)
            console.log('Updated token!');
            return res.status(200).json({ success: true, message: 'Token Created !' });
        });
			
    });
});

router.route('/resetpsw2/:token')                            // Client Side Needed
.post(function(req, res, next) {
    User.findOne({ resettoken: req.params.token })
        .exec(function(err, user) {
        
            if(err) throw err; // Throw err if cannot connect
            
            var token = sanitize(req.params.token); // Save user's token from parameters to variable
			console.log('1 success');
            // Function to verify token
			jwt.verify(token, "56341-91236-01321-42316", function(err, decoded) {
			     console.log('2 success');
                if (err) {
                    console.log(err);
					res.json({ success: false, message: 'Password link has expired' }); // Token has expired or is invalid
				}
                else if (!user) {
						res.json({ success: false, message: 'Password link has expired' }); // Token is valid but not no user has that token anymore
                      console.log('3 success');
                }
                else {//PSW START
                        //user.password = "123456"; 
				        user.resettoken = false;  
                    
					console.log('password: ' + user.password + ' => ' + req.body.password + ' \nand the user is: ' + user.username);
                    user.password = req.body.password;
                    user.save(function (err,user) {
                        if (err) {
                            res.json({ success: false, message: err }); // Return error if cannot connect
                        }
                        else{console.log('4 success');
                   //begin
						//mail content
                             //END
                            
                            console.log('Updated psw!');
                            res.json(user);                            
                        }
                    });
				}//PSW OVER
              console.log('5 success');
			
            });
		});
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function(err, res){
    //console.log(res);
	
	var tkn = authe.makeToken();
    //console.log("THIS IS TOKEN: "+tkn);
    res.redirect('http://portal-idiscover.herokuapp.com/#/oauth/google/'+tkn);
});

router.route('/auth/register')
.post(function(req, res, next) {
    var body = sanitize(req.body);
    
    if(body.username.length==0)
        return res.status(501).json({message: 'Enter Valid Username!'});
    
    User.findOne({ username: body.username })
    .exec(function(err, user) {
        if (err)
            return res.status(500).send({"message": err});
        
        if(!user){
            /*body.firstname = body.firstname.toLowerCase();
            body.firstname = body.firstname.charAt(0).toUpperCase() + body.firstname.slice(1);
            body.lastname = body.lastname.toLowerCase();
            body.lastname = body.lastname.charAt(0).toUpperCase() + body.lastname.slice(1);*/
            
            var user = new User(body);

            user.save(function(err,user) {
                return res.status(200).json({message: 'Registration Successful!'});
            });   
        }        
        else
            return res.status(501).json({message: 'User Already Exists!'});
    });    
});

router.route('/auth/login')
.post(function(req, res, next) {  
    var body = sanitize(req.body);
    
    User.findOne({ username: body.username }, function(err, user) {      
        if(err)
            return next(err);

        if(!user)
            return res.status(501).json({ message: 'Incorrect username !' });

        user.comparePassword(body.password, function(err, isMatch) {
            if (isMatch) {
                req.logIn(user, function(err) {
                    if (err)
                        return res.status(500).send({ "message": 'Could not log in user !'+err });
                    
                    var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.are_you.admin, "facilitator":user.are_you.facilitator});
                    res.status(200).json({ "message": 'Login successful !', "success": true, "token": token });
                });
                  
                  
            }
            else
                return res.status(501).json({ "message": 'Incorrect password !' });              
        });
    });    
});

router.get('/auth/logout', Verify.verifyOrdinaryUser, function(req, res) {
    req.logout();
    res.status(200).send({"message": 'Bye !', "success": true});
});

module.exports = router;