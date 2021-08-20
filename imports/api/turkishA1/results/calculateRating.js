import Schools from '../../schools/schools';
import { turkishA1RatingsInsert } from '../ratings/methods';
import TurkishA1Results from './results';

export const calculateRating = ({ t, academicYear, examNumber }) => {
  return new Promise((resolve, reject) => {
    let schools = Schools.find().fetch();
    schools.map(school => {
      let results = TurkishA1Results.find({
        schoolId: school.schoolId,
        examNumber,
      }).fetch();

      if (results.length) {
        let rating = {
          academicYear,
          examNumber,
          schoolId: school.schoolId,
          grade: 'all',
          totalAverage: 0.0,
          averages: [],
        };

        let totals = [];
        let totalSum = 0;
        let totalN = 0;

        results.map(result => {
          result.results.map(r => {
            if (totals.some(e => e.sectionName === r.sectionName)) {
              totals.find(e => e.sectionName === r.sectionName).total +=
                r.result;
              totals.find(e => e.sectionName === r.sectionName).n++;
            } else {
              totals.push({
                sectionName: r.sectionName,
                total: r.result,
                n: 1,
              });
            }
          });
          totalSum += result.total;
          totalN++;
        });
        totals.map(t => {
          t.n &&
            rating.averages.push({
              sectionName: t.sectionName,
              average: t.total / t.n,
            });
        });
        totalN && (rating.totalAverage = totalSum / totalN);
        turkishA1RatingsInsert.call(rating, (err, res) => {
          err && reject(err.message);
        });
      }
    });

    resolve(t('done'));
  });
};
