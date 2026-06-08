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

### 4. 웹 접근성 (a11y) — 클릭 가능한 비버튼 요소

`<li>` 같은 비인터랙티브 요소에 `onClick`을 달면 마우스 사용자는 동작하지만, 키보드 사용자는 접근할 수 없다. 다음 세 가지를 함께 추가해야 한다.

- `role="button"`: 스크린 리더에게 이 요소가 버튼처럼 동작함을 알린다.
- `tabIndex={0}`: Tab 키로 포커스를 받을 수 있게 한다.
- `onKeyDown`: Enter 또는 Space 키 입력 시 onClick과 동일한 동작을 수행한다.

```jsx
<li
  role="button"
  tabIndex={0}
  onClick={() => onRestaurantClick(restaurant)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      onRestaurantClick(restaurant);
    }
  }}
>
```

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

**1. 클릭 가능한 `<li>`에 웹 접근성 속성 추가**

`<li>`에 `onClick`만 달면 키보드 사용자는 접근할 수 없다. 과거 코드 리뷰에서 받은 피드백을 반영하여 `role="button"`, `tabIndex={0}`, `onKeyDown`을 추가했다.

---

## 과거 코드와 비교

### 달라진 점

**1. State 통합 — boolean 분리 → 단일 객체 state**

| 구분 | 과거 코드 | 현재 코드 |
|------|---------|---------|
| 모달 상태 관리 | `selected` + `isModalOpen` 2개 | `clickedRestaurant` 1개 |

과거엔 `selected`(선택된 음식점)와 `isModalOpen`(열림 여부)를 따로 관리했다. 두 상태는 항상 함께 변하기 때문에 불필요한 중복이 생긴다. 현재는 `clickedRestaurant`가 null이면 닫힘, 객체면 열림으로 하나의 state에서 두 의미를 모두 표현했다.

### 과거 코드에서 배운 점

**1. 파생 상태는 state로 선언하지 않는다**

리뷰어 피드백: *"두 상태가 서로 의존적인 관계인데 분리해서 관리할 경우 일관성이 깨질 수 있습니다. 불필요한 상태는 제거해 하나의 상태로 관리해보는 건 어떨까요?"*

다른 state에서 계산 가능한 값을 별도 state로 선언하면 두 상태가 불일치할 위험이 생긴다. 기존 state만으로 표현 가능하다면 파생 상태로 처리하는 것이 더 안전하다.

**2. 웹 접근성 — 클릭 가능한 `<li>`**

리뷰어 피드백: *"`<li>`에 onClick 이벤트를 사용할 경우 role, tabIndex, onKeyDown을 추가해 키보드 사용자도 접근할 수 있도록 해야 합니다."*

```jsx
<li
  role="button"
  tabIndex={0}
  onClick={() => onRestaurantClick(restaurant)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      onRestaurantClick(restaurant);
    }
  }}
>
```

마우스 없이 Tab + Enter로도 동작하도록 보장하는 것이 웹 접근성의 기본이다.
