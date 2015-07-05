'use strict';

//Uiexamples service used to communicate Uiexamples REST endpoints
angular.module('uiexamples').factory('Uiexamples', ['$resource',
	function($resource) {
		return $resource('uiexamples/:uiexampleId', { uiexampleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);