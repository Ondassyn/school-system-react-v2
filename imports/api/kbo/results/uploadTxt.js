import KboKeys from '../keys/keys';
import Schools from '../../schools/schools';
import Students from '../../students/students';

import { kboResultsInsert } from './methods';
import { kboPercentagesInsert } from './../percentages/methods';
import { calculateRating } from '../percentages/calculateRating';

export const uploadTxt = ({ t, data, academicYear, examNumber }) => {
  const INTERVAL = 5;

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
        reject(
          `${t('school_id_not_found')}, ${t('line')} ${i + 1}: {${schoolId}}`
        );

      let student = Students.findOne({ studentId: +studentId });

      if (!student)
        reject(
          `${t('student_id_not_found')}, ${t('line')} ${i + 1}: {${studentId}}`
        );

      let keys = KboKeys.findOne({
        academicYear,
        examNumber,
        variant,
      });

      if (!keys)
        reject(
          `${t('keys_not_found')}, ${t('line')} ${i + 1}: {${t(
            'variant'
          )}: ${variant}, ${t('grade')}: ${student.grade}}`
        );

      let studentResult = {
        academicYear,
        examNumber: +examNumber,
        schoolId,
        studentId: +studentId,
        grade: +student.grade,
        division: student.division,
        variant,
        surname: student.surname,
        name: student.name,
        results: [],
      };

      let studentPercentage = {
        academicYear,
        examNumber: +examNumber,
        schoolId,
        studentId: +studentId,
        grade: +student.grade,
        division: student.division,
        variant,
        surname: student.surname,
        name: student.name,
        percentages: [],
      };

      let sliceIndex = 0;
      keys.keys.map(key => {
        const { subjectId, keys: subjectKeys } = key;
        !subjectKeys.length &&
          reject(
            `${t('keys_not_found')}, ${t('line')} ${i + 1}: {${t(
              'variant'
            )}: ${variant}, ${t('subject')}: ${subjectId}}`
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
          }
        }
        studentResult.results.push({ subjectId, result: subjectResult });
        studentPercentage.percentages.push({
          subjectId,
          percentage: ((subjectResult / questionsN) * 100).toFixed(0),
        });
      });

      kboResultsInsert.call(studentResult, (err, res) => {
        err && reject(err.message);
      });

      kboPercentagesInsert.call(studentPercentage, (err, res) => {
        err && reject(err.message);
      });
    }

    calculateRating({ t, academicYear, examNumber }).catch(value => {
      reject(value);
    });

    resolve(t('done'));
  });
};
