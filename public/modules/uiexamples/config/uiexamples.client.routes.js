'use strict';

//Setting up route
angular.module('uiexamples').config(['$stateProvider',
	function($stateProvider) {
		// Uiexamples state routing
		$stateProvider.
		state('listUiexamples', {
			url: '/uiexamples',
			templateUrl: 'modules/uiexamples/views/list-uiexamples.client.view.html'
		}).
		state('createUiexample', {
			url: '/uiexamples/create',
			templateUrl: 'modules/uiexamples/views/create-uiexample.client.view.html'
		}).
		state('viewUiexample', {
			url: '/uiexamples/:uiexampleId',
			templateUrl: 'modules/uiexamples/views/view-uiexample.client.view.html'
		}).
		state('editUiexample', {
			url: '/uiexamples/:uiexampleId/edit',
			templateUrl: 'modules/uiexamples/views/edit-uiexample.client.view.html'
		});
	}
]);