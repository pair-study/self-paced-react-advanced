# TanStack Query를 사용해서 서버 상태 관리하기

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

이번 미션을 통해 다음과 같은 학습 경험들을 쌓는 것을 목표로 한다.

1. 서버 상태와 클라이언트 상태를 구분하고, TanStack Query로 서버 상태를 분리한다.
2. `useQuery`, `useMutation`, `QueryClient` 개념을 직접 사용하며 TanStack Query 구조를 익힌다.
3. Optimistic Update를 구현하며 UX와 데이터 정합성 사이의 트레이드오프를 체감한다.

---

## 📝 기능 구현 목록

- [x] `@tanstack/react-query` 설치 및 `QueryClient` + `QueryClientProvider` 설정
- [x] `useRestaurantsQuery` 생성 — `useQuery`로 음식점 목록 조회
- [x] `useAddRestaurantMutation` 생성 — `useMutation`으로 음식점 추가
- [x] `RestaurantList`에서 `useRestaurantsQuery`로 교체
- [x] `AddRestaurantModal`에서 `useAddRestaurantMutation`으로 교체
- [x] `useRestaurantStore`를 `useFilterStore`로 분리 — `selectedCategory`만 관리
- [x] Optimistic Update 적용 — 요청 즉시 UI 반영, 실패 시 롤백
- [x] TanStack Query Devtools 추가

---

## 📚 학습 내용

### 서버 상태 vs 클라이언트 상태

| 구분 | 예시 | 특징 |
|---|---|---|
| 서버 상태 | `restaurants` | 서버가 소유, 다른 사용자가 변경 가능 |
| 클라이언트 상태 | `selectedCategory`, 모달 열림/닫힘 | 내 앱이 소유, 내가 바꿀 때만 바뀜 |

Zustand로 `restaurants`를 관리하면 내 앱이 마지막으로 가져온 스냅샷을 들고 있는 것이다. 그 사이 다른 사용자가 추가한 음식점은 알 수 없다. TanStack Query는 캐싱, 자동 갱신, 로딩/에러 상태를 자동으로 관리해준다.

### TanStack Query 핵심 개념

| 개념 | 설명 |
|---|---|
| `QueryClient` | 캐시 저장소. 앱 전체에서 하나만 생성한다. |
| `QueryKey` | 캐시를 식별하는 고유 키. 같은 키면 같은 캐시를 공유한다. |
| `useQuery` | 데이터 조회. `queryFn`이 반환한 데이터를 캐시에 저장한다. |
| `useMutation` | 데이터 변경(POST, PUT, DELETE). `onSuccess`, `onError`, `onSettled` 콜백을 제공한다. |

```js
// useRestaurantsQuery.js
export function useRestaurantsQuery() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });
}

// useAddRestaurantMutation.js
export function useAddRestaurantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRestaurant,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
}
```

`useQuery`를 커스텀 훅으로 감싼 이유는 `queryKey`를 한 곳에서 관리하기 위해서다. `invalidateQueries`에서도 같은 키를 써야 하므로, 여러 곳에 문자열이 흩어지면 키가 바뀔 때 모든 곳을 찾아야 한다.

### Zustand와의 역할 분리

TanStack Query 도입 후 `useRestaurantStore`에서 서버 상태(`restaurants`, `isLoading`, `error`, `fetchRestaurants`, `addRestaurant`)를 모두 제거했다. `selectedCategory`는 클라이언트 상태이므로 `useFilterStore`로 분리해서 유지했다.

```js
// useFilterStore.js — selectedCategory만 관리
const useFilterStore = create(
  persist(
    (set) => ({
      selectedCategory: ALL_CATEGORY,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    {
      name: "category-filter",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
```

`sessionStorage`를 선택한 이유는 카테고리 필터가 "브라우저를 닫아도 기억해야 하는 설정"이 아니라 "현재 탐색 중인 필터 상태"에 가깝기 때문이다. `localStorage`를 쓰면 오래된 필터 상태가 계속 남아있게 된다.

### Optimistic Update

서버 응답을 기다리지 않고 성공했다고 가정하고 UI를 먼저 업데이트하는 패턴이다.

```js
return useMutation({
  mutationFn: createRestaurant,
  onMutate: async (newRestaurant) => {
    // 1. 진행 중인 refetch 취소 (낙관적 업데이트를 덮어쓰지 않도록)
    await queryClient.cancelQueries({ queryKey: ["restaurants"] });
    // 2. 현재 캐시 저장 (실패 시 롤백용)
    const previousRestaurants = queryClient.getQueryData(["restaurants"]);
    // 3. 캐시에 낙관적으로 추가
    queryClient.setQueryData(["restaurants"], (old) => [
      ...old,
      { ...newRestaurant, id: crypto.randomUUID() },
    ]);
    return { previousRestaurants };
  },
  onError: (_err, _newRestaurant, context) => {
    queryClient.setQueryData(["restaurants"], context.previousRestaurants);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["restaurants"] });
  },
});
```

`onMutate`의 반환값이 `onError`의 `context`로 전달된다. `onMutate`와 `onError`는 서로 다른 함수라 직접 변수를 공유할 수 없기 때문이다.

`onSuccess` 대신 `onSettled`를 쓴 이유는, 실패 후 롤백된 상태에서도 서버 데이터와 동기화가 필요하기 때문이다. `onSuccess`는 성공 시에만 실행되지만 `onSettled`는 성공/실패 상관없이 항상 실행된다.

---

## 🤔 TanStack Query를 왜 사용하는가 — Zustand와 비교

### Zustand로 서버 상태를 관리할 때의 한계

Zustand에서 서버 데이터를 관리하려면 `isLoading`, `error`, `fetchRestaurants`를 직접 구현해야 한다. 또한 중복 요청 방지를 위한 guard 로직도 직접 작성해야 한다. TanStack Query는 이 모든 것을 자동으로 처리한다.

### 달랐던 점

**`useEffect` + `fetchRestaurants`가 사라졌다**

Zustand에서는 컴포넌트 마운트 시 `useEffect`로 직접 fetch를 트리거했다. TanStack Query는 `useQuery`만 호출하면 자동으로 데이터를 가져온다.

**로딩/에러 상태를 직접 관리하지 않아도 된다**

Zustand에서는 `isLoading`, `error`를 스토어에 직접 정의하고 `set`으로 관리했다. TanStack Query는 `useQuery`가 반환하는 `isLoading`, `error`를 그대로 쓰면 된다.

**캐싱이 자동이다**

같은 `queryKey`로 여러 컴포넌트에서 `useQuery`를 호출해도 실제 서버 요청은 한 번만 간다. Zustand는 이런 중복 요청 방지를 직접 구현해야 한다.

### Trade-off

**TanStack Query가 불필요한 경우**

- 서버 상태가 없고 클라이언트 상태만 있는 앱
- 데이터가 자주 바뀌지 않아 캐싱 이점이 없는 경우

**TanStack Query의 단점**

- 학습 곡선이 있다. `queryKey`, `invalidateQueries`, `onMutate`, `onSettled` 등 새로운 개념을 익혀야 한다.
- 간단한 fetch에도 `QueryClient` 설정, 커스텀 훅 작성 등 초기 설정이 필요하다.

---

## 🤔 고민했던 문제와 해결 과정에서 배운 점

### 무엇을 TanStack Query로, 무엇을 Zustand로 관리할 것인가

| 구분 | 상태 | 도구 | 이유 |
|---|---|---|---|
| 서버 상태 | `restaurants` | TanStack Query | 서버가 소유, 캐싱/동기화 필요 |
| 클라이언트 상태 (persist) | `selectedCategory` | Zustand | UI 상태이지만 새로고침 후 유지 필요 |
| 로컬 상태 | `clickedRestaurant`, `isAddRestaurantModalOpen` | useState | 해당 컴포넌트에서만 쓰이는 인터랙션 상태 |

### mutate 콜백 역할 분리

`useMutation`의 `onSettled`에서 캐시 무효화를 처리하고, `mutate` 호출 시 넘기는 콜백에서 UI 처리(모달 닫기, 에러 알림)를 담당했다.

```js
// useAddRestaurantMutation.js — 서버 상태 동기화
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ["restaurants"] });
}

// AddRestaurantModal.jsx — UI 처리
mutation.mutate(data, {
  onSuccess: () => onClose(),
  onError: () => alert("음식점 추가에 실패했습니다. 다시 시도해주세요."),
});
```

### Optimistic Update에서 어떤 상황에서 효과적인지

- 네트워크가 느린 환경에서 사용자가 즉각적인 피드백을 기대할 때
- 서버 요청의 성공 가능성이 높아 롤백이 거의 발생하지 않을 때
- 좋아요, 체크리스트처럼 사용자가 빠르게 반복 인터랙션하는 UI

### Optimistic Update 주의해야 할 점

- 롤백 처리가 필수다. 실패 시 낙관적으로 반영한 UI를 반드시 이전 상태로 되돌려야 한다.
- 임시 ID를 사용하므로 `onSettled`에서 `invalidateQueries`로 서버 실제 데이터와 반드시 동기화해야 한다.
- 실패 후 롤백되는 경험(추가한 항목이 갑자기 사라짐)이 사용자에게 혼란을 줄 수 있으므로, 실패 가능성이 높은 요청에는 적합하지 않다.
