## 구현 결과

| | 강예령 | 남유성 |
|---|---|---|
| Step1 | [cactus-adv-1](https://github.com/pair-study/self-paced-react-advanced/tree/cactus-adv-1) , [PR #2](https://github.com/pair-study/self-paced-react-advanced/pull/2) | [hippo-adv-1](https://github.com/pair-study/self-paced-react-advanced/tree/hippo-adv-1) , [PR #1](https://github.com/pair-study/self-paced-react-advanced/pull/1) |
| Step2-1 | [cactus-adv-2.1](https://github.com/pair-study/self-paced-react-advanced/tree/cactus-adv-2.1) , [PR #4](https://github.com/pair-study/self-paced-react-advanced/pull/4) | [hippo-adv-2.1](https://github.com/pair-study/self-paced-react-advanced/tree/hippo-adv-2.1) , [PR #3](https://github.com/pair-study/self-paced-react-advanced/pull/3) |
| Step2-2 | [cactus-adv-2.2](https://github.com/pair-study/self-paced-react-advanced/tree/cactus-adv-2.2) , [PR #6](https://github.com/pair-study/self-paced-react-advanced/pull/6) | [hippo-adv-2.2](https://github.com/pair-study/self-paced-react-advanced/tree/hippo-adv-2.2) , [PR #5](https://github.com/pair-study/self-paced-react-advanced/pull/5) |
| Step2-3 |  |  |

---

## Step1
- styled-component 적용하기

### 미션 개요
- 핵심 키워드: `styled-component`

### 스터디 세션 기록
> 날짜: 2026.06.14 ~ 2026.06.16

### 공통으로 어려웠던 점

#### 1. 색상 변수 처리
하드코딩된 색상값은 반복 사용되는 항목만 `:root`의 CSS 변수로 추출해 정리했다.  
과제의 제약은 컴포넌트 스타일을 별도 CSS 파일에 남기지 않는 데 있다고 보고, 공통 토큰까지 만들지 말라는 의미로 해석하지는 않았다.  
그 결과 스타일 선언은 styled-components 안에 유지하면서도, 색상 값은 일관되게 관리할 수 있었다.

#### 2. 자식 선택자 중첩 vs 별도 컴포넌트 분리 기준
CSS Modules에서는 대부분의 요소가 클래스 단위로 분리되어 있었지만, styled-components에서는 자식 선택자를 중첩할지 별도 컴포넌트로 분리할지 직접 판단해야 했다.  
논의 끝에 아래 기준으로 정리했다.

| 기준 | 중첩 OK | 분리 권장 |
| --- | --- | --- |
| 스타일 복잡도 | 단순 (크기, 색상 1~2개) | 복잡한 스타일 블록 |
| 재사용 가능성 | 부모 없이 쓰일 일 없음 | 다른 곳에서도 쓰일 수 있음 |
| 조건부 스타일 | 없음 | props로 분기 필요 |
| 의미 전달 | 이름 필요 없음 | 이름이 코드 이해에 도움됨 |
| 선택자 정밀도 | 부모 안에 같은 태그가 더 생길 일 없음 | 같은 부모 안에 같은 태그가 더 생길 수 있음 |

### 서로 다르게 접근한 부분

#### 1. 필수 표시(`*`) 처리 — `styled(Component)` 확장 vs `props` 조건부

```tsx
// 유성 방식
const FormItem = styled.div`
  label {
    color: var(--grey-400);
  }
`;

const RequiredFormItem = styled(FormItem)`
  label::after {
    content: "*";
  }
`;

// 예령 방식
const FormItem = styled.div`
  label {
    color: var(--grey-400);
  }

  ${(props) =>
    props.$required &&
    `
      label::after {
        content: "*";
      }
    `}
`;
```

유성 방식은 의도가 명확하지만 변형이 늘수록 컴포넌트 수도 함께 늘어난다.  
예령 방식은 하나의 컴포넌트에서 변형을 관리할 수 있지만 조건이 많아지면 분기 로직이 길어진다.  
이번 미션에서는 `required`를 단순 on/off 성격의 변형으로 보고, 새 컴포넌트를 늘리기보다 `props` 조건부 방식이 더 적절하다고 정리했다.

#### 2. RestaurantList 구조 — `section` + `ul` 이중 구조 vs `ul` 단일 구조

```tsx
// 이중 구조
const ListContainer = styled.section`
  padding: 0 16px;
`;

const RestaurantUl = styled.ul``;

// 단일 구조
const List = styled.ul`
  padding: 0 16px;
`;
```

`section`은 영역의 의미를 더 분명히 보여주지만, 단순 레이아웃 목적이라면 구조만 불필요하게 늘어날 수 있다.  
이번에는 독립적인 섹션 의미보다 목록 자체가 핵심이라고 보고, 레이블 없는 `section` 대신 `ul` 단일 구조가 더 적절하다고 판단했다.

### 기술 선택과 트레이드오프
이번 미션은 CSS Modules로 작성된 스타일을 styled-components로 변환하는 과정이었다.  
CSS Modules는 클래스 이름 충돌을 막으면서도 구조가 단순하고 예측 가능하다는 장점이 있지만, 상태에 따라 스타일이 달라질 때는 클래스 조합이 늘어나기 쉽다.  
반면 styled-components는 컴포넌트와 스타일을 함께 두고 `props`로 조건부 스타일을 표현할 수 있어 응집도가 높고 읽기 흐름이 자연스럽다.  
대신 스타일을 어떤 단위로 나눌지, 단순 변형을 props로 둘지 컴포넌트로 분리할지처럼 설계 판단이 더 많이 필요했다.

| 항목 | CSS Modules | styled-components |
| --- | --- | --- |
| 스타일 작성 위치 | 별도 CSS 파일 | 컴포넌트 파일 내부 |
| 조건부 스타일 처리 | 클래스 조합 | props 기반 분기 |
| 장점 | 단순하고 예측 가능 | 응집도 높고 상태 표현이 직관적 |
| 트레이드오프 | 클래스 관리가 늘어날 수 있음 | 컴포넌트 경계와 변형 기준 설계 필요 |

<details>
<summary>확장 학습한 내용</summary>

#### 1. 빌드 타임 vs 런타임
최근 프론트엔드 스타일링은 런타임에서 처리하던 비용을 가능한 한 빌드 타임으로 옮기는 방향으로 발전하고 있다.  
정적인 스타일은 미리 계산해 두고, 런타임에는 꼭 필요한 동적 처리만 남기는 방식이 성능과 예측 가능성 면에서 유리하다.

#### 2. CSS Modules / Sass Modules
CSS Modules는 CSS를 거의 그대로 유지하면서 클래스 이름 충돌만 방지해 주는 방식이다.  
Sass Modules는 여기에 변수, 중첩 같은 Sass 문법을 더해 조금 더 편하게 스타일을 관리할 수 있다.

#### 3. styled-components / Emotion
둘 다 대표적인 런타임 CSS-in-JS 도구로, 컴포넌트 안에서 스타일을 선언하고 props 기반 분기를 처리하기 쉽다.  
대신 스타일 생성이 런타임에 일어나므로, 최근의 빌드 타임 중심 흐름과는 다소 반대편에 놓인다.

#### 4. vanilla-extract / TailwindCSS
vanilla-extract는 TypeScript 기반으로 스타일을 작성하되 결과물은 빌드 타임에 추출하는 방식이다.  
TailwindCSS는 미리 정의된 유틸리티 클래스를 조합하는 방식으로, 런타임 스타일 생성 없이 빠르게 일관된 UI를 만들 수 있다.

![프론트엔드 스타일링 흐름 정리](./images/frontend-styling-trend.png)

</details>

---

## Step2-1
- Context API 적용하기

### 미션 개요
- 핵심 키워드: `Context API`

### 스터디 세션 기록
> 날짜: 2026.06.17 ~ 2026.06.27

### 공통으로 어려웠던 점

#### 1. Context에 무엇을 올릴 것인가

Context는 props drilling을 해결하는 도구이기도 하지만, 그게 전부가 아니다. **어떤 상태를 올려야 하는가**에 대한 명확한 기준 없이 접근하면 범위가 쉽게 과해진다.

논의 끝에 아래 기준으로 정리했다.

| 상태 종류 | 적합한 위치 | 이유 |
|---|---|---|
| 서버 데이터 (`restaurants`, `addRestaurant`, `isLoading`, `error`) | Context | 여러 컴포넌트가 공유하는 데이터 도메인 |
| UI 상태 (`selectedCategory`, `clickedRestaurant`, `isAddModalOpen`) | App 로컬 state + props | 특정 화면의 인터랙션 상태로, App이 직접 자식에게 props로 내리면 충분 |

핵심은 Context가 **props 대신 쓰는 도구**가 아니라 **여러 컴포넌트가 공유하는 데이터를 올리는 통로**라는 것이다. UI 상태를 Context에 올리면, value가 바뀔 때 그 Context를 구독하는 모든 컴포넌트가 리렌더링되는 문제가 생긴다.

### 서로 다르게 접근한 부분

#### 1. Context 범위 — 서버 데이터만 vs UI 상태까지

**hippo — RestaurantsContext 하나, 서버 데이터만**

```jsx
export const RestaurantsContext = createContext(null);

export function RestaurantsProvider({ children }) {
  const { restaurants, addRestaurant, isLoading, error } = useRestaurants();
  return (
    <RestaurantsContext.Provider value={{ restaurants, addRestaurant, isLoading, error }}>
      {children}
    </RestaurantsContext.Provider>
  );
}
// App은 UI 상태(selectedCategory, clickedRestaurant, isAddRestaurantModalOpen)만 관리
```

**cactus — RestaurantContext + ModalContext 두 개**

- RestaurantContext: 서버 데이터 + 카테고리 필터 상태
- ModalContext: `clickedRestaurant`, `isAddModalOpen`, 핸들러 등 UI 상태
- App의 역할 과부하 해소를 목표로 모든 상태를 Context로 분리

스터디 이후 Context 리렌더링 특성을 고려해 ModalContext를 제거하고 UI 상태를 App 로컬로 되돌리는 방향으로 리팩토링 완료.

#### 2. 커스텀 훅 분리 — useContext 직접 호출 vs 래퍼 훅

**hippo — 컴포넌트에서 useContext 직접 호출**

```jsx
import { useContext } from "react";
import { RestaurantsContext } from "../context/RestaurantsContext.jsx";

const { addRestaurant } = useContext(RestaurantsContext);
```

**cactus — useRestaurantContext 커스텀 훅 분리 (null guard 포함)**

```jsx
export function useRestaurantContext() {
  const context = useContext(RestaurantContext);
  if (context === null) {
    throw new Error("useRestaurantContext는 RestaurantProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
}
```

hippo 방식은 단순하지만 컴포넌트마다 `useContext`와 Context 객체를 함께 import해야 한다. cactus 방식은 import가 줄고, Provider 바깥에서 사용했을 때 명시적인 에러가 발생해 디버깅이 쉽다.

### 기술 선택과 트레이드오프

React에서 상태를 관리하는 도구는 목적에 따라 나뉜다.

- **Context API** — React 내장. 컴포넌트 트리 전체에 값을 공급하는 통로. 인증, 테마처럼 앱 전반에 걸쳐 공유되는 상태에 적합하다.
- **Zustand** — 클라이언트 전역 상태 관리 라이브러리. Context보다 리렌더링 최적화가 쉽고 설정이 간단하다.
- **TanStack Query** — 서버 상태 전용. fetching, caching, 동기화를 자동으로 처리한다.

이번 미션에서 Context에 올린 값(`newRestaurants`, `registerRestaurant`, `isLoading`, `error`)은 전부 서버 상태다. Context API 사용이 조건이 아니었다면, `useRestaurants` 훅을 TanStack Query로 대체하는 것이 더 자연스러운 선택이었을 것이다. 캐싱, 로딩/에러 상태, 재시도 처리를 별도로 구현하지 않아도 되기 때문이다.

Zustand와 TanStack Query는 이후 미션(Step2-2, Step2-3)에서 직접 적용하며 다룬다.

  ---

## Step2-2
- Zustand 적용하기

### 미션 개요
- 핵심 키워드: `Zustand`

### 스터디 세션 기록
> 날짜: 2026.06.24 ~ 2026.06.28

### 공통으로 어려웠던 점

Context API에서 Zustand로 마이그레이션할 때 기존 파일(`useRestaurants`, Context, Provider)을 어떻게 재배치할지 판단하는 것이 어려웠다. 중복 작성이 아니라 역할에 맞는 위치로 이동하는 것임을 파악하는 과정이 필요했다.

`useEffect`를 store 안에서 쓸 수 없어 fetch 타이밍 제어를 어느 컴포넌트에 둘지도 공통으로 고민한 지점이었다.

### 서로 다르게 접근한 부분

#### 1. Store 구조 — 단일 store vs 분리

**hippo — useRestaurantStore 하나, partialize로 persist 범위 제어**

```js
const useRestaurantStore = create(
  persist(
    (set, get) => ({
      restaurants: [],
      selectedCategory: "전체",
      // ...
    }),
    {
      name: "restaurant-storage",
      partialize: (state) => ({ selectedCategory: state.selectedCategory }),
    }
  )
);
```

**cactus — 서버 데이터와 UI 상태를 별도 store로 분리**

- `useRestaurantStore`: 서버 데이터(`newRestaurants`, `isLoading`, `error`, 액션)
- `useFilterStore`: 카테고리 필터 상태, sessionStorage persist 적용

단일 store + `partialize`는 파일 수가 적고 한 곳에서 전체 상태를 파악할 수 있다. store 분리는 관심사가 명확하지만 파일과 import가 늘어난다. 현재 규모에서는 두 방식 모두 유효하다.

#### 2. fetchRestaurants 호출 위치 — co-location vs App 집중

**hippo — 데이터가 필요한 RestaurantList에서 직접 호출**

```js
// RestaurantList.jsx
const fetchRestaurants = useRestaurantStore((state) => state.fetchRestaurants);

useEffect(() => {
  fetchRestaurants();
}, [fetchRestaurants]);
```

**cactus — App.jsx에서 한 번 호출**

```js
// App.jsx
const fetchRestaurants = useRestaurantStore((state) => state.fetchRestaurants);

useEffect(() => {
  fetchRestaurants();
}, [fetchRestaurants]);
```

- co-location은 컴포넌트가 자신의 데이터 의존성을 직접 선언해 명시적이지만, 순수 Zustand에서는 마운트마다 호출되지 않도록 guard 로직을 별도로 관리해야 한다.
- App에서 한 번 호출하면 타이밍 제어가 단순해지지만 `RestaurantList`의 데이터 의존성이 코드에서 보이지 않는다.

React Query를 도입하면 중복 요청이 자동으로 처리되므로 co-location이 더 자연스러운 선택이 된다. 다음 미션에서 React Query를 써보고 다시 판단하기로 했다.

### 기술 선택과 트레이드오프

Context API는 value 전체가 바뀌면 구독하는 모든 컴포넌트가 리렌더링된다. 상태를 잘게 쪼개거나 메모이제이션하지 않으면 불필요한 리렌더링이 발생하는 구조다.

Zustand는 selector로 구독한 값이 바뀔 때만 리렌더링된다. `restaurants`가 바뀌어도 `addRestaurant` 액션만 구독하는 컴포넌트는 리렌더링되지 않는다. Provider 없이 어디서든 import해서 사용할 수 있어 설정도 간단하다.

다만 이번 미션에서 Zustand store에 올린 서버 상태(`newRestaurants`, `isLoading`, `error`)는 Zustand가 직접 처리해주지 않는 영역이다. fetching, caching, 재시도를 직접 구현해야 했다. 서버 상태 관리에는 TanStack Query가 더 적합한 도구다.
