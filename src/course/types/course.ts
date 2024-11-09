export type CourseJson = {
  BSNS_NO: string; // 사업자 번호
  FCLTY_NM: string; // 시설명
  ITEM_CD: string; // 항목 코드
  ITEM_NM: string; // 항목명
  CTPRVN_CD: string; // 시도 코드
  CTPRVN_NM: string; // 시도명
  SIGNGU_CD: string; // 시군구 코드
  SIGNGU_NM: string; // 시군구명
  FCLTY_ADDR: string; // 시설 주소
  FCLTY_DETAIL_ADDR: string; // 시설 상세 주소
  ZIP_NO: string; // 우편번호
  TEL_NO: string; // 전화번호
  COURSE_NM: string; // 과정명
  COURSE_NO: string; // 과정 코드
  COURSE_ESTBL_YEAR: string; // 과정 설립년도
  COURSE_ESTBL_MT: string; // 과정 설립월
  COURSE_BEGIN_DE: string | null; // 과정 시작일
  COURSE_END_DE: string | null; // 과정 종료일
  COURSE_REQST_NMPR_CO: string; // 과정 모집인원
  COURSE_PRC: string; // 과정 가격
};
