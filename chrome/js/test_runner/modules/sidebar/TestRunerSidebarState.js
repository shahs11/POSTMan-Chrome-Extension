var TestRunnerSidebarState = Backbone.Model.extend({
	defaults: function() {
		return {
			"collections": null,
			"envManager": null,
			"testRuns": null
		}
	},

	initialize: function() {

	}
});