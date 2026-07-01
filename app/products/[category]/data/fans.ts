export default function getFansData(t: (val: string) => string) {
  return {
    title: t("PREMIUM AERODYNAMIC FANS"),
    description: t("Discover Voltaria's high-efficiency ceiling, pedestal, and exhaust fans. Direct-to-merchant factory supply in container-load sizes, with OEM custom branding available for retail chains and distributors."),
    items: [
      {
        name: t("56\" AC Ceiling Fan"),
        model: t("AC-56"),
        image: t("/images/voltaria-fan.png"),
        description: t("56\" AC Ceiling Fan is designed to provide powerful airflow with smooth and silent performance. Equipped with a 70W double bearing motor, 330 RPM speed, and 180 m³/min air delivery, it ensures efficient cooling for large rooms. The aerodynamically designed steel blades, 1400mm sweep, and golden cap design deliver premium style, long-lasting durability, and reliable cooling."),
        features: [
          t("56\" Elegant Sweep (1400mm)"),
          t("Double Bearing Motor (192mm, 2.2kg)"),
          t("70W Power Saving & Universal Voltage"),
          t("3 Straight Aerodynamic Steel Blades")
        ],
        specs: { 
          [t("Sweep Size")]: t("1400mm – Wide Coverage"), 
          [t("Optimal Speed")]: t("330 RPM"), 
          [t("High Air Delivery")]: t("180 m³/min"), 
          [t("Durable Build")]: t("Sturdy Motor (192mm, 2.2kg)"),
          [t("Golden Cap Design")]: t("Premium Style"),
          [t("Universal Voltage")]: t("Plug & Relax")
        },
        moq: t("50 Units"),
        capacity: t("10,000 Units / Month"),
        packaging: t("Wood Pallet (20 units/carton)"),
        customization: t("OEM Logo Printing Available")
      },
      {
        name: t("56\" AC DC Ceiling Fan"),
        model: t("ACDC-56"),
        image: t("/images/voltaria-acdc-fan.png"),
        description: t("Voltaria 56\" AC DC Ceiling Fan is designed to provide maximum energy efficiency and high airflow. Equipped with a BLDC motor that consumes only 6–36W of power, 330 RPM speed, and 1400mm blade span, it operates on both AC 220V and DC 12V with automatic changeover."),
        features: [
          t("56\" Elegant Sweep (1400mm)"),
          t("Super Energy Efficient BLDC Motor"),
          t("Direct AC/DC Input Changeover"),
          t("Wall Regulator & Remote Control")
        ],
        specs: { 
          [t("Size & Voltage")]: t("56” – Operates on AC 220V / DC 12V"), 
          [t("Power Consumption​")]: t("6–36 W"), 
          [t("Motor Type​")]: t("Pure Copper Winding BLDC Motor"), 
          [t("Rated Current")]: t("3A"),
          [t("Speed​")]: t("330 RPM​"),
          [t("Motor Durability")]: t("30,000 Hours Rated Life"),
          [t("Adapter Requirement")]: t("Direct AC/DC Input – No External Adapter Needed"),
          [t("Control Options")]: t("Wall-Mounted Regulator & Remote Control"),
          [t("Input Flexibility")]: t("Automatic AC to DC Changeover"),
          [t("Blades​")]: t("3 Metal Blades (Low Noise)")
        },
        moq: t("50 Units​"),
        capacity: t("10,000 Units / Month​"),
        packaging: t("Standard Cartons (1 unit/box)"),
        customization: t("OEM Housing Color Options")
      },
      {
        name: t("56\" AC DC Ceiling Fan V2"),
        model: t("ACDC-56 V2"),
        image: t("/images/voltaria-acdc-fan-v2.png"),
        description: t("56\" AC DC Ceiling Fan V2 is designed for high-performance and silent cooling. With a rated BLDC motor consuming 6–36W and direct AC/DC input flexibility, it ensures automatic changeover and stable airflow."),
        features: [
          t("56\" Elegant Sweep (1400mm)​"),
          t("Super Energy Efficient BLDC Motor​"),
          t("Direct AC/DC Input Changeover​"),
          t("Wall Regulator & Remote Control​")
        ],
        specs: { 
          [t("Size & Voltage​")]: t("56” – Operates on AC 220V / DC 12V​"), 
          [t("Power Consumption​​")]: t("6–36 W​​"), 
          [t("Motor Type​​")]: t("Pure Copper Winding BLDC Motor​​"), 
          [t("Rated Current​")]: t("3A​"),
          [t("Blade Span​")]: t("1400 mm (56 inches)​"),
          [t("Speed​​")]: t("330 RPM​​"),
          [t("Motor Durability​")]: t("30,000 Hours Rated Life​"),
          [t("Adapter Requirement​")]: t("Direct AC/DC Input – No External Adapter Needed​"),
          [t("Control Options​")]: t("Wall-Mounted Regulator & Remote Control​"),
          [t("Input Flexibility​")]: t("Automatic AC to DC Changeover​"),
          [t("Blades​​")]: t("3 Metal Blades (Low Noise)​​")
        },
        moq: t("50 Units​​"),
        capacity: t("10,000 Units / Month​​"),
        packaging: t("Standard Cartons (1 unit/box)​"),
        customization: t("OEM Housing Color Options​")
      },
      {
        name: t("18'' PEDESTAL AC DC FAN"),
        model: t("PED-18"),
        image: t("/images/voltaria-pedestal-acdc-fan.png"),
        description: t("Voltaria 18'' Pedestal AC DC Fan is designed for ultimate cooling flexibility and energy efficiency. Powered by a 15W pure copper motor, it offers dual AC/DC functionality, 1350 RPM on Turbo Mode, and support for 12V battery or solar panel setups."),
        features: [
          t("18-Inch, 5-Blade Aero Design"),
          t("15W Ultra-Efficient Pure Copper Motor"),
          t("Supports AC/DC, Solar & Battery Power"),
          t("3 Speed Levels + 3 Wind Modes & Remote")
        ],
        specs: { 
          [t("Dual AC/DC Functionality")]: t("Supported"), 
          [t("Motor Type​​​")]: t("Energy Saving Pure Copper Motor"), 
          [t("Blade Design")]: t("18-Inch, 5-Blade Aero Design"), 
          [t("Speed​​​")]: t("3 Speed Levels + 3 Wind Modes"),
          [t("Motor Speed")]: t("1350 RPM on Turbo Mode"),
          [t("Control Options​​")]: t("Timer and Remote Control"),
          [t("Power Support")]: t("DC 12V power line, battery, solar panel, and AC 110-260V"),
          [t("Durable Build​")]: t("ABS + PP Body")
        },
        moq: t("50 Units​​​"),
        capacity: t("5,000 Units / Month"),
        packaging: t("Standard Cartons (1 unit/box)​​"),
        customization: t("OEM Housing Color Options​​")
      }
    ]
  };
}
