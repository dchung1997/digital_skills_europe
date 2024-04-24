import './Carousel.css';
import { Carousel, Row, Col } from 'react-bootstrap'; // Import Carousel and Card components
import WaffleChart from "./WaffleChart";

const MyCarousel = ({ data = [] }) => {
  // Calculate number of carousel items needed (rounded up)
  const numItems = Math.ceil(data.length / 4);

  // Function to create a single carousel item with 4 objects
  const createCarouselItem = (startIndex) => {
    const items = data.slice(startIndex, startIndex + 4); // Slice data for current item
    return (
      <Carousel.Item key={startIndex}>
        <Row>
            {items.map((item, index) => (
                <Col>
                    <WaffleChart key={index} data={item} width={105} height={105}></WaffleChart>
                </Col>
            ))}
            {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, index) => (
                <Col key={`empty-${index}`} xs={3} md={3} lg={3}>
                </Col>
            ))}            
        </Row>
      </Carousel.Item>
    );
  };

  return (
    <Carousel interval={null} variant={'dark'}>
      {/* Create carousel items based on number of items and data slicing */}
      {Array.from({ length: numItems }).map((_, index) => createCarouselItem(index * 4))}
      
    </Carousel>
  );
};

export default MyCarousel;