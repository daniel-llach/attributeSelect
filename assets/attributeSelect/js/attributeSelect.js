define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim",
    "../../taglist/js/taglist",
    "../../typeahead/js/typeahead",
    "text!assets/attributeSelect/templates/attrselect.html",
    "text!assets/attributeSelect/templates/option.html"
], function (Marionette, Radio, Shim, TagList, TypeAhead, AttrSelectTemplate, OptionTemplate) {

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
              "select": ".select .items"
            },
            ui: {
              "input": ".input",
              "options": ".options",
              "option": ".options .option",
              "add": ".add"
            },
            events: {
              "click @ui.input": "showOptions",
              "click @ui.add": "add"
            },
            showOptions: function(){
              this.ui.options.toggleClass("show");
            },
            add: function(){
              alert('add');
            }
        });

        AttrSelect.ItemView = Marionette.ItemView.extend({
            tagName: "div",
            className: "option",
            template: _.template(OptionTemplate),
            ui: {
              "input": "input",
              "remove": ".remove"
            },
            events: {
              "change @ui.input": "editPrior",
              "focusout @ui.input": "sorterPrior",
              "mouseenter": "showRemove",
              "mouseleave": "removeRemove",
              "click @ui.remove": "removeOption"
            },
            editPrior: function(event){
              var prior = parseInt( $(event.target).val() );
              this.model.set({"prioridad": prior});
              this.markup();
            },
            markup: function(){
              this.$el.css({
                "background-color": "#EBEF82"
              });
            },
            sorterPrior: function(){
              this.render(); // gatilla sort collection
            },
            showRemove: function(){
              this.$el.find(".remove").addClass("show");
            },
            removeRemove: function(){
              this.$el.find(".remove").removeClass("show");
            },
            removeOption: function(){
              this.model.collection.remove([{"cid": this.model.cid}]);
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
          AttrSelect.filterview = new AttrSelect.CollectionView({collection: options.filtered});
          console.log("AttrSelect.filterview: ", AttrSelect.filterview);

          AttrSelect.Channel.reply("get:root", function(){
            return AttrSelect.RootView;
          });

          AttrSelect.RootView.on("show", function(){
            // collectionview
            AttrSelect.RootView.getRegion("view").show(AttrSelect.filterview);

            // taglist
            var taglist = new TagList("taglist");
            taglist.start({
                filtered: options.filtered
            });
            var taglistChannel = Radio.channel("taglist");
            var taglistview = taglistChannel.request("get:root");
            AttrSelect.RootView.getRegion("input").show(taglistview);

            // typeAhead
            var typeAhead = new TypeAhead("typeahead");
            typeAhead.start({
              // containerHeight: this.$el.outerHeight(),
              separator: "__",
              displayKeys: ["value"],
              models: options.models.toArray()
            });
            var typeAheadChannel = Radio.channel("typeahead");
            var typeAheadview = typeAheadChannel.request("get:root");
            AttrSelect.RootView.getRegion("select").show(typeAheadview);

          });
        });

        return AttrSelect;
    };

    return AttrSelectConstructor;
});
