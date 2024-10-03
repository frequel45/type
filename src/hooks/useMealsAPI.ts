import axios from 'axios';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

export const useMealsAPI = () => {
  const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories.php`);
    return response.data.categories;
  };

  const getMealsByCategory = async (category: string) => {
    const response = await axios.get(`${API_URL}/filter.php?c=${category}`);
    return response.data.meals;
  };

  const getMealDetails = async (idMeal: string) => {
    const response = await axios.get(`${API_URL}/lookup.php?i=${idMeal}`);
    return response.data.meals[0];
  };

  const getMealsByIngredient = async (ingredient: string) => {
    const response = await axios.get(`${API_URL}/filter.php?i=${ingredient}`);
    return response.data.meals;
  };

  return {
    getCategories,
    getMealsByCategory,
    getMealDetails,
    getMealsByIngredient,
  };
};
