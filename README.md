# Self-Paced React Step 3

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

**1. 이벤트 핸들러를 통한 데이터 전달 이해**

자식 컴포넌트에서 발생한 이벤트가 부모로 어떻게 전달되는지 이해하고,
클릭 이벤트와 함께 데이터를 넘기는 패턴을 직접 구현한다.

**2. 조건부 렌더링 이해**

`&&` 연산자를 활용하여 특정 조건일 때만 컴포넌트를 렌더링하는 방식을 익힌다.

**3. 파생 상태(Derived State) 이해**

모달 열림 여부처럼 기존 상태에서 계산 가능한 값은 별도 state로 선언하지 않고
기존 state를 활용하는 방식을 이해한다.

---

## 📝 기능 구현 목록

**1. 음식점 아이템 클릭 시 상세 모달 열기**

- `clickedRestaurant` state를 App.jsx에 추가한다. (초기값: null)
- `handleRestaurantClick(restaurant)` 핸들러를 정의하여 `RestaurantList`에 전달한다.
- `RestaurantList`는 아이템 클릭 시 해당 restaurant 객체를 핸들러에 넘긴다.
- `clickedRestaurant`가 null이 아닐 때만 `RestaurantDetailModal`을 렌더링한다.

**2. 모달 닫기**

- `handleModalClose` 핸들러를 정의하여 `setClickedRestaurant(null)`로 모달을 닫는다.
- 닫기 버튼과 backdrop 클릭 시 `onClose` props를 통해 핸들러를 호출한다.

**3. 클릭한 음식점 정보 모달에 표시**

- `clickedRestaurant` 객체를 `RestaurantDetailModal`에 props로 전달한다.
- 모달에서 `clickedRestaurant.name`, `clickedRestaurant.description`을 렌더링한다.

---

## 📚 학습 내용

### 1. 조건부 렌더링

특정 조건일 때만 컴포넌트를 렌더링할 때 `&&` 연산자를 사용한다.

```jsx
{clickedRestaurant && <RestaurantDetailModal restaurant={clickedRestaurant} />}
```

좌측 값이 falsy(null, undefined, false)이면 렌더링하지 않고, truthy이면 우측 컴포넌트를 렌더링한다.

### 2. State 불변성과 리렌더링

React에서 state는 직접 수정하면 리렌더링이 트리거되지 않는다. 반드시 setter 함수를 통해야 React가 변화를 감지하고 화면을 다시 그린다.

```jsx
// ❌ 직접 수정 — 리렌더링 안 됨
clickedRestaurant = restaurant;

// ✅ setter 사용 — 리렌더링 트리거
setClickedRestaurant(restaurant);
```

### 3. 파생 상태 (Derived State)

모달 열림 여부를 관리하기 위해 별도 boolean state(`isModalOpen`)를 선언하지 않아도 된다. `clickedRestaurant`가 null이면 닫힘, 객체면 열림 — 기존 state에서 의미를 도출할 수 있기 때문이다.

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 1. 이벤트 핸들러 인자 전달

**고민했던 점**

`handleRestaurantClick` 핸들러에서 인자를 선언하지 않아 `setClickedRestaurant`에 항상 null이 저장되는 문제가 발생했다.

**해결 과정 및 배운 점**

RestaurantList에서 `onClick={() => onRestaurantClick(restaurant)}`로 restaurant 객체를 인자로 넘기고, App의 핸들러에서 `(restaurant) => setClickedRestaurant(restaurant)` 형태로 받아야 한다는 것을 이해했다. 이벤트가 발생하는 곳에서 인자를 넘기고, 핸들러에서 매개변수로 받는 흐름을 체득했다.

```jsx
// RestaurantList — 클릭 시 restaurant 객체를 넘김
onClick={() => onRestaurantClick(restaurant)}

// App.jsx — 넘겨받은 객체를 state에 저장
const handleRestaurantClick = (restaurant) => {
  setClickedRestaurant(restaurant);
};
```

## 🛠 리팩토링

## 과거 코드와 비교

### 달라진 점

### 과거 코드에서 배운 점
