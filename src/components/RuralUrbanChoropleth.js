import geojson from '../assets/europe.json'
import topojsonData from '../assets/NUTS_RG_20M_2016_4326_LEVL_3.json'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson'


const RuralUrbanChoropleth = ({ width, height, data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    // Define projection (adjust based on your map data)
    const projection = d3.geoConicConformal()
    .center([14.19, 53])
    .translate([width/2, height/2])
    .scale(width * 1.3)

    // Color scale based on your data value (replace 'value' with your property name)
    const geoPath = d3.geoPath().projection(projection);
    const featureCollection = topojson.feature(topojsonData, topojsonData.objects.NUTS_RG_20M_2016_4326);
    const colorScale = d3.scaleOrdinal([1,2,3], [d3.schemeCategory10[0], d3.schemeCategory10[1], d3.schemeCategory10[2]])

    const code_map = {
        '1': 'Live in cities',
        '2': 'Live in towns and suburbs',
        '3': 'Live in rural areas'
    }

    svg.selectAll('path.features')
        .data(featureCollection.features)
        .join(
            enter => enter.append('path')
                .attr('class', 'features') 
                .attr('d', geoPath),
            update => update
                .attr('fill', function(d,i) {
                    return colorScale(d.properties.URBN_TYPE);
                })
                .attr('stroke-width', 0.25)
                .attr('stroke', function(d) {
                    const element = data.find(function(e) { return d.id === e.CODE; });
                    if (element) {
                        return "lightgrey"
                    }
                }),
            exit => exit.remove()
            )
        .append("title")
        .text(function(d) {
            const area = code_map[d.properties.URBN_TYPE];
            return `${d.properties.NUTS_NAME}, ${d.properties.CNTR_CODE}: ${area}`;
        });            

        svg.selectAll('path.outline')
            .data(geojson.features)
            .join(
                enter => enter.append('path')
                    .attr('class', 'outline') 
                    .attr('d', geoPath),
                update => update
                    .attr('fill', 'none')
                    .attr('stroke-width', 0.5)
                    .attr('stroke', 'black'),
                exit => exit.remove()
                );         

    // Legend as a group
    const legend = svg.append("g")
    // Apply a translation to the entire group 
    .attr("transform", "translate(290, 100)")

    const size = 8;
    const border_padding = 10;
    const item_padding = 2;
    const text_offset = 2;

    // Title
    legend.append("text")
    .attr("x", border_padding + item_padding + text_offset)
    .attr("y", 5)
    .text("Rural - Urban Typology")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")         
    .style('font-size', '8px');        

    // Boxes
    legend.selectAll("boxes")
    .data([1,2,3])
    .enter()
    .append("rect")
    .attr("x", border_padding + 5)
    .attr("y", (d, i) => border_padding + (i * (size + item_padding)))
    .attr("width", size)
    .attr("height", size)
    .style("fill", (d) => colorScale(d))
    .style("stroke", "lightgrey")
    .style("stroke-width", 0.5);
    
    // Labels
    legend.selectAll("labels")
    .data(['Urban', 'Intermediate', 'Rural'])
    .enter()
    .append("text")
    .attr("x", border_padding + size + item_padding + 5)
    .attr("y", (d, i) => border_padding + i * (size + item_padding) + (size / 2) + text_offset)
    .text((d, i) => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")               
    .style('font-size', '8px');                      

  }, [data, width, height]); 

  return (
    <svg viewBox={`0 0 ${width} ${height}`} ref={svgRef}>
    </svg>
  );
};

export default RuralUrbanChoropleth;