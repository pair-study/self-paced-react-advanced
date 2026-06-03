# Self-Paced React Step 1

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

1. React의 원칙과 특성 이해
   React 공식 문서의 Quick Start를 읽으며 기존에 알고 있던 React 지식을 비교하고 재정리한다.

2. HTML과 JSX의 차이점 이해
   주어진 HTML 템플릿을 `App.jsx`로 변환하는 과정을 직접 실습하며 두 문법의 차이점을 이해한다.

3. 컴포넌트 분리 기준 정립
   UI를 컴포넌트 단위로 분리하는 기준을 스스로 고민하고 세워본다.

4. CSS Module 사용 및 특성 이해
   `module.css`를 직접 사용해보고, 일반 CSS와의 차이점 및 특성을 이해한다.

---

## 📝 기능 구현 목록

**1. 컴포넌트 분리**

| 컴포넌트                | 역할                  |
| ----------------------- | --------------------- |
| `Header`                | 상단 헤더 영역        |
| `CategoryFilter`        | 카테고리 및 정렬 필터 |
| `RestaurantList`        | 음식점 목록           |
| `RestaurantDetailModal` | 음식점 상세 정보 모달 |
| `AddRestaurantModal`    | 음식점 추가 모달      |

**2. 스타일 적용**

- 전역 스타일은 `App.css`에 정의하여 `App.jsx`에서 import한다.
- 각 컴포넌트 단위 스타일은 `*.module.css`로 모듈화하여 적용한다.

---

## 📚 학습 내용

### 1. React의 원칙과 목표

React는 UI를 렌더링 하기 위한 JavaScript 라이브러리이다.

**React 설계 원칙**

1. UI를 컴포넌트 단위로 나누어 구현한다. 각 컴포넌트는 독립적이고, 순수함을 유지해야 한다.
2. Single Source of Truth로부터 나온 데이터의 일관성을 유지해야 한다.
   - SSoT는 정보 시스템과 데이터 관리에서 **모든 데이터 요소를 단 하나의 출처에서만 제어 및 수정하도록 조직하는 원칙**이다. 여러 곳에 데이터 사본을 두지 않고, 오직 하나의 신뢰할 수 있는 원본만을 가리키도록 하여 데이터 불일치와 오류를 방지한다.
3. 단방향 데이터 흐름을 유지해야 한다.
4. UI는 선언적으로 구성해야 한다.

   <차이점>
   - 바닐라 JS (명령적 UI 구성): DOM을 직접 조작해 어떻게 변해야 하는지 모든 절차를 명령한다.
   - React (선언적 UI 구성): DOM 조작 x, 상태에 따른 최종 UI의 모습만 선언한다.

   <선언적 방식의 장점>
   - 브라우저의 DOM을 조작하는 작업은 리액트의 virtual DOM에게 위임할 수 있다.
   - 코드를 보고 화면의 결과를 바로 예측할 수 있기 때문에 직관성과 가독성이 높아진다.
   - UI 렌더링에 오류가 발생하면 DOM 조작 과정을 추적하지 않고 현재 상태 데이터가 올바른지만 확인하면 되기 때문에 디버깅 및 유지보수가 쉬워진다.

### 2. React(core)와 React Renderer

React로 애플리케이션을 만들 때는 항상 두 가지를 함께 사용한다.

    - React(core): 컴포넌트 작성, 상태 관리, Virtual DOM 비교 등 환경에 독립적인 핵심 로직을 담당한다.
    - React Renderer: React(core)가 만들어낸 결과물을 실제 환경에 그리는 역할을 담당한다.

React(core)는 **무엇을 그릴지**만 계산하고, Renderer가 **어디에 어떻게 그릴지**를 결정하는 구조다.

| Renderer       | 환경              | import                                       |
| -------------- | ----------------- | -------------------------------------------- |
| `react-dom`    | 웹 브라우저 (DOM) | `import ReactDOM from "react-dom/client"`    |
| `react-native` | iOS / Android 앱  | `import { AppRegistry } from "react-native"` |
| `ink`          | CLI 터미널        | `import { render } from "ink"`               |

이 구조 덕분에 React(core)의 문법과 개념은 그대로 유지하면서, Renderer만 교체하면 웹/모바일/터미널 등 다양한 환경에서 동작하는 애플리케이션을 만들 수 있다. React Native가 처음 소개될 때 "Learn once, write everywhere"를 슬로건으로 내세운 것도 이 구조에서 비롯된 것이다.

### 3. HTML 태그 속성과 JSX 변환 시 주의점

HTML의 일부 속성은 JavaScript의 예약어와 이름이 겹치기 때문에 JSX에서는 다른 이름을 사용해야 한다.

- htmlFor는 <label>과 <input>을 연결하는 속성으로, htmlFor에 지정한 값과 id가 일치하는 입력 요소에 포커스를 연결한다. 레이블 클릭 시 연결된 입력 요소가 활성화된다.

| HTML    | JSX         | 이유                                      |
| ------- | ----------- | ----------------------------------------- |
| `for`   | `htmlFor`   | `for`는 JavaScript의 반복문 예약어        |
| `class` | `className` | `class`는 JavaScript의 클래스 선언 예약어 |

```html
<!-- HTML -->
<label for="user-input">이름</label>
<input class="input-field" id="user-input" />
```

```jsx
// JSX
<label htmlFor="user-input">이름</label>
<input className="input-field" id="user-input" />
```

---

### 4. CSS Module

CSS Module은 클래스명을 파일 단위로 자동 고유화하여 스타일이 다른 컴포넌트에 영향을 미치지 않도록 격리하는 방식이다.

일반 CSS는 클래스명이 전역으로 적용되므로 프로젝트 규모가 커질수록 클래스명 충돌이 발생할 수 있다. CSS Module을 사용하면 동일한 클래스명을 각 파일에서 독립적으로 사용할 수 있다.

**사용법**

파일명을 `*.module.css`로 작성하고, JS 파일에서 객체로 import하여 사용한다.

```css
/* Button.module.css */
.button {
  background-color: blue;
  color: white;
}
```

```jsx
// Button.jsx
import styles from "./Button.module.css";

function Button() {
  return <button className={styles.button}>클릭</button>;
}
```

빌드 후 실제 클래스명은 `Button_button__xK2f`처럼 고유한 이름으로 변환되어 다른 컴포넌트의 `.button`과 충돌하지 않는다.

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### CSS Module 적용

**1. 전역 스타일과 CSS Module의 분리 기준**

CSS Module은 클래스명에 해시값을 붙여 스코프를 격리하기 때문에, 전역으로 적용해야 하는 여백, 폰트, 색상 변수 같은 스타일에는 적합하지 않다. 모든 태그에 `styles.body`처럼 객체로 접근해야 하므로 오히려 사용이 번거로워진다.

이를 해결하기 위해 컴포넌트 단위로 격리가 필요한 스타일은 `*.module.css`로 모듈화하고, 전역 스타일은 `App.css`에 정의하여 `App.jsx` 상단에서 일반 import로 불러오는 방식으로 분리했다.

**2. 하이픈(-)이 포함된 클래스명 접근 방법**

CSS Module을 import하면 점 표기법(`styles.className`)으로 클래스에 접근한다. 언더바(`_`)는 정상 동작하지만, 하이픈(`-`)이 포함된 클래스명은 JavaScript가 빼기 연산자로 인식하여 에러가 발생한다.

JavaScript 객체에서 특수문자가 포함된 키에 접근할 때 사용하는 대괄호 표기법으로 해결할 수 있다.

```jsx
className={styles['class-name']}
```

**3. 전역 클래스와 모듈 클래스를 함께 사용하는 방법**

하나의 태그에 전역 스타일 클래스와 CSS Module 클래스를 동시에 적용해야 하는 경우, 템플릿 리터럴을 활용한다.

```jsx
className={`${styles.gnb__title} text-title`}
```

- `{ }`: JSX에서 JavaScript 표현식을 사용할 때 사용한다.
- 백틱(`` ` ``): 변수와 문자열을 혼합할 수 있는 템플릿 리터럴 문자열을 만든다.
- `${ }`: 템플릿 리터럴 안에서 JavaScript 변수나 표현식의 실제 값으로 치환한다.

**4. `htmlFor` 속성 오류**

HTML 템플릿에 아래와 같이 작성된 코드가 있었다.

```html
<label for="category text-caption">카테고리</label>
```

`htmlFor`에 연결 대상 `id`인 `"category"`와 스타일 클래스명인 `"text-caption"`이 함께 들어가 있었다. `htmlFor`는 연결할 입력 요소의 `id` 하나만 받는 속성이므로, 스타일 클래스는 `className`으로 분리해야 한다. 이 상태로는 폰트 스타일도 적용되지 않고, 라벨 클릭 시 입력 요소로 포커스도 이동하지 않는다.

```jsx
// 수정 전
<label htmlFor="category text-caption">카테고리</label>;

// 수정 후
<label htmlFor="category" className="text-caption">
  카테고리
</label>;
```

## 🛠 리팩토링

---

## 과거 코드와 비교

### 달라진 점

### 과거 코드에서 배운 점
