var TestRunStatusHeader = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		pm.mediator.on("startedTestRun", this.onStartedTestRun, this);
		pm.mediator.on("finishedTestRun", this.onFinishedTestRun, this);

		$("#new-test-run").on("click", function() {			
			model.trigger("showView", "default");
		});
	},

	onStartedTestRun: function(testRun) {				
		$("#test-run-target").html(Handlebars.templates.test_run_target(testRun.getAsJSON()));
	},

	onFinishedTestRun: function() {

	}
});