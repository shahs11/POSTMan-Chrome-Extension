var TestRun = Backbone.Model.extend({
	defaults: function() {
		return {
			"id": "",
			"name": "Default",
			"timestamp": 0,
			"collection_id": "",
			"folder_id": "",
			"target_type": "",
			"environment_id": "",
			"count": 0,
			"collection": null,
			"folder": null,
			"environment": null,
			"globals": null,
			"results": null
		}
	},

	initialize: function() {
		console.log("Initialized test run", this.toJSON());
	},

	start: function() {
		var collection = this.get("collection");
		var folder = this.get("folder");
		var target_type = this.get("target_type");
		var environment = this.get("environment");
		var globals = this.get("globals");

		// Set up environment and globals
		if (environment) {
			pm.envManager.setEnvironment(environment);
		}

		pm.envManager.setGlobals(globals);

		// Filter executable requests
		var allRequests;

		// TODO Order requests according to the order array
		if (target_type === "folder") {
			allRequests = collection.getRequestsInFolder(folder);
		}
		else {
			allRequests = _.clone(collection.get("requests"));
		}

		this.runRequests(allRequests, this.get("count"));
	},

	runRequests: function(requests, runCount) {
		var currentRunCount = 0;

		this.set("requests", requests);
		var requestCount = requests.length;
		var currentRequestIndex = 0;
		var request;
		var response;

		var result;

		var results = [];

		function onSentRequest(r) {
			console.log("TEST RUNNER", "Sent request", r);
		}

		function onLoadResponse(r) {
			console.log("TEST RUNNER", "Loaded response", r);

			if ("tests" in request) {
				pm.mediator.trigger("runRequestTest", request);
			}
			else {
				finishRequestRun();
			}

		}

		function onFinishTests(data) {
			console.log("TEST RUNNER", "Received tests", data);
		}

		function finishRequestRun() {
			if (currentRequestIndex < requestCount - 1) {
				currentRequestIndex += 1;
				sendRequest(currentRequestIndex);
			}
			else {
				currentRunCount += 1;

				if (currentRunCount == runCount) {
					console.log("TEST RUNNER", "Finish running", currentRunCount);
				}
				else {
					console.log("TEST RUNNER", "Another run", currentRunCount);
					// Re-initiate run
					currentRequestIndex = 0;
					sendRequest(0);
				}
			}
		}

		function sendRequest(index) {
			request = new Request();
			request.loadRequest(requests[index], true, false);
			request.disableHelpers(); // TODO Should get rid of this call later

			// Attach listeners for request and response
			request.on("sentRequest", onSentRequest);
			response = request.get("response");

			response.on("loadResponse", onLoadResponse);

			request.send();
		}

		// Initiate request
		if (requestCount > 0) {
			sendRequest(0);
		}

	}
});

// TODO Reload collection data when something is updated in the requester window
var TestRuns = Backbone.Collection.extend({
	model: TestRun,

	initialize: function() {
		this.loadAllTestRuns();

		pm.mediator.on("startTestRun", this.onStartTestRun, this);
	},

	loadAllTestRuns: function() {
		var collection = this;

		pm.indexedDB.testRuns.getAllTestRuns(function(testRuns) {
			collection.add(testRuns, { merge: true });
		});
	},

	onStartTestRun: function(params) {
		var collection_id = params["collection_id"];
		var folder_id = params["folder_id"];
		var target_type = params["target_type"];
		var environment_id = params["environment_id"];
		var count = params["count"];

		console.log("Initating test run", params);

		var collection = pm.collections.get(collection_id);
		var folder;

		if (folder_id !== "0") {
			folder = collection.getFolderById(folder_id);
		}

		var environment;

		if (environment_id !== "0") {
			environment = pm.envManager.get("environments").get(environment_id);
		}

		var globals = pm.envManager.get("globals").get("globals");

		var testRunParams = {
			"id": guid(),
			"name": "Default",
			"timestamp": new Date().getTime(),
			"collection_id": collection_id,
			"folder_id": folder_id,
			"target_type": target_type,
			"environment_id": environment_id,
			"count": count,
			"collection": collection,
			"folder": folder,
			"environment": environment,
			"globals": globals
		};

		console.log("Params are", testRunParams);
		var testRun = new TestRun(testRunParams);

		// TODO Add to collection and update sidebar
		testRun.start();

		pm.mediator.trigger("startedTestRun");
	}
});