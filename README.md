# Self-Paced React Step 2

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

**1. Props의 개념과 데이터 흐름 이해**

부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방식을 직접 구현하며 단방향 데이터 흐름을 체득한다.

**2. State와 useState 사용법 이해**

`useState`를 활용하여 카테고리 필터 상태를 관리하고, 상태 변화에 따라 UI가 어떻게 반응하는지 이해한다.

**3. 목록 렌더링과 Key의 역할 이해**

배열 데이터를 컴포넌트 목록으로 렌더링하는 방법을 익히고, `key` props가 필요한 이유를 이해한다.

---

## 📝 기능 구현 목록

**1. Props를 활용한 컴포넌트 데이터 연결**

- `restaurants` 배열 분리
- `restaurants` 배열을 `App.jsx`에서 `RestaurantList`의 props로 전달한다.
- `RestaurantList`는 전달받은 배열을 순회하여 각 음식점 정보를 렌더링한다.
- 목록 렌더링 시 각 항목에 `key` props를 부여한다.

**2. 카테고리 필터 상태 관리**

- `useState`로 현재 선택된 카테고리 상태를 관리한다.
- `CategoryFilter`에 현재 카테고리 값과 변경 핸들러를 props로 전달한다.
- 선택된 카테고리에 따라 `restaurants` 배열을 필터링한 `filteredRestaurants`를 `RestaurantList`에 전달한다.

---

## 📚 학습 내용

### 1. Props

Props는 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달하는 방법이다. 함수의 인자처럼 동작하며, 자식 컴포넌트는 전달받은 props를 읽기만 할 수 있고 직접 수정할 수 없다.

```jsx
// 부모 컴포넌트 (App.jsx)
<RestaurantList restaurants={filteredRestaurants} />;

// 자식 컴포넌트 (RestaurantList.jsx)
function RestaurantList({ restaurants }) {
  return (
    <ul>
      {restaurants.map((restaurant) => (
        <li key={restaurant.id}>{restaurant.name}</li>
      ))}
    </ul>
  );
}
```

### 2. State와 useState

State는 컴포넌트가 직접 소유하고 관리하는 데이터다. Props와 달리 컴포넌트 내부에서 변경할 수 있으며, 상태가 변경되면 해당 컴포넌트와 자식 컴포넌트가 리렌더링된다.

`useState`는 상태를 선언하는 React Hook으로, 현재 상태값과 상태를 변경하는 함수를 배열로 반환한다.

```jsx
const [category, setCategory] = useState("전체");
```

- `category`: 현재 상태값
- `setCategory`: 상태를 변경하는 함수. 호출 시 컴포넌트가 리렌더링된다.
- `"전체"`: 초기값

### 3. 목록 렌더링과 Key

배열 데이터를 컴포넌트 목록으로 렌더링할 때는 `map()`을 사용한다. 이때 각 항목에 `key` props를 부여해야 한다.

```jsx
restaurants.map((restaurant) => (

));
```

`key`는 React가 목록에서 어떤 항목이 추가, 변경, 삭제되었는지 식별하기 위해 사용한다. 목록 내에서 고유한 값이어야 하며, 배열 인덱스보다 데이터 고유 id를 사용하는 것이 권장된다.

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 1. 리스트 렌더링과 Props 전달

**고민했던 점**

부모에서 넘겨준 배열 데이터를 자식 컴포넌트에서 받을 때 `restaurants`를 구조 분해 없이 그대로 받아 데이터를 제대로 꺼내지 못했다. 또한 `map()` 안에서 반환할 태그 구조를 잘못 작성하여 `<li>` 안에 `<li>`가 중첩되는 문제가 발생했다.

**해결 과정 및 배운 점**

매개변수 자리에 구조 분해 할당(`{ restaurants }`)을 사용하여 props에서 배열 데이터를 바로 꺼내도록 수정했다. `map()`이 반환하는 요소의 범위를 다시 파악하고 태그 구조를 올바르게 정리했다.

### 2. 조건부 이미지 렌더링

**고민했던 점**

카테고리(`"한식"`, `"중식"` 등)에 따라 서로 다른 이미지를 렌더링해야 했다. 처음에는 `restaurants` 데이터에 이미지 경로를 직접 추가하는 방법을 고민했으나, 데이터와 UI 자원을 분리하는 것이 더 적절하다고 판단했다.

**해결 과정 및 배운 점**

카테고리명을 키, 이미지 경로를 값으로 하는 객체(`categoryImages`)를 컴포넌트 외부에 선언하고, `<img>` 태그의 `src` 속성에 `categoryImages[restaurant.category]` 형태로 접근하여 복잡한 조건문 없이 카테고리에 맞는 이미지를 동적으로 렌더링했다.

### 3. State와 배열 필터링

**고민했던 점**

선택된 카테고리 상태에 따라 원본 배열에서 필요한 데이터만 추려내는 과정에서, 조건 분기를 `filter()` 내부에서 처리하려다 오류가 발생했다.

**해결 과정 및 배운 점**

조건 분기를 `filter()` 바깥으로 꺼내, 삼항 연산자로 `category === "전체"`일 때는 원본 배열을, 아닐 때는 필터링된 배열을 반환하도록 수정했다. `filter()`의 역할과 삼항 연산자의 분기 처리를 명확히 분리하는 것이 가독성과 동작 안정성 모두에 유리하다는 것을 배웠다.

```jsx
const filteredRestaurants =
  category === "전체"
    ? restaurants
    : restaurants.filter((r) => r.category === category);
```

### 4. `<select>` 이벤트 다루기

**고민했던 점**

카테고리 필터를 구현하는 과정에서 `<select>` 엘리먼트의 변화를 감지해 상태를 업데이트해야 했다. `<select>`의 동작 방식을 정확히 이해하지 못한 상태에서 이벤트 객체 전체를 상태 변경 함수에 전달하거나, `<option>` 태그를 제거하는 등 구조가 잘못된 코드를 작성했다.

**해결 과정 및 배운 점**

`<select>`의 `value` 속성에 현재 상태를 연결하고, `onChange` 핸들러에서 `e.target.value`로 선택된 값만 추출하여 상태 변경 함수에 전달하도록 수정했다. React에서 `<select>`를 비롯한 폼 엘리먼트는 `value`와 `onChange`를 함께 사용하는 제어 컴포넌트 방식으로 다루는 것이 기본 패턴임을 이해했다.

```jsx
<select value={category} onChange={(e) => onChangeCategory(e.target.value)}>
  전체
  한식
  ...

```

## 🛠 리팩토링

---

## 과거 코드와 비교

### 달라진 점

### 과거 코드에서 배운 점
