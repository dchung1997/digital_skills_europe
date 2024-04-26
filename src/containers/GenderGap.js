import './Explorer.css';
import React, { useState, useEffect } from 'react';
import fData from '../assets/female_25_64.csv';
import mData from '../assets/male_25_64.csv';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import * as d3 from 'd3';

import DotPlot from '../components/DotPlot';


function GenderGap() {
    const [maleData, setMaleData] = useState([]);
    const [femaleData, setFemaleData] = useState([]);
    const [regionData, setRegionData] = useState([]);    

    useEffect(() => {
        async function fetchMaleData() {
            const response = await d3.csv(fData); // Or use raw data if defined inline
            setMaleData(response);
        };

        async function fetchFemaleData() {
          const response = await d3.csv(mData); // Or use raw data if defined inline
          setFemaleData(response);
      };

      fetchMaleData();
      fetchFemaleData();
    }, [])

    useEffect(() => {
        // Used for Regions in Waffle Chart Carousel.
        const regionMap = {"Iceland":"Northern Europe","Ireland":"Northern Europe","Denmark":"Northern Europe","Sweden":"Northern Europe","Norway":"Northern Europe","Finland":"Northern Europe","Lithuania":"Northern Europe","Latvia":"Northern Europe","Estonia":"Northern Europe","Poland":"Eastern Europe","Czechia":"Eastern Europe","Slovakia":"Eastern Europe","Hungary":"Eastern Europe","Romania":"Eastern Europe","Moldova":"Eastern Europe","Bulgaria":"Eastern Europe","Serbia":"Southern Europe","Kosovo":"Southern Europe","Albania":"Southern Europe","Montenegro":"Southern Europe","Bosnia and Herzegovina":"Southern Europe","Croatia":"Southern Europe","Slovenia":"Southern Europe","Italy":"Southern Europe","North Macedonia":"Southern Europe","Greece":"Southern Europe","Spain":"Southern Europe","Portugal":"Southern Europe","Türkiye": "Southern Europe", "Cyprus": "Southern Europe", "Malta": "Southern Europe", "Switzerland":"Western Europe","Austria":"Western Europe","Germany":"Western Europe","Netherlands":"Western Europe","Belgium":"Western Europe","France":"Western Europe","Luxembourg":"Western Europe"};
        const regionCounts = {
          "Northern Europe": 9, 
          "Eastern Europe": 7,
          "Southern Europe": 15,
          "Western Europe": 7
        }

        function sumValuesByRegion(data, gender) {
              const results = [];

            for (const item of data) {
              const geoCode = item.geo;
              const region = regionMap[geoCode];
              const value = parseFloat(item['2021'] || 0); // Handle potential missing values
              const indicatorCode = item.indicator_code;
              const element = results.find(function(d) {
                return d['region'] === region && d['indicatorCode'] === indicatorCode;
              });

              if (!element && region !== undefined) {
                results.push({
                  'region': region,
                  'indicatorCode': indicatorCode,
                  'value': value,
                  'gender': gender,
                })
              } else {
                if (region) {
                  element['value'] += value;              
                }
              }
            }
          
            return results;
        }

        function adjustByRegionCount(data) {
          return data.map(item => {
            const count = regionCounts[item.region] || 1; // Get the count for the region (default to 1)
            return { ...item, value: item.value / count }; // Create a new object with adjusted value
          });
        }

        function createTuples(maleValues, femaleValues) {
          const tuples = [];
          for (const maleValue of maleValues) {
            const { region, indicatorCode, value: mValue } = maleValue;
            const matchingFemaleValue = femaleValues.find(
              (femaleValue) => femaleValue.region === region && femaleValue.indicatorCode === indicatorCode
            );
            if (matchingFemaleValue) {
              const { value: fValue } = matchingFemaleValue;
              tuples.push([region, indicatorCode, mValue, fValue]);
            }
          }
          return tuples;
        }        
        
        const maleValues = sumValuesByRegion(maleData, 'male');
        const femaleValues = sumValuesByRegion(femaleData, 'female');
        const adjMale = adjustByRegionCount(maleValues);
        const adjFemale = adjustByRegionCount(femaleValues)
        setRegionData(createTuples(adjMale, adjFemale));
      }, [maleData, femaleData])


  return (
    <Container fluid id="explorer-page">
      <Row>
        <Col sm></Col>
        <Col xs={6} className="page-content">
          <h3>Gender Gap</h3>
          <Row>
            <Col>
              <DotPlot data={regionData}/>            
            </Col>                   
          </Row>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default GenderGap;