$(function(){

    if (window.localStorage.getItem("chat-simple") != null){
        var messages = window.localStorage.getItem("chat-simple").split(",");
        for (var i = 0; i < messages.length; i++){
            localStorage.removeItem("chat-simple-" + messages[i]);
        }
    }

    var Message = Backbone.Model.extend({

        defaults: function() {
            return {
                text: "empty...",
                order: Messages.nextOrder()
            };
        },

        initialize: function() {
            if (!this.get("text")) {
                this.set({"text": this.defaults().text});
            }
        }

    });

    var MessageList = Backbone.Collection.extend({
        model: Message,
        localStorage: new Backbone.LocalStorage("chat-simple"),
        nextOrder: function() {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },
        comparator: function(message) {
            return message.get('order');
        }

    });

    var Messages = new MessageList;

    var MessageView = Backbone.View.extend({

        className: 'message from-me',

        template: _.template($('#message-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        // Re-render the titles of the todo item.
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }

    });

    var AppView = Backbone.View.extend({

        el: $("#chat-app"),

        events: {
            "keypress #new-message":  "createOnEnter"
        },

        initialize: function() {

            this.input = this.$("#new-message");

            this.listenTo(Messages, 'add', this.addOne);
            this.listenTo(Messages, 'all', this.render);

            Messages.fetch();
        },

        addOne: function(message) {
            var view = new MessageView({model: message});
            this.$("#messages-view").append(view.render().el);
        },

        createOnEnter: function(e) {
            if (Messages.length < 10){
                if (e.keyCode != 13) return;
                if (!this.input.val()) return;

                Messages.create({text: this.input.val()});
                this.input.val('');

                var view = this.$("#messages-view")[0];
                view.scrollTop = view.scrollHeight;
            }
        }

    });

    // Finally, we kick things off by creating the **App**.
    var App = new AppView;
});