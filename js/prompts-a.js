// Krillion answer bank, part A.
// Tiers: p = Plankton (10), c = Too Clever (15), s = Schooler (30), r = Rare (60), d = Deep Cut (85), k = One in a Krillion (100, exactly one).
// Answers are separated by ";" and aliases for the same answer by "/". The first alias is what's shown.
window.KRILLION_PROMPTS = (window.KRILLION_PROMPTS || []).concat([
{
  id: 'cheese', q: 'Name a cheese', cat: 'Food & drink',
  p: 'cheddar;mozzarella;swiss;parmesan/parmigiano reggiano/parmigiano;brie',
  c: 'casu marzu',
  s: 'feta;gouda;camembert;gruyere;provolone;ricotta;colby;monterey jack/jack;pepper jack;havarti;blue cheese/blue;gorgonzola;roquefort;stilton;manchego;cream cheese;cottage cheese;halloumi;goat cheese/chevre;american cheese/american;muenster;emmental/emmentaler;edam;mascarpone;burrata;pecorino/pecorino romano;asiago;paneer;queso fresco;string cheese;colby jack',
  r: 'taleggio;fontina;comte;raclette;jarlsberg;limburger;reblochon;cotija;oaxaca;port salut;wensleydale;red leicester;double gloucester;caerphilly;leerdammer;boursin;neufchatel;quark;labneh;humboldt fog;morbier;brunost/gjetost;cabrales;mimolette;appenzeller;scamorza;kasseri;cambozola;lancashire;cheshire;cashel blue;dubliner;munster;pont l eveque;grana padano;bel paese;manouri;tilsit;butterkase;cantal;beaufort;vacherin;tomme;chihuahua;panela;queso blanco;provola;kefalotyri;stinking bishop;epoisses;saint andre;queso oaxaca;danish blue;mizithra;caciocavallo',
  d: 'castelmagno;bitto;montasio;roncal;idiazabal;tetilla;mahon;ossau iraty;abondance;saint nectaire;livarot;maroilles;banon;valencay;crottin;coulommiers;tete de moine;stracchino;robiola;crescenza;squacquerone;quartirolo;graviera;bryndza;oscypek;nabulsi;akkawi;chhena;shropshire blue;sbrinz;formaggio di fossa;torta del casar;bleu d auvergne;fourme d ambert;langres;mont d or;kashkaval;sulguni;rush creek reserve;harbison',
  k: 'leyden/leidse kaas'
},
{
  id: 'fruit', q: 'Name a fruit', cat: 'Food & drink',
  p: 'apple;banana;orange;strawberry;grape',
  c: 'durian',
  s: 'pear;peach;mango;pineapple;watermelon;cherry;blueberry;raspberry;lemon;lime;kiwi/kiwifruit;plum;grapefruit;cantaloupe;honeydew;blackberry;apricot;nectarine;pomegranate;papaya;coconut;fig;avocado;tomato;cranberry;tangerine;clementine;melon;mandarin;date;passion fruit;dragon fruit/pitaya;guava',
  r: 'lychee/litchi;persimmon;kumquat;star fruit/carambola;jackfruit;quince;gooseberry;elderberry;mulberry;boysenberry;huckleberry;currant/blackcurrant/redcurrant;plantain;mangosteen;rambutan;longan;loquat;yuzu;pomelo;ugli fruit;tamarind;soursop/guanabana;cherimoya/custard apple;feijoa;prickly pear;blood orange;breadfruit;acai;goji berry;olive;lingonberry;cloudberry;salmonberry;marionberry;tayberry;loganberry;sapodilla;sugar apple;bergamot;key lime;medlar;damson;greengage;pawpaw;physalis/ground cherry/cape gooseberry',
  d: 'jabuticaba;salak/snake fruit;langsat;duku;santol;marang;cupuacu;buddha s hand;finger lime;miracle fruit;mamey sapote;black sapote;white sapote;canistel;ackee;noni;bilimbi;jujube;sea buckthorn;aronia/chokeberry;serviceberry/saskatoon;rowan;hawthorn;mayhaw;che;pitanga/surinam cherry;camu camu;lucuma;naranjilla;tamarillo;pepino;kiwano/horned melon;monstera deliciosa;ice cream bean;wood apple;bael;kokum;karonda;phalsa;cempedak;kepel;voavanga',
  k: 'calamansi/calamondin'
},
{
  id: 'vegetable', q: 'Name a vegetable', cat: 'Food & drink',
  p: 'carrot;broccoli;potato;lettuce;corn',
  c: 'tomato',
  s: 'onion;spinach;celery;cucumber;pea;green bean;cabbage;cauliflower;pepper/bell pepper;zucchini/courgette;asparagus;kale;garlic;mushroom;eggplant/aubergine;sweet potato;beet/beetroot;radish;squash;pumpkin;brussels sprout;artichoke;leek;turnip;yam;okra;bok choy/pak choi;arugula/rocket;jalapeno;chickpea',
  r: 'parsnip;rutabaga/swede;kohlrabi;fennel;jicama;chard/swiss chard;collard greens/collards;watercress;endive;radicchio;daikon;celeriac;jerusalem artichoke/sunchoke;shallot;scallion/green onion/spring onion;rhubarb;bamboo shoot;water chestnut;taro;cassava/yuca;butternut squash;acorn squash;spaghetti squash;broccolini;romanesco;mustard greens;dandelion greens;sorrel;chayote;edamame;fava bean/broad bean;lima bean;snow pea;sugar snap pea;tomatillo;horseradish;wasabi;ginger;turmeric;bean sprout;napa cabbage;savoy cabbage;escarole;frisee;mache;purslane',
  d: 'salsify;scorzonera;burdock/gobo;lotus root;fiddlehead;ramp;cardoon;samphire;sea kale;oca;ulluco;mashua;yacon;malanga;chinese artichoke/crosne;celtuce;gai lan/chinese broccoli;choy sum;tatsoi;mizuna;komatsuna;water spinach/kangkong;moringa;bitter melon;luffa;winged bean;yardlong bean;drumstick;skirret;hamburg parsley;good king henry;orache;lamb s quarters;nopales;kalette;agretti;puntarelle;cime di rapa/rapini/broccoli rabe',
  k: 'arracacha'
},
{
  id: 'pasta', q: 'Name a pasta shape', cat: 'Food & drink',
  p: 'spaghetti;penne;macaroni;lasagna/lasagne;fettuccine',
  c: 'radiatori',
  s: 'linguine;rigatoni;fusilli;farfalle/bow tie;ravioli;tortellini;rotini;orzo;ziti;angel hair/capellini;shells/conchiglie;gnocchi;tagliatelle;pappardelle;elbow;manicotti;cannelloni;vermicelli;bucatini;orecchiette',
  r: 'cavatappi;campanelle;gemelli;ditalini;tortelloni;agnolotti;cavatelli;paccheri;mafalda/mafaldine;stelline;acini di pepe;anelli;rotelle/wagon wheel;casarecce;strozzapreti;trofie;tortiglioni;mezze maniche;fregola;cappelletti;sacchetti;fiori;gigli;lumache;conchiglioni;spaghettini;fedelini;bigoli;pici;tonnarelli;ziti tagliati;garganelli;malloreddus;calamarata;scialatielli',
  d: 'corzetti;lorighittas;busiate;croxetti;foglie d ulivo;cencioni;lagane;maltagliati;sagnarelli;stringozzi;umbricelli;tajarin;ricciarelle;fileja;maccheroni al ferretto;loricelli;cappellacci;tortellacci;culurgiones;casoncelli;anolini;marubini;passatelli;spatzle;sorpresine;quadrettini;farfalline;tripolini;radiatore;creste di gallo;gramigna;sedanini;penne rigate;rigatoncini;mezzi rigatoni',
  k: 'su filindeu/filindeu'
},
{
  id: 'cocktail', q: 'Name a cocktail', cat: 'Food & drink',
  p: 'margarita;martini;mojito;old fashioned;cosmopolitan',
  c: 'corpse reviver',
  s: 'manhattan;pina colada;daiquiri;bloody mary;mai tai;long island iced tea;negroni;whiskey sour;moscow mule;mimosa;tequila sunrise;gin and tonic/g and t;cuba libre/rum and coke;white russian;screwdriver;espresso martini;aperol spritz/spritz;paloma;sangria;sex on the beach;mint julep;bellini;caipirinha;tom collins;gimlet;dark and stormy;sidecar;french 75;irish coffee;black russian',
  r: 'sazerac;aviation;last word;boulevardier;vieux carre;paper plane;penicillin;hurricane;zombie;singapore sling;pisco sour;bramble;cosmo;grasshopper;brandy alexander;rob roy;rusty nail;hanky panky;bees knees;southside;gin fizz;ramos gin fizz;mudslide;sea breeze;bay breeze;salty dog;greyhound;harvey wallbanger;kir royale;kir;americano;hugo spritz;michelada;caesar;tom and jerry;eggnog;hot toddy;painkiller;jungle bird;planter s punch;el diablo;el presidente;mary pickford;clover club;jack rose;sherry cobbler;vesper;dirty martini;lemon drop;appletini;mind eraser',
  d: 'saturn;suffering bastard;three dots and a dash;navy grog;fog cutter;scorpion bowl;trinidad sour;naked and famous;oaxaca old fashioned;gold rush;brown derby;blood and sand;bobby burns;monkey gland;hemingway daiquiri;twentieth century;remember the maine;toronto;improved whiskey cocktail;tuxedo;martinez;bijou;alaska;bamboo;adonis;widow s kiss;stinger;sherry flip;porto flip;whiskey smash;queen s park swizzle;rattlesnake;journalist;fish house punch;ward eight;bronx;satan s whiskers;angel face;pegu club;army and navy;doctor funk;corn n oil',
  k: 'chrysanthemum'
},
{
  id: 'breakfast', q: 'Name a breakfast food', cat: 'Food & drink',
  p: 'eggs/egg;bacon;pancakes/pancake;cereal;toast',
  c: 'cold pizza',
  s: 'waffles/waffle;oatmeal/porridge;french toast;bagel;sausage;yogurt;granola;muffin;croissant;hash browns;omelet/omelette;grits;biscuits and gravy;breakfast burrito;donut/doughnut;scrambled eggs;smoothie;fruit;eggs benedict;avocado toast;cinnamon roll;english muffin;scone;crepe;danish',
  r: 'shakshuka;huevos rancheros;chilaquiles;congee/jook;kedgeree;black pudding;full english;baked beans;kippers;bubble and squeak;porridge oats;muesli;overnight oats;quiche;frittata;breakfast sandwich;breakfast tacos;migas;menemen;dosa;idli;poha;upma;paratha;natto;miso soup;tamagoyaki;dim sum;youtiao;jianbing;pan con tomate;churros;tostada;pain au chocolat;kaya toast;roti canai;nasi lemak;arepa;gallo pinto;mangu;scrapple;goetta;corned beef hash;loco moco;spam musubi;dutch baby;crumpet;pop tarts;cream of wheat',
  d: 'ful medames;msemen;baghrir;khachapuri;syrniki;kasha;tvorog;bircher muesli;bolo do caju;pastel de nata;tapsilog;champorado;pandesal;banh mi op la;xoi;chai and rusk;puri bhaji;misal pav;vada pav;pesarattu;appam;puttu;idiyappam;anda bhurji;kahvalti;simit;borek;labneh and za atar;manakish;fatteh;hagelslag;ontbijtkoek;stroopwafel;rugbrod;smorrebrod;skyr;kringle;kanelbulle;leberkase;weisswurst',
  k: 'tattie scone/potato scone'
},
{
  id: 'spice', q: 'Name a herb or spice', cat: 'Food & drink',
  p: 'salt;pepper;basil;cinnamon;oregano',
  c: 'grains of paradise',
  s: 'garlic;paprika;cumin;thyme;rosemary;parsley;mint;dill;sage;nutmeg;ginger;turmeric;cilantro/coriander;chili powder;cayenne;clove/cloves;bay leaf;chives;saffron;vanilla;allspice;curry powder;cardamom;tarragon;mustard seed;fennel seed;garlic powder;onion powder;red pepper flakes;italian seasoning',
  r: 'star anise;anise;caraway;fenugreek;sumac;za atar;marjoram;lemongrass;galangal;kaffir lime leaf/makrut lime leaf;curry leaf;asafoetida/hing;nigella seed/kalonji;ajwain/carom;mace;juniper;celery seed;lovage;savory;chervil;borage;lemon balm;sichuan pepper;white pepper;pink peppercorn;long pepper;garam masala;five spice;ras el hanout;berbere;harissa;baharat;dukkah;herbes de provence;old bay;smoked paprika;ancho;chipotle;sesame seed;poppy seed;black cardamom;epazote;culantro;shiso/perilla;mahlab;mastic;annatto/achiote;wasabi',
  d: 'amchur;anardana;kokum;kalpasi/black stone flower;radhuni;panch phoron;sansho;sansho pepper;shichimi togarashi;timur;tasmanian pepperberry;wattleseed;lemon myrtle;anise myrtle;akudjura;grains of selim;uziza;calabash nutmeg;ethiopian cardamom;korarima;ajowan;long coriander;rau ram;sawtooth coriander;hoja santa;papalo;pipicha;mexican oregano;avens root;sweet cicely;woodruff;hyssop;rue;costmary;angelica;orris root;zedoary;black lime/loomi;dried rose petals;kala namak',
  k: 'mitmita'
},
{
  id: 'bird', q: 'Name a bird', cat: 'Animals',
  p: 'eagle;robin;penguin;owl;parrot',
  c: 'dodo',
  s: 'hawk;crow;pigeon;sparrow;blue jay;cardinal;flamingo;ostrich;hummingbird;duck;goose;swan;seagull/gull;pelican;woodpecker;falcon;chicken;turkey;peacock;emu;vulture;toucan;raven;canary;crane;stork;heron;kiwi;dove;bald eagle;finch;magpie',
  r: 'kingfisher;puffin;albatross;cormorant;egret;ibis;spoonbill;loon;grebe;osprey;kestrel;condor;roadrunner;quail;pheasant;grouse;partridge;starling;wren;warbler;oriole;tanager;bunting;chickadee;nuthatch;mockingbird;thrush;nightingale;lark;swallow;swift;martin;cuckoo;kookaburra;cassowary;rhea;macaw;cockatoo;cockatiel;budgie/budgerigar/parakeet;lovebird;lyrebird;bird of paradise;hornbill;sandpiper;plover;killdeer;avocet;oystercatcher;tern;skua;gannet;booby;frigatebird;petrel;shearwater;kakapo;kea;secretary bird;shoebill',
  d: 'hoatzin;potoo;oilbird;frogmouth;nightjar;whip poor will;bittern;limpkin;sunbittern;kagu;seriema;trumpeter;tinamou;jacana;pratincole;sheathbill;dipper;wallcreeper;treecreeper;bushtit;verdin;phainopepla;dickcissel;bobolink;grackle;cowbird;pipit;wagtail;accentor;shrike;vireo;gnatcatcher;kinglet;waxwing;crossbill;grosbeak;siskin;redpoll;longspur;honeyeater;sunbird;spiderhunter;broadbill;pitta;manakin;cotinga;umbrellabird;quetzal;trogon;motmot;tody;jacamar;puffbird;barbet;honeyguide;wryneck;mousebird;turaco;hamerkop',
  k: 'bananaquit'
},
{
  id: 'dog', q: 'Name a dog breed', cat: 'Animals',
  p: 'labrador/lab/labrador retriever;golden retriever;german shepherd;poodle;bulldog',
  c: 'xoloitzcuintli/xolo',
  s: 'beagle;chihuahua;husky/siberian husky;dachshund;pug;rottweiler;boxer;corgi;shih tzu;yorkshire terrier/yorkie;great dane;border collie;doberman;pitbull/pit bull;french bulldog/frenchie;australian shepherd;cocker spaniel;maltese;pomeranian;bichon frise;chow chow;dalmatian;saint bernard/st bernard;greyhound;bernese mountain dog;shiba inu;collie;basset hound;bloodhound;jack russell;schnauzer;labradoodle;goldendoodle;newfoundland',
  r: 'akita;samoyed;malamute/alaskan malamute;weimaraner;vizsla;rhodesian ridgeback;whippet;basenji;shar pei;mastiff;bullmastiff;cane corso;great pyrenees;irish wolfhound;borzoi;saluki;afghan hound;papillon;havanese;lhasa apso;pekingese;cavalier king charles spaniel;springer spaniel;brittany;pointer;setter/irish setter;newfie;keeshond;schipperke;scottish terrier/scottie;westie/west highland terrier;cairn terrier;airedale;bull terrier;staffordshire terrier;boston terrier;shetland sheepdog/sheltie;old english sheepdog;bearded collie;puli;komondor;chinese crested;italian greyhound;miniature pinscher;affenpinscher;brussels griffon;coton de tulear;bolognese;leonberger;tibetan mastiff;dogue de bordeaux;anatolian shepherd;kuvasz;belgian malinois;dutch shepherd;australian cattle dog/heeler;kelpie',
  d: 'lagotto romagnolo;spinone italiano;bergamasco;cirneco dell etna;pharaoh hound;ibizan hound;azawakh;sloughi;thai ridgeback;phu quoc ridgeback;catahoula;treeing walker coonhound;bluetick coonhound;redbone coonhound;plott hound;otterhound;harrier;grand basset griffon vendeen;petit basset griffon vendeen;norwegian lundehund;norwegian elkhound;finnish spitz;finnish lapphund;swedish vallhund;icelandic sheepdog;karelian bear dog;jindo;kai ken;kishu;shikoku;tosa;sealyham terrier;dandie dinmont terrier;skye terrier;glen of imaal terrier;bedlington terrier;cesky terrier;mudi;pumi;stabyhoun;kooikerhondje;nova scotia duck tolling retriever;boykin spaniel;sussex spaniel;clumber spaniel;field spaniel;wirehaired pointing griffon;chinook;mountain cur;portuguese podengo;peruvian inca orchid;carolina dog',
  k: 'drever'
},
{
  id: 'fish', q: 'Name a fish', cat: 'Animals',
  p: 'salmon;tuna;goldfish;shark;cod',
  c: 'humuhumunukunukuapuaa/reef triggerfish',
  s: 'trout;bass;catfish;tilapia;halibut;swordfish;clownfish;guppy;carp;koi;mackerel;sardine;anchovy;herring;mahi mahi/dorado;snapper;pike;perch;flounder;sole;eel;piranha;barracuda;stingray;marlin;betta;angelfish;pufferfish/puffer;grouper;haddock',
  r: 'sturgeon;walleye;bluegill;crappie;muskie/muskellunge;sunfish;minnow;shad;smelt;pollock;hake;monkfish;turbot;tilefish;wahoo;sailfish;bonito;yellowtail;amberjack;cobia;pompano;tarpon;bonefish;snook;redfish/red drum;sheepshead;whiting;lingcod;rockfish;sablefish/black cod;arctic char;grayling;whitefish;goby;blenny;wrasse;parrotfish;surgeonfish/tang;triggerfish;lionfish;scorpionfish;stonefish;seahorse;pipefish;moray;anglerfish;oarfish;sunfish mola/mola mola;tetra;molly;platy;swordtail;danio/zebrafish;discus;oscar;cichlid;arowana;gar;bowfin;lamprey;hagfish;coelacanth',
  d: 'lungfish;bichir;paddlefish;arapaima/pirarucu;payara;candiru;mudskipper;archerfish;four eyed fish;flashlight fish;hatchetfish;lanternfish;viperfish;fangtooth;barreleye;blobfish;gulper eel;frilled shark;goblin shark;wobbegong;sawfish;guitarfish;chimaera/ratfish;opah/moonfish;louvar;escolar;oilfish;snoek;barramundi;murray cod;mahseer;taimen;huchen;nase;zander;ruffe;burbot;tench;roach;rudd;chub;dace;bream;bleak;gudgeon;loach;weatherfish;knifefish;elephantnose fish;bowfin;mooneye;goldeye;sculpin;cusk;tautog;scup;croaker;weakfish',
  k: 'hogchoker'
},
{
  id: 'insect', q: 'Name an insect', cat: 'Animals',
  p: 'ant;bee;butterfly;fly;mosquito',
  c: 'spider',
  s: 'beetle;ladybug/ladybird;grasshopper;cricket;dragonfly;moth;wasp;cockroach/roach;termite;flea;firefly/lightning bug;praying mantis/mantis;caterpillar;hornet;cicada;stick insect/walking stick;bumblebee;gnat;louse/lice;aphid;yellowjacket;horsefly',
  r: 'earwig;silverfish;weevil;katydid;locust;damselfly;mayfly;stonefly;caddisfly;lacewing;antlion;scarab;dung beetle;stag beetle;rhino beetle/rhinoceros beetle;june bug;japanese beetle;boll weevil;stink bug;water strider;water boatman;backswimmer;cicada killer;mud dauber;sawfly;leafhopper;treehopper;planthopper;spittlebug;thrips;whitefly;mealybug;scale insect;bed bug;assassin bug;kissing bug;deer fly;botfly;tsetse fly;crane fly;fruit fly;hoverfly;blowfly;midge;no see um;gypsy moth;luna moth;atlas moth;hawk moth;monarch;swallowtail;emerald ash borer;bark beetle;firebrat;booklouse',
  d: 'webspinner;zorapteran;snakefly;dobsonfly;alderfly;owlfly;scorpionfly;hangingfly;twisted wing parasite/strepsipteran;rock crawler/grylloblattid;gladiator/mantophasmid;jumping bristletail;velvet ant;tarantula hawk;fig wasp;ichneumon wasp;chalcid wasp;cuckoo wasp;thread waisted wasp;pelecinid;giant water bug;toe biter;whirligig beetle;bombardier beetle;tiger beetle;rove beetle;click beetle;jewel beetle;longhorn beetle;hercules beetle;goliath beetle;titan beetle;oil beetle;blister beetle;darkling beetle;mealworm;hissing cockroach;weta;mole cricket;camel cricket;cave cricket;jerusalem cricket;pygmy grasshopper;lubber grasshopper;leaf insect;orchid mantis;ghost mantis',
  k: 'thornbug'
},
{
  id: 'ocean', q: 'Name a sea creature that is not a fish', cat: 'Animals',
  p: 'whale;dolphin;octopus;jellyfish;crab',
  c: 'krill',
  s: 'squid;starfish/sea star;lobster;shrimp;seal;sea turtle/turtle;sea urchin;clam;oyster;mussel;sea lion;walrus;manatee;orca/killer whale;coral;sea anemone/anemone;sea otter;narwhal;scallop;sea cucumber;sponge;cuttlefish;nautilus;blue whale;humpback;beluga',
  r: 'dugong;porpoise;sperm whale;barnacle;limpet;conch;whelk;abalone;nudibranch/sea slug;sea hare;sea pen;sea fan;sea lily/crinoid;brittle star;sand dollar;hermit crab;king crab;spider crab;mantis shrimp;horseshoe crab;isopod;giant isopod;copepod;amphipod;sea butterfly/pteropod;salp;sea squirt/tunicate;comb jelly/ctenophore;portuguese man o war;box jellyfish;by the wind sailor/velella;siphonophore;pyrosome;vampire squid;dumbo octopus;giant squid;colossal squid;blue ringed octopus;elephant seal;leopard seal;fur seal;monk seal;marine iguana;sea snake;sea krait;penguin;polar bear',
  d: 'yeti crab;pompeii worm;tube worm;bobbit worm;christmas tree worm;feather duster worm;peanut worm;ribbon worm;arrow worm;lancelet/amphioxus;acorn worm;sea pig;sea spider;coconut crab;decorator crab;sponge crab;boxer crab;pistol shrimp;cleaner shrimp;peacock mantis shrimp;skeleton shrimp;tongue eating louse;cookiecutter crab;chiton;tusk shell;sea angel;glaucus/blue dragon;sea sapphire;blue button;lion s mane jellyfish;immortal jellyfish;irukandji;sea gooseberry;venus girdle;glass sponge;basket star;feather star;sea apple;sea mouse;fireworm;giant clam;geoduck;piddock;shipworm;vaquita;baiji',
  k: 'xenophyophore'
},
{
  id: 'mammal', q: 'Name a mammal', cat: 'Animals',
  p: 'dog;cat;lion;elephant;human',
  c: 'platypus',
  s: 'tiger;bear;horse;cow;monkey;giraffe;zebra;wolf;deer;rabbit;mouse;rat;pig;sheep;goat;fox;kangaroo;koala;panda;gorilla;chimpanzee;bat;whale;dolphin;squirrel;hippo/hippopotamus;rhino/rhinoceros;camel;cheetah;leopard;raccoon;otter;beaver;moose;hamster;skunk;polar bear',
  r: 'aardvark;anteater;armadillo;sloth;tapir;okapi;wombat;wallaby;tasmanian devil;echidna;opossum;porcupine;hedgehog;mole;shrew;lemur;orangutan;bonobo;baboon;mandrill;gibbon;lynx;bobcat;cougar/puma/mountain lion;jaguar;ocelot;serval;caracal;hyena;meerkat;mongoose;badger;wolverine;ferret;weasel;mink;marten;stoat/ermine;chinchilla;capybara;guinea pig;gerbil;chipmunk;marmot;groundhog/woodchuck;prairie dog;llama;alpaca;bison;buffalo;yak;ibex;gazelle;antelope;wildebeest/gnu;impala;elk;caribou/reindeer;narwhal;walrus;manatee;red panda',
  d: 'pangolin;aye aye;tarsier;slow loris;galago/bushbaby;colugo/flying lemur;tree shrew;solenodon;tenrec;golden mole;elephant shrew/sengi;hyrax;dugong;aardwolf;fossa;binturong;genet;civet;kinkajou;coati;olingo;olinguito;ringtail;fisher;tayra;grison;zorilla;ratel/honey badger;quoll;numbat;bilby;quokka;bandicoot;cuscus;sugar glider;tree kangaroo;dik dik;gerenuk;saiga;takin;markhor;chevrotain/mouse deer;muntjac;babirusa;peccary/javelina;vicuna;guanaco;agouti;paca;pacarana;viscacha;mara;jerboa;naked mole rat;springhare;dormouse;desman;bongo;sitatunga',
  k: 'hirola'
},
{
  id: 'country', q: 'Name a country', cat: 'Geography',
  p: 'united states/usa/america/us;canada;china;france;mexico',
  c: 'vatican city/vatican/holy see',
  s: 'japan;germany;italy;spain;brazil;russia;india;australia;england/united kingdom/uk/great britain;egypt;argentina;south africa;greece;ireland;sweden;norway;netherlands/holland;portugal;switzerland;south korea/korea;nigeria;kenya;peru;chile;colombia;turkey;israel;thailand;vietnam;new zealand;poland;cuba;jamaica;iran;iraq;afghanistan;pakistan;saudi arabia',
  r: 'finland;denmark;iceland;austria;belgium;czech republic/czechia;hungary;romania;bulgaria;ukraine;belarus;croatia;serbia;slovenia;slovakia;estonia;latvia;lithuania;morocco;algeria;tunisia;libya;ethiopia;ghana;senegal;uganda;tanzania;rwanda;zimbabwe;zambia;botswana;namibia;madagascar;mongolia;nepal;bhutan;bangladesh;sri lanka;myanmar/burma;cambodia;laos;malaysia;singapore;indonesia;philippines;north korea;taiwan;venezuela;ecuador;bolivia;paraguay;uruguay;guatemala;honduras;nicaragua;costa rica;panama;el salvador;haiti;dominican republic;bahamas;barbados;jordan;lebanon;syria;yemen;oman;qatar;kuwait;bahrain;united arab emirates/uae;kazakhstan;uzbekistan;georgia;armenia;azerbaijan;scotland;wales;luxembourg;monaco;malta;cyprus;albania;fiji',
  d: 'liechtenstein;andorra;san marino;moldova;montenegro;north macedonia/macedonia;bosnia and herzegovina/bosnia;kosovo;kyrgyzstan;tajikistan;turkmenistan;brunei;east timor/timor leste;maldives;mauritius;seychelles;comoros;djibouti;eritrea;somalia;south sudan;sudan;chad;niger;mali;burkina faso;mauritania;gambia;guinea;guinea bissau;sierra leone;liberia;ivory coast/cote d ivoire;togo;benin;cameroon;gabon;equatorial guinea;sao tome and principe;republic of the congo/congo;democratic republic of the congo/drc;central african republic;angola;malawi;mozambique;lesotho;eswatini/swaziland;burundi;cape verde/cabo verde;belize;guyana;suriname;trinidad and tobago;grenada;dominica;saint lucia;saint vincent and the grenadines;antigua and barbuda;saint kitts and nevis;papua new guinea;solomon islands;vanuatu;samoa;tonga;kiribati;micronesia;marshall islands;palau;nauru',
  k: 'tuvalu'
},
{
  id: 'uscapital', q: 'Name a US state capital', cat: 'Geography',
  p: 'sacramento;austin;boston;atlanta;denver',
  c: 'montpelier',
  s: 'phoenix;nashville;honolulu;salem;olympia;albany;tallahassee;columbus;indianapolis;springfield;lansing;madison;saint paul/st paul;richmond;raleigh;salt lake city;oklahoma city;providence;hartford;baton rouge;little rock;las vegas;boise;santa fe;annapolis;harrisburg;trenton;juneau',
  r: 'carson city;helena;cheyenne;bismarck;lincoln;topeka;des moines;jefferson city;frankfort;charleston;columbia;montgomery;jackson;dover;concord',
  d: 'augusta',
  k: 'pierre'
},
{
  id: 'river', q: 'Name a river', cat: 'Geography',
  p: 'nile;amazon;mississippi;thames;hudson',
  c: 'river styx/styx',
  s: 'colorado;missouri;ohio;rio grande;columbia;danube;rhine;seine;ganges;yangtze;mekong;volga;tigris;euphrates;jordan;congo;niger;zambezi;potomac;delaware;snake;st lawrence;yellow river/huang he;tiber;willamette',
  r: 'yukon;mackenzie;fraser;sacramento;tennessee;arkansas;red river;platte;susquehanna;james;savannah;chattahoochee;charles;connecticut;merrimack;loire;rhone;garonne;elbe;oder;vistula;dnieper;don;ural;ob;yenisei;lena;amur;indus;brahmaputra;irrawaddy;salween;murray;darling;orinoco;parana;sao francisco;uruguay;limpopo;orange;severn;trent;mersey;clyde;shannon;liffey;po;arno;ebro;tagus;douro;guadalquivir;rubicon;mosel/moselle;main;neckar;spree;thames estuary',
  d: 'kolyma;indigirka;pechora;northern dvina;kama;oka;irtysh;syr darya;amu darya;helmand;kabul;sutlej;chenab;jhelum;ravi;beas;godavari;krishna;kaveri;narmada;tapti;mahanadi;chao phraya;red river vietnam;pearl river;han;nakdong;shinano;tone;fly;sepik;waikato;whanganui;clutha;okavango;kasai;ubangi;benue;senegal;gambia;volta;juba;shebelle;omo;awash;blue nile;white nile;atbara;magdalena;cauca;essequibo;maroni;xingu;tapajos;madeira;purus;jurua;negro;ucayali;maranon;pilcomayo;bermejo;salado;colorado argentina;chubut;santa cruz',
  k: 'onyx river/onyx'
},
{
  id: 'island', q: 'Name an island', cat: 'Geography',
  p: 'hawaii;greenland;australia;madagascar;cuba',
  c: 'sentinel island/north sentinel island',
  s: 'iceland;ireland;great britain;japan;jamaica;puerto rico;bali;sicily;sardinia;crete;cyprus;malta;tasmania;new zealand;maui;oahu;kauai;manhattan;long island;nantucket;martha s vineyard;bermuda;bahamas;fiji;tahiti;galapagos;sri lanka;taiwan;borneo;sumatra;java;new guinea;vancouver island;newfoundland;easter island;alcatraz;corsica;capri;santorini;mykonos;ibiza;mallorca/majorca',
  r: 'baffin island;ellesmere island;victoria island;sakhalin;hokkaido;honshu;kyushu;shikoku;okinawa;luzon;mindanao;sulawesi;hainan;zanzibar;mauritius;reunion;seychelles;socotra;svalbard;faroe islands;shetland;orkney;isle of skye/skye;isle of man;anglesey;isle of wight;jersey;guernsey;elba;rhodes;lesbos;corfu;kos;naxos;gotland;bornholm;aruba;curacao;barbados;trinidad;tobago;martinique;guadeloupe;st lucia;grenada;cozumel;roatan;tierra del fuego;chiloe;falkland islands;south georgia;st helena;ascension island;tristan da cunha;bora bora;moorea;guam;saipan;palau;marthas vineyard;san juan island;orcas island;catalina island;kodiak;st kitts',
  d: 'kerguelen;heard island;bouvet island;pitcairn;henderson island;clipperton island;norfolk island;lord howe island;christmas island;cocos island;diego garcia;amsterdam island;macquarie island;campbell island;wrangel island;novaya zemlya;franz josef land;severnaya zemlya;jan mayen;bear island;lampedusa;pantelleria;stromboli;lipari;ischia;procida;giglio;gozo;comino;hvar;brac;vis;korcula;mljet;krk;lofoten;saaremaa;hiiumaa;aland;fehmarn;rugen;sylt;heligoland;texel;terschelling;ameland;st kilda;foula;fair isle;iona;mull;islay;jura;arran;lundy;skellig michael;inishmore;achill;rathlin',
  k: 'motu nui'
},
{
  id: 'mountain', q: 'Name a mountain', cat: 'Geography',
  p: 'everest/mount everest;kilimanjaro;fuji/mount fuji;mount rushmore/rushmore;k2',
  c: 'olympus mons',
  s: 'mont blanc;matterhorn;denali/mckinley;mount rainier/rainier;mount st helens/st helens;mount hood/hood;pikes peak;mount whitney/whitney;mount olympus/olympus;mount sinai/sinai;vesuvius;etna;kilauea;mauna kea;mauna loa;mount kenya;aconcagua;table mountain;ben nevis;snowdon;half dome;el capitan;mount washington;mount shasta;grand teton;longs peak',
  r: 'kangchenjunga;lhotse;makalu;cho oyu;dhaulagiri;manaslu;nanga parbat;annapurna;shishapangma;gasherbrum;broad peak;eiger;jungfrau;monch;dom;weisshorn;monte rosa;grossglockner;zugspitze;triglav;elbrus;ararat;damavand;kosciuszko;aoraki/mount cook;chimborazo;cotopaxi;huascaran;ojos del salado;fitz roy;cerro torre;mount logan;mount robson;mount assiniboine;mount baker;mount adams;mount jefferson;three sisters;mount bachelor/bachelor;mount mitchell;mount katahdin/katahdin;mount elbert;mount massive;mount sneffels;mount tamalpais;mount diablo;mount kosciusko;stone mountain;mount vinson;mount erebus;popocatepetl;iztaccihuatl;pico de orizaba;mount pinatubo;krakatoa;mount kinabalu;jade mountain;mount tai',
  d: 'gangkhar puensum;namcha barwa;minya konka;mount kailash;amne machin;muztagh ata;kongur tagh;ismoil somoni;lenin peak;khan tengri;pobeda;belukha;klyuchevskaya;mount wilhelm;puncak jaya/carstensz pyramid;mount stanley;mount meru;ras dashen;mount cameroon;toubkal;emi koussi;thabana ntlenyana;mount mulanje;piton des neiges;mount ruapehu;taranaki;mount tasman;mount saint elias;mount lucania;king peak;mount fairweather;mount waddington;mount sir donald;mount sanford;mount blackburn;mount hayes;mount foraker;mount hunter;mount marcy;mount mansfield;black elk peak;guadalupe peak;wheeler peak;borah peak;gannett peak;kings peak;humphreys peak;boundary peak;mount rogers;clingmans dome;spruce knob;mount greylock;mount monadnock;mount thielsen;diamond peak;mount mcloughlin;mount scott;spencer butte',
  k: 'mount pisgah'
},
{
  id: 'element', q: 'Name a chemical element', cat: 'Science',
  p: 'oxygen;hydrogen;carbon;gold;iron',
  c: 'unobtainium',
  s: 'helium;nitrogen;silver;copper;sodium;calcium;potassium;chlorine;neon;aluminum/aluminium;lead;mercury;zinc;uranium;platinum;sulfur/sulphur;magnesium;silicon;phosphorus;lithium;tin;nickel;fluorine;iodine;plutonium;argon;titanium',
  r: 'cobalt;chromium;manganese;boron;beryllium;bromine;krypton;xenon;radon;radium;cesium/caesium;strontium;barium;tungsten;arsenic;selenium;antimony;bismuth;cadmium;palladium;rhodium;iridium;osmium;tantalum;vanadium;zirconium;molybdenum;germanium;gallium;indium;thallium;polonium;francium;rubidium;scandium;yttrium;lanthanum;cerium;neodymium;europium;gadolinium;thorium;americium;einsteinium;nobelium;californium;curium;tellurium',
  d: 'hafnium;rhenium;ruthenium;technetium;niobium;praseodymium;promethium;samarium;terbium;dysprosium;holmium;erbium;thulium;ytterbium;lutetium;actinium;protactinium;neptunium;berkelium;fermium;mendelevium;lawrencium;rutherfordium;dubnium;seaborgium;bohrium;hassium;meitnerium;darmstadtium;roentgenium;copernicium;nihonium;flerovium;moscovium;livermorium;tennessine;oganesson;astatine',
  k: 'ununennium'
},
{
  id: 'planetmoon', q: 'Name a moon in our solar system', cat: 'Science',
  p: 'the moon/moon/luna;titan;europa;io;ganymede',
  c: 'death star',
  s: 'callisto;phobos;deimos;enceladus;triton;charon;mimas',
  r: 'rhea;iapetus;dione;tethys;hyperion;phoebe;oberon;titania;miranda;ariel;umbriel;nereid;amalthea;himalia;proteus',
  d: 'janus;epimetheus;pan;atlas;prometheus;pandora;helene;telesto;calypso;daphnis;thebe;metis;adrastea;elara;pasiphae;sinope;lysithea;carme;ananke;leda;callirrhoe;themisto;puck;cordelia;ophelia;bianca;cressida;desdemona;juliet;portia;rosalind;belinda;perdita;mab;cupid;caliban;sycorax;prospero;setebos;stephano;trinculo;francisco;margaret;ferdinand;naiad;thalassa;despina;galatea;larissa;hippocamp;halimede;sao;laomedeia;psamathe;neso;nix;hydra;kerberos;styx;dysnomia;hiiaka;namaka;vanth;weywot;actaea;ymir;paaliaq;siarnaq;tarvos;kiviuq;ijiraq;mundilfari;albiorix;skathi;erriapus;suttungr;thrymr;narvi;aegaeon;methone;anthe;pallene;polydeuces',
  k: 'dactyl'
},
{
  id: 'bone', q: 'Name a bone in the human body', cat: 'Science',
  p: 'femur;skull;rib;spine;tibia',
  c: 'funny bone',
  s: 'humerus;radius;ulna;pelvis;fibula;clavicle/collarbone;patella/kneecap;sternum/breastbone;scapula/shoulder blade;vertebra/vertebrae;jaw/jawbone/mandible;cranium;tailbone/coccyx;phalanges/phalanx;hip bone;sacrum;stapes/stirrup;metacarpal;metatarsal',
  r: 'maxilla;zygomatic/cheekbone;occipital;parietal;frontal;temporal;sphenoid;ethmoid;nasal bone;lacrimal;vomer;palatine;hyoid;malleus/hammer;incus/anvil;atlas;axis;ilium;ischium;pubis;calcaneus/heel bone;talus;navicular;cuboid;cuneiform;scaphoid;lunate;triquetrum;pisiform;trapezium;trapezoid;capitate;hamate;carpal;tarsal;manubrium;xiphoid process/xiphoid',
  d: 'inferior nasal concha;medial cuneiform;intermediate cuneiform;lateral cuneiform;fabella;os trigonum;os acromiale;wormian bone/sutural bone;sesamoid;os peroneum;os vesalianum;accessory navicular;cervical rib;floating rib;false rib;true rib;thoracic vertebra;lumbar vertebra;cervical vertebra;sacral vertebra;coccygeal vertebra;distal phalanx;middle phalanx;proximal phalanx;hallux;pollex',
  k: 'os centrale'
},
{
  id: 'dinosaur', q: 'Name a dinosaur or prehistoric reptile', cat: 'Science',
  p: 't rex/tyrannosaurus/tyrannosaurus rex;triceratops;velociraptor/raptor;stegosaurus;brontosaurus',
  c: 'barney',
  s: 'pterodactyl/pteranodon;brachiosaurus;ankylosaurus;spinosaurus;diplodocus;allosaurus;apatosaurus;parasaurolophus;iguanodon;pachycephalosaurus;dilophosaurus;mosasaurus;plesiosaur;carnotaurus;compsognathus;gallimimus;argentinosaurus;giganotosaurus',
  r: 'deinonychus;utahraptor;oviraptor;therizinosaurus;maiasaura;hadrosaurus;edmontosaurus;corythosaurus;lambeosaurus;styracosaurus;protoceratops;centrosaurus;pentaceratops;kentrosaurus;euoplocephalus;nodosaurus;camarasaurus;titanosaurus;dreadnoughtus;patagotitan;baryonyx;suchomimus;megalosaurus;ceratosaurus;coelophysis;herrerasaurus;eoraptor;plateosaurus;microraptor;archaeopteryx;troodon;albertosaurus;daspletosaurus;tarbosaurus;yutyrannus;quetzalcoatlus;ichthyosaur;elasmosaurus;dimetrodon;sarcosuchus;deinosuchus;liopleurodon;kronosaurus;psittacosaurus;amargasaurus;sauropelta',
  d: 'nigersaurus;mamenchisaurus;shunosaurus;omeisaurus;sinosauropteryx;caudipteryx;beipiaosaurus;dakotaraptor;pyroraptor;austroraptor;buitreraptor;halszkaraptor;mononykus;shuvuuia;alvarezsaurus;deinocheirus;kosmoceratops;einiosaurus;achelousaurus;pachyrhinosaurus;nasutoceratops;regaliceratops;zuniceratops;leptoceratops;minmi;kunbarrasaurus;borealopelta;zuul;scelidosaurus;scutellosaurus;heterodontosaurus;tianyulong;hypsilophodon;thescelosaurus;muttaburrasaurus;ouranosaurus;tsintaosaurus;olorotitan;saurolophus;shantungosaurus;masiakasaurus;majungasaurus;rugops;abelisaurus;aucasaurus;skorpiovenator;irritator;oxalaia;concavenator;sinraptor;torvosaurus;acrocanthosaurus;tyrannotitan;mapusaurus;siats;moros;dracorex;stygimoloch',
  k: 'mei long/mei'
},
{
  id: 'constellation', q: 'Name a constellation', cat: 'Science',
  p: 'orion;big dipper;ursa major;little dipper;cassiopeia',
  c: 'southern cross/crux',
  s: 'ursa minor;leo;scorpius/scorpio;taurus;gemini;aries;cancer;virgo;libra;sagittarius;capricornus/capricorn;aquarius;pisces;draco;pegasus;cygnus;lyra;andromeda;perseus;hercules',
  r: 'cepheus;canis major;canis minor;bootes;aquila;auriga;corona borealis;corona australis;centaurus;hydra;ophiuchus;cetus;eridanus;lepus;monoceros;delphinus;sagitta;vulpecula;lacerta;triangulum;serpens;camelopardalis;lynx;leo minor;coma berenices;corvus;crater;columba;carina;vela;puppis;pavo;phoenix;grus;tucana;lupus;ara;dorado;volans',
  d: 'antlia;apus;caelum;chamaeleon;circinus;equuleus;fornax;horologium;hydrus;indus;mensa;microscopium;musca;norma;octans;pictor;piscis austrinus;pyxis;reticulum;scutum;sculptor;sextans;telescopium;triangulum australe;canes venatici',
  k: 'argo navis/argo'
},
{
  id: 'instrument', q: 'Name a musical instrument', cat: 'Music & arts',
  p: 'guitar;piano;drums/drum;violin;flute',
  c: 'theremin',
  s: 'trumpet;saxophone/sax;cello;clarinet;bass/bass guitar;harp;trombone;tuba;ukulele;banjo;harmonica;keyboard;organ;oboe;french horn/horn;xylophone;accordion;viola;tambourine;bagpipes;mandolin;triangle;cymbal;recorder;bassoon;piccolo;synthesizer;double bass/upright bass;kazoo;bongo',
  r: 'sitar;didgeridoo;marimba;vibraphone;glockenspiel;timpani;snare drum;cowbell;castanets;maracas;steel drum/steelpan;djembe;tabla;cajon;conga;lute;lyre;dulcimer;zither;autoharp;bouzouki;balalaika;koto;shamisen;erhu;pipa;oud;shakuhachi;pan flute/panpipes;ocarina;bugle;cornet;flugelhorn;euphonium;sousaphone;english horn/cor anglais;contrabassoon;harpsichord;clavichord;celesta;melodica;concertina;hurdy gurdy;banjolele;steel guitar;dobro;fiddle;mbira/kalimba/thumb piano;gong;handbell;washboard;spoons;jaw harp;bodhran;tin whistle;uilleann pipes',
  d: 'ondes martenot;glass harmonica;nyckelharpa;hardanger fiddle;kantele;kora;ngoni;balafon;talking drum;udu;hang drum/handpan;tongue drum;guzheng;sheng;suona;dizi;guqin;yangqin;gayageum;haegeum;sarangi;santoor;veena;sarod;shehnai;bansuri;mridangam;ghatam;dhol;tanpura;harmonium;bandoneon;charango;cuatro;tiple;quena;siku;berimbau;cuica;pandeiro;agogo;guiro;cabasa;claves;vibraslap;flexatone;waterphone;serpent;ophicleide;sackbut;crumhorn;shawm;rauschpfeife;cornett;theorbo;viola da gamba;baryton;arpeggione;cimbalom;psaltery',
  k: 'stroh violin'
},
{
  id: 'painter', q: 'Name a famous painter', cat: 'Music & arts',
  p: 'picasso/pablo picasso;van gogh/vincent van gogh;da vinci/leonardo da vinci/leonardo;monet/claude monet;michelangelo',
  c: 'bob ross',
  s: 'rembrandt;dali/salvador dali;andy warhol/warhol;frida kahlo/kahlo;georgia o keeffe/o keeffe;jackson pollock/pollock;raphael;vermeer;matisse;cezanne;renoir;degas;manet;gauguin;munch/edvard munch;klimt;kandinsky;rothko;botticelli;caravaggio;goya;magritte;banksy;keith haring;basquiat;norman rockwell;edward hopper;andrew wyeth;whistler;seurat',
  r: 'titian;el greco;velazquez;rubens;van eyck;bosch/hieronymus bosch;bruegel;durer;holbein;turner;constable;gainsborough;reynolds;blake/william blake;delacroix;gericault;ingres;courbet;millet;corot;pissarro;sisley;cassatt/mary cassatt;morisot;toulouse lautrec;modigliani;chagall;miro;mondrian;klee;braque;leger;schiele;kokoschka;hockney;lichtenstein;de kooning;pollock;hopper;wyeth;homer/winslow homer;sargent/john singer sargent;bierstadt;thomas cole;hokusai;hiroshige;caspar david friedrich;hilma af klint;bacon/francis bacon;lucian freud;kahlo;rivera/diego rivera;orozco;siqueiros;tamayo;botero',
  d: 'giotto;cimabue;duccio;masaccio;fra angelico;piero della francesca;mantegna;bellini;giorgione;tintoretto;veronese;correggio;parmigianino;bronzino;pontormo;artemisia gentileschi;zurbaran;murillo;ribera;frans hals;jan steen;pieter de hooch;ruisdael;hobbema;chardin;watteau;fragonard;boucher;david/jacques louis david;puvis de chavannes;redon;moreau;bocklin;ensor;vuillard;bonnard;signac;derain;vlaminck;rouault;soutine;de chirico;morandi;tanguy;ernst/max ernst;delvaux;arp;malevich;rodchenko;goncharova;popova;lissitzky;feininger;nolde;kirchner;marc/franz marc;macke;beckmann;dix;grosz;sheeler;demuth;marsden hartley;arthur dove;stuart davis;agnes martin;joan mitchell;helen frankenthaler;lee krasner;clyfford still;barnett newman;ad reinhardt;philip guston;cy twombly',
  k: 'remedios varo'
},
{
  id: 'shakespeare', q: 'Name a Shakespeare play', cat: 'Music & arts',
  p: 'romeo and juliet;hamlet;macbeth;othello;king lear',
  c: 'cardenio',
  s: 'a midsummer night s dream/midsummer night s dream;the tempest/tempest;julius caesar;much ado about nothing;twelfth night;the merchant of venice/merchant of venice;the taming of the shrew/taming of the shrew;as you like it;richard iii;henry v',
  r: 'a winter s tale/the winter s tale/winters tale;antony and cleopatra;the comedy of errors/comedy of errors;coriolanus;titus andronicus;richard ii;henry iv;henry iv part 1;henry iv part 2;henry vi;henry viii;king john;measure for measure;all s well that ends well/alls well that ends well;love s labour s lost/loves labours lost;the merry wives of windsor/merry wives of windsor;the two gentlemen of verona/two gentlemen of verona;cymbeline;pericles;timon of athens;troilus and cressida',
  d: 'the two noble kinsmen/two noble kinsmen;edward iii;henry vi part 1;henry vi part 2;henry vi part 3;sir thomas more',
  k: 'love s labour s won/loves labours won'
},
{
  id: 'sport', q: 'Name an Olympic sport', cat: 'Sports',
  p: 'swimming;gymnastics;track and field/athletics;basketball;soccer/football',
  c: 'art competitions/painting',
  s: 'tennis;volleyball;boxing;wrestling;diving;rowing;cycling;fencing;archery;weightlifting;judo;taekwondo;golf;rugby/rugby sevens;hockey/ice hockey;field hockey;figure skating;skiing;snowboarding;bobsled/bobsleigh;luge;curling;speed skating;beach volleyball;water polo;handball;table tennis/ping pong;badminton;equestrian;sailing;surfing;skateboarding;softball;baseball',
  r: 'canoe;kayak;canoe slalom;biathlon;skeleton;ski jumping;nordic combined;cross country skiing;alpine skiing;freestyle skiing;moguls;short track;triathlon;modern pentathlon;shooting;synchronized swimming/artistic swimming;trampoline;rhythmic gymnastics;bmx;mountain biking;sport climbing/climbing;breaking/breakdancing;karate;marathon swimming;open water swimming;decathlon;heptathlon;pole vault;javelin;discus;hammer throw;shot put;steeplechase;race walking;high jump;long jump;triple jump;hurdles;dressage;show jumping;eventing',
  d: 'tug of war;cricket;lacrosse;polo;rackets;jeu de paume;roque;pelota;motorboating;croquet;live pigeon shooting;club swinging;rope climbing;plunge for distance;standing high jump;standing long jump;solo synchronized swimming;military patrol;skijoring;ski ballet;bandy;korfball;kabaddi;bandy;sled dog racing;speed skiing;demonstration baseball;budo;glima;savate;roller hockey;basque pelota;water motorsports;aeronautics;alpinism',
  k: 'obstacle swimming'
},
{
  id: 'nflteam', q: 'Name an NFL team', cat: 'Sports',
  p: 'cowboys/dallas cowboys;patriots/new england patriots;packers/green bay packers;chiefs/kansas city chiefs;steelers/pittsburgh steelers',
  c: 'oilers/houston oilers',
  s: '49ers/niners/san francisco 49ers;eagles/philadelphia eagles;bears/chicago bears;giants/new york giants;jets/new york jets;broncos/denver broncos;seahawks/seattle seahawks;raiders/las vegas raiders;dolphins/miami dolphins;bills/buffalo bills;ravens/baltimore ravens;rams/los angeles rams;saints/new orleans saints;vikings/minnesota vikings;lions/detroit lions;commanders/washington commanders',
  r: 'chargers/los angeles chargers;bengals/cincinnati bengals;browns/cleveland browns;colts/indianapolis colts;titans/tennessee titans;jaguars/jacksonville jaguars;texans/houston texans;falcons/atlanta falcons;panthers/carolina panthers;buccaneers/bucs/tampa bay buccaneers;cardinals/arizona cardinals',
  d: 'redskins;football team/washington football team;st louis rams;san diego chargers;oakland raiders;los angeles raiders;baltimore colts;boston patriots;houston oilers;tennessee oilers;phoenix cardinals;st louis cardinals;chicago cardinals;boston redskins;cleveland rams',
  k: 'canton bulldogs'
},
{
  id: 'boardgame', q: 'Name a board game', cat: 'Culture',
  p: 'monopoly;chess;scrabble;checkers/draughts;clue/cluedo',
  c: 'calvinball',
  s: 'risk;sorry;candy land;chutes and ladders/snakes and ladders;the game of life/life/game of life;battleship;trouble;operation;guess who;connect four/connect 4;catan/settlers of catan;ticket to ride;backgammon;go;mancala;stratego;pictionary;trivial pursuit;othello;parcheesi/ludo;mouse trap;yahtzee;boggle;jenga;pandemic;mastermind;axis and allies',
  r: 'carcassonne;dominion;codenames;azul;splendor;wingspan;terraforming mars;7 wonders;agricola;puerto rico;power grid;scythe;gloomhaven;twilight imperium;twilight struggle;king of tokyo;betrayal at house on the hill;arkham horror;eldritch horror;dead of winter;small world;stone age;love letter;sushi go;camel up;kingdomino;patchwork;cascadia;everdell;root;spirit island;brass;diplomacy;acquire;hotel/hotels;cranium;balderdash;taboo;scattergories;apples to apples;cards against humanity;bananagrams;rummikub;sequence;labyrinth;hungry hungry hippos;don t break the ice;crossbows and catapults;stratego;shogi;xiangqi;nine men s morris;halma;chinese checkers;pente;blokus;qwirkle;quoridor;hive',
  d: 'senet;royal game of ur/game of ur;hnefatafl;tablut;fanorona;konane;bao;oware;pachisi;chaturanga;mahjong;mehen;patolli;alquerque;fox and geese;mu torere;yut nori;hex;havannah;twixt;tak;santorini;onitama;tigris and euphrates;el grande;samurai;the castles of burgundy;tzolk in;caylus;le havre;through the ages;mage knight;war of the ring;hanabi;the crew;dixit;mysterium;ra;modern art;high society;for sale;no thanks;six nimmt;lost cities;jaipur;hey that s my fish;tsuro;takenoko;tokaido;bohnanza;el dorado;heat',
  k: 'kriegspiel'
},
{
  id: 'olympics-host', q: 'Name a city that has hosted the Summer Olympics', cat: 'Sports',
  p: 'london;los angeles/la;beijing;tokyo;paris',
  c: 'st louis',
  s: 'atlanta;sydney;athens;rio de janeiro/rio;barcelona;seoul;moscow;montreal;munich;mexico city;berlin;rome',
  r: 'helsinki;melbourne;amsterdam;stockholm',
  d: '',
  k: 'antwerp'
},
{
  id: 'shoe', q: 'Name a type of shoe', cat: 'Culture',
  p: 'sneaker/sneakers;boot/boots;sandal/sandals;high heels/heels/high heel;flip flops/flip flop',
  c: 'crocs',
  s: 'loafer;slipper;flats/ballet flat;clogs/clog;cleats;oxford;moccasin;wedge;pump;stiletto;mule;espadrille;platform;running shoe;cowboy boot;rain boot/wellies/wellington;hiking boot;chelsea boot;combat boot;ugg/uggs;converse;slide;tennis shoe;dress shoe;boat shoe;slingback',
  r: 'brogue;derby;monk strap;wingtip;penny loafer;mary jane;kitten heel;peep toe;ankle boot;knee high boot;thigh high boot;go go boot;desert boot;chukka;jodhpur boot;riding boot;work boot;steel toe boot;snow boot;duck boot;galoshes;waders;tap shoe;ballet shoe/pointe shoe;bowling shoe;golf shoe;spikes;climbing shoe;ski boot;skate shoe;huarache;gladiator sandal;jelly sandal;birkenstock;slip on;driving moc;opera pump;court shoe;creeper;doc martens;brothel creeper',
  d: 'geta;zori;tabi;jika tabi;okobo;paduka;kolhapuri;mojari/jutti;juttis;opanak;abarka;babouche;barabba;poulaine/crakow;chopine;pattens;sabot;klompen;bast shoe/lapti;valenki;mukluk;kamik;pampootie;ghillie brogue;ghillies;veldskoen;vellies;alpargata;caligae;cothurnus;buskin;sabaton;solleret;spat;winklepicker;bluchers;balmoral;whole cut;saddle shoe;spectator shoe;co respondent',
  k: 'calceus'
},
{
  id: 'dance', q: 'Name a style of dance', cat: 'Culture',
  p: 'ballet;tap;salsa;hip hop;tango',
  c: 'the macarena/macarena',
  s: 'jazz;waltz;swing;breakdance/breaking;ballroom;tango;foxtrot;cha cha;rumba;samba;flamenco;line dancing;square dance;belly dance;contemporary;modern;polka;disco;irish dance/irish step dance;twerk;moonwalk;floss;the twist/twist;conga;limbo;hula;bachata;merengue;lindy hop;charleston;jive;quickstep;mambo;paso doble',
  r: 'krump;voguing/vogue;house;popping;locking;tutting;waacking;jitterbug;east coast swing;west coast swing;balboa;shag;bolero;zouk;kizomba;cumbia;reggaeton;forro;capoeira;clogging;morris dance;maypole;highland dance;ceilidh;sword dance;haka;bharatanatyam;kathak;kuchipudi;odissi;bhangra;garba;dandiya;kabuki;butoh;bon odori;lion dance;dragon dance;tinikling;cancan;quadrille;minuet;gavotte;mazurka;polonaise;hora;sirtaki;tarantella;fandango;jota;sevillanas;bossa nova;lambada;axe;dabke',
  d: 'kecak;legong;cak lontong;apsara;khon;fon lep;ram wong;pangalay;singkil;igal;cariñosa;haka powhiri;siva samoa;otea;aparima;tamure;meke;kapa haka;gumboot dance;pantsula;kwasa kwasa;ndombolo;azonto;adowa;agbadza;kpanlogo;schuhplattler;landler;zwiefacher;halling;springar;polska;hambo;kolo;horo;ruchenitsa;kalamatianos;zeibekiko;tsamiko;hasapiko;pentozali;khorumi;lezginka;hopak;trepak;kamarinskaya;bharatanatyam;mohiniyattam;sattriya;manipuri;chhau;lavani;ghoomar;kalbelia;bihu',
  k: 'kolomyjka/kolomyika'
},
{
  id: 'color', q: 'Name a color', cat: 'Words',
  p: 'red;blue;green;yellow;purple',
  c: 'octarine',
  s: 'orange;pink;black;white;brown;gray/grey;violet;indigo;teal;turquoise;magenta;cyan;maroon;navy;beige;gold;silver;lavender;tan;cream;peach;coral;mint;lime;olive;burgundy;crimson;scarlet;ivory;aqua;mauve;lilac',
  r: 'chartreuse;vermilion;cerulean;periwinkle;fuchsia;puce;taupe;ochre;sienna;umber;sepia;amber;mustard;saffron;emerald;jade;sage;khaki;rust;copper;bronze;mahogany;chestnut;auburn;salmon;rose;blush;cerise;ruby;garnet;plum;eggplant/aubergine;amethyst;orchid;heliotrope;azure;cobalt;sapphire;ultramarine;prussian blue;sky blue;baby blue;powder blue;slate;charcoal;gunmetal;pewter;ecru;champagne;burnt orange;tangerine;apricot;marigold;goldenrod;canary;lemon;ebony;onyx;oxblood;wine;cardinal;carmine;cinnabar;celadon;viridian;chartreuse green;moss;pistachio;seafoam;wisteria',
  d: 'gamboge;smalt;falu red;caput mortuum;mummy brown;wenge;isabelline;eburnean;feldgrau;glaucous;fulvous;gridelin;cyclamen;coquelicot;zaffre;bistre;bole;cattleya;drab;eau de nil;fallow;filemot;incarnadine;lusty gallant;malachite;nankeen;orpiment;phlox;razzmatazz;sarcoline;skobeloff;tawny;tea green;titian;tyrian purple;verdigris;wheat;xanadu;zomp;amaranth;arylide yellow;bittersweet;byzantium;cordovan;coyote;flax;harlequin;jasmine;keppel;liver;lumber;mikado;mindaro;mulberry;nyanza;opal;paynes grey;quinacridone;russet;sinopia;tuscan;vanilla',
  k: 'eigengrau'
},
{
  id: 'shape', q: 'Name a geometric shape', cat: 'Words',
  p: 'circle;square;triangle;rectangle;star',
  c: 'reuleaux triangle',
  s: 'oval;pentagon;hexagon;octagon;heart;diamond;rhombus;trapezoid/trapezium;parallelogram;cube;sphere;cylinder;cone;pyramid;ellipse;crescent;semicircle;arrow;cross;heptagon;decagon',
  r: 'nonagon;dodecagon;tetrahedron;octahedron;dodecahedron;icosahedron;prism;torus/donut;kite;deltoid;lune;annulus;sector;segment;chevron;quatrefoil;trefoil;hendecagon;tridecagon;polygon;polyhedron;ellipsoid;paraboloid;hyperboloid;frustum;cuboid;rhombohedron;pentagram;hexagram;octagram;mobius strip;klein bottle;spiral;helix;scalene triangle;isosceles triangle;equilateral triangle;right triangle;obtuse triangle;acute triangle;square pyramid;triangular prism',
  d: 'icositetragon;chiliagon;myriagon;megagon;apeirogon;triacontagon;enneadecagon;hectogon;rhombicuboctahedron;truncated icosahedron;snub cube;great stellated dodecahedron;small stellated dodecahedron;cuboctahedron;icosidodecahedron;rhombic dodecahedron;tesseract;hypercube;simplex;oloid;sphericon;gomboc;deltahedron;trapezohedron;bifrustum;antiprism;scutoid;astroid;cardioid;deltoid curve;lemniscate;limacon;nephroid;cycloid;tractrix;catenary;arbelos;salinon;vesica piscis;squircle;superellipse;stadium;spherinder',
  k: 'gyrobifastigium'
},
{
  id: 'tool', q: 'Name a hand tool', cat: 'Words',
  p: 'hammer;screwdriver;wrench/spanner;saw;pliers',
  c: 'spork',
  s: 'drill;chisel;level;tape measure;shovel;rake;axe;hatchet;sledgehammer;mallet;file;crowbar/pry bar;utility knife/box cutter;scissors;socket wrench;allen wrench/allen key/hex key;clamp;vise/vice;sandpaper;trowel;hoe;pickaxe;awl;staple gun;caulk gun;hacksaw;wire cutters;stud finder;putty knife;paintbrush',
  r: 'adze;spokeshave;drawknife;plane/hand plane;rasp;coping saw;miter saw;dovetail saw;bow saw;keyhole saw;fret saw;tenon saw;try square;combination square;bevel/sliding bevel;marking gauge;scribe;punch;center punch;nail set;brad pusher;tack hammer;ball peen hammer;claw hammer;dead blow hammer;maul;froe;cant hook;peavey;pruning shears/secateurs;loppers;machete;sickle;scythe;mattock;post hole digger;tamping bar;pipe wrench;monkey wrench;torque wrench;vise grip/locking pliers;needle nose pliers;channel locks;crimper;wire stripper;soldering iron;tin snips;bolt cutters;pipe cutter;tap and die;reamer;countersink;grease gun',
  d: 'scorp;inshave;travisher;bruzz chisel;slick;bill hook/billhook;slasher;bushhook;mortise gauge;router plane;shoulder plane;rabbet plane;plough plane;bullnose plane;scraper plane;cabinet scraper;burnisher;bradawl;gimlet;brace;auger;egg beater drill;push drill;scratch awl;pricker;cotter pin puller;pick and hook;spudger;nibbler;deburring tool;swage;flaring tool;fid;marlinspike;sail palm;caulking iron;reefing iron;cooper s adze;crozer;howel;spud;breast drill;hay knife;dibber;widger;hori hori;cobra head',
  k: 'twybil'
},
{
  id: 'phobia', q: 'Name a phobia (by its proper name)', cat: 'Words',
  p: 'arachnophobia;claustrophobia;acrophobia;agoraphobia;xenophobia',
  c: 'hippopotomonstrosesquippedaliophobia',
  s: 'homophobia;hydrophobia;aerophobia;nyctophobia;ophidiophobia;trypophobia;coulrophobia;glossophobia;hemophobia;mysophobia/germophobia;thanatophobia;technophobia;triskaidekaphobia;cynophobia;emetophobia;aquaphobia;astraphobia/astrophobia;entomophobia;monophobia;phobophobia',
  r: 'trypanophobia;nomophobia;haphephobia;philophobia;gamophobia;gerascophobia;necrophobia;pyrophobia;ombrophobia;thalassophobia;megalophobia;submechanophobia;automatonophobia;pediophobia;ornithophobia;ailurophobia;musophobia;apiphobia/melissophobia;dentophobia;iatrophobia;tokophobia;atychiphobia;decidophobia;ergophobia;somniphobia;chronophobia;anthophobia;heliophobia;cryophobia;chionophobia;lygophobia;scolionophobia;sociophobia;anthropophobia;chromophobia;arithmophobia;bibliophobia;logophobia;dendrophobia;botanophobia;ichthyophobia;batrachophobia;herpetophobia;equinophobia;selachophobia;galeophobia',
  d: 'paraskevidekatriaphobia;arachibutyrophobia;omphalophobia;pogonophobia;ablutophobia;alektorophobia;anatidaephobia;koumpounophobia;turophobia;lachanophobia;mageirocophobia;nephophobia;pteronophobia;xanthophobia;leukophobia;porphyrophobia;sesquipedalophobia;papyrophobia;chirophobia;podophobia;genuphobia;ommetaphobia;linonophobia;globophobia;siderophobia;kenophobia;kakorrhaphiophobia;euphobia;phronemophobia;nostophobia;ecclesiophobia;geliophobia;catoptrophobia;eisoptrophobia;spectrophobia;phasmophobia;samhainophobia;hexakosioihexekontahexaphobia;bananaphobia;consecotaleophobia;deipnophobia',
  k: 'ephebiphobia'
},
{
  id: 'currency', q: 'Name a currency', cat: 'Geography',
  p: 'dollar;euro;pound/pound sterling;yen;peso',
  c: 'bitcoin',
  s: 'rupee;yuan/renminbi;franc;ruble/rouble;won;real;krona;krone;lira;rand;shekel;dinar;baht;dirham;rupiah;ringgit;lira;canadian dollar;australian dollar',
  r: 'rial;riyal;dong;zloty;forint;koruna;lev;leu;kuna;hryvnia;lari;dram;tenge;som;manat;taka;kyat;riel;kip;tugrik;afghani;naira;cedi;shilling;birr;kwacha;pula;dalasi;leone;guilder;florin;bolivar;sol;boliviano;guarani;colon;cordoba;lempira;quetzal;balboa;gourde;rufiyaa;pataca;kina;vatu;tala;paʻanga/paanga;escudo;drachma;mark/deutsche mark;peseta;schilling;markka;punt;ecu;lat;litas;kroon;tolar',
  d: 'ngultrum;loti;lilangeni;nakfa;ariary;kwanza;metical;dobra;comorian franc;cfa franc;cfp franc;syli;ekwele;zaire;toman;tanga;sucre;inti;austral;cruzeiro;cruzado;scudo;thaler;ducat;sovereign;guinea;farthing;groat;shekel of tyre;denarius;sestertius;solidus;dinar of baghdad;tael;cash;mon;ryo;mohur;pagoda;anna;pice;paisa;stotinka;qindarka;tyiyn;tiyin;tetri;luma;kopek',
  k: 'ouguiya'
},
{
  id: 'language', q: 'Name a language', cat: 'Geography',
  p: 'english;spanish;french;chinese/mandarin;german',
  c: 'klingon',
  s: 'italian;japanese;russian;portuguese;arabic;hindi;korean;greek;latin;hebrew;dutch;swedish;polish;turkish;vietnamese;thai;cantonese;tagalog/filipino;sign language/asl/american sign language;irish/gaelic;swahili;urdu;bengali;punjabi;persian/farsi;norwegian;danish;finnish',
  r: 'welsh;scottish gaelic;catalan;basque;galician;icelandic;hungarian;czech;slovak;ukrainian;romanian;bulgarian;serbian;croatian;slovenian;albanian;lithuanian;latvian;estonian;maltese;yiddish;esperanto;sanskrit;tamil;telugu;marathi;gujarati;kannada;malayalam;nepali;sinhala;burmese;khmer;lao;malay;indonesian;javanese;mongolian;tibetan;kazakh;uzbek;pashto;kurdish;armenian;georgian;amharic;somali;yoruba;igbo;hausa;zulu;xhosa;afrikaans;hawaiian;maori;samoan;navajo;cherokee;quechua;guarani;nahuatl;haitian creole;inuktitut;greenlandic;faroese;breton;cornish;manx',
  d: 'ainu;basque;burushaski;nivkh;ket;yukaghir;chukchi;evenki;sami;livonian;votic;karelian;veps;udmurt;mari;komi;chuvash;tatar;bashkir;yakut/sakha;tuvan;khakas;uyghur;dungan;zhuang;hmong;yi;naxi;bai;tujia;dzongkha;lepcha;newari;santali;mundari;ho;khasi;garo;mizo;meitei/manipuri;tulu;konkani;kodava;toda;brahui;balochi;wakhi;shina;kalasha;dari;tajik;ossetian;chechen;ingush;avar;lezgian;abkhaz;adyghe;kabardian;ubykh;laz;mingrelian;svan;aramaic;syriac;coptic;geez;tigrinya;tigre;oromo;afar;wolof;fula;mandinka;bambara;twi;ewe;fon;kinyarwanda;kirundi;luganda;shona;sesotho;setswana;tsonga;venda;ndebele;malagasy;tok pisin;bislama;fijian;tongan;tahitian;chamorro;palauan;marshallese;rapanui;yupik;tlingit;haida;salish;lakota;ojibwe;cree;mohawk;hopi;zuni;mayan;kiche;mapudungun;aymara;tupi',
  k: 'silbo gomero'
}
]);
