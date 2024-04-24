import "./Scrollytelling.css";
import React, { useState, useEffect } from "react";
import ruralUrbanData from "../assets/urban_rural-remotedness-typology-2021.tsv";
import literacyRateData from "../assets/basic_regional_literacy_rates_2021.csv";


import { Scrollama, Step } from 'react-scrollama';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image"

import * as d3 from "d3";

import RelativeDifferenceChoropleth from "../components/RelativeDifferenceChoropleth";
import AccessibilityChoropleth from "../components/AccessibilityChoropleth";
import RuralUrbanChoropleth from "../components/RuralUrbanChoropleth";

import Legend from "../components/Legend";
import LeftBehindChoropleth from "../components/LeftBehindChoropleth";

function ScrollyTelling() {
  const [chartData, setChartData] = useState([]);
  const [literacyData, setLiteracyData] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(null);

  const onStepEnter = ({ data }) => {
    setCurrentStepIndex(data);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await d3.tsv(ruralUrbanData); // Or use raw data if defined inline
      setChartData(response);
    }

    async function fetchLiteracyData() {
      const response = await d3.csv(literacyRateData); // Or use raw data if defined inline
      setLiteracyData(response);
    }

    fetchData();
    fetchLiteracyData();
  }, []);

  return (
    <Container fluid id="urban-rural-page">
      <Scrollama offset={0.5} onStepEnter={onStepEnter}>
        <Step data={1} key={1}>
          <div
            style={{
              margin: '10vh 0',
              opacity: currentStepIndex === 1 ? 1 : 0.2,
            }}
          >
            <Row>
              <Col sm></Col>
              <Col sm className="page-content">
                <h3>Rural - Urban Gap</h3>
                <p>
                  Large gaps exist in Basic Digital Literacy in almost every country. 
                  When compared to the Eurozone Average a difference of 10-30% can be seen in most countries
                  between the Rural and Urban populations. At a regional level it becomes clear that the Southern
                  European Countries have the largest difference between the average. Countries such as Portugal
                  stand out. While arould half of Portugese lived in Rural Areas or Towns, and Suburbs. Huge gaps 
                  were apparent in digital literacy skills. Similarly in Sweden and Finland, countries with higher 
                  digital literacy rates both had a difference of around 30% in comparison to the Eurozone average
                  when comparing Rural to Urban digital literacy rates.
                </p>
              </Col>
              <Col sm>
                <Row>
                  <Col></Col>
                  <Col xs={8}>
                    <Legend
                      color={d3.scaleDiverging(
                        [-66.92913385826772, 0, 65.35433070866141],
                        d3.interpolateSpectral
                      )}
                      title="Basic Digital Literacy vs. Eurozone Average (Relative Difference %)"
                    />
                  </Col>
                  <Col></Col>
                </Row>
                <RelativeDifferenceChoropleth
                  width={400}
                  height={400}
                  data={chartData}
                  literacyData={literacyData}
                />
              </Col>
              <Col sm></Col>
            </Row>            
          </div>
        </Step>
        <Step data={2} key={2}>
          <div
            style={{
              margin: '10vh 0',
              opacity: currentStepIndex === 2 ? 1 : 0.2,
            }}
          >
            <Row>
              <Col></Col>
              <Col sm className="page-content">
                <h3>Unequal Distribution</h3>
                <p>
                  Throughout most of Europe approximately 60% of Europeans lived in Towns, Suburbs, and Rural Areas. 
                  With little to no difference in population demographics between Rural and Urban population groups 
                  in most European Countries these gaps are significant.
                </p>
              </Col>              
              <Col sm>
                <Image src='/population_distribution.png'/>
                <small>
                  Source: 
                  <a href="https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Urban-rural_Europe_-_introduction">
                  Urban-Rural Europe Introduction Eurostat
                  </a>
                </small>
              </Col>
              <Col></Col>
            </Row>            
          </div>
        </Step>    
        <Step data={3} key={3}>
          <div
            style={{
              margin: '10vh 0',
              opacity: currentStepIndex === 3 ? 1 : 0.2,
            }}
          >
          <Row>
            <Col sm></Col>
            <Col sm className="page-content">
              <h3>Commutable Distance</h3>
              <p>
                One of the biggest challenges in improving Digital Literacy is in the infrastructure 
                required for places such as businesses to operate. This can take place in my different forms
                such as access to high-speed internet. But also in spaces such as offices and workplaces.
                Businesses are often unwilling to front these costs as such cities make an ideal location 
                for businesses to operate from.
              </p>
              <p>
                While accessibility to a city is important it doesn't necessarily translate to job opportunities
                it could possibly increase the number of opportunities for individuals living in these areas.
                But for many places this can be out of reach.
              </p>
            </Col>
            <Col sm>
              <AccessibilityChoropleth
                width={400}
                height={400}
                data={chartData}
              />
            </Col>
            <Col sm></Col>
          </Row>            
          </div>
        </Step>      
        <Step data={4} key={4}>
          <div
            style={{
              margin: '10vh 0',
              opacity: currentStepIndex === 4 ? 1 : 0.2,
            }}
          >
            <Row>
              <Col sm></Col>
              <Col sm className="page-content">
                <h3>Missing Opportunities</h3>
                <p>
                  For most businesses having access to larger talent pools is often desirable.
                  In many situations places such as mostly Rural locations are undesirable.
                  Even when a city of 50,000 people could be within a commutable distance
                  expanding businesses in this way can be a prohibitively expensive task.
                </p>
              </Col>
              <Col sm>
                <RuralUrbanChoropleth
                  width={400}
                  height={400}
                  data={chartData}
                />
              </Col>
              <Col sm></Col>
            </Row>               
          </div>
        </Step>  
        <Step data={5} key={5}>
          <div
            style={{
              margin: '10vh 0',
              opacity: currentStepIndex === 5 ? 1 : 0.2,
            }}
          >
            <Row>
              <Col sm></Col>
              <Col sm className="page-content">
                <h3>Left Behind</h3>
                <p>
                  For many in remote and rural areas improvements to Digital Skills may not result in better economic opportunities.
                  As a result we could see little to no change in intermediate digital literacy rates in these areas. While an increased
                  usage of technology for day to day activites may cause basic digital literacy to increase. Intermediate indictors that
                  are associated with white collar work may see little to no change.
                </p>
              </Col>
              <Col sm>
                <LeftBehindChoropleth
                  width={400}
                  height={400}
                  data={chartData}
                />
              </Col>
              <Col sm></Col>
            </Row>                    
          </div>
        </Step>               
      </Scrollama>             
    </Container> 
  );
}

export default ScrollyTelling;
