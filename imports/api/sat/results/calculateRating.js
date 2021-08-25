import Schools from '../../schools/schools';
import { satRatingsInsert } from '../ratings/methods';
import SatResults from './results';

export const calculateRating = ({ t }) => {
  return new Promise((resolve, reject) => {
    let schools = Schools.find().fetch();
    schools.map(school => {
      let results = SatResults.find({ schoolId: school.schoolId }).fetch();

      if (results.length) {
        let rating = {
          schoolId: school.schoolId,
          grade: 'all',
          totalAverage: 0.0,
          averages: [],
        };

        let totals = [];
        let totalSum = 0;
        let totalN = 0;

        results.map(result => {
          let resultExists = false;
          result.results.map(r => {
            if (totals.some(e => e.sectionName === r.sectionName)) {
              if (r.result || r.result === 0) {
                totals.find(e => e.sectionName === r.sectionName).total +=
                  r.result;
                totals.find(e => e.sectionName === r.sectionName).n++;
                resultExists = true;
              }
            } else {
              if (r.result || r.result === 0) {
                totals.push({
                  sectionName: r.sectionName,
                  total: r.result,
                  n: 1,
                });
                resultExists = true;
              }
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
        if (totalN) {
          rating.totalAverage = totalSum / totalN;
          satRatingsInsert.call(rating, (err, res) => {
            err && reject(err.message);
          });
        }
        ['10', '11'].map(item => {
          let gradeRating = {
            schoolId: school.schoolId,
            grade: item,
            totalAverage: 0.0,
            averages: [],
          };

          let gradeTotals = [];
          let gradeTotalSum = 0;
          let gradeTotalN = 0;

          results
            .filter(a => a.grade === item)
            .map(result => {
              let resultExists = false;
              result.results.map(r => {
                if (gradeTotals.some(e => e.sectionName === r.sectionName)) {
                  if (r.result || r.result === 0) {
                    gradeTotals.find(
                      e => e.sectionName === r.sectionName
                    ).total += r.result;
                    gradeTotals.find(e => e.sectionName === r.sectionName).n++;
                    resultExists = true;
                  }
                } else {
                  if (r.result || r.result === 0) {
                    gradeTotals.push({
                      sectionName: r.sectionName,
                      total: r.result,
                      n: 1,
                    });
                    resultExists = true;
                  }
                }
              });
              gradeTotalSum += result.total;
              gradeTotalN++;
            });
          gradeTotals.map(t => {
            t.n &&
              gradeRating.averages.push({
                sectionName: t.sectionName,
                average: t.total / t.n,
              });
          });
          if (gradeTotalN) {
            gradeRating.totalAverage = gradeTotalSum / gradeTotalN;
            satRatingsInsert.call(gradeRating, (err, res) => {
              err && reject(err.message);
            });
          }
        });
      }
    });

    resolve(t('done'));
  });
};
