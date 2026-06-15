# Self-Paced React Step 5

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

**1. side effect와 useEffect 이해**

컴포넌트 렌더링 자체가 아닌, 외부 시스템과의 동기화가 side effect임을 이해하고,
왜 useEffect 안에서 처리해야 하는지 설명할 수 있게 된다.

**2. fetch를 통한 API 연동 흐름 이해**

GET 요청으로 목록을 불러와 state에 저장하고,
POST 요청 후 목록을 다시 불러오는 전체 흐름을 직접 구현한다.

**3. useEffect 의존성 배열 이해**

빈 배열(`[]`)과 값이 있는 배열의 차이를 이해하고,
effect가 언제 실행되는지 의도적으로 제어할 수 있게 된다.

## 📝 기능 구현 목록

**1. API로 레스토랑 목록 불러오기**

- 앱 마운트 시 GET 요청으로 레스토랑 목록을 불러온다.

**2. 레스토랑 추가 시 POST 요청**

- 추가하기 버튼 클릭 시 POST 요청을 보내고, 완료 후 목록을 다시 불러온다.

## 📚 학습 내용

### 1. side effect

컴포넌트 함수는 순수해야 한다. 동일한 props/state를 받으면 항상 동일한 UI를 반환해야 하고, 렌더링 중에 외부에 영향을 주어서는 안 된다. API 호출, DOM 직접 조작, 타이머 설정처럼 외부 시스템과 상호작용하는 작업을 side effect라 한다.

컴포넌트 함수는 렌더링할 때마다 실행된다. 거기에 API 호출을 직접 넣으면 렌더링될 때마다 요청이 날아가버린다. 그래서 side effect는 렌더링 함수 본문이 아닌, `useEffect`를 통해 렌더링 이후에 실행되도록 분리해야 한다.

### 2. useEffect와 useCallback

두 훅 모두 의존성 배열을 사용하지만 역할이 다르다.

| 훅 | 역할 | 실행 시점 |
|---|---|---|
| `useEffect` | side effect 실행 | 의존성이 바뀔 때마다 안의 코드 실행 |
| `useCallback` | 함수 참조 유지 | 의존성이 바뀔 때만 함수를 새로 만들고, 그 외엔 이전 참조 반환 |

**useEffect**

외부 시스템과 동기화할 때 사용한다. 렌더링 이후 실행되며, 의존성 배열로 실행 시점을 제어한다.

| 의존성 배열 | 실행 시점 |
|---|---|
| 없음 | 매 렌더링마다 |
| `[]` | 마운트 시 한 번 |
| `[value]` | 마운트 + value 변경 시 |

**왜 같이 쓰는가**

컴포넌트가 리렌더링될 때마다 함수는 새로 만들어져 참조(주소)가 달라진다. `useEffect` 의존성 배열에 함수를 넣으면, 리렌더링마다 참조가 바뀌어 effect가 반복 실행되는 무한루프가 생긴다.

```js
// 리렌더링마다 새 참조 → 무한루프
const fetchRestaurants = async () => { ... };  // 매번 0x001, 0x002...
useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);
```

`useCallback`으로 감싸면 의존성이 바뀌지 않는 한 같은 참조를 반환해 루프가 끊긴다.

```js
const fetchRestaurants = useCallback(async () => {
  const data = await getRestaurants();
  setNewRestaurants(data);
}, []);  // 의존성 없음 → 항상 같은 참조

useEffect(() => {
  void fetchRestaurants();
}, [fetchRestaurants]);  // 참조가 안 바뀌니 최초 1번만 실행
```

**useCallback 의존성 배열**

"이 함수가 읽는 값"을 넣는다. 함수 안에서 바뀔 수 있는 값을 참조하면 그 값이 의존성이 된다.

```js
// [] — 외부 값을 읽지 않으므로 항상 같은 참조
const fetchRestaurants = useCallback(async () => {
  const data = await getRestaurants();
  setNewRestaurants(data);
}, []);

// [category] — category가 바뀌면 함수를 새로 만들어야 함
const fetchByCategory = useCallback(async () => {
  const data = await getRestaurants(category);
  setNewRestaurants(data);
}, [category]);
```

### 3. fetch / async / await

**Promise** — 비동기 작업의 결과를 나타내는 객체다. 지금은 없지만 나중에 값을 주겠다는 약속이며, `await`로 그 값이 준비될 때까지 기다릴 수 있다.

**fetch** — 브라우저 내장 함수로 HTTP 요청을 보낸다. 기본값은 GET이며, 두 번째 인자로 method, headers, body를 지정할 수 있다. Promise를 반환한다.

**async / await** — `await`는 Promise가 이행될 때까지 기다린 뒤 결과값을 반환하며, `async`로 선언된 함수 안에서만 사용할 수 있다. `fetch`와 `response.json()` 모두 Promise를 반환하므로 둘 다 `await`가 필요하다.

```jsx
const fetchRestaurants = async () => {
  const response = await fetch("http://localhost:3000/restaurants");
  const data = await response.json(); // 응답 body를 JSON으로 파싱
  setRestaurants(data);
};
```

### 4. 커스텀 훅

React hooks(`useState`, `useEffect` 등)를 사용하는 일반 함수다. 이름은 `use`로 시작해야 한다. 컴포넌트에서 데이터/로직을 분리할 때 사용한다.

```js
export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  // ...state, effect, 함수 정의

  return { restaurants, registerRestaurant, error, isLoading };
}

// App에서
const { restaurants, registerRestaurant } = useRestaurants();
```

훅은 "어떻게 데이터를 다루는가"를 담당하고, 컴포넌트는 "어떻게 UI를 보여주는가"만 담당하도록 분리된다.

### 5. api.js 분리

HTTP 요청은 React와 무관한 로직이다. `api.js`로 분리하면 컴포넌트/훅은 "어떻게 요청을 보내는지"를 몰라도 된다.

```js
// api.js — HTTP만 담당
export async function getRestaurants() {
  const response = await fetch(`${BASE_URL}/restaurants`);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
}
```

`response.ok`가 `false`(4xx, 5xx)여도 `fetch`는 에러를 던지지 않는다. 수동으로 체크해서 throw해야 한다.

### 6. 에러 처리 레이어

에러 처리는 어디서 할지를 역할에 따라 나눈다.

| 레이어 | 역할 | 처리 방식 |
|---|---|---|
| api.js | HTTP 에러 감지 | `throw` |
| useRestaurants | GET 에러 — 데이터 상태 | `setError(메시지)` |
| App | POST 에러 — UI 반응 | `alert()` |

### 7. finally

`try/catch/finally`에서 `finally`는 성공/실패 상관없이 항상 실행된다. 로딩 상태 해제처럼 결과와 무관하게 반드시 실행해야 하는 코드에 쓴다.

```js
setIsLoading(true);
try {
  const data = await getRestaurants();
  setNewRestaurants(data);
} catch (e) {
  setError("불러오지 못했습니다.");
} finally {
  setIsLoading(false);  // 성공/실패 상관없이 실행
}
```

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 1. `fetch` 응답을 두 변수로 나눠서 받는 이유

`response`와 `data`를 왜 굳이 두 번에 나눠서 받는지 의문이었다. `fetch`가 반환하는 건 데이터가 아니라 HTTP 응답 객체였다. 실제 데이터(JSON)는 body 안에 스트림으로 들어있어서, `.json()`으로 한 번 더 파싱해야 꺼낼 수 있다. 한 줄로 쓸 수 있지만 가독성을 위해 두 변수로 나누는 게 일반적이다.

```jsx
const response = await fetch("...");  // HTTP 응답 객체
const data = await response.json();   // body를 JS 객체로 파싱
```

### 2. `fetchRestaurants`를 `useEffect` 밖으로 꺼낸 이유

처음에는 `useEffect` 안에서 정의하고 바로 호출하는 패턴이 이해가 안 됐다. 정의와 호출을 분리해보니 함수 선언만으로는 실행되지 않는다는 것을 이해했다. 이후 POST 후 목록을 다시 불러와야 해서 `handleFormSubmit`에서도 같은 함수가 필요해졌는데, `useEffect` 안에 선언된 함수는 밖에서 접근할 수 없었다. 그래서 컴포넌트 레벨로 꺼내 두 곳에서 재사용했다.

### 3. `useState`의 초기값으로 `fetchRestaurants`를 넘기면 안 되는 이유

초기값을 빈 배열로 두지 않고 `useState(fetchRestaurants)`처럼 함수 자체를 넘기면 어떻게 될지 궁금했다. `useState`의 초기값은 첫 렌더링 때 딱 한 번만 사용된다. `fetchRestaurants`는 async 함수라 실행하면 데이터가 아닌 Promise를 반환한다. state에 Promise 객체가 들어가 배열이 아니므로 렌더링이 깨진다.

### 4. useEffect 의존성 배열 — 왜 fetchRestaurants를 넣지 않았나

`fetchRestaurants`는 컴포넌트 안에 선언되어 있어 리렌더링마다 새로운 참조가 만들어진다. React는 의존성을 `Object.is`로 비교하는데, 함수/객체는 내용이 같아도 참조가 다르면 변경으로 판단한다. `[fetchRestaurants]`를 넣으면 리렌더링 → 새 참조 → effect 재실행 → 리렌더링 → ... 으로 무한 반복이 생긴다. `fetchRestaurants` 안에서 쓰는 `setNewRestaurants`는 React가 안정성을 보장하므로, `[]`로 두어도 의도한 대로 동작한다.

그렇다면 컴포넌트 밖이나 별도 파일로 꺼내면 되지 않을까 생각했다. 그런데 `fetchRestaurants` 안에서 `setNewRestaurants`를 사용하는데, 이는 `useState`에서 나온 값이라 컴포넌트 안에서만 존재한다. 별도 파일로 분리하려면 setter를 인자로 받는 방식을 써야 한다.

```js
// api.js
export const fetchRestaurants = async (setRestaurants) => {
  const response = await fetch("...");
  const data = await response.json();
  setRestaurants(data);
};
```

하지만 지금 규모에서는 과한 분리다. 같은 로직을 여러 컴포넌트에서 재사용하거나, 컴포넌트에 state + effect + 핸들러가 많아져 읽기 어려워질 때 커스텀 훅(`useFetchRestaurants`)으로 분리하는 것이 React다운 방식이다.

### 5. api.js + 커스텀 훅 분리 과정에서의 실수

**파라미터 누락 + 잘못된 인자**

`handleFormSubmit`을 `async () =>`로 선언해 폼 데이터를 받지 않았다. 그 상태에서 `addRestaurant(fetchRestaurants)`처럼 함수 참조를 인자로 넘겼다. 폼 데이터는 핸들러 파라미터로 받아야 한다.

```js
// 틀린 예
const handleFormSubmit = async () => {
  await addRestaurant(fetchRestaurants);  // 함수를 넘겨버림

// 맞는 예
const handleFormSubmit = async (newRestaurant) => {
  await registerRestaurant(newRestaurant);
```

**훅 return에서 데이터 누락**

`useRestaurants`에서 `fetchRestaurants`만 return하고 `newRestaurants`를 빠뜨렸다. `fetchRestaurants`는 데이터를 불러오는 함수고, 불러온 데이터는 `newRestaurants` state에 저장된다. 컴포넌트가 렌더링에 쓸 데이터 자체를 반환해야 한다.

**훅 함수와 api.js 함수의 이름 충돌**

훅에 `addRestaurant`를 추가하려 했는데 `api.js`에서 같은 이름을 import하고 있어 충돌이 생겼다. 임시로 `addRestaurants`(복수형)을 썼으나 하나를 추가하는 함수에 복수형은 의미가 맞지 않았다. 역할을 드러내는 다른 이름(`registerRestaurant`)으로 정리했다.

### 6. 에러 처리에서의 실수

**useCallback 의존성 배열에 error state를 넣은 것**

`catch` 블록에서 `setError`를 쓰니 `error`가 의존성이라 생각해 `useCallback`의 의존성 배열에 `[error]`를 넣었다. 에러 발생 → `error` state 변경 → `fetchRestaurants` 재생성 → `useEffect` 재실행 → 또 에러 → 무한루프가 된다. `fetchRestaurants`는 `error`를 읽지 않고 `setError`만 호출하므로 의존성 배열은 `[]`가 맞다.

**catch에서 state 변수를 그대로 setError에 넣은 것**

```js
const [error, setError] = useState();

catch {
  setError(error);  // error는 발생한 에러가 아니라 state 변수
}
```

`catch` 블록에서 발생한 에러를 받으려면 `catch (e)`로 변수를 선언해야 한다. 변수명을 state와 같은 `error`로 쓰면 헷갈리므로 `e`처럼 다른 이름을 쓰거나, 에러 객체가 필요 없으면 그냥 `catch`로 쓴다.

## 🛠 리팩토링

**1. fetchRestaurants에 useCallback 적용 + POST 후 await 추가**

`fetchRestaurants`를 `useCallback`으로 감싸 참조를 안정화하고, 의존성 배열을 `[]`에서 `[fetchRestaurants]`로 수정했다. `handleFormSubmit`에서 `fetchRestaurants()` 호출 시 `await`를 추가해 POST 완료 후 GET이 실행되도록 순서를 보장했다.

**2. 매직 스트링 상수화**

`"전체"`라는 문자열이 여러 곳에 흩어져 있었다. 오타가 생겨도 찾기 어렵고, 변경 시 모든 곳을 바꿔야 한다. `ALL_CATEGORY` 상수로 추출해 한 곳에서 관리하도록 했다.

**3. aria-label + alt 중복 제거**

스크린 리더는 `aria-label`과 `alt`를 모두 읽는다. 버튼에 `aria-label="음식점 추가"`가 있을 때 내부 이미지에 같은 내용의 `alt`를 두면 "음식점 추가 음식점 추가"로 두 번 읽힌다. `alt`를 제거해 중복을 없앴다.

**4. void 키워드**

`useEffect`는 cleanup 함수 또는 `undefined`를 반환해야 한다. async 함수는 항상 Promise를 반환하므로 `useEffect` 콜백에서 async 함수를 직접 호출하면 Promise가 반환되어 경고가 발생한다. `void`를 붙이면 반환값을 `undefined`로 만들어 이를 방지한다.

```js
useEffect(() => {
  void fetchRestaurants();  // Promise를 버리고 undefined 반환
}, [fetchRestaurants]);
```

**5. BASE_URL 추출 + api.js 분리**

URL을 컴포넌트 안에 직접 쓰면 여러 곳에 흩어지고 변경 시 모두 찾아야 한다. `BASE_URL` 상수로 추출하고, HTTP 요청 로직 전체를 `api.js`로 분리했다.

**6. useRestaurants 커스텀 훅 분리**

레스토랑 데이터 관련 state + 함수를 `useRestaurants`로 분리했다. App은 어떻게 데이터를 불러오는지 몰라도 되고, 결과만 받아 UI를 그린다.

```js
// 분리 전 — App에 데이터 로직이 섞임
const [newRestaurants, setNewRestaurants] = useState([]);
const fetchRestaurants = useCallback(async () => { ... }, []);
useEffect(() => { void fetchRestaurants(); }, [fetchRestaurants]);

// 분리 후 — 한 줄로
const { newRestaurants, registerRestaurant, error, isLoading } = useRestaurants();
```

**7. 에러 처리 + 로딩 상태 추가**

GET 에러는 훅에서 `error` state로, POST 에러는 App에서 `alert`으로 처리하도록 레이어를 나눴다. `finally`로 성공/실패 상관없이 로딩 상태가 해제되도록 했다.

## 과거 코드와 비교

### 달라진 점

**1. useCallback 사용 여부**

| 구분 | 과거 코드 | 현재 코드 |
|------|---------|---------|
| fetchRestaurants 선언 | `useCallback`으로 감쌈 | 일반 async 함수 |
| 의존성 배열 | `[fetchRestaurants]` | `[]` |

과거 코드는 `fetchRestaurants`를 의존성 배열에 넣기 위해 `useCallback`으로 참조를 안정화했다. 현재 코드는 `useCallback` 없이 `[]`로 뒀다.

**2. id 생성 방식**

과거 코드는 처음에 `` `a${Date.now()}` ``로 클라이언트에서 id를 생성해 POST 요청에 포함했다. 리뷰를 통해 클라이언트 생성 id의 문제(밀리초 충돌, 시스템 시간 불일치)를 인지하고 id를 보내지 않아 서버가 발급하도록 수정했다. 현재 코드도 같은 방식이다.

### 과거 코드에서 배운 점

**1. useCallback — 의존성 배열에 함수를 올바르게 넣는 방법**

과거 코드는 `fetchRestaurants`를 `useCallback`으로 감싸 참조를 안정화하고 `[fetchRestaurants]`를 의존성 배열에 넣었다. 이를 반영해 현재 코드도 수정했다.

```jsx
// 수정 전
const fetchRestaurants = async () => { ... };
useEffect(() => { fetchRestaurants(); }, []);

// 수정 후
const fetchRestaurants = useCallback(async () => { ... }, []);
useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);
```

리뷰어는 대안으로 `useEffect` 안에 함수 선언+실행을 모두 두는 방법도 제시했다. 이 경우 함수가 밖으로 나가지 않아 의존성 배열에 넣을 필요가 없다. 현재 코드에서는 `handleFormSubmit`에서도 `fetchRestaurants`를 재사용해야 해서 이 방법을 선택하지 않았다.

**2. await와 race condition**

POST 요청 후 `await` 없이 GET을 호출하면 POST가 완료되기 전에 GET이 먼저 실행돼 추가한 항목이 목록에 뜨지 않을 수 있다. `await`로 순서를 명시적으로 보장해야 한다.

```jsx
// 수정 전 — race condition 위험
await fetch(URL, { method: "POST", ... });
fetchRestaurants();

// 수정 후 — 순서 보장
await fetch(URL, { method: "POST", ... });
await fetchRestaurants();
```
