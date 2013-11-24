var TestRunResults = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		pm.mediator.on("startedTestRun", this.startNewTest, this);
		pm.mediator.on("hideResults", this.hideResults, this);
		pm.mediator.on("clearResults", this.clearResults, this);
		pm.mediator.on("addResult", this.addResult, this);
		pm.mediator.on("updateResult", this.updateResult, this);
	},

	startNewTest: function() {
		this.showResults();
		this.clearResults();
	},

	showResults: function() {
		$("#results").css("display", "block");
	},

	hideResults: function() {
		$("#results").css("display", "none");
	},

	clearResults: function() {
		$("#test-run-status").html("");
	},

	getTestsAsArray: function(tests) {
		var d = "";
		var success = 0;
		var failure = 0;
		var total = 0;

		var testsArray = [];
		var r;
		for (var key in tests) {
			if (tests.hasOwnProperty(key)) {

				if (tests[key]) {
					r = "pass";
				}
				else {
					r = "fail";
				}

				testsArray.push({
					key: key,
					value: r
				});
			}
		}

		return testsArray;
	},

	addResult: function(_result) {
		var result = _.clone(_result);
		result["testsArray"] = this.getTestsAsArray(result.tests);

		$("#test-run-status").append(Handlebars.templates.item_test_run_request_result(result));
	},

	updateResult: function(_result) {
		var result = _.clone(_result);
		result["testsArray"] = this.getTestsAsArray(result.tests);

		$("#test-run-request-result-" + result.id + " .time").html(result.time + " ms");
		$("#test-run-request-result-" + result.id + " .status-code .code").html(result.responseCode.code);
		$("#test-run-request-result-" + result.id + " .status-code .name").html(result.responseCode.name);
		$("#test-run-request-result-" + result.id + " .tests").html(Handlebars.templates.tests(result));
	}
});