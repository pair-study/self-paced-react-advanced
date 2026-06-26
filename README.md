# 전역상태관리 - Context API

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

- 현재 코드에서 props drilling이 어디서 발생하는지 직접 찾아보고, Context API가 이를 어떻게 해소하는지 체감한다.
- `createContext`, `Provider`, `useContext`의 역할과 데이터 흐름을 이해하고, 세 요소가 어떻게 연결되는지 스스로 설명할 수 있는 수준으로 익힌다.
- Context API를 쓰는 것이 적절한 상황과 그렇지 않은 상황(trade-off)을 이해하고, 그 판단 근거를 PR에 직접 서술한다.
- 컴포넌트와 Context 간의 관계를 도식화해보며 데이터 흐름을 시각적으로 이해하는 경험을 쌓는다.

## 📝 기능 구현 목록

- `RestaurantContext`, `ModalContext` 생성
  - 레스토랑 데이터 관련 상태와 모달 관련 상태를 각각 Context로 분리
- `App.jsx`를 Provider 구조로 전환하고 `AppContent` 컴포넌트 분리
- 각 컴포넌트에서 props를 제거하고 Context 직접 소비로 전환
  - `CategoryFilter`, `RestaurantList`, `RestaurantDetailModal`, `AddRestaurantModal`
- `useRestaurantContext`, `useModalContext`를 별도 파일로 분리

## 📚 학습 내용

### 1. props drilling

props drilling은 데이터가 필요하지 않은 중간 컴포넌트들이 아래로 전달하기 위해 props를 받아야 하는 상황이다. 컴포넌트 트리가 깊어질수록 불필요한 의존이 쌓여 유지보수가 어려워진다.

### 2. Context API의 세 요소

| 요소                     | 역할                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `createContext()`        | 데이터를 담을 통로(Context 객체)를 만든다. 별도 파일에서 한 번만 생성하고 export한다 |
| `<Provider value={...}>` | 감싼 하위 컴포넌트 전체에 데이터를 공급한다                                          |
| `useContext(Context)`    | 필요한 컴포넌트에서 중간을 거치지 않고 직접 데이터를 꺼낸다                          |

### 3. Context 분리 기준

"이 상태가 바뀌면 어떤 컴포넌트가 영향을 받는가"를 기준으로 나눴다.

- `RestaurantContext` — 레스토랑 목록, 카테고리 필터처럼 데이터 자체와 관련된 상태
- `ModalContext` — 모달 열림/닫힘, 선택된 레스토랑처럼 UI 상태

`handleRestaurantClick`은 RestaurantList에서 호출되지만 `clickedRestaurant`(모달 상태)을 바꾸기 때문에 ModalContext에 뒀다. 함수의 귀속은 어디서 호출하느냐가 아니라 어떤 상태를 바꾸느냐로 결정했다.

### 4. Provider 감싸는 순서

ModalContext 내부에서 `useRestaurantContext()`로 `registerRestaurant`을 빌려오기 때문에, `RestaurantProvider`가 바깥에서 먼저 감싸야 한다.

```jsx
<RestaurantProvider>
  {" "}
  {/* 바깥 */}
  <ModalProvider>
    {" "}
    {/* 안쪽 — RestaurantContext에 의존 */}
    <AppContent />
  </ModalProvider>
</RestaurantProvider>
```

### 5. AppContent 분리 이유

Provider 안에 있는 컴포넌트만 Context를 소비할 수 있다. App 자체가 Provider를 렌더링하기 때문에 App에서 `useContext`를 호출하면 Provider 바깥에서 호출하는 것이 되어 에러가 난다. JSX를 `AppContent`로 분리해 Provider 안에 넣어야 Context를 정상적으로 소비할 수 있다.

### 6. Context API와 컴포넌트 관계 도식화

![Context API 관계 도식화](02-state-management-tools/2.1-ContextAPI/assets/context-diagram.svg)

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 1. `props drilling` 없이 Context를 도입한 이유 — App의 역할 과부하

코드를 보면서 props drilling을 찾으려 했지만 찾을 수가 없었다. 현재 트리가 얕아서 App의 모든 자식이 App에서 직접 props를 받고 있었고, 중간에 **그냥 전달만 하는** 컴포넌트가 없었다.

대신 다른 문제가 보였다. App.jsx가 상태 3개, 핸들러 6개, 필터 계산 로직까지 전부 들고 있었다. 컴포넌트 하나가 너무 많은 역할을 하고 있는 상태였다.

Context API가 props drilling만을 해결하기 위한 도구가 아니라는 걸 알았다. **관심사를 분리해 App을 가볍게 만드는 것**도 Context를 도입하는 충분한 이유가 된다. 코드가 당장 문제없어 보여도, 역할이 집중된 컴포넌트는 나중에 유지보수 부담이 된다.

### 2. 두 Context에 걸친 함수의 귀속 기준

`handleFormSubmit`은 AddRestaurantModal에서 호출되는 함수라 ModalContext에 두는 게 자연스러워 보였다. 그런데 내부에서 `registerRestaurant`을 호출해야 하는데, 이 함수는 서버에 레스토랑을 추가하고 목록을 다시 불러오는 역할로 RestaurantContext에 있다.

**모달 관련 함수가 레스토랑 데이터 관련 함수를 필요로 하는 상황**이라, ModalContext에서 `useRestaurantContext()`로 `registerRestaurant`만 빌려오는 단방향 의존 구조로 해결했다.

> **순환 의존** — A가 B를 참조하고 B도 A를 참조하는 상태. 두 파일이 서로를 import하면 앱이 정상적으로 초기화되지 않는다. 의존 방향을 ModalContext → RestaurantContext 단방향으로 고정해 이 문제를 피했다.

함수의 귀속은 **어디서 호출하느냐**가 아니라 **어떤 상태를 바꾸느냐**로 결정된다는 것도 함께 배웠다. `handleRestaurantClick`은 RestaurantList에서 호출되지만 `clickedRestaurant`(모달 상태)을 바꾸기 때문에 ModalContext에 뒀다.

### 3. `react-refresh` 경고와 훅 파일 분리

Context 파일에서 Provider(컴포넌트)와 커스텀 훅(일반 함수)을 함께 export하면 `react-refresh/only-export-components` 경고가 발생한다.

> **핫 리로드** — 파일을 저장했을 때 페이지 전체를 새로고침하지 않고 변경된 컴포넌트만 교체해 업데이트하는 기능. React Fast Refresh는 컴포넌트 export만 있는 파일에서 핫 리로드를 안정적으로 처리하는데, 일반 함수가 섞이면 어떤 것을 리로드해야 할지 판단하지 못해 경고가 발생한다.

처음에는 `eslint-disable` 주석으로 경고를 억제했다가, 실무에서는 파일을 분리하는 것이 일반적이라는 걸 알고 `useRestaurantContext.js`, `useModalContext.js`로 분리했다. Context 파일은 **Provider 컴포넌트만 export**하고, 훅 파일은 **`useContext`를 감싸는 함수만 export**하는 구조다.

### 4. AppContent 분리 후 남아있던 props 중복과 useContext 직접 소비

AppContent를 분리할 때 기존 App.jsx의 JSX를 그대로 옮기면서, Context에서 꺼낸 값들을 각 컴포넌트에 다시 props로 넘겼다. Context는 만들었지만 여전히 AppContent → CategoryFilter, AppContent → RestaurantList로 props가 전달되는 구조였다. 미션 요구사항인 **"props로 똑같은 데이터를 전달하지 않는다"** 를 만족하지 못한 상태였다.

Context의 목적은 필요한 컴포넌트가 직접 꺼내 쓰는 것이기 때문에, AppContent에서 props를 넘기는 대신 각 컴포넌트 안에서 `useRestaurantContext()`, `useModalContext()`를 직접 호출하도록 수정했다.

이 과정에서 `useContext(Context)` 사용 방식이 헷갈렸는데, `useRestaurantContext()`도 결국 내부에서 `useContext(RestaurantContext)`를 호출하는 커스텀 훅이라는 걸 알았다. `useRestaurants()`로 서버 데이터를 꺼내오는 것과 같은 패턴이다. 컴포넌트 함수 안에서 호출하고, 반환값을 구조 분해해 쓰면 된다.

## 🛠 리팩토링

### 1. Provider를 main.jsx로 이동하고 AppContent 제거

`main.jsx`에서 Provider를 감싸도록 변경하고, 불필요해진 `AppContent.jsx`를 제거했다.

### 2. createContext(null) + 방어 로직 추가

`createContext(null)`로 초기화하고, 커스텀 훅 안에서 Provider 바깥 사용 시 에러를 던지도록 추가했다.

### 3. Header props 제거하고 Context 직접 소비

`App.jsx`에서 `Header`에 `onClick={handleAddModalOpen}`을 props로 넘기고 있었다. 다른 컴포넌트들은 전부 Context에서 직접 꺼내는데 Header만 props를 받고 있어 일관성이 없었다. Header는 앱 전역에서 단 하나만 존재하고 항상 같은 역할을 하기 때문에, `useModalContext()`에서 직접 `handleAddModalOpen`을 꺼내도록 수정했다.

## 과거 코드와 비교

### 달라진 점

**Provider 위치와 AppContent 분리**

과거 코드는 Provider를 `main.jsx`에서 감쌌다. App이 Provider 안에 있어서 App에서 바로 Context를 소비할 수 있었고, AppContent 분리가 불필요했다.

현재 코드는 Provider를 App.jsx 안에 뒀다. Provider 바깥에서는 Context를 소비할 수 없기 때문에 JSX를 AppContent로 별도 분리해야 했다.

`main.jsx`에 Provider를 두는 방식이 더 깔끔하다. App.jsx는 레이아웃 구조에 집중하고, Provider는 앱 진입점에서 선언적으로 관리하는 것이 역할 분리가 명확하다. AppContent라는 추가 파일도 필요 없어진다. **리팩토링에 반영했다.**

**훅 파일 위치**

과거 코드는 커스텀 훅을 `src/hooks/` 폴더에 뒀다. 현재 코드는 `src/context/` 안에 뒀다.

`src/hooks/`는 모든 커스텀 훅을 한 곳에서 찾을 수 있다는 장점이 있고, `src/context/`는 Context와 훅을 한 묶음으로 관리해 응집도가 높다는 장점이 있다. 어느 쪽이 더 옳다고 보기 어렵고 팀 컨벤션에 따라 다를 수 있어, Context에 강하게 종속된 훅이라는 점에서 `src/context/`를 그대로 유지하기로 했다.

### 과거 코드에서 배운 점

**`createContext(null)`과 방어 로직**

과거 코드는 `createContext()`에 초기값을 넣지 않았는데, 리뷰에서 `createContext(null)`로 선언하는 것을 권장한다는 피드백을 받았다.

`createContext()`에 아무것도 넣지 않으면 Provider로 감싸지 않은 컴포넌트에서 사용해도 조용히 기본값(`undefined`)으로 동작해 문제를 놓칠 수 있다. `null`로 초기화하고 커스텀 훅 안에서 방어 로직을 추가하면 Provider 바깥에서 사용했을 때 명시적인 에러가 발생해 디버깅이 쉬워진다.

```jsx
export function useRestaurantContext() {
  const context = useContext(RestaurantContext);

  if (context === null) {
    throw new Error(
      'useRestaurantContext는 RestaurantProvider 내부에서만 사용할 수 있습니다.',
    );
  }

  return context;
}
```

**리팩토링에 반영했다.**
