console.log(d3)
let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req = new XMLHttpRequest();

let data
let values = [];

let heightScale
let xScale
let xAxisScale
let yAxisScale 

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg');

let drawCanvas = () => {
    svg.attr('width', width);
    svg.attr('height', height);

}

let generateScales = () => {
    heightScale = d3.scaleLinear() // Creates a linear scale for the height
        .domain([0, d3.max(values, (item) => {
            return item[1]; // Sets the domain of the scale from 0 to the maximum value in the 'values' array
        })])
        .range([0, height - (2 * padding)]); // Sets the range of the scale from 0 to the available height for the chart

    xScale = d3.scaleLinear() // Creates a linear scale for the x-axis
        .domain([0, values.length - 1]) // Sets the domain of the scale from 0 to the length of the 'values' array minus 1
        .range([padding, width - padding]); // Sets the range of the scale from the left padding to the available width for the chart

    let datesArray = values.map((item) => {
        return new Date(item[0]); // Converts the date strings in the 'values' array to Date objects and creates a new array
    });

    console.log(datesArray); // Logs the resulting array of Date objects to the console

    xAxisScale = d3.scaleTime() // Creates a time scale for the x-axis
        .domain([d3.min(datesArray), d3.max(datesArray)]) // Sets the domain of the scale from the minimum date to the maximum date in the 'datesArray'
        .range([padding, width - padding]); // Sets the range of the scale from the left padding to the available width for the chart

    yAxisScale = d3.scaleLinear() // Creates a linear scale for the y-axis
        .domain([0, d3.max(values, (item) => {
            return item[1]; // Sets the domain of the scale from 0 to the maximum value in the 'values' array
        })])
        .range([height - padding, padding]); // Sets the range of the scale from the available height for the chart to the top padding
};


let drawBars = () => {
    let tooltip = d3.select('body') // Selects the 'body' element
        .append('div') // Appends a 'div' element as a child of 'body'
        .attr('id', 'tooltip') // Sets the 'id' attribute of the 'div' element to 'tooltip'
        .style('visibility', 'hidden') // Sets the 'visibility' CSS property of the 'div' element to 'hidden'
        .style('width', 'auto') // Sets the 'width' CSS property of the 'div' element to 'auto'
        .style('height', 'auto'); // Sets the 'height' CSS property of the 'div' element to 'auto'

    svg.selectAll('rect') // Selects all existing 'rect' elements within the 'svg' container
        .data(values) // Associates the 'values' array with the selection of 'rect' elements
        .enter() // Enters the data join, creating placeholders for new data
        .append('rect') // Appends a 'rect' element for each data item that doesn't have a corresponding 'rect'
        .attr('class', 'bar') // Sets the 'class' attribute of the 'rect' elements to 'bar'
        .attr('width', (width - (2 * padding)) / values.length) // Sets the width of each 'rect' based on the chart dimensions and the number of values
        .attr('data-date', (item) => {
            return item[0]; // Sets the 'data-date' attribute of the 'rect' elements to the corresponding date from the data
        })
        .attr('data-gdp', (item) => {
            return item[1]; // Sets the 'data-gdp' attribute of the 'rect' elements to the corresponding GDP value from the data
        })
        .attr('height', (item) => {
            return heightScale(item[1]); // Sets the height of each 'rect' based on the scaled GDP value
        })
        .attr('x', (item, index) => {
            return xScale(index); // Sets the x-coordinate of each 'rect' based on the index of the data item and the x-axis scale
        })
        .attr('y', (item) => {
            return (height - padding) - heightScale(item[1]); // Sets the y-coordinate of each 'rect' based on the scaled GDP value and the chart dimensions
        })
        .on('mouseover', function(event, item) {
            const date = item[0]; // Extracts the date from the data item
            const gdp = item[1]; // Extracts the GDP value from the data item
            
            tooltip.transition()
                .style('visibility', 'visible'); // Shows the tooltip by setting its visibility to 'visible'
            
            tooltip.text(`Date: ${date}, GDP: ${gdp}`); // Sets the text content of the tooltip
            
            document.querySelector('#tooltip').setAttribute('data-date', item[0]); // Sets the 'data-date' attribute of the tooltip to the corresponding date from the data
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden'); // Hides the tooltip by setting its visibility to 'hidden'
        });
};


let generateAxis = () => {
    let xAxis = d3.axisBottom(xAxisScale); // Creates a new x-axis using the scale defined in 'xAxisScale'
    let yAxis = d3.axisLeft(yAxisScale); // Creates a new y-axis using the scale defined in 'yAxisScale'

    svg.append('g') // Appends a new 'g' element to the 'svg' container
        .call(xAxis) // Calls the 'xAxis' function on the 'g' element to render the x-axis
        .attr('id', 'x-axis') // Sets the 'id' attribute of the 'g' element to 'x-axis'
        .attr('transform', 'translate(0, ' + (height - padding) + ')'); // Applies a translation to position the x-axis at the bottom of the chart

    svg.append('g') // Appends another 'g' element to the 'svg' container
        .call(yAxis) // Calls the 'yAxis' function on the 'g' element to render the y-axis
        .attr('id', 'y-axis') // Sets the 'id' attribute of the 'g' element to 'y-axis'
        .attr('transform', 'translate(' + (padding) + ' 0)'); // Applies a translation to position the y-axis on the left side of the chart
};

req.open('GET', url, true); // Opens a GET request to the specified URL asynchronously

req.onload = () => {
    data = JSON.parse(req.responseText); // Parses the response text as JSON and assigns it to the variable 'data'
    values = data.data; // Extracts the 'data' property from the parsed JSON and assigns it to the variable 'values'
    console.log(values); // Logs the 'values' array to the console
    drawCanvas(); // Calls the function 'drawCanvas()'
    generateScales(); // Calls the function 'generateScales()'
    drawBars(); // Calls the function 'drawBars()'
    generateAxis(); // Calls the function 'generateAxis()'
};

req.send(); // Sends the HTTP request