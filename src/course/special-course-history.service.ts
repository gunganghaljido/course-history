import type { PrismaClient } from '@prisma/client';
import type { CourseJson } from './types';

export class SpecialCourseHistoryService {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async save(data: CourseJson[]) {
    const courses = [];

    for (const course of data) {
      if (course.COURSE_BEGIN_DE === null || course.COURSE_END_DE === null) {
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

      if (course.CTPRVN_CD === '45') {
        course.CTPRVN_CD = '52';
        if (course.SIGNGU_CD.substring(0, 2) === '45') {
          course.SIGNGU_CD = '52' + course.SIGNGU_CD.substring(2);
        }
      } else if (course.CTPRVN_CD === '42') {
        course.CTPRVN_CD = '51';
        if (course.SIGNGU_CD.substring(0, 2) === '51') {
          course.SIGNGU_CD = '51' + course.SIGNGU_CD.substring(2);
        }
      }

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
        cityCode: course.CTPRVN_CD,
        cityName: course.CTPRVN_NM,
        localCode: course.SIGNGU_CD,
        localName: course.SIGNGU_NM,
        phone: course.TEL_NO,
      });
    }

    await this.prisma.specialCourseHistory.createMany({
      data: courses,
      skipDuplicates: true,
    });

    await this.saveSpecialFacility();
  }

  async saveSpecialFacility() {
    const businessIds = await this.prisma.specialCourseHistory.findMany({
      select: {
        businessId: true,
      },
      distinct: ['businessId'],
    });

    const facilities = [];

    for (const { businessId } of businessIds) {
      const courseHistory =
        await this.prisma.specialCourseHistory.findFirstOrThrow({
          where: {
            businessId,
          },
          orderBy: {
            startDate: 'desc',
          },
        });

      facilities.push({
        businessId,
        name: courseHistory.facilityName,
        cityCode: courseHistory.cityCode,
        cityName: courseHistory.cityName,
        localCode: courseHistory.localCode,
        localName: courseHistory.localName,
        address: courseHistory.address,
        detailAddress: courseHistory.detailAddress,
        phone: courseHistory.phone,
      });
    }

    await this.prisma.specialFacility.deleteMany();

    await this.prisma.specialFacility.createMany({
      data: facilities,
    });
  }
}
