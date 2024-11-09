import { PrismaClient } from '@prisma/client';
import type { CourseJson } from './types/course';

export class CourseHistoryService {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async saveNormal(data: CourseJson[]) {
    const courses = this.convert(data);

    await this.prisma.courseHistory.createMany({
      data: courses,
      skipDuplicates: true,
    });
  }

  async saveSpecial(data: CourseJson[]) {
    const courses = this.convert(data);

    await this.prisma.specialCourseHistory.createMany({
      data: courses,
      skipDuplicates: true,
    });
  }

  convert(data: CourseJson[]) {
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
    return courses;
  }
}
