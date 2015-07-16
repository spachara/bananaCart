'use strict';

// Configuring the Articles module
angular.module('models').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('products', 'Models', 'models', 'dropdown', '/models(/create)?');
		Menus.addSubMenuItem('products', 'models', 'List Models', 'models');
		Menus.addSubMenuItem('products', 'models', 'New Model', 'models/create');
	}
]);