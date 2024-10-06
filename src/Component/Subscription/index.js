import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { LogIn } from 'lucide-react';
import CarParkContext from '../../CarParkContext'
import { endpoints, authApi } from '../../API';
import API from '../../API';
import cookie from 'react-cookies';
import './style.css';

const Subscription = () => {
    const [user, dispatch] = useContext(CarParkContext);
    const [subscriptionTypes, setSubscriptionTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [subscriptionHistory, setSubscriptionHistory] = useState([]);
    const { spotId } = useParams(); // spotId from the URL
    const token = cookie.load('token');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSubscriptionTypes();
        getSubscriptionHistory();
    }, []);

    const getSubscriptionTypes = async () => {
        try {
            let res = await API.get(endpoints['subscription_type']);
            setSubscriptionTypes(res.data);
            console.log(res.data)
        } catch (error) {
            console.error("Error fetching subscription types: ", error);
        }
    };

    const getSubscriptionHistory = async () => {
        try {
            let res = await authApi(token.access_token).get(endpoints['subscription']);
            setSubscriptionHistory(res.data);
        } catch (error) {
            console.error("Error fetching subscription history: ", error);
        }
    };

    const handleSubscription = async () => {
        if (!selectedType) {
            alert("Please select a subscription type.");
            return;
        }

        try {
            setLoading(true);
            const data = {
                subscription_type: selectedType,
                spot: spotId,
            };
            let res = await authApi(token.access_token).post(endpoints['subscription'], data);
            alert("Subscription successful!");
            getSubscriptionHistory(); // Refresh history
            if (res.data.short_link) {
                window.open(res.data.short_link, '_blank'); // Open the short_link URL in a new tab
            }
        } catch (error) {
            console.error("Error creating subscription: ", error);
            alert("Failed to create subscription.");
        }
        finally {
            setLoading(false);
        }
    };

    const renderHistory = () => {
        if (subscriptionHistory.length === 0) {
            return <div>No subscription history found for this spot.</div>;
        }

        return (
            <table className="subscription-history-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Subscription Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptionHistory.map((sub) => (
                        <tr key={sub.id}>
                            <td>{sub.id}</td>
                            <td>{sub.subscription_type_name}</td>
                            <td>{sub.start_date}</td>
                            <td>{sub.end_date}</td>
                            <td>{sub.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
    };

    return (
        <div>
            {user ? (
                <div className="subscription-container">
                    <h2>Register Subscription</h2>
                    <div className="subscription-options">
                        <label>Select Subscription Type:</label>
                        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                            <option value="">Select type</option>
                            {subscriptionTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.type} - {formatPrice(type.total_amount)}
                                </option>
                            ))}
                        </select>
                    </div>
                    {loading ? (
                        <ClipLoader color="#36d7b7" loading={loading} size={50} />
                    ) : (
                        <button onClick={handleSubscription}>Register Subscription</button>
                    )}
                    <h3>Subscription History</h3>
                    {renderHistory()}
                </div>
            ) : (
                <div className='must-be-logged'>You must be logged. <Link to="/login"> <LogIn /> Login</Link></div>
            )}
        </div>
    );
};

export default Subscription;
