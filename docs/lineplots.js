
function readData(){

    // Get the selected metric 
    var selected_metric = $('input[name="metric"]:checked').val();

    // Set file name based on the selected metric

    var filename = (selected_metric == "percentage") ? "all_data_pct.csv" : "all_data_abs.csv";

    d3.csv(filename, d3.autoType).then(data => {
        if (selected_metric == "percentage"){
            makePctLinePlots(data, selected_metric);
        }
        else{
            makeAbsLinePlots(data, selected_metric);
        }
        
    });
}

function makeAbsLinePlots(data, selected_metric){

    // Remove the previous plot
    d3.select("svg").remove();

    // Get the selected demo
    var selected_demo = $('input[name="demo"]:checked').val();

    // Filter the data based on the selected demo
    data = data.filter(function(d){ return d.demo == selected_demo; })

    const width = 928;
    const height = 500;
    const marginTop = 40;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 60;

    // Declare the x (horizontal position) scale.
    const x = d3.scaleLinear(d3.extent(data, d => d.year), [marginLeft, width - marginRight]);

    // // Declare the y (vertical position) scale.
    
    var maxmax = Math.max(d3.max(data, d => d.cs), d3.max(data, d => d.ncs));
    const scale = d3.scaleLinear([0, maxmax], [height - marginBottom, marginTop]);

    const cs  = d3.scaleLinear([0, d3.max(data, d => d.cs)], [height - marginBottom, marginTop]);
    const ncs = d3.scaleLinear([0, d3.max(data, d => d.ncs)], [height - marginBottom, marginTop]);

    // Declare the line generator.
    const cs_line = d3.line()
        .x(d => x(d.year))
        .y(d => cs(d.cs));

    // Declare the line generator.
    const ncs_line = d3.line()
        .x(d => x(d.year))
        .y(d => scale(d.ncs));

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("id", "lineplot")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    var text = (selected_metric == "percentage") ? "Percentage of Graduating class" : "Absolute count";
    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .attr("class", "firstYAxis")
        .call(d3.axisLeft(scale).ticks(height / 40))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 15)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-size", "20px")
            .text("Graduates (" + text + ") by Year"));
            
    // Adding second y-axis, remove the domain line, add grid lines and a label.
    // Set the colors of the axis, ticks and labels as orange

    svg.append("g")
        .attr("transform", `translate(${width-marginRight*2},0)`)
        .attr("class", "secondYAxis")
        .call(d3.axisRight(cs).ticks(height / 40))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", width-marginRight)
            .attr("y", 10)
            .attr("fill", "darkorange")
            .attr("text-anchor", "start")
            .text(" Computer Science"));


    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "darkorange")
        .attr("stroke-width", 3)
        .attr("d", cs_line(data));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", ncs_line(data));

    // return svg.node();
    // Add svg to the body
    document.body.appendChild(svg.node());
    
    // Add dots to the line
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 10)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return cs(d.cs); })
        .attr("fill", "darkorange");

    
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 10)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return scale(d.ncs); })
        .attr("fill", "steelblue");

}


function makePctLinePlots(data, selected_metric){

    // Remove the previous plot
    d3.select("svg").remove();

    // Get the selected demo
    var selected_demo = $('input[name="demo"]:checked').val();

    // Filter the data based on the selected demo
    data = data.filter(function(d){ return d.demo == selected_demo; })

    const width = 928;
    const height = 500;
    const marginTop = 40;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 60;

    // Declare the x (horizontal position) scale.
    const x = d3.scaleLinear(d3.extent(data, d => d.year), [marginLeft, width - marginRight]);

    // // Declare the y (vertical position) scale.
    
    var maxmax = Math.max(d3.max(data, d => d.cs), d3.max(data, d => d.ncs));
    const scale = d3.scaleLinear([0, maxmax], [height - marginBottom, marginTop]);

    // const cs  = d3.scaleLinear([0, d3.max(data, d => d.cs)], [height - marginBottom, marginTop]);
    // const ncs = d3.scaleLinear([0, d3.max(data, d => d.ncs)], [height - marginBottom, marginTop]);

    // Declare the line generator.
    const cs_line = d3.line()
        .x(d => x(d.year))
        .y(d => scale(d.cs));

    // Declare the line generator.
    const ncs_line = d3.line()
        .x(d => x(d.year))
        .y(d => scale(d.ncs));

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("id", "lineplot")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    var text = (selected_metric == "percentage") ? "Percentage of Graduating class" : "Absolute count";
    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(scale).ticks(height / 40))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 15)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-size", "20px")
            .text("Graduates (" + text + ") by Year"));
            

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "darkorange")
        .attr("stroke-width", 3)
        .attr("d", cs_line(data));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", ncs_line(data));

    // return svg.node();
    // Add svg to the body
    document.body.appendChild(svg.node());
    
    // Add dots to the line
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 10)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return scale(d.cs); })
        .attr("fill", "darkorange");

    
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 10)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return scale(d.ncs); })
        .attr("fill", "steelblue");

}
readData();