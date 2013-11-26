var TestRunnerController = Backbone.View.extend({
	initialize: function() {
		var testRunStarter = new TestRunStarter({model: this.model});
		var testRunStatusHeader = new TestRunStatusHeader({model: this.model});
	}
});