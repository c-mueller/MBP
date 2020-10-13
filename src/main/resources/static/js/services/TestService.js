/* global app */

/**
 * Provides services for managing tests.
 */
app.factory('TestService', ['HttpService', '$resource', '$q', 'ENDPOINT_URI',
    function (HttpService, $resource, $q, ENDPOINT_URI) {
        //URLs for server requests
        const URL_TEST_RULE_ACTION = ENDPOINT_URI + '/test-details/test/';

        /**
         * [Public]
         * Performs a server request in order to execute a test given by its id.
         * @param testId The id of the test to be executed
         * @returns {*}
         */
        function executeTest(testId) {
            return HttpService.postRequest(URL_TEST_RULE_ACTION + testId);
        }


        //Expose public methods
        return {
            executeTest: executeTest
        }
    }
]);

