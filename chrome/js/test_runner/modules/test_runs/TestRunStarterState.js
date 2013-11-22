var TestRunStarterState = Backbone.Model.extend({
	defaults: function() {
		return {
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
	}
});