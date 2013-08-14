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

    var Mail = Backbone.Model.extend( {

        defaults: {
            subject: '',
            read: false,
            star: false,
            selected:false,
            archived:false,
            label: ''
        },
        markRead: function() {
            this.save( {read: true } );
        },

        starMail: function() {
            this.save( { star: !this.get("star")} );
        },

        archive: function(){
            this.save( { archived: true, selected:false} );
        },

        selectMail: function() {
            this.save( { selected: !this.get("selected")} );
        },

        setLabel: function(label){
            this.save( { label: label } );
        }
    });



    var MailList = Backbone.Collection.extend({
        model: Mail,

        localStorage: new Store("mails"),

        unread: function() {
            return _(this.filter( function(mail) { return !mail.get('read');} ) );
        },

        inbox: function(){
            return _(this.filter( function(mail) { return !mail.get('archived');}));
        },

        starred: function(){
            return _(this.filter( function(mail) { return mail.get('star');}));
        },

        unread_count: function() {
            return (this.filter ( function(mail) { return !mail.get('read');})).length;
        },

        labelled:function(label){
            return _(this.filter( function(mail) { return label in mail.get('label') } ));
        },

        starcount: function(){
            return (this.filter( function(mail) { return mail.get('star')})).length;
        },

        search: function(word){
            if (word=="") return this;

            var pat = new RegExp(word, 'gi');
            return _(this.filter(function(mail) {
                return pat.test(mail.get('subject')) || pat.test(mail.get('sender')); }));
        },
        comparator: function(mail){
            return -mail.get('timestamp');
        }

    });

    var MailView = Backbone.View.extend({
        tagName: "li",

        template: _.template( $("#mail-item").html()),

        events: {
            "click .mail-subject,.sender" : "markRead",
            "click .star" : "star",
            "click .check" : "select"
        },

        initialize: function() {
            this.model.bind('change', this.render, this);
        },

        render: function() {
            $(this.el).html( this.template(this.model.toJSON()) );
            return this;
        },

        unrender: function(){
            $(this.el).remove();
        },

        markRead: function() {
            this.model.markRead();
        },

        star: function() {
            this.model.starMail();
        },

        select: function(){
            this.model.selectMail();
        }
    });


    var InboxView = Backbone.View.extend({
        template: _.template($("#summary-tmpl").html()),

        el: $("#mailapp"),

        initialize: function(){

            this.collection.bind('change', this.renderSideMenu, this);
            this.render(this.collection);
            this.renderSideMenu();
        },

        events: {
            "change #labeler" : "applyLabel",
            "click #markallread" : "markallread",
            "click #archive" : "archive",
            "click #allmail" : "allmail",
            "click #inbox": "inbox",
            "click #starred": "starred",
            "keyup #search" : "search"
        },

        search: function(){
            this.render(this.collection.search($("#search").val()));
        },
        starred: function(){
            this.render(this.collection.starred());
        },

        inbox: function(){
            this.render(this.collection.inbox());
        },

        allmail: function(){
            this.render(this.collection);
        },

        markallread : function(){
            this.collection.each(function(item){
                item.markRead();
            }, this);
        },

        applyLabel: function(){

            var label = $("#labeler").val();
            this.collection.each(function(item){
                if(item.get('selected') == true){
                    item.setLabel(label);
                }
            }, this);
        },

        archive: function(){
            this.collection.each(function(item){
                if(item.get('selected') == true){
                    item.archive();
                }
            }, this);
            this.render(this.collection.inbox());
        },

        render: function(records){
            $('ul#mail-list', this.el).html('');
            var self = this;
            records.each(function(item){
                self.addOne(item);
            }, this);
        },

        renderSideMenu: function(){
            $("#sidemenu").html( this.template(
                {'inbox': this.collection.unread_count(),
                    'starred':this.collection.starcount(),}));
        },

        addOne: function (mail) {
            var itemView = new MailView({ model: mail});

            $('ul#mail-list', this.el).append(itemView.render().el);
        }
    });

    var list = new MailList(data); // loaded from data.js
    var App = new InboxView({collection:list}) ;
});
