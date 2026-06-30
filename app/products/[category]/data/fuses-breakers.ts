export default function getFusesBreakersData(t: (val: string) => string) {
  return {
    title: t("HIGH-SAFETY FUSES"),
    description: t("Safeguard machinery and contractor stocks with Voltaria's high-speed circuit protection components. High-density casing optimized for electrical stores and wholesale supply houses."),
    items: [
      {
        name: t("Voltaria SafeGuard Single-Pole MCB"),
        model: t("SG-16MCB"),
        image: t("/images/voltaria-mcb-single.png"),
        description: t("High-accuracy miniature circuit breaker for overload and short-circuit protection in residential boards."),
        features: [t("16A current rating (C-curve)"), t("10,000A (10kA) breaking capacity"), t("Finger-safe IP20 insulated terminals"), t("Fast magnetic-thermal release")],
        specs: { [t("Rated Voltage")]: t("230V AC"), [t("Amperage")]: t("16A"), [t("Frequency")]: t("50/60Hz"), [t("Compliance")]: t("IEC 60898-1") },
        moq: t("500 Units"),
        capacity: t("50,000 Units / Month"),
        packaging: t("Cartons of 100 units (Inner boxes of 10)"),
        customization: t("Custom branding print available")
      },
      {
        name: t("Voltaria SafeGuard Double-Pole MCB"),
        model: t("SG-32MCB"),
        image: t("/images/voltaria-mcb-double.png"),
        description: t("Double-pole primary line isolation breaker with high thermal-magnetic tripping speed."),
        features: [t("32A main power breaker"), t("Flame-retardant polycarbonate casing"), t("Din-rail mounted convenience clip"), t("Dual-break contact safety systems")],
        specs: { [t("Rated Voltage")]: t("230V/400V AC"), [t("Amperage")]: t("32A"), [t("Poles")]: t("2-Pole (DP)"), [t("Breaking Capacity")]: t("10kA") },
        moq: t("500 Units"),
        capacity: t("50,000 Units / Month"),
        packaging: t("Cartons of 100 units (Inner boxes of 10)"),
        customization: t("Custom branding print available")
      },
      {
        name: t("Voltaria SafeGuard Distribution Board"),
        model: t("SG-8WYDB"),
        image: t("/images/voltaria-distribution-board.png"),
        description: t("Insulated 8-way distribution panel box with copper busbars and acrylic safety window."),
        features: [t("8-way Din-rail capacity"), t("Electrostatically coated metal box"), t("Integrated neutral and ground busbars"), t("Removable top and bottom gland plates")],
        specs: { [t("Capacity")]: t("8 Modules"), [t("Mounting")]: t("Flush / Surface"), [t("IP Rating")]: t("IP40 Protection"), [t("Material")]: t("Cold-Rolled Steel") },
        moq: t("100 Units"),
        capacity: t("10,000 Units / Month"),
        packaging: t("Individually boxed inside metal crates"),
        customization: t("OEM Grille Paint Customization")
      }
    ]
  };
}
