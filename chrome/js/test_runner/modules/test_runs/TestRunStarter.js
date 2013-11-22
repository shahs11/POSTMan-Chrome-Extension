var TestRunStarter = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		model.on("loadedCollections", this.renderCollections, this);
		model.on("loadedEnvironments", this.renderEnvironments, this);
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
	}
});