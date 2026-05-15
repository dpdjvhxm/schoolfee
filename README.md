# EduCost Hub - Global Education Expense Management Demo

외국 직원 자녀 학비 및 기타 학업 비용을 관리하기 위한 React 기반 데모 서비스입니다.

## 주요 기능

- 대시보드
  - 총 사용 비용
  - 관리 직원 수
  - 처리 대기 인보이스 수
  - 이슈 인보이스 수
  - 월별 비용 추이
  - 국가별 비용 현황
  - 비용 항목별 비중

- 직원/자녀/학교 관리
  - 직원 등록
  - 자녀 정보 등록
  - 학교 및 학년 관리
  - 연간 한도와 사용률 확인

- 인보이스 관리
  - 인보이스 수동 등록
  - 인보이스 업로드/OCR 시뮬레이션
  - 검색 및 상태 필터
  - 자동 검증
  - 승인/보류/반려 처리
  - CSV 다운로드

- 학교별 인보이스 템플릿 관리
  - 학교별 양식 등록
  - 추출 필드 관리
  - OCR 성공률 관리
  - 표준 데이터 필드 변환 구조

- 정책/한도 관리
  - 권역별 한도 관리
  - 정책 한도 수정 UI
  - 자동 검증 룰 확인

## 학교별 인보이스 양식 처리 구조

학교마다 인보이스 양식이 다르기 때문에, 서비스 구조는 다음 방식으로 설계합니다.

```text
PDF/이미지 인보이스 업로드
→ OCR / 문서 파싱
→ 학교명 인식
→ 학교별 템플릿 매칭
→ 표준 필드로 변환
→ 자동 검증
→ 신뢰도 낮은 건만 담당자 검수
```

최종적으로 모든 인보이스는 아래 표준 필드로 통합됩니다.

```text
invoice_no
employee_name
child_name
school_name
term
category
amount
currency
due_date
issue
ocr_confidence
approval_status
```

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 표시되는 로컬 주소로 접속하면 됩니다.

## 빌드

```bash
npm run build
```

## 기술 스택

- React
- Vite
- Tailwind CSS
- Recharts
- Framer Motion

## 현재 버전의 성격

이 프로젝트는 실제 백엔드나 데이터베이스가 연결되지 않은 프론트엔드 데모입니다.
현재 데이터는 React state와 샘플 데이터로 동작합니다.

실서비스 전환 시 추가해야 할 항목:

- 로그인/권한 관리
- 직원 마스터 DB
- 인보이스 파일 업로드 저장소
- OCR API 연동
- 학교별 템플릿 학습/관리 DB
- 환율 API 연동
- 승인 워크플로우
- 감사 로그
- ERP/회계 시스템 연동
