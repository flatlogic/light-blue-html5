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
            },

            search: function(word){
                if (word=="") return this.slice();

                var pat = new RegExp(word, 'gi');
                return this.filter( function(mail) {
                        return pat.test(mail.get('subject')) || pat.test(mail.get('sender'));
                    }
                );
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
                "click #select-unread": 'selectUnread',
                "keyup #mailbox-search": 'search'
            },

            initialize: function() {
                this.collection = new EmailList();
                this.listenTo(this.collection, 'reset', this.renderEmails);
                this.listenTo(this.collection, 'all', this.render);
                this.$folderActions = this.$('#folder-actions');
                this.$toggleAllCheckbox = this.$('#toggle-all');
                var view = this;
                Emails.fetch({success: function(){
                    view.collection.reset(Emails.slice());
                }});
            },

            render: function() {
                var allSelected = this.collection.where({selected: true}).length == this.collection.length;
                this.$folderActions.html(this.folderActionsTemplate({allSelected: allSelected}));
                this.$toggleAllCheckbox = this.$('#toggle-all');
                this.$el.find("#toggle-all").iCheck({
                    checkboxClass: 'icheckbox_square-grey',
                    radioClass: 'iradio_square-grey'
                });
            },


            addOne: function(email) {
                var view = new EmailView({model: email});
                this.$("#folder-view").find("tbody").append(view.render().el);
            },

            renderEmails: function() {
                this.resetFolderView();
                this.collection.each(this.addOne, this);
            },

            resetFolderView: function(){
                this.$("#folder-view").find("tbody").html('');
            },

            toggleAll: function(){
                var selectAll = this.$toggleAllCheckbox.prop('checked');
                this.collection.each(function (email) { email.save({'selected': selectAll}); });
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
                _(this.collection.where({read: true})).each(function (email) { email.save({'selected': true}); });
            },

            selectUnread: function(){
                this.selectNone();
                _(this.collection.where({read: false})).each(function (email) { email.save({'selected': true}); });
            },

            search: function(){
                this.collection.reset(Emails.search($('#mailbox-search').val()));
            }

        });

        // Finally, we kick things off by creating the **App**.
        var App = new AppView;

    });
});
