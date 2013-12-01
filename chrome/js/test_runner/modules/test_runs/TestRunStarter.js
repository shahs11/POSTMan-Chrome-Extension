var TestRunStarter = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		model.on("loadedCollections", this.renderCollections, this);
		model.on("loadedEnvironments", this.renderEnvironments, this);

		var environments = model.get("envManager").get("environments");
		environments.on('change', this.renderEnvironments, this);
		environments.on('reset', this.renderEnvironments, this);
		environments.on('add', this.renderEnvironments, this);
		environments.on('remove', this.renderEnvironments, this);		

		var collections = model.get("collections");

		collections.on("add", this.renderCollections, this);
		collections.on("remove", this.renderCollections, this);
		collections.on("updateCollection", this.renderCollections, this);

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
		
		$("#select-collection").html("");
		$('#select-collection').html("<option value='0'>Select</option>");
		$('#select-collection').append(Handlebars.templates.collection_selector_list({items: items}));
	},

	renderEnvironments: function() {
		var model = this.model;
		var items = _.clone(model.get("envManager").get("environments").toJSON());
		$("#select-environment").html("");
		$('#select-environment').html("<option value='0'>No environment</option>");
		$('#select-environment').append(Handlebars.templates.environment_list({items: items}));
	},

	startRun: function() {
		var target_id = $("#select-collection").val();
		var target_type = $("#select-collection option[value='" + target_id + "']").attr("data-type");

		var collection_id = 0;
		var folder_id = 0;

		if (target_type === "folder") {
			folder_id = target_id;
			collection_id = $("#select-collection option[value='" + target_id + "']").attr("data-collection-id");
		}
		else {
			collection_id = target_id;
		}

		var environment_id = $("#select-environment").val();
		var count = parseInt($("#test-run-count").val(), 10);

		var params = {
			"collection_id": collection_id,
			"folder_id": folder_id,
			"target_type": target_type,
			"environment_id": environment_id,
			"count": count
		};

		pm.mediator.trigger("startTestRun", params);
	}
});