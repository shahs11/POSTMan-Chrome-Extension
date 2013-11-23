var TestRunnerSidebar = Backbone.View.extend({
	initialize: function() {
		console.log(this.model);
		var runsSidebar = new RunsSidebar({model: this.model.get("testRuns")});
	}
});