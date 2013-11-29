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

		$('#test-run-items').on("click", ".test-run-actions-delete", function () {
		    var test_run_id = $(this).attr('data-test-run-id');
		    model.deleteTestRun(test_run_id);
		});

		pm.mediator.on("startedTestRun", this.addRun, this);
		pm.mediator.on("deleteTestRun", this.deleteRun, this);
		pm.mediator.on("loadedAllTestRuns", this.render, this);
	},

	addEmptyMessage:function () {
	    $('#test-run-items').append(Handlebars.templates.message_no_test_runs());
	},

	clearEmptyMessage: function() {
		$("#test-run-items .empty-message").remove();
	},

	addRun: function(testRun) {
		this.clearEmptyMessage();
		console.log("Starting a new test run", testRun);
		$('#test-run-items').prepend(Handlebars.templates.item_test_run_sidebar(testRun.getAsJSON()));
	},

	deleteRun: function(id) {
		console.log(this.model, this.model.toJSON());

		console.log("Test run length", this.model.toJSON().length);
		if (this.model.toJSON().length == 0) {
			this.addEmptyMessage();
		}

		$("#sidebar-test-run-" + id).remove();
	},

	render: function() {
		var model = this.model;
		var testRuns = model.toJSON();

		$('#test-run-items').html("");

		console.log("Testruns", testRuns.length);

		if (testRuns.length > 0) {
			$('#test-run-items').append(Handlebars.templates.sidebar_test_run_list({items: testRuns}));
		}
		else {
			this.addEmptyMessage();
		}

	}
});