/**
 * The ten campus species Blue Bird listens for (same list as the BirdNET server's
 * targets in ../birnet/app/species.py).
 *
 * Photos are local copies of Wikimedia Commons images (downloaded 2026-10-11). Their
 * CC BY / CC BY-SA licences require the credit shown on each card — keep `credit`
 * with the image if you reuse it.
 */

export type Detection = "birdnet" | "custom-model-needed";

export type CampusBird = {
  slug: string;
  name: string;
  scientific: string;
  /** Local name where it is commonly used in Assam. */
  localName?: string;
  status: "Least Concern" | "Near Threatened" | "Endangered" | "Domestic";
  description: string;
  listenFor: string;
  detection: Detection;
  detectionNote: string;
  image: { src: string; width: number; height: number; position?: string };
  credit: { author: string; license: string; source: string };
};

export const campusBirds: CampusBird[] = [
  {
    slug: "indian-peafowl",
    name: "Indian Peafowl",
    scientific: "Pavo cristatus",
    status: "Least Concern",
    description:
      "India's national bird. Males carry an iridescent blue neck and a long train of eye-spotted feathers; females are browner with a green neck. They forage on the ground and roost high in trees at night.",
    listenFor: "A loud, far-carrying “may-awe”, most often at dawn, at dusk and before rain.",
    detection: "birdnet",
    detectionNote: "In BirdNET; kept eligible even where the range filter would drop it.",
    image: { src: "/images/birds/indian-peafowl.jpg", width: 960, height: 1440, position: "50% 30%" },
    credit: {
      author: "Kandukuru Nagarjun",
      license: "CC BY 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Peacock_on_tree_(52077240794).jpg",
    },
  },
  {
    slug: "alexandrine-parakeet",
    name: "Alexandrine Parakeet",
    scientific: "Psittacula eupatria",
    status: "Near Threatened",
    description:
      "The largest of the Asian ring-necked parakeets: green with a maroon shoulder patch and a heavy red bill. Adult males add a black-and-rose collar. Usually in noisy flocks around tall fruiting trees.",
    listenFor: "Loud, harsh, rolling screeches — deeper than the smaller Rose-ringed Parakeet.",
    detection: "birdnet",
    detectionNote: "In BirdNET. Rose-ringed Parakeet is used as a look-alike negative in training.",
    image: { src: "/images/birds/alexandrine-parakeet.jpg", width: 960, height: 1441, position: "50% 20%" },
    credit: {
      author: "Charles J. Sharp",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Alexandrine_parakeet_(Psittacula_eupatria_eupatria)_male.jpg",
    },
  },
  {
    slug: "greater-adjutant",
    name: "Greater Adjutant",
    scientific: "Leptoptilos dubius",
    localName: "Hargila",
    status: "Endangered",
    description:
      "A huge stork with a bare pinkish head and a hanging throat pouch. Assam holds most of the world's remaining population, and the birds are a familiar sight around Guwahati's wetlands and landfills.",
    listenFor: "Mostly silent — bill-clattering, grunts and hisses at the nest rather than song.",
    detection: "custom-model-needed",
    detectionNote: "Not in BirdNET v2.4. Needs the custom classifier, and audio is a weak signal for it.",
    image: { src: "/images/birds/greater-adjutant.jpg", width: 960, height: 640, position: "30% 50%" },
    credit: {
      author: "Yathin S Krishnappa",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Leptoptilos_dubius_(Assam,_2007).jpg",
    },
  },
  {
    slug: "crested-serpent-eagle",
    name: "Crested Serpent-Eagle",
    scientific: "Spilornis cheela",
    status: "Least Concern",
    description:
      "A dark, broad-winged forest eagle with bright yellow facial skin and a short, fan-like crest. As the name says, it feeds largely on snakes, often watching from a shaded perch.",
    listenFor: "A ringing, whistled “kluee-wip-wip” given while soaring over the canopy.",
    detection: "birdnet",
    detectionNote: "In BirdNET; best caught by its flight whistle, so expect lower recall on perched birds.",
    image: { src: "/images/birds/crested-serpent-eagle.jpg", width: 667, height: 1000, position: "50% 25%" },
    credit: {
      author: "Yathin S Krishnappa",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Spilornis_cheela_(Bandipur,_2008).jpg",
    },
  },
  {
    slug: "brown-fish-owl",
    name: "Brown Fish-Owl",
    scientific: "Ketupa zeylonensis",
    status: "Least Concern",
    description:
      "A large owl with loose ear tufts and golden-yellow eyes that lives near water. It hunts fish, frogs and crabs at dusk and spends the day hidden in dense trees.",
    listenFor: "A deep, booming “boom-o-boom” after sunset.",
    detection: "birdnet",
    detectionNote: "In BirdNET.",
    image: { src: "/images/birds/brown-fish-owl.jpg", width: 960, height: 1111, position: "40% 40%" },
    credit: {
      author: "Somaskanda",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Brown_fishing_owl.jpg",
    },
  },
  {
    slug: "black-drongo",
    name: "Black Drongo",
    scientific: "Dicrurus macrocercus",
    status: "Least Concern",
    description:
      "Glossy black with a deeply forked tail, usually perched on a wire or bare branch. It sallies out after insects and fearlessly chases crows and raptors away from its nest.",
    listenFor: "Varied harsh “ti-tiu” calls and a good deal of mimicry.",
    detection: "birdnet",
    detectionNote: "In BirdNET, but stock scores peaked at 0.51 in tests; the planned custom classifier should lift it.",
    image: { src: "/images/birds/black-drongo.jpg", width: 761, height: 930, position: "50% 40%" },
    credit: {
      author: "Swardeepak",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Bdrongo-Sandeep1.jpg",
    },
  },
  {
    slug: "black-kite",
    name: "Black Kite",
    scientific: "Milvus migrans",
    status: "Least Concern",
    description:
      "A medium-sized brown raptor with a shallow forked tail that it twists as it steers. Very at home around towns, it circles over campuses and markets looking for scraps.",
    listenFor: "A thin, whinnying whistle, often from birds circling overhead.",
    detection: "birdnet",
    detectionNote: "In BirdNET, but stock scores peaked at 0.43 in tests; the planned custom classifier should lift it.",
    image: { src: "/images/birds/black-kite.jpg", width: 960, height: 1440, position: "50% 20%" },
    credit: {
      author: "Andreas Trepte",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Schwarzmilan.jpg",
    },
  },
  {
    slug: "house-sparrow",
    name: "House Sparrow",
    scientific: "Passer domesticus",
    status: "Least Concern",
    description:
      "The small brown bird that lives wherever people do. Males have a grey crown, chestnut nape and black bib; females are plain buff-brown. Nests in building gaps and eaves.",
    listenFor: "Constant cheerful chirping, loudest from groups in hedges and roofs.",
    detection: "birdnet",
    detectionNote: "In BirdNET. Tree Sparrow is used as a look-alike negative in training.",
    image: { src: "/images/birds/house-sparrow.jpg", width: 960, height: 747, position: "45% 50%" },
    credit: {
      author: "Rhododendrites",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:House_sparrow_male_in_Prospect_Park_(53532).jpg",
    },
  },
  {
    slug: "white-winged-duck",
    name: "White-winged Duck",
    scientific: "Asarcornis scutulata",
    localName: "Deohanh",
    status: "Endangered",
    description:
      "The state bird of Assam: a large, shy forest duck with a dark body, a white head flecked with black and white wing patches. It keeps to secluded pools in evergreen forest.",
    listenFor: "Drawn-out honks and wheezy whistles, mostly at dawn and dusk.",
    detection: "custom-model-needed",
    detectionNote: "Not in BirdNET v2.4. Detectable only via the custom classifier, if enough recordings exist.",
    image: { src: "/images/birds/white-winged-duck.jpg", width: 960, height: 720, position: "60% 60%" },
    credit: {
      author: "Nejib Ahmed",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:White-winged_wood_duck.jpg",
    },
  },
  {
    slug: "domestic-goose",
    name: "Domestic Goose",
    scientific: "Anser anser / A. cygnoides (domestic)",
    localName: "Rajhanh",
    status: "Domestic",
    description:
      "Farmyard geese descend from the Graylag Goose and the Swan Goose, and still sound like them. They are kept around villages and campus ponds and make reliable watch-birds.",
    listenFor: "Loud honking, especially when disturbed.",
    detection: "birdnet",
    detectionNote: "BirdNET has no domestic class; Graylag or Swan Goose detections are reported as domestic goose.",
    image: { src: "/images/birds/domestic-goose.jpg", width: 960, height: 703, position: "30% 50%" },
    credit: {
      author: "Tomás Del Coro",
      license: "CC BY-SA 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Sunset_Park_-_Las_Vegas_(11044584144).jpg",
    },
  },
];
