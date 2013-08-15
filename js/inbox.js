$(function(){
    $("input").iCheck({
        checkboxClass: 'icheckbox_square-grey',
        radioClass: 'iradio_square-grey'
    });
});

/*
 Inspired by https://github.com/krisys/backbone-gmail-example
 */

//test data, can be loaded via ajax
var data = [
    {'sender': 'Google', 'subject': 'Hi, Welcome to Google Mail', 'timestamp': new Date(2011, 11, 20, 10,30,45) },
    {'sender': 'StackExchange', 'subject': 'New Python questions for this week!',  'timestamp': new Date(2011, 10, 20, 10,30,45) },
    {'sender': 'Facebook', 'subject': 'Someone just commented on your photo!', 'timestamp': new Date(2011, 9, 20, 10,30,45) },
    {'sender': 'Twitter', 'subject': '@hackernews is now following you on Twitter', 'timestamp': new Date(2011, 8, 20, 10,30,45) },
    {'sender': 'LinkedIn', 'subject': 'Jobs you may be interested in', 'timestamp': new Date(2011, 7, 11, 10,30,45) }
];

$(function(){

    "use strict";

    $(function(){

        var Email = Backbone.Model.extend({

            defaults:function(){
                return {
                    sender: '',
                    senderMail: '',
                    subject: '',
                    timestamp: new Date(),
                    read: false,
                    star: false,
                    selected:false
                }
            },
            markRead: function() {
                this.save( {read: true } );
            },

            starMail: function() {
                this.save( { star: !this.get("star")} );
            },

            selectMail: function() {
                this.save( { selected: !this.get("selected")} );
            }

        });


        var EmailList = Backbone.Collection.extend({

            model: Email,

            localStorage: new Backbone.LocalStorage("todos-backbone"),


            comparator: function(mail){
                return -mail.get('timestamp');
            }

        });

        var Emails = new EmailList(data);

        var EmailView = Backbone.View.extend({

            tagName:  "tr",

            template: _.template($('#mail-item-template').html()),


            events: {
            },


            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            // Re-render the titles of the todo item.
            render: function() {
                this.$el.addClass(this.model.get("read") ? '' : 'unread');
                this.$el.html(this.template(this.model.toJSON()));
                this.$el.find("input[type='checkbox']").iCheck({
                    checkboxClass: 'icheckbox_square-grey',
                    radioClass: 'iradio_square-grey'
                });
                return this;
            }

        });

        var AppView = Backbone.View.extend({


            el: $("#mailbox-app"),

            initialize: function() {
                this.listenTo(Emails, 'all', this.render);
                this.reset();
                this.addAll();
            },

            render: function() {
            },


            addOne: function(todo) {
                var view = new EmailView({model: todo});
                this.$("#folder-view").find("tbody").append(view.render().el);
            },

            addAll: function() {
                Emails.each(this.addOne, this);
            },

            reset: function(){
                this.$("#folder-view").find("tbody").html('');
            }

        });

        // Finally, we kick things off by creating the **App**.
        var App = new AppView;

    });
});
