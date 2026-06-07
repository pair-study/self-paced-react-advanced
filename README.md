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

### 4. BEM 네이밍과 CSS 모듈 표기법

BEM(Block Element Modifier)은 CSS 클래스 이름을 짓는 방법론이다.

- **Block**: 독립적으로 의미 있는 UI 단위 (`.modal`, `.button`)
- **Element**: Block의 하위 요소, `__`로 연결 (`.modal__backdrop`, `.restaurant__name`)
- **Modifier**: Block/Element의 변형, `--`로 연결 (`.modal--open`, `.button--primary`)

처음엔 하이픈(`-`)을 BEM 구분자로 혼동했다. `-`는 단어 구분자일 뿐이다. `form-item`은 하나의 Block 이름이며, 그 하위 요소는 `form-item__help-text`가 된다.

CSS Modules에서 `--`가 포함된 클래스는 JS에서 감소 연산자로 파싱되어 오류가 발생한다. 따라서 접근 표기법 규칙을 다음과 같이 통일했다.

```jsx
// block/element → 점 표기법
className={styles.modal__backdrop}

// modifier(--) → 대괄호 표기법
className={styles["modal--open"]}
```

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

1. **컴포넌트 단위 디렉토리 구조 재편**
   - `src/` 루트에 혼재하던 파일들을 `src/components/` 하위에 컴포넌트별 폴더로 분리했다.
   - 모달의 경우 두 컴포넌트가 공유하는 `Modal.module.css`를 유지하되, `AddRestaurantModal` 전용 폼 스타일만 `AddRestaurantModal.module.css`로 분리했다. 전용 스타일 양이 적은 컴포넌트까지 파일을 나누면 복잡도만 높아진다고 판단했다.

2. **BEM 네이밍 적용 및 CSS 모듈 표기법 일관성 확보**
   - 하이픈(`-`), `__`, `--`가 혼재하던 클래스명을 BEM 원칙에 맞게 정리했다.
   - `block__element`는 점 표기법, `modifier(--)`는 JS 감소 연산자 충돌 방지를 위해 대괄호 표기법으로 통일했다.

3. **이미지 모듈 임포트 방식 전환**
   - `public/`에 저장하여 정적 경로로 참조하던 방식에서 `src/assets/`로 이동 후 모듈 import 방식으로 전환했다.
   - 빌드 타임 에러 검출과 번들러의 자동 최적화·캐싱 기능을 활용할 수 있다.

4. **상수 분리 및 디렉토리 정리**
   - `categoryImages` 매핑 객체를 `src/constants/categoryImages.js`로 분리했다.
   - `restaurants` 데이터를 `src/utils/`에서 의미상 더 적합한 `src/constants/`로 이동했다.
   - 카테고리 목록 상수를 `src/constants/categories.js`로 분리하여 `CategoryFilter`와 `AddRestaurantModal`에서 공유하도록 했다. 두 컴포넌트가 사용하는 목록이 달라 `CATEGORIES`(6개 카테고리)와 `FILTER_OPTIONS`("전체" 포함 7개)를 각각 분리하고, `FILTER_OPTIONS`는 스프레드 문법으로 `CATEGORIES`를 재활용했다.

```js
export const CATEGORIES = ["한식", "중식", "일식", "양식", "아시안", "기타"];
export const FILTER_OPTIONS = ["전체", ...CATEGORIES];
```

5. **이벤트 핸들러 위치 변경**
   - `setCategory`를 props로 직접 전달하던 방식에서, `App.jsx`에 `handleSelectChange`를 정의하여 전달하는 방식으로 변경했다.
   - setter를 직접 노출하면 내부 구현이 드러나고, 이후 카테고리 변경 시 추가 동작을 붙이기 어렵다는 점을 고려했다.

6. **`map()` 인라인 방식 적용**
   - 변수에 미리 담아 반환하던 방식에서, JSX 안에서 `map()`을 직접 호출하는 인라인 방식으로 변경했다.

---

## 과거 코드와 비교

### 달라진 점

기준: 과거 동아리 미션 step2 코드 vs 현재 코드

**1. CSS 방식 — 전역 CSS → CSS Modules**

| 구분 | 과거 코드 | 현재 코드 |
|------|---------|---------|
| 파일 위치 | `src/styles/components/CategoryFilter.css` | `src/components/CategoryFilter/CategoryFilter.module.css` |
| 클래스 적용 | `className="restaurant-filter"` | `className={styles["restaurant-filter"]}` |

전역 CSS는 클래스명이 빌드 결과물에 그대로 노출되어, 다른 컴포넌트에 동일한 클래스명이 있으면 스타일이 충돌할 수 있다. CSS Modules는 빌드 시 `CategoryFilter_restaurant-filter__aBc3d` 같은 고유한 이름으로 변환하여 충돌을 방지한다.

**2. 디렉토리 구조**

| 구분 | 과거 코드 | 현재 코드 |
|------|---------|---------|
| 컴포넌트 | `src/components/Header.jsx` | `src/components/Header/Header.jsx` |
| 스타일 | `src/styles/components/Header.css` | `src/components/Header/Header.module.css` |

과거엔 JSX와 CSS 파일이 서로 다른 폴더에 분리되어 있었다. 현재는 같은 컴포넌트의 파일을 하나의 폴더에 모아 응집도를 높였다.

**3. 이미지 관리**

| 구분 | 과거 코드 | 현재 코드 |
|------|---------|---------|
| 파일 위치 | `public/category-korean.png` | `src/assets/category-korean.png` |
| 경로 참조 | `src="/category-korean.png"` | `import koreanImg from "…"` → `src={koreanImg}` |

정적 경로는 경로가 잘못되어도 빌드 시 에러가 발생하지 않아 런타임에서야 깨진 이미지를 확인할 수 있다.

### 과거 코드에서 배운 점

**1. 데이터와 UI 분리, `map()`을 활용한 렌더링**

Step 1에서 `RestaurantList`의 `<li>` 6개와 `CategoryFilter`의 `<option>` 태그가 모두 하드코딩되어 있었다.

리뷰어 피드백: *"이 친구들도 map을 사용해서 데이터 영역과, UI 영역을 분리해보면 좋을 것 같아요."*

```jsx
// 수정 전: 하드코딩
<option value="전체">전체</option>
<option value="한식">한식</option>
// ...

// 수정 후: 배열 + map()
const OPTIONS = ["전체", "한식", "중식", ...];
{OPTIONS.map((opt) => (
  <option key={opt} value={opt}>{opt}</option>
))}
```

**2. `id`와 `key`의 역할 차이**

`CategoryFilter`에 `id`를 추가한 의도를 설명하는 과정에서 두 개념을 혼동하여 리뷰어와 깊은 토론을 거쳤다.

- `id`: HTML DOM 전체에서 유일한 공개 식별자. `<label>` 연결, JS DOM 접근에 사용됨
- `key`: React가 리스트 변화를 추적하기 위한 내부 식별자. 실제 HTML에 렌더링되지 않으며, 리스트의 형제 요소 사이에서만 유일하면 됨

**3. CSS 변수를 활용한 디자인 시스템 일관성**

색상 값을 `#e9eaed`, `#fcfcfd`처럼 하드코딩했다가 `global.css`에 정의된 CSS 변수 사용을 권고받았다.

```css
/* 수정 전 */
border-bottom: 1px solid #e9eaed;

/* 수정 후 */
border-bottom: 1px solid var(--grey-200);
```

변수를 사용하면 디자인 변경 시 선언부 한 곳만 수정하면 되고, 하드코딩된 값은 어디서 온 색상인지 파악하기도 어렵다.
