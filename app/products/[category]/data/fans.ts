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
        name: t("Voltaria Cyclone Exhaust Fan"),
        model: t("CY-12E"),
        image: t("/images/voltaria-exhaust-fan.png"),
        description: t("Heavy-duty rust-proof ventilation fan designed to rapidly clear air in kitchens, bathrooms, or workspaces."),
        features: [t("Automatic back-draft louvers"), t("Rust-proof ABS body construction"), t("High-velocity suction speed"), t("Easy mount wall installation framework")],
        specs: { 
          [t("Sweep Size​​")]: t('300mm (12")'), 
          [t("Speed​​")]: t("1400 RPM"), 
          [t("Suction Power")]: t("1200 m³/h"), 
          [t("Power​​")]: t("45W"),
          [t("Voltage​​")]: t("220V-240V​​"),
          [t("Frequency​")]: t("50Hz​")
        },
        moq: t("100 Units​​"),
        capacity: t("8,000 Units / Month"),
        packaging: t("Industrial Cartons (10 units/box)"),
        customization: t("Custom Grille Color Available")
      },
      {
        name: t("Voltaria Industrial Bracket Fan"),
        model: t("IB-18B"),
        image: t("/images/voltaria-bracket-fan.png"),
        description: t("Wall-mounted heavy-duty bracket fan designed for high-volume air circulation in commercial spaces and warehouses."),
        features: [t("18-inch aerodynamic steel blades"), t("3-speed pull cord control system"), t("Heavy-duty metal wall bracket structure"), t("Wide-angle horizontal oscillation")],
        specs: { 
          [t("Sweep Size​​​")]: t('450mm (18")'), 
          [t("Motor Type​​")]: t("100% Pure Copper​​"), 
          [t("Speed​​​")]: t("1350 RPM"), 
          [t("Power​​​")]: t("75W"),
          [t("Voltage​​​")]: t("220V-240V​​​"),
          [t("Airflow​")]: t("110 CMM")
        },
        moq: t("50 Units​​"),
        capacity: t("5,000 Units / Month​"),
        packaging: t("Standard Cartons (2 units/box)"),
        customization: t("OEM Logo & Custom Color Available")
      }
    ]
  };
}
