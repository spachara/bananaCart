'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', 'Upload', '$timeout',
	function($scope, $stateParams, $location, Authentication, Products, Upload, $timeout) {
		$scope.authentication = Authentication;

		// Create new Product
		$scope.create = function() {
			// Create new Product object
			var product = new Products ({
				name: this.name
			});

			// Redirect after save
			product.$save(function(response) {
				$location.path('products/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Product
		$scope.remove = function(product) {
			if ( product ) {
				product.$remove();

				for (var i in $scope.products) {
					if ($scope.products [i] === product) {
						$scope.products.splice(i, 1);
					}
				}
			} else {
				$scope.product.$remove(function() {
					$location.path('products');
				});
			}
		};

		// Update existing Product
		$scope.update = function() {
			var product = $scope.product;

			product.$update(function() {
				$location.path('products/' + product._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Products
		$scope.find = function() {
			$scope.products = Products.query();
		};

		// Find existing Product
		$scope.findOne = function() {
			$scope.product = Products.get({
				productId: $stateParams.productId
			});
		};


//data picker
		 $scope.today = function() {
            $scope.dt = new Date();
          };
          $scope.today();

          $scope.clear = function () {
            $scope.dt = null;
          };

          // Disable weekend selection
          $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
          };

          $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
          };
          $scope.toggleMin();

          $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
          };

          $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

          $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          $scope.format = $scope.formats[0];
//radio
           $scope.radioModel = 'Middle';
//check box
           $scope.checkModel = {
               left: false,
               middle: true,
               right: false
             };

//file upload
             $scope.$watch('files', function () {
                     $scope.upload($scope.files);
                 });
                 $scope.log = '';

                 $scope.upload = function (files) {
                     if (files && files.length) {
                         for (var i = 0; i < files.length; i++) {
                             var file = files[i];
                             Upload.upload({
                                 url: '/productupload',
								method: 'POST',
								headers: {'Content-Type': 'multipart/form-data'},
                                 fields: {
                                     'productname': $scope.name
                                 },
                                 file: file
                             }).progress(function (evt) {
                                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                 $scope.log = 'progress: ' + progressPercentage + '% ' +
                                             evt.config.file.name + '\n' + $scope.log;
                             }).success(function (data, status, headers, config) {
                                 $timeout(function() {
                                     $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                                 });
                             });
                         }
                     }
                 };

                  $scope.myData = [
                     {
                         'firstName': 'Cox',
                         'lastName': 'Carney',
                         'company': 'Enormo',
                         'employed': true
                     },
                     {
                         'firstName': 'Lorraine',
                         'lastName': 'Wise',
                         'company': 'Comveyer',
                         'employed': false
                     },
                     {
                         'firstName': 'Nancy',
                         'lastName': 'Waters',
                         'company': 'Fuelton',
                         'employed': false
                     }
                 ];

                 $scope.gridOptions ={
					 enableFiltering: true,
					 data: $scope.myData
                 };

				$scope.hstep = 1;
			  	$scope.mstep = 15;

			   $scope.options = {
				 hstep: [1, 2, 3],
				 mstep: [1, 5, 10, 15, 25, 30]
			   };

			   $scope.tabs = [
                   { title:'Dynamic Title 1', content:'Dynamic content 1' },
                   { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
                 ];


	}
]);
