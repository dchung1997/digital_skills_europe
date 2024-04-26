import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DotPlot = ({ data = [] }) => {
  const svgRef = useRef(null);
  const width = 928;
  const height = 36 * 16;

  useEffect(() => {
    if (data.length > 0) {
        const regions =  d3.group(data, d => d[0]);
    
        const marginTop = 30;
        const marginRight = 10;
        const marginBottom = 10;
        const marginLeft = 10; 
    
        // Prepare the scales for positional and color encodings.
        const x = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => Math.max(d[2], d[3]))])
          .rangeRound([340 + marginLeft, width - marginRight]);
    
        const domain = Array.from({ length: 9 }, (_, i) => i);
        const offset = (height - marginBottom) / 4 - 10;
        
        const y = d3
          .scalePoint()
          .domain(domain)
          .rangeRound([marginTop, (height - marginBottom) / 4])
          .padding(1);
    
        const color = d3
          .scaleOrdinal()
          .domain(['Male', 'Female'])
          .range(['#622F50', '#C7CC87']);
    
        // Create the SVG container.
        const svg = d3.select(svgRef.current);
    
        // Create the x axis.
        svg
          .append("g")
          .attr("transform", `translate(0,${marginTop})`)
          .call(d3.axisTop(x))
          .call((g) =>
            g
              .append("text")
              .text("Percentage (%) →")
              .attr("fill", "currentColor")
              .attr("transform", `translate(${width - marginRight},0)`)
              .attr("text-anchor", "end")
              .attr("dy", -22)
          )
          .call((g) =>
            g
              .selectAll(".tick line")
              .clone()
              .attr("stroke-opacity", 0.1)
              .attr("y2", height - marginBottom)
          )
          .call((g) => g.selectAll(".domain").remove());

        const region_arr = ['Southern Europe', 'Western Europe', 'Eastern Europe', 'Northern Europe'];
        const region_scale = d3.scaleOrdinal().domain(region_arr).range([25, 155, 285, 415]);
        const region_axis = d3.axisLeft(region_scale);
        svg.append("g")
          .call(region_axis)
          .call(g => g.attr("transform", "translate(330,0)"))          
          .call(g => g.select(".domain")
              .remove())
          .call(g => g.selectAll(".tick line")
              .remove())        
          .call(g => g
            .style("font-size", "12px")
            .style("font-weight", "bold"));            


        const indicators = ['Changed the settings of software, app or device', 'Edited photos, video or audio files', 'Downloaded or installed software or apps',
        'Created files integrating elements such as text, pictures, tables, charts', 'Written code in a programming language', 'Used word processing software',
        'Copied or moved files between folders, devices or on the cloud', 'Used spreadsheet software', 'Used advanced features of spreadsheet software']

        // Add a g container for each state.
        const g = svg
          .append("g")
          .attr("text-anchor", "end")
          .style("font", "10px sans-serif")

        let i = 0;
        regions.forEach(function(d) {
            svg.append("g")
            .selectAll('text.i-' + i)
            .data(indicators)
            .enter()
            .append('text')
            .attr("class", 'text.i-' + i)
            .attr("transform", (e, n) => `translate(320,${y(n) + i * offset})`)
            .text(function(d) {
              return d;
            })
            .attr("text-anchor", "end")
            .style("font", "10px sans-serif");

            g.selectAll(".indicator-line-" + i) 
            .data(d)
            .join("line")
            .attr("class", "indicator-line-" + i) 
            .attr("stroke", "#aaa")
            .attr("transform", (e, n) => `translate(0,${y(n) + i * offset})`)
            .attr("x1", (e) => x(e[2]))
            .attr("x2", (e) => x(e[3]));

            g.selectAll(".circle-male-" + i) 
            .data(d)
            .join("circle")
            .attr("class", "circle-male-" + i) 
            .attr("transform", (e, n) => `translate(0,${y(n) + i * offset})`)
            .attr("cx", (e) => x(e[2]))
            .attr("fill", (e) => color("Male"))
            .attr("r", 3.5);

            g.selectAll(".circle-female-" + i) 
            .data(d)
            .join("circle")
            .attr("class", "circle-female-" + i) 
            .attr("transform", (e, n) => `translate(0,${y(n) + i * offset})`)
            .attr("cx", (e) => x(e[3]))
            .attr("fill", (e) => color("Female"))
            .attr("r", 3.5);            

            i++;
        });


    } 
  }, [data]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} ref={svgRef}></svg>
  );
};

export default DotPlot;
