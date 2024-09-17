import React, { useState } from 'react';

function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);

  const addVehicle = (vehicle) => {
    setVehicles([...vehicles, vehicle]);
  };
  return (
    <div>
      <h2>Vehicle Management</h2>
      <button onClick={() => addVehicle({ name: 'CAR 1', licensePlate: '123-ABC' })}>
        Add
      </button>
      <ul>
        {vehicles.map((vehicle, index) => (
          <li key={index}>
            {vehicle.name} - {vehicle.licensePlate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VehicleManagement;