/**
 * @file data.js
 * @description All static data for StadiumIQ.
 *              Frozen with Object.freeze() for immutability.
 *              Single source of truth for all content.
 *              Includes FIFA WC 2026 venues, zones, transport,
 *              accessibility facilities, and sustainability data.
 * @author StadiumIQ
 * @version 1.0.0
 */

const STADIUM_DATA = Object.freeze({

  /** FIFA World Cup 2026 tournament info */
  tournament: Object.freeze({
    name: 'FIFA World Cup 2026',
    dates: 'June 11 — July 19, 2026',
    final: 'July 19, 2026 — MetLife Stadium, New Jersey',
    teams: 48,
    matches: 104,
    hostNations: Object.freeze(['USA', 'Canada', 'Mexico']),
    expectedAttendance: '5 million+',
    fanNationalities: '200+'
  }),

  /** All 16 official FIFA WC 2026 venues */
  venues: Object.freeze([
    Object.freeze({
      id: 'metlife',
      name: 'MetLife Stadium',
      city: 'East Rutherford, NJ',
      country: 'USA',
      capacity: 82500,
      matches: 8,
      isVenueFinal: true,
      lat: 40.8135,
      lng: -74.0745,
      gates: Object.freeze(['Gate A — North', 'Gate B — East', 'Gate C — South', 'Gate D — West']),
      transport: Object.freeze(['NJ Transit Bus', 'Shuttle from Times Square', 'Park & Ride'])
    }),
    Object.freeze({
      id: 'attstadium',
      name: 'AT&T Stadium',
      city: 'Arlington, TX',
      country: 'USA',
      capacity: 80000,
      matches: 8,
      isVenueFinal: false,
      lat: 32.7480,
      lng: -97.0931,
      gates: Object.freeze(['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4']),
      transport: Object.freeze(['Dallas Area Rapid Transit', 'Uber/Lyft Zone A', 'Fan Bus'])
    }),
    Object.freeze({
      id: 'sofistadium',
      name: 'SoFi Stadium',
      city: 'Inglewood, CA',
      country: 'USA',
      capacity: 70240,
      matches: 7,
      isVenueFinal: false,
      lat: 33.9535,
      lng: -118.3392,
      gates: Object.freeze(['Gate N', 'Gate E', 'Gate S', 'Gate W']),
      transport: Object.freeze(['Metro Rail C Line', 'Shuttle', 'Ride Share Zone'])
    }),
    Object.freeze({
      id: 'azteca',
      name: 'Estadio Azteca',
      city: 'Mexico City',
      country: 'Mexico',
      capacity: 87523,
      matches: 5,
      isVenueFinal: false,
      lat: 19.3029,
      lng: -99.1505,
      gates: Object.freeze(['Puerta 1', 'Puerta 5', 'Puerta 9', 'Puerta 14']),
      transport: Object.freeze(['Metro Línea 2', 'RTP Bus', 'Metrobús'])
    }),
    Object.freeze({
      id: 'bcplace',
      name: 'BC Place',
      city: 'Vancouver, BC',
      country: 'Canada',
      capacity: 54500,
      matches: 6,
      isVenueFinal: false,
      lat: 49.2767,
      lng: -123.1115,
      gates: Object.freeze(['Gate A', 'Gate B', 'Gate C', 'Gate D']),
      transport: Object.freeze(['SkyTrain Stadium-Chinatown', 'Canada Line', 'Fan Bus'])
    })
  ]),

  /** Stadium zones with crowd capacity data */
  zones: Object.freeze([
    Object.freeze({
      id: 'north_stand',
      name: 'North Stand',
      icon: '🔴',
      capacity: 15000,
      currentCrowd: 12400,
      color: '#ef4444',
      facilities: Object.freeze(['Food Court A', 'Medical Bay 1', 'Toilets N1-N6']),
      accessibleSeats: 120
    }),
    Object.freeze({
      id: 'south_stand',
      name: 'South Stand',
      icon: '🟢',
      capacity: 18000,
      currentCrowd: 9800,
      color: '#22c55e',
      facilities: Object.freeze(['Food Court B', 'Merchandise Store', 'Toilets S1-S8']),
      accessibleSeats: 150
    }),
    Object.freeze({
      id: 'east_lower',
      name: 'East Lower',
      icon: '🟡',
      capacity: 12000,
      currentCrowd: 10200,
      color: '#f59e0b',
      facilities: Object.freeze(['Premium Lounge', 'VIP Entrance', 'Toilets E1-E4']),
      accessibleSeats: 80
    }),
    Object.freeze({
      id: 'west_lower',
      name: 'West Lower',
      icon: '🔵',
      capacity: 12000,
      currentCrowd: 7600,
      color: '#1a56db',
      facilities: Object.freeze(['Media Center', 'Press Box', 'Toilets W1-W4']),
      accessibleSeats: 80
    }),
    Object.freeze({
      id: 'north_upper',
      name: 'North Upper',
      icon: '🟣',
      capacity: 10000,
      currentCrowd: 8900,
      color: '#7c3aed',
      facilities: Object.freeze(['Snack Bars', 'Fan Zone', 'Toilets NU1-NU3']),
      accessibleSeats: 40
    }),
    Object.freeze({
      id: 'south_upper',
      name: 'South Upper',
      icon: '⚪',
      capacity: 10000,
      currentCrowd: 4200,
      color: '#94a3b8',
      facilities: Object.freeze(['Family Zone', 'Kids Area', 'Toilets SU1-SU3']),
      accessibleSeats: 40
    })
  ]),

  /** Transport options with real-time data */
  transport: Object.freeze({
    options: Object.freeze([
      Object.freeze({
        id: 'metro',
        name: 'Metro / Rail',
        icon: '🚆',
        time: '25-35 min',
        cost: '$3-5',
        frequency: 'Every 8 min',
        sustainability: 'Low carbon',
        tip: 'Fastest option. Buy tickets in advance from the transit app.'
      }),
      Object.freeze({
        id: 'shuttle',
        name: 'Official Shuttle',
        icon: '🚌',
        time: '30-45 min',
        cost: '$12 round trip',
        frequency: 'Every 15 min',
        sustainability: 'Low carbon (electric)',
        tip: 'Departs from official Fan Zones 3 hours before kickoff.'
      }),
      Object.freeze({
        id: 'rideshare',
        name: 'Ride Share',
        icon: '🚗',
        time: '20-60 min',
        cost: '$15-40',
        frequency: 'On demand',
        sustainability: 'Medium carbon',
        tip: 'Use designated drop-off zone to avoid traffic. Surge pricing near kickoff.'
      }),
      Object.freeze({
        id: 'cycling',
        name: 'Bicycle / E-Bike',
        icon: '🚲',
        time: '15-45 min',
        cost: '$0-8',
        frequency: 'Anytime',
        sustainability: 'Zero carbon',
        tip: 'Secure bike parking near all gates. Earn Green Fan points.'
      }),
      Object.freeze({
        id: 'walking',
        name: 'Walking',
        icon: '🚶',
        time: '10-30 min',
        cost: 'Free',
        frequency: 'Anytime',
        sustainability: 'Zero carbon',
        tip: 'If within 2km, walking is fastest. Follow green route markers.'
      })
    ]),
    peakTimes: Object.freeze(['90 min before kickoff', '30 min after final whistle']),
    avoidTime: 'Surge: 60-75 min before kickoff'
  }),

  /** Accessibility facilities */
  accessibility: Object.freeze({
    facilities: Object.freeze([
      Object.freeze({
        id: 'wheelchair',
        icon: '♿',
        title: 'Wheelchair Access',
        description: 'All gates have wheelchair-accessible entrances. Dedicated lifts in each stand. Companion seats available at no extra charge.',
        locations: Object.freeze(['Gate A lift', 'Gate B lift', 'Gate C lift', 'Gate D lift']),
        contact: '+1-800-FIFA-ACC'
      }),
      Object.freeze({
        id: 'visual',
        icon: '👁️',
        title: 'Visual Impairment Support',
        description: 'Audio commentary headsets available at Accessibility Desk. Braille maps and tactile guides at main concourse.',
        locations: Object.freeze(['Accessibility Desk — Gate A', 'Main Concourse Level 1']),
        contact: '+1-800-FIFA-ACC'
      }),
      Object.freeze({
        id: 'hearing',
        icon: '👂',
        title: 'Hearing Assistance',
        description: 'Induction loop system installed throughout. Signing interpreters available for main events.',
        locations: Object.freeze(['All seating areas (loop)', 'Family Stand — signed']),
        contact: '+1-800-FIFA-ACC'
      }),
      Object.freeze({
        id: 'medical',
        icon: '🏥',
        title: 'Medical & First Aid',
        description: 'First aid stations on each level. On-site paramedics throughout the event. Quiet rooms for sensory needs.',
        locations: Object.freeze(['Level 1 North', 'Level 1 South', 'Level 2 East']),
        contact: 'Emergency: 911 | Stadium Medical: x5555'
      }),
      Object.freeze({
        id: 'family',
        icon: '👨👩👧',
        title: 'Family Facilities',
        description: 'Baby changing rooms on all levels. Family first entrance at Gate D. Dedicated family viewing area with full facilities.',
        locations: Object.freeze(['All toilet blocks', 'Gate D — family entrance']),
        contact: '+1-800-FIFA-FAM'
      }),
      Object.freeze({
        id: 'quiet',
        icon: '🔇',
        title: 'Quiet Rooms',
        description: 'Sensory-friendly quiet rooms for fans with autism, anxiety, or sensory processing needs. Available throughout the match.',
        locations: Object.freeze(['Level 1 Room Q1', 'Level 2 Room Q2']),
        contact: 'Ask any steward for access'
      })
    ])
  }),

  /** Sustainability metrics */
  sustainability: Object.freeze({
    targets: Object.freeze({
      renewable_energy_pct: 85,
      waste_recycled_pct: 70,
      water_saved_litres: 2000000,
      carbon_offset_tonnes: 50000,
      single_use_plastic_reduction_pct: 90
    }),
    current: Object.freeze({
      renewable_energy_pct: 78,
      waste_recycled_pct: 64,
      water_saved_litres: 1640000,
      carbon_offset_tonnes: 38000,
      single_use_plastic_reduction_pct: 83
    }),
    initiatives: Object.freeze([
      Object.freeze({
        icon: '☀️',
        title: 'Solar Power',
        description: '12,000 solar panels installed across stadium roof providing 4.2 MW of clean energy.'
      }),
      Object.freeze({
        icon: '💧',
        title: 'Water Recycling',
        description: 'Rainwater harvesting system captures 2M litres per match for toilet flushing and irrigation.'
      }),
      Object.freeze({
        icon: '♻️',
        title: 'Zero Waste Zones',
        description: 'All concession waste sorted at source. 64% recycled, 20% composted, 16% to waste-to-energy.'
      }),
      Object.freeze({
        icon: '🚌',
        title: 'Green Transport',
        description: 'Electric shuttle fleet reduces fan transport emissions by 60% vs personal vehicles.'
      }),
      Object.freeze({
        icon: '🌳',
        title: 'Carbon Offset',
        description: '38,000 tonnes of CO₂ offset through verified forest restoration projects across all 3 host nations.'
      })
    ])
  }),

  /** Operations data for staff and volunteers */
  operations: Object.freeze({
    roles: Object.freeze([
      Object.freeze({
        id: 'steward',
        title: 'Steward',
        icon: '🦺',
        responsibilities: Object.freeze([
          'Gate entry management and ticket scanning',
          'Crowd flow monitoring and direction',
          'Emergency evacuation assistance',
          'Fan assistance and wayfinding'
        ]),
        zones: Object.freeze(['All entry gates', 'Concourse level', 'Seating areas'])
      }),
      Object.freeze({
        id: 'medical',
        title: 'Medical Team',
        icon: '🏥',
        responsibilities: Object.freeze([
          'First aid response within 3 minutes',
          'Coordination with emergency services',
          'Accessibility assistance',
          'Heat and dehydration management'
        ]),
        zones: Object.freeze(['Medical stations', 'Pitch perimeter', 'Concourse patrols'])
      }),
      Object.freeze({
        id: 'transport',
        title: 'Transport Coordinator',
        icon: '🚌',
        responsibilities: Object.freeze([
          'Shuttle timing and dispatch coordination',
          'Ride share zone management',
          'Real-time capacity updates',
          'Emergency transport requests'
        ]),
        zones: Object.freeze(['All transport hubs', 'Shuttle bays', 'Ride share zones'])
      }),
      Object.freeze({
        id: 'sustainability',
        title: 'Sustainability Officer',
        icon: '🌱',
        responsibilities: Object.freeze([
          'Waste sorting station monitoring',
          'Fan education on recycling',
          'Solar and energy system oversight',
          'Environmental incident logging'
        ]),
        zones: Object.freeze(['Waste stations', 'Concessions areas', 'Perimeter'])
      })
    ]),
    emergencyProtocols: Object.freeze([
      Object.freeze({
        code: 'CODE GREEN',
        description: 'Medical emergency — deploy nearest medical team'
      }),
      Object.freeze({
        code: 'CODE BLUE',
        description: 'Crowd surge — activate crowd management protocol'
      }),
      Object.freeze({
        code: 'CODE RED',
        description: 'Security incident — all stewards alert, await instruction'
      }),
      Object.freeze({
        code: 'CODE YELLOW',
        description: 'Infrastructure issue — notify operations center'
      })
    ])
  }),

  /** FAQ for the AI chatbot knowledge base */
  faqItems: Object.freeze([
    Object.freeze({
      question: 'Where is my gate?',
      answer: 'Gates are labeled A-D. Gate A is North, B is East, C is South, D is West. Your ticket QR code shows your gate. Ask any steward or use the AI wayfinding below.'
    }),
    Object.freeze({
      question: 'What time do gates open?',
      answer: 'Gates open 3 hours before kickoff. VIP and accessibility entrances open 30 minutes earlier. We recommend arriving 2 hours early to clear security.'
    }),
    Object.freeze({
      question: 'What can I bring to the stadium?',
      answer: 'Allowed: clear bags under 30x30cm, non-professional cameras, snacks and empty reusable bottles, banners under 2m. Not allowed: professional cameras, drones, outside alcohol, large bags.'
    }),
    Object.freeze({
      question: 'Is the stadium accessible for wheelchair users?',
      answer: 'Yes. All 4 gates have accessible entrances with lifts. Over 500 wheelchair spaces with companion seating. Contact the Accessibility Desk at Gate A or call +1-800-FIFA-ACC.'
    }),
    Object.freeze({
      question: 'How do I get to the stadium?',
      answer: 'Best options: Metro/Rail (fastest, every 8 min, $3-5), Official Electric Shuttle from Fan Zones (every 15 min, $12 return), Bicycle to free secure parking. Avoid driving — limited parking and surge pricing apply.'
    })
  ])
});
