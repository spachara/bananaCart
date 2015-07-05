'use strict';

// Configuring the Articles module
angular.module('uiexamples').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Uiexamples', 'uiexamples', 'dropdown', '/uiexamples(/create)?', null ,null ,10);
		Menus.addSubMenuItem('topbar', 'uiexamples', 'List Uiexamples', 'uiexamples');
		Menus.addSubMenuItem('topbar', 'uiexamples', 'New Uiexample', 'uiexamples/create');
	}
]);
