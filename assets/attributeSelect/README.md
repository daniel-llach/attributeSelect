# AttributeSelect
:rooster:
Start example:
```javascript
attrselect.start({
    models: attrCollection,
    filtered: filterCollection
});
```
## models:
  Must be a *Collection* with all models

## filtered:
  The same same *Collection* filtered with the actual selection

  *example:*
  ```javascript
  var EmptyCollection = Backbone.Collection.extend();
  var attrCollection = new EmptyCollection(optionArray); // collection all

  var filter = [];
  _.each(selectionArray, function(attr){
    var option = attrCollection.findWhere({
      "id": attr.id
    });
    var option_prior = _.clone(option.toJSON());
    option_prior["prioridad"] = attr.prioridad;
    filter.push(option_prior);
  });
  var filterCollection = new EmptyCollection(filter); // collection filter
  ```
