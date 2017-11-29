var nodemailer = require("nodemailer");
var express = require('express');
var app = express();

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
	service: 'Gmail',
    auth: {
        user: "info@idiscover.me",
        pass: "idiscover123"
    }
});

//var smtpTransport = nodemailer.createTransport('smtps://info@idiscover.me:idiscover123');

var mailOptions, link, token;

/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

exports.lost_details = function(data, callback){
	//console.log(data);
    
    link = "http://portal-idiscover.herokuapp.com/#/reset/" + data.username + '/' +data.token;
	//console.log(link);
	
    mailOptions = {
        to : data.username,
        subject : "iDiscover.me | Request for Password Change",
        html : 'Hello,<br> Please Click on the link to change your password.<br><a href='+link+'>Click Here to Change Your Password</a>'
    };
    //console.log(mailOptions);
	
    smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
			//console.log(error);
			callback(false);
		}
		else{
			//console.log("Message sent: ");
			//console.log(response);
			callback(true);
		}
	});
};
//console.log(module.exports);
/*--------------------Routing Over----------------------------*/