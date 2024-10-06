import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../../API';
import API from '../../API';
import './style.css';

const Parking = () => {
    const navigate = useNavigate();
    const [parkingLots, setParkingLots] = useState([]);
    const [parkingSpots, setParkingSpots] = useState([]);
    const [selectedLot, setSelectedLot] = useState({
        id: null,
        name: '',
        address: '',
        price_per_hour: ''
    });
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    const handleLotSelect = (lot) => {
        setSelectedLot(lot); // Set the entire parkingLot object
    };

    const handleSpotClick = (spotId) => {
        setSelectedSpot(spotId);
        setShowModal(true); // Show the modal when a spot is clicked
    };

    const handleOptionClick = (option) => {
        if (option === 'booking') {
            navigate(`/booking/${selectedSpot}`);
        } else if (option === 'subscription') {
            navigate(`/subscription/${selectedSpot}`);
        }
        setShowModal(false); // Close the modal after navigation
    };

    useEffect(() => {
        getParkingLot();
        getParkingSpot();
    }, []);

    const getParkingSpot = async () => {
        try {
            let res = await API.get(endpoints['parkingspot']);

            if (Array.isArray(res.data)) {
                setParkingSpots(res.data);
            } else {
                setParkingSpots([]);
                console.error("API response is not an array:", res.data);
            }
        } catch (error) {
            alert("Error fetching ParkingSpot data: " + error);
        }
    };

    const getParkingLot = async () => {
        try {
            let res = await API.get(endpoints['parkinglot']);

            if (Array.isArray(res.data)) {
                setParkingLots(res.data);
            } else {
                setParkingLots([]);
                console.error("API response is not an array:", res.data);
            }
        } catch (error) {
            alert("Error fetching ParkingLot data: " + error);
        }
    };

    const renderParkingSpots = () => {
        if (!selectedLot.id) return <div>Please select a parking lot.</div>;

        return parkingSpots
            .filter((spot) => spot.parkinglot === selectedLot.id)
            .map((spot) => (
                <div
                    key={spot.id}
                    className={`parking-spot ${spot.status} ${spot.status === 'available' ? 'clickable' : 'not-clickable'}`}
                    onClick={() => spot.status === 'available' ? handleSpotClick(spot.id) : null}
                >
                    <Car color="white" strokeWidth={2} size={35} />
                    <span>Spot {spot.id} ({spot.status})</span>
                </div>
            ));
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
    };

    return (
        <div className="parking-container">
            <h2>Select a Parking Lot:</h2>
            <div className="parking-lots">
                {parkingLots.length > 0 ? (
                    parkingLots.map((lot) => (
                        <button
                            key={lot.id}
                            className={`parking-lot-btn ${selectedLot && selectedLot.id === lot.id ? 'active' : ''}`}
                            onClick={() => handleLotSelect(lot)} // Pass the entire lot object
                        >
                            {lot.name}
                        </button>
                    ))
                ) : (
                    <div>No parking lots available.</div>
                )}
            </div>
            <h3>{selectedLot.id !== null ? selectedLot.name + " - " : ''}{selectedLot.id !== null ? `Price per hour: ${formatPrice(selectedLot.price_per_hour)}` : ''}</h3>
            <div className="parking-spots">{renderParkingSpots()}</div>

            {/* Modal for selecting Booking or Subscription */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Choose an option for Spot {selectedSpot}</h3>
                        <button onClick={() => handleOptionClick('booking')}>Booking</button>
                        <button onClick={() => handleOptionClick('subscription')}>Subscription</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Parking;
