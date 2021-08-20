import TurkishA1Keys from '../keys/keys';
import Schools from '../../schools/schools';
import Students from '../../students/students';

import { turkishA1ResultsInsert } from './methods';
import { calculateRating } from './calculateRating';

export const uploadXlsx = ({ t, rows, academicYear, examNumber }) => {
  const INTERVAL = 5;

  return new Promise((resolve, reject) => {
    if (!rows.length) {
      reject(t('empty_file'));
    }

    let sections = [];
    const sectionsStartIndex = 6;
    for (let i = 0; i < rows.length; i++) {
      const line = rows[i];

      let schoolId = '' + line[0];
      const studentId = line[1];
      const grade = line[2];
      const division = line[3];
      const surname = line[4];
      const name = line[5];

      if (i === 0) {
        for (let j = 0; j + sectionsStartIndex < line.length; j++) {
          sections[j] = line[j + sectionsStartIndex];
        }
        continue;
      }

      // leading zeros might be removed by a user's software
      while (schoolId.length < 3) {
        schoolId = '0' + schoolId;
      }
      let school = Schools.findOne({ schoolId });

      if (!school)
        reject(
          `${t('school_id_not_found')}, ${t('line')} ${i + 1}: {${schoolId}}`
        );

      let student = Students.findOne({ studentId: +studentId });

      if (!student)
        reject(
          `${t('student_id_not_found')}, ${t('line')} ${i + 1}: {${studentId}}`
        );

      let studentResult = {
        academicYear,
        examNumber,
        schoolId,
        studentId,
        grade: +student.grade,
        division: student.division,
        surname: student.surname,
        name: student.name,
        total: 0,
        results: [],
      };

      let hasResults = false;
      for (let j = 0; j < sections.length; j++) {
        if (line[j + sectionsStartIndex]) hasResults = true;
        studentResult.results.push({
          sectionName: sections[j],
          result: +line[j + sectionsStartIndex],
        });

        studentResult.total += line[j + sectionsStartIndex];
      }

      if (hasResults) {
        turkishA1ResultsInsert.call(studentResult, (err, res) => {
          err && reject(err.message);
        });
      }
    }

    calculateRating({ t, academicYear, examNumber }).catch(value => {
      reject(value);
    });

    resolve(t('done'));
  });
};
