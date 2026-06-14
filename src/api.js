const BASE_URL = "http://localhost:3000";

export async function getRestaurants() {
  const response = await fetch(`${BASE_URL}/restaurants`);
  if (!response.ok) throw new Error("오류입니다.");
  return response.json();
}

export async function addRestaurant(newRestaurant) {
  const response = await fetch(`${BASE_URL}/restaurants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRestaurant),
  });
  if (!response.ok) throw new Error("오류입니다.");
}
