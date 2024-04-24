import geojson from '../assets/europe.json'
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


const ChoroplethMap = ({ width, height, data, absolute, interpolate, year=2021}) => {
  const svgRef = useRef(null);
    
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Define projection (adjust based on your map data)
    const projection = d3.geoConicConformal()
    .center([14.19, 53])
    .translate([width/2, height/2])
    .scale(width * 1.3)

    // Color scale based on your data value (replace 'value' with your property name)
    const interpolater = interpolate ? interpolate : d3.interpolateYlGnBu;
    const scale = absolute ? d3.scaleSequential([0, 100], interpolater) : d3.scaleSequential(d3.extent(data, (d) => parseInt(d[year])), interpolater);
    const geoPath = d3.geoPath().projection(projection);

    // Add Data here.
    svg.selectAll('path')
        .data(geojson.features)
        .join(
            enter => enter.append('path')
                .attr('d', geoPath),
            update => update
                .attr('fill', function(d) {
                    const element = data.find(function(e){
                        if (d.id === 'GR') {
                            return e['geo_code'] === 'EL';
                        }
                        return e['geo_code'] === d.id;
                    }); 
                    if (element) {
                        return scale(element[year]);
                    }
                    return 'lightgrey';
                })
                .attr('stroke-width', 0.5)
                .attr('stroke', 'black'),
            exit => exit.remove()
            )
            .append("title")
            .text(function(d) {
                const element = data.find(function(e){
                    if (d.id === 'GR') {
                        return e['geo_code'] === 'EL';
                    }
                    return e['geo_code'] === d.id;
                }); 

                if (element) {
                    return `${d.properties.name}, ${d.properties.id}\n${parseFloat(element[year]).toFixed(2)}%`;
                } else {
                    this.remove();                
                }
            });            
    
    // Legend as a group
    const legend = svg.append("g")
    // Apply a translation to the entire group 
    .attr("transform", "translate(300, 100)")

    const size = 8;
    const border_padding = 10;
    const item_padding = 2;
    const text_offset = 2;

    // Title
    legend.append("text")
    .attr("x", border_padding + item_padding + text_offset)
    .attr("y", 5)
    .text("Rates (%)")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")         
    .style('font-size', '8px');        

    // Boxes
    legend.selectAll("boxes")
    .data([20, 30, 40, 50, 60, 70])
    .enter()
    .append("rect")
    .attr("x", border_padding + 5)
    .attr("y", (d, i) => border_padding + (i * (size + item_padding)))
    .attr("width", size)
    .attr("height", size)
    .style("fill", (d, i) => scale(d));

    // Labels
    legend.selectAll("labels")
    .data([20, 30, 40, 50, 60, 70])
    .enter()
    .append("text")
    .attr("x", border_padding + size + item_padding + 5)
    .attr("y", (d, i) => border_padding + i * (size + item_padding) + (size / 2) + text_offset)
    .text((d, i) => d + "%")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")               
    .style('font-size', '8px');        

  }, [data, absolute, interpolate, year, width, height]); 

  return (
    <svg viewBox={`0 0 ${width} ${height}`} ref={svgRef}>
    </svg>
  );
};

export default ChoroplethMap;