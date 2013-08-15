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
var twoHoursAgo = new Date(new Date().getTime() - 2*60*60*1000);
var data = [
    {'sender': 'Google', 'subject': 'Hi, Welcome to Google Mail', read: false, starred: true, 'timestamp': twoHoursAgo },
    {'sender': 'StackExchange', 'subject': 'New Python questions for this week!',  read: false, attachment: true, 'timestamp': new Date(2013, 7, 2, 10,30,45) },
    {'senderMail': 'notifications@facebook.com', 'subject': 'Someone just commented on your photo!', 'timestamp': new Date(2013, 7, 1, 10,30,45) },
    {'sender': 'Twitter', 'subject': '@hackernews is now following you on Twitter', starred: true, attachment: true, 'timestamp': new Date(2013, 6, 20, 10,30,45) },
    {'sender': 'LinkedIn', 'subject': 'Jobs you may be interested in', 'timestamp': new Date(2013, 6, 11, 10,30,45) }
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
                    read: true,
                    starred: false,
                    attachment: false,

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

            render: function() {
                this.$el.addClass(this.model.get("read") ? '' : 'unread');
                this.$el.html(this.template(this.model.toJSON()));
                this.$el.find("input[type='checkbox']").iCheck({
                    checkboxClass: 'icheckbox_square-grey',
                    radioClass: 'iradio_square-grey'
                });
                return this;
            },


            formatDate: function(date){
                var now = new Date(),
                    todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                if (date.getTime() > todayStart){
                    return date.getHours() + ":" + date.getMinutes();
                }
                return ['Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()] + ' ' + date.getDate();
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
