# styled-components를 적용해서 리팩토링하기

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

1. CSS Modules 방식과 CSS-in-JS 방식의 차이를 직접 마이그레이션하며 체감한다.
2. styled-components의 기본 사용법(기본 스타일링, 중첩 선택자, 컴포넌트 확장)을 익힌다.
3. 기존 코드의 구조를 유지하면서 스타일링 방식만 교체하는 리팩토링 경험을 쌓는다.

---

## 📝 기능 구현 목록

- [x] 모든 `.module.css` 파일을 제거하고 styled-components로 전환
- [x] `Header`, `CategoryFilter`, `Modal`, `RestaurantList`, `RestaurantDetailModal`, `AddRestaurantModal` 전 컴포넌트에 styled-components 적용
- [x] `App.css`는 전역 리셋 및 CSS 변수 정의 용도로만 유지
- [x] CSS 변수(`var(--primary-color)` 등)를 styled-components 내부에서 활용
- [x] `styled(Component)` 확장 패턴을 활용해 필수 입력 항목(`RequiredFormItem`) 스타일 분리

---

## 📚 학습 내용

### styled-components란?

CSS-in-JS 라이브러리로, JavaScript 파일 안에서 템플릿 리터럴 문법으로 CSS를 작성하고 이를 React 컴포넌트에 직접 연결하는 방식이다.

```js
const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
`;
```

### CSS Modules vs styled-components trade-off

| | CSS Modules | styled-components |
|---|---|---|
| 스타일 위치 | 별도 `.module.css` 파일 | 컴포넌트 파일 내부 |
| 스코프 | 클래스명 해시로 자동 격리 | 컴포넌트 단위로 격리 |
| 동적 스타일링 | className 조건부 변경 필요 | props로 직접 처리 가능 |
| 가독성 | HTML 구조와 스타일 파일 분리 | 한 파일에서 구조+스타일 파악 가능 |
| 번들 크기 | 별도 런타임 없음 | styled-components 런타임 포함 |

### 자식 선택자 중첩

styled-components는 Sass처럼 중첩 선택자를 지원한다.

```js
const Category = styled.div`
  background: var(--lighten-color);

  img {
    width: 36px;
    height: 36px;
  }
`;
```

### 컴포넌트 확장 (`styled(Component)`)

기존 styled-component를 상속해서 스타일을 추가할 수 있다.

```js
const FormItem = styled.div`...`;

const RequiredFormItem = styled(FormItem)`
  label::after {
    content: "*";
    color: var(--primary-color);
  }
`;
```

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 필수/선택 폼 항목의 `*` 표시 처리

원본 CSS Modules에서는 `.formItem--required` 클래스를 조건부로 붙이는 방식으로 필수 항목에만 `*`를 표시했다.

styled-components로 전환할 때 `label::after { content: "*" }`를 `FormItem`에 바로 넣으면 모든 항목에 `*`가 붙는 문제가 생긴다.

`styled(FormItem)`으로 확장한 `RequiredFormItem`을 별도로 만들어서 필수 항목(카테고리, 이름)에만 적용하는 방식으로 해결했다.

---

## 🛠 리팩토링

### 컴포넌트 파일 구조 단순화

기존에는 컴포넌트마다 폴더를 만들어 `ComponentName/ComponentName.jsx` + `ComponentName.module.css` 구조였다. styled-components 전환 후 CSS 파일이 사라지면서 폴더 없이 `ComponentName.jsx` 단일 파일로 정리했다.

```
before:
components/
  Header/
    Header.jsx
    Header.module.css

after:
components/
  Header.jsx
```
