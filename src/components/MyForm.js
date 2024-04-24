import React, { useState, useEffect } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";

const MyForm = (props) => {
  const [selectedYear, setSelectedYear] = useState('2021'); // Initial state
  const [selectedAgeRange, setSelectedAgeRange] = useState('Y25_64');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedEducation, setSelectedEducation] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState(1);

  useEffect(() => {
    props.onChange({  // Call the prop function with updated data on change
      year: selectedYear,
      ageRange: selectedAgeRange,
      gender: selectedGender,
      education: selectedEducation,
      indicator: selectedIndicator,
    });   
  }, []); 

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    props.onChange({  // Call the prop function with updated data on change
      year: e.target.value,
      ageRange: selectedAgeRange,
      gender: selectedGender,
      education: selectedEducation,
      indicator: selectedIndicator,
    });   
  };

  const handleAgeRangeChange = (e) => {
    setSelectedAgeRange(e.target.value);
    props.onChange({  // Call the prop function with updated data on change
      year: selectedYear,
      ageRange: e.target.value,
      gender: selectedGender,
      education: selectedEducation,
      indicator: selectedIndicator,
    });       
  };  

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
    props.onChange({  // Call the prop function with updated data on change
      year: selectedYear,
      ageRange: selectedAgeRange,
      gender: e.target.value,
      education: selectedEducation,
      indicator: selectedIndicator,
    });       
  };  

  const handleEducationChange = (e) => {
    setSelectedEducation(e.target.value);
    props.onChange({  // Call the prop function with updated data on change
      year: selectedYear,
      ageRange: selectedAgeRange,
      gender: selectedGender,
      education: e.target.value,
      indicator: selectedIndicator,
    });       
  };  
  
  const handleIndicatorChange = (e) => {
    setSelectedIndicator(e.target.value);
    props.onChange({  // Call the prop function with updated data on change
      year: selectedYear,
      ageRange: selectedAgeRange,
      gender: selectedGender,
      education: selectedEducation,
      indicator: e.target.value,
    });       
  };    

  return (
    <Card>
      <Card.Body>
        <Row>
          <Col>
            <Form.Label>Indicator</Form.Label>
            <Form.Select
              size="lg"
              value={selectedIndicator}
              onChange={handleIndicatorChange}
              name="indicator"
            >
              <option value={1}>Changed the settings of software, app or device, last 3 months</option>
              <option value={2}>Copied or moved files between folders, devices or on the cloud, last 3 months</option>
              <option value={3}>Created files integrating elements such as text, pictures, tables, charts, animations or sound, last 3 months</option>
              <option value={4}>Downloaded or installed software or apps, last 3 months</option>
              <option value={5}>Edited photos, video or audio files, last 3 months</option>
              <option value={6}>Used advanced features of spreadsheet software to organise, analyse, structure or modify data, last 3 months</option>
              <option value={7}>Used spreadsheet software, last 3 months</option>
              <option value={8}>Used word processing software, last 3 months</option>
              <option value={9}>Written code in a programming language, last 3 months</option>
            </Form.Select>            
          </Col>
          <Col>
            <Form.Label>Age Range</Form.Label>
            <Form.Select
              size="lg"
              value={selectedAgeRange}
              onChange={handleAgeRangeChange}
              name="ageRange"
              disabled={selectedEducation} // Disable if education is selected
            >
              <option value="" disabled={selectedGender !== ''}>All</option>
              <option value="Y16_19">16-19</option>
              <option value="Y16_24">16-24</option>    
              <option value="Y16_29">16-29</option>    
              <option value="Y20_24">20-24</option>              
              <option value="Y25_29">25-29</option>              
              <option value="Y25_34">25-34</option>              
              <option value="Y25_54">25-54</option>              
              <option value="Y25_64">25-64</option>
              <option value="Y35_44">35-44</option>
              <option value="Y45_54">45-54</option>
              <option value="Y55_64">55-64</option>
              <option value="Y55_74">55-74</option>
              <option value="Y65_74">65-74</option>
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>Gender</Form.Label>
            <Form.Select
              size="lg"
              value={selectedGender}
              onChange={handleGenderChange}
              name="gender"
              disabled={selectedAgeRange === '' && selectedEducation === ''}
            >
              <option value="">Both</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Label>Education</Form.Label>
            <Form.Select
              size="lg"
              value={selectedEducation}
              onChange={handleEducationChange}
              name="education"
              disabled={selectedAgeRange} // Disable if age range is selected
            >
              <option value="">All</option>
              <option value="I0_2">Low</option>
              <option value="I3_4">Medium</option>
              <option value="I5_8">High</option>
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col>
          <Form.Label>Year</Form.Label>
            <Form.Select
              size="lg"
              value={selectedYear}
              onChange={handleYearChange}
              name="year"
            >
              <option value="2021">2021</option>
              <option value="2023">2023</option>
            </Form.Select>
          </Col>
          <Col></Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default MyForm;