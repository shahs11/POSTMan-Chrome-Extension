var Tester = Backbone.Model.extend({
	defaults: function() {
		return {
			"sandbox": null
		};
	},

	runTest: function(request, callback) {
		console.log("TEST RUNNER", "Trying to run a test", request);
		console.log(request.get("tests"));

		var testCode = request.get("tests");

		// Wrapper function
		var baseCode = "(function(){";
		baseCode += testCode;
		baseCode += "})()";

		var response = request.get("response");

		var environment = {
			"responseBody": response.get("text"),
			"responseHeaders": response.get("headers"),
			"responseTime": response.get("time"),
			"responseCode": response.get("responseCode")
		};

		console.log("Environment is", environment);

		this.postCode(baseCode, environment);

		this.listenToOnce(pm.mediator, "resultReceived", function(data) {
			if (callback) {
				console.log("Run callback", data);
				callback(data);
			}
		});
	},

	postCode: function(code, environment) {
		var sandbox = this.get("sandbox");
		var message = {
			command: "runcode",
			code: code,
			environment: environment
		};

		sandbox.contentWindow.postMessage(message, '*');
	},

	initialize: function() {
		var sandbox = document.getElementById("tester_sandbox");
		this.set("sandbox", sandbox);

		window.addEventListener('message', function(event) {
		  	pm.mediator.trigger("resultReceived", event.data.result);
		});

		pm.mediator.on("runRequestTest", this.runTest, this);
	}
});