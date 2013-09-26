var Evaluator = Backbone.Model.extend({
	initialize: function() {
		this.setupListener();
	},

	setupListener: function() {
		window.addEventListener('message', function(event) {
			var command = event.data.command;
			var code = event.data.code;
			var environment = event.data.environment;

			responseBody = environment.responseBody;
			responseHeaders = environment.responseHeaders;
			responseTime = environment.responseTime;

			if (command === "runcode") {
			    var result = eval(code);
			    event.source.postMessage({'result': result}, event.origin);
			}
		});
	}
});