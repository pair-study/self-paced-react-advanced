# Zustand를 사용해서 전역 상태 관리하기

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

1. Context API로 구현된 앱을 Zustand로 마이그레이션하면서 두 방식의 차이를 체감한다.
2. `create`, `set`, `get`, selector 개념을 직접 사용하며 Zustand 스토어 구조를 익힌다.
3. 전역 상태로 관리할 것과 로컬 상태로 유지할 것을 스스로 판단하는 능력을 기른다.

---

## 📝 기능 구현 목록

- [x] `useRestaurantStore` 생성 — `restaurants`, `addRestaurant`, `isLoading`, `error`, `fetchRestaurants` 포함
- [x] `RestaurantList`에서 selector로 스토어 구독, `useEffect`로 초기 데이터 fetch
- [x] `AddRestaurantModal`에서 스토어의 `addRestaurant` 직접 호출
- [x] `App.jsx`에서 `RestaurantsProvider` 제거
- [x] `selectedCategory`를 스토어로 이동 및 `persist` 미들웨어로 새로고침 후에도 유지

---

## 📚 학습 내용

### Zustand 핵심 개념

| 개념 | 설명 |
|---|---|
| `create` | 스토어를 생성한다. 반환값이 훅이라 `useRestaurantStore()`로 바로 사용한다. |
| `set` | 상태를 업데이트한다. 얕은 병합(shallow merge)이라 바꾸지 않는 필드는 그대로 유지된다. |
| `get` | 액션 안에서 현재 스토어 상태를 읽거나 다른 액션을 호출할 때 사용한다. |
| selector | `useStore((state) => state.xxx)` 형태로 필요한 상태만 구독한다. 해당 값이 바뀔 때만 리렌더링된다. |

```js
const useRestaurantStore = create((set, get) => ({
  // 상태
  restaurants: [],
  isLoading: false,
  error: null,

  // 액션
  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getRestaurants();
      set({ restaurants: data });
    } catch {
      set({ error: "음식점 목록을 불러오지 못했습니다." });
    } finally {
      set({ isLoading: false });
    }
  },
  addRestaurant: async (restaurant) => {
    await createRestaurant(restaurant);
    await get().fetchRestaurants(); // 다른 액션 호출
  },
}));
```

### persist 미들웨어

스토어의 상태를 localStorage에 자동으로 저장/복원해주는 Zustand 내장 미들웨어다. `partialize`로 저장할 상태만 선택할 수 있다.

```js
const useRestaurantStore = create(
  persist(
    (set, get) => ({ ... }),
    {
      name: "restaurant-storage",
      partialize: (state) => ({ selectedCategory: state.selectedCategory }),
    }
  )
);
```

`restaurants`는 서버에서 매번 가져오므로 저장할 필요가 없고, `selectedCategory`만 persist 대상으로 지정했다.

---

## 🤔 Zustand를 왜 사용하는가 — Context API와 비교

### Context API는 전역 상태 관리 도구가 아니다

Context API는 원래 **prop drilling 해결 도구**다. 상태 관리를 하려면 `useState`/`useReducer`를 별도로 조합해야 하고, 그 결과물을 Provider로 감싸야 한다. 이번 마이그레이션에서 `useRestaurants` 훅 + `RestaurantsContext` + `useRestaurantsContext` 세 파일이 `useRestaurantStore` 하나로 줄어든 게 그 차이다.

### 달랐던 점

**Provider가 없다**

Context는 `<RestaurantsProvider>`로 트리를 감싸야 했지만, Zustand는 Provider 없이 어떤 컴포넌트에서든 스토어에 바로 접근한다.

**리렌더링 최적화**

Context는 value 안의 어떤 값이 바뀌어도 해당 Context를 구독하는 모든 컴포넌트가 리렌더링된다. Zustand는 selector로 필요한 상태만 구독하기 때문에, `restaurants`가 바뀌어도 `addRestaurant` 액션만 구독하는 컴포넌트는 리렌더링되지 않는다.

```js
// AddRestaurantModal — addRestaurant만 구독하므로
// restaurants, isLoading, error가 바뀌어도 리렌더링되지 않는다
const addRestaurant = useRestaurantStore((state) => state.addRestaurant);
```

### Trade-off

**Context가 나은 경우**

- 외부 라이브러리 없이 React만으로 해결 가능
- 테마, 로케일처럼 변경이 거의 없는 정적 값은 Context가 오히려 적합
- Provider 범위로 상태의 생명주기가 명확하게 제어되어야 할 때

**Zustand의 단점**

- 스토어가 전역이라 어디서든 접근 가능한 게 장점이지만, 반대로 상태가 어디서 변경되는지 추적하기 어려워질 수 있다
- Context는 Provider 범위로 상태의 생명주기가 명확한 반면, Zustand 스토어는 앱 전체에서 살아있다

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 무엇을 스토어에 넣을 것인가

스토어에 모든 상태를 넣는 게 아니라, **전역 상태가 필요한 조건**을 기준으로 판단했다.

| 구분 | 상태 | 이유 |
|---|---|---|
| 스토어 (데이터 도메인) | `restaurants`, `addRestaurant`, `isLoading`, `error` | 여러 컴포넌트에서 공유되는 서버 데이터 |
| 스토어 (persist 목적) | `selectedCategory` | UI 상태이지만 새로고침 후 유지를 위해 스토어로 이동 |
| 로컬 state (UI 상태) | `clickedRestaurant`, `isAddRestaurantModalOpen` | 해당 컴포넌트에서만 쓰이는 인터랙션 상태 |

`selectedCategory`는 본래 UI 상태이므로 `useState`가 자연스럽다. 다만 새로고침 후 유지(`persist`)는 Zustand 스토어에만 적용할 수 있기 때문에 기술적인 이유로 스토어로 이동했다. 이 판단은 목적이 명확하므로 정당하지만, persist 요구사항이 없었다면 로컬 state로 유지하는 것이 맞다.

### fetchRestaurants 호출 위치

Zustand 스토어는 React 컴포넌트가 아니라 `useEffect`를 쓸 수 없다. 초기 데이터 fetch는 데이터를 보여주는 컴포넌트(`RestaurantList`)가 마운트될 때 `useEffect`로 호출하는 방식으로 해결했다.

```js
const fetchRestaurants = useRestaurantStore((state) => state.fetchRestaurants);

useEffect(() => {
  fetchRestaurants();
}, [fetchRestaurants]);
```

### 이벤트 핸들러와 스토어 액션의 분리

스토어 액션은 순수한 값만 받도록 하고, 이벤트 객체 처리는 컴포넌트에 남겼다.

```js
// 스토어 액션 — 값만 받는다
setSelectedCategory: (category) => set({ selectedCategory: category }),

// 컴포넌트 — 이벤트에서 값을 꺼내는 건 UI 로직
function handleCategoryChange(e) {
  setSelectedCategory(e.target.value);
}
```
