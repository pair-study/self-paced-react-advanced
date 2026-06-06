# 조건부 렌더링 활용

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

1. 이벤트 핸들러를 통해 사용자 인터랙션에 반응하는 방법을 이해한다.
2. 조건부 렌더링(`&&`)을 활용해 상황에 따라 컴포넌트를 보여주고 숨긴다.
3. 어떤 값을 state로 선언해야 하는지 기준을 세운다.

---

## 📝 기능 구현 목록

- [x] 음식점 아이템 클릭 시 모달 열기
- [x] 닫기 버튼 또는 backdrop 클릭 시 모달 닫기
- [x] 클릭한 음식점 정보를 모달에 전달하여 표시

---

## 📚 학습 내용

### 이벤트 핸들러와 데이터 전달

이벤트 핸들러에 함수를 직접 연결하면 React가 이벤트 객체(`e`)를 자동으로 넘겨준다. 클릭된 아이템의 데이터를 함께 전달하려면 화살표 함수로 한 번 감싸야 한다.

```jsx
// 이벤트 객체(e)만 전달됨
onClick={onRestaurantClick}

// 클릭된 restaurant 데이터를 직접 전달
onClick={() => onRestaurantClick(restaurant)}
```

`() => onRestaurantClick(restaurant)`는 `map` 순회 중인 `restaurant`를 부모까지 전달하는 역할을 한다.

### 조건부 렌더링

`{condition && <Component />}` 패턴으로 조건이 참일 때만 컴포넌트를 렌더링한다.

```jsx
{clickedRestaurant && (
  <RestaurantDetailModal restaurant={clickedRestaurant} onClose={handleModalClose} />
)}
```

### State로 선언할 것과 아닌 것

**State가 필요한 경우**: 시간이 지나면서 변하고, 렌더링에 영향을 주며, 다른 state나 props로부터 계산할 수 없는 값

**State가 불필요한 경우**: 기존 state나 props로부터 계산 가능한 파생값(derived value)

```jsx
// category state에서 계산 가능 → state 불필요
const filteredRestaurants = filterRestaurants(RESTAURANTS, category);

// clickedRestaurant state에서 계산 가능 → state 불필요
const isRestaurantDetailModalOpen = !!clickedRestaurant;
```

파생 변수는 state와 달리 setter가 없어 동기화 버그가 생기지 않고, 렌더링마다 자동으로 최신값을 계산한다.

### `&&` 조건부 렌더링 주의사항

`&&` 앞에 숫자나 빈 문자열 같은 falsy 값이 오면, `false`로 평가되지 않고 값 자체가 화면에 출력된다.

```jsx
// ⚠️ count가 0이면 "0"이 화면에 렌더링됨
{count && <Modal />}

// ✅ 명시적으로 불리언으로 변환
{!!count && <Modal />}
{count > 0 && <Modal />}
```

이 미션에서 `clickedRestaurant`는 객체 또는 `null`만 들어오므로 문제없지만, 숫자나 문자열을 조건으로 쓸 때는 주의해야 한다. `!!`를 사용하는 이유 중 하나이기도 하다.

### Lifting State Up

클릭된 음식점 정보를 `RestaurantList`와 `RestaurantDetailModal` 두 컴포넌트가 공유해야 하므로, 공통 부모인 `App`에서 state를 관리한다.

### `!!` 이중 부정 연산자

자바스크립트에서 값의 truthy/falsy 평가 결과를 명시적으로 불리언 값으로 변환하기 위해 사용된다. 주로 조건식의 결과를 일관된 불리언 타입으로 정규화할 때 활용된다.

```jsx
!!null       // → false (모달 닫힌 상태)
!!{ id: 1 } // → true  (모달 열린 상태)
```

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 무엇을 state로 선언할지

가장 고민이 된 부분은 `restaurant`를 state로 만들어야 하는가였다. `filteredRestaurants`로 계산할 수 있을 것 같아 state가 불필요하다고 생각했는데, 실제로는 두 값의 역할이 다르다.

- `filteredRestaurants` — 화면에 보여줄 **목록** → `category`에서 파생, state 불필요
- `clickedRestaurant` — 모달에 보여줄 **선택된 하나** → 클릭 전까지 알 수 없으므로 state 필요

**기준**: 다른 값으로부터 계산할 수 없다면 state, 계산할 수 있다면 파생 변수

### isModalOpen과 clickedRestaurant를 따로 두면 생기는 문제

처음엔 `isModalOpen` boolean과 `clickedRestaurant` 두 state를 동시에 관리하려 했다. 이 경우 둘을 항상 함께 업데이트해야 하는데, 하나라도 빠지면 모달은 열려 있지만 `clickedRestaurant`가 `null`인 상황이 발생해 런타임 에러가 난다.

```jsx
function handleRestaurantClick(restaurant) {
  setClickedRestaurant(restaurant);
  setIsModalOpen(true); // 둘 중 하나라도 빠지면 버그
}
```

**해결:** `clickedRestaurant` 하나로 통합. `null`이면 닫힌 상태, 값이 있으면 열린 상태다. `isRestaurantDetailModalOpen`은 이를 기반으로 계산한 파생 변수로 가독성을 확보했다.

```jsx
const [clickedRestaurant, setClickedRestaurant] = useState(null);
const isRestaurantDetailModalOpen = !!clickedRestaurant; // 파생 변수
```

---

## 🛠 리팩토링

State 설계를 단계적으로 개선하며 사고 과정을 커밋으로 기록했다.

1. **Stage 1** — `isModalOpen` boolean state로 모달 열고 닫기만 구현 (restaurant 데이터 없음)
2. **Stage 2** — `isModalOpen` + `clickedRestaurant` 두 state로 실제 데이터 전달 (동기화 문제 내포)
3. **Stage 3** — `clickedRestaurant` 단일 state로 통합, `isRestaurantDetailModalOpen`을 파생 변수로 개선
