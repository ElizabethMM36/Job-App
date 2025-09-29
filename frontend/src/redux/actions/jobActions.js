import axios from 'axios';

export const fetchJobs = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/jobs'); // change URL if needed
    dispatch({ type: 'SET_ALL_JOBS', payload: response.data });
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
  }
};
