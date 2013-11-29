var TestRunnerController = Backbone.View.extend({
	initialize: function() {
		var testRunStarter = new TestRunStarter({model: this.model});
		var testRunStatusHeader = new TestRunStatusHeader({model: this.model});

		this.model.on("showView", this.showView, this);
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
	}
});