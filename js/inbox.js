$(function(){
    $("input").iCheck({
        checkboxClass: 'icheckbox_square-grey',
        radioClass: 'iradio_square-grey'
    });
});

/*
 Inspired by https://github.com/krisys/backbone-gmail-example
 */

$(function(){

    "use strict";

    $(function(){

        var Email = Backbone.Model.extend({

            defaults:function(){
                return {
                    sender: '',
                    senderMail: '',
                    subject: '',
                    timestamp: new Date(new Date().getTime() - 2*60*60*1000).getTime(),  //two hours ago
                    read: true,
                    starred: false,
                    attachment: false,

                    selected:false
                }
            },
            markRead: function() {
                this.save( {read: true } );
            },

            toggleStarred: function() {
                this.save( { starred: !this.get("starred")} );
            },

            toggleSelected: function(){
                this.save( {selected: !this.get("selected")});
            }
        });



        var EmailList = Backbone.Collection.extend({

            model: Email,

            url: 'js/inbox.json',


            comparator: function(mail){
                return -mail.get('timestamp');
            }

        });

        var Emails = new EmailList();

        var EmailView = Backbone.View.extend({

            tagName:  "tr",

            template: _.template($('#mail-item-template').html()),


            events: {
                "click .selected-checkbox": 'toggleSelected',
                "ifToggled .selected-checkbox": 'toggleSelected',
                "click .starred": 'toggleStarred'
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


            formatDate: function(dateInt){
                var date = new Date(dateInt),
                    now = new Date(),
                    todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                if (date.getTime() > todayStart){
                    return date.getHours() + ":" + date.getMinutes();
                }
                return ['Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()] + ' ' + date.getDate();
            },

            toggleSelected: function(){
                this.model.toggleSelected();
            },

            toggleStarred: function(){
                this.model.toggleStarred();
            }

        });

        var AppView = Backbone.View.extend({


            el: $("#mailbox-app"),

            folderActionsTemplate: _.template($('#folder-actions-template').html()),

            events: {
                "click #toggle-all":  "toggleAll",
                "ifToggled #toggle-all": "toggleAll", //handle iCheck events
                "click #select-all": 'selectAll',
                "click #select-none": 'selectNone',
                "click #select-read": 'selectRead',
                "click #select-unread": 'selectUnread'
            },

            initialize: function() {
                this.listenTo(Emails, 'reset', this.addAll);
                this.listenTo(Emails, 'all', this.render);
                this.resetFolderView();
                this.addAll();
                this.$folderActions = this.$('#folder-actions');
                this.$toggleAllCheckbox = this.$('#toggle-all');
                Emails.fetch();
            },

            render: function() {
                var allSelected = Emails.where({selected: true}).length == Emails.length;
                this.$folderActions.html(this.folderActionsTemplate({allSelected: allSelected}));
                this.$toggleAllCheckbox = this.$('#toggle-all');
                this.$el.find("#toggle-all").iCheck({
                    checkboxClass: 'icheckbox_square-grey',
                    radioClass: 'iradio_square-grey'
                });
            },


            addOne: function(todo) {
                var view = new EmailView({model: todo});
                this.$("#folder-view").find("tbody").append(view.render().el);
            },

            addAll: function() {
                Emails.each(this.addOne, this);
            },

            resetFolderView: function(){
                this.$("#folder-view").find("tbody").html('');
            },

            toggleAll: function(){
                var selectAll = this.$toggleAllCheckbox.prop('checked');
                Emails.each(function (email) { email.save({'selected': selectAll}); });
            },

            selectAll: function(){
                this.$toggleAllCheckbox.prop('checked', true);
                this.toggleAll();
            },

            selectNone: function(){
                this.$toggleAllCheckbox.prop('checked', false);
                this.toggleAll();
            },

            selectRead: function(){
                this.selectNone();
                _(Emails.where({read: true})).each(function (email) { email.save({'selected': true}); });
            },

            selectUnread: function(){
                this.selectNone();
                _(Emails.where({read: false})).each(function (email) { email.save({'selected': true}); });
            }

        });

        // Finally, we kick things off by creating the **App**.
        var App = new AppView;

    });
});
