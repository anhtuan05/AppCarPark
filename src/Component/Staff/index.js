import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import WebcamCapture from '../WebcamCapture';
import API, { endpoints, authApi } from '../../API';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CarParkContext from '../../CarParkContext'

function Staff() {
    const [user, dispatch] = useContext(CarParkContext);
    const [faceDescription, setFaceDescription] = useState(null);
    const [selectedCarImage, setSelectedCarImage] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [licensePlate, setLicensePlate] = useState(null);
    const [entryData, setEntryData] = useState(null); // State to store entry data
    const [currentTab, setCurrentTab] = useState(0);
    const [loading, setLoading] = useState();

    // Function to handle face recognition and get access token
    const handleFaceRecognition = async () => {
        if (faceDescription) {
            const formData = new FormData();
            formData.append('face_description', faceDescription);

            try {
                const response = await API.post(endpoints['faceRecognition'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setAccessToken(response.data.access_token);
                console.log('Access token retrieved:', response.data.access_token);
                alert('Successful identification')
            } catch (error) {
                alert('Error during face recognition', error);
            }
        } else {
            alert('Please capture face data.');
        }
    };


    // Function to handle car plate recognition after face recognition
    const handleCarPlateRecognition = async () => {
        if (selectedCarImage) {
            const formData = new FormData();
            formData.append('upload', selectedCarImage);  // Add selected car image to FormData
            formData.append('regions', 'vn');  // Specify region (Vietnam) for license plate recognition

            try {
                const response = await API.post('https://api.platerecognizer.com/v1/plate-reader/', formData, {
                    headers: {
                        'Authorization': 'Token 3fc443b0688e2b27960d9af3c82a14e27c52302b',  // Add authorization token
                        'Content-Type': 'multipart/form-data'  // Ensure correct content type for form data
                    }
                });

                if (response.data.results && response.data.results.length > 0) {
                    setLicensePlate(response.data.results[0].plate);
                    console.log('License plate detected:', response.data.results[0].plate);
                } else {
                    console.log('No license plate detected.');
                }
            } catch (error) {
                console.error('Error during license plate recognition', error);
            }
        } else {
            alert('Please select a car image first.');
        }
    };


    // Function to handle car entry
    const handleCarEntry = async () => {
        if (accessToken && licensePlate) {
            const formData = new FormData();
            formData.append('entry_image', selectedCarImage);
            formData.append('license_plate', licensePlate);

            try {
                setLoading(true);
                const response = await authApi(accessToken).post(endpoints['entry_exit'], formData);
                setEntryData(response.data);
                console.log('Car entry successful', response.data);
            } catch (error) {
                alert('Error car entry');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please obtain both access token and license plate.');
        }
    };

    // Function to handle car exit
    const handleCarExit = async () => {
        if (accessToken && licensePlate) {
            const formData = new FormData();
            formData.append('exit_image', selectedCarImage);
            formData.append('license_plate', licensePlate);

            try {
                setLoading(true);
                const response = await authApi(accessToken).patch(endpoints['entry_exit'], formData);
                setEntryData(response.data);
                alert('Car exit successful');
            } catch (error) {
                alert('Error car exit');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please obtain both access token and license plate.');
        }
    };

    const handleCarImageChange = (event) => {
        setSelectedCarImage(event.target.files[0]);
    };

    const handleFaceDescriptionAlert = (description) => {
        if (description) {
            alert("The face has been described");
        } else {
            alert("No facial description yet");
        }
    };

    const resetStates = () => {
        setFaceDescription(null);
        setSelectedCarImage(null);
        setAccessToken(null);
        setLicensePlate(null);
        setEntryData(null);
    };

    useEffect(() => {
        resetStates();
    }, [currentTab]);

    return (
        <div>
            {user && user.is_staff === true && user.is_superuser === false ? (
                <div className="staff-container">
                    <Tabs selectedIndex={currentTab} onSelect={(index) => setCurrentTab(index)}>
                        <TabList>
                            <Tab>Car into the parking lot</Tab>
                            <Tab>Car out of parking lot</Tab>
                        </TabList>

                        <TabPanel>

                            <div className="webcam-container">
                                <WebcamCapture setFaceDescription={(description) => {
                                    setFaceDescription(description);
                                    handleFaceDescriptionAlert(description);
                                }} />
                                <button onClick={handleFaceRecognition}>Facial recognition</button>
                            </div>
                            <div className="car-image-container">
                                <input type="file" accept="image/*" onChange={handleCarImageChange} />
                                {selectedCarImage && (
                                    <div className="selected-image">
                                        <h4>Car Image:</h4>
                                        <img src={URL.createObjectURL(selectedCarImage)} alt="Selected Car" style={{ width: '300px', height: 'auto' }} />
                                    </div>
                                )}
                                {licensePlate && (
                                    <div className="selected-image">
                                        <h4>License plate: {licensePlate}</h4>
                                    </div>
                                )}
                                <button onClick={handleCarPlateRecognition}>License plate</button>
                            </div>

                            {loading ? (
                                <ClipLoader color={"#09f"} loading={loading} size={50} />
                            ) : (
                                <button onClick={handleCarEntry}>Entry</button>
                            )}

                            {entryData && (
                                <div className="entry-info">
                                    <h4>Successful entry information:</h4>
                                    <p><strong>Spot:</strong> {entryData.spot}</p>
                                    <p>{entryData.subscription ? 'Subscription_ID' : 'Booking_ID'}: {entryData.subscription || entryData.booking}</p>
                                    <p><strong>Entry Time:</strong> {entryData.entry_time}</p>
                                </div>
                            )}
                        </TabPanel>

                        <TabPanel>

                            <div className="webcam-container">
                                <WebcamCapture setFaceDescription={(description) => {
                                    setFaceDescription(description);
                                    handleFaceDescriptionAlert(description);
                                }} />
                                <button onClick={handleFaceRecognition}>Facial recognition</button>
                            </div>
                            <div className="car-image-container">
                                <input type="file" accept="image/*" onChange={handleCarImageChange} />
                                {selectedCarImage && (
                                    <div className="selected-image">
                                        <h4>Car Image:</h4>
                                        <img src={URL.createObjectURL(selectedCarImage)} alt="Selected Car" style={{ width: '300px', height: 'auto' }} />
                                    </div>
                                )}
                                {licensePlate && (
                                    <div className="selected-image">
                                        <h4>License plate: {licensePlate}</h4>
                                    </div>
                                )}
                                <button onClick={handleCarPlateRecognition}>License plate</button>
                            </div>
                            {loading ? (
                                <ClipLoader color={"#09f"} loading={loading} size={50} />
                            ) : (
                                <button onClick={handleCarExit}>Exit</button>
                            )}
                        </TabPanel>
                    </Tabs>
                </div>
            ) : (
                <div className='must-be-logged'>You must be logged. <Link to="/login"> <LogIn /> Login</Link></div>
            )}
        </div>
    );
}

export default Staff;
