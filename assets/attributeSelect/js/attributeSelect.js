define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim",
    "../../taglist/js/taglist",
    "text!assets/attributeSelect/templates/attrselect.html",
    "text!assets/attributeSelect/templates/option.html"
], function (Marionette, Radio, Shim, TagList, AttrSelectTemplate, OptionTemplate) {

    var AttrSelectConstructor = function(channelName){

        var AttrSelect = new Marionette.Application();
        AttrSelect.Channel = Radio.channel(channelName);

        AttrSelect.LayoutView = Marionette.LayoutView.extend({
            tagName: "div",
            className: "attrselect",
            template: _.template(AttrSelectTemplate),
            regions: {
              "input": ".input",
              "view": ".view",
              "select": ".select"
            },
            ui: {
              "input": ".input",
              "options": ".options"
            },
            events: {
              "click @ui.input": "showOptions"
            },
            showOptions: function(){
              this.ui.options.toggleClass("show");
            }
        });

        AttrSelect.ItemView = Marionette.ItemView.extend({
            tagName: "div",
            className: "option",
            template: _.template(OptionTemplate),
            ui: {
              "input": "input"
            },
            events: {
              "change @ui.input": "editPrior",
              "focusout @ui.input": "sorterPrior"
            },
            editPrior: function(event){
              var prior = parseInt( $(event.target).val() );
              this.model.set({"prioridad": prior});
              this.markup();
            },
            markup: function(){
              this.$el.css({
                "background-color": "#EBEF82"
              })
            },
            sorterPrior: function(){
              this.render(); // gatilla sort collection
            }

        });

        AttrSelect.CollectionView = Marionette.CollectionView.extend({
            tagName: "div",
            className: "optionViewCol",
            reorderOnSort: true,
            childView: AttrSelect.ItemView,
            childEvents: {
              render: function() {
                this.collection.comparator = 'prioridad';
                this.collection.sort();
              }
            }

        });

        AttrSelect.on("start", function(options){
          // LayoutView
          AttrSelect.RootView = new AttrSelect.LayoutView();
          AttrSelect.collectionview = new AttrSelect.CollectionView({collection: options.filtered});

          AttrSelect.Channel.reply("get:root", function(){
            return AttrSelect.RootView;
          });

          AttrSelect.RootView.on("show", function(){
            // collectionview
            AttrSelect.RootView.getRegion("view").show(AttrSelect.collectionview);

            // taglist
            var taglist = new TagList("taglist");
            taglist.start({
                filtered: options.filtered
            });
            console.log("ok");
            var taglistChannel = Radio.channel("taglist");
            var taglistview = taglistChannel.request("get:root");
            AttrSelect.RootView.getRegion("input").show(taglistview);

          });
        });

        return AttrSelect;
    };

    return AttrSelectConstructor;
});
