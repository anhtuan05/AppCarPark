/**
 * Mock data preserving exact backend DTO schemas for offline/test mode.
 */

export const mockParkingLots = [
  {
    id: 1,
    name: 'Green Central Car Park',
    address: '123 Nguyen Hue Blvd, District 1, Ho Chi Minh City',
    price_per_hour: 25000,
  },
  {
    id: 2,
    name: 'Eco Riverside Park',
    address: '456 Ton Duc Thang, District 1, Ho Chi Minh City',
    price_per_hour: 20000,
  },
  {
    id: 3,
    name: 'Smart Tech Park',
    address: '789 Vo Van Kiet, District 5, Ho Chi Minh City',
    price_per_hour: 18000,
  },
];

export const mockParkingSpots = [
  { id: 101, parkinglot: 1, status: 'available' },
  { id: 102, parkinglot: 1, status: 'occupied' },
  { id: 103, parkinglot: 1, status: 'available' },
  { id: 104, parkinglot: 1, status: 'occupied' },
  { id: 105, parkinglot: 1, status: 'available' },
  { id: 201, parkinglot: 2, status: 'available' },
  { id: 202, parkinglot: 2, status: 'available' },
  { id: 203, parkinglot: 2, status: 'occupied' },
  { id: 301, parkinglot: 3, status: 'available' },
  { id: 302, parkinglot: 3, status: 'occupied' },
];

export const mockSubscriptionTypes = [
  { id: 1, type: 'Monthly Standard', total_amount: 1200000, duration_days: 30 },
  { id: 2, type: 'Quarterly Premium', total_amount: 3200000, duration_days: 90 },
  { id: 3, type: 'Annual VIP', total_amount: 11000000, duration_days: 365 },
];

export const mockVehicles = [
  {
    id: 1,
    license_plate: '51F-123.45',
    brand: 'Toyota',
    car_model: 'Camry 2.5Q',
    color: 'White Pearl',
  },
  {
    id: 2,
    license_plate: '51K-999.88',
    brand: 'Mercedes-Benz',
    car_model: 'C300 AMG',
    color: 'Obsidian Black',
  },
];

export const mockBookings = [
  {
    id: 1,
    spot: 101,
    vehicle_license_plate: '51F-123.45',
    start_time: '2026-08-20T08:00:00Z',
    end_time: '2026-08-20T17:00:00Z',
    total_hours: 9,
    status: 'Confirmed',
  },
];

export const mockSubscriptions = [
  {
    id: 1,
    subscription_type_name: 'Monthly Standard',
    spot: 101,
    start_date: '2026-08-01',
    end_date: '2026-08-31',
    status: 'Active',
  },
];

export const mockReviews = [
  {
    id: 1,
    parkinglot: { id: 1, name: 'Green Central Car Park' },
    parkinglot_name: 'Green Central Car Park',
    rate: 5,
    comment: 'Super clean, automatic facial recognition entry works seamlessly!',
    user: 1,
  },
  {
    id: 2,
    parkinglot: { id: 2, name: 'Eco Riverside Park' },
    parkinglot_name: 'Eco Riverside Park',
    rate: 4,
    comment: 'Spacious spots and friendly staff. Highly recommended.',
    user: 2,
  },
];

export const mockRevenueData = {
  '2026-01': 15000000,
  '2026-02': 18500000,
  '2026-03': 21000000,
  '2026-04': 24000000,
  '2026-05': 22500000,
  '2026-06': 27000000,
  '2026-07': 31000000,
  '2026-08': 34500000,
};

export const mockRatingsData = [
  {
    id: 1,
    name: 'Green Central Car Park',
    rates_1: 2,
    rates_2: 3,
    rates_3: 8,
    rates_4: 25,
    rates_5: 60,
    average_rate: 4.6,
    total_reviews: 98,
  },
  {
    id: 2,
    name: 'Eco Riverside Park',
    rates_1: 1,
    rates_2: 2,
    rates_3: 12,
    rates_4: 30,
    rates_5: 45,
    average_rate: 4.4,
    total_reviews: 90,
  },
];
