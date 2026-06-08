# 03. 모달 UI 구현하기: side-effect(feat. event handler)

## 🎯 요구 사항

- `RestaurantList` 의 아이템을 클릭하면, 클릭한 아이템의 정보를 보여주는 모달이 뜨도록 변경해 주세요. '확인' 버튼을 클릭하거나 모달 뒤의 backdrop을 클릭하면 모달이 닫혀야 합니다.
  - (작은 단계로 구현해보기 1) 아이템을 클릭하면 정해진 텍스트를 그대로 보여주는 모달을 열고 닫습니다.
  - (작은 단계로 구현해보기 2) 클릭한 아이템의 정보를 모달에 내려줄 수 있도록 개선합니다.

### 구현 결과 예시

```javascript
// App.jsx
{isModalOpen && <RestaurantDetailModal {/** 적절한 props */}/>}
```

## ✅ 키워드

- event handler (feat. side effect)
- conditional rendering
- lifting state up

## 🧙‍♀️ 진행 가이드

- 진행 시간: 1시간 내에 완료하는 것을 목표로 합니다.

## 🔗 참고 문서

- [Thinking in React](https://react.dev/learn/thinking-in-react)의 Step5
- [Responding to Events](https://react.dev/learn/responding-to-events)
