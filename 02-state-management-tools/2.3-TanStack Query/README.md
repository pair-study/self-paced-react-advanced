# 02-3. 서버상태관리 - TanStack Query

💡해당 미션은 **여러 사용자가 하나의 서버를 공유하고, 식당 목록이 주기적으로 업데이트되는 환경**을 가정하여 진행합니다.

## 🎯 요구사항

- TanStack Query를 사용해 서버 상태를 클라이언트 상태와 분리하고, 효율적인 데이터 캐싱과 요청 관리를 구현해 보세요.
  - 쿼리 및 뮤테이션 설정은 명확한 이유가 있다면 자유롭게 변경해도 좋습니다.
- TanStack Query를 **왜** 사용하는지, 서버 상태와 클라이언트 상태를 분리하였을때 어떤 점이 달랐는지, 또 trade-off가 있는지 적어주세요.
  - 기술적인 것도 좋고 개발자의 경험 측면에서도 좋습니다.
- TanStack Query Devtools를 이용하여 Query의 변화와 Mutation의 발생을 확인해보세요.
- (선택) 뮤테이션 로직에 낙관적 업데이트(Optimistic Update)를 적용해 보고 어떤 상황에서 낙관적 업데이트가 효과적인지, 그리고 주의해야 할 점은 무엇인지 적어주세요.
  - Browser Throttling 기능을 활용하여 네트워크 속도를 느리게 설정한 뒤 낙관적 업데이트가 실제로 어떻게 동작하는지 확인해 보세요.

### 😗구현 예시

- 컴포넌트의 이름이나 구조를 정한 이유가 명확해야하며 타인에게 설명할 수 있어야합니다.
- 아래는 main.jsx의 설정 모습입니다.

```javascript
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

## ✅ 키워드

- props drilling
- 서버 상태관리
  - TanStack Query
  - QueryClient
  - Query Key
  - useQuery
  - useMutation
  - Optimistic Update

## 🧙‍♀️ 진행 가이드

- 진행시간 : 4시간 내에 완료하는 것을 목표로 합니다.

## 🔗 참고 문서

- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Query 메인테이너 Tk Dodo 님의 블로그](https://tkdodo.eu/blog/tags/react-query)
- [테코톡(시모의 Tanstack Query)](https://www.youtube.com/watch?v=RfK15tw8H-I)