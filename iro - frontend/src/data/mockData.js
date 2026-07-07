export const mockData = {
  contacts: {
    chairperson: {
      title: 'Chairperson – International Collaboration',
      name: 'Dr. Rajesh Kumar',
      email: 'r.kumar@iitdh.ac.in',
      phone: '+91-8364-241-113',
      address: 'International Relations Office, IITDH, Dharwad - 580011'
    },
    iro: {
      title: 'Office of International Relations',
      email: 'iro@iitdh.ac.in',
      phone: '+91-8364-241-200',
      address: 'Building 2, IITDH Campus, Dharwad - 580011'
    },
    internationalMobility: {
      title: 'International Mobility – Students',
      name: 'Dr. Priya Singh',
      email: 'mobility@iitdh.ac.in',
      phone: '+91-8364-241-214'
    },
    admission: {
      title: 'International Admissions',
      name: 'Ms. Sneha Patel',
      email: 'international@iitdh.ac.in',
      phone: '+91-8364-241-215'
    }
  },

  faculty: [
    { name: 'Prof. Ramesh Chandra', department: 'Computer Science & Engineering', email: 'r.chandra@iitdh.ac.in' },
    { name: 'Prof. Anjali Sharma', department: 'Mechanical Engineering', email: 'a.sharma@iitdh.ac.in' },
    { name: 'Prof. Vikram Patel', department: 'Civil Engineering', email: 'v.patel@iitdh.ac.in' },
    { name: 'Prof. Neha Gupta', department: 'Electronics Engineering', email: 'n.gupta@iitdh.ac.in' },
    { name: 'Prof. Arvind Mishra', department: 'Chemical Engineering', email: 'a.mishra@iitdh.ac.in' },
  ],

  irTeam: [
    { name: 'Arjun Verma', role: 'Coordinator', year: 'Senior' },
    { name: 'Priya Kapoor', role: 'Outreach Lead', year: 'Junior' },
    { name: 'Aditya Nair', role: 'Events Manager', year: 'Junior' },
    { name: 'Divya Reddy', role: 'Communications', year: 'Sophomore' },
  ],

  partnerships: {
    universities: [
      { name: 'University of Toronto', country: 'Canada', countryCode: 'ca' },
      { name: 'TU Darmstadt', country: 'Germany', countryCode: 'de' },
      { name: 'Osaka University', country: 'Japan', countryCode: 'jp' },
      { name: 'NTU Singapore', country: 'Singapore', countryCode: 'sg' },
      { name: 'University of Melbourne', country: 'Australia', countryCode: 'au' },
      { name: 'ETH Zurich', country: 'Switzerland', countryCode: 'ch' },
    ],
    organizations: [
      { name: 'DAAD', country: 'Germany', focus: 'Student Mobility' },
      { name: 'British Council', country: 'United Kingdom', focus: 'Academic Programs' },
      { name: 'Campus France', country: 'France', focus: 'Research Collaboration' },
    ]
  },

  testimonials: [
    {
      name: 'Marco Rossi',
      country: 'Italy',
      program: 'MS in Computer Science',
      text: 'My experience at IITDH was transformative. The faculty, facilities, and international environment exceeded my expectations.'
    },
    {
      name: 'Yuki Tanaka',
      country: 'Japan',
      program: 'PhD in Mechanical Engineering',
      text: 'The research opportunities and collaborative culture made my academic journey enriching and productive.'
    },
    {
      name: 'Sarah Mueller',
      country: 'Germany',
      program: 'Semester Exchange',
      text: 'IITDH provided exceptional support and a welcoming environment for international students. Highly recommended!'
    }
  ],

  faqs: [
    {
      question: 'What is the admission timeline for international students?',
      answer: 'Applications are accepted year-round. Regular admissions are processed in March-April for fall enrollment. Refer to our admissions page for detailed timelines.'
    },
    {
      question: 'What are the visa requirements for studying in India?',
      answer: 'Student visa (X-category) requires an admission letter, financial documents, and passport. Our office provides complete guidance through the e-FRRO registration process.'
    },
    {
      question: 'Are scholarships available for international students?',
      answer: 'Yes, we offer merit-based scholarships, ICCR scholarships, and institutional financial aid. Check our opportunities page for details.'
    },
    {
      question: 'What facilities are available on campus?',
      answer: 'IITDH offers hostel accommodation, dining facilities, sports complexes, medical center, library, and recreational spaces for all students.'
    },
    {
      question: 'How can I exchange abroad as an IITDH student?',
      answer: 'Our office facilitates semester exchanges, research internships, and study tours. Contact our mobility team for available opportunities.'
    }
  ],

  programs: {
    undergraduate: ['B.Tech Computer Science', 'B.Tech Mechanical Engineering', 'B.Tech Civil Engineering'],
    postgraduate: ['M.Tech Computer Science', 'M.Tech Mechanical Engineering', 'MS Research Programs'],
    phd: ['PhD in Engineering', 'PhD in Science']
  }
}
