export default function getChangeoversData(t: (val: string) => string) {
  return {
    title: t("AUTOMATIC CHANGEOVERS (ATS)"),
    description: t("Eliminate transition power spikes with Voltaria smart ATS transfer panels. Supplying backup power manufacturers, generator builders, and industrial outlets with rapid changeover relays packed in secure crates."),
    items: [
      {
        name: t("DMC Type Changeover Switch"),
        model: t("DMC-100"),
        image: t("/images/voltaria-changeover-dmc100.png"),
        description: t("DMC Type Changeover Switch is designed to provide safe and reliable source transfer for electrical circuits rated at 100 Amp, 415 Volts AC. Featuring a heavy-duty steel enclosure and 4-pole changeover mechanism, it ensures premium insulation, high mechanical strength, and long service life."),
        features: [
          t("100 Amp. 415 Volts AC Rating"),
          t("Brass Contacts & DMC Insulation"),
          t("Heavy Duty Steel Enclosure (4 Pole)"),
          t("Heat Resistant & High Mechanical Strength")
        ],
        specs: { 
          [t("Rating")]: t("100A"), 
          [t("Voltage")]: t("415V AC"), 
          [t("Poles")]: t("4 POLE"), 
          [t("Contacts")]: t("BRASS"),
          [t("Quantity")]: t("3 Piece")
        },
        moq: t("20 Panels (2 Crates)"),
        capacity: t("2,000 Units / Month"),
        packaging: t("Crated cartons of 10 panels"),
        customization: t("OEM wiring setups available")
      },
      {
        name: t("Knife Type Changeover Switch"),
        model: t("KNF-200"),
        image: t("/images/voltaria-changeover-knf200.png"),
        description: t("Knife Type Changeover Switch is designed to provide safe, manual, and robust source transfer in heavy-duty industrial environments. Rated at 200 Amp, 415 Volts AC, and featuring a 4-pole construction with high conductivity brass contacts, it ensures superior electrical performance and long service life."),
        features: [
          t("200 Amp. 415 Volts AC Rating"),
          t("Heavy Duty Construction (4 Pole)"),
          t("High Conductivity Brass Contacts"),
          t("Suitable for Industrial Applications")
        ],
        specs: { 
          [t("Rating​")]: t("200A"), 
          [t("Voltage​")]: t("415V AC​"), 
          [t("Poles​")]: t("4 POLE​"), 
          [t("Contacts​")]: t("BRASS​"),
          [t("Quantity​")]: t("2 Piece")
        },
        moq: t("10 Panels (1 Crate)"),
        capacity: t("1,500 Units / Month"),
        packaging: t("Padded wooden crate (10 panels/crate)"),
        customization: t("OEM Custom Enclosure Labeling")
      }
    ]
  };
}
