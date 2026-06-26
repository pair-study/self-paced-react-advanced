# 02-2. 전역상태관리 - Zustand

## 🎯 요구사항

- Context API로 구성한 애플리케이션을 Zustand 기반 전역 상태로 마이그레이션하세요.
- props에 대한 요구사항은 2-1 요구사항과 같습니다.
- Zustand를 **왜** 사용하는지, Context API와 비교했을때 어떤 점이 달랐는지, 또 trade-off가 있는지 적어주세요.
  - 기술적인 것도 좋고 개발자의 경험 측면에서도 좋습니다.
- (선택): 카테고리 필터의 선택된 카테고리가 새로고침 후에도 유지되도록 구현해보세요

### 😗구현 예시

- 컴포넌트의 이름이나 구조를 정한 이유가 명확해야하며 타인에게 설명할 수 있어야합니다.
- 아래 코드는 Zustand 스토어를 설정하는 예시입니다.

```javascript
import { create } from "zustand";

// Zustand 스토어 예시
export const useBear = create((set) => ({
  // state
  bears: 0,

  // actions
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));
```

## ✅ 키워드

- props drilling
- 전역상태관리
  - Zustand
  - create
  - set / get

## 🧙‍♀️ 진행 가이드

- 진행시간 : 2시간 내에 완료하는 것을 목표로 합니다.

## 🔗 참고 문서

- [Zustand 공식문서](https://recoiljs.org/docs/introduction/installation/)
- [Zustand와 React Context](https://tkdodo.eu/blog/zustand-and-react-context)
