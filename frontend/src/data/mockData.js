export const initialDepartments = [
  { id: 1, name: "Cardiology", desc: "Expert heart & cardiovascular care", icon: "HeartPulse" },
  { id: 2, name: "Neurology", desc: "Advanced brain & nervous system care", icon: "Brain" },
  { id: 3, name: "Pediatrics", desc: "Comprehensive infant & child healthcare", icon: "Baby" },
  { id: 4, name: "Orthopedics", desc: "Joint, bone & sports injury specialists", icon: "Activity" },
  { id: 5, name: "Dermatology", desc: "Modern laser, skin & hair therapy", icon: "Sparkles" },
  { id: 6, name: "General Medicine", desc: "Primary healthcare & diagnostics", icon: "Stethoscope" }
];

export const initialDoctors = [
  {
    id: 1,
    doctor_code: "D101",
    name: "Prof. Dr. Mahfuzur Rahman",
    specialty: "Cardiologist",
    department_id: 1,
    qualification: "MBBS, FCPS (Cardiology), FACC (USA)",
    experience_years: 16,
    consultation_fee: 1200,
    available_days: "Sat, Mon, Wed",
    available_time: "05:00 PM - 09:00 PM",
    rating: 4.9,
    reviewsCount: 142,
    bio: "Senior Consultant Cardiologist with over 16 years of clinical excellence in invasive and non-invasive cardiac care.",
    image_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    doctor_code: "D102",
    name: "Dr. Sarah Tasnim",
    specialty: "Neurologist",
    department_id: 2,
    qualification: "MBBS, MD (Neurology), PhD",
    experience_years: 10,
    consultation_fee: 1000,
    available_days: "Sun, Tue, Thu",
    available_time: "04:00 PM - 08:00 PM",
    rating: 4.8,
    reviewsCount: 98,
    bio: "Specialized in stroke management, epilepsy, and migraine treatment with compassionate patient-centric approach.",
    image_url: "https://images.unsplash.com/photo-1594824813512-32b0c34a2618?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    doctor_code: "D103",
    name: "Dr. Tanvir Ahmed",
    specialty: "Pediatrician",
    department_id: 3,
    qualification: "MBBS, DCH, FCPS (Pediatrics)",
    experience_years: 8,
    consultation_fee: 800,
    available_days: "Sat to Thu",
    available_time: "06:00 PM - 10:00 PM",
    rating: 4.9,
    reviewsCount: 215,
    bio: "Dedicated child specialist focusing on neonatology, childhood nutrition, immunization, and developmental disorders.",
    image_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    doctor_code: "D104",
    name: "Dr. Nusrat Jahan",
    specialty: "Dermatologist",
    department_id: 5,
    qualification: "MBBS, DDV, FCPS",
    experience_years: 9,
    consultation_fee: 900,
    available_days: "Sat, Sun, Tue, Wed",
    available_time: "03:00 PM - 07:00 PM",
    rating: 4.7,
    reviewsCount: 88,
    bio: "Expert in clinical dermatology, laser aesthetics, acne therapy, and chronic skin disease management.",
    image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    doctor_code: "D105",
    name: "Dr. Rafiqul Islam",
    specialty: "Orthopedic Surgeon",
    department_id: 4,
    qualification: "MBBS, MS (Ortho), Fellow Arthroscopy",
    experience_years: 14,
    consultation_fee: 1100,
    available_days: "Mon, Wed, Thu",
    available_time: "05:00 PM - 08:30 PM",
    rating: 4.8,
    reviewsCount: 120,
    bio: "Expert in joint replacement, sports injury rehab, spine health, and fracture trauma surgery.",
    image_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    doctor_code: "D106",
    name: "Dr. Farhana Yasmin",
    specialty: "General Physician",
    department_id: 6,
    qualification: "MBBS, FCPS (Medicine)",
    experience_years: 7,
    consultation_fee: 700,
    available_days: "Sat to Thu",
    available_time: "09:00 AM - 01:00 PM",
    rating: 4.9,
    reviewsCount: 165,
    bio: "Family physician offering complete preventive checks, chronic illness management (Diabetes, Hypertension).",
    image_url: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=600&q=80"
  }
];

export const initialLabEmployees = [
  {
    id: 1,
    employee_code: "L101",
    name: "Md. Rafiqul Islam",
    email: "rafiq.lab@medicare.com",
    phone: "01711223344",
    role: "lab_staff",
    specialization: "Senior Pathologist & Lab Technologist",
    department: "Pathology & Blood Bank",
    joined_date: "2024-03-15",
    status: "active"
  },
  {
    id: 2,
    employee_code: "L102",
    name: "Sabrina Akter",
    email: "sabrina.lab@medicare.com",
    phone: "01722334455",
    role: "lab_staff",
    specialization: "Biochemist & Hormone Analyst",
    department: "Biochemistry & Immunology",
    joined_date: "2024-07-01",
    status: "active"
  }
];

export const initialAccountsStaff = [
  {
    id: 1,
    account_code: "A101",
    name: "Kamal Hossain",
    email: "kamal.accounts@medicare.com",
    phone: "01733445566",
    role: "accountant",
    designation: "Chief Accounts Officer",
    section: "Billing & Hospital Revenue",
    joined_date: "2023-11-10",
    status: "active"
  },
  {
    id: 2,
    account_code: "A102",
    name: "Farhana Sultana",
    email: "farhana.accounts@medicare.com",
    phone: "01744556677",
    role: "accountant",
    designation: "Senior Cashier & Billing Executive",
    section: "OPD & Pharmacy Counter Billing",
    joined_date: "2024-02-20",
    status: "active"
  }
];

export const initialAppointments = [
  {
    id: 101,
    patient_id: 2,
    doctor_id: 1,
    doctor_name: "Prof. Dr. Mahfuzur Rahman",
    doctor_specialty: "Cardiologist",
    patient_name: "John Doe",
    patient_email: "patient@medicare.com",
    patient_phone: "01811112233",
    appointment_date: "2026-11-25",
    appointment_time: "06:30 PM",
    symptoms: "Frequent shortness of breath and chest discomfort during morning walks.",
    status: "confirmed",
    admin_notes: "Slot confirmed. Room 304. Please bring previous ECG and lipid profile reports."
  },
  {
    id: 102,
    patient_id: 2,
    doctor_id: 4,
    doctor_name: "Dr. Nusrat Jahan",
    doctor_specialty: "Dermatologist",
    patient_name: "John Doe",
    patient_email: "patient@medicare.com",
    patient_phone: "01811112233",
    appointment_date: "2026-11-28",
    appointment_time: "04:00 PM",
    symptoms: "Skin allergy and irritation on forearms.",
    status: "pending",
    admin_notes: "Awaiting doctor schedule confirmation."
  }
];

// E-Pharmacy Initial Products
export const initialMedicines = [
  {
    id: 1,
    name: "Napa Extra (Paracetamol + Caffeine)",
    category: "Pain & Fever",
    form: "Tablet (Box of 20)",
    price: 60,
    originalPrice: 70,
    manufacturer: "Beximco Pharma",
    rating: 4.9,
    prescriptionRequired: false,
    image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
    description: "Fast relief from fever, headache, body aches, and toothache."
  },
  {
    id: 2,
    name: "Omep 20mg (Omeprazole)",
    category: "Gastric & Acid Relief",
    form: "Capsule (Box of 30)",
    price: 180,
    originalPrice: 200,
    manufacturer: "Square Pharmaceuticals",
    rating: 4.8,
    prescriptionRequired: false,
    image_url: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=500&q=80",
    description: "Effective treatment for heartburn, gastric hyperacidity, and peptic ulcer."
  },
  {
    id: 3,
    name: "Bextram Gold Multivitamin",
    category: "Vitamins & Supplements",
    form: "Syrup & Tablets (30 Tabs)",
    price: 340,
    originalPrice: 380,
    manufacturer: "Incepta Pharma",
    rating: 4.9,
    prescriptionRequired: false,
    image_url: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=500&q=80",
    description: "32 essential vitamins and minerals for daily energy and immune defense."
  },
  {
    id: 4,
    name: "Digital Arm Blood Pressure Monitor",
    category: "Medical Devices",
    form: "Electronic Device",
    price: 2450,
    originalPrice: 2800,
    manufacturer: "Omron Healthcare",
    rating: 5.0,
    prescriptionRequired: false,
    image_url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=500&q=80",
    description: "Accurate automatic one-touch upper arm blood pressure & pulse monitor with memory."
  },
  {
    id: 5,
    name: "Fingertip Pulse Oximeter",
    category: "Medical Devices",
    form: "LED Digital Device",
    price: 850,
    originalPrice: 1100,
    manufacturer: "CarePlus",
    rating: 4.8,
    prescriptionRequired: false,
    image_url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=500&q=80",
    description: "Instant SpO2 oxygen saturation level and heart pulse reader for home and clinic."
  },
  {
    id: 6,
    name: "Sergel 20mg (Esomeprazole)",
    category: "Gastric & Acid Relief",
    form: "Capsule (Box of 30)",
    price: 210,
    originalPrice: 230,
    manufacturer: "Healthcare Pharmaceuticals",
    rating: 4.9,
    prescriptionRequired: false,
    image_url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=500&q=80",
    description: "Trusted medication for acid reflux, GERD, and stomach ulcer healing."
  },
  {
    id: 7,
    name: "Vitamin C 500mg Chewable (Cevit)",
    category: "Vitamins & Supplements",
    form: "Chewable (Strip of 10)",
    price: 30,
    originalPrice: 35,
    manufacturer: "Square Pharmaceuticals",
    rating: 4.9,
    prescriptionRequired: false,
    image_url: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=500&q=80",
    description: "Orange flavored chewable vitamin C to boost immunity and fight cold symptoms."
  },
  {
    id: 8,
    name: "First Aid Emergency Kit Box",
    category: "Emergency & Safety",
    form: "Complete Portable Kit",
    price: 1200,
    originalPrice: 1500,
    manufacturer: "MediSafety",
    rating: 4.9,
    prescriptionRequired: false,
    image_url: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=500&q=80",
    description: "Includes antiseptic lotion, bandages, surgical tape, burn gel, scissors, and cotton."
  }
];

// Diagnostic & Lab Test Packages
export const initialLabTests = [
  {
    id: 1,
    title: "Executive Full Body Health Checkup",
    category: "Preventive Care",
    testsIncluded: ["Complete Blood Count (CBC)", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function (Serum Creatinine)", "HbA1c Blood Sugar", "Urine Routine", "ECG"],
    price: 3200,
    originalPrice: 4800,
    fastingRequired: "10-12 hours fasting required",
    reportDeliveryTime: "Within 24 Hours",
    popular: true,
    description: "Comprehensive 60+ parameters screen for vital organs, heart, liver, diabetes, and kidneys."
  },
  {
    id: 2,
    title: "Advanced Cardiac Health Profile",
    category: "Cardiology",
    testsIncluded: ["Echocardiogram (Echo)", "Troponin I", "Lipid Profile", "High Sensitivity CRP (hs-CRP)", "Serum Electrolytes", "ECG"],
    price: 2800,
    originalPrice: 3900,
    fastingRequired: "12 hours fasting required",
    reportDeliveryTime: "Same Day (12 Hours)",
    popular: true,
    description: "Specialized assessment for heart attack prevention, coronary artery risk, and lipid health."
  },
  {
    id: 3,
    title: "Complete Diabetes Monitoring Package",
    category: "Endocrinology",
    testsIncluded: ["Fasting Blood Sugar (FBS)", "2 Hours Post Meal (2HABF)", "HbA1c (3-Month Average)", "Urine Microalbumin", "Lipid Profile"],
    price: 1400,
    originalPrice: 2000,
    fastingRequired: "8-10 hours fasting required",
    reportDeliveryTime: "Same Day",
    popular: false,
    description: "Essential for diabetic patients to track glycemic control and prevent renal complications."
  },
  {
    id: 4,
    title: "Thyroid & Hormone Health Panel",
    category: "Endocrinology",
    testsIncluded: ["TSH (Thyroid Stimulating Hormone)", "Free T3", "Free T4", "Serum Vitamin D3", "Serum Calcium"],
    price: 1950,
    originalPrice: 2600,
    fastingRequired: "Morning sample preferred",
    reportDeliveryTime: "Within 24 Hours",
    popular: false,
    description: "Checks metabolic speed, unexplained weight change, thyroid disorders, and fatigue."
  },
  {
    id: 5,
    title: "Comprehensive Kidney & Renal Health Profile",
    category: "Nephrology",
    testsIncluded: ["Serum Creatinine", "Blood Urea Nitrogen (BUN)", "Serum Uric Acid", "Serum Electrolytes", "Urine Routine & Microscopic (R/E)"],
    price: 1600,
    originalPrice: 2400,
    fastingRequired: "Morning sample preferred",
    reportDeliveryTime: "Same Day (12 Hours)",
    popular: true,
    description: "Accurate evaluation of glomerular filtration, creatinine clearance, electrolytes balance, and renal vitality."
  },
  {
    id: 6,
    title: "Comprehensive Liver Care & Hepatic Profile (LFT)",
    category: "Gastroenterology",
    testsIncluded: ["SGPT (ALT)", "SGOT (AST)", "Serum Bilirubin (Total & Direct)", "Serum Alkaline Phosphatase (ALP)", "Serum Albumin & Total Protein"],
    price: 1800,
    originalPrice: 2600,
    fastingRequired: "8 hours fasting required",
    reportDeliveryTime: "Within 24 Hours",
    popular: false,
    description: "Vital liver enzymes and protein synthesis screening to detect fatty liver, hepatitis, and hepatic inflammation."
  },
  {
    id: 7,
    title: "Acute Fever & Viral Screening Panel (Dengue + CBC)",
    category: "Infectious Disease",
    testsIncluded: ["Complete Blood Count (CBC) with Platelets", "Dengue NS1 Antigen", "Dengue IgG / IgM Antibody", "Urine Routine", "Widal Test (Typhoid)"],
    price: 1500,
    originalPrice: 2200,
    fastingRequired: "No fasting required",
    reportDeliveryTime: "Express (4 Hours)",
    popular: true,
    description: "Emergency same-day detection for Dengue fever, malaria, typhoid, and platelet drop monitoring."
  }
];

// Master Diagnostic Investigation Test Catalog (Searchable in Billing & Lab by TID, Code, Name)
export const hospitalStandardTests = [
  { id: 1, tid: "T101", code: "CBC", name: "Complete Blood Count (CBC) with ESR", category: "Hematology", price: 800, sample: "Whole Blood (EDTA)", specimen: "Whole Blood (EDTA)" },
  { id: 2, tid: "T102", code: "CREAT", name: "Serum Creatinine (Kidney Function)", category: "Biochemistry", price: 500, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 3, tid: "T103", code: "LIPID", name: "Lipid Profile (Cholesterol, HDL, LDL, TG)", category: "Biochemistry", price: 1200, sample: "Fasting Serum", specimen: "Fasting Serum (12 hrs)" },
  { id: 4, tid: "T104", code: "LFT", name: "Liver Function Test (LFT - SGPT, SGOT, Bilirubin)", category: "Biochemistry", price: 1400, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 5, tid: "T105", code: "URINE", name: "Urine Routine & Microscopic Examination (R/M/E)", category: "Pathology", price: 350, sample: "Clean Catch Urine", specimen: "Clean Catch Midstream Urine" },
  { id: 6, tid: "T106", code: "FBS", name: "Fasting Blood Sugar (FBS)", category: "Endocrinology", price: 250, sample: "Fluoride Blood", specimen: "Sodium Fluoride Plasma" },
  { id: 7, tid: "T107", code: "HBA1C", name: "HbA1c (Glycated Hemoglobin 3-Month Avg)", category: "Endocrinology", price: 1100, sample: "Whole Blood", specimen: "EDTA Whole Blood" },
  { id: 8, tid: "T108", code: "ELECT", name: "Serum Electrolytes (Na+, K+, Cl-)", category: "Biochemistry", price: 950, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 9, tid: "T109", code: "THYROID", name: "Thyroid Panel (TSH, Free T3, Free T4)", category: "Hormone", price: 1800, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 10, tid: "T110", code: "URIC", name: "Serum Uric Acid", category: "Biochemistry", price: 450, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 11, tid: "T111", code: "BUN", name: "Blood Urea Nitrogen (BUN)", category: "Biochemistry", price: 450, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 12, tid: "T112", code: "DENGUE", name: "Dengue NS1 Antigen & Antibody (IgG/IgM)", category: "Serology", price: 1200, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 13, tid: "T113", code: "BILI", name: "Serum Bilirubin (Total & Direct)", category: "Biochemistry", price: 400, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 14, tid: "T114", code: "BG", name: "Blood Grouping & Rh Typing", category: "Hematology", price: 250, sample: "Whole Blood", specimen: "EDTA Whole Blood" },
  { id: 15, tid: "T115", code: "ECG", name: "12-Lead Electrocardiogram (ECG)", category: "Cardiology", price: 500, sample: "Lead ECG", specimen: "Cardiovascular Telemetry" },
  { id: 16, tid: "T116", code: "ECHO", name: "2D Echocardiogram with Color Doppler (Echo)", category: "Cardiology", price: 2500, sample: "Ultrasound", specimen: "Cardiac Ultrasound Scan" },
  { id: 17, tid: "T117", code: "XRAY", name: "Digital Chest X-Ray (P/A View)", category: "Radiology", price: 700, sample: "X-Ray", specimen: "Digital Radiography Imaging" },
  { id: 18, tid: "T118", code: "USG", name: "USG of Whole Abdomen with PVR", category: "Radiology", price: 1800, sample: "Ultrasound", specimen: "Abdominal Ultrasonography" },
  { id: 19, tid: "T119", code: "CALC", name: "Serum Calcium (Total & Ionized)", category: "Biochemistry", price: 600, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 20, tid: "T120", code: "VITD", name: "Vitamin D3 (25-Hydroxy)", category: "Biochemistry", price: 2800, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 21, tid: "T121", code: "WIDAL", name: "Widal Test (Typhoid Serology)", category: "Serology", price: 400, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 22, tid: "T122", code: "STOOL", name: "Stool Routine & Occult Blood (OBT)", category: "Microbiology", price: 350, sample: "Stool", specimen: "Fresh Stool Sample" },
  { id: 23, tid: "T123", code: "TROP", name: "High Sensitivity Troponin I (Cardiac Marker)", category: "Cardiology", price: 1600, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 24, tid: "T124", code: "CRP", name: "C-Reactive Protein (CRP Quantitative)", category: "Immunology", price: 650, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 25, tid: "T125", code: "PROT", name: "Serum Albumin & Total Protein", category: "Biochemistry", price: 600, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 26, tid: "T126", code: "AMYL", name: "Serum Amylase & Lipase (Pancreatic)", category: "Biochemistry", price: 1200, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 27, tid: "T127", code: "URINEC", name: "Urine Culture & Antibiotic Sensitivity (C/S)", category: "Microbiology", price: 800, sample: "Clean Catch Urine", specimen: "Sterile Urine Specimen" },
  { id: 28, tid: "T128", code: "HBSAG", name: "HBsAg (Hepatitis B Surface Antigen)", category: "Serology", price: 500, sample: "Serum", specimen: "Venous Blood Serum" },
  { id: 29, tid: "T129", code: "HCV", name: "Anti-HCV (Hepatitis C Antibody)", category: "Serology", price: 800, sample: "Serum", specimen: "Venous Blood Serum" }
];

// Initial Demo Pharmacy Orders
export const initialPharmacyOrders = [
  {
    id: "ORD-901",
    customer_name: "John Doe",
    customer_phone: "01811112233",
    delivery_address: "House 12, Road 4, Banani, Dhaka",
    items: [
      { id: 1, name: "Napa Extra", qty: 2, price: 60 },
      { id: 3, name: "Bextram Gold Multivitamin", qty: 1, price: 340 }
    ],
    totalAmount: 460,
    paymentMethod: "Cash on Delivery",
    status: "Delivered",
    orderDate: "2026-11-21"
  }
];

// Initial Demo Lab Bookings
export const initialLabBookings = [
  {
    id: "LAB-112230",
    test_number: "112230",
    patient_id: "P01",
    patient_name: "John Doe",
    patient_phone: "01811112233",
    package_name: "Advanced Cardiac Health Profile",
    test_name: "Advanced Cardiac Health Profile",
    booking_date: "2026-11-26",
    collection_type: "Hospital Lab Counter #02",
    price: 2800,
    status: "Confirmed",
    address: "Banani, Dhaka",
    invoice_code: "INV-2026-089",
    created_from_accounts: true,
    paid: true
  }
];

// Initial Digital Prescriptions
export const initialPrescriptions = [
  {
    id: 1,
    prescription_code: "RX-2026-101",
    doctor_code: "D101",
    doctor_name: "Prof. Dr. Mahfuzur Rahman",
    doctor_specialty: "Cardiologist",
    patient_id: "P01",
    patient_name: "John Doe",
    patient_age: 45,
    patient_gender: "Male",
    patient_phone: "01811112233",
    date: "2026-11-23",
    vitals: { bp: "125/82 mmHg", pulse: "74 bpm", weight: "72 kg", temp: "98.4°F", sugar: "5.7 mmol/L" },
    diagnosis: "Primary Mild Hypertension & Exertional Chest Discomfort",
    medicines: [
      { name: "Tab. Concor 2.5mg", dosage: "1 + 0 + 0", duration: "30 Days", instruction: "Morning after breakfast" },
      { name: "Tab. Atova 10mg", dosage: "0 + 0 + 1", duration: "30 Days", instruction: "Night after dinner" },
      { name: "Tab. Ecospirin 75mg", dosage: "0 + 1 + 0", duration: "30 Days", instruction: "After lunch" }
    ],
    tests_advised: ["Serum Lipid Profile (12 hrs fasting)", "Echocardiogram (Echo)", "Serum Creatinine"],
    advice: "Avoid excess table salt and fried food. Engage in 30 mins brisk walking daily. Re-check BP in 2 weeks."
  }
];

// Initial Pathology Lab Reports
export const initialLabReports = [
  {
    id: 1,
    report_code: "REP-2026-101",
    booking_id: "LAB-401",
    patient_id: "P01",
    patient_name: "John Doe",
    patient_phone: "01811112233",
    test_name: "Lipid Profile (Serum)",
    technician_code: "L101",
    technician_name: "Md. Rafiqul Islam",
    verified_at: "2026-11-23 10:30 AM",
    status: "Verified & Approved",
    parameters: [
      { parameter: "Total Cholesterol", result: "215", unit: "mg/dL", reference: "< 200 mg/dL", flag: "HIGH" },
      { parameter: "HDL Cholesterol (Good)", result: "48", unit: "mg/dL", reference: "> 40 mg/dL", flag: "NORMAL" },
      { parameter: "LDL Cholesterol (Bad)", result: "138", unit: "mg/dL", reference: "< 100 mg/dL", flag: "HIGH" },
      { parameter: "Triglycerides", result: "165", unit: "mg/dL", reference: "< 150 mg/dL", flag: "BORDERLINE" },
      { parameter: "Chol / HDL Ratio", result: "4.4", unit: "ratio", reference: "< 4.5", flag: "NORMAL" }
    ],
    impression: "Mild Hypercholesterolemia with elevated LDL. Dietary modification and statin therapy recommended."
  }
];

// Initial Hospital Cash & POS Invoices
export const initialInvoices = [
  {
    id: 1,
    invoice_code: "INV-2026-089",
    patient_id: "P01",
    patient_name: "John Doe",
    patient_phone: "01811112233",
    cashier_code: "A101",
    cashier_name: "Kamal Hossain",
    counter: "Cash Counter #01",
    created_at: "2026-11-23 11:15 AM",
    items: [
      { description: "Doctor Consultation Fee (Prof. Dr. Mahfuzur Rahman)", amount: 1200 },
      { description: "Cardiac Diagnostic Profile Test Fee", amount: 2800 },
      { description: "Hospital OPD Service & Registration Charge", amount: 200 }
    ],
    subtotal: 4200,
    discount: 200,
    vat: 0,
    total_amount: 4000,
    payment_method: "bKash Digital Payment",
    trx_id: "BKASH-9X42LK89",
    status: "PAID"
  }
];
