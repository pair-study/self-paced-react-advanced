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

- 음식점 추가 모달 열림 여부를 boolean state로 관리한다.
- 버튼 클릭 시 모달을 조건부 렌더링한다.

**2. 음식점 추가 폼 제출 시 목록에 추가**

- 폼 입력값을 controlled input으로 관리한다.
- 폼 제출 시 입력값을 상위 컴포넌트로 전달해 목록에 추가하고 모달을 닫는다.

**3. 모달 닫기**

- backdrop 클릭 또는 폼 제출 완료 시 모달을 닫는다.

**[optional] 재사용 가능한 Modal 컴포넌트 구현**

- 두 모달의 공통 구조를 `Modal` 컴포넌트로 추출한다.
- 각 모달의 고유 내용은 `children`으로 전달한다.

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

**2. 배열 state 업데이트를 함수형 업데이트로 변경**

`[...newRestaurants, newRestaurant]`에서 `(prev) => [...prev, newRestaurant]`로 변경했다. 이전 state에 의존하는 업데이트는 함수형 업데이트가 더 안전하다.

**3. id 생성을 `crypto.randomUUID()`로 변경**

`Date.now()` 대신 `crypto.randomUUID()`를 사용하도록 변경했다. 밀리초 단위 충돌 가능성을 제거하고 고유성을 보장한다.

**4. Modal 래퍼 `<div>` → Fragment, CSS 토글 패턴 제거**

템플릿(순수 HTML/CSS)에서 `.modal--open` 클래스를 붙이고 떼는 방식으로 모달을 보이고 숨겼는데, React 조건부 렌더링으로 전환하면서 CSS 토글이 불필요해졌다. 래퍼 `<div>`도 Fragment로 교체했다. backdrop과 container가 모두 `position: fixed`라 부모 요소의 레이아웃에 영향을 받지 않기 때문에 래퍼가 없어도 동작이 동일하다.

## 과거 코드와 비교

### 달라진 점

**1. 폼 입력값 읽기 방식 — Uncontrolled → Controlled**

| 구분 | 과거 코드 | 현재 코드 |
|------|---------|---------|
| 방식 | Uncontrolled (`FormData`) | Controlled (`useState`) |
| 값 접근 | 제출 시 DOM에서 읽음 | state로 실시간 관리 |
| 코드량 | 적음 | 많음 |

과거 코드는 state 없이 폼 제출 시 `FormData`로 DOM에서 한 번에 읽었다. 각 input에 `name` 속성이 있으면 키-값 쌍으로 꺼낼 수 있어 코드가 간결하다.

```jsx
// 과거 — Uncontrolled
const fd = new FormData(e.currentTarget);
onAdd({ category: fd.get("category"), name: fd.get("name") });

// 현재 — Controlled
const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />
```

### 과거 코드에서 배운 점

**1. 함수형 업데이트**

리뷰어 코드에서 배열 state 업데이트 시 함수형 업데이트를 사용했다.

```jsx
// 기존 코드 — newRestaurants를 직접 참조
setNewRestaurants([...newRestaurants, newRestaurant]);

// 함수형 업데이트 — React가 최신 state를 prev로 전달
setNewRestaurants((prev) => [...prev, newRestaurant]);
```

React의 state 업데이트는 즉시 반영되지 않아 렌더링 사이클 사이에 `newRestaurants`가 오래된 값일 수 있다. `prev`는 React가 보장하는 최신 state이므로, 이전 state를 기반으로 새 state를 만들 때는 함수형 업데이트가 더 안전하다.

`prev`는 관례적인 이름일 뿐이며, 각 setter에 묶인 해당 state의 최신값이 전달된다. state가 여러 개여도 setter가 다르므로 섞이지 않는다.

**2. `crypto.randomUUID()`**

리뷰어 피드백: *"아주 짧은 시간 안에 여러 항목이 추가될 경우 `Date.now()`는 중복된 id가 생성될 가능성이 있습니다. `crypto.randomUUID()`를 고려해보세요."*

`Date.now()`는 밀리초 단위 숫자라 짧은 시간 안에 두 번 호출되면 같은 값이 나올 수 있다. `crypto.randomUUID()`는 브라우저 내장 함수로 `"550e8400-e29b-41d4-a716-446655440000"` 형태의 충돌 없는 고유 ID를 생성한다.
