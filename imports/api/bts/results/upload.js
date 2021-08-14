import BtsKeys from '../keys/btsKeys';
import Schools from '../../schools/schools';
import Students from '../../students/students';

import { btsResultsInsert } from './methods';
import { calculateRating } from './calculateRating';
import { useTranslation } from 'react-i18next';

export const upload = ({ data, academicYear, examNumber, day }) => {
  const INTERVAL = 5;

  const [t, i18n] = useTranslation();

  return new Promise((resolve, reject) => {
    let lines = data.trim().split('\n');

    if (!lines.length) {
      reject(t('empty_file'));
    }

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      let schoolId = line.substring(0, 3);
      let studentId = line.substring(3, 8);
      let variant = line.substring(8, 12);
      let surname = line.substring(12, 29);
      let name = line.substring(29, 39);
      let answers = line.substring(39);

      let school = Schools.findOne({ schoolId });

      if (!school)
        reject(`${t('school_id_not_found')}, ${t('line')} ${i}: {${schoolId}}`);

      let student = Students.findOne({ studentId: +studentId });

      if (!student)
        reject(
          `${t('student_id_not_found')}, ${t('line')} ${i}: {${studentId}}`
        );

      let keys = BtsKeys.findOne({
        academicYear,
        examNumber: examNumber,
        day: day,
        grade: +student.grade,
        variant,
      });

      if (!keys)
        reject(
          `${t('keys_not_found')}, ${t('line')} ${i}: {${t(
            'variant'
          )}: ${variant}, ${t('grade')}: ${student.grade}}`
        );

      let studentResult = {
        academicYear,
        examNumber,
        schoolId,
        studentId,
        grade: +student.grade,
        division: student.division,
        day,
        variant,
        surname,
        name,
        languageGroup: student.languageGroup,
        electiveGroup: student.electiveGroup,
        total: 0,
        results: [],
      };

      let sliceIndex = 0;
      keys.keys.map(key => {
        const { subjectId, keys: subjectKeys } = key;
        !subjectKeys.length &&
          reject(
            `${t('keys_not_found')}, ${t('line')} ${i}: {${t(
              'variant'
            )}: ${variant}, ${t('subjectId')}: ${subjectId}}`
          );

        let subjectResult = 0;
        const questionsN = subjectKeys.length;
        const subjectAnswers = answers.substring(
          sliceIndex,
          (sliceIndex += questionsN * INTERVAL)
        );
        for (let index = 0; index * INTERVAL < subjectAnswers.length; index++) {
          const studentAnswer = subjectAnswers
            .substring(index * INTERVAL, index * INTERVAL + INTERVAL)
            .trim()
            .toUpperCase();
          if (subjectKeys[index].toUpperCase() === studentAnswer) {
            subjectResult++;
            studentResult['total']++;
          }
        }
        studentResult.results.push({ subjectId, result: subjectResult });
      });

      btsResultsInsert.call(studentResult, (err, res) => {
        err && reject(err.message);
      });
    }

    calculateRating({ academicYear, examNumber }).catch(value => {
      reject(value);
    });

    resolve(t('done'));
  });
};
