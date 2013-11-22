var TestRun = Backbone.Model.extend({
	defaults: function() {
		return {
			"id": "",
			"name": "Default",
			"timestamp": 0,
			"collection": null,
			"folder": null,
			"environment": null,
			"globals": null,
			"results": ""
		}
	},

	initialize: function() {

	}
});

var TestRuns = Backbone.Collection.extend({
	model: TestRun,

	initialize: function() {
		console.log("Initialized TestRuns");
		this.loadAllTestRuns();
	},

	loadAllTestRuns: function() {
		var collection = this;

		pm.indexedDB.testRuns.getAllTestRuns(function(testRuns) {
			collection.add(testRuns, { merge: true });
			console.log("Loaded all test runs", collection.toJSON());;
		});
	}
});