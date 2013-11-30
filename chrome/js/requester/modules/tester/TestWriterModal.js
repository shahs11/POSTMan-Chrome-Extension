var TestWriterModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        pm.mediator.on("showTestWriter", this.render, this);

        $('#modal-test-writer .btn-primary').click(function () {
            var id = $('#form-test-writer .collection-request-id').val();
            var code = view.editor.getValue();
            model.updateCollectionRequestTests(id, code);
            $('#modal-test-writer').modal('hide');
        });

        $("#modal-test-writer").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-test-writer");
        });

        $("#modal-test-writer").on("hidden", function () {
            pm.app.trigger("modalClose");
        });
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = CodeMirror.fromTextArea(document.getElementById("test-writer-editor"), {
            mode: 'javascript',
            theme: "eclipse",
            lineWrapping: true,
            lineNumbers:true,
            extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
        });

        pm.editCollectionRequestEditor = this.editor;

        this.editor.refresh();
    },

    render: function(request) {
        $('#form-test-writer .collection-request-id').val(request.get("collectionRequestId"));
        $('#modal-test-writer').modal('show');

        if (!this.editor) {
            this.initializeEditor();
        }

        var view = this;

        setTimeout(function() {
            if (request.get("tests") !== null) {
                view.editor.setValue(request.get("tests"));
                view.editor.refresh();
            }
            else {
                view.editor.setValue("");
            }

            CodeMirror.commands["goDocStart"](view.editor);
        }, 750);

    }
});
