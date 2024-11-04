import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../prisma/client';

export async function saveCourseHistory() {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../history.json'), 'utf-8')
  ) as CourseJson[];

  const courses = [];
  for (const course of data) {
    if (
      course.COURSE_BEGIN_DE === null ||
      course.COURSE_END_DE === null ||
      course.COURSE_REQST_NMPR_CO === '0'
    ) {
      continue;
    }
    const startDateStr = String(course.COURSE_BEGIN_DE);
    const endDateStr = String(course.COURSE_END_DE);

    const startDate = `${startDateStr.slice(0, 4)}-${startDateStr.slice(
      4,
      6
    )}-${startDateStr.slice(6, 8)}`;
    const endDate = `${endDateStr.slice(0, 4)}-${endDateStr.slice(
      4,
      6
    )}-${endDateStr.slice(6, 8)}`;

    courses.push({
      businessId: course.BSNS_NO,
      facilityName: course.FCLTY_NM,
      itemCode: course.ITEM_CD,
      itemName: course.ITEM_NM,
      address: course.FCLTY_ADDR,
      detailAddress: course.FCLTY_DETAIL_ADDR,
      courseName: course.COURSE_NM,
      courseId: course.COURSE_NO,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      participantCount: Number(course.COURSE_REQST_NMPR_CO),
      price: Number(course.COURSE_PRC),
    });
  }

  await prisma.courseHistory.createMany({
    data: courses,
    skipDuplicates: true,
  });
}

type CourseJson = {
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
  COURSE_BEGIN_DE: string; // 과정 시작일
  COURSE_END_DE: string; // 과정 종료일
  COURSE_REQST_NMPR_CO: string; // 과정 모집인원
  COURSE_PRC: string; // 과정 가격
};
