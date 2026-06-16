# styled-components를 적용해서 리팩토링하기

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

- styled-components의 기본 문법과 사용법을 익히고, CSS-in-JS 방식이 기존 별도 CSS 파일 방식과 어떤 차이가 있는지 직접 체감한다.
- 단순히 동작하는 코드를 넘어, 컴포넌트마다 스코프가 격리된 스타일을 작성하는 습관을 형성한다.
- styled-components를 처음 접하더라도 공식 문서를 스스로 찾아 읽고 적용하는 자기주도 학습 역량을 키운다.
- CSS 파일 방식 vs CSS-in-JS 방식의 trade-off를 정리해 PR에 나만의 언어로 서술한다.

## 📝 기능 구현 목록

- `styled-components` 패키지 설치
- 모든 컴포넌트의 CSS Module 파일을 제거하고 styled-components로 전환
  - `Header`, `CategoryFilter`, `RestaurantList`
  - `Modal`, `AddRestaurantModal`, `RestaurantDetailModal`
- `props`를 활용한 조건부 스타일링 적용 (`$required`, `$primary`)
- `App.css`에서 Typography 유틸리티 클래스 제거 (각 컴포넌트 스타일로 이동)

## 📚 학습 내용

### 1. styled-components 기본 문법
- `styled.태그명` 뒤에 백틱으로 CSS를 작성하면 해당 태그에 스타일이 적용된 React 컴포넌트가 만들어진다.
- 백틱 안에서 자식 요소 선택자(`label { }`, `input { }`)를 중첩해서 쓸 수 있다. styled-components가 컴파일 시 고유 클래스명(예: `.sc-abc123`)을 생성하고, 중첩 선택자를 `.sc-abc123 input { }` 형태로 변환하기 때문이다.
- `&`는 생성된 클래스명 자신을 가리키는 선택자로, `&:hover`, `&:last-child` 같은 의사 클래스에 사용한다.

### 2. Scoped Styling 원리
- 런타임에 컴포넌트마다 고유 클래스명을 생성해 `<style>` 태그에 주입한다. 이 방식으로 스타일이 컴포넌트 단위로 격리된다.
- CSS Module도 빌드 타임에 고유 클래스명을 생성해 같은 목적을 달성하지만, styled-components는 스타일을 JS 파일 안에서 함께 관리한다는 차이가 있다.

### 3. CSS-in-JS vs 별도 CSS 파일 trade-off

| | CSS 파일 분리 | styled-components |
|---|---|---|
| 파일 구조 | `.css` 파일 별도 존재 | 컴포넌트 파일 하나로 관리 |
| 스코프 | 전역 (충돌 위험) | 컴포넌트 단위 격리 |
| 동적 스타일 | `className` 조건부 처리 | props로 직접 제어 |
| JS 번들 | CSS 별도 | CSS가 JS 번들에 포함 |

### 4. transient props (`$` prefix)
- styled-components에 전달한 props는 기본적으로 DOM 속성으로도 전달된다.
- `$`를 붙이면 스타일 계산에만 사용되고 DOM에는 전달되지 않아 불필요한 HTML 경고를 막을 수 있다.

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 1. `FormItem.input` 문법 오류

styled-components에서 부모 컴포넌트 내부의 `input`에 스타일을 주려고 `FormItem.input`처럼 프로퍼티로 접근했는데, 이런 문법은 존재하지 않아 에러가 났다.

부모 컴포넌트 백틱 안에 `input { ... }`처럼 자식 선택자를 중첩하면 `.sc-abc123 input { }`으로 변환되어 해당 컴포넌트 내부의 input에만 스타일이 적용된다. JSX에서는 그냥 `<input>`을 쓰면 된다.

### 2. BEM Modifier를 props로 대체하기

BEM에서 Modifier(M)는 Block의 상태나 변형을 나타낸다. `.form-item--required`는 `.form-item` Block의 "필수 입력" 상태를 표현하는 Modifier다.

styled-components에서는 이 Modifier의 역할을 `props`가 대신한다. `$required` prop이 전달되면 `label::after`로 별표를 추가하는 스타일이 적용되는 방식으로, `.block--modifier` 클래스 추가와 동일한 효과를 낸다.

### 3. styled component와 함수 이름 충돌

`RestaurantList.jsx`에서 `const RestaurantList = styled.ul`과 `function RestaurantList()`를 같은 이름으로 선언해 에러가 났다. 파일명과 컴포넌트 함수명이 같을 때 내부 styled component 이름이 충돌할 수 있다. styled component 이름을 `RestaurantUl`로 바꿔 해결했다.

## 🛠 리팩토링

### 1. `css` 헬퍼로 공통 typography 추출

과거 코드 리뷰에서 `src/styles/common.js`로 공통 스타일을 추출하는 방식을 보고 현재 코드에 적용했다. `RestaurantName`, `ModalTitle` 등 여러 컴포넌트에 typography 값이 직접 작성되어 있어 중복이 있었는데, `src/styles/typography.js`를 만들어 `textTitle`, `textSubtitle`, `textBody`, `textCaption`을 `css` 헬퍼로 추출하고 각 컴포넌트에서 `${textSubtitle}` 형태로 사용하도록 개선했다.

초기에는 `styled.label`로 컴포넌트를 만들어 export하는 방식을 시도했는데, 두 접근의 차이는 다음과 같다.

```js
// styled.label — label 태그에 종속된 React 컴포넌트
const TextCaption = styled.label`
  font-size: 14px;
`;
// JSX에서 <TextCaption>으로 사용 → 항상 <label>로 렌더링
// h3, span 등 다른 태그에는 재사용 불가

// css 헬퍼 — 태그 없는 CSS 조각
const textCaption = css`
  font-size: 14px;
`;
// styled component 안에 ${textCaption}으로 삽입
// 어떤 태그의 styled component에든 재사용 가능
const Title = styled.h3`${textCaption}`;
const HelpText = styled.span`${textCaption}`;
```

typography는 특정 태그가 아니라 여러 요소에 공통으로 적용되는 스타일이므로 `css` 헬퍼가 적합하다.

### 2. `Button`, `ModalButtonContainer` 중복 제거

`AddRestaurantModal`과 `RestaurantDetailModal`에 동일한 `Button`, `ModalButtonContainer`가 각각 정의되어 있었다. `Modal.jsx`에서 한 번만 정의하고 `export`해서 두 컴포넌트에서 import해 사용하도록 개선했다.

1번과 다르게 `css` 헬퍼 방식이 아닌 styled component 자체를 export한 이유는, `Button`은 JSX에서 `<Button $primary>추가하기</Button>`처럼 사용되어야 하기 때문이다. `css` 헬퍼는 CSS 조각일 뿐이라 JSX에서 컴포넌트처럼 쓸 수 없다. `css` 헬퍼로 추출했다면 각 파일에서 여전히 `const Button = styled.button`${buttonStyles}``처럼 컴포넌트를 따로 만들어야 해서 중복이 그대로 남는다. styled component 자체를 export하면 props 처리(`$primary`), 의사 클래스(`&:last-child`) 등 컴포넌트 전체가 재사용된다.

## 과거 코드와 비교

### 달라진 점

**공통 스타일 파일 미분리**

과거 코드는 `src/styles/common.js`를 만들어 typography, buttonBase, formItemBase 등 반복되는 스타일을 `css` 헬퍼로 추출해 여러 컴포넌트에서 가져다 썼다. 현재 코드는 각 컴포넌트에 스타일을 직접 작성했다.

### 과거 코드에서 배운 점

**HTML 기본 검증과 JS 검증의 역할 차이**

과거 코드는 `required` 없이 상태값을 그대로 `onAdd`에 넘겨서 빈 문자열로 제출이 가능했다. 리뷰어가 이를 지적했고, 이를 통해 입력값 검증을 어느 시점에, 어떤 방식으로 해야 하는지 생각하게 됐다.

HTML `required` 속성은 브라우저 레벨에서 폼 제출 자체를 막는다. `e.preventDefault()`나 JS submit 핸들러가 실행되기 전에 먼저 동작한다. 반면 JS 검증은 더 세밀한 조건(형식, 중복 등)을 다룰 때 필요하다. 현재 코드에서 `required`가 있는 건 원본 JSX에서 딸려온 것이지만, 덕분에 두 방식의 역할 차이를 이해하게 됐다.

**공통 스타일 추출 (`css` 헬퍼)**

과거 코드는 `src/styles/common.js`에 typography, buttonBase 등 반복되는 스타일을 `css` 헬퍼로 추출해 여러 컴포넌트에서 가져다 썼다.

```js
// common.js
export const typography = {
  subtitle: css`font-size: 18px; line-height: 28px; font-weight: 600;`
};

// 컴포넌트에서
const RestaurantName = styled.h3`
  ${typography.subtitle}
`;
```

styled-components의 `css` 헬퍼는 스니펫(재사용 가능한 스타일 조각)을 JS 변수로 만들어 재사용할 수 있게 해준다. App.css의 전역 Typography 클래스가 하던 역할을 CSS-in-JS 방식으로 대체한 것이다. 현재 코드는 각 컴포넌트에 직접 작성해 중복이 있으므로, `css` 헬퍼를 활용한 공통 스타일 파일로 리팩토링할 예정이다.
