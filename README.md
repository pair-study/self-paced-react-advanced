# Self-Paced React Step 4

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

**1. Controlled vs Uncontrolled Input 이해**

폼 입력 상태를 React state로 직접 관리하는 방식(controlled)과
DOM에서 직접 읽는 방식(uncontrolled)의 차이를 이해하고,
각각 어느 상황에 적합한지 판단할 수 있게 된다.

**2. children prop 패턴 이해**

`children`을 활용하여 재사용 가능한 Modal 컴포넌트를 설계하고,
두 종류의 모달(`AddRestaurantModal`, `RestaurantDetailModal`)에 공통 구조를 적용한다.

**3. 폼 데이터 처리 및 state 업데이트 흐름 이해**

폼 제출 시 입력값을 수집하여 상위 컴포넌트의 state를 업데이트하고,
목록에 새 항목이 추가되는 전체 흐름을 직접 구현한다.

---

## 📝 기능 구현 목록

**1. 헤더 추가 버튼 클릭 시 음식점 추가 모달 열기**

- `isAddModalOpen` boolean state를 App.jsx에 추가한다. (초기값: false)
- `handleAddModalOpen` 핸들러를 정의하여 `Header`에 전달한다.
- `isAddModalOpen`이 true일 때만 `AddRestaurantModal`을 렌더링한다.

**2. 음식점 추가 폼 제출 시 목록에 추가**

- `restaurants` 상수를 state로 변환한다.
- `AddRestaurantModal`에서 category, name, description을 controlled input으로 관리한다.
- 폼 제출 시 `e.preventDefault()`로 새로고침을 막고, `onSubmit`으로 입력값을 App에 전달한다.
- App의 `handleFormSubmit`에서 목록에 추가하고 모달을 닫는다.

```jsx
const handleFormSubmit = (newRestaurant) => {
  setNewRestaurants([...newRestaurants, newRestaurant]);
  setIsAddModalOpen(false);
};
```

**3. 모달 닫기**

- backdrop 클릭 또는 추가 완료 시 `onClose`를 통해 `setIsAddModalOpen(false)` 호출한다.

**[optional] 재사용 가능한 Modal 컴포넌트 구현**

- `backdrop`, `container`, `title`을 공통으로 갖는 `Modal` 컴포넌트를 만든다.
- `title`, `onClose`를 props로, 각 모달의 고유 내용은 `children`으로 받는다.
- `AddRestaurantModal`, `RestaurantDetailModal`이 `Modal`을 내부에서 사용하도록 리팩토링한다.

---

## 📚 학습 내용

### 1. Controlled vs Uncontrolled Input

폼 입력값을 다루는 두 가지 방식이다.

**Controlled** — 입력값을 React state로 관리한다. `value`로 state를 바인딩하고, `onChange`로 변화를 감지해 state를 업데이트한다. React가 값의 단일 출처(source of truth)가 된다.

```jsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

**Uncontrolled** — state 없이, 제출 시점에 DOM에서 값을 직접 읽는다. `e.target.elements` 또는 `FormData`를 활용한다.

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  const name = e.target.elements.name.value;
};
```

| | Controlled | Uncontrolled |
|---|---|---|
| 값 관리 | React state | DOM |
| 값 접근 시점 | 언제든지 | 제출 시 |
| 실시간 유효성 검사 | 가능 | 어려움 |
| 코드량 | 많음 | 적음 |

이번 미션에서는 Controlled 방식을 사용했다.

### 2. 배열 state 업데이트

배열 state에 항목을 추가할 때 `push`는 직접 변경이라 리렌더링이 트리거되지 않는다. 스프레드 연산자로 새 배열을 만들어야 한다.

```jsx
setNewRestaurants([...newRestaurants, newRestaurant]);
```

### 3. children prop

컴포넌트 태그 사이에 넣은 JSX가 `children`이라는 특수 prop으로 전달된다.

```jsx
<Modal title="새로운 음식점" onClose={onClose}>
  <form>...</form>   {/* 이게 children */}
</Modal>

function Modal({ title, onClose, children }) {
  return (
    <div>
      <div onClick={onClose}></div>
      <div>
        <h2>{title}</h2>
        {children}  {/* <form>...</form>이 여기에 렌더링됨 */}
      </div>
    </div>
  );
}
```

공통 구조(껍데기)는 `Modal`이 담당하고, 각 모달은 고유한 내용만 children으로 전달하면 된다.

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 1. e.preventDefault() 위치

폼 submit 이벤트의 기본 동작(페이지 새로고침)을 막으려면 `e.preventDefault()`를 이벤트가 발생하는 곳에서 호출해야 한다. App의 `handleFormSubmit`이 받는 건 이벤트가 아니라 음식점 객체이기 때문에, `AddRestaurantModal` 내부의 `handleSubmit`에서 처리해야 한다.

### 2. `<select>`의 controlled input 연결

`value`와 `onChange`는 `<option>`이 아닌 `<select>`에 달아야 한다. `<option>`의 `value`는 해당 옵션이 선택됐을 때 `e.target.value`로 읽히는 값이고, `<select>`의 `value`가 현재 선택된 상태를 React state와 동기화한다.

## 🛠 리팩토링

**1. 재사용 가능한 Modal 컴포넌트 추출**

`AddRestaurantModal`과 `RestaurantDetailModal`이 backdrop, container, title 구조를 중복으로 갖고 있었다. 공통 구조를 `Modal` 컴포넌트로 분리하고, 각 모달은 `children`으로 고유 내용만 넘기도록 리팩토링했다.

## 과거 코드와 비교

### 달라진 점

### 과거 코드에서 배운 점
