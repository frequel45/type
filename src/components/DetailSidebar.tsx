import React from 'react';

const DetailSidebar = ({ content }) => {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h3 className="font-bold text-lg">{content.strMeal}</h3>
      <img src={content.strMealThumb} alt={content.strMeal} className="w-full h-auto mt-2" />
      <p>{content.strInstructions}</p>
    </div>
  );
};

export default DetailSidebar;
