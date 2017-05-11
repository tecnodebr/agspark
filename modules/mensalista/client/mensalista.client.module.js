(function (app) {
  'use strict';

  app.registerModule('mensalista');
  app.registerModule('mensalistavalor', ['tecnode.directives', 'ui.utils.masks', 'ngMaterial', 'ngMessages']);
  app.registerModule('mensalistavigencias', ['tecnode.directives', 'ui.utils.masks', 'ngMaterial', 'ngMessages']);
  app.registerModule('mensalistavigenciaspagamento', ['tecnode.directives', 'ui.utils.masks', 'ngMaterial', 'ngMessages']);
})(ApplicationConfiguration);
