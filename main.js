
/*/////// PAGE ////////////////////*/

var Message = Backbone.Model.extend({
});

var Messages = Backbone.Collection.extend({
    model: Message
});

var HomePage = Backbone.View.extend({
    
    id : 'home-page',
    
    events: {
        'click #addMessage': 'addMessage'
    },
    
    initialize: function (options) {
        this.messages = new Messages();
        this.messageListView = new MessagesView({messages: this.messages});
    },
    
    addMessage: function (evt) {
        evt.preventDefault();
        this.messages.add(new Message({text: this.$('#messageText').val()}));
    },
    
    render : function() {    
        var that = this;      
        $.ajax({ 
            url: "home-template.html" 
        }).done(function(content) {
            //console.log(content);
            var template = content;
            that.$el.html(template);
            that.$el.append(that.messageListView.render());
            that.attributes.container.append(that.$el);
        });
    }     
});

var MessageItemView = Backbone.View.extend({
    tagName: 'li',
    
    render: function () {
        this.$el.text(this.model.get('text'));
        return this.$el;
    }
});

var MessagesView = Backbone.View.extend({
    tagName: 'ul',
    id: 'messagList',
    
    initialize: function (options) {
        this.messages = options.messages;
        this.listenTo(this.messages, 'add', this.render);
    },
    
    render: function () {
        this.$el.html('');
        _.inject(this.messages.models, function (el, message) {
            el.append(new MessageItemView({model: message}).render());
            return el;
        }, this.$el);
        return this.$el;
    }
});

/*/////// PROFILE PAGE ////////////////////*/

var ProfilePage = Backbone.View.extend({
    id : 'profile-page',
    
    render : function() {    
        var that = this;      
        $.ajax({ 
            url: "profile-template.html" 
        }).done(function(content) {
            var template = content;
            that.$el.append(template);
            that.attributes.container.append(that.$el);
        });
    }  
});


/*/////// WORK PAGE ////////////////////*/

var WorkPage = Backbone.View.extend({
    id : 'work-page',
    
    render : function() {    
        var that = this;      
        $.ajax({ 
            url: "work-template.html" 
        }).done(function(content) {
            var template = content;
            that.$el.html(template);
            that.attributes.container.append(that.$el);
        });
    }  
});



var Router = Backbone.Router.extend({
    routes: {
        ''          :   'home',
        'home'      :   'home',
        'profile'   :   'profile',
        'work'      :   'work'
    },
    
    _renderPage: function (viewConstructor) {
        if (this.currentView) {
            this.currentView.remove();
        }
        this.currentView = new viewConstructor({attributes: {container: $('.page')}});
        this.currentView.render();
    },
    
    home: function () {
        this._renderPage(HomePage);
    },
    
    profile: function () {
        this._renderPage(ProfilePage);
    },
    
    work: function () {
        this._renderPage(WorkPage);
    }
    
});

$(function () {
        var router = new Router();
        Backbone.history.start();
});
