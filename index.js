


const margin = {top: 60, right: 30, bottom: 30, left: 300},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

const barHeight = 20;
const barLoc = 30;
const widthMultiplier = 4;

const svg = d3.select("#viz")
  .append("svg")
  .attr("viewBox", [0, 0,  width + margin.left + margin.right, height + margin.top + margin.bottom])
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const toolTip = d3.select("body")
                    .append("div")
                    .attr("class", "toolTip")

let ready= (data)=>{

// Set up X scale
const xArray = data.map(d => d.columnName);
const xValues = data.map(d => {
    return d.total_count});

const x = d3.scaleLinear()
        .domain([0, d3.max(xValues)])
        .range([ 0, width]);
// add x Axis to 
svg.append("g")
.call(d3.axisTop(x).tickSize(5).ticks(6)) // plot axis and remove tics
.attr('stroke-width', 1) // remove axis line
.attr("class", "label-styling")

// Setup Y scale
const yArray = data.map(d => d.columnName);
const yValues = data.map(d => d.Name);
const y = d3.scaleBand()
            .domain(yValues)
            .range([height, 0 ])
            .padding(0.15);

svg.append("g")
    .call(d3.axisLeft(y).tickSize(0).tickSizeOuter(5)) // plot axis and remove tics
    .attr('stroke-width', 1) // remove axis line
    .attr("class", "label-styling")

// add rectangle bars


svg.append("g")
    .attr("class", "rect-bars")
.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
        .attr("y", d => y(d.Name))
        .attr("x", 0)
        .attr("width", d => x(d.total_count))
        .attr("height", y.bandwidth())
        .attr("fill", "teal")
        .attr("opacity", "1")
        ;

// Add title to chart
svg.append("text")
.attr("transform", "translate(0,0)")
.attr("x", 0)
.attr("y", 0 - (margin.top / 2))
.attr('class','title-styling')
.text("Boston 311 Requests")

svg.selectAll('rect')
    .on('mousemove', nodeMouseOver) 
    .on('mouseout', nodeMouseOut );

function nodeMouseOver(event, d){
    // Get the toolTip, update the position, and append the inner html depending on your content
    // I tend to use template literal to more easily output variables.
    toolTip.style("left", event.pageX + 18 + "px")
        .style("top", event.pageY + 18 + "px")
        .style("display", "block")
        .html(`Total 311 Requests: ${d.total_count}`);
    
    // Optional cursor change on target
    d3.select(event.target).style("cursor", "pointer"); 
    
    // Optional highlight effects on target
    
    }
    
    function nodeMouseOut(event, d){
    // Hide tooltip on mouse out
        toolTip.style("display", "none"); // Hide toolTip
    
    // Optional cursor change removed
    d3.select(event.target).style("cursor", "default"); 
    
    
    }
    
}

d3.csv("data/boston_311.csv", d3.autoType).then((data)=>{
    dataset = data
    dataset.sort((a, b) => d3.ascending(a.total_count, b.total_count));
    //console.log(dataset)
    ready(data)});