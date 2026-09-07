import { requireCampusRole } from "./authenticateCampus.js";

/**
 * Students only. Faculty share the same Google sign-in but must not be able to
 * submit outbound student-exchange applications, so this stays narrower than
 * `authenticateCampus`.
 */
export default requireCampusRole("student");
