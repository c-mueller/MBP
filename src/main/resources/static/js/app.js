'use strict';

let app = angular.module('app', ['ngRoute', 'ngResource', 'ngCookies', 'ngSanitize', 'smart-table', 'ui.bootstrap', 'ngFileUpload', 'thatisuday.dropzone', 'angular-loading-bar']);

app.config(['$provide', '$routeProvider', '$locationProvider', '$resourceProvider', 'dropzoneOpsProvider',
    function ($provide, $routeProvider, $locationProvider, $resourceProvider, dropzoneOpsProvider) {

        // enable HTML5mode to disable hashbang urls
        $locationProvider.html5Mode(true);

        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;

        // gets link from html (provided by Thymeleaf - server sided)
        let ENDPOINT_URI = $('#ENDPOINT_URI').attr('href');
        let BASE_URI = $('#BASE_URI').attr('href');
        $provide.value('ENDPOINT_URI', ENDPOINT_URI);
        $provide.value('BASE_URI', BASE_URI);

        dropzoneOpsProvider.setOptions({
            url: 'a',
            maxFilesize: '100',
            autoProcessQueue: false
        });

        let viewPrefix = '/view';

        //Configure routing rules
        $routeProvider

            // Home
            .when('/', {
                templateUrl: 'templates/home',
                controller: 'HomeController as ctrl',
                resolve: {
                    countEnvModels: ['HttpService', function (HttpService) {
                        return HttpService.count('env-models');
                    }],
                    countActuators: ['HttpService', function (HttpService) {
                        return HttpService.count('actuators');
                    }],
                    countSensors: ['HttpService', function (HttpService) {
                        return HttpService.count('sensors');
                    }],
                    countDevices: ['HttpService', function (HttpService) {
                        return HttpService.count('devices');
                    }],
                    countPolicies: ['HttpService', function (HttpService) {
                        return HttpService.count('policies');
                    }]
                }
            })

            // Login
            .when('/login', {
                templateUrl: 'templates/login',
                controller: 'LoginController as vm'
            })

            // Register
            .when('/register', {
                templateUrl: 'templates/register',
                controller: 'RegisterController as vm'
            })

            // Users
            .when(viewPrefix + '/users', {
                templateUrl: 'templates/users',
                controller: 'UsersController as vm'
            })

            // Environment Model
            .when(viewPrefix + '/env-models', {
                category: 'env-models',
                templateUrl: 'templates/env-models',
                controller: 'EnvModelListController as ctrl',
                resolve: {
                    envModelList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('env-models');
                    }],
                    addEnvModel: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'env-models');
                    }],
                    updateEnvModel: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.updateOne, 'env-models');
                    }],
                    deleteEnvModel: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'env-models');
                    }],
                    keyPairList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('key-pairs');
                    }],
                    adapterList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('adapters');
                    }],
                    deviceTypesList: ['ComponentTypeService', function (ComponentTypeService) {
                        return ComponentTypeService.GetByComponent('DEVICE').then(function (response) {
                            return response.data || [];
                        });
                    }],
                    actuatorTypesList: ['ComponentTypeService', function (ComponentTypeService) {
                        return ComponentTypeService.GetByComponent('ACTUATOR').then(function (response) {
                            return response.data || [];
                        });
                    }],
                    sensorTypesList: ['ComponentTypeService', function (ComponentTypeService) {
                        return ComponentTypeService.GetByComponent('SENSOR').then(function (response) {
                            return response.data || [];
                        });
                    }]
                }
            })

            // Key pairs list
            .when(viewPrefix + '/key-pairs', {
                category: 'key-pairs',
                templateUrl: 'templates/key-pairs',
                controller: 'KeyPairListController as ctrl',
                resolve: {
                    keyPairList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('key-pairs');
                    }],
                    addKeyPair: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'key-pairs');
                    }],
                    deleteKeyPair: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'key-pairs');
                    }]
                }
            })

            //Rules list
            .when(viewPrefix + '/rules', {
                category: 'rules',
                templateUrl: 'templates/rules',
                controller: 'RuleListController as ctrl',
                resolve: {
                    ruleList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('rules');
                    }],
                    addRule: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'rules');
                    }],
                    deleteRule: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'rules');
                    }],
                    ruleActionList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('rule-actions');
                    }],
                    ruleTriggerList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('rule-triggers');
                    }]
                }
            })

            // Rule actions list
            .when(viewPrefix + '/rule-actions', {
                category: 'rule-actions',
                templateUrl: 'templates/rule-actions',
                controller: 'RuleActionListController as ctrl',
                resolve: {
                    ruleActionList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('rule-actions');
                    }],
                    ruleActionTypesList: ['RuleService', function (RuleService) {
                        return RuleService.getRuleActionTypes().then(function (response) {
                            return response.data || [];
                        });
                    }],
                    actuatorList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('actuators');
                    }],
                    sensorList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('sensors');
                    }],
                    addRuleAction: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'rule-actions');
                    }],
                    deleteRuleAction: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'rule-actions');
                    }]
                }
            })

            // Rule triggers list
            .when(viewPrefix + '/rule-triggers', {
                category: 'rule-triggers',
                templateUrl: 'templates/rule-triggers',
                controller: 'RuleTriggerListController as ctrl',
                resolve: {
                    ruleTriggerList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('rule-triggers');
                    }],
                    addRuleTrigger: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'rule-triggers');
                    }],
                    deleteRuleTrigger: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'rule-triggers');
                    }],
                    actuatorList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('actuators');
                    }],
                    sensorList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('sensors');
                    }],
                    monitoringComponentList: ['MonitoringService', function (MonitoringService) {
                        return MonitoringService.getMonitoringComponents().then(function (response) {
                            if (response.data) {
                                return response.data;
                            } else {
                                return [];
                            }
                        });
                    }]
                }
            })

            .when(viewPrefix + '/actuators', {
                category: 'actuators',
                templateUrl: 'templates/actuators',
                controller: 'ActuatorListController as ctrl',
                resolve: {
                    actuatorList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('actuators');
                    }],
                    addActuator: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'actuators');
                    }],
                    deleteActuator: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'actuators');
                    }],
                    deviceList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('devices');
                    }],
                    adapterList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('adapters');
                    }],
                    accessControlPolicyList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('policies');
                    }]
                }
            })

            // Actuator Details
            .when(viewPrefix + '/actuators/:id', {
                category: 'actuators',
                templateUrl: 'templates/actuator-id.html',
                controller: 'ActuatorDetailsController as ctrl',
                resolve: {
                    actuatorDetails: ['$route', '$location', 'HttpService', function ($route, $location, HttpService) {
                        return HttpService.getOne('actuators', $route.current.params.id);
                    }]
                }
            })

            .when(viewPrefix + '/sensors', {
                category: 'sensors',
                templateUrl: 'templates/sensors',
                controller: 'SensorListController as ctrl',
                resolve: {
                    sensorList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('sensors');
                    }],
                    addSensor: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'sensors');
                    }],
                    deleteSensor: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'sensors');
                    }],
                    deviceList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('devices');
                    }],
                    adapterList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('adapters');
                    }],
                    accessControlPolicyList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('policies');
                    }]
                }
            })

            //Sensor details
            .when(viewPrefix + '/sensors/:id', {
                category: 'sensors',
                templateUrl: 'templates/sensor-id.html',
                controller: 'SensorDetailsController as ctrl',
                resolve: {
                    sensorDetails: ['$route', '$location', 'HttpService', function ($route, $location, HttpService) {
                        return HttpService.getOne('sensors', $route.current.params.id);
                    }]
                }
            })

            //Devices list and register
            .when(viewPrefix + '/devices', {
                category: 'devices',
                templateUrl: 'templates/devices',
                controller: 'DeviceListController as ctrl',
                resolve: {
                    deviceList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('devices');
                    }],
                    addDevice: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'devices');
                    }],
                    deleteDevice: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'devices');
                    }],
                    keyPairList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('key-pairs');
                    }],
                    accessControlPolicyList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('policies');
                    }]
                }
            })

            //Device details
            .when(viewPrefix + '/devices/:id', {
                category: 'devices',
                templateUrl: 'templates/device-id.html',
                controller: 'DeviceDetailsController as ctrl',
                resolve: {
                    deviceDetails: ['$route', '$location', 'HttpService', function ($route, $location, HttpService) {
                        return HttpService.getOne('devices', $route.current.params.id);
                    }],
                    compatibleAdapters: ['$route', 'MonitoringService', function ($route, MonitoringService) {
                        return MonitoringService.getCompatibleMonitoringAdapters($route.current.params.id).then(function (response) {
                            return response.data;
                        }, function () {
                            return null;
                        });
                    }]
                }
            })

            //Adapters list
            .when(viewPrefix + '/adapters', {
                category: 'adapters',
                templateUrl: 'templates/adapters',
                controller: 'AdapterListController as ctrl',
                resolve: {
                    adapterPreprocessing: function () {
                    },
                    parameterTypesList: ['ParameterTypeService', function (ParameterTypeService) {
                        return ParameterTypeService.getAll().then(function (response) {
                            if (response.success) {
                                return response.data;
                            } else {
                                return [];
                            }
                        });
                    }],
                    adapterList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('adapters');
                    }],
                    addAdapter: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'adapters');
                    }],
                    deleteAdapter: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'adapters');
                    }]
                }
            })

            //Monitoring adapters
            .when(viewPrefix + '/monitoring-adapters', {
                category: 'monitoring-adapters',
                templateUrl: 'templates/monitoring-adapters',
                controller: 'MonitoringAdapterListController as ctrl',
                resolve: {
                    deviceTypesList: ['ComponentTypeService', function (ComponentTypeService) {
                        return ComponentTypeService.GetByComponent('device').then(function (response) {
                            return response.data;
                        }, function () {
                            return [];
                        });
                    }],
                    parameterTypesList: ['ParameterTypeService', function (ParameterTypeService) {
                        return ParameterTypeService.getAll().then(function (response) {
                            if (response.success) {
                                return response.data;
                            } else {
                                return [];
                            }
                        });
                    }],
                    monitoringAdapterList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('monitoring-adapters');
                    }],
                    addMonitoringAdapter: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'monitoring-adapters');
                    }],
                    deleteMonitoringAdapter: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'monitoring-adapters');
                    }]
                }
            })

            //Policy list
            .when(viewPrefix + '/policies', {
                category: 'policies',
                templateUrl: 'templates/policies',
                controller: 'PolicyListController as ctrl',
                resolve: {
                    policyList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('policies');
                    }],
                    addPolicy: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'policies');
                    }],
                    deletePolicy: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'policies');
                    }],
                    policyConditionList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('policy-conditions');
                    }],
                    policyEffectList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('policy-effects');
                    }]
                }
            })

            //Policy conditions list
            .when(viewPrefix + '/policy-conditions', {
                category: 'policy-conditions',
                templateUrl: 'templates/policy-conditions',
                controller: 'PolicyConditionListController as ctrl',
                resolve: {
                    policyConditionList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('policy-conditions');
                    }],
                    addPolicyCondition: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'policy-conditions');
                    }],
                    deletePolicyCondition: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'policy-conditions');
                    }]
                }
            })

            //Policy effects list
            .when(viewPrefix + '/policy-effects', {
                category: 'policy-effects',
                templateUrl: 'templates/policy-effects',
                controller: 'PolicyEffectListController as ctrl',
                resolve: {
                    policyEffectList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('policy-effects');
                    }],
                    addPolicyEffect: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'policy-effects');
                    }],
                    deletePolicyEffect: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'policy-effects');
                    }]
                }
            })

            //Settings
            .when(viewPrefix + '/settings', {
                category: 'settings',
                templateUrl: 'templates/settings',
                controller: 'SettingsController as ctrl',
                resolve: {
                    settings: ['SettingsService', function (SettingsService) {
                        //Retrieve settings initially
                        return SettingsService.getSettings().then(function (response) {
                            return response.data;
                        });
                    }],
                    documentationMetaData: ['SettingsService', function (SettingsService) {
                        //Retrieve settings initially
                        return SettingsService.getDocumentationMetaData().then(function (response) {
                            return response.data;
                        });
                    }]
                }
            })

            //Testing tool
            .when(viewPrefix + '/testing-tool', {
                category: 'test-details',
                templateUrl: 'templates/testing-tool',
                controller: 'TestingController as ctrl',
                resolve: {
                    testList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('test-details');
                    }],
                    addTest: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.addOne, 'test-details');
                    }],
                    ruleList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('rules');
                    }],
                    deleteTest: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.deleteOne, 'test-details');
                    }]
                }
            })

            //Testing details
            .when(viewPrefix + '/testing-tool/:id', {
                category: 'test-details',
                templateUrl: 'templates/testing-tool-id',
                controller: 'TestingDetailsController as ctrl',
                resolve: {
                    testingDetails: ['$route', '$location', 'HttpService', function ($route, $location, HttpService) {
                        return HttpService.getOne('test-details', $route.current.params.id);
                    }],
                    ruleList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('rules');
                    }],
                    updateTest: ['HttpService', function (HttpService) {
                        return angular.bind(this, HttpService.updateItem, 'test-details');
                    }],
                    sensorList: ['HttpService', function (HttpService) {
                        return HttpService.getAll('sensors');
                    }]
                }
            })

            //Error 404
            .when(viewPrefix + '/404', {
                templateUrl: 'templates/404'
            })

            .otherwise({
                redirectTo: '/'
            });
    }
]);

app.run(['$rootScope', '$timeout', 'SessionService', '$location', '$cookieStore',
    function ($rootScope, $timeout, SessionService, $location, $cookieStore) {

        //Keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        /*
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }*/

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            let restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            let loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });

        $rootScope.$on('$viewContentLoaded', function () {
            $timeout(function () {

                $rootScope.loggedIn = $rootScope.globals.currentUser;

                if ($rootScope.loggedIn) {
                    $rootScope.username = $rootScope.globals.currentUser.username;
                    $rootScope.userData = $rootScope.globals.currentUser.userData;
                }
            });
        });
    }
]);

app.controller('MainCtrl', ['$route', '$rootScope', '$routeParams', '$location',
    function MainCtrl($route, $rootScope, $routeParams, $location) {
        let vm = this;
        vm.$route = $route;
        vm.$location = $location;
        vm.$routeParams = $routeParams;

        $rootScope.getMenuItemClass = function (path) {
            return ($location.path().substr(0, path.length) === path) ? 'toggled' : '';
        };
    }
]);