# 프로젝트 가이드

## 미션 진행 방식

- 힌트 우선, 답은 명시적으로 요청할 때만 제공
- README 수정 시 초안을 먼저 보여주고 승인 후 반영 (포트폴리오 용도, heading 구조 고정)

## 과거 코드 비교 자동화

새 스텝 README의 `## 과거 코드와 비교` 섹션 작성 시:

1. `.claude/steps-config.json`에서 해당 스텝의 `oldPR` 번호와 `oldRepo`를 읽는다
2. `gh api repos/{oldRepo}/pulls/{oldPR}/comments`로 인라인 리뷰를 fetch한다
3. `gh pr diff {oldPR} --repo {oldRepo}`로 핵심 코드 변경사항을 확인한다
4. 현재 브랜치 코드와 비교하여 달라진 점, 리뷰에서 배운 점을 정리한다

스텝 번호 매핑: step1 → step1, step2 → step2, step3/4 → step3_4, step5 → step5

## README 양식

heading 구조는 고정 템플릿이며 절대 변경하지 않는다. README는 포트폴리오 용도로 작성한다.

```
# 미션 제목

## 🎯 개인 목표 및 목표 달성을 위한 행동 가이드

## 📝 기능 구현 목록

## 📚 학습 내용

## 🤔 고민했던 문제와 해결 과정에서 배운 점

## 🛠 리팩토링

## 과거 코드와 비교

### 달라진 점

### 과거 코드에서 배운 점
```
