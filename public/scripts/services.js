'use strict';

angular.module('idiscover.me')
.constant("baseURL", "")

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])

.factory('authFactory', ['baseURL', '$http', '$resource', '$rootScope', '$localStorage', function(baseURL, $http, $resource, $rootScope, $localStorage){
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    
    function loadUserCredentials() {
        var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
        //if (credentials.username != undefined) {
            useCredentials(credentials);
        //}
    }
 
  function storeUserCredentials(credentials) {
      $localStorage.storeObject(TOKEN_KEY, credentials);
      useCredentials(credentials);
  }
 
  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = credentials.token;
  }
 
  function destroyUserCredentials() {
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = undefined;
    $localStorage.remove(TOKEN_KEY);
  }
     
    authFac.login = function(loginData, whatDoing) {	//	whatDoing: 0-login 1-register
        
        $resource(baseURL + "user/auth/login").save(loginData,
                                                   function(response) {
                                                      storeUserCredentials({username:loginData.username, token: response.token});  
                                                      $rootScope.$broadcast('login:Successful', {whatDoing: whatDoing});
                                                    },
                                                   function(response){
                                                      $rootScope.$broadcast('error:Failure', response.data.message);
                                                      isAuthenticated = false;
                                                    
                                                      var message = '\
                                                        <div class="ngdialog-message">\
                                                        <div><h3>LOGIN UNSUCCESSFUL</h3></div>' +
                                                          '<div><p>' + response.data.err.message + '</p>'+
                                                           '<p>' + response.data.err.name + '</p>'+
                                                            '</div>' +
                                                        '<div class="ngdialog-buttons">\
                                                            <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                                                        </div>';
                                                      
                                                   }

                                                );

    };
    
    authFac.logout = function() {
        $resource(baseURL + "user/auth/logout").get(function(response){});
        destroyUserCredentials();
    };
    
    authFac.register = function(registerData) {
        
        $resource(baseURL + "user/auth/register").save(registerData,
                                                       function(response) {            
                                                          authFac.login({username:registerData.username, password:registerData.password}, 1);
                                                          $rootScope.$broadcast('registration:Successful');
                                                       },
                                                       function(response){
                                                          $rootScope.$broadcast('error:Failure', response.data.message);
                                                          var message = '\
                                                            <div class="ngdialog-message">\
                                                            <div><h3>REGISTRATION UNSUCCESSFUL</h3></div>' +
                                                              '<div><p>' +  response.data.err.message + '</p>'+
                                                                '<p>' + response.data.err.name + '</p>'+
                                                            '</div>' +
                                                            '<div class="ngdialog-buttons">\
                                                                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                                                            </div>';


                                                       }

                                                    );
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };

    loadUserCredentials();
    
    return authFac;
}])

.factory('userFactory', ['baseURL', '$resource', function(baseURL, $resource){
    var userD = {};
    var details = false;
    var content = {};
    var name = {};
    var ques_content = {};
    var profile_content = {};
    
    userD.detailsLoaded = function(){
        return details;
    };
    userD.getName = function(){
        name = $resource(baseURL + 'user/name').get(function(suceess){details = true;}, function(e){details = false;});
        return name;
    };
    userD.getPersonal = function(init){
        content = init;
        content = $resource(baseURL + 'user/personal').get(function(suceess){details = true;}, function(e){details = false;});
        return content;
    };
    userD.getDetails = function(init){
        content = init;
        content = $resource(baseURL + 'user/details').get(function(suceess){details = true;}, function(e){details = false;});
        return content;
    };
    userD.getQuestions = function(init){
        ques_content = init;
        ques_content = $resource(baseURL + 'user/questions').get(function(suceess){details = true;}, function(e){details = false;});
        return ques_content;
    };
    userD.getProfile = function(init){
        profile_content = init;
        profile_content = $resource(baseURL + 'user/profile/getProfile').get(function(suceess){details = true;}, function(e){details = false;});
        return profile_content;
    };
    userD.getUsers = function(init){
        profile_content = init;
        profile_content = $resource(baseURL + 'user/list', null, {'get': {method: 'GET', isArray: true}}).get(function(suceess){details = true;}, function(e){details = false;});
        return profile_content;
    };
    userD.getAnalysis = function(init){
        content = init;
        content = $resource(baseURL + 'user/analysis').get(function(suceess){details = true;}, function(e){details = false;});
        return content;
    };
    userD.getPercentage = function(init){
        profile_content = init;
        profile_content = $resource(baseURL + 'user/completion').get(function(suceess){details = true;}, function(e){details = false;});
        return profile_content;
    };
    userD.saveDetails = function(data){
        return $resource(baseURL + 'user/details').save(data);
    };
    userD.sendAndSaveProfileData = function(data){
        return $resource(baseURL + 'user/profile/insertProfile').save(data);
    };
    
    return userD;
}])

.factory('keywordFactory', ['baseURL', '$resource', function(baseURL, $resource){
    var profileD = {};
    var details = false;
    var content = {};
    var ques_content = {};
    
    profileD.detailsLoaded = function(){
        return details;
    };
    profileD.getProfile = function(tno){
        content = [];
        content = $resource(baseURL + 'keyword/0'+tno, null, {'get': {method: 'GET', isArray: true}}).get(function(suceess){details = true;}, function(e){details = false;});
        return content;
    };
    profileD.updateProfile = function(pno, sno, kno, data){
        return $resource(baseURL + 'keyword/0'+pno+'/0'+sno+'/0'+kno, null, {
            'update': {
                method: 'PUT'
            }
        }).update(data);
    };
    profileD.saveNew = function(data){
        return $resource(baseURL + 'keyword').save(data);
    };
    
    return profileD;
}])

.factory('notiFactory', ['baseURL', '$resource', function(baseURL, $resource){
    var notiD = {};
    var details = false;
    var content = {};
    var ques_content = {};
    
    notiD.detailsLoaded = function(){
        return details;
    };
    notiD.getNoti = function(init){
        content = init;
        content = $resource(baseURL + 'noti', null, {'get': {method: 'GET', isArray: true}}).get(function(suceess){details = true;}, function(e){details = false;});
        return content;
    };
    
    return notiD;
}])

/*.factory('notiFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "noti", null, {
            'update': {
                method: 'PUT'
            }
        });

}])*/
;
