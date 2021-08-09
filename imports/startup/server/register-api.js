/**
 * Register each api
 * import private server methods and server publications
 */

// users api
import '../../api/users/publications.js';
import '../../api/users/hooks.js';

// counters api (example)
import '../../api/counters/methods.js';
import '../../api/counters/publications.js';

// btsKeys api
import '../../api/bts/keys/methods.js';
import '../../api/bts/keys/publications.js';

// subjects api
import '../../api/subjects/publications.js';

// btsResults api
import '../../api/bts/results/methods.js';
import '../../api/bts/results/publications.js';

// btsRatings api
import '../../api/bts/ratings/methods.js';
import '../../api/bts/ratings/publications.js';

// schools api
import '../../api/schools/methods.js';
import '../../api/schools/publications.js';

// students api
import '../../api/students/publications.js';
import '../../api/students/methods.js';

import '../../api/studentTransfers/publications.js';
import '../../api/studentTransfers/methods.js';

// teachers api
import '../../api/teachers/publications.js';
import '../../api/teachers/methods.js';

import '../../api/teacherTransfers/publications.js';
import '../../api/teacherTransfers/methods.js';

// btsSettings api
import '../../api/bts/settings/methods.js';
import '../../api/bts/settings/publications.js';

import '../../api/idCounter/methods.js';
import '../../api/idCounter/publications.js';
