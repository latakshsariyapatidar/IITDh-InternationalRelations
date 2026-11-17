// Approved IRO corrections, November 2026. Keep these on the public frontend
// until the corresponding CMS records can be updated separately.
export const CAMPUS_ADDRESS = 'Indian Institute of Technology Dharwad, Permanent Campus, Chikkamalligawad, Dharwad - 580 011, Karnataka, Bharata (India).'

export const IRO_COMMITTEE = [
  { name: 'Prof. Sagnik Sen', title: 'Chairperson, IRO', email: 'chairperson.iro@iitdh.ac.in' },
  { name: 'Dr. Kalyan K. Bhattacharjee', title: 'Member', email: 'registrar@iitdh.ac.in' },
  { name: 'Prof. Naveen M. B.', title: 'Dean, Academic Programmes', email: 'dean.ap@iitdh.ac.in' },
  { name: 'Prof. Dhiraj V. Patil', title: 'Dean, Outreach', email: 'dean.outreach@iitdh.ac.in' },
  { name: 'Prof. Surya Pratap Singh', title: 'Associate Dean, Outreach (International)', email: 'adean.outreach.international@iitdh.ac.in' },
]

export const IRO_ADMINISTRATION = [
  { name: 'Mr. Arun Verma', title: 'Assistant Registrar', email: 'ar.iro@iitdh.ac.in' },
  { name: 'Ms. Kavitha G. R.', title: 'Advisor', email: 'advisor.iro@iitdh.ac.in' },
  { name: 'Mr. Manju Basavaraj Hiremath', title: 'Executive Technical Assistant', email: 'office.iro@iitdh.ac.in' },
]

export const IRO_CONTACTS = [
  IRO_COMMITTEE[0],
  ...IRO_ADMINISTRATION,
  { title: 'Inbound International Mobility', email: 'inbound.iro@iitdh.ac.in', description: 'For incoming international students, researchers, faculty, and visitors' },
  { title: 'Outbound International Mobility', email: 'outbound.iro@iitdh.ac.in', description: 'For IIT Dharwad students, researchers, and faculty going abroad' },
]

// Transcribed from the approved annexure on page 2 of 2611.1630.PDF.
export const DIRECTOR_MESSAGE = `Dear International Students, Scholars, and Collaborators,

It gives me great pleasure to welcome you to the Indian Institute of Technology DHARWAD (IIT DHARWAD).

As an Institute of National Importance and one of the 23 IITs, IIT DHARWAD is committed to excellence in education, research, innovation, leading to problem solving while actively strengthening its global academic engagement. Through our International Relations Office, we seek to foster meaningful international partnerships, facilitate student and faculty exchanges, and promote collaborative research and academic initiatives.

Located in DHARWAD, KARNATAKA in South India, IIT DHARWAD offers a stimulating academic environment enriched by the cultural heritage of the region. We believe that international collaboration brings diverse perspectives, encourages the exchange of ideas, and creates valuable opportunities for our students, faculty and partners. Leading eventually to development of products or examples demonstrating sustainability.

We cordially invite students, researchers from academic institutions from around the world to explore opportunities for learning, research, and collaboration with IIT DHARWAD. We look forward to building lasting relationships and welcoming you to our academic community.`

export const UNB_SCOPE = 'Exchange programs, Research Collaboration'
export const isNewBrunswick = (name = '') => /\buniversity of new brunswick\b/i.test(name)

export function approvedPartner(partner) {
  if (!/\buniversity of agder\b/i.test(partner.name || '')) return partner
  return {
    ...partner,
    championName: 'Prof. Sagnik Sen',
    championDesignation: 'Faculty Champion',
    championEmail: IRO_COMMITTEE[0].email,
  }
}

export function studentTeamForDisplay(team) {
  const rank = (member) => {
    const role = member.role || ''
    if (/student head/i.test(role)) return 0
    if (/inbound/i.test(role)) return 1
    if (/outbound/i.test(role)) return 2
    if (/management head/i.test(role)) return 3
    return 4
  }
  return team.filter(member => member.isActive).map(member => ({
    ...member,
    role: /inbound/i.test(member.role || '') ? 'Inbound Head' : member.role,
  })).sort((a, b) => rank(a) - rank(b))
}
