import { CourseHistoryService } from './course/course-history.service';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();

async function main() {
  const prisma = new PrismaClient();
  const courseHistoryService = new CourseHistoryService(prisma);

  const normalData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../normal-course-history.json'),
      'utf-8'
    )
  );

  const specialData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../special-course-history.json'),
      'utf-8'
    )
  );

  await Promise.all([
    courseHistoryService.saveNormal(normalData),
    courseHistoryService.saveSpecial(specialData),
  ]);
}

main();
