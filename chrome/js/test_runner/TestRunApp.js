var TestRunApp = Backbone.View.extend({
	initialize: function() {
		var view = this;

		console.log("Initialized the test runner");

		var resizeTimeout;

		$(window).on("resize", function () {
		    clearTimeout(resizeTimeout);
		    resizeTimeout = setTimeout(function() {
		        view.setLayout();
		    }, 500);
		});

		this.setLayout();
	},

	setLayout:function () {
	    this.refreshScrollPanes();
	},

	refreshScrollPanes:function () {
	    var newMainHeight = $(document).height() - 55;
	    $('#main').height(newMainHeight + "px");
	    var newMainWidth = $('#container').width() - $('#sidebar').width() - 10;
	    $('#main').width(newMainWidth + "px");
	}
});