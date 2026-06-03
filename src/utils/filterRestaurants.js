export function filterRestaurants(restaurants, category) {
  if (category === "전체") return restaurants;
  else {
    return restaurants.filter((restaurant) => restaurant.category === category);
  }
}
