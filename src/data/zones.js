const ROUTE_ZONES = [
  {
    id: 'arrival',
    name: 'Siloso Point — Cable Car Station',
    timeStart: 0,
    timeEnd: 18,
    lat: 1.2563,
    lng: 103.8092,
    plaque: {
      title: 'Welcome to Sentosa',
      subtitle: '25 million visitors a year — and a secret beneath their feet',
      body: "You're standing at Siloso Point. Theme parks, beaches, hotels — Sentosa is Singapore's playground. But hidden on the rocky shore just ahead is one of the island's best-kept secrets: a living seagrass meadow.",
      icon: 'Compass',
    },
  },
  {
    id: 'fort-siloso',
    name: 'Fort Siloso Entrance',
    timeStart: 18,
    timeEnd: 36,
    lat: 1.2575,
    lng: 103.8082,
    plaque: {
      title: 'A Fort Above, A Meadow Below',
      subtitle: 'Fort Siloso — built 1880s, still guarding the shore',
      body: "This coastal fort once defended Keppel Harbour from naval attacks. Today, it unknowingly guards something equally precious — the seagrass growing on the rocky shore directly beneath it.",
      icon: 'Shield',
    },
  },
  {
    id: 'coastal-descent',
    name: 'Coastal Trail Descent',
    timeStart: 36,
    timeEnd: 54,
    lat: 1.2582,
    lng: 103.8075,
    plaque: {
      title: 'What Is Seagrass?',
      subtitle: 'Not seaweed — true flowering plants',
      body: "Seagrass are the only flowering plants that live entirely underwater in the sea. They have roots, leaves, and produce flowers and seeds — just like plants on land. Singapore has 12 species despite being one of Earth's most urbanized coastlines.",
      icon: 'Sprout',
      stat: '12 species in Singapore',
    },
  },
  {
    id: 'rocky-shore',
    name: 'Tanjung Rimau Rocky Shore',
    timeStart: 54,
    timeEnd: 76,
    lat: 1.2587,
    lng: 103.8068,
    plaque: {
      title: 'Tape Seagrass',
      subtitle: 'Enhalus acoroides',
      body: "Here on this rocky shore, clumps of Tape seagrass survive — Singapore's longest species, with leaves reaching 1.5 meters. Its tiny male flowers float on the water surface like white styrofoam beads to reach the large female flowers.",
      icon: 'Leaf',
      stat: '2 species found at this site',
    },
  },
  {
    id: 'blue-carbon',
    name: 'Intertidal Zone',
    timeStart: 76,
    timeEnd: 96,
    lat: 1.2590,
    lng: 103.8063,
    plaque: {
      title: 'Blue Carbon Powerhouse',
      subtitle: 'The invisible superpower of seagrass',
      body: "Seagrass captures carbon 35× faster than tropical rainforests. Even this small meadow quietly stores CO₂ in its roots and sediment — carbon locked away for thousands of years. Globally, seagrass provides ecosystem services worth $6.4 trillion per year.",
      icon: 'Zap',
      stat: '35× faster than rainforests',
      animatedCounter: true,
    },
  },
  {
    id: 'survivors',
    name: 'Reclamation Edge',
    timeStart: 96,
    timeEnd: 116,
    lat: 1.2585,
    lng: 103.8058,
    plaque: {
      title: 'Survivors',
      subtitle: 'Seagrass that outlasted a mega-resort',
      body: "When Resorts World Sentosa was built, the shore here was partially reclaimed. Researchers feared the seagrass was lost. But patches of Sickle seagrass and Spoon seagrass were found still growing — just meters from the construction site. Life persists.",
      icon: 'AlertTriangle',
      stat: '29% of global seagrass lost since the 1800s',
    },
  },
  {
    id: 'action',
    name: 'Return — Your Turn',
    timeStart: 116,
    timeEnd: 140,
    lat: 1.2575,
    lng: 103.8082,
    plaque: {
      title: 'Your Turn',
      subtitle: 'From curiosity to conservation',
      body: "You've just discovered a living ecosystem that 25 million annual visitors walk past without knowing. Log your sighting. Fund restoration. Tell someone. The meadow beneath Fort Siloso doesn't need a fort — it needs you.",
      icon: 'HeartHandshake',
      cta: true,
    },
  },
];

// Polyline for the mini-map — Siloso Point → Fort Siloso → Coastal descent → Rocky shore → back
export const ROUTE_POLYLINE = [
  [1.2563, 103.8092], // Siloso Point
  [1.2567, 103.8088],
  [1.2571, 103.8085],
  [1.2575, 103.8082], // Fort Siloso entrance
  [1.2578, 103.8079],
  [1.2582, 103.8075], // Coastal descent
  [1.2585, 103.8071],
  [1.2587, 103.8068], // Rocky shore - seagrass
  [1.2590, 103.8063], // Intertidal zone
  [1.2588, 103.8060],
  [1.2585, 103.8058], // Reclamation edge
  [1.2582, 103.8062], // Return path
  [1.2578, 103.8070],
  [1.2575, 103.8082], // Back to Fort Siloso
];

export default ROUTE_ZONES;
