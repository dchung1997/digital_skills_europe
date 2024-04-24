import geojson from '../assets/europe.json'
import topojsonData from '../assets/NUTS_RG_20M_2016_4326_LEVL_3.json'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson'


const RelativeDifferenceChoropleth = ({ width, height, data, literacyData }) => {
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
    const filteredData = literacyData.filter(
        (d) => d['geo_code'] === "EU27_2020"
    );

    const europeUrbanAverage = filteredData.find(d => d['population'] === 'Live in cities');
    const europeIntermediateAverage = filteredData.find(d => d['population'] === 'Live in towns and suburbs');
    const europeRuralAverage = filteredData.find(d => d['population'] === 'Live in rural areas');

    // Show in comparison to country level not entire EU.
    const extent = d3.extent(literacyData, function(d) {
        const europeAverage = (parseInt(europeUrbanAverage['2021']) + parseInt(europeIntermediateAverage['2021']) + parseInt(europeRuralAverage['2021'])) / 3
        const relativeDiff = ((parseInt(d['2021']) - europeAverage) / europeAverage) * 100;
        return relativeDiff;
    });

    const colorScale = d3.scaleDiverging([extent[0], 0, extent[1]], d3.interpolateSpectral)   
    const code_map = {
        '3': 'Live in rural areas',
        '2': 'Live in towns and suburbs',
        '1': 'Live in cities'
    }

    svg.selectAll('path.features')
        .data(featureCollection.features)
        .join(
            enter => enter.append('path')
                .attr('class', 'features') 
                .attr('d', geoPath),
            update => update
                .attr('fill', function(d,i) {
                    const area = code_map[d.properties.URBN_TYPE];
                    const element = literacyData.find(function(e){
                        return area === e.population && e.geo_code === d.properties.CNTR_CODE;
                    });

                    if (element) {
                        const europeAverage = (parseInt(europeUrbanAverage['2021']) + parseInt(europeIntermediateAverage['2021']) + parseInt(europeRuralAverage['2021'])) / 3
                        const relativeDiff = ((parseInt(element['2021']) - europeAverage) / europeAverage) * 100;
                        return colorScale(relativeDiff);                            
                    }
                    return 'lightgrey';
                })
                .attr('stroke-width', 0.25)
                .attr('stroke', 'grey'),
            exit => exit.remove()
            )
        .append("title")
        .text(function(d) {
            const area = code_map[d.properties.URBN_TYPE];
            const element = literacyData.find(function(e){
                return area === e.population && e.geo_code === d.properties.CNTR_CODE;
            });     

            if (element) {
                const europeAverage = (parseInt(europeUrbanAverage['2021']) + parseInt(europeIntermediateAverage['2021']) + parseInt(europeRuralAverage['2021'])) / 3
                const relativeDiff = ((parseInt(element['2021']) - europeAverage) / europeAverage) * 100;
                return `${d.properties.NUTS_NAME}, ${d.properties.CNTR_CODE}\n${relativeDiff.toFixed(2)}%`;
            } else {
                this.remove();                
            }
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

  }, [data, literacyData, width, height]); 

  return (
    <svg viewBox={`0 0 ${width} ${height}`} ref={svgRef}>
    </svg>
  );
};

export default RelativeDifferenceChoropleth;