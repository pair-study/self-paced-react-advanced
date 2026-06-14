const BASE_URL = "http://localhost:3000";

export async function getRestaurants() {
  const response = await fetch(`${BASE_URL}/restaurants`);
  if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
  return response.json();
}

export async function createRestaurant(restaurant) {
  const response = await fetch(`${BASE_URL}/restaurants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(restaurant),
  });
  if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
}
