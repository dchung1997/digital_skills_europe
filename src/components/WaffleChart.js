import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


const WaffleChart = ({ width, height, data }) => {
  const svgRef = useRef(null);
    
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    // Legend and Title.
    // Country Name and Basic, Intermediate and Advanced in Left (Axist Left);
    let gTitle = svg.append("g")
    gTitle.append("text")
        .text(data.country) 
        .attr("x", 25)
        .attr("y", 15) 
        .attr("dy", ".35em") 
        .attr("font-size", "8px") 

    const historical_dates = ['Basic', 'Intermediate', 'Advanced']
    const historical_scale = d3.scaleOrdinal().domain(historical_dates).range([24, 59.5, 86.5]);
    const historical_axis = d3.axisLeft(historical_scale);
    svg.append("g")
    .attr("transform", `translate(33.5,0)`)    
    .call(historical_axis)
        .call(g => g.select(".domain")
            .remove())
        .call(g => g.selectAll(".tick line")
            .remove())        
        .call(g => g
        .style("font-size", "4px"));

    drawGrid(data, svg)

  }, [data, drawGrid, width, height]); 

  function drawGrid(data, svg) {
    const scaleX = d3.scaleLinear().domain([0,9]).range([25,width]);
    const scaleY = d3.scaleLinear().domain([0,9]).range([20,height-5]);    
    const colorScale = d3.scaleOrdinal().domain(['Basic', 'Intermediate', 'Advanced']).range([d3.schemeCategory10[0], d3.schemeCategory10[1], d3.schemeCategory10[2]]);

    const percentages = {
      basic: Math.ceil((data['basic'] / 400) * 100),
      intermediate: Math.ceil((data['intermediate'] / 300) * 100),
      advanced: Math.ceil((data['advanced'] / 200) * 100)
    };

    const g = svg.append("g");
    
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const category = getCategory(y);

        g.append("rect")
        .attr("width", 8)
        .attr("height", 8)
        .attr("x", () => scaleX(x))    
        .attr("y", () => scaleY(y)) 
        .attr("fill", function() {
            return checkPercent(x,y, percentages[category]) ? colorScale(category) : "lightgrey";
        });
      }
    }
  }
  
  function getCategory(row) {
    if (row < 4) {
      return 'basic';
    } else if (row < 7) {
      return 'intermediate';
    } else {
      return 'advanced';
    }
  }  

  function checkPercent(x, y, percentage) {
    const row = y;
    const currentIndex = 10 * y + x;
    if (row < 4) {
        if (Math.round((currentIndex / 40) * 100) < percentage) {
            return true;
        }
        return false;
      } else if (row < 7) {
        if (Math.round(((currentIndex - 40) / 30) * 100) < percentage) {
            return true;
        }
        return false;
      } else {
        if (Math.round(((currentIndex - 70) / 20) * 100) < percentage) {
            return true;
        }
        return false;
      }    
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} ref={svgRef}>
    </svg>
  );
};

export default WaffleChart;