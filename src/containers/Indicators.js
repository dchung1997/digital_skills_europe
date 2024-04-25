import './Indicators.css';
import all_ages_data from '../assets/all_ages_25_64.csv'

import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ChoroplethMap from '../components/Choropleth';

import * as d3 from 'd3';

function Indicators() {
    const [data, setData] = useState([]);
     
    function separateByIndicatorCode(data) {
        const separatedData = {};
      
        for (const item of data) {
          const indicatorCode = item.indicator_code;
      
          // Check if an array already exists for this indicator code
          if (!separatedData[indicatorCode]) {
            separatedData[indicatorCode] = [];
          }
      
          // Add the current item to the corresponding array
          separatedData[indicatorCode].push(item);
        }
      
        return separatedData;
    }   

    useEffect(() => {
      async function fetchBasicData() {
        const response = await d3.csv(all_ages_data);
        const separated = separateByIndicatorCode(response);
        setData(separated)        
      };
      fetchBasicData();
    }, [])

  return (
    <Container fluid id="indicators-page">
        <Row>
            <Col sm></Col>
            <Col xs={8} className='page-content'>
                <h3>A Brief Overview</h3>
                <h5>Basic Digital Literacy</h5>
                <Row>
                    <Col>
                        <h5>Changed the settings of software, app or device</h5>
                        { data['I_CCONF1'] ? <ChoroplethMap width={400} height={400} data={data['I_CCONF1']} absolute={true} interpolate={"interpolateBlues"}/> : <></>}
                    </Col>
                    <Col>
                        <h5>Edited photos, video or audio files</h5>
                        { data['I_CEPVA1'] ? <ChoroplethMap width={400} height={400} data={data['I_CEPVA1']} absolute={true} interpolate={"interpolateBlues"}/> : <></>}
                    </Col>                    
                    <Col>
                        <h5>Downloaded or installed software or apps</h5>
                        { data['I_CINSAPP1'] ? <ChoroplethMap width={400} height={400} data={data['I_CINSAPP1']} absolute={true} interpolate={"interpolateBlues"}/> : <></>}
                    </Col>      
                    <Col>
                        <h5>Copied or moved files between folders, devices or on the cloud</h5>
                        { data['I_CXFER1'] ? <ChoroplethMap width={400} height={400} data={data['I_CXFER1']} absolute={true} interpolate={"interpolateBlues"}/> : <></>}
                    </Col>                                  
                </Row>
            </Col>
            <Col sm></Col>
        </Row>
        <Row>
            <Col></Col>
            <Col xs={6}>
                <Row>
                    <h5>Intermediate Digital Literacy</h5>
                    <Col>
                        <h5>Created files integrating elements such as text, pictures, tables, charts</h5>
                        { data['I_CPRES2'] ? <ChoroplethMap width={400} height={400} data={data['I_CPRES2']} absolute={true} interpolate={"interpolateOranges"}/> : <></>}
                    </Col>       
                    <Col>
                        <h5>Used word processing software</h5>
                        { data['I_CWRD1'] ? <ChoroplethMap width={400} height={400} data={data['I_CWRD1']} absolute={true} interpolate={"interpolateOranges"}/> : <></>}
                    </Col>                    
                    <Col>
                        <h5>Used spreadsheet software</h5>
                        { data['I_CXLS1'] ? <ChoroplethMap width={400} height={400} data={data['I_CXLS1']} absolute={true} interpolate={"interpolateOranges"}/> : <></>}
                    </Col> 
                </Row>                             
            </Col>
            <Col></Col>
        </Row>
        <Row>
            <Col></Col>
            <Col xs={4}>
                <Row>
                    <h5>Advanced Digital Literacy</h5>
                    <Col>
                        <h5>Used advanced features of spreadsheet software</h5>
                        { data['I_CXLSADV1'] ? <ChoroplethMap width={400} height={400} data={data['I_CXLSADV1']} absolute={true} interpolate="interpolateYlGn"/> : <></>}
                    </Col>                    
                    <Col>
                        <h5>Written code in a programming language</h5>
                        { data['I_CPRG2'] ? <ChoroplethMap width={400} height={400} data={data['I_CPRG2']} absolute={true} interpolate="interpolateYlGn"/> : <></>}
                    </Col>                       
                </Row>
            </Col>
            <Col></Col>                             
        </Row>
    </Container>      
  );
}

export default Indicators;