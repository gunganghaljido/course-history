import { saveCourseHistory } from './course/save-course-history';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  await saveCourseHistory();
}

main();
