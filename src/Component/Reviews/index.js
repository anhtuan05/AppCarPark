import React, { useState, useEffect, useContext } from 'react';
import { endpoints, authApi } from '../../API';
import API from '../../API';
import cookie from 'react-cookies';
import { Star, Trash2, Pencil, UserRoundPen } from 'lucide-react';
import './style.css';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import CarParkContext from '../../CarParkContext'

const Reviews = () => {
    const [user, dispatch] = useContext(CarParkContext);
    const [parkingLots, setParkingLots] = useState([]);
    const [selectedParkingLot, setSelectedParkingLot] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [reviewId, setReviewId] = useState(null);

    const fetchParkingLots = async () => {
        try {
            let res = await API.get(endpoints['parkinglot']);
            setParkingLots(res.data);
        } catch (error) {
            console.error('Error fetching parking lots:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const token = cookie.load('token');
            let res = await authApi(token.access_token).get(endpoints['reviews']);
            setReviews(res.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const token = cookie.load('token');
            const data = {
                parkinglot: selectedParkingLot,
                rate: rating,
                comment: comment
            };

            if (editMode) {
                await authApi(token.access_token).put(`${endpoints['reviews']}/${reviewId}/`, data);
            } else {
                await authApi(token.access_token).post(endpoints['reviews'], data);
            }

            fetchReviews();
            resetForm();
        } catch (error) {
            alert('Error submitting review:');
        }
    };

    const handleEdit = (review) => {
        setSelectedParkingLot(review.parkinglot);
        setRating(review.rate);
        setComment(review.comment);
        setReviewId(review.id);
        setEditMode(true);
    };

    const handleDelete = async (id) => {
        try {
            const token = cookie.load('token');
            await authApi(token.access_token).delete(`${endpoints['reviews']}/${id}/`);
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const resetForm = () => {
        setSelectedParkingLot('');
        setRating(0);
        setComment('');
        setReviewId(null);
        setEditMode(false);
    };

    useEffect(() => {
        fetchParkingLots();
        fetchReviews();
    }, []);

    return (
        <div>
            {user && user.is_staff === false && user.is_superuser === false ? (
                <div className="reviews-container">
                    <div className='reviews-post'>
                        <h2>{editMode ? 'Edit Review' : 'Add Review'}</h2>
                        <div>
                            <label>Parking Lot</label>
                            <select value={selectedParkingLot} onChange={(e) => setSelectedParkingLot(e.target.value)}>
                                <option value="">Select Parking Lot</option>
                                {parkingLots.map((lot) => (
                                    <option key={lot.id} value={lot.id}>{lot.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Rating</label>
                            <div className="stars-container">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={30}
                                        color={star <= rating ? 'gold' : 'gray'}
                                        onClick={() => setRating(star)}
                                        style={{ cursor: 'pointer', margin: '0 5px' }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label>Comment</label>
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                        </div>
                        <button onClick={handleSubmit}>{editMode ? 'Update' : 'Submit'}</button>
                        <button onClick={resetForm}>Cancel</button>
                    </div>

                    <div className='reviews-list-item'>
                        <h2>Reviews</h2>
                        {reviews
                            .sort((a, b) => b.id - a.id)
                            .map((review) => (
                                <div key={review.id} className="review-item">
                                    <UserRoundPen />
                                    <p><strong>{review.parkinglot.name}</strong>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={20}
                                                color={star <= review.rate ? 'gold' : 'gray'}
                                            />
                                        ))}
                                    </p>
                                    <p>{review.comment}</p>
                                    <p className='item-parkinglotname'>{review.parkinglot_name}</p>
                                    {user && user.id === review.user ? (
                                        <>
                                            <button className="edit-button" onClick={() => handleEdit(review)}>
                                                <Pencil size={15} />
                                            </button>
                                            <button className="delete-button" onClick={() => handleDelete(review.id)}>
                                                <Trash2 size={15} />
                                            </button>
                                        </>
                                    ) : null}

                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                <div className='must-be-logged'>You must be logged. <Link to="/login"> <LogIn /> Login</Link></div>
            )}
        </div>
    );
};

export default Reviews;
