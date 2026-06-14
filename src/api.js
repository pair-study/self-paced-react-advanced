const BASE_URL = "http://localhost:3000";

export async function getRestaurants() {
  const response = await fetch(`${BASE_URL}/restaurants`);
  return response.json();
}

export async function addRestaurant(newRestaurant) {
  await fetch(`${BASE_URL}/restaurants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRestaurant),
  });
}
