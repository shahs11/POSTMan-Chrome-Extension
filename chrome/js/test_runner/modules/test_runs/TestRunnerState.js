var TestRunnerState = Backbone.Model.extend({
	defaults: function() {
		return {
			"state": "default", //default or running
			"collections": null,
			"envManager": null,
			"testRuns": null
		}
	},

	initialize: function() {
		var model = this;

		var collections = this.get("collections");
		var envManager = this.get("envManager");
		var testRuns = this.get("testRuns");

		pm.mediator.on("loadedCollections", function() {
			model.trigger("loadedCollections");
		});

		pm.mediator.on("loadedEnvironments", function() {
			model.trigger("loadedEnvironments");
		});

		pm.mediator.on("startTestRun", this.onStartTestRun, this);
	},

	showView: function(key) {
		if (key === "status") {
			$("#test-run-starter-form").css("display", "none");
			$("#test-run-progress").css("display", "block");
		}
		else if (key === "default") {
			$("#test-run-starter-form").css("display", "block");
			$("#test-run-progress").css("display", "none");
		}
	},

	onStartTestRun: function() {
		this.set("state", "running");
		this.showView("status");
	}
});