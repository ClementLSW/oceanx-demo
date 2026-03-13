const ROUTE_ZONES = [
  {
    id: 'arrival',
    name: 'Siloso Point — Cable Car Station',
    timeStart: 0,
    timeEnd: 17,
    lat: 1.2563,
    lng: 103.8092,
    audio: '/audio/narration-01-arrival.mp3',
    plaque: {
      title: 'Welcome to Sentosa',
      subtitle: '19 million visitors a year — and a secret beneath their feet',
      body: "You're standing at Siloso Point. Theme parks, beaches, hotels — Sentosa is Singapore's playground. But hidden on the rocky shore just ahead is one of the island's best-kept secrets: a living seagrass meadow.",
      icon: 'Compass',
    },
  },
  {
    id: 'fort-siloso',
    name: 'Fort Siloso Entrance',
    timeStart: 17,
    timeEnd: 35,
    lat: 1.2575,
    lng: 103.8082,
    audio: '/audio/narration-02-fort.mp3',
    plaque: {
      title: 'A Fort Above, A Meadow Below',
      subtitle: 'Fort Siloso — built from 1878, still guarding the shore',
      body: "This coastal fort once defended the western entrance to Keppel Harbour. Today, it unknowingly guards something equally precious — the seagrass growing on the rocky shore directly beneath it.",
      icon: 'Shield',
    },
  },
  {
    id: 'coastal-descent',
    name: 'Coastal Trail Descent',
    timeStart: 35,
    timeEnd: 55,
    lat: 1.2582,
    lng: 103.8075,
    audio: '/audio/narration-03-seagrass-intro.mp3',
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
    timeStart: 55,
    timeEnd: 81,
    lat: 1.2587,
    lng: 103.8068,
    audio: '/audio/narration-04-tape-seagrass.mp3',
    plaque: {
      title: 'Tape Seagrass',
      subtitle: 'Enhalus acoroides',
      body: "Here on this rocky shore, clumps of Tape seagrass survive — Singapore's longest species, with leaves reaching 1.5 meters. Its tiny male flowers float on the water surface like white styrofoam beads to reach the large female flowers.",
      icon: 'Leaf',
      stat: '4 species found at this shore',
    },
  },
  {
    id: 'blue-carbon',
    name: 'Intertidal Zone',
    timeStart: 81,
    timeEnd: 101,
    lat: 1.2590,
    lng: 103.8063,
    audio: '/audio/narration-05-carbon.mp3',
    plaque: {
      title: 'Blue Carbon Powerhouse',
      subtitle: 'The invisible superpower of seagrass',
      body: "Seagrass captures carbon up to 35× faster than tropical rainforests per unit area. Even this small meadow quietly stores CO₂ in its roots and sediment — carbon locked away for thousands of years. Globally, seagrass covers just 0.1% of the ocean floor but accounts for up to 18% of all carbon buried in ocean sediments.",
      icon: 'Zap',
      stat: 'Up to 35× faster than rainforests',
      animatedCounter: true,
    },
  },
  {
    id: 'survivors',
    name: 'Reclamation Edge',
    timeStart: 101,
    timeEnd: 133,
    lat: 1.2585,
    lng: 103.8058,
    audio: '/audio/narration-06-survivors.mp3',
    plaque: {
      title: 'Survivors',
      subtitle: 'Seagrass that outlasted a mega-resort',
      body: "When Resorts World Sentosa was built, the shore here was partially reclaimed. Researchers feared the seagrass was lost. But Tape seagrass, Sickle seagrass, and Spoon seagrass were found still growing — just meters from the construction site. Life persists.",
      icon: 'AlertTriangle',
      stat: '29% of global seagrass lost since the 1800s',
    },
  },
  {
    id: 'action',
    name: 'Return — Your Turn',
    timeStart: 133,
    timeEnd: 158,
    lat: 1.2575,
    lng: 103.8082,
    audio: '/audio/narration-07-action.mp3',
    plaque: {
      title: 'Your Turn',
      subtitle: 'From curiosity to conservation',
      body: "You've just discovered a living ecosystem that 19 million annual visitors walk past without knowing. Log your sighting. Fund restoration. Tell someone. The meadow beneath Fort Siloso doesn't need a fort — it needs you.",
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
