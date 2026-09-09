# 🀄 오늘의 마작 운세

매일 바뀌는 나만의 리치마작 운세. 등급(대길~흉), 별점 4종(공격운·수비운·도라운·흐름운), 행운의 패, 행운의 역, 오늘의 팁.

https://trendycandy.github.io/mahjong-fortune/

## 원리

- 서버·AI 없음. 첫 접속 시 브라우저에 익명 ID를 저장하고, `ID + 오늘 날짜(로컬)`를 해시해 시드로 쓴다.
- 시드 고정 PRNG 에서 등급 → 별점 → 문장 → 코멘트 → 패 → 역 → 팁 순으로 뽑는다.
- 같은 사람은 같은 날 몇 번 접속해도 같은 운세, 자정이 지나면 새 운세. 다른 브라우저/기기는 다른 사람으로 취급.

## 구조

```
src/engine/   rng.ts(해시·PRNG) · fortune.ts(generateFortune) — DOM 의존 없음
src/data/     등급·타일·역·한 줄 운세·세부 코멘트·팁 풀
src/ui/       React 화면, localStorage·날짜·공유
tests/        vitest — 결정론, 등급 분포, 별점 범위, 코멘트/팁 정합, 풀 최소 개수·중복
```

## 문장 추가하기

`src/data/headlines.ts`(등급별 한 줄 운세), `comments.ts`(별점 최고 항목 코멘트), `tips.ts`(별점 최저 항목 팁 + 공통 팁)에 문장을 넣으면 된다.
`npm test` 가 최소 개수·중복·빈 문장을 검사한다. 문장을 바꾸면 그날 이후의 결과가 달라진다(저장된 결과가 없으므로 문제 없음).

## 미리보기

`?u=<아무값>&d=YYYY-MM-DD` 를 붙이면 해당 사용자·날짜의 운세를 볼 수 있다. 저장된 ID는 건드리지 않는다.

## 크레딧

- 타일 이미지: [public/tiles/LICENSE.md](public/tiles/LICENSE.md)
- 제작: 설탕과자냥 (치지직)
