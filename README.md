# 재사용 가능한 컴포넌트 설계

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

1. controlled 컴포넌트와 uncontrolled 컴포넌트의 차이를 이해하고, 각각 어떤 상황에서 선택하는지 기준을 세운다.
2. 어떤 state를 어느 컴포넌트가 소유해야 하는지 판단하고, 필요한 경우 공통 부모로 끌어올리는 패턴(Lifting State Up)을 경험한다.
3. `children` props를 활용해 재사용 가능한 Modal 컴포넌트를 설계하는 방법을 익힌다.

---

## 📝 기능 구현 목록

- [x] Header의 음식점 추가 버튼 클릭 시 AddRestaurantModal 열기
- [x] 추가하기 버튼 클릭 시 음식점 목록에 항목 추가
- [x] 재사용 가능한 Modal 컴포넌트로 AddRestaurantModal, RestaurantDetailModal 개선

---

## 📚 학습 내용

### Controlled vs Uncontrolled Component

컴포넌트의 중요한 정보가 **props**에 의해 결정되면 controlled, **지역 state**로 자체 관리되면 uncontrolled이다.

| | Controlled | Uncontrolled |
|---|---|---|
| 정보 출처 | props (부모가 제공) | 지역 state (자체 관리) |
| 부모의 영향 | 동작을 완전히 지정 가능 | 영향을 줄 수 없음 |
| 유연성 | 여러 컴포넌트와 조정 용이 | 독립적이지만 협력 어려움 |
| 사용 난이도 | 부모에서 props 설정 필요 | 설정이 적어 사용하기 쉬움 |

**언제 선택하나?**
- **Controlled** — 부모 컴포넌트와 state를 공유하거나, 여러 컴포넌트의 동작을 함께 조정해야 할 때
- **Uncontrolled** — 부모와 상태를 공유할 필요 없이 독립적으로 동작해도 될 때

**이 미션에서의 선택:**

controlled/uncontrolled는 컴포넌트 전체에 붙이는 레이블이 아니라, 어떤 정보가 어디서 관리되는지를 기준으로 판단한다. AddRestaurantModal은 두 가지가 혼재한다.

- **폼 데이터** (category, name, description) → 지역 state로 자체 관리 → **uncontrolled**
- **모달 열림/닫힘** → App이 소유 → **controlled**

모달 열림 상태를 App이 소유하는 이유는 트리거(Header의 추가 버튼)와 모달이 형제 관계이기 때문이다. 형제끼리는 서로의 state에 접근할 수 없으므로 공통 부모인 App으로 state를 끌어올렸다(Lifting State Up).

`onSubmit`, `onClose`는 state가 아닌 콜백이다. "어떤 값을 누가 소유하냐"의 문제가 아니라 이벤트를 부모로 전달하는 통로이므로 controlled/uncontrolled 구분과는 별개다.

### form submit 기본 동작과 e.preventDefault()

`<form onSubmit={handler}>`에서 submit 이벤트가 발생하면 브라우저는 기본적으로 페이지를 새로고침한다. React SPA에서는 이 기본 동작을 막아야 state 업데이트가 유지된다.

리팩토링 후 `e.preventDefault()`는 폼을 소유한 AddRestaurantModal 내부에 있다. 완성된 데이터만 `onSubmit`을 통해 App으로 전달한다.

```jsx
// AddRestaurantModal.jsx
function handleFormSubmit(e) {
  e.preventDefault(); // 없으면 setRestaurants 실행 직후 페이지 리로드로 state 초기화
  onSubmit({ category, name, description });
}

// App.jsx — 이벤트 객체가 아닌 데이터 객체를 받음
function handleRestaurantSubmit({ category, name, description }) {
  setRestaurants([...restaurants, { id: Date.now(), category, name, description }]);
}
```

### 폼 state를 부모로 끌어올리기 (Lifting State Up)

초기 구현에서는 `restaurants` state가 `App`에 있어서 폼 state도 `App`으로 끌어올려 props로 전달했다. 그러나 App이 실제로 필요한 것은 추가 완료 시점의 최종 데이터뿐이므로, 리팩토링을 통해 폼 state를 `AddRestaurantModal` 안으로 내리고 완성된 데이터만 부모로 전달하도록 변경했다. (자세한 내용은 리팩토링 섹션 참고)

### 추가 후 상태 초기화

음식점을 추가한 뒤 폼 입력값을 초기화하지 않으면 모달을 다시 열었을 때 이전 값이 남아있다.

초기 구현에서는 폼 state가 App에 있었기 때문에 추가 완료 시점에 명시적으로 초기화했다.

```jsx
setIsAddRestaurantModalOpen(false);
setCategory("");
setName("");
setDescription("");
```

리팩토링 후에는 폼 state를 AddRestaurantModal 내부로 내렸기 때문에 명시적 초기화가 불필요해졌다. `isAddRestaurantModalOpen`이 `false`가 되면 AddRestaurantModal이 언마운트되고, 다시 열릴 때 새로 마운트되면서 `useState("")`의 초기값으로 자동 초기화된다.

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 어떤 state를 어느 컴포넌트가 소유해야 하는가

음식점 추가 기능을 구현하면서 다음 state들이 필요하다고 생각했다.

- `restaurants` — 음식점 목록
- `category`, `name`, `description` — 폼 입력값
- `isAddRestaurantModalOpen` - 모달 열림/닫힘

이 state들을 어느 컴포넌트에 선언할지 결정하기 위해 "이 state를 누가 필요로 하는가"를 기준으로 판단했다.

`restaurants`는 AddRestaurantModal(추가 시 갱신)과 RestaurantList(목록 렌더링) 모두 필요하다. 두 컴포넌트는 형제 관계라 서로의 state에 직접 접근할 수 없으므로, 공통 부모인 App으로 끌어올렸다(Lifting State Up).

`category`, `name`, `description`은 폼을 입력하는 동안 AddRestaurantModal 안에서만 쓰인다. 추가 완료 시점에 최종 데이터만 부모로 전달하면 되므로, 굳이 App까지 올릴 필요가 없다. AddRestaurantModal이 직접 소유한다.

`isAddRestaurantModalOpen`도 같은 기준으로 판단했다. 모달을 여는 트리거는 Header의 추가 버튼이고, 실제로 열리는 것은 AddRestaurantModal이다. 두 컴포넌트는 형제 관계라 서로의 state에 접근할 수 없으므로 공통 부모인 App이 소유해야 한다.

### 식당을 추가해도 목록이 업데이트되지 않는 문제

`handleSubmit`에서 `setRestaurants`가 호출되는데도 목록이 바뀌지 않아서 원인을 찾아봤다. `e.preventDefault()`가 없어서 submit 시 페이지가 새로고침되고, state 업데이트가 반영되기 전에 초기 상태로 되돌아가는 것이었다. state 업데이트 자체는 올바르게 작성되어 있었지만 브라우저 기본 동작을 막지 않아서 생긴 문제였다.

### setRestaurants 인자 오류

처음에 `setRestaurants(...restaurants, { ... })`로 작성했다. 이렇게 하면 배열이 아닌 여러 인자를 `setRestaurants`에 넘기는 것이라 새 배열이 만들어지지 않는다. 배열 리터럴 안에서 스프레드해야 한다.

```jsx
// ❌ 인자를 여러 개 전달하는 것
setRestaurants(...restaurants, { id: Date.now(), ... });

// ✅ 기존 항목을 펼쳐서 새 배열 생성
setRestaurants([...restaurants, { id: Date.now(), ... }]);
```

---

## 🛠 리팩토링

### 이벤트 핸들러 네이밍 규칙

`handle` + `[대상]` + `[동작]` 패턴을 사용한다. 대상은 항상 붙인다.

```jsx
handleFormSubmit       // Form + Submit
handleCategoryChange   // Category + Change
handleDetailModalClose // DetailModal + Close
```

props로 넘길 때는 `on-`으로 통일한다. `on-`은 인터페이스(계약), `handle-`은 구현이다.

```jsx
// 정의는 handle-
function handleNameChange(e) { ... }

// props로 넘길 때는 on-
<AddRestaurantModal onNameChange={handleNameChange} />
```

### 폼 state를 자식으로 내리기

처음 구현에서는 폼 입력값(category, name, description)을 App에서 관리했다. `restaurants` state가 App에 있어서 폼 데이터도 App까지 올려야 한다고 생각했기 때문이다. 결과적으로 AddRestaurantModal에 props가 8개가 됐다.

그러나 App이 실제로 필요한 것은 **추가 완료 시점의 최종 데이터**뿐이다. 폼을 채우는 중간 과정의 입력값은 App이 알 필요가 없다. 폼 state를 AddRestaurantModal 안으로 내리고, 완료 시에만 부모로 전달하도록 변경했다.

```jsx
// Before: App이 중간 입력값까지 관리
<AddRestaurantModal
  category={category}
  name={name}
  description={description}
  onCategoryChange={handleCategoryChange}
  onNameChange={handleNameChange}
  onDescriptionChange={handleDescriptionChange}
  onSubmit={handleSubmit}
  onClose={handleAddRestaurantModalClose}
/>

// After: 완성된 데이터만 부모로 전달
<AddRestaurantModal
  onSubmit={handleRestaurantSubmit}   // { category, name, description } 객체를 받음
  onClose={handleAddRestaurantModalClose}
/>
```

props가 8개 → 2개로 줄었고, 폼 내부 관심사가 AddRestaurantModal 안에 캡슐화됐다.

### Modal 래퍼 div 제거

`display: none` / `display: block` 패턴은 템플릿(`templates/style.css`)에서 그대로 가져온 것이다. 템플릿은 순수 HTML/CSS 기반으로, 모달이 DOM에 항상 존재하면서 `.modal--open` 클래스를 붙이고 떼는 방식으로 보이고 숨겼다.

React로 전환하면서 조건부 렌더링(`{isOpen && <Modal />}`)을 사용하게 되면서 CSS 토글이 불필요해졌다. 템플릿의 구조를 그대로 쓰면서 생긴 불필요한 패턴을 뒤늦게 제거했다.

래퍼 `<div>`도 함께 제거했다. backdrop과 container가 둘 다 `position: fixed`라 부모 요소의 레이아웃에 영향을 받지 않아 래퍼가 없어도 동작이 동일하다. 불필요한 DOM 노드를 줄이기 위해 Fragment로 교체했다.
