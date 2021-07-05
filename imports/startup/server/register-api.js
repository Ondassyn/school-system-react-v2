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

// schools api
import '../../api/schools/publications.js';

// students api
import '../../api/students/publications.js';
