'use strict';

(function() {
	// Uiexamples Controller Spec
	describe('Uiexamples Controller Tests', function() {
		// Initialize global variables
		var UiexamplesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Uiexamples controller.
			UiexamplesController = $controller('UiexamplesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Uiexample object fetched from XHR', inject(function(Uiexamples) {
			// Create sample Uiexample using the Uiexamples service
			var sampleUiexample = new Uiexamples({
				name: 'New Uiexample'
			});

			// Create a sample Uiexamples array that includes the new Uiexample
			var sampleUiexamples = [sampleUiexample];

			// Set GET response
			$httpBackend.expectGET('uiexamples').respond(sampleUiexamples);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.uiexamples).toEqualData(sampleUiexamples);
		}));

		it('$scope.findOne() should create an array with one Uiexample object fetched from XHR using a uiexampleId URL parameter', inject(function(Uiexamples) {
			// Define a sample Uiexample object
			var sampleUiexample = new Uiexamples({
				name: 'New Uiexample'
			});

			// Set the URL parameter
			$stateParams.uiexampleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/uiexamples\/([0-9a-fA-F]{24})$/).respond(sampleUiexample);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.uiexample).toEqualData(sampleUiexample);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Uiexamples) {
			// Create a sample Uiexample object
			var sampleUiexamplePostData = new Uiexamples({
				name: 'New Uiexample'
			});

			// Create a sample Uiexample response
			var sampleUiexampleResponse = new Uiexamples({
				_id: '525cf20451979dea2c000001',
				name: 'New Uiexample'
			});

			// Fixture mock form input values
			scope.name = 'New Uiexample';

			// Set POST response
			$httpBackend.expectPOST('uiexamples', sampleUiexamplePostData).respond(sampleUiexampleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Uiexample was created
			expect($location.path()).toBe('/uiexamples/' + sampleUiexampleResponse._id);
		}));

		it('$scope.update() should update a valid Uiexample', inject(function(Uiexamples) {
			// Define a sample Uiexample put data
			var sampleUiexamplePutData = new Uiexamples({
				_id: '525cf20451979dea2c000001',
				name: 'New Uiexample'
			});

			// Mock Uiexample in scope
			scope.uiexample = sampleUiexamplePutData;

			// Set PUT response
			$httpBackend.expectPUT(/uiexamples\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/uiexamples/' + sampleUiexamplePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid uiexampleId and remove the Uiexample from the scope', inject(function(Uiexamples) {
			// Create new Uiexample object
			var sampleUiexample = new Uiexamples({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Uiexamples array and include the Uiexample
			scope.uiexamples = [sampleUiexample];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/uiexamples\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUiexample);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.uiexamples.length).toBe(0);
		}));
	});
}());