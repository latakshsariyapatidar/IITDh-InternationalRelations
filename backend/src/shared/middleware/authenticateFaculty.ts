import { requireCampusRole } from "./authenticateCampus.js";

/** Faculty portal only — students holding a valid campus token get a 403. */
export default requireCampusRole("faculty");
