export default function getInvertersData(t: (val: string) => string) {
  return {
    title: t("HYBRID SOLAR INVERTERS"),
    description: t("Pure sine wave hybrid solar inverters available in direct container loads. Offering backup system dealers, solar contractors, and installers factory-direct merchant pricing scales and part warranties."),
    items: [
      {
        name: t("Voltaria VL-2500"),
        model: t("VL-2500"),
        image: t("/images/voltaria-inverter-vl2500.png"),
        description: t("Voltaria VL-2500 is a 2500W Hybrid MPPT Solar Inverter designed for reliable solar power systems. It delivers pure sine wave output, supports operation with or without a battery, and features a wide MPPT voltage range for maximum solar energy efficiency."),
        features: [
          t("2500W Pure Sine Wave Output"),
          t("Wide MPPT Range (30V–400V)"),
          t("Works with or without battery"),
          t("Lithium Battery Compatible & WiFi Ready")
        ],
        specs: {
          [t("Rated Power")]: t("2.5kVA / 2.5kW (PF=1.0)"),
          [t("Surge Power")]: t("4kVA"),
          [t("Battery Voltage")]: t("12VDC"),
          [t("PV Start-up Voltage")]: t("40VDC"),
          [t("Max PV Input Current")]: t("18A"),
          [t("Max PV Input Power")]: t("3000W"),
          [t("Max Charge Current")]: t("100A"),
          [t("AC Output")]: t("220–230–240V"),
          [t("Output Frequency")]: t("50/60Hz"),
          [t("Operating Temp")]: t("-10°C to 60°C")
        },
        moq: t("10 Inverters (2 Crates)"),
        capacity: t("3,000 Units / Month"),
        packaging: t("Padded wood crates (5 inverters/crate)"),
        customization: t("Merchant app dashboard integrations")
      },
      {
        name: t("Voltaria VL-4200 Hybrid MPPT Solar Inverter"),
        model: t("VL-4200"),
        image: t("/images/voltaria-inverter-vl4200.png"),
        description: t("Voltaria VL-4200 is a 4200W Hybrid MPPT Solar Inverter designed for high-performance solar installations. It delivers pure sine wave output, features a high PV capacity of 5kW, works with or without a battery, and supports solar and grid power loads simultaneously."),
        features: [
          t("4200W Pure Sine Wave Output"),
          t("High Voltage MPPT Range (40V–450V)"),
          t("Works with or without battery"),
          t("Smart BMS (RS485/CAN) & 1 Year Warranty")
        ],
        specs: { 
          [t("Rated Power​")]: t("4.2kVA / 4.2kW (PF=1.0)"), 
          [t("Surge Power​")]: t("7.2kVA"), 
          [t("Battery Voltage​")]: t("24V DC"), 
          [t("MPPT Voltage Range")]: t("40–450V DC"),
          [t("Max PV Voltage (VOC)")]: t("500V DC"),
          [t("PV Start-up Voltage​")]: t("60V DC"),
          [t("Max PV Input Current​")]: t("18A​"),
          [t("Max PV Input Power​")]: t("5000W"),
          [t("Max Charge Current​")]: t("100A​"),
          [t("AC Output​")]: t("220–230–240V​"),
          [t("Output Frequency​")]: t("50/60Hz​"),
          [t("Smart Interface")]: t("RS485 / CAN / RS232"),
          [t("Operating Temperature")]: t("-10°C to 60°C​")
        },
        moq: t("10 Inverters (2 Crates)​"),
        capacity: t("3,000 Units / Month​"),
        packaging: t("Padded wood crates (5 inverters/crate)​"),
        customization: t("Merchant app dashboard integrations​")
      },
      {
        name: t("Voltaria VL-6500"),
        model: t("VL-6500"),
        image: t("/images/voltaria-inverter-vl6500.png"),
        description: t("Voltaria VL-6500 is a 6500W Hybrid MPPT Solar Inverter designed for high-capacity applications. It features a dual AC output, supports operation with or without a battery, and offers feed-in to grid capabilities with smart BMS communication."),
        features: [
          t("6500W Pure Sine Wave Output"),
          t("High Voltage MPPT Range (60V–450V)"),
          t("Dual AC Output & Feed-in to Grid"),
          t("Lithium-compatible Smart BMS (RS485/CAN)")
        ],
        specs: { 
          [t("Rated Power​​")]: t("6.5kVA / 6.5kW (PF=1.0)"), 
          [t("Surge Power​​")]: t("12kVA"), 
          [t("Battery Voltage​​")]: t("48 VDC"), 
          [t("MPPT Voltage Range​")]: t("60–450 VDC"),
          [t("Max PV Voltage(VOC)​")]: t("500 VDC"),
          [t("PV Start-up Voltage​​")]: t("80VDC"),
          [t("Max PV Input Power​​")]: t("9000 W"),
          [t("Max PV Input Current​​")]: t("27 A"),
          [t("Max Charge Current​​")]: t("120 A"),
          [t("AC Output​​")]: t("220-230-240V"),
          [t("Output Frequency​​")]: t("50/60 Hz"),
          [t("Smart Interface​")]: t("RS485 / CAN / RS232​"),
          [t("Operating Temp​")]: t("-10°C to 60°C​​")
        },
        moq: t("5 Inverters (1 Crate)"),
        capacity: t("2,000 Units / Month"),
        packaging: t("Padded wood crates (5 inverters/crate)​​"),
        customization: t("Dedicated wholesale app integrations")
      }
    ]
  };
}
