import { CourseHistoryService } from './course/save-course-history';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();

async function main() {
  const prisma = new PrismaClient();
  const courseHistoryService = new CourseHistoryService(prisma);

  const data = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../normal-course-history.json'),
      'utf-8'
    )
  );

  await courseHistoryService.save(data);
}

main();
