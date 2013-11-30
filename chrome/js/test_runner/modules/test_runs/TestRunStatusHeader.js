var TestRunStatusHeader = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		$("#new-test-run").on("click", function() {
			console.log("Triggering event", model);
			model.trigger("showView", "default");
		});
	}
});