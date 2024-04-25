import './Cover.css';
import React, { useState, useEffect } from 'react';
import ageData from '../assets/basic_literacy_rates.csv'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import * as d3 from 'd3';

import ChoroplethMap from '../components/Choropleth';

function Cover() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
    const response = await d3.csv(ageData); // Or use raw data if defined inline
    setChartData(response);
    };
    fetchData();
  }, [])

  return (
    <Container fluid id="cover-page">
        <Row>
            <Col sm></Col>
            <Col sm className='page-content'>
                <h1>The European Digital Divide</h1>
                <p>
                  In Europe, more than 90% of professional roles require a basic level
                  of digital knowledge, just as they require basic literacy and
                  numeracy skills. The use of digital is spreading across all sectors
                  from business to transport and even to farming. Yet, around 42% of
                  Europeans lack basic digital skills, including 37% of those in the
                  workforce. Experts at the European Commission Eurostat have been hard at work 
                  looking into discrepencies in digital skills which they have termed the Digital Divide.
                </p>
                <p>
                  Discrepencies can be seen throughout Digital Literacy metrics. 
                  From the difference levels of Digital Literacy to Individual Indicators.
                  The Digital Divide encompasses a wide range of issues such as Gender Inequality to 
                  Educational Opportunities. From Regional Inequalities to Country level gaps exist 
                  in Digital Literacy skills. This can have an impact on individual lives. These
                  indicators can give us insight in the possible opportunties for improvement and 
                  the gaps that already exist. 
                </p>
            </Col>
            <Col sm>
                <ChoroplethMap width={400} height={400} data={chartData} absolute={true}/>
                <small>Basic Digital Literacy Rates (%) Working Age Adults 25-64 </small>
            </Col>
            <Col sm></Col>
        </Row>
    </Container>      
  );
}

export default Cover;