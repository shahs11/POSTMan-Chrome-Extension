/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */
"use strict";

var pm = {};

pm.targets = {
    CHROME_LEGACY_APP: 0,
    CHROME_PACKAGED_APP: 1
};

pm.target = pm.targets.CHROME_PACKAGED_APP;

pm.isTesting = postman_flag_is_testing;
pm.databaseName = postman_database_name;
pm.webUrl = postman_web_url;

pm.features = new Features();

pm.debug = false;

pm.indexedDB = {};
pm.indexedDB.db = null;
pm.indexedDB.modes = {
    readwrite:"readwrite",
    readonly:"readonly"
};

pm.fs = {};
pm.hasPostmanInitialized = false;

pm.bannedHeaders = [
    'accept-charset',
    'accept-encoding',
    'access-control-request-headers',
    'access-control-request-method',
    'connection',
    'content-length',
    'cookie',
    'cookie2',
    'content-transfer-encoding',
    'date',
    'expect',
    'host',
    'keep-alive',
    'origin',
    'referer',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
    'user-agent',
    'via'
];

// IndexedDB implementations still use API prefixes
var indexedDB = window.indexedDB || // Use the standard DB API
    window.mozIndexedDB || // Or Firefox's early version of it
    window.webkitIndexedDB;            // Or Chrome's early version
// Firefox does not prefix these two:
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
var IDBCursor = window.IDBCursor || window.webkitIDBCursor;

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

pm.init = function () {
    Handlebars.partials = Handlebars.templates;

    function initializeTester() {
        var tester = new Tester();
        pm.tester = tester;
    }

    function initializePostmanAPI() {
        pm.api = new PostmanAPI();
    }

    function initializeCollections() {
        var pmCollections = new PmCollections();
        pm.collections = pmCollections;
    }

    function initializeHistory() {
        var history = new History();
        pm.history = history;
    }

    function initializeEnvironments() {
        var globals = new Globals();
        var environments = new Environments();

        var variableProcessor = new VariableProcessor({
            "environments": environments,
            "globals": globals
        });

        pm.envManager = variableProcessor;

        var appState = new AppState({
            "globals": globals,
            "environments": environments,
            "variableProcessor": variableProcessor
        });

        var appView = new TestRunApp({model: appState});
        pm.app = appView;

        var testRunAppHeader = new TestRunAppHeader({model: {}});
    }

    function initializeHeaderPresets() {
        pm.headerPresets = new HeaderPresets();
    }

    function initializeRequester() {
        var urlCache = new URLCache();
        pm.urlCache = urlCache;
    }

    function initializeStorage() {
        var storage = new Storage();
        pm.storage = storage;
    }

    function initializeRequestMethods() {
        var requestMethods = new RequestMethods();
        pm.methods = requestMethods;
    }

    function initializeSidebar() {
    	var state = new TestRunnerSidebarState();
    	var sidebar = new TestRunnerSidebar({model: state});
	}

    function initializeUser() {
        var user = new User();
        pm.user = user;
    }

    function initializeTestRunner() {
    	var testRuns = new TestRuns();
    	var testRunnerSidebarState = new TestRunnerSidebarState({testRuns: testRuns});
    	var testRunnerSidebar = new TestRunnerSidebar({model: testRunnerSidebarState});

    	var o = {
    		"collections": pm.collections,
    		"envManager": pm.envManager,
    		"testRuns": testRuns
    	};

        var testRunStarterState = new TestRunStarterState(o);
    	var testRunStarter = new TestRunStarter({model: testRunStarterState});

    	pm.testRuns = testRuns;
    }

    pm.mediator = new Mediator();

    initializeStorage();

    pm.settings = new Settings();

    pm.methods = new RequestMethods(function() {
        pm.settings.init(function() {
            pm.filesystem.init();
            pm.indexedDB.open(function() {
            	initializeTester();
                initializePostmanAPI();
                initializeRequester();
                initializeHistory();
                initializeCollections();
                initializeEnvironments();
                initializeHeaderPresets();
                initializeSidebar();
                initializeUser();

                // Test runner specific initializations
                initializeTestRunner();

                pm.hasPostmanInitialized = true;
            });
        });
    });
};

$(document).ready(function () {
    pm.init();
});