$(function(){
    $("input").iCheck({
        checkboxClass: 'icheckbox_square-grey',
        radioClass: 'iradio_square-grey'
    });
});

var dummyBodies = ["<p>Why painful the sixteen how minuter looking nor. Subject but why ten earnest husband imagine sixteen brandon. Are unpleasing occasional celebrated motionless unaffected conviction out. Evil make to no five they. Stuff at avoid of sense small fully it whose an. Ten scarcely distance moreover handsome age although. As when have find fine or said no mile. He in dispatched in imprudence dissimilar be possession unreserved insensible. She evil face fine calm have now. Separate screened he outweigh of distance landlord.</p>",
"somm text bodt. Reall small. ust few lines", "<p>Lose john poor same it case do year we. Full how way even the sigh. Extremely nor furniture fat questions now provision incommode preserved. Our side fail find like now. Discovered travelling for insensible partiality unpleasing impossible she. Sudden up my excuse to suffer ladies though or. Bachelor possible marianne directly confined relation as on he.</p>",
"empty"];

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
                    body: dummyBodies[Math.round(Math.random()*3)],
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
                App.showEmailsView();
            }

        });

        var EmailList = Backbone.Collection.extend({

            model: Email,

            url: 'js/emails.json',


            comparator: function(mail){
                return -mail.get('timestamp');
            },

            search: function(word, folderId){
                if (word=="") return this.where({folderId: folderId});

                var pat = new RegExp(word, 'gi');
                return this.filter( function(mail) {
                        return mail.get("folderId") == folderId && pat.test(mail.get('subject')) || pat.test(mail.get('sender'));
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
                "click .starred": 'toggleStarred',
                "click .name,.subject": 'openEmail'
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
            },

            openEmail: function(){
                this.model.save({read: true});
                App.setCurrentView(new EmailOpenedView({model: this.model}));
            }

        });

        //noinspection JSJQueryEfficiency
        var EmailOpenedView = Backbone.View.extend({


            template: _.template($('#email-view-template').html()),

            attributes: {
                id: 'email-view',
                class: 'email-view'
            },


            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },


            formatDate: function(dateInt){
                var date = new Date(dateInt),
                    now = new Date(),
                    todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                if (date.getTime() > todayStart){
                    return date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                }
                var daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                return ['Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()] + ' ' + date.getDate() + ' (' + daysAgo + ' days ago)';
            }

        });

        var EmailListView = Backbone.View.extend({

            tagName: 'table',

            attributes: {
                id: 'folder-view',
                class: 'folder-view table table-striped'
            },


            template: _.template($('#folders-view-template').html()),

            folderActionsTemplate: _.template($('#folder-actions-template').html()),

            events: {
                "click #toggle-all":  "toggleAll",
                "ifToggled #toggle-all": "toggleAll", //handle iCheck events
                "click #select-all": 'selectAll',
                "click #select-none": 'selectNone',
                "click #select-read": 'selectRead',
                "click #select-unread": 'selectUnread',
                "click #mark-as-read": 'markSelectedAsRead',
                "click #mark-as-unread": 'markSelectedAsUnread',
                "click #delete": 'deleteEmails'
            },


            initialize: function() {
                this.currentFolderEmails = new EmailList();
                this.folders = Folders;

                this.listenTo(this.currentFolderEmails, 'reset', this.renderEmails);  //when displayed first time, and after
                this.listenTo(this.currentFolderEmails, 'all', this.renderFolderActions); //when something starred or selected display folder actions
                this.listenTo(this.currentFolderEmails, 'destroy', this.renderEmails); //when model deleted
                this.listenTo(this.folders, 'change', this.resetEmails); //when current folder changed
            },

            render: function() {
                this.resetEmails();
                this.delegateEvents(this.events);
                return this;
            },

            renderFolderActions: function() {
                var selectedCount = this.currentFolderEmails.where({selected: true}).length,
                    allSelected = selectedCount == this.currentFolderEmails.length,
                    anySelected = selectedCount > 0;
                this.$('#folder-actions').html(this.folderActionsTemplate({allSelected: allSelected, anySelected: anySelected}));
                this.$toggleAllCheckbox = this.$('#toggle-all');
                this.$el.find("#toggle-all").iCheck({
                    checkboxClass: 'icheckbox_square-grey',
                    radioClass: 'iradio_square-grey'
                });
            },


            addOne: function(email) {
                var view = new EmailView({model: email});
                this.$el.find("tbody").append(view.render().el);
            },

            renderEmails: function() {
                this.reset();
                this.currentFolderEmails.each(this.addOne, this);
                var currentFolder = this.folders.where({current: true})[0],
                    unreadCount = this.currentFolderEmails.where({read: false}).length,
                    currentFolderTitle = 'Inbox';
                if (currentFolder){
                    currentFolderTitle = currentFolder.get("name");
                }
                $('#folder-title').html(currentFolderTitle + ' <small>(' + unreadCount + ' unread messages)</small>')
            },

            reset: function(){
                this.$el.html(this.template());
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
                var item = this.folders.where({current: true})[0],
                    folderId = 1;
                if (item){
                    folderId = item.get("id");
                }
                this.currentFolderEmails.reset(Emails.search($('#mailbox-search').val(), folderId));
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



        var EmailsView = new EmailListView();



        var AppView = Backbone.View.extend({


            el: $("#mailbox-app"),
            $content: $("#mailbox-content"),

            events: {
                "keyup #mailbox-search": 'search'
            },

            initialize: function() {
                this.currentView = EmailsView;
                this.folders = Folders;

                this.listenTo(this.folders, 'reset', this.renderFolders);

                var view = this;
                this.folders.fetch({success: function(){
                    Emails.fetch({success: function(){
                        view.render();
                    }});
                }});
            },

            render: function(){
                this.$content.html(this.currentView.render().el);
            },

            setCurrentView: function(view){
                this.currentView = view;
                this.render();
            },

            renderFolders: function(){
                this.resetFoldersList();
                this.folders.each(this.addFolder, this);
            },

            resetFoldersList: function(){
                this.$("#folders-list").html('');
            },

            addFolder: function(folder){
                var view = new FolderView({model: folder});
                this.$("#folders-list").append(view.render().el);
            },

            search: function(){
                if (typeof this.currentView.search === 'function'){
                    this.currentView.search();
                }
            },

            showEmailsView: function(){
                if (this.currentView != EmailsView){
                    this.setCurrentView(EmailsView)
                }
            }

        });

        var App = new AppView;

    });
});
