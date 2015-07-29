define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim",
    "text!assets/attributeSelect/templates/attrselect.html",
    "text!assets/attributeSelect/templates/option.html"
], function (Marionette, Radio, Shim, AttrSelectTemplate, OptionTemplate) {

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
                "background-color": "yellow"
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
          // Option > view > collectionview

          AttrSelect.RootView.on("show", function(){
            AttrSelect.RootView.getRegion("view").show(AttrSelect.collectionview);
          });


          console.log("options.models: ", options.models);
          console.log("options.filtered: ", options.filtered);
            // AttrSelect.optionCollection = options.models;
            //
            // AttrSelect.optionArrayPool = new OptionCollection();
            // AttrSelect.optionArrayPool.reset(AttrSelect.optionCollection.toArray());
            //
            // AttrSelect.RootView = new AttrSelect.OptionCompositeView({
            //     collection: AttrSelect.optionArrayPool,
            //     displayKeys: options.displayKeys
            // });
            //
            // AttrSelect.Channel.reply("get:root", function(){
            //     return AttrSelect.RootView;
            // });
        });

        return AttrSelect;
    };

    return AttrSelectConstructor;
});
