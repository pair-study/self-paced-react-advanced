# Props와 State

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

1. Props를 통해 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방식을 이해한다.
2. State를 사용해 컴포넌트 내부의 동적 상태를 관리한다.
3. Props와 State를 조합하여 부모-자식 간 양방향 데이터 흐름을 구현한다.

---

## 📝 기능 구현 목록

- [x] RestaurantList에 restaurants 배열을 props로 전달
- [x] 배열 데이터를 map()으로 동적 렌더링
- [x] 각 리스트 항목에 key prop 추가
- [x] CategoryFilter에서 선택된 카테고리 상태 관리
- [x] App 컴포넌트에서 카테고리별 필터링 로직 구현
- [x] 필터된 데이터를 RestaurantList에 props로 전달
- [x] 카테고리별 동적 이미지 매핑

---

## 📚 학습 내용

### Props (속성)
- 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 메커니즘이다.
- 자식 컴포넌트 함수의 매개변수로 받는다: `function Component({ prop1, prop2 }) { }`
- Props는 읽기 전용이므로 자식에서 직접 수정할 수 없다.

### State (상태)
- 컴포넌트 내부에서 변경 가능한 데이터를 관리한다.
- `useState` 훅으로 선언한다: `const [state, setState] = useState(초기값)`
- State가 변경되면 컴포넌트가 리렌더링된다.
- State는 각 컴포넌트 인스턴스마다 독립적으로 존재한다.

### Props vs State
- Props: 부모 → 자식, 읽기 전용
- State: 컴포넌트 내부, 변경 가능
- State를 변경하려면 setter 함수(`setState`)를 사용한다.

### 배열 렌더링과 Key
- 배열을 렌더링할 때 `map()` 메서드를 사용한다.
- 각 항목에 고유한 `key` prop을 부여해야 한다.
- key는 React가 어떤 항목이 변경/추가/삭제되었는지 식별하는 데 사용된다.
- 안정적인 고유값(예: id)을 key로 사용하고, index는 피한다.

### 동적 데이터 매핑
- 객체를 사용해 카테고리와 이미지 등을 매핑할 수 있다.
- `const CATEGORY_IMAGES = { "한식": koreanImg, ... }`
- 필요한 값을 동적으로 조회: `CATEGORY_IMAGES[restaurant.category]`

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### Controlled Component의 필요성
처음엔 CategoryFilter가 자체 state를 관리했고 RestaurantList는 고정된 데이터를 표시했다. 부모인 App에서 카테고리 선택값을 알 수 없었다.

**해결:** State를 부모 App으로 올렸다. CategoryFilter는 props로 `category`와 `onChangeCategory`를 받아 controlled component가 되었고, 필터링 로직은 App에서 처리하게 됐다. 이를 통해 부모-자식 간 데이터 흐름이 단방향으로 명확해졌다.

### 동적 이미지 매핑의 필요성
처음엔 모든 음식점이 한식 이미지(`koreanImg`)만 표시됐다. 음식점 객체에 `category` 필드가 있는데도 활용하지 않고 있었다.

**해결:** `CATEGORY_IMAGES` 객체를 만들어 카테고리별 이미지를 매핑했다. `src={CATEGORY_IMAGES[restaurant.category]}`로 각 음식점에 맞는 이미지가 동적으로 표시되도록 수정했다.

---

## 🛠 리팩토링

1. Props와 State 책임 분리

  - 이유: 초기 구현에서 각 컴포넌트가 자신의 state를 독립적으로 관리하고 있어, 부모 컴포넌트가 상태 변화를 알 수 없었다. 이로 인해 필터링이 제대로 작동하지 않았다.

  - 개선: State를 부모 App 컴포넌트로 올렸다(state lifting). CategoryFilter는 선택된 카테고리를 props로 받아 표시만 하고, 변경 시 콜백 함수를 통해 부모에 알린다. 이제 App이 중앙에서 상태를 관리하고, RestaurantList에 필터된 데이터를 props로 전달한다.

2. 동적 이미지 매핑으로 하드코딩 제거

  - 이유: 모든 음식점에 한식 이미지만 매핑되어 있었다. 각 음식점의 `category` 필드를 활용하지 않고 있었고, 새로운 카테고리 추가 시 컴포넌트 코드를 수정해야 했다.

  - 개선: `CATEGORY_IMAGES` 객체를 만들어 카테고리와 이미지를 매핑했다. 이제 음식점 데이터의 `category`에 따라 자동으로 올바른 이미지가 표시된다. 새로운 카테고리를 추가할 때도 객체에만 항목을 추가하면 된다.