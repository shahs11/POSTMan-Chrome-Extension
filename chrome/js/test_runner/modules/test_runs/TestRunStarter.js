var TestRunStarter = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		model.on("loadedCollections", this.renderCollections, this);
		model.on("loadedEnvironments", this.renderEnvironments, this);

		$("#start-test-run").on("click", function() {
			view.startRun();
		});
	},

	renderCollections: function() {
		var model = this.model;
		var items = _.clone(model.get("collections").toJSON());

		for(var i = 0; i < items.length; i++) {
		    if("folders" in items[i]) {
		        folders = items[i].folders;

		        folders.sort(sortAlphabetical);

		        for(var j = 0; j < folders.length; j++) {
		            folders[j].collection_name = items[i].name;
		            folders[j].collection_id = items[i].id;
		        }
		    }
		}

		$('#select-collection').html("<option>Select</option>");
		$('#select-collection').append(Handlebars.templates.collection_selector_list({items: items}));
	},

	renderEnvironments: function() {
		var model = this.model;
		var items = _.clone(model.get("envManager").get("environments").toJSON());
		$('#select-environment').html("<option>Select</option>");
		$('#select-environment').append(Handlebars.templates.environment_list({items: items}));
	},

	startRun: function() {
		var target_id = $("#select-collection").val();
		var target_type = $("#select-collection option[value='" + target_id + "']").attr("data-type");

		var collection_id;
		var folder_id;

		if (target_type === "folder") {
			folder_id = target_id;
			collection_id = $("#select-collection option[value='" + target_id + "']").attr("data-folder-id");
		}
		else {
			collection_id = target_id;
		}

		var environment_id = $("#select-environment").val();
		var count = parseInt($("#test-run-count").val(), 10);

		console.log(target_id, collection_id, target_type, environment_id, count);
	}
});