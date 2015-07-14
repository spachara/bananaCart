'use strict';

// Products controller
angular.module('products').controller('ProductsController',
	['$scope', '$stateParams', '$location', 'Authentication', 'Categories', 'Products', 'Upload', '$timeout','$filter',
	function($scope, $stateParams, $location, Authentication, Categories, Products, Upload, $timeout, $filter) {
		$scope.authentication = Authentication;

		// Find a list of Categories
		$scope.findCategories = function() {
			$scope.Categories = Categories.query();
		};
$scope.disabled = false;
 $scope.colorClick = function($event) {
// angular.element($event.currentTarget).addClass('selected');
 };

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
				 supplier: ['supplier_A', 'supplier_B', 'supplier_C'],
				 stockType: ['in-stock', 'pre-order']
			   };

			   $scope.tabs = [
                   { title:'Dynamic Title 1', content:'Dynamic content 1' },
                   { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
                 ];

			 $scope.tinymceOptions = {
				onChange: function(e) {
				  // put logic here for keypress and cut/paste changes
				},
				inline: false,
				plugins : 'advlist autolink link image lists charmap print preview',
				skin: 'lightgray',
				theme : 'modern',
				min_height: 300,
				 document_base_url: "localhost:3000/"
			  };

// $scope.colors = [
// 	 {order : 3, code: '#F20C0C', name:'red'}
// 	,{order : 1, code: '#0CF21B', name:'green'}
// 	,{order : 2, code: '#0C5DF2', name:'blue'}
// ];

			  $scope.product={
						categories:[],
						code: '',
						name: '',
						desc: '',
						modelType: 'Color',
						models:[
							{ name:'red',value:'#F20C0C', order: 1, published: false,enable: false, enableDate:'', optionType:'Size',
								options:[
									{
										value:'S',
										qty: 2,
										price: 400,
										unit: 'piece',
										supplier: '',
										stockType: '',
										order: 1
									},
									{
										value:'M',
										qty: 2,
										price: 450,
										unit: 'piece',
										supplier: '',
										stockType: '',
										order: 1
									},
									{
										value:'L',
										qty: 2,
										price: 500,
										unit: 'piece',
										supplier: '',
										stockType: '',
										order: 1
									}
								]
							},
							{ name:'green',value:'#0CF21B', order: 3, published: false,enable: false, enableDate:'', optionType:'Size',
								options:[
										{
											value:'S',
											qty: 8,
											price: 200,
											unit: 'piece',
											supplier: '',
											stockType: '',
											order: 1
										},
										{
											value:'M',
											qty: 6,
											price: 500,
											unit: 'piece',
											supplier: '',
											stockType: '',
											order: 1
										},
										{
											value:'L',
											qty: 9,
											price: 500,
											unit: 'piece',
											supplier: '',
											stockType: '',
											order: 1
										}
									]
							},
							{ name:'blue',value:'#0C5DF2', order: 4, published: false,enable: false, enableDate:'', optionType:'Size',
								options:[
											{
												value:'S',
												qty: 11,
												price: 400,
												unit: 'piece',
												supplier: '',
												stockType: '',
												order: 1
											},
											{
												value:'M',
												qty: 18,
												price: 450,
												unit: 'piece',
												supplier: '',
												stockType: '',
												order: 1
											},
											{
												value:'L',
												qty: 1,
												price: 500,
												unit: 'piece',
												supplier: '',
												stockType: '',
												order: 1
											}
										]
								}
						],
						tabs:[
							{ order:1, title:'Overview', content:'Overview', active:true},
							{ order:2,title:'Delivery', content:'Delivery' },
							{ order:3,title:'Returns & Exchanges', content:'Returns & Exchanges' },
							{ order:4,title:'Size Chart', content:'Size Chart' }
						]
			  };
			  $scope.radioModel = {name :  $filter('filter')($scope.product.models, { order: 1 })[0].name};
               $scope.selectModel= function(name){
               	$scope.radioModel.name = name;
               	 $filter('filter')($scope.product.models, { name: name })[0].active = true;
               };

	}
]).filter('categoriesFilter', function() {
    return function(items, props) {
      var out = [];

      if (angular.isArray(items)) {
        items.forEach(function(item) {
          var itemMatches = false;

          var keys = Object.keys(props);
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var text = props[prop].toLowerCase();
            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              itemMatches = true;
              break;
            }
          }

          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }

      return out;
    };
  });

