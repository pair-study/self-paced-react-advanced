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
set({ isLoading: true });

// 함수 전달 — 이전 상태를 참조해야 할 때
set((state) => ({ restaurants: [...state.restaurants, newOne] }));
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

|                | Context API                                           | Zustand                          |
| -------------- | ----------------------------------------------------- | -------------------------------- |
| Provider       | 필요                                                  | 불필요                           |
| 리렌더링       | value 전체가 바뀌면 구독 컴포넌트 전부                | selector로 구독한 값이 바뀔 때만 |
| 상태 위치      | 컴포넌트 트리 안 (`useState`가 실제 상태를 관리)      | 컴포넌트 트리 바깥 (모듈 스코프) |
| 보일러플레이트 | `createContext` + Provider + `useContext` + 커스텀 훅 | `create` 하나                    |

Context API는 "데이터를 트리에 흘려보내는 통로"다. 상태 자체는 Provider 안의 `useState`가 들고 있고, Context는 그 값을 아래로 전달하는 역할만 한다. 전역 상태 관리 라이브러리가 아니라 React 내장 데이터 전달 메커니즘이다.

Zustand는 상태 저장, 업데이트, 구독을 모두 자체적으로 처리하는 독립적인 상태 컨테이너다.

### 3. store 안에서 React 훅을 쓸 수 없는 이유

React 훅(`useState`, `useEffect`, `useCallback`)은 React 함수 컴포넌트 또는 커스텀 훅 안에서만 호출 가능하다. Zustand의 `create` 콜백은 그냥 일반 JS 함수라 훅을 쓰면 에러가 난다.

이 때문에 구조가 나뉜다.

| 역할                 | 위치                          |
| -------------------- | ----------------------------- |
| 상태 + 액션 로직     | store (무엇을, 어떻게)        |
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
  persist(
    // create(상태정의) → create(persist(상태정의, 옵션))
    (set) => ({
      selectedCategory: ALL_CATEGORY,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    { name: "self-paced-react-category" }, // localStorage 키 이름
  ),
);
```

영속화와 캐싱은 다른 개념이다.

|      | 영속화                             | 캐싱                                    |
| ---- | ---------------------------------- | --------------------------------------- |
| 목적 | 사용자 설정/선택값 기억 (UX)       | 서버 요청 비용 절감 (성능)              |
| 예시 | 다크모드, 언어 설정, 카테고리 필터 | API 응답 재사용, 이미지 재다운로드 방지 |

Context API도 localStorage에 직접 저장하는 코드를 짜면 영속화가 가능하다. `persist` 미들웨어는 그 작업을 자동으로 처리해준다.

`persist`의 두 번째 인자 옵션에는 `name`, `storage` 외에 `onRehydrateStorage`도 있다. 앱이 시작될 때 storage에서 값을 복원하는 시점에 실행되는 콜백으로, 복원된 값이 유효한지 검증하는 데 쓴다.

```js
persist(
  (set) => ({ ... }),
  {
    name: "storage-key",
    onRehydrateStorage: () => (state) => {
      // 복원 완료 후 실행. state가 null이면 복원 실패
      if (!state) return;
      if (!isValidCategory(state.selectedCategory)) {
        state.setSelectedCategory(ALL_CATEGORY);
      }
    },
  }
)
```

커링 구조(`() => (state) => {}`)인 이유는 바깥 함수가 복원 **시작 전**, 안쪽 함수가 복원 **완료 후**에 실행되기 때문이다. 복원된 `state`는 안쪽 함수에서만 접근할 수 있다.

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 1. Context → Zustand 마이그레이션 시 코드가 중복되는 건지

마이그레이션하면서 `useRestaurants` 훅의 코드를 store에 다시 써야 하는 건지 헷갈렸다. 결론은 중복 작성이 아니라 이동이다. `useRestaurants`에 있던 것들이 각자의 역할에 맞는 위치로 옮겨간 것이다.

| useRestaurants             | Zustand store                   |
| -------------------------- | ------------------------------- |
| `useState([])`             | 초기값 `newRestaurants: []`     |
| `setNewRestaurants(data)`  | `set({ newRestaurants: data })` |
| `fetchRestaurants` 함수    | 액션으로 이동                   |
| `registerRestaurant` 함수  | 액션으로 이동                   |
| `useEffect(() => fetch())` | App.jsx로 이동                  |

### 2. selectedCategory를 어디서 관리할지

`selectedCategory`는 원래 App.jsx 로컬 state였다. persist가 필요해지면서 store로 옮겨야 했는데, `useRestaurantStore`에 합칠지 `useFilterStore`로 분리할지 고민했다.

서버 데이터(레스토랑 목록)와 UI 필터 상태(선택된 카테고리)는 관심사가 다르고, 합치면 persist 범위도 불필요하게 넓어진다. `useFilterStore`를 별도로 분리해 UI 상태만 영속화했다.

### 3. 전역 상태가 비대해지는 문제 — 도구가 아니라 기준의 문제

읽은 글에서 "팀원마다 전역 상태로 올릴 기준이 달라 결국 전역 상태가 비대해진다"는 얘기가 있었다. 이건 Zustand vs Context의 문제라기보다 팀 컨벤션의 문제다. 어떤 도구를 쓰든 기준이 없으면 전역 상태는 비대해진다.

| 전역 상태로 올릴 것                      | 로컬/props로 둘 것          |
| ---------------------------------------- | --------------------------- |
| 부모-자식 관계 없는 여러 컴포넌트가 공유 | 한 컴포넌트만 씀            |
| 컴포넌트 트리를 벗어나도 유지돼야 함     | 공통 조상이 가까움          |
| 서버 데이터, 인증 정보                   | UI 상태 (모달 열림, 선택값) |

### 4. fetchRestaurants를 App.jsx에서 호출한 이유

초기 데이터 fetch를 `RestaurantList` 안 `useEffect`에서 할 수도 있고, `App.jsx`에서 할 수도 있다. co-location 원칙 기준으로는 데이터가 필요한 컴포넌트가 직접 선언하는 게 더 명시적이다.

App.jsx에서 호출하는 방식을 선택한 이유는 두 가지다.

첫째, co-location의 장점이 가장 잘 드러나는 건 컴포넌트를 다른 곳에서 재사용할 수 있을 때다. `RestaurantList`는 이미 `useRestaurantData()`에 결합된 도메인 컴포넌트라 독립적으로 이동하는 상황이 없다.

둘째, React Query는 중복 요청을 자동으로 처리해주지만, 순수 Zustand에서는 중복 fetch를 직접 관리해야 한다. `RestaurantList`에 fetch를 두면 마운트마다 호출되지 않도록 guard 로직을 별도로 추가해야 하는데, App에서 한 번만 호출하면 그 문제를 구조적으로 피할 수 있다.

React Query를 쓴다면 co-location이 더 자연스러운 선택이다.

## 🛠 리팩토링

### 1. 에러 상태 초기화

`fetchRestaurants` 시작 시 `error: null`을 함께 설정하지 않으면, 이전 실패 에러 메시지가 다음 성공 후에도 화면에 남는다.

```js
fetchRestaurants: async () => {
  set({ isLoading: true, error: null });
  // ...
};
```

### 2. localStorage 키 이름 구체화

`"categoryState"`처럼 일반적인 이름은 다른 앱과 충돌할 수 있다. `"self-paced-react-category"`로 프로젝트를 식별할 수 있게 변경했다.

### 3. sessionStorage로 전환

`useFilterStore`에서 localStorage를 sessionStorage로 변경했다. 카테고리 필터는 브라우저를 닫아도 유지해야 할 설정값이 아니라 현재 탐색 중인 임시 상태이기 때문이다.

`persist`의 기본 storage는 localStorage다. sessionStorage로 바꾸려면 `storage` 옵션에 `createJSONStorage`를 넘긴다. `() => sessionStorage`처럼 함수로 감싸는 이유는 SSR 환경에서 `sessionStorage`가 없을 수 있어서 실제로 사용할 때 꺼내도록 하기 위함이다.

```js
import { persist, createJSONStorage } from "zustand/middleware";

persist(
  (set) => ({ ... }),
  {
    name: "self-paced-react-category",
    storage: createJSONStorage(() => sessionStorage),
  }
)
```

### 4. useRestaurantData 커스텀 훅 추출 → 제거

컴포넌트가 `useRestaurantStore`를 직접 import하던 구조를 `useRestaurantData` 훅으로 감쌌다. store 구조가 바뀌어도 컴포넌트는 수정하지 않아도 되고, store에 접근하는 진입점이 한 곳으로 통일된다.

```js
// 변경 전 — 컴포넌트마다 store를 직접 참조
const newRestaurants = useRestaurantStore((state) => state.newRestaurants);
const isLoading = useRestaurantStore((state) => state.isLoading);

// 변경 후 — 훅을 통해 접근
const { newRestaurants, isLoading } = useRestaurantData();
```

훅 내부에서는 여전히 각 값을 개별 selector로 구독하고 있어서 리렌더링 최적화는 그대로 유지된다. 컴포넌트에서 구조분해로 받는 것처럼 보이지만, store 전체를 구독하는 것과는 다르다.

그런데 각 컴포넌트가 실제로 사용하는 선택자가 달랐다. `RestaurantList`는 `newRestaurants`, `isLoading`, `error`를 쓰고, `AddRestaurantModal`은 `registerRestaurant`만 쓴다. 같은 선택자 묶음을 반복하는 게 아니라 그냥 모아두는 형태였고, 현재 규모에서는 추상화 레이어가 코드 추적 비용을 높인다고 판단해 다시 제거했다.

## 과거 코드와 비교

### 달라진 점

**커스텀 훅 래퍼 유무**

과거 코드는 store selector를 컴포넌트에서 직접 쓰지 않고 `useRestaurantData`, `useRestaurantModal` 커스텀 훅으로 감쌌다. 현재 코드는 컴포넌트에서 store를 직접 참조한다.

컴포넌트가 store 구조를 알 필요 없이 훅만 import하면 되고, store 이름이나 구조가 바뀌어도 컴포넌트는 수정하지 않아도 되기 때문에 과거 방식이 더 나은 접근이라고 판단했다. 현재 방식은 store가 바뀌면 직접 import한 컴포넌트를 전부 찾아서 수정해야 한다.

**Store 분리 기준**

과거 코드는 `useRestaurantStore`(서버 데이터 + 카테고리)와 `useRestaurantModalStore`(모달 UI 상태)로 나눴다. 현재 코드는 `useRestaurantStore`(서버 데이터)와 `useFilterStore`(카테고리), 모달은 App 로컬 state로 분리했다.

모달 열림/닫힘은 App 직계 자식에게만 영향을 주는 일시적인 UI 상태라 전역 store에 올릴 이유가 없고, 서버 데이터와 UI 필터 상태를 나누면 관심사 분리가 명확해지기 때문에 현재 방식이 더 나은 구조라고 판단했다.

**sessionStorage vs localStorage**

현재 코드는 카테고리 필터를 localStorage에 저장한다. 과거 코드는 리뷰 피드백을 받고 sessionStorage로 변경했다.

카테고리 필터는 "브라우저를 닫아도 기억해야 하는 설정"이 아니라 "현재 탐색 중인 필터 상태"에 가깝고, sessionStorage는 탭/브라우저를 닫으면 초기화되어 오래된 상태가 쌓이지 않기 때문에 이 경우에는 과거 방식(sessionStorage)이 더 적합하다고 판단했다.

### 과거 코드에서 배운 점

**localStorage/sessionStorage에 저장된 값은 신뢰하지 않는다**

서버 데이터는 코드 로직으로만 바뀌지만, localStorage와 sessionStorage는 사용자가 브라우저 개발자 도구에서 직접 값을 수정하거나 이상한 값을 넣을 수 있다. `persist` 미들웨어는 저장/복원 과정의 기술적 오류(JSON 파싱 실패 등)는 처리해주지만, 저장된 값이 앱에서 허용하는 값인지까지는 검증하지 않는다.

과거 코드는 `onRehydrateStorage` 옵션을 써서 sessionStorage에서 값을 꺼낸 직후 카테고리가 유효한 값인지 확인하고, 아니면 "전체"로 되돌리는 방어 로직을 추가했다.

이번 미션에서는 구현하지 않았다. 카테고리 값이 오염되더라도 필터가 잘못 적용되는 수준이라 사용자 데이터나 보안에 영향이 없기 때문이다. 결제 정보나 인증 상태처럼 오염 시 심각한 문제가 생기는 값이라면 필수로 추가해야 한다.

**sessionStorage vs localStorage 선택 기준**

세션 단위로만 유지되면 충분한 상태는 sessionStorage가 적합하다. localStorage는 탭 간에 공유되고 브라우저 종료 후에도 유지된다. sessionStorage는 탭별로 독립적이고 세션이 끝나면 초기화된다.
