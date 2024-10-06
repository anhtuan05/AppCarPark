import React, { useState, useEffect, useContext } from 'react';
import API, { authApi } from '../../API'; // Import authApi and API handlers
import { endpoints } from '../../API';
import cookie from 'react-cookies';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import CarParkContext from '../../CarParkContext'
import './style.css';

const ReNewSub = () => {
    const [user, dispatch] = useContext(CarParkContext);
    const [subscriptionTypes, setSubscriptionTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [subHistory, setSubHistory] = useState([]);
    const [selectedSubId, setSelectedSubId] = useState('');
    const token = cookie.load('token');
    const [loading, setLoading] = useState(false);

    // Fetch subscription types from API
    useEffect(() => {
        getSubscriptionHistory();
        getSubscriptionTypes();
    }, []);

    const getSubscriptionTypes = async () => {
        try {
            let res = await API.get(endpoints['subscription_type']);
            setSubscriptionTypes(res.data);
        } catch (error) {
            console.error("Error fetching subscription types: ", error);
        }
    };
    const getSubscriptionHistory = async () => {
        try {
            let res = await authApi(token.access_token).get(endpoints['subscription']);
            setSubHistory(res.data);
        } catch (error) {
            console.error("Error fetching subscription history: ", error);
        }
    };

    // Handle renew action
    const handleRenew = async () => {
        if (!selectedType || !selectedSubId) {
            alert("Please select both a subscription type and subscription ID.");
            return;
        }

        try {
            setLoading(true);
            const data = {
                subscription_type: selectedType,
            };
            let res = await authApi(token.access_token).post(endpoints['renew-subscription'](selectedSubId), data);
            alert("Renewal successful!");
            if (res.data.short_link) {
                window.open(res.data.short_link, '_blank'); // Open the short_link URL in a new tab
            }
        } catch (error) {
            console.error("Error renewing subscription: ", error);
            alert("Failed to renew subscription.");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
    };

    return (
        <div>
            {user ? (
                <div className="renew-container">
                    <h2>Renew Subscription</h2>

                    <div className="renew-options">
                        <label htmlFor="subscription-type">Select Subscription Type:</label>
                        <select
                            id="subscription-type"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">-- Select Subscription Type --</option>
                            {subscriptionTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.type} - {formatPrice(type.total_amount)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="renew-options">
                        <label htmlFor="subscription-id">Select Subscription to Renew:</label>
                        <select
                            id="subscription-id"
                            value={selectedSubId}
                            onChange={(e) => setSelectedSubId(e.target.value)}
                        >
                            <option value="">-- Select Subscription --</option>
                            {subHistory.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    Subscription ID: {sub.id} - Spot: {sub.spot} - End Date: {sub.end_date}
                                </option>
                            ))}
                        </select>
                    </div>
                    {loading ? (
                        <ClipLoader color="#36d7b7" loading={loading} size={50} />
                    ) : (
                        <button onClick={handleRenew}>Registration renewal</button>
                    )}
                </div>
            ) : (
                <div className='must-be-logged'>You must be logged. <Link to="/login"> <LogIn /> Login</Link></div>
            )}
        </div>
    );
};

export default ReNewSub;
