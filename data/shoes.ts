import type { Shoe } from "@/lib/types";

type Launch = {
  colorway: string;
  sku: string;
  releaseDate: string;
  image?: string;
};

type ModelSeed = {
  brand: string;
  model: string;
  retailPrice: number;
  launches: Launch[];
};

const prioritySkus = [
  "384664-060",
  "AQ3816-056",
  "JR1598",
  "DH6927-017",
  "IF0673-001",
  "IQ9772-001"
];

const modelSeeds: ModelSeed[] = [
  {
    brand: "Nike",
    model: "Dunk Low",
    retailPrice: 115,
    launches: [
      { colorway: "Black White (Panda)", sku: "DD1391-100", releaseDate: "2021-03-10" },
      { colorway: "Photon Dust", sku: "DD1503-103", releaseDate: "2021-08-14" },
      { colorway: "Michigan", sku: "DD1391-700", releaseDate: "2020-09-26" },
      { colorway: "UCLA", sku: "DD1391-402", releaseDate: "2022-06-03" }
    ]
  },
  {
    brand: "Nike",
    model: "Air Max 1",
    retailPrice: 150,
    launches: [
      { colorway: "Big Bubble Sport Red", sku: "DZ2628-100", releaseDate: "2023-03-26" },
      { colorway: "Patta Monarch", sku: "DH1348-001", releaseDate: "2021-10-15" },
      { colorway: "Chili 2.0", sku: "FD9082-101", releaseDate: "2023-11-10" },
      { colorway: "Kasina Won-Ang Grey", sku: "DQ8475-001", releaseDate: "2022-06-08" }
    ]
  },
  {
    brand: "Nike",
    model: "Air Force 1 Low",
    retailPrice: 115,
    launches: [
      {
        colorway: "Ja Morant Swarovski",
        sku: "IQ9772-001",
        releaseDate: "2026-01-09",
        image: "/shoes/nike-air-force-1-low-ja-morant-swarovski-iq9772-001.avif"
      },
      { colorway: "Triple White", sku: "CW2288-111", releaseDate: "2018-01-01" },
      { colorway: "Triple Black", sku: "CW2288-001", releaseDate: "2018-01-01" },
      { colorway: "Linen", sku: "CU6312-200", releaseDate: "2024-04-11" },
      { colorway: "Supreme White", sku: "CU9225-100", releaseDate: "2020-03-05" }
    ]
  },
  {
    brand: "Jordan",
    model: "Air Jordan 1 High OG",
    retailPrice: 180,
    launches: [
      { colorway: "Lost and Found", sku: "DZ5485-612", releaseDate: "2022-11-19" },
      { colorway: "University Blue", sku: "555088-134", releaseDate: "2021-03-06" },
      { colorway: "Dark Mocha", sku: "555088-105", releaseDate: "2020-10-31" },
      { colorway: "Bred Toe", sku: "555088-610", releaseDate: "2018-02-24" }
    ]
  },
  {
    brand: "Jordan",
    model: "Air Jordan 4 Retro",
    retailPrice: 215,
    launches: [
      {
        colorway: "Raptors Drake 2019",
        sku: "AQ3816-056",
        releaseDate: "2019-06-02",
        image: "/shoes/air-jordan-4-retro-raptors-drake-2019.avif"
      },
      { colorway: "Bred Reimagined", sku: "FV5029-006", releaseDate: "2024-02-17" },
      { colorway: "Military Blue", sku: "FV5029-141", releaseDate: "2024-05-04" },
      {
        colorway: "Thunder",
        sku: "DH6927-017",
        releaseDate: "2023-05-13",
        image: "/shoes/mens-jordan-4-retro-thunder-2023-black-tour-yellow.webp"
      },
      { colorway: "SB Pine Green", sku: "DR5415-103", releaseDate: "2023-03-21" }
    ]
  },
  {
    brand: "Jordan",
    model: "Air Jordan 6 Retro",
    retailPrice: 200,
    launches: [
      {
        colorway: "Reverse Infrared",
        sku: "384664-060",
        releaseDate: "2026-02-14",
        image: "/shoes/air-jordan-6-retro-reverse-infrared.webp"
      },
      { colorway: "Infrared", sku: "384664-060-2024", releaseDate: "2024-11-23" },
      { colorway: "Carmine", sku: "CT8529-106", releaseDate: "2021-02-13" },
      { colorway: "Travis Scott British Khaki", sku: "DH0690-200", releaseDate: "2021-04-30" }
    ]
  },
  {
    brand: "Jordan",
    model: "Air Jordan 3 Retro",
    retailPrice: 210,
    launches: [
      { colorway: "White Cement Reimagined", sku: "DN3707-100", releaseDate: "2023-03-11" },
      { colorway: "Black Cement", sku: "DN3707-010", releaseDate: "2018-02-17" },
      { colorway: "Craft Ivory", sku: "FJ9479-100", releaseDate: "2024-02-03" },
      { colorway: "A Ma Maniere While You Were Sleeping", sku: "FZ4811-001", releaseDate: "2024-08-20" }
    ]
  },
  {
    brand: "adidas",
    model: "Harden Volume 10",
    retailPrice: 160,
    launches: [
      {
        colorway: "Black",
        sku: "JR1598",
        releaseDate: "2025-12-10",
        image: "/shoes/harden-volume-10-black-jr1598.avif"
      }
    ]
  },
  {
    brand: "adidas",
    model: "Yeezy Boost 350 V2",
    retailPrice: 230,
    launches: [
      { colorway: "Zebra", sku: "CP9654", releaseDate: "2017-02-25" },
      { colorway: "Onyx", sku: "HQ4540", releaseDate: "2022-06-20" },
      { colorway: "Static Reflective", sku: "EF2367", releaseDate: "2018-12-26" },
      { colorway: "Bone", sku: "HQ6316", releaseDate: "2022-03-21" }
    ]
  },
  {
    brand: "adidas",
    model: "Samba OG",
    retailPrice: 100,
    launches: [
      { colorway: "Cloud White Core Black", sku: "B75806", releaseDate: "2018-06-01" },
      { colorway: "Core Black Cloud White", sku: "B75807", releaseDate: "2018-06-01" },
      { colorway: "Sporty & Rich White Green", sku: "IE7096", releaseDate: "2023-11-10" },
      { colorway: "Wales Bonner Silver", sku: "IG8181", releaseDate: "2023-11-08" }
    ]
  },
  {
    brand: "New Balance",
    model: "550",
    retailPrice: 120,
    launches: [
      { colorway: "White Green", sku: "BB550WT1", releaseDate: "2020-10-16" },
      { colorway: "White Grey", sku: "BB550PB1", releaseDate: "2021-06-24" },
      { colorway: "Aime Leon Dore Natural Green", sku: "BB550A2", releaseDate: "2022-10-20" },
      { colorway: "Sea Salt Burgundy", sku: "BB550LWT", releaseDate: "2023-09-14" }
    ]
  },
  {
    brand: "New Balance",
    model: "2002R",
    retailPrice: 145,
    launches: [
      { colorway: "Protection Pack Rain Cloud", sku: "M2002RDA", releaseDate: "2021-08-25" },
      { colorway: "Protection Pack Phantom", sku: "M2002RDB", releaseDate: "2021-08-25" },
      { colorway: "Steel Grey", sku: "M2002RST", releaseDate: "2023-05-12" },
      { colorway: "Refined Future Dark Navy", sku: "M2002RDN", releaseDate: "2022-10-28" }
    ]
  },
  {
    brand: "ASICS",
    model: "Gel-Kayano 14",
    retailPrice: 155,
    launches: [
      { colorway: "Cream Black", sku: "1201A019-108", releaseDate: "2022-08-03" },
      { colorway: "White Midnight", sku: "1201A019-109", releaseDate: "2023-02-18" },
      { colorway: "Oyster Grey", sku: "1201A019-103", releaseDate: "2023-09-01" },
      { colorway: "JJJJound Silver Black", sku: "1201A457-100", releaseDate: "2022-08-26" }
    ]
  },
  {
    brand: "ASICS",
    model: "Gel-1130",
    retailPrice: 100,
    launches: [
      { colorway: "White Clay Canyon", sku: "1201A255-112", releaseDate: "2023-02-10" },
      { colorway: "Black Pure Silver", sku: "1201A255-001", releaseDate: "2023-01-20" },
      { colorway: "White Shark Skin", sku: "1201A255-021", releaseDate: "2023-08-12" },
      { colorway: "HAL Studios Forest", sku: "1201A982-300", releaseDate: "2024-05-17" }
    ]
  },
  {
    brand: "Salomon",
    model: "XT-6",
    retailPrice: 200,
    launches: [
      { colorway: "White Lunar Rock", sku: "L47444800", releaseDate: "2022-09-01" },
      { colorway: "Black Phantom", sku: "L41086600", releaseDate: "2021-03-01" },
      { colorway: "Sandy Liang Cradle Pink", sku: "L47242300", releaseDate: "2023-10-05" },
      { colorway: "Evening Primrose", sku: "L47445300", releaseDate: "2024-03-14" }
    ]
  },
  {
    brand: "Nike SB",
    model: "Dunk Low",
    retailPrice: 130,
    launches: [
      {
        colorway: "Kirkland Signature",
        sku: "IF0673-001",
        releaseDate: "2025-09-16",
        image: "/shoes/nike-sb-dunk-low-kirkland-signature-if0673-001.avif"
      },
      { colorway: "Travis Scott", sku: "CT5053-001", releaseDate: "2020-02-29" },
      { colorway: "Jarritos", sku: "FD0860-001", releaseDate: "2023-05-06" },
      { colorway: "Yuto Horigome", sku: "FQ1180-001", releaseDate: "2023-08-25" },
      { colorway: "Powerpuff Girls Bubbles", sku: "FZ8320-400", releaseDate: "2023-12-14" }
    ]
  }
];

const sizeRuns = [
  [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
  [5, 5.5, 6, 6.5, 7, 8, 8.5, 9, 9.5, 10, 11, 12],
  [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13]
];

const variants = ["Standard", "Special Box", "No Lid"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const generatedShoes: Shoe[] = modelSeeds.flatMap((modelSeed, modelIndex) => {
  return modelSeed.launches.map((launch, launchIndex) => {
    const id = `${slugify(modelSeed.brand)}-${slugify(modelSeed.model)}-${slugify(launch.colorway)}`;

    return {
      id,
      name: `${modelSeed.model} ${launch.colorway}`,
      brand: modelSeed.brand,
      sku: launch.sku,
      colorway: launch.colorway,
      releaseDate: new Date(`${launch.releaseDate}T12:00:00.000Z`).toISOString(),
      retailPrice: modelSeed.retailPrice,
      images: [launch.image ?? "/shoe-placeholder.png"],
      availableSizes: sizeRuns[(modelIndex + launchIndex) % sizeRuns.length],
      variants: variants.slice(0, 2 + ((modelIndex + launchIndex) % 2))
    };
  });
});

const priorityIndexBySku = new Map(prioritySkus.map((sku, index) => [sku, index]));

export const shoes: Shoe[] = generatedShoes
  .map((shoe, index) => ({ shoe, index }))
  .sort((a, b) => {
    const aPriority = priorityIndexBySku.get(a.shoe.sku);
    const bPriority = priorityIndexBySku.get(b.shoe.sku);

    if (aPriority !== undefined || bPriority !== undefined) {
      return (aPriority ?? Number.MAX_SAFE_INTEGER) - (bPriority ?? Number.MAX_SAFE_INTEGER);
    }

    return a.index - b.index;
  })
  .map((entry) => entry.shoe);

export function getShoeById(id: string): Shoe | undefined {
  return shoes.find((shoe) => shoe.id === id);
}

export function searchShoes(query: string): Shoe[] {
  if (!query.trim()) {
    return shoes;
  }

  const normalized = query.trim().toLowerCase();
  return shoes.filter((shoe) => {
    return (
      shoe.name.toLowerCase().includes(normalized) ||
      shoe.sku.toLowerCase().includes(normalized) ||
      shoe.brand.toLowerCase().includes(normalized) ||
      shoe.colorway.toLowerCase().includes(normalized)
    );
  });
}
