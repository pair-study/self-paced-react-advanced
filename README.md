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

### 2. useEffect

외부 시스템과 동기화할 때 사용하는 React 훅이다. 렌더링 이후 실행되며, 두 번째 인자인 의존성 배열로 실행 시점을 제어한다.

```jsx
useEffect(() => {
  // side effect
}, [의존성]);
```

| 의존성 배열 | 실행 시점 |
|---|---|
| 없음 | 매 렌더링마다 |
| `[]` | 마운트 시 한 번 |
| `[value]` | 마운트 + value 변경 시 |

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

### 4. useCallback

함수를 메모이제이션하는 React 훅이다. 컴포넌트가 리렌더링될 때마다 함수는 새로 생성되어 참조(주소)가 달라진다.

```jsx
// 리렌더링마다 새로운 함수 생성 → 참조가 달라짐
const fetchRestaurants = async () => { ... };  // 0x001
// 리렌더링 후
const fetchRestaurants = async () => { ... };  // 0x002
```

`useCallback`은 의존성 배열이 바뀌지 않으면 이전에 만든 함수를 그대로 반환해 참조를 안정적으로 유지한다.

```jsx
const fetchRestaurants = useCallback(async () => {
  ...
}, []);  // 의존성 없음 → 항상 같은 참조 반환
```

`useEffect` 의존성 배열에 함수를 넣어야 할 때, 참조가 바뀌면 effect가 반복 실행된다. `useCallback`으로 참조를 안정화하면 의존성 배열에 안전하게 넣을 수 있다.

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

## 🛠 리팩토링

**1. fetchRestaurants에 useCallback 적용 + POST 후 await 추가**

`fetchRestaurants`를 `useCallback`으로 감싸 참조를 안정화하고, 의존성 배열을 `[]`에서 `[fetchRestaurants]`로 수정했다. `handleFormSubmit`에서 `fetchRestaurants()` 호출 시 `await`를 추가해 POST 완료 후 GET이 실행되도록 순서를 보장했다.

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
