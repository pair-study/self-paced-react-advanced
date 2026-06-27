# 전역상태관리 - Zustand

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

- Zustand의 핵심 개념(`create`, `set`, `get`, selector)을 직접 마이그레이션하며 손에 익힌다.
- Context API와 Zustand가 각각 어떤 문제를 해결하는지, 언제 어떤 도구를 쓸지 판단 기준을 세운다.
- 단순히 문법 변환에 그치지 않고, 두 도구의 구조적 차이가 왜 생기는지 설명할 수 있는 수준으로 이해한다.

## 📝 기능 구현 목록

- `useRestaurantStore` 생성 — `newRestaurants`, `isLoading`, `error`, `fetchRestaurants`, `registerRestaurant`
- Context, Provider, `useRestaurantContext`, `useRestaurants` 제거
- `main.jsx` — Provider 제거
- `RestaurantList`, `AddRestaurantModal` — selector로 필요한 상태만 구독
- `App.jsx` — `useEffect`로 초기 데이터 fetch
- (선택) `useFilterStore` 생성 — `persist` 미들웨어로 카테고리 필터 새로고침 후 유지

## 📚 학습 내용

### 1. Zustand 기본 개념

`create`로 store를 만들고, `set`으로 상태를 업데이트하고, 컴포넌트에서 selector로 필요한 값만 꺼낸다.

```js
const useRestaurantStore = create((set, get) => ({
  // 상태 — 초기값이 있음
  restaurants: [],
  isLoading: false,

  // 액션 — 함수, 초기값 없음
  fetchRestaurants: async () => {
    const data = await getRestaurants();
    set({ restaurants: data });
  },
}));

// 컴포넌트에서 — selector로 필요한 것만 구독
const restaurants = useRestaurantStore((state) => state.restaurants);
```

`set`에는 객체를 직접 넘기거나, 이전 상태를 기반으로 업데이트할 때는 함수를 넘긴다.

```js
// 객체 전달 — 단순 교체
set({ isLoading: true })

// 함수 전달 — 이전 상태를 참조해야 할 때
set((state) => ({ restaurants: [...state.restaurants, newOne] }))
// state가 현재 store 전체 상태. get()으로도 같은 걸 할 수 있지만 이 방식이 더 일반적
```

`get`은 액션 안에서 현재 상태를 읽어야 할 때 쓴다. 컴포넌트가 아닌 곳에서는 훅을 호출할 수 없어서 별도로 제공된다.

```js
registerRestaurant: async (newRestaurant) => {
  await addRestaurant(newRestaurant);
  await get().fetchRestaurants(); // 다른 액션 호출
},
```

### 2. Context API vs Zustand

| | Context API | Zustand |
| --- | --- | --- |
| Provider | 필요 | 불필요 |
| 리렌더링 | value 전체가 바뀌면 구독 컴포넌트 전부 | selector로 구독한 값이 바뀔 때만 |
| 상태 위치 | 컴포넌트 트리 안 (`useState`가 실제 상태를 관리) | 컴포넌트 트리 바깥 (모듈 스코프) |
| 보일러플레이트 | `createContext` + Provider + `useContext` + 커스텀 훅 | `create` 하나 |

Context API는 "데이터를 트리에 흘려보내는 통로"다. 상태 자체는 Provider 안의 `useState`가 들고 있고, Context는 그 값을 아래로 전달하는 역할만 한다. 전역 상태 관리 라이브러리가 아니라 React 내장 데이터 전달 메커니즘이다.

Zustand는 상태 저장, 업데이트, 구독을 모두 자체적으로 처리하는 독립적인 상태 컨테이너다.

### 3. store 안에서 React 훅을 쓸 수 없는 이유

React 훅(`useState`, `useEffect`, `useCallback`)은 React 함수 컴포넌트 또는 커스텀 훅 안에서만 호출 가능하다. Zustand의 `create` 콜백은 그냥 일반 JS 함수라 훅을 쓰면 에러가 난다.

이 때문에 구조가 나뉜다.

| 역할 | 위치 |
| --- | --- |
| 상태 + 액션 로직 | store (무엇을, 어떻게) |
| 언제 실행할지 타이밍 | 컴포넌트의 `useEffect` (언제) |

`fetchRestaurants`를 App.jsx에서 `useEffect`로 트리거하는 것도, `useCallback`이 store 액션에 필요 없는 것도 이 구조 때문이다. 컴포넌트 안의 함수는 렌더링마다 새로 만들어지지만, store 액션은 `create`가 실행될 때 딱 한 번 만들어지고 참조가 바뀌지 않는다.

### 4. create가 한 번만 실행되는 이유

JS 모듈 시스템은 같은 파일을 여러 번 `import`해도 처음 한 번만 실행하고 결과를 캐싱한다. `create()`도 앱이 시작될 때 딱 한 번 실행되고, 내부에 상태와 구독자 목록을 담은 객체가 만들어진다. 이후 컴포넌트가 렌더링될 때마다 store가 새로 만들어지는 게 아니라, 같은 객체를 계속 참조한다.

컴포넌트가 `useRestaurantStore((state) => state.xxx)`를 호출하면 "이 값이 바뀌면 나를 리렌더링해달라"고 store에 등록한다. `set()`이 호출되면 store가 등록된 컴포넌트들에게 알리고, selector로 선택한 값이 바뀐 컴포넌트만 리렌더링된다.

store 자체는 컴포넌트 트리 바깥에 있어서 컴포넌트가 마운트/언마운트돼도 상태가 유지된다.

### 5. persist 미들웨어 — 영속화 vs 캐싱

`persist`는 store 상태를 localStorage에 자동으로 저장하고 복원한다. `create`와 상태 정의 사이에 끼어드는 미들웨어 형태다.

```js
const useFilterStore = create(
  persist(            // create(상태정의) → create(persist(상태정의, 옵션))
    (set) => ({
      selectedCategory: ALL_CATEGORY,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    { name: "self-paced-react-category" }   // localStorage 키 이름
  )
);
```

영속화와 캐싱은 다른 개념이다.

| | 영속화 | 캐싱 |
| --- | --- | --- |
| 목적 | 사용자 설정/선택값 기억 (UX) | 서버 요청 비용 절감 (성능) |
| 예시 | 다크모드, 언어 설정, 카테고리 필터 | API 응답 재사용, 이미지 재다운로드 방지 |

Context API도 localStorage에 직접 저장하는 코드를 짜면 영속화가 가능하다. `persist` 미들웨어는 그 작업을 자동으로 처리해준다.

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 1. Context → Zustand 마이그레이션 시 코드가 중복되는 건지

마이그레이션하면서 `useRestaurants` 훅의 코드를 store에 다시 써야 하는 건지 헷갈렸다. 결론은 중복 작성이 아니라 이동이다. `useRestaurants`에 있던 것들이 각자의 역할에 맞는 위치로 옮겨간 것이다.

| useRestaurants | Zustand store |
| --- | --- |
| `useState([])` | 초기값 `newRestaurants: []` |
| `setNewRestaurants(data)` | `set({ newRestaurants: data })` |
| `fetchRestaurants` 함수 | 액션으로 이동 |
| `registerRestaurant` 함수 | 액션으로 이동 |
| `useEffect(() => fetch())` | App.jsx로 이동 |

### 2. selectedCategory를 어디서 관리할지

`selectedCategory`는 원래 App.jsx 로컬 state였다. persist가 필요해지면서 store로 옮겨야 했는데, `useRestaurantStore`에 합칠지 `useFilterStore`로 분리할지 고민했다.

서버 데이터(레스토랑 목록)와 UI 필터 상태(선택된 카테고리)는 관심사가 다르고, 합치면 persist 범위도 불필요하게 넓어진다. `useFilterStore`를 별도로 분리해 UI 상태만 영속화했다.

### 3. 전역 상태가 비대해지는 문제 — 도구가 아니라 기준의 문제

읽은 글에서 "팀원마다 전역 상태로 올릴 기준이 달라 결국 전역 상태가 비대해진다"는 얘기가 있었다. 이건 Zustand vs Context의 문제라기보다 팀 컨벤션의 문제다. 어떤 도구를 쓰든 기준이 없으면 전역 상태는 비대해진다.

| 전역 상태로 올릴 것 | 로컬/props로 둘 것 |
| --- | --- |
| 부모-자식 관계 없는 여러 컴포넌트가 공유 | 한 컴포넌트만 씀 |
| 컴포넌트 트리를 벗어나도 유지돼야 함 | 공통 조상이 가까움 |
| 서버 데이터, 인증 정보 | UI 상태 (모달 열림, 선택값) |

"Context + useReducer로 대부분 해결 가능"은 기술적으로 사실이고, Zustand 도입의 실질적 이유는 리렌더링 최적화와 DX(개발 편의성)다.

## 🛠 리팩토링

### 1. 에러 상태 초기화

`fetchRestaurants` 시작 시 `error: null`을 함께 설정하지 않으면, 이전 실패 에러 메시지가 다음 성공 후에도 화면에 남는다.

```js
fetchRestaurants: async () => {
  set({ isLoading: true, error: null });
  // ...
}
```

### 2. localStorage 키 이름 구체화

`"categoryState"`처럼 일반적인 이름은 다른 앱과 충돌할 수 있다. `"self-paced-react-category"`로 프로젝트를 식별할 수 있게 변경했다.

## 과거 코드와 비교

### 달라진 점

### 과거 코드에서 배운 점
