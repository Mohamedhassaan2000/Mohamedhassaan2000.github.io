// All site content lives here. Edit this file to update the portfolio.

window.PROFILE = {
  name: "Mohamed Hassaan",
  fullName: "Mohamed Hassaan Ahmed",
  title: "Architectural Designer", // keep in line with the CV
  location: "Cairo, Egypt",
  phone: "+20 114 014 8577",
  // first message typed for the visitor when they press "Get in Touch" (opens WhatsApp)
  whatsappText: "Hi Mohamed, I saw your portfolio and would like to get in touch.",
  email: "hassaanm799@gmail.com",
  linkedin: "https://www.linkedin.com/in/mohamed-hassaan-wahby-5318362a9",
  // Behance profile link — the Behance tile in Contact stays hidden while this is empty
  behance: "https://www.behance.net/mohamedhassaan9",
  photo: "assets/img/me.jpg?v=3",
  cv: "assets/cv/Mohamed-Hassaan-CV.pdf?v=3",
  // page images shown by the in-site "View CV" viewer (regenerate when the CV PDF changes)
  cvPages: ["assets/cv/pages/cv-1.jpg?v=3"],
  status: "Open to full-time roles",
  // About section on the home page (<em> = highlighted words)
  // About section: one lead sentence, then the rest as short paragraphs (<p> per paragraph)
  aboutLead: "I’m Mohamed Hassaan Ahmed, an Architectural Engineer and a graduate of the Faculty of Fine Arts, Assiut University.",
  aboutMe:
    "<p>I currently work at DOSOR STUDIO as an <em>Architectural Designer and Technical Office Engineer</em>, contributing to architectural design development, 3D modeling and visualization, AI-assisted rendering, and technical drawings.</p>" +
    "<p>My role involves working on different project types and turning design ideas into <em>clear visual presentations and technical documentation.</em></p>",
  now: "DOSOR STUDIO — Designer & Technical Office, since Jan 2026",
  education: "B.Arch, Assiut University, 2024",
  intro:
    "Architectural engineer working across design development and technical documentation — from concept massing and renders to working drawings, details and shop drawings.",
  about:
    "B.Arch graduate (Assiut University, Very Good with Honors) with hands-on office experience in <em>design development</em>, <em>working drawings</em> and <em>3D visualization</em>. I care about how a design idea survives the trip to site: coordinated drawings, clear details and outputs that match execution requirements.",
  experience: [
    {
      when: "Jan 2026 — Now",
      title: "Architectural Designer & Technical Office Engineer — DOSOR STUDIO",
      text: "Architectural design office. Working on both sides of the studio: design development and visualization, and technical documentation — working drawings, details and drawing coordination — for large-scale projects in Egypt, KSA and Oman."
    },
    { when: "Dec 2025", title: "Military Service", text: "Completed." },
    {
      when: "2019 — 2024",
      title: "Bachelor of Architecture (B.Arch.)",
      text: "Faculty of Fine Arts, Assiut University — Very Good with Honors."
    }
  ],
  // Expertise list on the home page (img = shown on hover)
  expertise: [
    { title: "Architectural Design", text: "Concept, massing and design development", img: "assets/img/projects/agyad/22.jpg" },
    { title: "Working Drawings", text: "Plans, blow-up elevations, details, schedules", img: "assets/img/projects/kix/01.jpg" },
    { title: "Interior Design", text: "Interior layouts and enhancement studies", img: "assets/img/projects/fitness-time/01.jpg" },
    { title: "3D Visualization", text: "Modeling and architectural rendering", img: "assets/img/projects/airshow/01.jpg" },
    { title: "Landscape Design", text: "Courtyards, open spaces and street furniture", img: "assets/img/projects/rehab-center/09.jpg" }
  ],
  tools: ["SketchUp", "AutoCAD", "D5 Render", "Photoshop", "Revit (basic)"],
  // "Software I use" belt on the home page.
  // logo = file in assets/img/logos (without .svg); programs with no logo file use mark: "D5" / "ai" / "office"
  software: [
    { name: "AutoCAD", logo: "autocad", color: "#e51050" },
    { name: "SketchUp", logo: "sketchup", color: "#1a73c8" },
    { name: "Revit", note: "Basic", logo: "autodeskrevit", color: "#186bff" },
    { name: "D5 Render", mark: "D5", color: "#7b61ff" },
    { name: "Photoshop", logo: "adobephotoshop", color: "#31a8ff" },
    { name: "AI Rendering", mark: "ai", color: "#d16ba5" },
    { name: "Microsoft Office", mark: "office", color: "#e8590c" }
  ],
  // Expertise cards on the home page — only the titles are shown; the item lists keep the CV wording.
  // The "Digital Tools" group is shown as the software belt instead (see software above).
  skillGroups: [
    { title: "Architectural Design", icon: "home", items: ["Architectural Design Development", "Design Analysis & Concept Development", "Landscape Design & Development", "Interior Design Development"] },
    { title: "Technical Documentation", icon: "doc", items: ["Architectural Working Drawings", "Interior Elevations & Details", "Architectural Plans & Elevations", "Drawing Coordination"] },
    { title: "3D Visualization", icon: "cube", items: ["3D Modeling", "Visualization & Rendering", "AI-Assisted Visualization", "Design Presentation"] },
    { title: "Digital Tools", icon: "monitor", items: ["AutoCAD", "SketchUp", "D5 Render", "Adobe Photoshop", "Revit — Basic", "AI Rendering Tools", "Microsoft Office"] }
  ],
  featured: "airshow", // project shown in the small hero card (Agyad already leads Selected Works)
  languages: ["Arabic — Native", "English"],
  // Full-screen images rotating behind the hero title
  hero: [
    "assets/img/projects/agyad/01.jpg",
    "assets/img/projects/airshow/01.jpg",
    "assets/img/projects/rehab-center/01.jpg"
  ]
};

// assets/img/projects/<slug>/01.jpg … NN.jpg  (01 is the cover)
// Bump IMG_V whenever project images are replaced, so browsers drop their cached copies.
const IMG_V = "3";
const img = (slug, n) => `assets/img/projects/${slug}/${String(n).padStart(2, "0")}.jpg?v=${IMG_V}`;
const imgs = (slug, n) => Array.from({ length: n }, (_, i) => img(slug, i + 1));

/*
  category : "design" | "technical" | "academic"   (filter on the home page)
  tags     : disciplines shown on the card and the project page
  concept  : the design idea (paragraph)
  decisions: key design decisions (optional list, shown under the design idea)
  stages   : work phases, in order — add  mine: true  to the phases you worked on
  roleLine : your role in ONE sentence (top "At a glance" card)
  stage    : project stages you took part in, e.g. ["Concept", "Design Development"]
  team     : e.g. "Individual" or "DOSOR STUDIO design team"
  hidden   : true to keep a project in this file without showing it on the site
  cover    : optional — the image used as the cover (defaults to the first image)
  software : tools YOU used on this project
  role     : "What I did" — 3 to 5 lines, each starting with a verb
  work     : YOUR sheets, as [image number, caption] — shown under "My work".
             Images not listed here appear under "Project context" (team work).
*/
const work = (slug, list) => list.map(([n, caption]) => ({ src: img(slug, n), caption }));
const PROJECTS = [
  {
    slug: "agyad",
    category: "design",
    title: "Agyad Al Masafi",
    tags: ["Concept & Massing Design", "Landscape & Public Realm", "Architectural Design", "Landscape"], // first two show on the card
    type: "High-rise mixed-use towers",
    location: "Makkah, KSA",
    year: "2026",
    summary: "A cluster of towers facing the Haram and the Clock Tower — built on the massing option I designed.",
    concept: "Slender towers rise from a sculpted, terraced podium, stepping in height to frame views toward the Haram. A layered façade with mashrabiya-inspired screens carries out into the landscape, wayfinding and lighting.",
    decisions: [
      "Seven massing alternatives were developed by the team — one per designer — for the client presentation",
      "Option 6, which I designed, was the one the client selected",
      "The final design keeps its idea: slender towers on a flowing, terraced podium",
      "Each option was tested against the skyline and the view corridors toward the Haram and the Clock Tower",
      "The public realm — landscape, signage and lighting — shares one design language with the façades"
    ],
    stages: [
      { title: "Massing alternatives", text: "Seven planning and massing options tested against skyline and Haram views — option 6 was mine and was selected.", mine: true },
      { title: "Site & façade logic", text: "Master site plan, façade design principles and material distribution." },
      { title: "Exterior design", text: "Day, sunset and night renders of towers, podium and plazas." },
      { title: "Public realm", text: "Landscape, street furniture, signage, light poles and lighting units.", mine: true }
    ],
    roleLine: "Designed massing option 6 — selected by the client — and, in the final design, the landscape, street furniture, signage and lighting.",
    stage: ["Concept", "Design Development"],
    team: "DOSOR STUDIO design team — each designer developed one massing option",
    software: ["SketchUp"],
    role: [
      "Designed massing option 6 of 7 for the client presentation — the option the client selected and the base of the final design",
      "Studied tower heights and spacing against the Haram and Clock Tower view corridors",
      "Designed the landscape: podium gardens, plazas, fountains and shaded walkways",
      "Designed the street furniture: three seating units with integrated planters, with plans, elevations and materials",
      "Designed the signage system: façade signs and a family of wayfinding signs, with locations, details and materials",
      "Designed the light poles and lighting units and planned their distribution across the site"
    ],
    images: imgs("agyad", 55),
    // 01–10: final design book (team) · 11–21 landscape · 22–36 signage · 37–43 lighting · 44–48 option 6 · 49–55 street furniture — all mine
    work: work("agyad", [
      [44, "Option 6 — the towers against the Clock Tower (selected by the client)"],
      [45, "Option 6 — massing model on the site"],
      [46, "Option 6 — views toward the Haram"],
      [47, "Option 6 — skyline and Haram view studies"],
      [48, "Option 6 — massing and podium diagrams"],
      [16, "Landscape — terraced podium gardens, aerial view"],
      [11, "Master site plan — landscape layout"],
      [12, "Green areas plan"],
      [13, "Hotel forecourt — fountains and planting"],
      [14, "Hotel entrance plaza"],
      [15, "Shaded walkway toward the Clock Tower"],
      [21, "Podium gardens — aerial view"],
      [17, "Central plaza at night"],
      [18, "Plazas and gardens at night"],
      [19, "Street-level landscape at night"],
      [20, "Landscaped plazas at night"],
      [49, "Street furniture — seating units with integrated planters"],
      [50, "Seating unit 1 — locations on site"],
      [51, "Seating unit 1 — plan, elevations and materials"],
      [52, "Seating unit 2 — locations on site"],
      [53, "Seating unit 2 — plan, elevations and materials"],
      [54, "Seating unit 3 — locations on site"],
      [55, "Seating unit 3 — plan, elevations and materials"],
      [26, "Signage — the wayfinding sign family"],
      [22, "Signage types on the façades"],
      [23, "Signage and logo applications"],
      [24, "Façade signage — materials and colors"],
      [25, "Signage locations on the towers"],
      [27, "Wayfinding sign 1 — locations on site"],
      [28, "Wayfinding sign 1 — plan, elevations and materials"],
      [29, "Wayfinding sign 2 — locations on site"],
      [30, "Wayfinding sign 2 — plan, elevations and materials"],
      [31, "Wayfinding sign 3 — locations on site"],
      [32, "Wayfinding sign 3 — plan, elevations and materials"],
      [33, "Wayfinding sign 4 — locations on site"],
      [34, "Wayfinding sign 4 — plan, elevations and materials"],
      [35, "Wayfinding sign 5 — locations on site"],
      [36, "Public-realm elements — distribution on site"],
      [37, "Lighting — design language of the poles and units"],
      [38, "Lighting unit 1 — locations on site"],
      [39, "Lighting unit 2 — locations on site"],
      [40, "Lighting unit 3 — locations on site"],
      [41, "Lighting unit 4 — locations on site"],
      [42, "Light poles — locations on site"],
      [43, "Lighting distribution in the public realm"]
    ])
  },
  {
    slug: "airshow",
    category: "design",
    title: "El Alamein International Airshow",
    tags: ["Landscape Design", "Promenade Design", "3D Modeling"], // your part, shown on the card
    type: "Exhibition & aviation hub",
    location: "El Alamein, Egypt",
    year: "",
    summary: "An iconic arrival experience for Egypt's international airshow.",
    concept: "The building is read as an aviation gateway: a symmetrical arrival plaza and a central drum lead visitors into a light-filled exhibition hall, with layered spaces organised over ground and mezzanine floors, a landscaped promenade and a dedicated presidential route.",
    stages: [
      { title: "Zoning & site layout", text: "Concept zoning diagram, site layout and visitor flows." },
      { title: "Floor plans", text: "Ground and mezzanine floor plans with area schedules." },
      { title: "Massing & systems", text: "Evolution of the massing, anatomy of the form and integrated building systems." },
      { title: "Exterior & landscape", text: "Arrival, aerial and promenade views; landscape and welcome-visitor areas.", mine: true },
      { title: "Interiors", text: "Registration hall, presidential stand, welcome hall, atrium and exhibition levels." },
      { title: "Sections & presidential route", text: "Architectural sections through the halls and the VIP sequence." }
    ],
    roleLine: "Landscape and promenade design, and 3D modeling of the surrounding buildings, within the DOSOR STUDIO team.",
    stage: ["Design Development"],
    team: "DOSOR STUDIO design team — the main buildings were designed by the team",
    software: ["SketchUp"],
    role: [
      "Designed the landscape of the site: plazas and green areas around the buildings",
      "Designed the promenade — the landscaped pedestrian spine that links the site",
      "Built the 3D model of the surrounding buildings, based on the existing design, to complete the site model"
    ],
    images: imgs("airshow", 44),
    // image numbers refer to assets/img/projects/airshow/NN.jpg
    work: work("airshow", [
      [13, "A unified spatial vision — aerial view of the landscape"],
      [6, "Site layout — landscape plan"],
      [27, "Landscape zoning — outdoor galleries and the promenade"],
      [28, "Landscape — welcome areas for visitors"],
      [19, "The back promenade — aerial view"],
      [24, "The promenade in motion"],
      [25, "The promenade in motion"],
      [26, "The promenade — views along the route"],
      [12, "Entrance plaza"],
      [23, "Plaza detail — heritage in contemporary detail"],
      [41, "Arrival plaza"],
      [14, "Aerial view — landscape between the parking and the airfield"],
      [15, "Landscape in full harmony with the buildings"],
      [16, "Aerial perspective"],
      [17, "Aerial view of the site"],
      [18, "Aerial view from the airfield"],
      [44, "Aerial view along the landscape axis"],
      [10, "Site model — landscape and surrounding buildings"],
      [11, "Site model — connecting land and sky"]
    ])
  },
  {
    slug: "abraj-khaznah",
    category: "design",
    title: "Abraj Khaznah",
    tags: ["3D Modeling & Façade Skins", "Façade Studies", "Visualization"], // your part, shown on the card
    type: "High-rise residential towers",
    location: "Makkah, KSA",
    year: "",
    summary: "Residential towers with a classical, layered façade language.",
    concept: "Towers are grouped around a landscaped central boulevard. A tripartite façade — arcaded base, rhythmic shaft and crowned top — gives the complex a dignified identity, carried down to signage and street furniture. DOSOR STUDIO's scope was the visualization of the project and the design of its signage, poles and seating.",
    stages: [
      { title: "Massing", text: "Master layout and tower massing." },
      { title: "Façade & materials", text: "Façade layers, design vocabulary, lighting and material distribution.", mine: true },
      { title: "Visualization", text: "Aerial, street-level, day and night renders — built on the 3D model.", mine: true },
      { title: "Public realm", text: "Wayfinding signage and street furniture details." }
    ],
    roleLine: "3D modeling of the buildings and façade skins (with two teammates), and façade studies.",
    stage: ["Visualization"],
    team: "DOSOR STUDIO — modeling by a team of three",
    software: ["SketchUp"],
    role: [
      "Built the 3D model of the buildings and their façade skins, with two teammates, for the project's visualization",
      "Prepared the façade layers analysis — how the façade is built up from structure to screens",
      "Prepared the façade design vocabulary: rawasheen and openings, podium arcades, gates and entrances",
      "Studied the lighting distribution on the façades",
      "Mapped the signage types on the buildings"
    ],
    images: imgs("abraj-khaznah", 19),
    // 01–15: renders and public realm (team) · 16–19: my studies
    work: work("abraj-khaznah", [
      [16, "Façade layers analysis"],
      [17, "Façade design vocabulary — rawasheen, podium arcades, gates and entrances"],
      [18, "Lighting distribution study on the façades"],
      [19, "Signage types on the buildings"]
    ])
  },
  {
    slug: "fitness-time",
    category: "design",
    title: "Fitness Time — Al Aared",
    tags: ["Interior Design", "Gym Area"], // first two show on the card
    type: "Fitness club interior",
    location: "KSA",
    year: "",
    summary: "Interior enhancement of a full-scale fitness club — I designed the gym area.",
    concept: "A bold brand-led interior: dark surfaces, red accents and linear lighting create energy in the training zones, softened by warm timber in the lounge and pilates areas. I designed the gym area — the PT desk, boxing, cardio, strength and the running track.",
    decisions: [
      "One brand language across the gym: dark walls, red bands and the FT mark",
      "Linear and grid lighting in the ceiling to give each training zone its own rhythm",
      "A BOX12 feature wall with lit graphics for the boxing zone",
      "Turf flooring for the functional training areas",
      "A running track along the edge of the gym, under a skylight"
    ],
    stages: [
      { title: "Arrival", text: "Main reception, entrance and lounge." },
      { title: "Gym area", text: "PT desk, boxing, cardio, strength and running track.", mine: true },
      { title: "Studios", text: "Pilates, spinning and GX studio." },
      { title: "Wet areas", text: "Pool and lockers." }
    ],
    roleLine: "Designed the interior of the gym area — PT desk, boxing, cardio, strength and running track.",
    stage: ["Design"],
    team: "DOSOR STUDIO design team — other areas by teammates",
    software: ["SketchUp", "D5 Render"],
    role: [
      "Designed the interior of the gym area within the club's brand language",
      "Designed the PT desk, the boxing zone with its BOX12 feature wall, and the cardio and strength zones",
      "Designed the running track along the gym edge under the skylight",
      "Set the lighting, materials and graphics for each training zone",
      "Modeled the gym in SketchUp and rendered it in D5 Render"
    ],
    images: imgs("fitness-time", 25),
    // 01–14: gym area (mine) · 15–25: other areas (team)
    work: work("fitness-time", [
      [1, "PT desk — gym reception"],
      [2, "PT desk and gym entrance"],
      [3, "PT desk — view into the gym"],
      [4, "Boxing zone"],
      [5, "Boxing zone — BOX12 feature wall"],
      [6, "Boxing zone — general view"],
      [7, "Cardio and functional training"],
      [8, "Functional training on turf"],
      [9, "Functional training on turf"],
      [10, "Cardio — bikes"],
      [11, "Cardio — treadmills and ellipticals"],
      [12, "Pure strength zone"],
      [13, "Running track"],
      [14, "Running track under the skylight"]
    ])
  },
  {
    slug: "ftx",
    category: "design",
    title: "FTX",
    tags: ["Façade Design", "Client-approved Design", "3D Visualization"], // first two show on the card
    type: "Gym façade design",
    location: "KSA",
    year: "",
    summary: "A gym façade I designed and the client approved — after four earlier options of mine.",
    concept: "A dynamic perforated façade: stepped geometric volumes in a warm sandy-orange finish, layered with patterned screens. The stepped masses give depth, rhythm and movement along the street, the repeated geometric motif gives the building a recognisable identity, and the warm, earthy palette expresses the energy and strength of a contemporary fitness destination. The client approved this design, and I am now developing it into colour and material options. It followed a first round of six façade options, four of which were mine (options 1, 3, 4 and 5).",
    decisions: [
      "Approved design — stepped vertical volumes that create depth and rhythm along the street",
      "Patterned perforated screens between the volumes for texture, shading and a strong visual identity",
      "A warm sandy-orange palette against dark glazing and a dark base",
      "Solid & void study to balance the masses against the openings",
      "Lighting study: warm grazing light that picks out the folds and screens at night",
      "After approval: four colour options and three material variations sent for the client's choice",
      "Earlier round — option 1: perforated white screens with a red, flowing canopy over the entrance",
      "Earlier round — option 3: red and black vertical panels with large-scale branding",
      "Earlier round — option 4: alternating red and black bands that wrap the whole building",
      "Earlier round — option 5: a pixelated, checkerboard skin of red and black panels"
    ],
    stages: [
      { title: "First round", text: "Six façade options — 1, 3, 4 and 5 by me.", mine: true },
      { title: "New design", text: "Dynamic perforated façade — approved by the client.", mine: true },
      { title: "Façade studies", text: "Solid & void and lighting studies.", mine: true },
      { title: "Colour & material", text: "Four colour options and three material variations.", mine: true }
    ],
    roleLine: "Designed the client-approved façade, and 4 of the 6 options in the first round.",
    stage: ["Concept", "Design development"],
    team: "DOSOR STUDIO design team — first-round options 2 and 6 by teammates",
    software: ["SketchUp", "AI Rendering"],
    role: [
      "Designed the approved façade: concept, massing diagram, solid & void and lighting studies",
      "Developed it into four colour options and three material variations for the client",
      "Designed four of the six first-round options: options 1, 3, 4 and 5",
      "Modeled every design in SketchUp and produced day and night views with AI rendering"
    ],
    images: imgs("ftx", 45),
    cover: img("ftx", 36), // approved design — corner view
    // 01: option 4 · 02–20: options 1, 3, 4, 5 (mine) · 21–32: options 2 and 6 · 33–34: comparison · 35–45: approved design (mine)
    work: work("ftx", [
      [36, "Approved design — corner view"],
      [37, "Approved design — street elevation"],
      [38, "Approved design — side view"],
      [39, "Approved design — night view"],
      [35, "Approved design — design concept and façade layers"],
      [40, "Approved design — solid & void and lighting studies"],
      [41, "Colour option 1"],
      [42, "Colour option 2"],
      [43, "Colour option 3"],
      [44, "Colour option 4"],
      [45, "Material variations"],
      [2, "Option 1 — street view"],
      [3, "Option 1 — front view"],
      [4, "Option 1 — corner view"],
      [5, "Option 1 — night view"],
      [6, "Option 1 — design concept"],
      [7, "Option 3 — corner view"],
      [8, "Option 3 — front view"],
      [9, "Option 3 — street view"],
      [10, "Option 3 — night view"],
      [11, "Option 3 — design concept"],
      [1, "Option 4 — front view"],
      [12, "Option 4 — corner view"],
      [13, "Option 4 — street view"],
      [14, "Option 4 — night view"],
      [15, "Option 4 — design concept"],
      [16, "Option 5 — corner view"],
      [17, "Option 5 — front view"],
      [18, "Option 5 — street view"],
      [19, "Option 5 — night view"],
      [20, "Option 5 — design concept"]
    ])
  },
  {
    slug: "kix",
    category: "technical",
    title: "KIX Futsal Complex",
    tags: ["Working Drawings", "Elevations & Counter Details"], // your part, shown on the card
    type: "Interior working drawings",
    location: "KSA",
    year: "",
    summary: "An interior technical package for a futsal complex — I drew the reception and speed lap elevations and the counter details.",
    concept: "Translating the interior design into buildable information across reception, administration, wet areas, courts, padbol, stadium and speed lap — coordinated with the design renders on every sheet. I prepared the interior elevations of the reception and the speed lap, and the details of the reception desk, juice bar and speed lap reception counters.",
    stages: [
      { title: "Plans", text: "Floor, ceiling and finishes plans." },
      { title: "Blow-up elevations", text: "Room-by-room interior elevations — reception and speed lap by me.", mine: true },
      { title: "Stadium & courts", text: "Stadium and court elevations and sections." },
      { title: "Details & schedules", text: "Reception counters, joinery, wall details and door schedules — the counter details by me.", mine: true }
    ],
    roleLine: "Prepared the interior elevations of the reception and the speed lap, and the counter details.",
    stage: ["Working Drawings"],
    team: "DOSOR STUDIO technical team — other zones by teammates",
    software: ["AutoCAD"],
    role: [
      "Prepared the interior elevations of the reception — 3 sheets",
      "Prepared the interior elevations of the speed lap zone — 17 sheets",
      "Detailed the reception desk, the juice bar counter and the speed lap reception counter — elevations, sections and construction details",
      "Drew each room with a key plan and elevations at 1:20, with finishes, levels and notes, coordinated with the design renders",
      "Drafted all sheets in AutoCAD within the project's title-block standard"
    ],
    images: imgs("kix", 33),
    cover: img("kix", 2), // reception elevations, sheet 1
    // 01: cover (speed lap sheet 10) · 02–04 reception · 05–20 speed lap · 29–33 counter details — all mine · 21–28 other zones (team)
    work: work("kix", [
      [2, "Reception — interior elevations, sheet 1"],
      [3, "Reception — interior elevations, sheet 2"],
      [4, "Reception — interior elevations, sheet 3"],
      [5, "Speed lap — interior elevations, sheet 1"],
      [6, "Speed lap — interior elevations, sheet 2"],
      [7, "Speed lap — interior elevations, sheet 3"],
      [8, "Speed lap — interior elevations, sheet 4"],
      [9, "Speed lap — interior elevations, sheet 5"],
      [10, "Speed lap — interior elevations, sheet 6"],
      [11, "Speed lap — interior elevations, sheet 7"],
      [12, "Speed lap — interior elevations, sheet 8"],
      [13, "Speed lap — interior elevations, sheet 9"],
      [1, "Speed lap — interior elevations, sheet 10"],
      [14, "Speed lap — interior elevations, sheet 11"],
      [15, "Speed lap — interior elevations, sheet 12"],
      [16, "Speed lap — interior elevations, sheet 13"],
      [17, "Speed lap — interior elevations, sheet 14"],
      [18, "Speed lap — interior elevations, sheet 15"],
      [19, "Speed lap — interior elevations, sheet 16"],
      [20, "Speed lap — interior elevations, sheet 17"],
      [29, "Reception desk — counter elevations and detail (ID-404)"],
      [30, "Reception desk — counter sections (ID-405)"],
      [31, "Juice bar — café counter elevations and detail (ID-406)"],
      [32, "Juice bar — café counter elevations, section and detail (ID-407)"],
      [33, "Speed lap reception — counter elevations and section (ID-408)"]
    ])
  },
  {
    slug: "faisal-gym",
    category: "technical",
    title: "Mr. Faisal Gym",
    tags: ["Working Drawings", "Interior Elevations"], // your part, shown on the card
    type: "Interior working drawings",
    location: "Riyadh, KSA",
    year: "",
    summary: "Interior working drawings for a private gym — I drew all the interior elevations.",
    concept: "A complete set that describes the interior for pricing and construction: from general notes and plans to ceilings, lighting, elevations and joinery details. I prepared the interior elevations of every space — corridor, hair salon, massage room, rest room, shower, wash area and cold plunge, and the gym.",
    stages: [
      { title: "General", text: "Cover sheet, drawing list and general notes." },
      { title: "Plans", text: "Builder, flooring, ceiling, electrical and lighting plans." },
      { title: "Elevations", text: "Corridor, room and gym interior elevations — 10 sheets by me.", mine: true },
      { title: "Details", text: "Joinery, general details and doors." }
    ],
    roleLine: "Prepared all the interior elevations — 10 sheets, ID-201 to ID-210.",
    stage: ["Working Drawings"],
    team: "DOSOR STUDIO technical team — plans and details by teammates",
    software: ["AutoCAD"],
    role: [
      "Prepared the interior elevations of every space: corridor, hair salon, massage room, rest room, shower, wash area and cold plunge, and gym",
      "Drew each room with its key plan and elevations, referenced to the project's finishes legend and detail sheets",
      "Drafted all 10 sheets (ID-201 to ID-210) in AutoCAD"
    ],
    images: imgs("faisal-gym", 17),
    // 01–10: interior elevations (mine) · 11–17: cover, plans and details (team)
    work: work("faisal-gym", [
      [2, "Corridor — plan and elevations (ID-201)"],
      [3, "Corridor — elevations, sheet 2 (ID-202)"],
      [4, "Hair salon — plan and elevations (ID-203)"],
      [5, "Massage room — elevations (ID-204)"],
      [6, "Rest room — plan and elevations (ID-205)"],
      [7, "Shower — plan and elevations (ID-206)"],
      [8, "Wash area and cold plunge — elevations (ID-207)"],
      [9, "Wash area and cold plunge — elevations, sheet 2 (ID-208)"],
      [1, "Gym — interior elevations (ID-209)"],
      [10, "Gym — interior elevations, sheet 2 (ID-210)"]
    ])
  },
  {
    slug: "cardiology-hospital",
    category: "academic",
    title: "Cardiology Hospital",
    tags: ["Architectural Design", "Landscape", "3D Visualization"],
    type: "Graduation project · 150-bed cardiology hospital",
    location: "Assiut City, Egypt",
    year: "2024",
    team: "Individual",
    summary: "A cardiology hospital on the Nile, designed as a healing environment — not just a hospital.",
    concept: "For heart patients, a large part of recovery is psychological. So beyond function, the design sets out to give patients visual, acoustic and psychological comfort — something missing in most hospitals in Egypt, especially in Upper Egypt. It starts with the site: a plot directly overlooking the Nile, whose long side runs roughly north-east to north-west. Site studies of orientation, sun path, traffic and noise then shaped a mass that does the job and keeps people comfortable.",
    decisions: [
      "A Nile-front site — direct river views support patients' psychological recovery",
      "Six blocks — emergency, outpatient clinics, radiology, labs, administration and reception — linked by one main spine",
      "Separate circulation for patients, visitors and medical staff, following hospital design principles",
      "The mass follows the long shape of the site to make the most of the land",
      "All inpatient rooms face north",
      "A heavily articulated south façade that shades itself, with few openings — mostly service spaces — protected by louvers",
      "Louvers and a GRC screen in front of the windows to cut solar heat gain",
      "A courtyard in every block for natural light and natural ventilation of every space",
      "Green roofs for climate and appearance, and solar power for a measure of sustainability",
      "Site constraints — a nearby bridge and a single street on the short side — studied and resolved in the layout"
    ],
    stages: [
      { title: "Site selection & studies", text: "A Nile-front plot; north, sun path, traffic and noise studies.", mine: true },
      { title: "Program & zoning", text: "Six departments on one main spine; separate patient, visitor and staff routes.", mine: true },
      { title: "Climate-driven form", text: "North-facing rooms, a self-shading south façade, louvers and GRC screens.", mine: true },
      { title: "Courtyards & sustainability", text: "A courtyard in every block, green roofs and solar power.", mine: true },
      { title: "Plans & visualization", text: "Site layout, floor plans, 3D model and renders.", mine: true }
    ],
    roleLine: "Individual graduation project — I designed it from brief to final presentation.",
    stage: ["Site Analysis", "Concept", "Design Development", "Presentation"],
    software: ["AutoCAD", "Revit", "SketchUp", "Lumion", "Photoshop"],
    role: [
      "Selected a Nile-front site and studied orientation, sun path, traffic and noise",
      "Defined the program and zoned it into six blocks on one main spine with separate circulation",
      "Shaped the mass and façades for the climate: north-facing rooms, a self-shading south façade, louvers and GRC screens",
      "Designed courtyards, green roofs and solar power for comfort and sustainability",
      "Drafted in AutoCAD, modeled in Revit and SketchUp, rendered in Lumion and laid out the boards in Photoshop"
    ],
    images: imgs("cardiology-hospital", 23),
    work: work("cardiology-hospital", [
      [1, "Aerial view of the hospital"],
      [2, "Project cover"],
      [3, "Site location — Assiut City, Egypt"],
      [4, "Environmental studies — wind, sun and temperature"],
      [5, "Site analysis — sun path, wind, traffic and noise"],
      [6, "Environmental ideas — louvers, green roof, solar panels, courtyards"],
      [7, "Form generation — from one block to six blocks with courtyards"],
      [8, "Structural system — flat slab"],
      [9, "3D functional zoning"],
      [10, "Site layout"],
      [11, "Floor plans"],
      [12, "Floor plans and site plan"],
      [13, "Site entrance and signage"],
      [14, "Entrance plaza with water feature"],
      [15, "Approach to the hospital"],
      [16, "Approach and drop-off canopy"],
      [17, "Street along the site"],
      [18, "Main entrance"],
      [19, "View across the landscape"],
      [20, "Street along the site"],
      [21, "Entrance plaza"],
      [22, "Glazed main façade"],
      [23, "Perspective sketch view"]
    ])
  },
  {
    slug: "rehab-center",
    category: "academic",
    title: "Rehabilitation Center for Street Children",
    tags: ["Architectural Design", "Landscape", "3D Visualization"],
    type: "Graduation project · 20-feddan campus (≈ 84,000 m²)",
    location: "New Qena, Egypt",
    year: "2024",
    team: "Individual",
    summary: "A campus that recreates the freedom of street life in a safe setting — so children choose to stay.",
    concept: "Projects like this are rare in Egypt and the Arab world, and most of them stop for two reasons: children are afraid of a place so different from the free street life they know, and the project depends on donor funding that can end — sending the children back to the street. So the concept is to simulate the life of a street child — freedom, movement, gathering with other children, the kind of housing they know, and mixing with people — in a better form, while adding what was missing: education, healthy food and a craft. The site is in New Qena, in the middle of Upper Egypt, so it can serve the whole region: at first the project's own vehicles bring children in, and once they trust it, they come by themselves.",
    decisions: [
      "A site in New Qena, central to Upper Egypt, to serve children across the region",
      "Three communities to rebuild social and family ties: a large one (children with visitors), a medium one (children together in play and gathering areas) and a small one (children in their home)",
      "Visitors come in — to the exhibitions, open gallery and bazaars — so the child never feels locked away, and their visits bring income that eases the funding problem",
      "A small rehabilitation building first, near the entrance, with its own housing for new children — small so it doesn't feel intimidating",
      "The entertainment zone sits a little further away, so new children get to know the campus and make friends on the way",
      "Children's route: rehabilitation → entertainment → education, restaurant and laundry (near the street for services) → housing, mosque, recreation and courts",
      "Visitors' route: theatre, administration and visits → exhibitions of the children's workshop products → open gallery → bazaars",
      "Simple, straight-lined masses so nothing feels strange or intimidating, with arches on the façades to soften them",
      "Generous green open spaces — a cleaner, healthier environment and a sense of freedom",
      "The exhibition zone is visible from the street and angled toward passers-by to draw people in",
      "Apartment-style housing instead of dormitory rooms, to give the child a sense of family"
    ],
    stages: [
      { title: "Research & goals", text: "Why similar projects stop: children's fear of an unfamiliar place and dependence on donor funding.", mine: true },
      { title: "Site & routes", text: "New Qena, central to Upper Egypt; separate routes for children and visitors.", mine: true },
      { title: "Concept & communities", text: "Simulating street life — freedom, gathering, mixing — in large, medium and small communities.", mine: true },
      { title: "Form & zoning", text: "From the hand concept to simple masses, arched façades and the final zoning.", mine: true },
      { title: "Environment", text: "Green open spaces, shading, ventilation and passive treatments.", mine: true },
      { title: "Visualization", text: "Courtyard and campus renders.", mine: true }
    ],
    roleLine: "Individual graduation project — I designed it from brief to final presentation.",
    stage: ["Research", "Concept", "Design Development", "Presentation"],
    software: ["AutoCAD", "Revit", "SketchUp", "Lumion", "AI Rendering", "Photoshop"],
    role: [
      "Researched similar projects in Egypt and the Arab world, and why they stop: children's fear and funding",
      "Chose a site in New Qena, central to Upper Egypt, and planned separate routes for children and visitors",
      "Built the concept around simulating street life, organized in three communities",
      "Shaped the campus: a small rehabilitation building first, simple masses with arched façades and generous green spaces",
      "Drafted in AutoCAD, modeled in Revit and SketchUp, rendered in Lumion with AI rendering, and laid out the boards in Photoshop"
    ],    images: imgs("rehab-center", 17),
    work: work("rehab-center", [
      [1, "Aerial view of the campus"],
      [2, "Project identity"],
      [3, "Concept"],
      [4, "Project goals"],
      [8, "User scenarios — children and visitors"],
      [5, "Site analysis decisions"],
      [6, "Form generation — from the hand concept"],
      [7, "Layout zoning"],
      [17, "Environmental treatments"],
      [9, "Arched courtyard"],
      [10, "Craft exhibition courtyard"],
      [11, "Courtyard promenade"],
      [12, "Cultural plaza"],
      [13, "School courtyard"],
      [14, "Mosque courtyard"],
      [15, "School gathering space"],
      [16, "Sports court"]
    ])
  }
];

// projects marked  hidden: true  stay in this file but are not shown anywhere on the site
window.PROJECTS = PROJECTS.filter(p => !p.hidden).map(p => ({ cover: p.images[0], ...p }));
