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
