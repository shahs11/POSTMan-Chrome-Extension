var AppState = Backbone.Model.extend({
    defaults: function() {
        return {
        	id:0,
        	variableProcessor:null,
            isModalOpen:false,
            activeModal: ""
        };
    },

    initialize: function(options) {
    	this.set("id", guid());

    	this.initializeInternalMessaging();
    },

    sendMessageObject: function(e, object) {
    	var message = {
    		"id": this.get("id"),
    		"event": e,
    		"object": object
    	};

    	chrome.runtime.sendMessage(message);
    },

    initializeInternalMessaging: function() {
    	var model = this;

    	pm.mediator.on("sendMessageObject", this.sendMessageObject, this);

    	chrome.runtime.onMessage.addListener(function(message) {
    		if (model.get("id") !== message.id) {
    			console.log("Received message from another window", message);
    		}
    		else {
    			console.log("Received message from the same window", message);
    		}

    	});
    }
});