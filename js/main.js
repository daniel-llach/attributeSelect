"use strict";

require.config({
    paths : {
        backbone : "../bower_components/backbone/backbone",
        underscore : "../bower_components/underscore/underscore",
        jquery : "../bower_components/jquery/dist/jquery",
        "backbone.marionette" : "../bower_components/backbone.marionette/lib/core/backbone.marionette",
        "backbone.radio" : "../bower_components/backbone.radio/build/backbone.radio",
        "backbone.babysitter" : "../bower_components/backbone.babysitter/lib/backbone.babysitter",
        text: "../bower_components/requirejs-text/text",
        "assets": "../assets"
    },
    enforceDefine: true,
    map: {
        '*': {
            'backbone.wreqr': 'backbone.radio'
        }
    }
});

define([
  "backbone.marionette",
  "backbone.radio",
  "radio.shim",
  "../assets/attributeSelect/js/attributeSelect"
], function (Marionette, Radio, Shim, AttrSelect) {
    // App.start();
    window.Radio = Radio;

    var EmptyCollection = Backbone.Collection.extend();
    var optionArray = [
       {
          "id":2,
          "tipo_id":3,
          "nombre":"FIN DE SEMANA",
          "codigo":"FS",
          "nativo":false,
          "usable":true
       },
       {
          "id":3,
          "tipo_id":3,
          "nombre":"DIURNO",
          "codigo":"D",
          "nativo":false,
          "usable":true
       },
       {
          "id":7,
          "tipo_id":3,
          "nombre":"S\u00c1BADO DE JORNADA U",
          "codigo":"S",
          "nativo":false,
          "usable":true
       },
       {
          "id":8,
          "tipo_id":3,
          "nombre":"NOCTURNO",
          "codigo":"N",
          "nativo":false,
          "usable":true
       },
       {
          "id":11,
          "tipo_id":3,
          "nombre":"PRIMERA HORA",
          "codigo":"PH",
          "nativo":false,
          "usable":true
       },
       {
          "id":12,
          "tipo_id":3,
          "nombre":"JORNADA UNICA",
          "codigo":"U",
          "nativo":false,
          "usable":true
       },
       {
          "id":13,
          "tipo_id":3,
          "nombre":"Atributo Bloque DM0598",
          "codigo":"W15",
          "nativo":false,
          "usable":true
       },
       {
          "id":14,
          "tipo_id":3,
          "nombre":"Atributo Bloque DM0722",
          "codigo":"W14",
          "nativo":false,
          "usable":true
       },
       {
          "id":15,
          "tipo_id":3,
          "nombre":"Atributo Bloque DG0238",
          "codigo":"W13",
          "nativo":false,
          "usable":true
       },
       {
          "id":16,
          "tipo_id":3,
          "nombre":"Atributo Bloque CB1060",
          "codigo":"W12",
          "nativo":false,
          "usable":true
       },
       {
          "id":17,
          "tipo_id":3,
          "nombre":"Atributo Bloque HU1682",
          "codigo":"W11",
          "nativo":false,
          "usable":true
       },
       {
          "id":18,
          "tipo_id":3,
          "nombre":"Atributo Bloque DM0353",
          "codigo":"W10",
          "nativo":false,
          "usable":true
       },
       {
          "id":19,
          "tipo_id":3,
          "nombre":"Atributo Bloque HU0779",
          "codigo":"W7",
          "nativo":false,
          "usable":true
       },
       {
          "id":20,
          "tipo_id":3,
          "nombre":"Atributo Bloque HU0667",
          "codigo":"W6",
          "nativo":false,
          "usable":true
       },
       {
          "id":21,
          "tipo_id":3,
          "nombre":"Atributo Bloque DM0327",
          "codigo":"W5",
          "nativo":false,
          "usable":true
       },
       {
          "id":22,
          "tipo_id":3,
          "nombre":"Atributo Bloque DG0035",
          "codigo":"W4",
          "nativo":false,
          "usable":true
       },
       {
          "id":23,
          "tipo_id":3,
          "nombre":"Atributo Bloque DG0030",
          "codigo":"W3",
          "nativo":false,
          "usable":true
       },
       {
          "id":24,
          "tipo_id":3,
          "nombre":"Atributo Bloque DG0026",
          "codigo":"W2",
          "nativo":false,
          "usable":true
       },
       {
          "id":25,
          "tipo_id":3,
          "nombre":"Atributo Bloque IV0025",
          "codigo":"W1",
          "nativo":false,
          "usable":true
       },
       {
          "id":26,
          "tipo_id":3,
          "nombre":"Atributo Bloque DM0350",
          "codigo":"W9",
          "nativo":false,
          "usable":true
       },
       {
          "id":27,
          "tipo_id":3,
          "nombre":"Atributo Bloque HU0675",
          "codigo":"W8",
          "nativo":false,
          "usable":true
       }
    ];
    var attrCollection = new EmptyCollection(optionArray); // collection all
    var selectionArray = [
      {
        "id": 21,
        "prioridad": 1
      },
      {
        "id": 17,
        "prioridad": 1
      },
      {
        "id": 22,
        "prioridad": 2
      },
      {
        "id": 2,
        "prioridad": 3
      },
      {
        "id": 19,
        "prioridad": 3
      },
      {
        "id": 3,
        "prioridad": 4
      }
    ];

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

    var SomeRegion = Marionette.Region.extend();
    var somediv = new SomeRegion({
        el: "#somediv"
    });

    var attrselect = new AttrSelect("attrSelect");
    attrselect.start({
        models: attrCollection,
        filtered: filterCollection
    });

    var attrselectChannel = Radio.channel("attrSelect");
    var attrselectView = attrselectChannel.request("get:root");
    somediv.show(attrselectView);
});
