export default function getSolarWaterPumpData(t: (val: string) => string) {
  return {
    title: t("DC SOLAR WATER PUMP"),
    description: t("High-efficiency DC solar-powered surface water pumps with smart MPPT controller and 100% pure copper PMSM motor. Engineered for agricultural irrigation, livestock water supply, and high-volume water transfer."),
    items: [
      {
        name: t("Voltaria VSP30-S900W/96V DC Solar Water Pump"),
        model: t("VSP30-S900W/96V"),
        image: t("/images/dc-solar-water-pump.png"),
        description: t("Voltaria VSP30-S900W/96V is a 900W / 1.2HP high-efficiency DC Solar Surface Water Pump powered by an advanced MPPT controller and a 100% pure copper PMSM motor. Delivering a maximum flow rate of 30m³/h with comprehensive dry-run and electrical safety protections, it provides an eco-friendly, fuel-free, and dependable water pumping solution for farms, ranches, and commercial irrigation."),
        features: [
          t("100% Pure Copper Winding with High-Torque PMSM Motor"),
          t("High Volume Delivery: Max Flow 30m³/h & Max Head 16m"),
          t("900W / 1.2HP Rated Power @ 96V DC High-Efficiency System"),
          t("Heavy-Duty 3\" × 3\" Inlet & Outlet with Cast Iron Impeller"),
          t("Smart MPPT Controller with LED Display (IP65 Weatherproof)"),
          t("Comprehensive Multi-Guard: Dry-Run, Under-Voltage, Over-Current & Over-Temp Protection"),
          t("Solar Panel Requirement: 330W–450W × 3 Pcs")
        ],
        specs: {
          [t("Model")]: t("VSP30-S900W/96V"),
          [t("Rated Power")]: t("900W / 1.2HP"),
          [t("Rated Voltage")]: t("96V DC"),
          [t("Max Flow")]: t("30m³/h"),
          [t("Max Head")]: t("16m"),
          [t("Suction Lift")]: t("8m"),
          [t("Inlet & Outlet")]: t("3\" × 3\""),
          [t("Motor Construction")]: t("PMSM Motor (100% Pure Copper Winding)"),
          [t("Controller Type")]: t("Smart MPPT Controller with LED Display (IP65)"),
          [t("Solar Panel Requirement")]: t("330W–450W × 3 Pcs"),
          [t("Safety Protections")]: t("Dry-Run, Under-Voltage, Over-Current, Over-Temperature"),
          [t("Body Materials")]: t("Die-Cast Alloy Body, Alloy Motor Housing, Cast Iron Impeller"),
          [t("Gross Weight (G.W)")]: t("12 Kg"),
          [t("Dimensions (Measurement)")]: t("41 × 26 × 43 cm")
        },
        moq: t("10 Pumps (Protected Crates)"),
        capacity: t("3,000 Units / Month"),
        packaging: t("Heavy-duty reinforced export carton (41 × 26 × 43cm)"),
        customization: t("OEM branding, custom solar array sizing & distributor pricing")
      }
    ]
  };
}
