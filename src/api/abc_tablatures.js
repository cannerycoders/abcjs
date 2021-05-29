/*
 * Tablature Plugins
 * tablature are defined dynamically and registered inside abcjs
 * by calling abcTablatures.register(plugin) 
 * where plugin represents a plugin instance 
 * 
 */
var ViolinTablature = require('../tablatures/instruments/violin/tab_violin');

var abcTablatures = {

  inited: false ,
  plugins: {},
  errordiv : null,
  
  /**
   * to be called once per plugin for registration 
   * @param {*} plugin 
   */
  register: function (plugin) {
    var name = plugin.name;
    var tablature = plugin.tablature;
    this.plugins[name] = tablature;
  },

  emit_error: function (msg) {
    if (this.errordiv) {
      if (msg) {
        this.errordiv.innerHTML = [msg].join('<br />');
      }
    } else {
      // default to console logging
      console.error('tablatures plugins ERROR :' + msg);
    }
  },

  init_error_handler: function (warnings_id) {
    if (warnings_id) {
      if (typeof (warnings_id) === "string")
        this.errordiv = document.getElementById(warnings_id);
      else
        this.errordiv = warnings_id;
    } 
  },

  /**
   * handle params for current processed score
   * @param {*} renderer current tune renderer
   * @param {*} tune current tune 
   * @param {*} tuneNumber number in tune list
   * @param {*} params params to be processed for tablature
   * @return prepared tablatures plugin instances for current tune
   */
  preparePlugins: function(renderer,tune,tuneNumber,params) {
    console.log('Tablatures plugins manager preparing Plugins ...')
    var returned = null;
    var nbPlugins = 0;
    if (params.tablatures) {
       // validate requested plugins 
      var tabs = params.tablatures;
      this.init_error_handler(tabs.warnings_id);
      for (ii = 0; ii < tabs.length; ii++) {
        returned = [];
        var tab = tabs[ii];
        if (tab.length > 0) {
          var tabName = tab[0]
          var args = null;
          if (tab.length > 1) {
            args = tab[1] 
          }
          var plugin = this.plugins[tabName];
          if (plugin) {
            // proceed with tab plugin  init 
            plugin.init(renderer,tune,tuneNumber,args)
            returned[ii] = plugin
            nbPlugins++;
          } else {
            // unknown tab plugin 
            this.emit_error('Undefined tablature plugin: '+ tabName)
          }
        } 
      }
    }
    console.log('Tablatures plugins manager '+nbPlugins+' Plugin(s) ready')
    return returned; 
  },

  /**
   * called once internally to register internal plugins
   */
  init: function() {
    // just register plugin hosted by abcjs 
    if (!this.inited) {
      this.register(new ViolinTablature());
      this.inited = true;
    }
  }
}  


module.exports = abcTablatures ;