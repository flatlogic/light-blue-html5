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

        var STARRED_FOLDER_ID = 33;

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
                    folderId: 1,

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


        var Folder = Backbone.Model.extend({

            defaults: {
                name: '',
                current: false,
                order: 100
            },

            sync: function(){
                //just swallow this call
            }
        });

        var FolderList = Backbone.Collection.extend({

            model: Folder,

            url: 'js/folders.json',


            comparator: 'order',

            parse: function(response){
                //add fake starred folder
                response.push({name: 'Starred', id: STARRED_FOLDER_ID, order: 4});
                return response;
            }
        });

        var Folders = new FolderList();

        var FolderView = Backbone.View.extend({

            tagName:  "li",

            template: _.template($('#folder-template').html()),

            events: {
                "click": 'selectFolder'
            },


            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            render: function() {
                this.$el.attr('class', this.model.get("current") ? 'active' : '');
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },


            selectFolder: function(){
                var that = this;
                Folders.each(function(folder){
                    folder.save({current: folder == that.model})
                });
            }

        });

        var EmailList = Backbone.Collection.extend({

            model: Email,

            url: 'js/emails.json',


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
                this.$el.attr('class', this.model.get("read") ? '' : 'unread');
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
                    return date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
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
                "keyup #mailbox-search": 'search',
                "click #mark-as-read": 'markSelectedAsRead',
                "click #mark-as-unread": 'markSelectedAsUnread',
                "click #delete": 'deleteEmails'
            },

            initialize: function() {
                this.currentFolderEmails = new EmailList();
                this.folders = Folders;

                this.listenTo(this.currentFolderEmails, 'reset', this.renderEmails);
                this.listenTo(this.currentFolderEmails, 'all', this.renderFolderActions);
                this.listenTo(this.currentFolderEmails, 'destroy', this.renderEmails);
                this.listenTo(this.folders, 'reset', this.renderFolders);
                this.listenTo(this.folders, 'change', this.resetEmails);


                this.$folderActions = this.$('#folder-actions');
                this.$toggleAllCheckbox = this.$('#toggle-all');
                var view = this;
                this.folders.fetch({success: function(){
                    Emails.fetch({success: function(){
                        view.resetEmails();
                    }});
                }});
            },

            renderFolderActions: function() {
                var selectedCount = this.currentFolderEmails.where({selected: true}).length,
                    allSelected = selectedCount == this.currentFolderEmails.length,
                    anySelected = selectedCount > 0;
                this.$folderActions.html(this.folderActionsTemplate({allSelected: allSelected, anySelected: anySelected}));
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
                this.currentFolderEmails.each(this.addOne, this);
                var currentFolder = this.folders.where({current: true})[0],
                    unreadCount = this.currentFolderEmails.where({read: false}).length,
                    currentFolderTitle = 'Inbox';
                if (currentFolder){
                    currentFolderTitle = currentFolder.get("name");
                }
                this.$('#folder-title').html(currentFolderTitle + ' <small>(' + unreadCount + ' unread messages)</small>')
            },


            renderFolders: function(){
                this.resetFoldersList();
                this.folders.each(this.addFolder, this);
            },

            resetFolderView: function(){
                this.$("#folder-view").find("tbody").html('');
            },

            resetEmails: function(){
                var item = this.folders.where({current: true})[0],
                    folderId = 1;
                if (item){
                    folderId = item.get("id");
                }
                if (folderId == STARRED_FOLDER_ID){
                    this.currentFolderEmails.reset(Emails.where({
                        starred: true
                    }));
                } else {
                    this.currentFolderEmails.reset(Emails.where({
                        folderId: folderId
                    }));
                }
            },

            resetFoldersList: function(){
                this.$("#folders-list").html('');
            },

            addFolder: function(folder){
                var view = new FolderView({model: folder});
                this.$("#folders-list").append(view.render().el);
            },

            toggleAll: function(){
                var selectAll = this.$toggleAllCheckbox.prop('checked');
                this.currentFolderEmails.each(function (email) { email.save({'selected': selectAll}); });
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
                _(this.currentFolderEmails.where({read: true})).each(function (email) { email.save({'selected': true}); });
            },

            selectUnread: function(){
                this.selectNone();
                _(this.currentFolderEmails.where({read: false})).each(function (email) { email.save({'selected': true}); });
            },

            search: function(){
                this.currentFolderEmails.reset(Emails.search($('#mailbox-search').val()));
            },

            markSelectedAsRead: function(){
                _(this.currentFolderEmails.where({selected: true})).each(function (email) { email.save({'read': true}); });
            },

            markSelectedAsUnread: function(){
                _(this.currentFolderEmails.where({selected: true})).each(function (email) { email.save({'read': false}); });
            },

            deleteEmails: function(){
                _(this.currentFolderEmails.where({selected: true})).each(function (email) { email.destroy(); });
            }

        });

        var App = new AppView;

    });
});
