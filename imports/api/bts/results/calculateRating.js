import Schools from '../../schools/schools';
import BtsResults from './results';

export const calculateRating = ({ academicYear, examNumber }) => {
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
        };
      }
    });
  });
};
