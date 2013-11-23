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

	getAsJSON: function() {
		var obj = {
			"id": this.get("id"),
			"name": this.get("name"),
			"timestamp": this.get("timestamp"),
			"collection_id": this.get("collection_id"),
			"folder_id": this.get("folder_id"),
			"target_type": this.get("target_type"),
			"environment_id": this.get("environment_id"),
			"count": this.get("count"),
			"collection": this.get("collection").getAsJSON(),
			"folder": this.get("folder"),
			"globals": this.get("globals"),
			"results": this.get("results"),
			"environment": null
		};

		if (this.get("environment")) {
			obj["environment"] = this.get("environment").toJSON();
		}

		return obj;
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

		this.addToDataStore(this.getAsJSON());
		this.runRequests(allRequests, this.get("count"));
	},

	addToDataStore: function(testRun) {
		pm.indexedDB.testRuns.addTestRun(testRun, function(data) {
			console.log("Added test run", data);
		});
	},

	updateInDataStore: function(testRun) {
		pm.indexedDB.testRuns.updateTestRun(testRun, function(data) {
			console.log("Update test run", data);
		});
	},

	deleteFromDataStore: function(id) {
		pm.indexedDB.testRuns.deleteTestRun(id, function() {
			console.log("Deleted test run");
		});
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

		function addResult(result) {
			var index = arrayObjectIndexOf(results, result.id, "id");
			var r;

			if (index >= 0) {
				r = results[index];
				// TODO Calculate average time
				r["times"].push(result.responseTime);
				r["allTests"].push(result.tests);
			}
			else {
				results.push(result);
			}
		}

		function onSentRequest(r) {
			console.log("TEST RUNNER", "Sent request", r);
			result = {
				"id": request.id,
				"name": request.name,
				"url": request.url,
				"times": [],
				"allTests": []
			}
		}

		function onLoadResponse(r) {
			result["responseCode"] = response.get("responseCode");
			result["time"] = response.get("time");

			console.log("TEST RUNNER", "Loaded response", r);
			var tests = request.get("tests");

			if (tests) {
				console.log("TEST RUNNER", "Running tests");
				pm.mediator.trigger("runRequestTest", request, currentRunCount, onFinishTests);
			}
			else {
				console.log("TEST RUNNER", "No tests. Finishing");
				finishRequestRun();
			}

		}

		function onFinishTests(data) {
			result["tests"] = data;

			console.log("TEST RUNNER", "Received tests", data);
			finishRequestRun();
		}

		function finishRequestRun() {
			results.push(result);

			if (currentRequestIndex < requestCount - 1) {
				currentRequestIndex += 1;
				sendRequest(currentRequestIndex);
			}
			else {
				currentRunCount += 1;

				if (currentRunCount == runCount) {
					console.log("TEST RUNNER", "Finished all tests", results);
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
			pm.mediator.trigger("loadedAllTestRuns");
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