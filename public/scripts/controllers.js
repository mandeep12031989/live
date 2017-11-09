'use strict';

angular.module('idiscover.me')

.controller('headerController', ['$scope', '$state', 'userFactory', 'authFactory', function ($scope, $state, userFactory, authFactory) {
	$scope.user = userFactory.getName();
	
	$scope.doLogout = function(){
        authFactory.logout();
        $state.go('login', {});
    };
}])

.controller('loginController', ['$scope', '$rootScope', '$state', 'deviceDetector', 'userFactory', 'authFactory', function ($scope, $rootScope, $state, deviceDetector, userFactory, authFactory) {
    $scope.loginData = {};
    $scope.login_button = true;
    
    $scope.doLogin = function() {
        $scope.login_button = false;
        authFactory.login($scope.loginData);
    };
    
    $scope.percent = {};
    
    $scope.$watch('percent', function(n, o){
        if(n!=o){
            if(n.reflective_filled){
                if(!n.questionnaire_filled){
                    $state.go('questionnaire', {});
                }
                else
                    $state.go('dashboard', {});
            }
            else
                $state.go('details', {});
        }
    }, true);   //true for deep comparison
    
    $rootScope.$on('login:Successful', function (events, args) {
		if(args.whatDoing == 0)
			$scope.browse = {   device_details: deviceDetector,
								important_date: {
									last_login: new Date
								}
							};
		else if(args.whatDoing == 1)
			$scope.browse = {   device_details: deviceDetector,
								important_date: {
									last_login: new Date,
									registration: new Date
								}
							};

        userFactory.saveDetails($scope.browse);     //when succefully logged-in
        
        $scope.percent = userFactory.getPercentage($scope.percent);
        
        //$state.go('details', {});
    });
    $rootScope.$on('error:Failure', function (event, data) {
        $scope.login_button = true;
        $scope.message = data;
    });
}])

.controller('registerController', ['$scope', '$rootScope', '$state', 'deviceDetector', 'authFactory', function ($scope, $rootScope, $state, deviceDetector, authFactory) {
    $scope.registration = {};
    $scope.register_button = true;
    
    $scope.match = true;
    
    $scope.doRegister = function() {
        $scope.registration.important_date = { registration: new Date, last_login: new Date};
        $scope.registration.device_details = deviceDetector;
        
        if($scope.registration.password == $scope.registration.password2)
            $scope.match = true;
        else
            $scope.match = false;
        
        if($scope.match == true){
            $scope.register_button = false;
            authFactory.register($scope.registration);
        }
    };
    
    $rootScope.$on('registration:Successful', function () {        
        $state.go('details', {});
    });
    $rootScope.$on('error:Failure', function (event, data) {
        $scope.register_button = true;
        $scope.message = data;
    });
}])

.controller('myPersonalController', ['$scope', '$state', 'userFactory', function ($scope, $state, userFactory) {
    $scope.loading = true;
    
    $scope.personalDetails = {};
    $scope.personalDetails = userFactory.getPersonal($scope.personalDetails);
    $scope.$watch('personalDetails', function(n, o){
        if(n!=o)
            $scope.loading = false;
    }, true);   //true for deep comparison
    
    $scope.proceed = function(){
        $scope.success = 0;
        $scope.success = userFactory.saveDetails($scope.personalDetails);
        $scope.$watch('success', function(n, o){
            if(n!=o)
                $state.go('dashboard', {});
        }, true);   //true for deep comparison
    }
}])

.controller('detailsController', ['$scope', '$state', 'userFactory', function ($scope, $state, userFactory) {
    $scope.loading = true;
    
    $scope.userDetails = {};
    $scope.userDetails = userFactory.getDetails($scope.userDetails);
    $scope.$watch('userDetails', function(n, o){
        if(n!=o)
            $scope.loading = false;
    }, true);   //true for deep comparison
    
    $scope.proceed = function(){
        $scope.success = 0;
        $scope.success = userFactory.saveDetails($scope.userDetails);
        $scope.$watch('success', function(n, o){
            if(n!=o)
                $state.go('process-steps', {});
        }, true);   //true for deep comparison
    }
}])

.controller('processController', ['$scope', '$state', 'userFactory', function ($scope, $state, userFactory) {
    $scope.RQ_num = 1;
    $scope.loading = true;
    
    $scope.next_RQ = function(){
        if($scope.RQ_num != 3)
            $scope.RQ_num++;
    };
    
    $scope.prev_RQ = function(){
        if($scope.RQ_num != 1)
            $scope.RQ_num--;
    };
    
    $scope.quesDetails = {};
    $scope.quesDetails = userFactory.getQuestions($scope.quesDetails);
    $scope.$watch('quesDetails', function(n, o){
        if(n!=o)
            $scope.loading = false;
    }, true);   //true for deep comparison
    
    $scope.save_ques = function(num){
        $scope.success = 0;
        $scope.success = userFactory.saveDetails($scope.quesDetails);
        
        if(num == 2){
            $scope.$watch('success', function(n, o){
                if(n!=o)
                    $state.go('dashboard', {});
            }, true);   //true for deep comparison
        }
    };
}])

.controller('questController', ['$scope', '$state', 'userFactory', function ($scope, $state, userFactory) {
    
}])

.controller('dashboardController', ['$scope', '$state', 'userFactory', function ($scope, $state, userFactory) {
    $scope.percent = {};
    $scope.loading = true;
    
    $scope.percent = userFactory.getPercentage($scope.percent);
    
    $scope.$watch('percent', function(n, o){
        if(n!=o)
            $scope.loading = false;
    }, true);   //true for deep comparison
}])

.controller('selectController', ['$scope', '$state', 'keywordFactory', 'userFactory', function ($scope, $state, keywordFactory, userFactory) {
    $scope.profile_content = {};
    $scope.type_number = 0;
    
    $scope.submitType = function(){
        //keywordFactory.getProfile($scope.type_number).$promise.then(function(p){
            $scope.profile_content = {  profile_number: parseInt($scope.type_number)
                                     };
            $scope.success = 0;
            $scope.success = userFactory.sendAndSaveProfileData($scope.profile_content);
            $scope.$watch('success', function(n, o){
                if(n!=o){
                    if(n.success)
                        $state.go('userProfile', {});
                }
            }, true);   //true for deep comparison
        //});
        
        /*$scope.profile_content.profile.profile_number = $scope.type_number;
        $scope.profile_content.profile.profile_content = keywordFactory.getProfile($scope.type_number).$promise.then(function(){userFactory.saveDetails($scope.profile);});*/
        
    };
    
}])

.controller('userProfileController', ['$scope', '$state', 'userFactory', '$timeout', function ($scope, $state, userFactory, $timeout) {
    $scope.section_num = 1;
    $scope.profile_content = {};
    $scope.type_number = 0;
    $scope.loading = true;
    
    $scope.profile_content = userFactory.getProfile($scope.profile_content);
    
    $scope.$watch('section_num', (n, o)=>{
        if(n!=o)
            $scope.saveProfile();
    });
    
    $scope.calculate_avg = function(){
        var key_sum = 0;
        for(var k=0; k<$scope.profile_content.profile.profile_content.length; k++){
            key_sum = 0;
            var mini_len = $scope.profile_content.profile.profile_content[k].mini_descriptions.length;
            
            for(var q=0; q<mini_len; q++){
                key_sum += $scope.profile_content.profile.profile_content[k].mini_descriptions[q].mini_rating;
            }
            
            $scope.profile_content.profile.profile_content[k].key_rating = key_sum / mini_len;
        }
    }
    
    $scope.saveProfile = function(){
        $scope.calculate_avg();
        $scope.success = 0;
        $scope.success = userFactory.saveDetails($scope.profile_content);
        $timeout(function(){
            $scope.success = "";
        },5000);
    };
    
    $scope.submitProfile = function(){
        $scope.calculate_avg();
        $scope.success = 0;
        $scope.success = userFactory.saveDetails($scope.profile_content);
        $scope.$watch('success', function(n, o){
            if(n!=o)
                $state.go('dashboard', {});
        }, true);   //true for deep comparison
    };
    
    $scope.$watch('profile_content', (n, o)=>{
        if(n!=o){
            $scope.loading = false;
            //$scope.temp_content = $scope.profile_content.profile.profile_content;
            var k=0, j=0;
            $scope.temp_content = [];
            for(k = 0; k < $scope.profile_content.profile.profile_content.length; k++){
                
                if($scope.profile_content.profile.profile_content[k].linked_keyword){
                    
                    for(j = 0; j < $scope.profile_content.profile.profile_content.length; j++){
                        
                        if($scope.profile_content.profile.profile_content[k].linked_keyword ==  $scope.profile_content.profile.profile_content[j].keyword_id){
                            $scope.temp_content[k] = $scope.profile_content.profile.profile_content[j];
                            break;
                        }
                    }
                    
                }
                else
                    $scope.temp_content[k] = {};
                
                console.log("here: "+$scope.temp_content[k]);
            }
            
        }
    }, true);
}])

.controller('sadbmsController', ['$scope', '$state', 'userFactory', 'keywordFactory', 'notiFactory', function ($scope, $state, userFactory, keywordFactory, notiFactory) {
    $scope.loading = true;
    //$scope.usersDetails = {};
    $scope.tab_num = 1;
    
    /*
    $scope.$watch('usersDetails', function(n, o){
        if(n!=o)
            $scope.loading = false;
    }, true);   //true for deep comparison
    */
    
    $scope.$watch('tab_num', function(n, o){
        if(n!=o){
            if(n==2 && !$scope.userList){   // Tab 2
                $scope.userList = userFactory.getUsers($scope.usersDetails);
            }
            //else if(n==3 && !$scope.master){    // Tab 3
                //$scope.master = keywordFactory.getAllProfiles($scope.master);
            //}
            else if(n==5 && !$scope.master){    // Tab 5
                $scope.noti = notiFactory.getNoti($scope.noti);
            }
        }
    }, true);   //true for deep comparison
    
    //  Tab 1
    $scope.analysis_content = {};
    $scope.analysis_content = userFactory.getAnalysis($scope.analysis_content);
    
    $scope.label_profile_num = ["None", "Profile 1", "Profile 2", "Profile 3", "Profile 4", "Profile 5", "Profile 6", "Profile 7", "Profile 8", "Profile 9"];
    $scope.data_profile_num = [];
    
    $scope.temp_reg = [];
    $scope.data_reg = [];
    $scope.data_reg_final = [];
    $scope.total_months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    $scope.label_reg = [];
    $scope.data_reg.fill(0);
    
    $scope.$watch('analysis_content', function(n, o){
        if(n!=o){
            $scope.loading = false;
            
            n.variant_profile_num.forEach(function(v, i){
                $scope.data_profile_num[v._id] = v.total;
            });
            
            for(var j = 0; j < n.months.length; j++){
                $scope.temp_reg.push(parseInt(($scope.total_months.indexOf((((new Date($scope.analysis_content.months[j])).toDateString()).split(" "))[1])+1) + '' + (((new Date($scope.analysis_content.months[j])).toDateString()).split(" "))[3]));
            }
            
            $scope.temp_reg.sort((a, b)=>{return a-b;});	//	sorting - asc
            
            for (var i=0; i<$scope.temp_reg.length; i++){	//	grouping
                if (!$scope.data_reg[$scope.data_reg.length-1] || $scope.data_reg[$scope.data_reg.length-1].value != $scope.temp_reg[i])
                    $scope.data_reg.push({value: $scope.temp_reg[i], times: 1})
                else
                    $scope.data_reg[$scope.data_reg.length-1].times++;
            }
            
			for (var q=0; q<$scope.data_reg.length; q++){
                $scope.data_reg_final[q] = $scope.data_reg[q].times;
				if($scope.data_reg[q].value.toString().length == 5)
					$scope.label_reg[q] = $scope.total_months[($scope.data_reg[q].value.toString())[0] - 1]+'\''+($scope.data_reg[q].value.toString()).slice(-2);
				else
					$scope.label_reg[q] = $scope.total_months[$scope.data_reg[q].value.toString().slice(0,2) - 1]+'\''+($scope.data_reg[q].value.toString()).slice(-2);
            }
        }
    }, true);
    
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "Septempber", "October", "November", "December"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.data2 = [300, 500, 100, 600, 10, 200, 1000, 500, 100, 600, 10, 200, 1000];
    
    //  Tab 2
    $scope.userList = '';
    $scope.sortKey = 'register';
    $scope.reverse = false;
    
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };
    
    //  Tab 3    
    $scope.master = '';
    
    $scope.getThatProfile = function(tno){
        $scope.master = keywordFactory.getProfile(tno);
    };
	
    $scope.updateThatProfile = function(pno, sno, kno){
		$scope.success = 0;
		var num = 'P0'+pno+'S0'+sno+'K0'+kno;
		for(var find=0; find < $scope.master.length; find++){
			if($scope.master[find].keyword_id == num){
				console.log("found");
				$scope.success = keywordFactory.updateProfile(pno, sno, kno, $scope.master[find]);
				return;
			}
		}
    };
    
    // Tab 4
    $scope.profile_to_add = 0;
    $scope.structure_mini = {
        mini_description_id: '',
        mini_description: '',
        tag: {
            personal: false,
            professional: false,
            company: false,
            competency: false
        }
    };
    $scope.structure_statement = {
        desc: ''
    };
    $scope.structure = {
        keyword: '',
        keyword_id: '',
        section_id: '',
        mini_descriptions: [],
        linked_keyword: '',
        dummy_keyword: '',
        belongs_to: {
            personal: false,
            professional: false
        },
        balancing_description: []
    };
    $scope.add_array = false;
    
    $scope.push_mini = function(){
        $scope.structure.mini_descriptions.push($scope.structure_mini);
        $scope.structure_mini = {
            mini_description_id: '',
            mini_description: '',
            tag: {
                personal: false,
                professional: false,
                company: false,
                competency: false
            }
        };
    };
    
    $scope.push_statement = function(){
		if(!$scope.structure_statement.desc.length)
			return;
        $scope.structure.balancing_description.push($scope.structure_statement);
        $scope.structure_statement = {
			desc: ''
		};
    };
    
    $scope.push_keyword = function(){
        if(!$scope.structure.mini_descriptions.length)
            return;
        $scope.add_array = $scope.structure;
        $scope.structure = {
            keyword: '',
            keyword_id: '',
            section_id: '',
            mini_descriptions: [],
            linked_keyword: '',
            belongs_to: {
                personal: false,
                professional: false
            },
            balancing_description: []
        };
    };
    
    $scope.undoData = function(){
        $scope.structure = $scope.add_array;
        $scope.add_array = false;
    };
    
    $scope.submitData = function(){
        keywordFactory.saveNew($scope.add_array);
        $scope.add_array = false;
    };
    
    // Tab 5
    $scope.noti = '';
}])
;