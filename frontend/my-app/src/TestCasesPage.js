import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardTitle, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Carousel, ProgressBar } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa'; // Import tick mark icon
import './TestCasesPage.css'; // Ensure you have the updated CSS

const TestCasesPage = () => {
    const location = useLocation();
    const results = JSON.parse(location.state?.results); // Using optional chaining to handle undefined cases

    const [activeTab, setActiveTab] = useState(0); // State to manage active tab
    const [activeIndices, setActiveIndices] = useState({}); // State to manage active carousel index for each tab

    if (!results || Object.keys(results).length === 0) {
        return <div>No results found</div>;
    }

    const imageTitles = Object.keys(results);

    // Handle carousel index change
    const handleSelect = (index) => {
        setActiveIndices((prev) => ({ ...prev, [activeTab]: index }));
    };

    return (
        <div className="container mt-4">
            <h1>Testing Instructions</h1> {/* Page Title */}
            <Nav tabs>
                {imageTitles.map((imageTitle, index) => (
                    <NavItem key={index}>
                        <NavLink
                            className={activeTab === index ? 'active' : ''}
                            onClick={() => setActiveTab(index)}
                        >
                            {imageTitle}
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
            <TabContent activeTab={activeTab}>
                {imageTitles.map((imageTitle, index) => (
                    <TabPane key={index} tabId={index}>
                        <div className="carousel-container">
                            <Carousel
                                activeIndex={activeIndices[index] || 0}
                                onSelect={handleSelect}
                                interval={null} // Disable automatic sliding
                                indicators={false} // Disable default indicators
                            >
                                {results[imageTitle].map((testCase, testCaseIndex) => (
                                    <Carousel.Item key={testCaseIndex}>
                                        <Card className="mb-3">
                                            <CardTitle tag="h5">{testCase.description}</CardTitle>
                                            <CardBody>
                                                <div className="test-case-content">
                                                    <ul>
                                                        {Object.entries(testCase).map(([key, value], stepIndex) => (
                                                          key !== 'description' && (
                                                              <li key={stepIndex}>
                                                                  <strong>{key}: </strong>
                                                                  {Array.isArray(value) ? (
                                                                      <ul>
                                                                          {value.map((item, index) => (
                                                                              <li key={index}>{item}</li>
                                                                          ))}
                                                                      </ul>
                                                                  ) : (
                                                                      value.toString()
                                                                  )}
                                                              </li>
                                                          )
                                                      ))}
                                                    
                                                    </ul>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Carousel.Item>
                                ))}
                                {/* Add "All Set" slide */}
                                <Carousel.Item>
                                    <div className="all-set-slide">
                                        <FaCheckCircle size={50} color="green" />
                                        <h3>All Set!</h3>
                                    </div>
                                </Carousel.Item>
                            </Carousel>
                            <div className="carousel-controls">
                                <button
                                    className="carousel-control-prev"
                                    onClick={() => handleSelect(Math.max((activeIndices[index] || 0) - 1, 0))}
                                >
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    onClick={() => handleSelect(Math.min((activeIndices[index] || 0) + 1, results[imageTitle].length))}
                                >
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                </button>
                            </div>
                            <ProgressBar
                                now={Math.min(((activeIndices[index] || 0) + 1) / (results[imageTitle].length + 1) * 100, 100)}
                                label={`${Math.round(Math.min(((activeIndices[index] || 0) + 1) / (results[imageTitle].length + 1) * 100, 100))}%`}
                                className="mt-3"
                            />
                        </div>
                    </TabPane>
                ))}
            </TabContent>
        </div>
    );
};

export default TestCasesPage;
