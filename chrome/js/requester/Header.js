var Header = Backbone.View.extend({
	initialize: function() {
		$("#add-on-directory").on("click", function() {
			pm.mediator.trigger("openModule", "directory");
			pm.mediator.trigger("initializeDirectory");
		});

		$("#add-on-test-runner").on("click", function() {
			pm.mediator.trigger("openModule", "test_runner");
		});

		$("#logo").on("click", function() {
			pm.mediator.trigger("openModule", "requester");
		});

		$("#back-to-request").on("click", function() {
			pm.mediator.trigger("openModule", "requester");
		});

		this.render();
	},

	render: function() {
		if (pm.features.isFeatureEnabled(FEATURES.DIRECTORY)) {
			$("#add-ons").css("display", "block");
		}
	}

});