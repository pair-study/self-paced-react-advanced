# 서버상태관리 - TanStack Query

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

- 서버 상태와 클라이언트 상태를 명확히 구분하고, 각각에 맞는 도구를 선택하는 기준을 세운다.
- `useQuery`, `useMutation`을 직접 마이그레이션하며 TanStack Query의 핵심 동작 방식을 손에 익힌다.
- 낙관적 업데이트를 구현하며 UX와 데이터 정합성 사이의 트레이드오프를 이해한다.

## 📝 기능 구현 목록

- TanStack Query 설치 및 `QueryClientProvider` 설정
- `RestaurantList` — `useQuery`로 서버 데이터 조회
- `AddRestaurantModal` — `useMutation` + 낙관적 업데이트 적용
- `App.jsx` — `fetchRestaurants` `useEffect` 제거
- `useRestaurantStore` 제거
- TanStack Query Devtools 추가

## 📚 학습 내용

### 1. 서버 상태 vs 클라이언트 상태

|  | 클라이언트 상태 | 서버 상태 |
| --- | --- | --- |
| 예시 | 모달 열림, 선택된 카테고리 | 식당 목록, 유저 정보 |
| 소유자 | 내 앱 | 서버 |
| 특징 | 내가 바꾸면 바뀜 | 다른 사용자가 바꿀 수 있음 |
| 관리 도구 | useState, Zustand | TanStack Query |

Zustand로 `fetchRestaurants`를 관리한 건 클라이언트 상태 도구로 서버 상태를 억지로 다룬 것이다. TanStack Query는 서버 상태만을 위해 만들어진 도구다.

### 2. QueryClient

TanStack Query의 캐시 저장소. `new QueryClient()`로 인스턴스를 한 번 생성하고, `QueryClientProvider`로 앱 전체에 공유한다. 컴포넌트에서는 `useQueryClient()` 훅으로 그 인스턴스를 참조한다.

| 메서드 | 역할 |
| --- | --- |
| `cancelQueries` | 진행 중인 fetch 요청 취소 |
| `getQueryData` | 현재 캐시에서 데이터 읽기 |
| `setQueryData` | 캐시 데이터를 직접 덮어쓰기 |
| `invalidateQueries` | 캐시를 낡았다고 표시 → 자동 refetch |

### 3. Query Key

캐시의 주소. 어떤 데이터인지 식별하는 배열이다.

```js
["restaurants"]                      // 식당 전체 목록
["restaurants", id]                  // 특정 식당
["restaurants", { category: "한식" }] // 필터된 목록
```

key가 같으면 같은 캐시를 본다. `invalidateQueries`에서 같은 key를 써야 캐시 무효화가 정확히 일어난다.

쿼리 종류가 많아지면 팩토리 패턴으로 관리한다. 각 케이스를 함수로 뽑아두면 키를 일관성 있게 생성하고 `invalidateQueries`에서도 동일한 참조를 사용할 수 있다.

```js
export const restaurantKeys = {
  all: ["restaurants"],
  detail: (id) => ["restaurants", id],
  list: (filters) => ["restaurants", "list", filters],
};

// 사용 예
queryClient.invalidateQueries({ queryKey: restaurantKeys.all }); // ["restaurants"]로 시작하는 캐시 전부 무효화
```

### 4. useQuery

데이터 읽기(GET). `queryFn`이 반환하는 값이 `data`에 들어온다. `queryKey`는 캐시 이름표일 뿐 `data`와 무관하다.

```js
const { data, isLoading, error } = useQuery({
  queryKey: ["restaurants"],
  queryFn: getRestaurants,
});
```

Zustand에서 직접 짰던 `isLoading`, `error`, try/catch를 자동으로 처리한다. 컴포넌트가 마운트되면 자동으로 fetch를 실행하므로 `App.jsx`의 `useEffect` 트리거가 필요 없어진다.

`error`는 문자열이 아닌 `Error` 객체다. Zustand에서는 `set({ error: "음식점 목록을 불러오지 못했습니다." })`로 문자열을 직접 저장했지만, TanStack Query는 던져진 예외 객체를 그대로 넘기므로 `error.message`로 메시지를 꺼내야 한다.

### 5. useMutation

데이터 변경(POST/PUT/DELETE). `mutate`는 요청을 보내는 트리거이고, 성공/실패 처리는 콜백 옵션으로 위임한다.

```
mutate({ ... })     → 서버에 요청을 보내는 트리거

onMutate: () => {}  → 요청 보내기 직전 실행
onError: () => {}   → 요청 실패 시 실행
onSettled: () => {} → 성공/실패 상관없이 끝나면 실행
```

`invalidateQueries`로 캐시를 무효화하면 `useQuery`가 자동으로 최신 데이터를 다시 가져온다.

### 6. 낙관적 업데이트

서버 응답을 기다리지 않고 UI를 먼저 바꾸는 것. 성공할 거라고 낙관하고, 실패하면 롤백한다.

```
일반:           클릭 → 요청 → (대기) → 응답 → UI 업데이트
낙관적 업데이트: 클릭 → UI 먼저 업데이트 → 요청 → 실패하면 롤백
```

```js
onMutate: async (newRestaurant) => {
  await queryClient.cancelQueries({ queryKey: ["restaurants"] }); // 진행 중인 refetch 취소
  const previous = queryClient.getQueryData(["restaurants"]);     // 롤백용 현재 캐시 저장
  queryClient.setQueryData(["restaurants"], (old) => [...old, newRestaurant]); // 캐시 먼저 업데이트
  onClose();
  return { previous };
},
onError: (err, _, context) => {
  queryClient.setQueryData(["restaurants"], context.previous); // 롤백
},
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ["restaurants"] }); // 서버 데이터로 최종 동기화
},
```

### 7. "여러 사용자, 주기적 업데이트 환경"에서 달라지는 것

Zustand에서는 `fetchRestaurants`가 마운트 시 한 번만 실행된다. 다른 사용자가 식당을 추가해도 내 화면은 새로고침 전까지 변하지 않는다.

TanStack Query는 기본적으로 탭 포커스, 네트워크 재연결 시 자동으로 최신 데이터를 가져온다(`refetchOnWindowFocus: true`). `refetchInterval`을 추가하면 주기적 폴링도 가능하다.

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 1. Zustand store 파일이 사라지고 어디서 상태를 관리하는가

Zustand는 상태와 액션을 store 파일에 모아두는 구조였다. TanStack Query로 전환하면서 store 파일이 없어지니, 데이터를 어디서 관리하는지 처음에 명확하지 않았다.

`QueryClient`가 캐시 저장소 역할을 대신하고, 각 컴포넌트에서 `useQuery`/`useMutation`을 직접 쓰면 된다. `useRestaurantStore`에 있던 것들이 전부 서버 상태였기 때문에 파일 자체가 사라지는 것이 맞다. 클라이언트 상태(`clickedRestaurant`, `isAddModalOpen`)는 `useState`로, 카테고리 필터는 Zustand persist로 그대로 유지했다.

### 2. queryFn에 함수 참조를 넘기는 것과 호출 결과를 넘기는 것의 차이

```js
queryFn: getRestaurants        // 함수 자체를 넘김 — TanStack Query가 내부적으로 호출
queryFn: () => getRestaurants() // 화살표 함수로 감싸서 호출
```

둘의 결과는 동일하다. 인자를 넘겨야 할 때는 `() => getRestaurants(param)` 형태가 필요하고, 그렇지 않으면 `queryFn: getRestaurants`가 더 간결하다.

### 3. 로딩 중 data가 undefined일 때의 처리

`useQuery`는 fetch가 완료되기 전까지 `data`가 `undefined`다. 바로 `.filter()`를 호출하면 에러가 난다. `??`로 방어한다.

```js
(newRestaurants ?? []).filter((r) => r.category === selectedCategory)
// undefined이면 빈 배열, 값이 있으면 그대로 사용
```

### 4. mutate에 await를 쓸 수 없는 이유와 onMutate/onError/onSettled의 역할

Zustand 액션은 `async` 함수에 `await`를 쓸 수 있어서, `useMutation`의 `mutate`도 같은 방식으로 다루려 했다. 하지만 `mutate`는 Promise를 반환하지 않아서 `await`이 동작하지 않고, `try/catch`도 잡히지 않는다.

성공/실패 처리는 `useMutation`의 콜백 옵션으로 위임하는 것이 올바른 방식이다. 각 콜백은 실행 시점이 다르다.

```
onMutate  → 요청 보내기 직전 (낙관적 업데이트, 모달 닫기)
onError   → 요청 실패 시 (롤백, 에러 알림)
onSettled → 성공/실패 상관없이 끝나면 (서버 데이터로 최종 동기화)
```

`queryClient`의 메서드(`cancelQueries`, `getQueryData` 등)는 Promise를 반환하므로 `await` 가능하다. `mutate`와 혼동하지 않아야 한다.

### 5. new QueryClient()와 useQueryClient()의 차이

`main.jsx`에서 `useQueryClient()`를 쓰는 것처럼 보여서, `AddRestaurantModal`에서도 같은 것을 중복 선언하는 건지 헷갈렸다.

`new QueryClient()`는 인스턴스를 생성하는 것이고, `useQueryClient()`는 `QueryClientProvider`를 통해 공유된 그 인스턴스를 컴포넌트 안에서 참조하는 훅이다. Zustand의 `create()`로 store를 한 번 만들고, 컴포넌트에서 `useRestaurantStore()`로 참조하는 구조와 같은 원리다.

### 6. cancelQueries에 await가 필요한 이유

낙관적 업데이트에서 `cancelQueries`가 필요한 이유는 이해했지만, 왜 `await`를 써야 하는지 처음에 명확하지 않았다.

취소 요청을 보내고 실제 취소가 완료될 때까지 기다려야 하기 때문이다. `await` 없이 바로 `setQueryData`로 넘어가면, 취소 안 된 refetch 응답이 나중에 도착해서 낙관적으로 업데이트한 캐시를 이전 값으로 덮어쓸 수 있다.

### 7. setQueryData에 함수를 넘기는 문법

`setQueryData`의 두 번째 인자로 함수를 넘기면 현재 캐시값을 인자로 받는다는 것을 처음에 몰랐다.

```js
queryClient.setQueryData(["restaurants"], (old) => [...old, newRestaurant])
// old: 현재 캐시에 있는 식당 배열
// 리턴값: 새로운 캐시값 (기존 배열 + 새 식당)
```

객체를 직접 넘길 수도 있지만, 이전 값을 참조해야 할 때는 함수 형태를 써야 한다.

### 8. onError 콜백의 세 인자

`onError`가 세 개의 인자를 자동으로 받는다는 것을 처음에 몰랐고, 두 번째 인자를 `_`로 표시하는 이유도 이해가 안 됐다.

```js
onError: (err, variables, context) => {
  // err: 발생한 에러 객체
  // variables: mutate()에 넘긴 값 (여기서는 newRestaurant)
  // context: onMutate가 return한 값 (여기서는 { previous })
}
```

`variables`가 필요 없을 때 `_`로 표시하는 것은 "이 자리 인자는 사용하지 않겠다"는 관례다. 자리를 건너뛸 수 없기 때문에 `_`로 명시해두는 것이다.

`_` 대신 `newRestaurant`로 써도 동작은 완전히 동일하다. `_`를 쓰는 이유는 해당 값을 사용하지 않는다는 의도를 명시적으로 표현하기 위해서다. `newRestaurant`로 쓰면 코드를 읽는 사람이 어디서 쓰이는지 찾아볼 수 있지만, `_`이면 바로 "사용하지 않는 인자"임을 알 수 있다. 실패 시 어떤 값을 추가하려다 실패했는지 에러 메시지에 담는 것처럼, 해당 값이 필요한 경우에는 명시적인 이름을 쓰면 된다.

### 9. 낙관적 업데이트에서 UI 반영과 서버 응답의 순서

UI는 POST(201) 응답보다도 먼저 바뀐다. `onMutate`가 `mutationFn`보다 먼저 실행되고, `mutationFn` 안에서 실제 네트워크 요청이 일어나기 때문이다.

```
mutate 호출
  └─ onMutate → setQueryData → UI 즉시 반영 → 모달 닫힘
  └─ mutationFn → POST 요청 → 201 응답 대기 중...
       ↓ (201 도착)
  └─ onSettled → invalidateQueries → GET 요청 → 200 응답 → 캐시 최종 동기화
```

### 10. useState 리렌더링 비용이 문제없는 이유

React는 리렌더링과 실제 DOM 업데이트를 분리한다. `setState` 호출 시 Virtual DOM을 재계산하고, 이전 Virtual DOM과 비교(diffing)해서 실제로 바뀐 부분만 Real DOM에 반영한다. `clickedRestaurant`, `isAddModalOpen`처럼 사용자 액션에 반응하는 단순한 상태는 바뀔 때마다 리렌더링이 일어나는 게 맞고, 이 정도 빈도는 비용이 낮다. 리렌더링이 문제가 되는 건 무거운 계산이 있는 컴포넌트가 불필요하게 자주 리렌더링될 때다.

## 🛠 리팩토링

### 1. QUERY_KEY 상수 파일 분리

`RestaurantList`와 `AddRestaurantModal` 두 곳에서 `["restaurants"]` 문자열을 직접 반복 사용하고 있었다. 문자열을 여러 곳에서 직접 쓰면 오타가 발생해도 런타임 에러가 나지 않아 캐시 미스매치를 찾기 어렵다.

```js
// src/constants/queryKeys.js
export const RESTAURANTS_QUERY_KEY = ["restaurants"];
```

`categories.js`, `categoryImages.js` 같은 상수 파일이 이미 있는 구조라 한 줄짜리 상수도 파일로 분리하는 게 자연스러운 위치다. 두 컴포넌트가 같은 키를 참조하므로 키가 바뀌어도 한 곳만 수정하면 된다.

### 2. 낙관적 업데이트 — optimistic ID 적용

기존에는 `mutate` 호출 시 `crypto.randomUUID()`로 생성한 ID를 넘겼다. 이 경우 캐시에 올라간 항목이 임시 데이터인지 서버에서 온 실제 데이터인지 구별이 안 됐다.

```js
// 변경 전 — handleSubmit에서 ID 생성
mutate({ id: crypto.randomUUID(), category, name, description });

// 변경 후 — onMutate에서 임시 ID로 캐시 항목 생성
const optimisticItem = {
  id: `optimistic-${Date.now()}`,
  ...newRestaurant,
};
```

`optimistic-` 접두사를 붙이면 Devtools에서 임시 데이터임을 바로 확인할 수 있다. `onSettled`의 `invalidateQueries`가 실행되면 서버의 실제 ID로 교체된다.

### 3. setQueryData 방어 코드 추가

기존 코드는 `old`가 항상 배열이라고 가정했다. 초기 로드 전이나 캐시가 비어있는 상태에서 `old`가 `undefined`이면 스프레드 연산자가 에러를 낸다.

```js
// 변경 전
queryClient.setQueryData(RESTAURANTS_QUERY_KEY, (old) => [...old, optimisticItem]);

// 변경 후
queryClient.setQueryData(RESTAURANTS_QUERY_KEY, (old) => {
  const current = Array.isArray(old) ? old : [];
  return [...current, optimisticItem];
});
```

### 4. onError 롤백 방어 코드 추가

`onMutate` 자체가 예외를 던지면 `context`가 `undefined`가 되어 롤백 코드가 에러를 낸다.

```js
// 변경 전
onError: (err, _, context) => {
  queryClient.setQueryData(RESTAURANTS_QUERY_KEY, context.previous);
},

// 변경 후
onError: (err, _, context) => {
  if (context?.previous) {
    queryClient.setQueryData(RESTAURANTS_QUERY_KEY, context.previous);
  }
},
```

`context?.previous`로 `context`가 `undefined`이더라도 롤백 자체가 실패하지 않는다.

### 5. isLoading/error 처리 — early return으로 전환

기존에는 인라인 조건부 렌더링으로 처리했다.

```js
// 변경 전 — 인라인
return (
  <ListContainer>
    {isLoading && <p>로딩중입니다.</p>}
    {error && <p>{error}</p>}
    <RestaurantUl>...</RestaurantUl>
  </ListContainer>
);

// 변경 후 — early return
if (isLoading) return <StatusText>로딩중입니다.</StatusText>;
if (error) return <StatusText>{error.message}</StatusText>;
```

예외 상태를 먼저 처리하고 정상 흐름은 아래에 집중되어 가독성이 높아진다. early return 이후에는 `newRestaurants`가 반드시 존재하므로 `?? []` 방어 코드도 제거할 수 있다.

### 6. useQuery/useMutation 커스텀 훅으로 분리

`RestaurantList`와 `AddRestaurantModal`에서 `useQuery`, `useMutation`을 직접 사용하고 있었다. 지금은 한 곳에서만 쓰이지만, 다른 컴포넌트에서 같은 데이터를 써야 할 때 `queryKey`와 `queryFn`을 중복 작성해야 하고, `staleTime`이나 `select` 같은 옵션을 추가할 때 컴포넌트를 직접 수정해야 한다.

```
// 변경 전 — 컴포넌트에서 직접 사용
RestaurantList.jsx     → useQuery({ queryKey, queryFn })
AddRestaurantModal.jsx → useMutation({ mutationFn, onMutate, onError, onSettled })

// 변경 후 — 커스텀 훅으로 분리
src/queries/useRestaurantsQuery.js      → useQuery 로직
src/queries/useAddRestaurantMutation.js → useMutation 로직 (서버 상태만)
```

UI 처리(`onClose`, `alert`)는 서버 상태 로직과 분리해 컴포넌트에 남겼다. 훅은 서버 상태(취소, 백업, 낙관적 업데이트, 롤백, 캐시 무효화)만 담당하고, 컴포넌트는 UI 흐름(모달 닫기, 에러 알림)만 담당한다.

```js
// useAddRestaurantMutation.js — 서버 상태만
onError: (err, _, context) => {
  if (context?.previous) queryClient.setQueryData(...);
}

// AddRestaurantModal.jsx — UI만
onClose();
mutate(data, { onError: () => alert("...") });
```

## 과거 코드와 비교

### 달라진 점

**useQuery/useMutation 위치**

과거 코드는 `useRestaurantData` 커스텀 훅 안에 `useQuery`와 `useMutation`을 모두 넣고, 클라이언트 상태(Zustand)와 서버 상태(TanStack Query)를 한 훅에서 같이 관리했다. 현재 코드는 `RestaurantList`와 `AddRestaurantModal`에서 각각 직접 사용한다.

훅으로 감싸는 방식은 서버 상태 접근 진입점을 통일해 구조 변경 시 컴포넌트를 수정하지 않아도 된다는 장점이 있다. 다만 이번 미션에서는 지난 미션(2.2)에서 `useRestaurantData`를 도입했다가 제거한 경험이 있다. 각 컴포넌트가 실제로 사용하는 값이 달라 같은 선택자를 반복하는 게 아니라 그냥 모아두는 형태가 됐고, 현재 규모에서는 추상화 레이어가 코드 추적 비용을 높인다고 판단했기 때문이다. 규모가 커져 여러 컴포넌트가 동일한 선택자 묶음을 반복하게 된다면 과거 방식이 더 적합하다.

**QUERY_KEY 상수화**

과거 코드는 `const QUERY_KEY = ["restaurants"]`로 상수를 분리해서 `useQuery`와 `invalidateQueries` 모두 이 상수를 참조했다. 현재 코드는 문자열을 직접 반복 사용한다. 문자열을 여러 곳에서 직접 쓰면 오타가 발생해도 런타임 에러가 나지 않아 캐시 미스매치를 찾기 어렵다. 과거 방식이 더 적합하다.

**낙관적 업데이트 optimistic ID**

과거 코드는 `onMutate`에서 캐시에 추가할 항목에 임시 ID를 부여했다.

```js
const optimisticItem = {
  id: `optimistic-${Date.now()}`,
  ...newRestaurant,
};
```

현재 코드는 `mutate` 호출 시 `crypto.randomUUID()`로 ID를 생성해서 넘긴다. 임시 ID가 명확히 구별되면 Devtools 디버깅과 롤백 추적이 쉬워지므로, 과거 방식이 더 적합하다.

**onError 방어 코드**

과거 코드는 `context?.previous`로 옵셔널 체이닝을 사용했다. `onMutate`가 예외를 던지면 `context`가 `undefined`가 되어 롤백 자체가 실패할 수 있기 때문이다. 현재 코드는 이 방어 처리가 없다. 낙관적 업데이트에서 롤백 실패는 데이터 불일치로 이어지므로 과거 방식이 더 안전하다.

**mutate vs mutateAsync**

과거 코드는 `mutateAsync`를 사용해 컴포넌트에서 `await`로 순차적인 흐름을 작성했다. 현재 코드는 `mutate`를 사용하고 모달 닫기를 `onMutate`에서 즉시 처리한다. 낙관적 업데이트의 핵심은 서버 응답을 기다리지 않는 것이므로, 이 미션 맥락에서는 현재 방식이 의도에 더 맞다.

**isLoading/isError 처리 방식**

과거 코드는 `RestaurantList`에서 early return으로 처리했다.

```js
if (isLoading) return <StatusText>불러오는 중...</StatusText>;
if (isError) return <StatusText>{error.message}</StatusText>;
```

현재 코드는 목록 위에 인라인으로 조건부 렌더링한다. early return은 예외 상태를 먼저 처리하고 정상 흐름은 아래에 집중시켜 가독성이 높으므로, 과거 방식이 더 적합하다.

### 과거 코드에서 배운 점

**ErrorBoundary와 Suspense로 로딩/에러 처리 위임**

리뷰에서 `isLoading`과 `isError`를 컴포넌트 내부에서 직접 처리하는 대신, `ErrorBoundary`나 `Suspense` 같은 컴포넌트에 위임하는 방법도 있다고 언급됐다. 이 방식을 쓰면 `RestaurantList`는 데이터 렌더링에만 집중하고, 로딩이나 에러 UI는 공통 컴포넌트에서 처리할 수 있어 구조적으로 더 깔끔해진다. 규모가 커질수록 고려할 수 있는 패턴이다.

**Devtools는 devDependencies로 분리 가능**

Devtools는 프로덕션 빌드에 포함되지 않도록 처리되어 있어 `dependencies`에 넣어도 실제 번들에는 영향이 없다. 하지만 개발 환경 의존성임을 명확히 하거나, Next.js App 디렉터리를 사용하는 경우에는 `devDependencies`에 위치시키는 것이 적합하다.
