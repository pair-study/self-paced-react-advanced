# Component 기본 구조와 JSX

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

1. HTML 템플릿을 그대로 React 컴포넌트로 변환하는 과정을 직접 경험한다.
2. 컴포넌트 단위로 UI를 나누는 기준을 스스로 정해본다.
3. CSS Module을 사용해보고, 일반 CSS import 방식과의 차이를 체감한다.

---

## 📝 기능 구현 목록

- [x] Header 컴포넌트 — 타이틀, 음식점 추가 버튼
- [x] CategoryFilter 컴포넌트 — 카테고리 드롭다운 필터
- [x] RestaurantList 컴포넌트 — 음식점 목록 (6개)
- [x] RestaurantDetailModal 컴포넌트 — 음식점 상세 정보 모달
- [x] AddRestaurantModal 컴포넌트 — 음식점 추가 폼 모달
- [x] 각 컴포넌트별 CSS Module 분리 및 import

---

## 📚 학습 내용

### HTML 태그 
- `label`의 `for` 속성

  `for`에 지정한 `id`와 일치하는 입력 요소를 레이블과 연결한다. 연결되면 레이블 텍스트를 클릭했을 때 해당 입력 요소로 포커스가 이동하고, 스크린 리더가 입력 요소를 읽을 때 레이블 텍스트를 함께 읽어줘서 접근성이 향상된다.

- `select`의 `required` 속성

  폼 제출 시 해당 `select`에서 값을 반드시 선택해야 한다는 유효성 검사 조건을 브라우저에 부여한다. 값이 선택되지 않은 채 제출을 시도하면 브라우저가 자동으로 경고 메시지를 표시하고 제출을 막는다. 이때 `<option value="">선택해 주세요</option>`처럼 `value`가 빈 문자열인 기본 옵션이 있어야 `required`가 정상적으로 동작한다.

### JSX 변환 규칙
- HTML의 `class`는 JSX에서 `className`으로 작성해야 한다.
- HTML의 `for`는 JSX에서 `htmlFor`로 작성해야 한다.
- `<img>`, `<input>` 등 닫히는 태그가 없는 요소는 self-closing tag로 작성해야 한다.(`<img />`)

### CSS Module 사용법
- `import styles from "./Component.module.css"` 형태로 객체로 가져온다.
- 클래스 적용 시 `className={styles.클래스명}` 형태로 사용한다.
- `App.css`처럼 전역 스타일은 `import "./App.css"` 로 import하면 앱 전체에 적용되고, 어느 컴포넌트에서든 문자열로 바로 쓸 수 있다. (`className="text-title"`)
- CSS Module 클래스와 전역 클래스를 함께 쓸 때는 템플릿 리터럴을 사용한다.

  ```jsx
  className={`${styles.name} text-title`}
  ```

### CSS Module의 특징
- 클래스명이 빌드 시 고유한 해시값으로 변환된다. (ex: `gnb__title` → `_gnb__title_abc12_1`)
- 덕분에 서로 다른 컴포넌트에서 동일한 클래스명을 사용해도 충돌하지 않는다.
- 일반 CSS import는 전역으로 적용되어 클래스명 충돌 위험이 있지만, CSS Module은 컴포넌트 단위로 스코프가 격리된다.

### React 컴포넌트 기본 구조
- 컴포넌트는 반드시 `return`이 있어야 화면에 렌더링된다.
- 이미지 asset은 `import`로 가져온 후 `src={변수명}` 형태로 사용한다.

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### CSS Module에서 하이픈이 포함된 클래스명 사용
CSS 클래스명에 하이픈(-)이 포함된 경우 점 표기법(`styles.class-name`)으로 쓰면 JavaScript가 빼기 연산자로 해석해 오류가 난다.

```jsx
// 오류
<div className={styles.restaurant-filter-container}>

// 해결: 대괄호 표기법 사용
<div className={styles["restaurant-filter-container"]}>
```

### htmlFor에 클래스명을 함께 쓰는 실수
`for` 속성에 클래스명을 붙여 쓰는 HTML 습관이 그대로 남아 오류가 발생했다. `htmlFor`는 연결할 input의 `id`만 받아야 하고, 클래스는 별도의 `className`으로 분리해야 한다.

```jsx
// 오류
<label htmlFor="category text-caption">

// 해결
<label htmlFor="category" className="text-caption">
```

### BEM 네이밍의 `--` 구분자 오타
`form-item--required`처럼 BEM 수정자(modifier)는 `--`(더블 대시)를 사용한다. 싱글 대시(`-`)로 잘못 쓰면 CSS 스타일이 적용되지 않아 원인을 찾기 어렵다.

---

## 🛠 리팩토링

1. CSS 클래스 네이밍 BEM 원칙 적용

  - 이유: 템플릿의 CSS를 그대로 복사해 사용하다 보니 `modal-backdrop`, `modal-container`처럼 블록과 엘리먼트 관계임에도 단순 하이픈(-)으로 연결된 클래스가 혼재했다. BEM 원칙상 엘리먼트는 `__`로 구분해야 하는데, 이를 지키지 않아 클래스 간의 계층 구조가 명확히 드러나지 않았다.

  - 개선: `modal-backdrop` → `modal__backdrop`, `modal-container` → `modal__container` 등 엘리먼트 관계에 해당하는 클래스를 `__`로 통일하였다. 그 결과 블록/엘리먼트는 점 표기법(`styles.modal__backdrop`), modifier만 대괄호 표기법(`styles["modal--open"]`)으로 쓰는 일관된 규칙이 생겼다.

2. CSS Module 클래스 접근 표기법 일관성 확보

  - 이유: 일부 클래스는 `styles.gnb__title`처럼 점 표기법으로, 일부는 `styles["restaurant-filter-container"]`처럼 대괄호 표기법으로 혼용되어 코드의 일관성이 떨어졌다. 두 표기법이 섞이면 어떤 기준으로 선택해야 하는지 불명확하다.

  - 개선: BEM 리팩토링을 통해 클래스명에서 단순 하이픈을 제거하여, block과 element는 항상 점 표기법, modifier(`--`)는 JS에서 감소 연산자로 해석되므로 반드시 대괄호 표기법을 사용한다는 명확한 기준을 만들었다. 