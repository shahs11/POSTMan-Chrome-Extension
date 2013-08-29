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

		var results = [];
		var r;
		for (var key in testResults) {
		  if (testResults.hasOwnProperty(key)) {

		  	if (testResults[key]) {
		  		r = "pass";
		  	}
		  	else {
		  		r = "failed";
		  	}

		    results.push({
		    	key: key,
		    	value: r
		    });

		    if (testResults[key] === true) {
		    	success += 1;
		    }
		    else {
		    	failure += 1;
		    }

		    total += 1;
		  }
		}

		$('.response-tabs li[data-section="tests"]').html("Tests (" + success + "/" + total + ")");
		$('#response-tests').html(Handlebars.templates.response_tests({items: results}));
	}

});