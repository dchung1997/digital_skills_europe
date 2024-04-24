import './Explorer.css';
import demographicsData from '../assets/population_demographics.csv';
import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import * as d3 from 'd3';

import MyForm from '../components/MyForm';
import MyCarousel from '../components/Carousel';
import ChoroplethMap from '../components/Choropleth';


function Explorer() {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [waffleData, setWaffleData] = useState([]);   
    const [regionData, setRegionData] = useState([]);    
    const [formData, setFormData] = useState({});

    const handleFormUpdate = (data) => {
      setFormData(data);
    };
  
    useEffect(() => {
        async function fetchData() {
            const response = await d3.csv(demographicsData); // Or use raw data if defined inline
            setData(response);
        };
        fetchData();
    }, [])

    useEffect(() => {
        // Set Chart Data here based on Indicator and Subset.
        const subset_params = `${formData['gender'] ? formData['gender'] + '_' : ''}${formData['ageRange'] || formData['education'] || 'IND_TOTAL'}`;
        const indicator_table = {
            1: 'I_CCONF1',
            2: 'I_CXFER1',
            3: 'I_CPRES2',
            4: 'I_CINSAPP1',
            5: 'I_CEPVA1',
            6: 'I_CXLSADV1',
            7: 'I_CXLS1',
            8: 'I_CWRD1',
            9: 'I_CPRG2'
        }
        
        function getSubsetByPopulationCode(items, targetPopulationCode) {
            return items.filter(item => item.population_code === targetPopulationCode);
        }

        function getSubsetByIndicatorCode(items, targetIndicatorCode) {
            return items.filter(item => item.indicator_code === targetIndicatorCode);
        }
        
        const filtered_population_subset = getSubsetByPopulationCode(data, subset_params);
        const filtered_indicator_subset = getSubsetByIndicatorCode(filtered_population_subset, indicator_table[formData['indicator']]);

        setWaffleData(filtered_population_subset)
        setChartData(filtered_indicator_subset);

    }, [formData, data])

    useEffect(() => {
        // Used for Regions in Waffle Chart Carousel.
        const regionMap = {"Iceland":"Northern Europe","Ireland":"Northern Europe","Denmark":"Northern Europe","Sweden":"Northern Europe","Norway":"Northern Europe","Finland":"Northern Europe","Lithuania":"Northern Europe","Latvia":"Northern Europe","Estonia":"Northern Europe","Poland":"Eastern Europe","Czechia":"Eastern Europe","Slovakia":"Eastern Europe","Hungary":"Eastern Europe","Romania":"Eastern Europe","Moldova":"Eastern Europe","Bulgaria":"Eastern Europe","Serbia":"Southern Europe","Kosovo":"Southern Europe","Albania":"Southern Europe","Montenegro":"Southern Europe","Bosnia and Herzegovina":"Southern Europe","Croatia":"Southern Europe","Slovenia":"Southern Europe","Italy":"Southern Europe","North Macedonia":"Southern Europe","Greece":"Southern Europe","Spain":"Southern Europe","Portugal":"Southern Europe","Türkiye": "Southern Europe", "Cyprus": "Southern Europe", "Malta": "Southern Europe", "Switzerland":"Western Europe","Austria":"Western Europe","Germany":"Western Europe","Netherlands":"Western Europe","Belgium":"Western Europe","France":"Western Europe","Luxembourg":"Western Europe"};
        const regionCodes = { "Northern Europe": 0, "Southern Europe": 1, "Eastern Europe": 2, "Western Europe": 3 }

        function sumValuesByGeoCode(data) {
            const resultMap = {};
          
            for (const item of data) {
              const geoCode = item.geo;
              const value = parseFloat(item['2021'] || 0); // Handle potential missing values
              const indicatorCode = item.indicator_code;
          
              // Categorize based on indicator code prefix (assuming basic starts with "B_", etc.)
              const category = (["I_CCONF1", "I_CEPVA1", "I_CINSAPP1", "I_CXFER1"].includes(indicatorCode)) ? "basic" :
              (["I_CWRD1", "I_CPRES2", "I_CXLS1"].includes(indicatorCode)) ? "intermediate" : "advanced";
          
              if (!resultMap[geoCode]) {
                resultMap[geoCode] = { basic: 0, intermediate: 0, advanced: 0 };
              }
          
              resultMap[geoCode][category] += value;
            }
          
            return resultMap;
        }
        
        function filterZeroSumResults(resultMap) {
            const filteredResults = {};
    
            // Loop through each geoCode in the resultMap
            for (const geoCode in resultMap) {
                const categoryValues = resultMap[geoCode];
    
                // Check if any category has a non-zero value
                if (Object.values(categoryValues).some(value => value !== 0)) {
                filteredResults[geoCode] = categoryValues;
                }
            }
    
            return filteredResults;
        }

        function createRegionData(data, regionMap, regionCodes) {
            const regions = [[], [], [], []]; // Four empty arrays for each region
          
            for (const country in data) {
              const region = regionMap[country]; // Get the region for the current country
              const code = regionCodes[region]; // Get the code for the region
          
              if (code !== undefined) { // Check if region code exists
                const countryData = { country, ...data[country] }; // Extract country and category values
          
                regions[code].push(countryData); // Add country data to the corresponding region array
              }
            }
          
            return regions;
          }        

        const values = sumValuesByGeoCode(waffleData);
        const filteredValues = filterZeroSumResults(values);
        const regionData = createRegionData(filteredValues, regionMap, regionCodes);
        setRegionData(regionData);

    }, [waffleData])


  return (
    <Container fluid id="explorer-page">
      <Row>
        <Col sm></Col>
        <Col xs={6} className="page-content">
          <h3>Europe at a Glance</h3>
          <Row>
            <Col>
              <MyForm onChange={handleFormUpdate} />
            </Col>
            <Col>
              <ChoroplethMap
                width={400}
                height={400}
                data={chartData}
                absolute={true}
                year={formData["year"]}
              />
            </Col>
          </Row>
        </Col>
        <Col sm></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col xs={6}>
          <h5>Northern Europe </h5>
          <MyCarousel data={regionData[0]}/>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col xs={6}>
          <h5>Southern Europe </h5>
          <MyCarousel data={regionData[1]}/>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col xs={6}>
          <h5>Western Europe </h5>
          <MyCarousel data={regionData[3]}/>
        </Col>
        <Col></Col>
      </Row>      
      <Row>
        <Col></Col>
        <Col xs={6}>
          <h5>Eastern Europe </h5>
          <MyCarousel data={regionData[2]}/>
        </Col>
        <Col></Col>
      </Row>      
    </Container>
  );
}

export default Explorer;