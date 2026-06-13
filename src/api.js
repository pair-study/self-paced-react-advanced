const BASE_URL = "http://localhost:3000";

export async function getRestaurants() {
  try {
    const response = await fetch(`${BASE_URL}/restaurants`);
    if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
    const restaurants = await response.json();
    return restaurants;
  } catch (error) {
    console.error("음식점 목록 조회 실패:", error);
    throw error;
  }
}

export async function createRestaurant(restaurant) {
  try {
    const response = await fetch(`${BASE_URL}/restaurants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restaurant),
    });
    if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
  } catch (error) {
    console.error("음식점 추가 실패:", error);
    throw error;
  }
}
