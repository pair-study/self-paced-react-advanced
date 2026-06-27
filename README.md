# Context API를 사용해서 전역상태관리하기

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

1. `createContext`, `Provider`, `useContext` 세 가지 개념의 역할을 명확히 이해하고 직접 구현한다.
2. props drilling이 발생하는 지점을 코드에서 직접 파악하고 Context로 해결하는 경험을 쌓는다.
3. UI 상태와 데이터 상태를 구분해서 Context 적용 범위를 스스로 판단하는 능력을 기른다.

---

## 📝 기능 구현 목록

- [x] `RestaurantsContext` 생성 및 `RestaurantsProvider` 구현
- [x] `useRestaurants` 훅의 데이터(`restaurants`, `addRestaurant`, `isLoading`, `error`)를 Context로 관리
- [x] `RestaurantList`에서 `useContext`로 `restaurants`, `isLoading`, `error` 직접 구독
- [x] `AddRestaurantModal`에서 `useContext`로 `addRestaurant` 직접 호출 (`onSubmit` prop 제거)
- [x] `App.jsx`에서 음식점 관련 state/handler 제거, UI 상태(`selectedCategory`, `clickedRestaurant`, `isAddRestaurantModalOpen`)만 유지

---

## 📚 학습 내용

### Context API란?

컴포넌트 트리 전체에 데이터를 전달할 수 있는 React 내장 기능이다. props를 통해 중간 컴포넌트를 거치지 않고, 필요한 컴포넌트가 데이터를 직접 꺼내 쓸 수 있게 한다.

### createContext / Provider / useContext

세 가지 API가 각각 다른 역할을 담당한다.

| 개념 | 역할 | 설명 |
|---|---|---|
| `createContext` | Context 객체 생성 | 데이터를 담을 컨테이너를 정의한다. 초기값을 인자로 받으며, Provider 없이 `useContext`를 호출했을 때 이 초기값이 반환된다. |
| `Provider` | Context 값 공급 | `value` prop으로 전달한 데이터를 하위 컴포넌트 트리 전체에 주입한다. `value`가 변경되면 해당 Context를 구독 중인 모든 컴포넌트가 리렌더링된다. |
| `useContext` | Context 값 구독 | 가장 가까운 상위 Provider의 `value`를 반환한다. Provider가 없으면 `createContext`의 초기값을 반환한다. |

```js
// 1. createContext — 공간 생성
export const RestaurantsContext = createContext(null);

// 2. Provider — 데이터를 채워서 하위 컴포넌트에 공급
export function RestaurantsProvider({ children }) {
  const { restaurants, addRestaurant, isLoading, error } = useRestaurants();
  return (
    <RestaurantsContext.Provider value={{ restaurants, addRestaurant, isLoading, error }}>
      {children}
    </RestaurantsContext.Provider>
  );
}

// 3. useContext — 필요한 컴포넌트에서 직접 꺼냄
const { restaurants } = useContext(RestaurantsContext);
```

### React 18 vs React 19 Provider 문법 차이

React 19부터는 Context 객체 자체를 Provider로 사용할 수 있다. 공식문서가 React 19 기준으로 업데이트되었으므로 버전 확인이 필요하다.

```jsx
// React 18 — .Provider 필요
<RestaurantsContext.Provider value={...}>

// React 19 — Context 자체를 Provider로 사용 가능
<RestaurantsContext value={...}>
```

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 무엇을 Context에 넣을 것인가

Context에 모든 state를 넣는 게 아니라, **데이터 도메인**과 **UI 상태**를 구분하는 것이 핵심이다.

| 구분 | 상태 | 이유 |
|---|---|---|
| Context (데이터 도메인) | `restaurants`, `addRestaurant`, `isLoading`, `error` | 여러 컴포넌트에서 공유되는 서버 데이터 |
| props / 로컬 state (UI 상태) | `selectedCategory`, `clickedRestaurant`, `isAddRestaurantModalOpen` | 특정 화면의 인터랙션 상태로, App이 관리하는 게 자연스러움 |

판단 기준은 "그 데이터가 App 고유의 책임인가?"다. `addRestaurant`는 음식점 데이터 도메인의 책임이므로 Context가 적합하고, `selectedCategory`는 화면 UI의 책임이므로 로컬 state가 적합하다.

### Provider 위치 결정

처음에는 `RestaurantsProvider`를 App의 return 안에 배치했다. 이 경우 App 자신이 `useContext`로 Context 데이터를 꺼낼 수 없다는 문제가 생긴다. `useContext`는 자신보다 **상위에 있는** Provider를 찾기 때문이다.

해결책은 두 가지였다.

1. Provider를 `main.jsx`로 올려서 App도 Context에 접근 가능하게 만들기
2. App이 Context를 쓸 필요가 없도록 구조를 바꾸기

`AddRestaurantModal`이 `addRestaurant`를 Context에서 직접 꺼내도록 하면 App은 `addRestaurant`를 전혀 알 필요가 없어진다. `isLoading`, `error`도 `RestaurantList`가 직접 보여주면 된다. 결과적으로 App이 Context를 쓰지 않아도 되는 구조가 만들어졌고, Provider 위치 문제도 자연스럽게 해결됐다.

### filteredRestaurants를 어디서 처리할 것인가

기존에는 `App`이 `filteredRestaurants`를 계산해서 `RestaurantList`에 내려줬다. Context 도입 후 `restaurants`는 Context에서 오고, `selectedCategory`는 UI 상태로 props로 전달하게 됐다.

```
// 변경 후
RestaurantList에서 Context로 restaurants를 꺼내고,
props로 받은 selectedCategory로 필터링을 직접 처리
```

`selectedCategory`를 props로 유지한 이유: UI 상태이므로 Context보다 props가 더 자연스럽다. 미션 요구사항에도 "props를 쓴다면 그 이유를 PR에 적어주세요"라고 명시되어 있으므로, 이 판단 근거를 기록한다.

---

## 🛠 리팩토링

### App.jsx — 음식점 데이터 책임 제거

Context 도입 전 App은 `useRestaurants`를 직접 호출하고, 모든 handler를 가지고 있었다. 리팩토링 후 App은 UI 상태만 관리한다.

```js
// before — App이 데이터와 UI 상태를 모두 관리
const { restaurants, addRestaurant, isLoading, error } = useRestaurants();
const filteredRestaurants = filterRestaurants(restaurants, selectedCategory);
async function handleRestaurantSubmit(restaurant) { ... }

// after — UI 상태만 남음
const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
const [clickedRestaurant, setClickedRestaurant] = useState(null);
const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);
```

### RestaurantList — Context 구독 및 필터링 내부화

```js
// before
export default function RestaurantList({ restaurants, onRestaurantClick }) { ... }

// after
export default function RestaurantList({ selectedCategory, onRestaurantClick }) {
  const { restaurants, isLoading, error } = useContext(RestaurantsContext);
  const filteredRestaurants = filterRestaurants(restaurants, selectedCategory);
  ...
}
```

### AddRestaurantModal — onSubmit prop 제거

```js
// before — App으로부터 onSubmit을 받아서 호출
export default function AddRestaurantModal({ onSubmit, onClose }) {
  function handleFormSubmit(e) {
    e.preventDefault();
    onSubmit({ category, name, description });
  }
}

// after — Context에서 addRestaurant를 직접 꺼내서 호출
export default function AddRestaurantModal({ onClose }) {
  const { addRestaurant } = useContext(RestaurantsContext);
  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      await addRestaurant({ category, name, description });
      onClose();
    } catch {
      alert("음식점 추가에 실패했습니다. 다시 시도해주세요.");
    }
  }
}
```

### styled-components 선언 위치 — 컴포넌트 하단으로 이동

파일을 열었을 때 가장 먼저 보고 싶은 건 컴포넌트 로직이지, 스타일 세부사항이 아니다. styled-components 선언이 상단에 있으면 컴포넌트 함수가 한참 아래로 밀려 가독성이 떨어진다. 모든 컴포넌트 파일에서 styled-components 선언을 컴포넌트 함수 아래로 이동했다.
