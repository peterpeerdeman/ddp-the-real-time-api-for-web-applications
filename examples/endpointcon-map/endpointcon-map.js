Avatars = new Mongo.Collection('avatars');

var MAP_WIDTH = 1250;
var MAP_HEIGHT = 1178;

if (Meteor.isClient) {
    Template.body.onCreated(function() {
        this.subscribe('avatars');
    });

    Template.body.onRendered(function() {
        this.$('.avatars').draggable();
    });

    Template.body.helpers({
        avatars: function() {
            return Avatars.find();
        }
    });

    Template.body.events({
        'mouseover .avatar, touchstart .avatar': function(e) {
            var $target = $(e.target);
            if (!$target.data('isDraggable')) {
                $target.data('isDraggable', true).draggable({
                    containment: 'parent'
                });
            }
        },
        'dragstop .avatar, touchend .avatar': function(event) {
            var left;
            var top;

            if (event.type == 'touchend') {
                left = event.originalEvent.changedTouches[0].pageX,
                    top = event.originalEvent.changedTouches[0].pageY
            } else {
                left = event.pageX - event.offsetX,
                    top = event.pageY - event.offsetY
            }
            Avatars.update(this._id, {
                $set: {
                    left: left,
                    top: top
                }
            })
        }
    });
}

if (Meteor.isServer) {
    function fillAvatarsFromFeed() {
        var result = HTTP.get('https://api.import.io/store/data/5afd8c3c-7bbe-491f-ae5f-a1b012325d42/_query?input/webpage/url=http%3A%2F%2Fendpointcon.com%2Fposts%2Fcategory%2Fspeakers%2F&_user=c4ee432d-97e4-42f2-8d48-d2ddf66c0f6f&_apikey=c4ee432d97e442f28d48d2ddf66c0f6fdefceba3243d262f9e366a19132951ace9777a9cbf3cb4c9415381a5808174b22aeb664cd85342c8ac92f8b6042495a0e9daddbe71766783c0549fa57b2683d1');
        var speakers = JSON.parse(result.content).results;
        speakers.forEach(function(speaker) {
            speaker.top = Math.random() * 800 + 15;
            speaker.left = Math.random() * 800 + 15;
            Avatars.insert(speaker);
        });
    }

    Meteor.startup(function() {
        if (Avatars.find().count() == 0) {
            fillAvatarsFromFeed();
        }
    });

    Meteor.publish('avatars', function() {
        return Avatars.find();
    });

    Avatars.allow({
        update: function(userId, doc) {
            return true;
        }
    })
};
