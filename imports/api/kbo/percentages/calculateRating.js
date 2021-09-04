import Schools from '../../schools/schools';
import { kboRatingsInsert } from '../ratings/methods';
import KboPercentages from './percentages';

const GRADES = [7, 8, 9, 10, 11];

export const calculateRating = ({ t, academicYear, examNumber }) => {
  return new Promise((resolve, reject) => {
    let schools = Schools.find().fetch();
    schools.map(school => {
      let percentages = KboPercentages.find({
        schoolId: school.schoolId,
        examNumber,
      }).fetch();

      if (percentages.length) {
        let rating = {
          academicYear,
          schoolId: school.schoolId,
          grade: 'all',
          averages: [],
        };

        let totals = [];
        let totalN = 0;

        percentages.map(percentage => {
          percentage.percentages.map(r => {
            if (totals.some(e => e.examNumber === percentage.examNumber)) {
              totals.find(e => e.examNumber === percentage.examNumber).total +=
                r.percentage;
              totals.find(e => e.examNumber === percentage.examNumber).n++;
            } else {
              totals.push({
                examNumber: percentage.examNumber,
                total: r.percentage,
                n: 1,
              });
            }
          });
          totalN++;
        });
        totals.map(t => {
          t.n &&
            rating.averages.push({
              examNumber: t.examNumber,
              average: t.total / t.n,
            });
        });
        if (totalN) {
          kboRatingsInsert.call(rating, (err, res) => {
            err && reject(err.message);
          });
        }

        GRADES.map(item => {
          let gradeRating = {
            academicYear,
            schoolId: school.schoolId,
            grade: item,
            averages: [],
          };

          let gradeTotals = [];
          let gradeTotalN = 0;

          percentages
            .filter(a => a.grade === item)
            .map(percentage => {
              percentage.percentages.map(r => {
                if (
                  gradeTotals.some(e => e.examNumber === percentage.examNumber)
                ) {
                  gradeTotals.find(
                    e => e.examNumber === percentage.examNumber
                  ).total += r.percentage;
                  gradeTotals.find(e => e.examNumber === percentage.examNumber)
                    .n++;
                } else {
                  gradeTotals.push({
                    examNumber: percentage.examNumber,
                    total: r.percentage,
                    n: 1,
                  });
                }
              });
              gradeTotalN++;
            });
          gradeTotals.map(t => {
            t.n &&
              gradeRating.averages.push({
                examNumber: t.examNumber,
                average: t.total / t.n,
              });
          });
          if (gradeTotalN) {
            kboRatingsInsert.call(gradeRating, (err, res) => {
              err && reject(err.message);
            });
          }
        });
      }
    });

    resolve(t('done'));
  });
};
