var TestRunAppHeader = Backbone.View.extend({
	initialize: function() {
		$("#logo").on("click", function() {
			pm.mediator.trigger("openModule", "requester");
		});

		pm.mediator.on("openModule", this.onOpenModule, this);
	},

	onOpenModule: function() {
	  chrome.app.window.create('requester.html', {
	    "bounds": {
	      width: 1200,
	      height: 800
	    }
	  }, function(win) {
	  });
	}
});