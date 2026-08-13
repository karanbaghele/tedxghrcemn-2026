export const siteConfig = {
  name: "TEDxGHRCEMN",
  edition: "2nd Edition",
  theme: "Beyond the Dots",
  themeStatus: "Official 2026 theme",
  date: "Last week of August 2026",
  dateStatus: "Tentative",
  venue: "G.H. Raisoni College of Engineering & Management, Nagpur",
  mode: "In person",
  registrationUrl: "#registration-to-be-announced",
  email: "[OFFICIAL_EMAIL]",
  disclaimer: "[TEDX_DISCLAIMER] — final approved wording to be added.",
};

export const navItems = [
  ["Home", "/"], ["About", "/about"], ["Event", "/event"],
  ["Speakers", "/speakers"], ["Activities", "/activities"],
  ["Team", "/team"], ["Gallery", "/gallery"], ["Contact", "/contact"],
] as const;

export const secondaryNav = [["Partners", "/partners"], ["FAQs", "/faqs"]] as const;

export const speakers = Array.from({ length: 8 }, (_, index) => ({
  id: `speaker-${String(index + 1).padStart(2, "0")}`,
  name: `Speaker ${String(index + 1).padStart(2, "0")}`,
  field: ["Design & Culture", "Science & Society", "Entrepreneurship", "Human Potential"][index % 4],
  talk: "Talk theme to be announced",
  bio: "The speaker biography, designation and organisation will appear here after the official announcement.",
  timing: "Session timing • Provisional",
}));

export const activities = [
  { title: "Workshop 01", category: "Creative Practice", trainer: "Workshop Trainer 01", description: "A hands-on session designed to turn observation into thoughtful action.", outcomes: "Practical methods, guided exercises and a take-home framework.", eligibility: "Eligibility • To Be Announced", venue: "Venue • To Be Announced" },
  { title: "Workshop 02", category: "Innovation", trainer: "Workshop Trainer 02", description: "An interactive introduction to shaping early ideas through experimentation.", outcomes: "Idea framing, rapid testing and peer feedback.", eligibility: "Eligibility • To Be Announced", venue: "Venue • To Be Announced" },
  { title: "Workshop 03", category: "Communication", trainer: "Workshop Trainer 03", description: "A practical session on finding clarity, structure and presence in communication.", outcomes: "Story structure, delivery practice and constructive critique.", eligibility: "Eligibility • To Be Announced", venue: "Venue • To Be Announced" },
];

export const schedule = {
  day1: [
    ["09:30", "Welcome & orientation", "Event team", "Pre-Fest venue"],
    ["10:00", "Workshop session 01", "Trainer TBA", "Studio 01"],
    ["12:00", "Break", "—", "Commons"],
    ["13:00", "Student competition", "Jury TBA", "Main stage"],
    ["16:00", "Closing circle", "Event team", "Main stage"],
  ],
  day2: [
    ["09:30", "Doors open", "—", "Auditorium"],
    ["10:15", "Opening & session block 01", "Speakers TBA", "Main stage"],
    ["12:15", "Conversation break", "—", "Foyer"],
    ["13:30", "Session block 02", "Speakers TBA", "Main stage"],
    ["16:30", "Networking & close", "Event community", "Foyer"],
  ],
};

export const teamGroups = [
  "Faculty In-Charge", "Organizer", "Co-Organizer", "Secretary & Joint Secretary",
  "Event Management", "Speaker Curation", "Communications & Marketing",
  "Social Media", "Sponsorship & Finance", "Website & Technology", "Volunteer Management",
];

export const faqs = [
  ["What is TEDxGHRCEMN?", "An independently organised TEDx event at G.H. Raisoni College of Engineering & Management, Nagpur. Final approved institutional wording will be added before launch."],
  ["When and where is the event?", "The event is tentatively planned for the last week of August 2026 at G.H. Raisoni College of Engineering & Management, Nagpur."],
  ["Who can attend?", "Audience and eligibility details are To Be Announced. The final registration page will state any participation requirements."],
  ["Can external participants attend?", "External-participant access is To Be Announced."],
  ["Is Pre-Fest entry free?", "Entry information has not yet been confirmed."],
  ["What is the Main Event pass price?", "[PASS_PRICE] — To Be Announced."],
  ["Where do I register?", "All registration actions will open the official external registration platform once its URL is configured."],
  ["Is registration handled by TEDxGHRCEMN?", "Ticketing, payment, ticket delivery, cancellation and refund matters are handled by the external ticketing provider."],
  ["How will I receive my ticket or pass?", "Delivery details will be provided by the external ticketing provider."],
  ["Are meals included?", "Meal inclusions are To Be Announced."],
  ["Will certificates be provided?", "Certificate information is To Be Announced."],
  ["Whom should I contact for registration problems?", "Please contact the external ticketing provider through the help details shown on the registration platform."],
];

export const routeMeta: Record<string, { title: string; description: string }> = {
  about: { title: "About", description: "The story, purpose and context behind TEDxGHRCEMN." },
  event: { title: "Event", description: "Explore the two-day TEDxGHRCEMN experience and provisional schedule." },
  speakers: { title: "Speakers", description: "Meet the voices taking the TEDxGHRCEMN stage. Announcements coming soon." },
  activities: { title: "Activities", description: "Discover workshops and the student competition at the Pre-Fest." },
  team: { title: "Team", description: "Meet the public organising team behind TEDxGHRCEMN." },
  partners: { title: "Partners", description: "Institutional support and partnership opportunities for TEDxGHRCEMN." },
  gallery: { title: "Gallery", description: "Scenes from the first edition and future event highlights." },
  faqs: { title: "FAQs", description: "Useful answers about attending, registering and taking part." },
  contact: { title: "Contact", description: "General and partnership enquiries for TEDxGHRCEMN." },
};
