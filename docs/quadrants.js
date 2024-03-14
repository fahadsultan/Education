
function makePlot(){

    var quad_colors = {"1": "#2b83ba", "2": "#abdda4", "3": "#d7191c", "4": "#fdae61"};  

    d3.csv("gmaps_data.csv", d3.autoType).then(data => {

        // Remove the previous plot
        d3.select("svg").remove();

        var selected_demo = null;

        // Get the selected demo 
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {

            if (inputs[i].checked){
                selected_demo = inputs[i].value;
            }
        }

        var data2 = []
        for (var i = 0; i < data.length; i++) {
            
            if(data[i]['demo'] == selected_demo){
                data2.push(data[i]);
            }
                
        }
        data = data2;

        // Specify the dimensions of the chart.
        const width = 1200;
        const height = 700;
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;

        // waiting: cs_stat, eruptions: noncs_stat
        // Create the horizontal and vertical scales.
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.cs_stat)).nice()
            .rangeRound([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.noncs_stat)).nice()
            .rangeRound([height - marginBottom, marginTop]);

        // Compute the density contours.
        const contours = d3.contourDensity()
            .x(d => x(d.cs_stat))
            .y(d => y(d.noncs_stat))
            .size([width, height])
            .bandwidth(60)
            .thresholds(20)
            (data);

            // Create the SVG container.
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        // Add svg to the body
        document.body.appendChild(svg.node());

        // Append the axes.
        svg.append("g")
            .attr("transform", `translate(-100,${height - marginBottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
            .attr("y", -10)
            .attr("dy", null)
            .attr("font-weight", "bold")
            .attr("font-size", "20")
            .text("Non-CS coefficient"));

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .attr("font-size", "20")
            .text("CS coefficient"));

        // Append the contours.
        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-linejoin", "round")
            .selectAll()
            .data(contours)
            .join("path")
            .attr("stroke-width", (d, i) => i % 5 ? 1 : 5)
            .attr("d", d3.geoPath());

        // Append uni icons.
        svg.append("g")
            .attr("fill", "none")
            .attr("stroke-linejoin", "round")
            .selectAll()
            .data(data)
            .join("path")
            .attr("stroke-width", 1)
            .style("fill", "black")
            .attr("stroke", d => quad_colors[d.quadrant])
            .attr("class", "uni_icon")
            .attr("transform", d => `translate(${x(d.cs_stat)}, ${y(d.noncs_stat)}), scale(${parseInt(d.INSTSIZE)/2})`)   
            .attr("d", "M16 6.28a1.23 1.23 0 0 0-.62-1.07l-6.74-4a1.27 1.27 0 0 0-1.28 0l-6.75 4a1.25 1.25 0 0 0 0 2.15l1.92 1.12v2.81a1.28 1.28 0 0 0 .62 1.09l4.25 2.45a1.28 1.28 0 0 0 1.24 0l4.25-2.45a1.28 1.28 0 0 0 .62-1.09V8.45l1.24-.73v2.72H16V6.28zm-3.73 5L8 13.74l-4.22-2.45V9.22l3.58 2.13a1.29 1.29 0 0 0 1.28 0l3.62-2.16zM8 10.27l-6.75-4L8 2.26l6.75 4z");
        
            // Append dots.
        // svg.append("g")
        //     .attr("stroke", "white")
        //     .selectAll()
        //     .data(data)
        //     .join("circle")
        //     .attr("fill", d => d.cs_stat > d.noncs_stat ? "red" : "green")
        //     .attr("fill-opacity", 0.5)
        //     .attr("cx", d => x(d.cs_stat))
        //     .attr("cy", d => y(d.noncs_stat))
        //     .attr("r", d => parseInt(d.INSTSIZE*3));

        // Add info window to the dots
        svg.selectAll(".uni_icon")
            .on("mouseover", function(event, d) {

                //Add the tooltip
                d3.select(this)
                    .attr("fill-opacity", 1)
                    .attr("r", d => parseInt(d.INSTSIZE*3) + 5);
                svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", x(d.cs_stat))
                    .attr("y", y(d.noncs_stat))
                    .attr("text-anchor", "middle")
                    .attr("font-size", "25")
                    .text(d.INSTNM)
                    .attr("font-weight", "bold")
                    .attr("background-color", "black")
                    .attr("background-opacity", 0)
                    .attr("fill", "black");
            })
            .on("mouseout", function(event, d) {
                //Remove the tooltip
                d3.select(this)
                    .attr("fill", d => d.cs_stat > d.noncs_stat ? "red" : "green")
                    .attr("fill-opacity", 0.5)
                    .attr("r", d => parseInt(d.INSTSIZE*3));
                d3.select("#tooltip").remove();
            }
            );

        //Draw line that cuts through origin (0, 0)
        svg.append("line")
            .attr("x1", x(-1))
            .attr("y1", y(0))
            .attr("x2", x(1))
            .attr("y2", y(0))
            .attr("stroke-width", 5)
            .attr("stroke", "black")
            .attr("stroke-dasharray", "10,10");

        svg.append("line")
            .attr("x1", x(0))
            .attr("y1", y(1))
            .attr("x2", x(0))
            .attr("y2", y(-1))
            .attr("stroke-width", 5)
            .attr("stroke", "black")
            .attr("stroke-dasharray", "10,10");


        return svg.node();
    });

}

makePlot();