import React, { useEffect, useState, useContext } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import cookie from 'react-cookies';
import { endpoints, authApi } from '../../../API';
import CarParkContext from '../../../CarParkContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Report = () => {
    const [user, dispatch] = useContext(CarParkContext);
    const [carParks, setCarParks] = useState([])
    const [revenueData, setRevenueData] = useState('')

    const fetchRatings = async () => {
        try {
            const token = cookie.load('token');
            if (token && token.access_token) {
                let res = await authApi(token.access_token).get(endpoints['ratings']);
                if (res && res.data) {
                    setCarParks(res.data);
                } else {
                    console.error('Error: Response data is empty');
                }
            } else {
                console.error('Error: Token not found');
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    const fetchRevenueData = async () => {
        try {
            const token = cookie.load('token');
            if (token && token.access_token) {
                let res = await authApi(token.access_token).get(endpoints['revenuedata']);
                if (res && res.data) {
                    setRevenueData(res.data);
                    console.log(res.data);
                } else {
                    console.error('Error: Response data is empty');
                }
            } else {
                console.error('Error: Token not found');
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    useEffect(() => {
        fetchRatings();
        fetchRevenueData();
    }, []);

    const colors = [
        {
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
        },
        {
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
        },
    ];

    const barData = {
        labels: ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'],
        datasets: carParks.map((park, index) => ({
            label: park.name,
            backgroundColor: colors[index].backgroundColor,
            borderColor: colors[index].borderColor,
            borderWidth: 1,
            data: [park.rates_1, park.rates_2, park.rates_3, park.rates_4, park.rates_5]
        }))
    };

    const revenueDataFake = {
        "2024-01": 1500000,
        "2024-02": 1200000,
        "2024-03": 1300000,
        "2024-04": 1400000,
        "2024-05": 1500000,
        "2024-06": 1700000,
        "2024-07": 1800000,
        "2024-08": 1500000,
        "2024-09": 1900000,
        "2024-10": 2200000,
    };

    // revenueData -> real
    const lineData = {
        labels: Object.keys(revenueDataFake),
        datasets: [
            {
                label: 'Revenue',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: true,
                data: Object.values(revenueDataFake)
            }
        ]
    };

    const options_1 = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Car Park Ratings',
            },
        },
    };

    const options_2 = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Revenue',
            },
        },
    };

    return (
        <div>
            {user && user.is_staff === true && user.is_superuser === true ? (
                <div>
                    <h2>Ratings by Car Park</h2>
                    <Bar data={barData} options={options_1} />
                    <div>
                        {carParks.map((park) => (
                            <div key={park.id} style={{ marginTop: '40px', marginBottom: '40px' }}>
                                <h4>{park.name}</h4>
                                <p><strong>Average Rating:</strong> {park.average_rate} / 5</p>
                                <p><strong>Total Reviews:</strong> {park.total_reviews}</p>
                            </div>
                        ))}
                    </div>

                    <h2>Monthly Revenue</h2>
                    <Line data={lineData} options={options_2} />
                </div>
            ) : (
                <div className='must-be-logged'>You must be logged. <Link to="/login"> <LogIn /> Login</Link></div>
            )}
        </div>
    );
};

export default Report;
