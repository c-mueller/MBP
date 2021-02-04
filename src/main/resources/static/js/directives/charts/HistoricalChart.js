/* global app */

'use strict';

/**
 * Directive whreich creates a chart for displaying historical values. Control elements are provided with
 * which the user has the possibility to select the data that he wants to display.
 *
 * @author Jan
 */
app.directive('historicalChart', ['$timeout', '$interval', function ($timeout, $interval) {
    //Initial number of elements to display in the chart
    const CHART_INITIAL_ELEMENTS_NUMBER = 200;

    //Minimum/maximum number of elements that can be displayed in the chart
    const CHART_MIN_ELEMENTS = 0;
    const CHART_MAX_ELEMENTS = 5000;

    /**
     * Linking function, glue code
     *
     * @param scope Scope of the directive
     * @param element Elements of the directive
     * @param attrs Attributes of the directive
     */
    var link = function (scope, element, attrs) {

        //Chart objects
        var chartContainer = element.find('.chart-container').get(0);
        var chart = null;

        //Slider objects
        var sliderContainer = element.find('.chart-slider');

        //Define chart settings that can be adjusted by the user
        scope.settings = {
            numberOfValues: CHART_INITIAL_ELEMENTS_NUMBER,
            mostRecent: true,
        };

        /**
         * [Private]
         * Initializes the chart.
         */
        function initChart() {

            //Create chart
            chart = Highcharts.chart(chartContainer, {
                title: {
                    text: ''
                },
                chart: {
                    zoomType: 'xy'
                },
                series: [{
                    name: 'Value',
                    data: [],
                    showInLegend: true
                }],
                tooltip: {
                    valueDecimals: 2,
                    valuePrefix: '',
                    valueSuffix: ' ' + scope.unit
                },
            });

            //Initialize slider
            sliderContainer.ionRangeSlider({
                skin: "flat",
                type: "single",
                grid: true,
                grid_num: 5,
                grid_snap: false,
                step: 1,
                min: CHART_MIN_ELEMENTS,
                max: CHART_MAX_ELEMENTS,
                from: scope.settings.numberOfValues,
                onFinish: function (data) {
                    //Update chart with new values
                    scope.settings.numberOfValues = data.from;
                    updateChart();
                }
            });

            //Watch value border and update chart on change
            scope.$watch(
                function () {
                    return scope.settings.mostRecent;
                },
                function () {
                    //Update chart on change
                    updateChart();
                }
            );

            //Expose public api
            scope.api = {
                updateChart: updateChart
            };

            //Populate the chart
            updateChart();
        }

        /**
         * [Public]
         * Updates the chart and refreshes its data. Before the refreshment, the loadingStart function is called. After
         * the update is finished, the loadingFinished function is called.
         */
        function updateChart() {
            //Ensure that the chart has already been initialized
            if (chart == null) {
                console.error("The historical chart has not been initialized yet.");
                return;
            }

            //Data will be loaded
            scope.loadingStart();

            //Set y-axis and tooltip unit to currently displayed unit and redraw chart
            chart.yAxis[0].labelFormatter = function () {
                return this.value + ' ' + scope.unit;
            };
            chart.series[0].tooltipOptions.valueSuffix = ' ' + scope.unit;

            //Retrieve a fixed number of value logs from the server
            scope.getData({
                numberLogs: scope.settings.numberOfValues,
                descending: scope.settings.mostRecent,
                unit: scope.unit,
            }).then(function (values) {
                //Reverse the values array if ordered in descending order
                if (scope.settings.mostRecent) {
                    values = values.reverse();
                }

                // As the directive takes the jsonPath parameter as string a conversion to an object is necessary
                var jsonPathAsObj = JSON.parse(scope.jsonPath);

                // Apply jsonPath on the values
                values.forEach(applyJsonPath);

                function applyJsonPath(value, index, array) {
                    if (scope.fieldCollectionId === 'default') {
                        array[index][1] = parseFloat(JSONPath.JSONPath({
                            path: jsonPathAsObj.value.path,
                            json: array[index][1]
                        }).toString());
                    } else {
                        array[index][1] = JSONPath.JSONPath({
                            path: jsonPathAsObj.arrVal.path,
                            json: array[index][1]
                        });
                    }
                }

                if (scope.fieldCollectionId === 'default') {
                    //Update chart
                    chart.series[0].update({
                        name: jsonPathAsObj.value.name,
                        tooltip: {valueSuffix: ' ' + (jsonPathAsObj.value.unit ? jsonPathAsObj.value.unit : '')},
                        data: values
                    }, true); //True: Redraw chart
                } else {
                    // Check if enough series are existing - if not add the missing ones

                    var dataSeriesNumber = chart.series.length;
                    var valueLengthNumber = values[0][1].length;

                    // Add series if not enough are currently existing
                    for (var i = dataSeriesNumber; i < valueLengthNumber; i++) {
                        chart.addSeries({
                            name: jsonPathAsObj.arrVal.name  + "[" + i + "]",
                            data: [],
                            showInLegend: true,
                        });
                    }

                    for (var i = 0; i < chart.series.length; i++) {
                        chart.series[i].update({
                            name: jsonPathAsObj.arrVal.name  + "[" + i + "]",
                            tooltip: {valueSuffix: ' ' + (jsonPathAsObj.arrVal.unit ? jsonPathAsObj.arrVal.unit : '')},
                            data: values.map(function (currentVal, index) {
                                var newVal = [];
                                newVal.push(currentVal[0]);
                                newVal.push(currentVal[1][i]);
                                return newVal;
                            })
                        }, true);
                    }
                }
                //Loading finished
                scope.loadingFinish();
            });
        }

        //Watch the unit parameter
        scope.$watch(function () {
            return scope.unit;
        }, function (newValue, oldValue) {
            //Update chart if unit was changed
            updateChart();
        });

        //Watch the jsonPath parameter
        scope.$watch(function () {
            return scope.jsonPath;
        }, function (newValue, oldValue) {
            //Update chart if jsonPath was changed
            console.log("JSONPATh updated");
            initChart();
        });

        //Watch the fieldCollectionId parameter
        scope.$watch(function () {
            return scope.fieldCollectionId;
        }, function (newValue, oldValue) {
            console.log("Field collection ID: ");
            console.log(newValue);
            console.log(oldValue);
            console.log(scope.fieldCollectionId);
            initChart();
        });

        //Initialize chart
        initChart();
    };

    //Configure and expose the directive
    return {
        restrict: 'E', //Elements only
        template:
            '<div class="chart-container"></div>' +
            '<br/>' +
            '<table>' +
            '<tr>' +
            '<th style="min-width: 195px">Values to display:</th>' +
            '<th style="width: 100%">Number of values:</th>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            '<div class="switch">' +
            '<label>' +
            'Oldest' +
            '<input type="checkbox" ng-model="settings.mostRecent">' +
            '<span class="lever"></span>' +
            'Most recent' +
            '</label>' +
            '</td>' +
            '<td>' +
            '<div class="range-slider">' +
            '<input type="text" class="chart-slider"/>' +
            '</div>' +
            '</td>' +
            '<tr>' +
            '</table>',
        link: link,
        scope: {
            //Public api that provides functions for controlling the chart
            api: "=api",
            //The unit in which the values are supposed to be displayed
            unit: '@unit',
            // The json path which should be used to interpret the json value data
            jsonPath: '@jsonPath',
            // The name of the field collection which the visualization uses
            fieldCollectionId: '@fieldCollectionId',
            //Functions that are called when the chart loads/finishes loading data
            loadingStart: '&loadingStart',
            loadingFinish: '&loadingFinish',
            //Function for updating the displayed data
            getData: '&getData'
        }
    };
}]);