export const INITIAL_CUSTOMERS = [];

export const INITIAL_EMPLOYEES = [
  { id: "EMP-001", name: "Rekha Sen", role: "Boutique Owner", contact: "+91 99009 90099", active: true }
];

export const INITIAL_ORDERS = [];

export const INITIAL_DESIGN_LIBRARY = [
  {
    id: "DSN-001",
    title: "Royal Crimson Zari Lehenga",
    category: "Lehenga",
    image: "/design_bridal_lehenga.png",
    description: "A breathtaking royal crimson lehenga in premium heavy velvet, featuring intricate hand-woven gold Zari embroidery, micro-pearl details, and a sheer silk dupatta. Perfect for grand bridal occasions.",
    budget: "Premium",
    neckType: "Sweetheart",
    sleeveType: "Elbow Length",
    occasion: "Bridal Wear",
    rating: 4.9,
    reviewsCount: 42,
    basePrice: 15000
  },
  {
    id: "DSN-002",
    title: "Navy Cutwork Silk Blouse",
    category: "Blouse",
    image: "/design_designer_blouse.png",
    description: "Elegant navy blue raw silk blouse detailed with designer cutwork patterns along the neckline and sleeves, finished with handmade back tassels (latkans) and soft padding.",
    budget: "Moderate",
    neckType: "Deep Round / Cutwork",
    sleeveType: "Short Sleeves",
    occasion: "Festive Wear",
    rating: 4.8,
    reviewsCount: 28,
    basePrice: 3500
  },
  {
    id: "DSN-003",
    title: "Emerald Green Satin Gown",
    category: "Gown",
    image: "/design_party_gown.png",
    description: "A luxurious emerald green gown tailored from high-luster Italian satin. Crafted in an elegant mermaid silhouette with a subtle trail and cowl-neck details for red-carpet sophistication.",
    budget: "Premium",
    neckType: "Cowl Neck",
    sleeveType: "Sleeveless",
    occasion: "Evening Gala",
    rating: 4.7,
    reviewsCount: 15,
    basePrice: 8000
  },
  {
    id: "DSN-004",
    title: "Ivory Pearl Embroidered Chudidar Set",
    category: "Chudidar",
    image: "/design_designer_blouse.png",
    description: "A sophisticated ivory silk georgette kurti paired with a classic churidar. Beautifully detailed with delicate pearl outline embroidery and a hand-dyed chiffon dupatta.",
    budget: "Moderate",
    neckType: "Mandarin Collar",
    sleeveType: "Full Sleeves",
    occasion: "Semi-Formal",
    rating: 4.6,
    reviewsCount: 19,
    basePrice: 5500
  }
];

export const INITIAL_INVENTORY = {
  fabrics: [
    { id: "FAB-001", name: "Silk Velvet (Crimson Red)", color: "Deep Crimson", supplier: "Surat Textiles", quantity: 24, minStock: 5 },
    { id: "FAB-002", name: "Raw Silk (Navy Blue)", color: "Navy Blue", supplier: "Banaras Weaves", quantity: 18, minStock: 5 },
    { id: "FAB-003", name: "Italian Satin (Emerald Green)", color: "Emerald Green", supplier: "Milan Imports", quantity: 15, minStock: 5 },
    { id: "FAB-004", name: "Pure Silk Georgette (Ivory)", color: "Ivory White", supplier: "Surat Textiles", quantity: 30, minStock: 8 }
  ],
  accessories: [
    { id: "ACC-001", name: "Gold Zari Border Trim", type: "Embroidery Border", quantity: 45, minStock: 10 },
    { id: "ACC-002", name: "Premium Back Latkans", type: "Handmade Tassel", quantity: 12, minStock: 5 },
    { id: "ACC-003", name: "Luxury Pearl Beads", type: "Bead Trim", quantity: 80, minStock: 20 },
    { id: "ACC-004", name: "Premium Metal Zippers", type: "Fastener", quantity: 35, minStock: 10 }
  ]
};

export const INITIAL_APPOINTMENTS = [];

