(function() {
  'use strict';

  angular
    .module('core')
    .factory('Seo', Seo);
      
  Seo.$inject = [];

  /* @ngInject */
  function Seo() {
    var self = this;

    self.title = 'Mean';
    self.description = 'mean relational boilerplate';

    var service = {
      getTitle: getTitle,
      setTitle: setTitle,
      getDescription: getDescription,
      setDescription: setDescription
    };

    return service;
    
    // declarations
    //
    function getTitle () {
      return self.title;
    }

    function setTitle (title) {
      self.title = title;
    }

    function getDescription () {
      return self.description;
    }

    function setDescription (description) {
      self.description = description;
    }
  }
})();