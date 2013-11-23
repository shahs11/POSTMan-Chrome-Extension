var RunsSidebar = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		$('#test-run-items').on("mouseenter", ".sidebar-test-run", function () {
		    var actionsEl = jQuery('.test-run-actions', this);
		    actionsEl.css('display', 'block');
		});

		$('#test-run-items').on("mouseleave", ".sidebar-test-run", function () {
		    var actionsEl = jQuery('.test-run-actions', this);
		    actionsEl.css('display', 'none');
		});

		pm.mediator.on("loadedAllTestRuns", this.render, this);
	},

	showEmptyMessage:function () {
	    $('#test-run-items').append(Handlebars.templates.message_no_test_runs());
	},

	render: function() {
		var model = this.model;
		var testRuns = model.toJSON();

		$('#test-run-items').html("");

		if (testRuns.length > 0) {
			$('#test-run-items').append(Handlebars.templates.sidebar_test_run_list({items: testRuns}));
		}
		else {
			this.showEmptyMessage();
		}

	}
});