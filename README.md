# API 요청과 비동기 처리

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

1. side effect가 무엇인지 이해하고, `useEffect`가 왜 필요한지 설명할 수 있다.
2. Promise가 무엇인지 이해하고, async/await가 Promise를 어떻게 다루는지 설명할 수 있다.
3. `fetch`로 GET/POST 요청을 보내고 응답을 처리하는 방법을 익히고, `await`를 어디에 붙여야 하는지 스스로 판단할 수 있다.

---

## 📝 기능 구현 목록

- [x] API로 음식점 목록을 불러와 RestaurantList에 렌더링
- [x] 음식점 추가 시 POST 요청 후 목록 재조회

---

## 📚 학습 내용

### useEffect와 side effect

React 컴포넌트는 렌더링 중에 외부 시스템(서버, 타이머, DOM 직접 조작 등)에 영향을 주면 안 된다. 이런 작업을 side effect라고 하고, `useEffect`는 렌더링이 끝난 뒤 이를 안전하게 실행하는 공간이다.

```jsx
useEffect(() => {
  // 렌더링 이후 실행 — 서버 요청, 구독, DOM 조작 등
}, []);
```

의존성 배열 `[]`를 넘기면 컴포넌트가 처음 마운트될 때 한 번만 실행된다. 배열을 아예 생략하면 매 렌더링마다 실행되어 무한 루프가 생길 수 있다.

### useEffect 안에서 async/await 쓰는 법

`useEffect`의 콜백은 직접 `async`로 만들 수 없다. `async` 함수는 항상 Promise를 반환하는데, React는 `useEffect` 콜백의 반환값을 cleanup 함수로 기대하기 때문이다.

```jsx
// ❌ 이렇게 하면 안 됨 — async 콜백이 Promise를 반환해서 React가 경고
useEffect(async () => {
  const data = await getRestaurants();
  setRestaurants(data);
}, []);

// ✅ 내부에서 async 함수를 정의하고 호출
useEffect(() => {
  const fetchRestaurants = async () => {
    const data = await getRestaurants();
    setRestaurants(data);
  };
  fetchRestaurants();
}, []);
```

### async/await를 어디에 붙여야 하는가

`await`는 Promise를 반환하는 함수 앞에 붙인다. `await`를 쓰는 함수 자신은 반드시 `async`여야 한다. 이 규칙이 호출 체인을 따라 전파된다.

```
fetch()                    → Promise 반환
getRestaurants()           → 내부에서 await fetch() → async 필요
handleRestaurantSubmit()   → 내부에서 await getRestaurants() → async 필요
```

실수하기 쉬운 패턴: `async` 함수를 호출할 때 `await`를 빠뜨리면 Promise가 풀리기 전에 다음 줄이 실행된다.

```jsx
// ❌ await 누락 — POST가 완료되기 전에 GET 실행, 새 항목이 목록에 없을 수 있음
async function handleRestaurantSubmit(restaurant) {
  addRestaurant(restaurant);  // await 없음
  const data = await getRestaurants();
  setRestaurants(data);
}

// ✅ POST 완료를 기다린 뒤 GET
async function handleRestaurantSubmit(restaurant) {
  await addRestaurant(restaurant);
  const data = await getRestaurants();
  setRestaurants(data);
}
```

### api.js 파일 위치

현재 `src/api.js`에 두었다. 프로젝트 규모에 따라 관례가 다르다.

| 규모 | 구조 | 예시 |
|---|---|---|
| 소규모 | 단일 파일 | `src/api.js` |
| 중규모 | 도메인별 분리 | `src/api/restaurants.js`, `src/api/users.js` |
| 대규모 | services 레이어 | `src/services/restaurantService.js` |

`api/`와 `services/`의 차이는 뉘앙스 차이다. `api/`는 서버와의 통신 함수 모음이라는 의미가 강하고, `services/`는 비즈니스 로직까지 포함할 수 있다는 의미로 쓰이기도 한다. 팀마다 다르므로 프로젝트 컨벤션을 따르면 된다. 현재 프로젝트처럼 API 함수가 몇 개 없을 때는 `src/api.js` 하나로 충분하다.

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### async 함수를 정의만 하고 호출하지 않은 문제

`useEffect` 안에서 async 함수를 정의했지만 호출하지 않아 API 요청이 실행되지 않았다. 같은 실수를 두 번 했다.

```jsx
// ❌ 정의만 하고 호출하지 않음 — 아무 일도 일어나지 않음
useEffect(() => {
  async () => {
    const data = await getRestaurants();
    setRestaurants(data);
  };
}, []);

// ✅ 정의 후 호출
useEffect(() => {
  const fetchRestaurants = async () => {
    const data = await getRestaurants();
    setRestaurants(data);
  };
  fetchRestaurants();  // 호출
}, []);
```

### e.preventDefault()를 제거하면 안 된다는 것을 놓친 문제

API 연동으로 전환하면서 "이제 서버에 제출하니까 `e.preventDefault()`가 필요 없다"고 생각했다. 그러나 `e.preventDefault()`는 서버 제출과 무관하게 **브라우저의 기본 폼 동작(페이지 새로고침)을 막는 역할**이다.

`e.preventDefault()` 없이 폼을 submit하면 React의 `fetch` 호출과 무관하게 브라우저가 페이지를 새로고침한다. `e.preventDefault()`는 항상 필요하다.

---

## 🛠 리팩토링

### state 네이밍 — 용도가 아닌 값의 성격으로

`filterCategory`는 이 state가 필터링에 쓰인다는 **용도**를 표현한다. state 이름은 어디에 쓰이는지가 아니라 **어떤 값을 담고 있는지**를 나타내는 게 좋다.

```jsx
// Before: 용도 표현
const [filterCategory, setFilterCategory] = useState("전체");

// After: 값의 성격 표현
const [selectedCategory, setSelectedCategory] = useState("전체");
```

### API 함수명 — HTTP 메서드가 아닌 의도로

`postRestaurant`는 HTTP 메서드 이름(`post`)을 그대로 쓴 것이다. 함수명은 어떻게 동작하는지가 아니라 무엇을 하려는지를 나타내야 한다.

```js
// Before: 구현 방법 표현
export async function postRestaurant(restaurant) { ... }

// After: 의도 표현
export async function addRestaurant(restaurant) { ... }
```

### BASE_URL 상수 추출

`http://localhost:3000`이 `getRestaurants`와 `addRestaurant` 두 곳에 반복됐다. 상수로 추출해 한 곳에서 관리한다.

```js
const BASE_URL = "http://localhost:3000";
```

### 반환값 변수명 — `jsonData` → `restaurants`

`response.json()`으로 파싱이 완료된 뒤에도 `jsonData`라는 이름을 쓰면 형식(JSON)을 강조하게 된다. 파싱 후에는 실제 내용을 나타내는 이름이 더 명확하다.

```js
// Before
const jsonData = await response.json();

// After
const restaurants = await response.json();
```

### try/catch 추가

`fetch`는 네트워크 오류에서만 throw하고, HTTP 4xx/5xx 응답은 throw하지 않는다. 두 가지를 모두 처리하려면 `response.ok` 확인과 `try/catch`가 함께 필요하다.

```js
export async function getRestaurants() {
  try {
    const response = await fetch(`${BASE_URL}/restaurants`);
    if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
    const restaurants = await response.json();
    return restaurants;
  } catch (error) {
    console.error("음식점 목록 조회 실패:", error);
    throw error;  // 호출한 쪽이 에러를 알 수 있도록 다시 던짐
  }
}
```

catch에서 `throw error`를 다시 던지는 이유: 로그만 남기고 삼켜버리면 호출한 쪽(`App.jsx`)이 에러 발생 여부를 알 수 없다.

### 커스텀 훅 분리 — `useRestaurants`

`App`이 렌더링 구조와 UI 상태를 다루는 컴포넌트인데, 서버 통신과 데이터 관리 로직까지 함께 들어있어 역할이 섞여 있었다. `restaurants` state, `useEffect`, fetch 로직을 커스텀 훅으로 추출했다.

### `fetchRestaurants`를 `useCallback`으로 추출

`fetchRestaurants`가 `useEffect` 내부에 정의되어 있어 `addRestaurant`에서 같은 로직을 중복으로 작성해야 했다. 함수를 훅 스코프로 꺼내 재사용하려면 `useCallback`이 필요하다.

`useCallback` 없이 일반 함수로 선언하면 렌더링마다 새 함수 참조가 생성되어 `useEffect([fetchRestaurants])`가 매 렌더링마다 실행되는 무한 루프가 발생한다. `useCallback`의 빈 의존성 배열 `[]`이 참조를 고정해 이를 방지한다.

```js
// Before: fetchRestaurants가 useEffect 안에 갇혀 있어 addRestaurant에서 로직을 중복 작성
export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getRestaurants();
      setRestaurants(data);
    };
    fetchRestaurants();
  }, []);

  async function addRestaurant(restaurant) {
    await createRestaurant(restaurant);
    const data = await getRestaurants(); // 중복
    setRestaurants(data);               // 중복
  }

  return { restaurants, addRestaurant };
}

// After: useCallback으로 추출해 재사용, 의존성 배열도 명시적으로 선언
export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = useCallback(async () => {
    const data = await getRestaurants();
    setRestaurants(data);
  }, []);

  useEffect(() => {
    void fetchRestaurants();
  }, [fetchRestaurants]);

  async function addRestaurant(restaurant) {
    await createRestaurant(restaurant);
    await fetchRestaurants(); // 재사용
  }

  return { restaurants, addRestaurant };
}
```

App에서는 서버 통신 로직이 모두 사라지고, 모달 열림/닫힘 같은 UI 상태만 남았다.

```jsx
// Before: App이 서버 통신까지 담당
const [restaurants, setRestaurants] = useState([]);
useEffect(() => { /* fetch 로직 */ }, []);
async function handleRestaurantSubmit(...) {
  await postRestaurant(...);
  const data = await getRestaurants();
  setRestaurants(data);
}

// After: 훅이 데이터 관리를 담당
const { restaurants, addRestaurant } = useRestaurants();
async function handleRestaurantSubmit(restaurant) {
  await addRestaurant(restaurant);
  setIsAddRestaurantModalOpen(false);
}
```

### api.js에서 try/catch 제거

`api.js`에서 `try/catch`로 잡고 `throw`로 다시 던지는 건 `try/catch`를 안 쓴 것과 결과가 같다. 콘솔 로그만 남기고 에러를 그대로 위로 올리기 때문이다. 에러를 처리할 수 있는 곳(훅, 컴포넌트)에서만 잡도록 `api.js`는 단순하게 throw만 하게 변경했다.

```js
// Before: try/catch로 잡았다가 다시 throw — 의미 없는 중간 처리
export async function getRestaurants() {
  try {
    const response = await fetch(`${BASE_URL}/restaurants`);
    if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("음식점 목록 조회 실패:", error);
    throw error;
  }
}

// After: 단순하게 throw만
export async function getRestaurants() {
  const response = await fetch(`${BASE_URL}/restaurants`);
  if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
  return response.json();
}
```

### 에러 핸들링 추가

에러는 사용자에게 보여줄 수 있는 가장 가까운 곳에서 한 번만 잡는다. 중간 함수(`addRestaurant`)에서 잡으면 에러가 거기서 소멸되어 최종 호출자가 실패 여부를 알 수 없다.

- 초기 로딩 실패: `fetchRestaurants`의 `try/catch`에서 `error` state에 담아 화면에 표시
- 음식점 추가 실패: `handleRestaurantSubmit`의 `try/catch`에서 alert로 사용자에게 알림

```js
// useRestaurants.js — 초기 로딩 에러 처리
const fetchRestaurants = useCallback(async () => {
  setIsLoading(true);
  try {
    const data = await getRestaurants();
    setRestaurants(data);
  } catch (error) {
    setError("음식점 목록을 불러오지 못했습니다.");
  } finally {
    setIsLoading(false);
  }
}, []);

// App.jsx — 추가 실패 에러 처리
async function handleRestaurantSubmit(restaurant) {
  try {
    await addRestaurant(restaurant);
    setIsAddRestaurantModalOpen(false);
  } catch {
    alert("음식점 추가에 실패했습니다. 다시 시도해주세요.");
  }
}
```

### 매직 스트링 상수화 — `ALL_CATEGORY`

`"전체"` 문자열이 `App.jsx`, `CategoryFilter.jsx`, `filterRestaurants.js` 세 곳에 흩어져 있었다. 하나라도 수정하면 나머지도 함께 바꿔야 하는 암묵적 결합이다. 상수로 추출해 한 곳에서 관리한다.

```js
// Before: 세 곳에 흩어진 매직 스트링
useState("전체");
<option value="전체">전체</option>
if (category === "전체") return restaurants;

// After: 상수로 단일화
export const ALL_CATEGORY = "전체";

useState(ALL_CATEGORY);
<option value={ALL_CATEGORY}>{ALL_CATEGORY}</option>
if (category === ALL_CATEGORY) return restaurants;
```

### import 확장자 일관성

Vite 프로젝트에서 일부 파일은 `.jsx`/`.js` 확장자를 명시하고 일부는 생략해 혼재된 상태였다. Vite는 ESM 표준에 가깝게 확장자 명시를 권장하므로 모든 로컬 import에 확장자를 추가했다.

```js
// Before
import Modal from "../Modal/Modal";
import { CATEGORIES } from "../../constants/categories";

// After
import Modal from "../Modal/Modal.jsx";
import { CATEGORIES } from "../../constants/categories.js";
```

### isLoading state 추가

데이터를 불러오는 동안 화면이 빈 상태로 보이는 문제를 해결하기 위해 `isLoading` state를 추가했다. `finally`를 사용해 성공/실패 여부와 관계없이 로딩 상태가 반드시 해제되도록 했다.

```js
const [isLoading, setIsLoading] = useState(false);

const fetchRestaurants = useCallback(async () => {
  setIsLoading(true);
  try {
    const data = await getRestaurants();
    setRestaurants(data);
  } catch (error) {
    setError("음식점 목록을 불러오지 못했습니다.");
  } finally {
    setIsLoading(false); // 성공/실패 모두 로딩 해제
  }
}, []);

return { restaurants, addRestaurant, isLoading, error };
```

### Modal Escape 키 처리

backdrop 클릭으로만 모달을 닫을 수 있어 키보드 사용자가 닫을 수 없는 접근성 문제가 있었다. `useEffect`로 keydown 이벤트를 등록해 Escape 키로도 닫히도록 했다.

cleanup 함수로 이벤트 리스너를 제거하지 않으면 모달이 닫혀도 리스너가 남아, 모달을 여러 번 열고 닫을수록 리스너가 누적되어 `onClose`가 중복 호출된다.

```js
useEffect(() => {
  function handleKeyDown(e) {
    if (e.key === "Escape") onClose();
  }
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [onClose]);
```

### Header 이미지 alt 중복 제거

버튼에 `aria-label="음식점 추가"`가 있는데 내부 이미지에도 `alt="음식점 추가"`가 있어 스크린 리더가 "음식점 추가 음식점 추가"를 두 번 읽는 문제가 있었다. 버튼 안의 이미지는 버튼 자체가 의미를 전달하므로 장식적 역할이다. `alt` 속성을 제거해 스크린 리더가 이미지를 건너뛰도록 했다.

```jsx
// Before
<img src={addButton} alt="음식점 추가" />

// After
<img src={addButton} />
```
