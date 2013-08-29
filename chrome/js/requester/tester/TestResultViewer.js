var TestResultViewer = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		model.on("change:testResults", this.render, this);
	},

	render: function() {
		var testResults = this.model.get("testResults");
		var d = "";
		var success = 0;
		var failure = 0;
		var total = 0;

		for (var key in testResults) {
		  if (testResults.hasOwnProperty(key)) {
		    d += key + ": " + testResults[key] + ", ";

		    if (testResults[key] === true) {
		    	success += 1;
		    }
		    else {
		    	failure += 1;
		    }

		    total += 1;
		  }
		}

		var o = {
			"total": total,
			"data": d,
			"success": success
		};

		$('#test-results').html(Handlebars.templates.test_results(o));
		$('#test-results .test-results').popover({
		    trigger: "hover"
		});
	}

});