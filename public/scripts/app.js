'use strict';

angular.module('idiscover.me', ['ui.router', 'ngResource', 'ng.deviceDetector', 'chart.js'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    //Defining States
    $stateProvider
    .state('login', {
        url: '/',
        views: {
            'content': {
                templateUrl: './views/login.html',
                controller: 'loginController'
            }
        }
    })
    .state('register', {
        url: '/register',
        views: {
            'content': {
                templateUrl: './views/register.html',
                controller: 'registerController'
            }
        }
    })
    .state('personal-details', {
        url: '/edit-details',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
            'content': {
                templateUrl: './views/personal_details.html',
                controller: 'myPersonalController'
            }
        }
    })
    .state('details', {
        url: '/details',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
            'content': {
                templateUrl: './views/details.html',
                controller: 'detailsController'
            }
        }
    })
    .state('process-steps', {
        url: '/process-steps',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
			'left_panel': {
                templateUrl: './views/left_panel.html',
                controller: ''
            },
            'content': {
                templateUrl: './views/process_step.html',
                controller: 'processController'
            }
        }
    })
    .state('reflective-questions', {
        url: '/reflective-questions',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
			'left_panel': {
                templateUrl: './views/left_panel.html',
                controller: ''
            },
            'content': {
                templateUrl: './views/reflective.html',
                controller: 'processController'
            }
        }
    })
    .state('questionnaire', {
        url: '/questionnaire',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
			'left_panel': {
                templateUrl: './views/left_panel.html',
                controller: ''
            },
            'content': {
                templateUrl: './views/questionnaire.html',
                controller: 'questController'
            }
        }
    })
    .state('dashboard', {
        url: '/dashboard',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
			'left_panel': {
                templateUrl: './views/left_panel.html',
                controller: ''
            },
            'content': {
                templateUrl: './views/dashboard.html',
                controller: 'dashboardController'
            }
        }
    })
    .state('detailed-profile', {
        url: '/detailed-profile',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
            'content': {
                templateUrl: './views/detailed_profile.html',
                controller: 'userProfileController'
            }
        }
    })
    .state('precise-profile', {
        url: '/precise-profile',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
            'content': {
                templateUrl: './views/precise_profile.html',
                controller: 'userProfileController'
            }
        }
    })
    .state('balancing-view', {
        url: '/balancing-view',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
            'content': {
                templateUrl: './views/balancing_view.html',
                controller: 'userProfileController'
            }
        }
    })
    .state('select-profile', {
        url: '/select-profile',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
            'content': {
                templateUrl: './views/select_profile.html',
                controller: 'selectController'
            }
        }
    })
    .state('userProfile', {
        url: '/Profile',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
            'content': {
                templateUrl: './views/userProfile.html',
                controller: 'userProfileController'
            }
        }
    })
    .state('sadbms', {
        url: '/SADBMS',
        views: {
			'header': {
                templateUrl: './views/header.html',
                controller: 'headerController'
            },
            'content': {
                templateUrl: './views/sadbms.html',
                controller: 'sadbmsController'
            }
        }
    });
    $urlRouterProvider.otherwise('/');
    
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
}]);