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
        name: t("Voltaria SmartATS 100A Heavy-Duty"),
        model: t("S-ATS100"),
        image: t("/images/voltaria-changeover-100a.png"),
        description: t("Industrial-grade ATS supporting generator startup triggers and heavy corporate air conditioner loads."),
        features: [t("100A high load support"), t("Integrated auxiliary contact ports"), t("External manual override key switch"), t("Flame-retardant arc grid sheets")],
        specs: { 
          [t("Rated Voltage")]: t("400V AC Max"), 
          [t("Amperage")]: t("100A​"), 
          [t("Poles​")]: t("4-Pole"), 
          [t("Warranty")]: t("2 Years") 
        },
        moq: t("10 Panels (1 Crate)"),
        capacity: t("1,500 Units / Month"),
        packaging: t("Padded wooden crate (10 panels/crate)"),
        customization: t("OEM Custom Enclosure Labeling")
      }
    ]
  };
}
