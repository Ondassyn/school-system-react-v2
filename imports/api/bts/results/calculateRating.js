import { useTranslation } from 'react-i18next';
import Schools from '../../schools/schools';
import { btsRatingsInsert } from '../ratings/methods';
import BtsResults from './results';

export const calculateRating = ({ t, academicYear, examNumber }) => {
  return new Promise((resolve, reject) => {
    let schools = Schools.find().fetch();
    schools.map(school => {
      let results = BtsResults.find({
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
            if (totals.some(e => e.subjectId === r.subjectId)) {
              totals.find(e => e.subjectId === r.subjectId).total += r.result;
              totals.find(e => e.subjectId === r.subjectId).n++;
            } else {
              totals.push({ subjectId: r.subjectId, total: r.result, n: 1 });
            }
          });
          totalSum += result.total;
          totalN++;
        });
        totals.map(t => {
          t.n &&
            rating.averages.push({
              subjectId: t.subjectId,
              average: t.total / t.n,
            });
        });
        totalN && (rating.totalAverage = totalSum / totalN);
        btsRatingsInsert.call(rating, (err, res) => {
          err && reject(err.message);
        });
      }
    });

    resolve(t('done'));
  });
};
