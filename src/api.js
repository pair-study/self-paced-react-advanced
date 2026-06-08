export async function getRestaurants() {
  const response = await fetch("http://localhost:3000/restaurants");
  const jsonData = await response.json();
  return jsonData;
}

export async function postRestaurant(restaurant) {
  await fetch("http://localhost:3000/restaurants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restaurant),
  });
}
