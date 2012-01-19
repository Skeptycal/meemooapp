$(function(){

  var template = 
    '<div class="graph">'+
      '<div class="edges" />'+
      '<div class="nodes" />'+
    '</div>'+
    '<div class="panel">'+
      '<button class="button source">source</button>'+
      '<div class="code">'+
        '<button class="button close">close</button><br />'+
        '<textarea class="sourceedit" /><br />'+
        '<button class="button refresh" title="refresh the source code">refresh</button>'+
        '<button class="button compress" title="refresh and compress the source code into one line">compress</button>'+
        '<button class="button apply" title="reloads the app">apply changes</button>'+
      '</div>'+
    '</div>';

  Iframework.GraphView = Backbone.View.extend({
    tagName: "div",
    className: "app",
    template: _.template(template),
    events: {
      "click .graph":     "click"
    },
    initialize: function () {
      this.render();
      $('body').append(this.el);
      
      this.model.get("nodes").each(this.addNode);
      
      // Panel buttons
      this.$(".panel .code").hide();
      this.$(".panel .close").button({
        icons: {
          primary: 'ui-icon-close'
        }
      })
      .click( function(){
        $(".panel .code").hide();
        $(".panel .source").show();
      });
      
      this.$(".panel .source").button({
        icons: {
          primary: 'ui-icon-gear'
        }
      })
      .click( function(){
        $(".panel .source").hide();
        $(".panel .code").show();
        $(".panel .code textarea").text( JSON.stringify(Iframework.shownGraph, null, "  ") );
      });

      this.$(".panel .refresh").button({
        icons: {
          primary: 'ui-icon-arrowrefresh-1-s'
        }
      })
      .click( function(){
        $(".panel .code textarea").text( JSON.stringify(Iframework.shownGraph, null, "  ") );
      });

      this.$(".panel .compress").button({
        icons: {
          primary: 'ui-icon-suitcase'
        }
      })
      .click( function(){
        $(".panel .code textarea").text( JSON.stringify(Iframework.shownGraph) );
      });
      
      this.$(".panel .apply").button({
        icons: {
          primary: 'ui-icon-check'
        }
      })
      .click( function(){
        var newGraph = JSON.parse( $(".panel .sourceedit").val() );
        Iframework.showGraph(newGraph);
        $(".panel .source").click();
      });
    },
    click: function (event) {
      // Hide dis/connection boxes
      $(".edge-edit").remove();
      Iframework.selectedPort = null;
      
      // Unactivate modules
      $("div.module.active").removeClass("active");
    },
    render: function () {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    addNode: function (node) {
      this.$(".nodes").append( node.initializeView().el );
      node.frameIndex = window.frames.length - 1;
    },
    addEdge: function (edge) {
      this.$(".edges").append( edge.initializeView().el );
    },
    removeEdge: function (edge) {
      $(edge.view.el).remove();
    }
    
  });

});
