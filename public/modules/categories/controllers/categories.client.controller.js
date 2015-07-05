'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories', '$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Categories, $modal,$log) {
		$scope.authentication = Authentication;

		// Create new Category
		$scope.create = function() {
			// Create new Category object
			var category = new Categories ({
				name: this.name,
				code: this.code
			});

			// Redirect after save
			category.$save(function(response) {
				$location.path('categories/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.code = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Category
		$scope.remove = function(category) {
			if ( category ) {
				category.$remove();

				for (var i in $scope.categories) {
					if ($scope.categories [i] === category) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};



		// Update existing Category
		$scope.update = function() {
			var category = $scope.category;

			category.$update(function() {
				$location.path('categories/' + category._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.query();
			$scope.gridOptions.data = $scope.categories;
		};

		// Find existing Category
		$scope.findOne = function() {
			$scope.category = Categories.get({
				categoryId: $stateParams.categoryId
			});
		};

		$scope.gridOptions ={
			  enableFiltering: true,
			  enableFullRowSelection: true,
			  multiSelect: false,
			  enableRowHeaderSelection: false,
			  columnDefs: [
				   { field: 'code'},
				   { field: 'name'},
				   { field: 'created', type: 'date', cellFilter: 'date:"dd-MM-yyyy HH:mm"'},
				   { field: 'user.displayName', name:'user'},
				   {name:' ', width: '53', enableColumnMenu: false, enableSorting: false, enableFiltering: false,
				   cellTemplate:'<a class="btn btn-primary" href="/#!/categories/{{row.entity._id}}/edit"><i class="glyphicon glyphicon-edit"></i></a>'},
				   {name:'  ', width: '53', enableColumnMenu: false, enableSorting: false, enableFiltering: false,
				   cellTemplate:'<a class="btn btn-danger" data-ng-click="grid.appScope.openConfirm(\'sm\',row.entity); "><i class="glyphicon glyphicon-trash"></i></a>'}
			  ],
			  rowTemplate: "<div ng-dblclick=\"grid.appScope.navClick.view(row.entity)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
		 };
	  	$scope.navClick = {
		   	add : function(){
			 $location.path('categories/create');
		   	},
			list : function(){
			$location.path('categories');
			},
			view : function(category){
			$location.path('categories/' + category._id);
			}
	   	};

		$scope.openConfirm = function (size, category) {

			var modalInstance = $modal.open({
			  animation: true,
			  template: '<div class="modal-header"><h3 class="modal-title">Are you sure?</h3></div><div class="modal-body">Remove Category: ' + category.name + '.</div> \
			  <div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',
			  controller: 'ModalInstanceCtrl',
			  size: size
			});

			modalInstance.result.then(function () {
				$scope.remove(category);
			}, function () {
			  $log.info('Modal dismissed at: ' + new Date());
			});
		  };
	}
]).controller('ModalInstanceCtrl',['$scope','$modalInstance', function ($scope, $modalInstance) {

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
