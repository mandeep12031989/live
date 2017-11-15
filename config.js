'use strict';

module.exports = {
    "development":{
        'secretKey': '7HE91-QM30X-ZYKS5-8G8HA-BCW0J-PDN2C',       
        'mongoUrl' : 'mongodb://lavish:idiscoverdb@ds129143.mlab.com:29143/testing-new',
        'googleAuth' : {
            'clientID'      : '437438716282-p9n43oupbjbm6r2bt8lqap95ct6rgfvk.apps.googleusercontent.com',
            'clientSecret'  : '416_T-yaa2TK6j1qw4PSS0Dg',
            'callbackURL'   : 'http://localhost:3000/users/auth/google/callback'
        }
    },
    "production":{
        'secretKey': '7HE91-QM30X-ZYKS5-8G8HA-BCW0J-PDN2C',
        'mongoUrl' : 'mongodb://lavish:idiscoverdb@ds129143.mlab.com:29143/testing-new',
        'googleAuth' : {
            'clientID'      : '437438716282-p9n43oupbjbm6r2bt8lqap95ct6rgfvk.apps.googleusercontent.com',
            'clientSecret'  : '416_T-yaa2TK6j1qw4PSS0Dg',
            'callbackURL'   : 'http://localhost:3000/users/auth/google/callback'
        }
    }
};
