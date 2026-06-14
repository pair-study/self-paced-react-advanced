import { ALL_CATEGORY } from "../constants/categories.js";

export function filterRestaurants(restaurants, category) {
  if (category === ALL_CATEGORY) return restaurants;
  return restaurants.filter((restaurant) => restaurant.category === category);
}
