import TurkishA1Keys from '../keys/keys';
import Schools from '../../schools/schools';
import Students from '../../students/students';

import { turkishA1ResultsInsert } from './methods';
import { calculateRating } from './calculateRating';

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

      let keys = TurkishA1Keys.findOne({
        academicYear,
        examNumber: examNumber,
        grade: +student.grade,
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
        examNumber,
        schoolId,
        studentId,
        grade: +student.grade,
        division: student.division,
        variant,
        surname: student.surname,
        name: student.name,
        total: 0,
        results: [],
      };

      let sliceIndex = 0;
      keys.keys.map(key => {
        const { sectionName, keys: sectionKeys } = key;
        !sectionKeys.length &&
          reject(
            `${t('keys_not_found')}, ${t('line')} ${i + 1}: {${t(
              'variant'
            )}: ${variant}, ${t('section')}: ${sectionName}}`
          );

        let sectionResult = 0;
        const questionsN = sectionKeys.length;
        const sectionAnswers = answers.substring(
          sliceIndex,
          (sliceIndex += questionsN * INTERVAL)
        );
        for (let index = 0; index * INTERVAL < sectionAnswers.length; index++) {
          const studentAnswer = sectionAnswers
            .substring(index * INTERVAL, index * INTERVAL + INTERVAL)
            .trim()
            .toUpperCase();
          if (sectionKeys[index].toUpperCase() === studentAnswer) {
            sectionResult++;
            studentResult['total']++;
          }
        }
        studentResult.results.push({ sectionName, result: sectionResult });
      });

      turkishA1ResultsInsert.call(studentResult, (err, res) => {
        err && reject(err.message);
      });
    }

    calculateRating({ t, academicYear, examNumber }).catch(value => {
      reject(value);
    });

    resolve(t('done'));
  });
};
