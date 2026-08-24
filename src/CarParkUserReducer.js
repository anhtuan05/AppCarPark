import tokenStorage from './shared/api/tokenStorage';

const CarParkUserReducer = (currentState, action) => {
  switch (action.type) {
    case 'login':
      if (action.payload) {
        tokenStorage.setUser(action.payload);
      }
      return action.payload;
    case 'logout':
      tokenStorage.clearAll();
      return null;
    default:
      return currentState;
  }
};

export default CarParkUserReducer;
