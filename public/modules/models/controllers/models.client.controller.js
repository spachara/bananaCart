'use strict';

// Models controller
angular.module('models').controller('ModelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Models',
	function($scope, $stateParams, $location, Authentication, Models) {
		$scope.authentication = Authentication;

		// Create new Model
		$scope.create = function() {
			// Create new Model object
			var model = new Models ({
				name: this.name
			});

			// Redirect after save
			model.$save(function(response) {
				$location.path('models/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Model
		$scope.remove = function(model) {
			if ( model ) { 
				model.$remove();

				for (var i in $scope.models) {
					if ($scope.models [i] === model) {
						$scope.models.splice(i, 1);
					}
				}
			} else {
				$scope.model.$remove(function() {
					$location.path('models');
				});
			}
		};

		// Update existing Model
		$scope.update = function() {
			var model = $scope.model;

			model.$update(function() {
				$location.path('models/' + model._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Models
		$scope.find = function() {
			$scope.models = Models.query();
		};

		// Find existing Model
		$scope.findOne = function() {
			$scope.model = Models.get({ 
				modelId: $stateParams.modelId
			});
		};
	}
]);