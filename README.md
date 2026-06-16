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

### 자식 선택자 중첩 — 언제 쓰고 언제 피할까

styled-components는 Sass처럼 중첩 선택자를 지원하지만, "항상 피해야 한다"기보다는 **상황에 따라 다르다**가 정확하다.

**중첩이 괜찮은 경우** — 부모와 항상 함께 쓰이는 단순 HTML 요소일 때는 별도 컴포넌트로 분리하는 게 오히려 과도한 추상화다.

```js
// img는 Category 없이 독립적으로 쓰일 일이 없으므로 중첩이 합리적
const Category = styled.div`
  background: var(--lighten-color);

  img {
    width: 36px;
    height: 36px;
  }
`;
```

`&:hover`, `&:focus` 같은 가상 선택자도 중첩이 자연스럽고 관용적인 방식이다.

**중첩을 피하는 게 나은 경우** — 자식 요소가 의미 있는 스타일을 가지거나, 독립적으로 재사용될 가능성이 있을 때다.

```js
// h3/p는 각자 의미 있는 스타일을 가지므로 분리
const RestaurantName = styled.h3`
  font-size: 18px;
  font-weight: 600;
`;

const RestaurantDescription = styled.p`
  padding-top: 8px;
  -webkit-line-clamp: 2;
`;
```

**판단 기준 요약**

| | 중첩 OK | 분리 권장 |
|---|---|---|
| 스타일 복잡도 | 단순 (크기, 색상 1-2개) | 복잡한 스타일 블록 |
| 재사용 가능성 | 부모 없이 쓰일 일 없음 | 다른 곳에서도 쓰일 수 있음 |
| 조건부 스타일 | 없음 | props로 분기 필요 |
| 의미 전달 | 이름 필요 없음 | 이름이 코드 이해에 도움됨 |

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

### 자식 태그 선택자 → 별도 styled 컴포넌트로 분리

의미 있는 콘텐츠 요소에 자식 태그 선택자를 사용하던 방식을 각각 별도의 styled 컴포넌트로 분리했다.

```js
// before — 자식 태그 선택자 사용
const Info = styled.div`
  h3 { font-size: 18px; font-weight: 600; }
  p { padding-top: 8px; }
`;

// after — 각각 명시적인 컴포넌트로 분리
const Info = styled.div`...`;
const RestaurantName = styled.h3`font-size: 18px; font-weight: 600;`;
const RestaurantDescription = styled.p`padding-top: 8px;`;
```

적용 파일: `CategoryFilter`, `RestaurantList`, `AddRestaurantModal`

### RestaurantList 시맨틱 구조 개선

`styled.section`이 일반 `<ul>`을 감싸는 이중 구조를 `styled.ul`로 단일화했다.

```jsx
// before — section > ul > li 이중 구조
const List = styled.section`...`;
return (
  <List>
    <ul>
      <Restaurant /> {/* styled.li */}
    </ul>
  </List>
);

// after — ul > li 단일 구조
const List = styled.ul`...`;
return (
  <List>
    <Restaurant /> {/* styled.li */}
  </List>
);
```

### CSS 변수 누락 색상 추가 및 하드코딩 제거

코드에 하드코딩되어 있던 색상값을 CSS 변수로 정의하고 교체했다.

```css
/* App.css에 추가 */
--grey-50: #fcfcfd;   /* 헤더 타이틀 텍스트 색상 */
--grey-150: #e9eaed;  /* 목록 구분선 색상 */
```

| 파일 | before | after |
|---|---|---|
| `Header.jsx` | `color: #fcfcfd` | `color: var(--grey-50)` |
| `CategoryFilter.jsx` | `border: 1px solid #d0d5dd` | `border: 1px solid var(--grey-200)` |
| `RestaurantList.jsx` | `border-bottom: 1px solid #e9eaed` | `border-bottom: 1px solid var(--grey-150)` |

이 작업의 배경 개념은 **Design Token(디자인 토큰)** 이다. 색상, 폰트 크기, 간격 같은 시각적 결정에 이름을 붙인 값으로 추상화한 것으로, `App.css`의 `:root` 블록이 바로 그 역할을 한다.

- **단일 진실 공급원** — 브랜드 색상이 바뀌면 변수 한 줄만 수정하면 전체에 반영된다.
- **색상 분열 방지** — 변수 체계 없이 하드코딩하면 개발자마다 "비슷한 회색"을 다르게 써서 미묘하게 다른 색상이 혼재하게 된다. 이번에 발견한 `#fcfcfd`, `#e9eaed`가 그 사례이다.
- **디자인-개발 소통** — 디자이너가 "grey-200 사용"이라고 전달하면 개발자는 `var(--grey-200)`을 그대로 쓴다. 값이 아닌 이름으로 소통하므로 오역이 줄어든다.
- **의미 전달** — `#ec4a0a`는 어떤 색인지 알 수 없지만 `--primary-color`는 의도가 명확하다.
