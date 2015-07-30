define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim",
    "text!assets/tagList/templates/tag.html"
], function (Marionette, Radio, Shim, TagTemplate) {

    var TagListConstructor = function(channelName){

        var TagList = new Marionette.Application();
        TagList.Channel = Radio.channel(channelName);

        TagList.ItemView = Marionette.ItemView.extend({
            tagName: "div",
            className: "tag",
            template: _.template(TagTemplate),
            attributes: function() {
              return {
                'title': this.model.get('nombre')
              };
            },
        });

        TagList.CollectionView = Marionette.CollectionView.extend({
            tagName: "div",
            className: "taglist",
            childView: TagList.ItemView
        });

        TagList.on("start", function(options){
          // Collectionview
          TagList.collectionview = new TagList.CollectionView({collection: options.filtered});

          TagList.Channel.reply("get:root", function(){
            return TagList.collectionview;
          });

        });

        return TagList;
    };

    return TagListConstructor;
});
