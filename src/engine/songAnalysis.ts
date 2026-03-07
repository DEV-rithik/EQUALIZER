import type { SongProfile, Genre, Mood } from '../types';
import { analyzeAudioFile, mergeAudioFeatures } from './audioAnalyzer';

// ─── Song-Specific Database (exact title lookup) ─────────────────────────────

const SONG_DATABASE: Record<string, { genre: Genre; energy: number; mood: Mood; bpm: number }> = {
  // Pop
  'blinding lights': { genre: 'pop', energy: 0.78, mood: 'energetic', bpm: 171 },
  'shape of you': { genre: 'pop', energy: 0.65, mood: 'uplifting', bpm: 96 },
  'bad guy': { genre: 'pop', energy: 0.7, mood: 'energetic', bpm: 135 },
  'dance monkey': { genre: 'pop', energy: 0.75, mood: 'energetic', bpm: 98 },
  'watermelon sugar': { genre: 'pop', energy: 0.55, mood: 'uplifting', bpm: 95 },
  'levitating': { genre: 'pop', energy: 0.8, mood: 'energetic', bpm: 103 },
  'stay': { genre: 'pop', energy: 0.72, mood: 'uplifting', bpm: 170 },
  'as it was': { genre: 'pop', energy: 0.6, mood: 'melancholic', bpm: 174 },
  'anti-hero': { genre: 'pop', energy: 0.55, mood: 'melancholic', bpm: 97 },
  'cruel summer': { genre: 'pop', energy: 0.72, mood: 'energetic', bpm: 170 },
  'drivers license': { genre: 'pop', energy: 0.35, mood: 'melancholic', bpm: 72 },
  'good 4 u': { genre: 'pop', energy: 0.82, mood: 'intense', bpm: 166 },
  'peaches': { genre: 'pop', energy: 0.55, mood: 'relaxed', bpm: 90 },
  'save your tears': { genre: 'pop', energy: 0.65, mood: 'melancholic', bpm: 118 },
  'someone you loved': { genre: 'pop', energy: 0.3, mood: 'melancholic', bpm: 110 },
  'happier than ever': { genre: 'pop', energy: 0.4, mood: 'melancholic', bpm: 66 },
  'vampire': { genre: 'pop', energy: 0.55, mood: 'melancholic', bpm: 138 },
  'flowers': { genre: 'pop', energy: 0.6, mood: 'uplifting', bpm: 116 },
  'espresso': { genre: 'pop', energy: 0.65, mood: 'uplifting', bpm: 104 },
  'paint the town red': { genre: 'pop', energy: 0.7, mood: 'energetic', bpm: 100 },

  // Hip-hop / Rap
  'humble': { genre: 'hip-hop', energy: 0.85, mood: 'intense', bpm: 150 },
  'sicko mode': { genre: 'hip-hop', energy: 0.9, mood: 'energetic', bpm: 155 },
  'gods plan': { genre: 'hip-hop', energy: 0.6, mood: 'uplifting', bpm: 77 },
  'hotline bling': { genre: 'hip-hop', energy: 0.45, mood: 'relaxed', bpm: 135 },
  'lose yourself': { genre: 'hip-hop', energy: 0.92, mood: 'intense', bpm: 171 },
  'alright': { genre: 'hip-hop', energy: 0.75, mood: 'uplifting', bpm: 112 },
  'money trees': { genre: 'hip-hop', energy: 0.65, mood: 'relaxed', bpm: 73 },
  'rockstar': { genre: 'hip-hop', energy: 0.6, mood: 'melancholic', bpm: 80 },
  'sunflower': { genre: 'hip-hop', energy: 0.55, mood: 'uplifting', bpm: 90 },
  'n95': { genre: 'hip-hop', energy: 0.88, mood: 'intense', bpm: 140 },
  'rich spirit': { genre: 'hip-hop', energy: 0.7, mood: 'energetic', bpm: 100 },
  'first person shooter': { genre: 'hip-hop', energy: 0.75, mood: 'intense', bpm: 82 },
  'not like us': { genre: 'hip-hop', energy: 0.85, mood: 'intense', bpm: 101 },
  'fe!n': { genre: 'hip-hop', energy: 0.88, mood: 'energetic', bpm: 145 },
  'carnival': { genre: 'hip-hop', energy: 0.8, mood: 'energetic', bpm: 131 },

  // Rock
  'bohemian rhapsody': { genre: 'rock', energy: 0.85, mood: 'intense', bpm: 72 },
  'stairway to heaven': { genre: 'rock', energy: 0.6, mood: 'melancholic', bpm: 82 },
  'smells like teen spirit': { genre: 'rock', energy: 0.95, mood: 'intense', bpm: 117 },
  'hotel california': { genre: 'rock', energy: 0.5, mood: 'melancholic', bpm: 74 },
  'thunder': { genre: 'rock', energy: 0.7, mood: 'energetic', bpm: 168 },
  'believer': { genre: 'rock', energy: 0.85, mood: 'intense', bpm: 125 },
  'radioactive': { genre: 'rock', energy: 0.75, mood: 'intense', bpm: 137 },
  'seven nation army': { genre: 'rock', energy: 0.8, mood: 'intense', bpm: 124 },
  'sweet child o mine': { genre: 'rock', energy: 0.75, mood: 'energetic', bpm: 125 },
  'back in black': { genre: 'rock', energy: 0.9, mood: 'energetic', bpm: 92 },
  'wonderwall': { genre: 'rock', energy: 0.45, mood: 'melancholic', bpm: 87 },
  'creep': { genre: 'rock', energy: 0.55, mood: 'melancholic', bpm: 92 },
  'come as you are': { genre: 'rock', energy: 0.6, mood: 'melancholic', bpm: 120 },

  // Electronic / EDM
  'strobe': { genre: 'electronic', energy: 0.75, mood: 'peaceful', bpm: 128 },
  'levels': { genre: 'electronic', energy: 0.92, mood: 'energetic', bpm: 126 },
  'sandstorm': { genre: 'electronic', energy: 0.95, mood: 'energetic', bpm: 136 },
  'titanium': { genre: 'electronic', energy: 0.8, mood: 'uplifting', bpm: 126 },
  'lean on': { genre: 'electronic', energy: 0.72, mood: 'energetic', bpm: 98 },
  'where are u now': { genre: 'electronic', energy: 0.7, mood: 'melancholic', bpm: 140 },
  'midnight city': { genre: 'electronic', energy: 0.75, mood: 'energetic', bpm: 105 },
  'something about us': { genre: 'electronic', energy: 0.35, mood: 'relaxed', bpm: 100 },
  'get lucky': { genre: 'electronic', energy: 0.7, mood: 'uplifting', bpm: 116 },
  'around the world': { genre: 'electronic', energy: 0.78, mood: 'energetic', bpm: 121 },

  // R&B / Soul
  'thinking out loud': { genre: 'r&b', energy: 0.35, mood: 'melancholic', bpm: 79 },
  'all of me': { genre: 'r&b', energy: 0.3, mood: 'melancholic', bpm: 63 },
  'kill bill': { genre: 'r&b', energy: 0.5, mood: 'melancholic', bpm: 88 },
  'snooze': { genre: 'r&b', energy: 0.35, mood: 'relaxed', bpm: 73 },
  'pink + white': { genre: 'r&b', energy: 0.4, mood: 'peaceful', bpm: 80 },
  'nights': { genre: 'r&b', energy: 0.6, mood: 'melancholic', bpm: 90 },
  'thinkin bout you': { genre: 'r&b', energy: 0.3, mood: 'melancholic', bpm: 120 },
  'redbone': { genre: 'r&b', energy: 0.45, mood: 'relaxed', bpm: 80 },

  // Jazz
  'so what': { genre: 'jazz', energy: 0.4, mood: 'relaxed', bpm: 136 },
  'take five': { genre: 'jazz', energy: 0.5, mood: 'relaxed', bpm: 174 },
  'fly me to the moon': { genre: 'jazz', energy: 0.45, mood: 'uplifting', bpm: 120 },
  'autumn leaves': { genre: 'jazz', energy: 0.35, mood: 'melancholic', bpm: 96 },
  'blue in green': { genre: 'jazz', energy: 0.2, mood: 'peaceful', bpm: 65 },

  // Classical
  'moonlight sonata': { genre: 'classical', energy: 0.25, mood: 'melancholic', bpm: 56 },
  'fur elise': { genre: 'classical', energy: 0.35, mood: 'melancholic', bpm: 125 },
  'canon in d': { genre: 'classical', energy: 0.3, mood: 'peaceful', bpm: 60 },
  'clair de lune': { genre: 'classical', energy: 0.2, mood: 'peaceful', bpm: 66 },
  'ride of the valkyries': { genre: 'classical', energy: 0.9, mood: 'intense', bpm: 132 },
  'flight of the bumblebee': { genre: 'classical', energy: 0.85, mood: 'energetic', bpm: 160 },

  // Metal
  'master of puppets': { genre: 'metal', energy: 0.95, mood: 'intense', bpm: 212 },
  'enter sandman': { genre: 'metal', energy: 0.9, mood: 'intense', bpm: 123 },
  'one': { genre: 'metal', energy: 0.85, mood: 'intense', bpm: 108 },
  'chop suey': { genre: 'metal', energy: 0.92, mood: 'intense', bpm: 127 },
  'numb': { genre: 'rock', energy: 0.7, mood: 'melancholic', bpm: 110 },
  'in the end': { genre: 'rock', energy: 0.65, mood: 'melancholic', bpm: 105 },

  // Folk / Indie
  'skinny love': { genre: 'folk', energy: 0.25, mood: 'melancholic', bpm: 72 },
  'ho hey': { genre: 'folk', energy: 0.55, mood: 'uplifting', bpm: 80 },
  'home': { genre: 'folk', energy: 0.5, mood: 'uplifting', bpm: 115 },
  'little talks': { genre: 'folk', energy: 0.65, mood: 'uplifting', bpm: 100 },

  // Ambient
  'intro': { genre: 'ambient', energy: 0.15, mood: 'peaceful', bpm: 60 },
  'an ending': { genre: 'ambient', energy: 0.1, mood: 'peaceful', bpm: 50 },
  'weightless': { genre: 'ambient', energy: 0.1, mood: 'peaceful', bpm: 60 },
};

// ─── Extended Artist Keyword Database ────────────────────────────────────────

const GENRE_KEYWORDS: Record<Genre, string[]> = {
  'pop': [
    'pop', 'taylor swift', 'taylor', 'ariana grande', 'ariana', 'ed sheeran',
    'billie eilish', 'billie', 'dua lipa', 'weeknd', 'the weeknd', 'selena gomez',
    'shawn mendes', 'doja cat', 'doja', 'harry styles', 'olivia rodrigo',
    'charlie puth', 'justin bieber', 'bieber', 'bruno mars', 'adele',
    'lady gaga', 'gaga', 'rihanna', 'katy perry', 'miley cyrus',
    'halsey', 'lorde', 'sia', 'maroon 5', 'adam levine', 'imagine dragons',
    'one direction', '1d', 'bts', 'blackpink', 'twice', 'seventeen',
    'stray kids', 'aespa', 'itzy', 'red velvet', 'exo', 'nct',
    'sabrina carpenter', 'chappell roan', 'tate mcrae', 'madison beer',
    'conan gray', 'gracie abrams', 'phoebe bridgers', 'clairo',
    'troye sivan', 'lana del rey', 'lana', 'post malone', 'sam smith',
    'lizzo', 'meghan trainor', 'camila cabello', 'normani', 'cardi b',
    'nicki minaj', 'ice spice', 'doja cat', 'rosalia', 'bad bunny',
    'shakira', 'becky g', 'karol g', 'ozuna', 'maluma',
    'lewis capaldi', 'elton john', 'michael jackson', 'mj', 'madonna',
    'cher', 'whitney houston', 'celine dion', 'britney spears',
    'christina aguilera', 'pink', 'p!nk', 'jonas brothers',
    'chainsmokers', 'marshmello', 'clean bandit', 'zedd',
    'tyla', 'ayra starr', 'rema', 'burna boy', 'wizkid',
    'coldplay', 'onerepublic', 'the script', 'bastille',
    'ed', 'swift', 'grande', 'styles',
  ],
  'rock': [
    'rock', 'guitar', 'nirvana', 'foo fighters', 'green day',
    'radiohead', 'muse', 'oasis', 'arctic monkeys', 'led zeppelin',
    'pink floyd', 'the rolling stones', 'rolling stones', 'ac/dc', 'acdc',
    'queen', 'freddie mercury', 'u2', 'bono', 'the who',
    'aerosmith', 'bon jovi', 'def leppard', 'journey', 'boston',
    'eagles', 'fleetwood mac', 'heart', 'deep purple',
    'lynyrd skynyrd', 'creedence', 'ccr', 'tom petty', 'bruce springsteen',
    'jimi hendrix', 'hendrix', 'eric clapton', 'clapton',
    'red hot chili peppers', 'rhcp', 'pearl jam', 'soundgarden',
    'alice in chains', 'stone temple pilots', 'temple of the dog',
    'rage against the machine', 'ratm', 'audioslave',
    'the strokes', 'interpol', 'yeah yeah yeahs',
    'kings of leon', 'the killers', 'cage the elephant',
    'tame impala', 'mgmt', 'glass animals', 'alt-j',
    'weezer', 'blink-182', 'blink 182', 'sum 41', 'fall out boy',
    'my chemical romance', 'mcr', 'paramore', 'panic at the disco',
    'twenty one pilots', 'top', 'greta van fleet',
    'royal blood', 'nothing but thieves', 'catfish and the bottlemen',
    'the 1975', '1975', 'the neighbourhood', 'neighborhood',
    'incubus', 'tool', 'a perfect circle', 'deftones',
    'linkin park', 'system of a down', 'soad', 'breaking benjamin',
    'three days grace', 'disturbed', 'godsmack', 'shinedown',
    'volbeat', 'sixx am', 'five finger death punch', 'ffdp',
    'bring me the horizon', 'bmth', 'sleeping with sirens',
    'pierce the veil', 'mayday parade',
  ],
  'electronic': [
    'electronic', 'edm', 'house', 'techno', 'trance', 'dj',
    'deadmau5', 'skrillex', 'avicii', 'flume', 'aphex twin', 'aphex',
    'burial', 'boards of canada', 'synth', 'ambient electronic',
    'daft punk', 'calvin harris', 'david guetta', 'martin garrix',
    'tiesto', 'armin van buuren', 'above and beyond', 'above & beyond',
    'swedish house mafia', 'shm', 'kygo', 'alan walker',
    'illenium', 'odesza', 'porter robinson', 'madeon',
    'zhu', 'kaytranada', 'four tet', 'bonobo', 'tycho',
    'disclosure', 'rufus du sol', 'rufus', 'lane 8', 'bob moses',
    'eric prydz', 'carl cox', 'richie hawtin', 'adam beyer',
    'amelie lens', 'charlotte de witte', 'peggy gou',
    'chemical brothers', 'prodigy', 'fatboy slim', 'underworld',
    'orbital', 'massive attack', 'portishead', 'tricky',
    'jamie xx', 'fred again', 'bicep', 'caribou',
    'rl grime', 'what so not', 'diplo', 'major lazer',
    'excision', 'illenium', 'seven lions', 'rezz', 'subtronics',
    'liquid stranger', 'bassnectar', 'pretty lights', 'griz',
    'cashmere cat', 'sophie', 'ag cook', 'charli xcx', 'pc music',
    'justice', 'kraftwerk', 'tangerine dream', 'jean-michel jarre',
    'brian eno', 'eno', 'moby', 'royksopp',
    'nero', 'pendulum', 'noisia', 'netsky', 'wilkinson',
    'sub focus', 'dimension', 'chase & status', 'andy c',
    'drum and bass', 'dnb', 'd&b', 'dubstep', 'bass music',
    'synthwave', 'retrowave', 'vaporwave',
    'deadmaus', 'marshmello', 'chainsmokers',
  ],
  'jazz': [
    'jazz', 'miles davis', 'coltrane', 'john coltrane', 'bebop', 'swing',
    'blues', 'duke ellington', 'bill evans', 'herbie hancock', 'herbie',
    'thelonious monk', 'monk', 'charlie parker', 'bird', 'dizzy gillespie',
    'dave brubeck', 'oscar peterson', 'art blakey', 'wayne shorter',
    'chick corea', 'pat metheny', 'wes montgomery', 'charles mingus',
    'sonny rollins', 'stan getz', 'billie holiday', 'ella fitzgerald',
    'louis armstrong', 'sarah vaughan', 'nina simone',
    'robert glasper', 'kamasi washington', 'esperanza spalding',
    'snarky puppy', 'jacob collier', 'brad mehldau',
    'norah jones', 'diana krall', 'gregory porter',
    'chet baker', 'dexter gordon', 'art tatum', 'cannonball adderley',
    'joe henderson', 'mccoy tyner', 'ron carter', 'tony williams',
    'ornette coleman', 'cecil taylor', 'sun ra', 'pharoah sanders',
    'john mclaughlin', 'return to forever', 'weather report',
    'bossa nova', 'latin jazz', 'smooth jazz', 'acid jazz',
    'blue note', 'jazz fusion', 'cool jazz', 'hard bop',
  ],
  'classical': [
    'classical', 'beethoven', 'mozart', 'bach', 'symphony', 'orchestra',
    'piano sonata', 'chopin', 'debussy', 'vivaldi', 'tchaikovsky',
    'brahms', 'schubert', 'schumann', 'liszt', 'rachmaninoff', 'rachmaninov',
    'mahler', 'dvorak', 'mendelssohn', 'handel', 'haydn',
    'stravinsky', 'ravel', 'prokofiev', 'shostakovich',
    'verdi', 'puccini', 'wagner', 'rossini', 'bizet',
    'sibelius', 'grieg', 'elgar', 'holst', 'vaughan williams',
    'bernstein', 'copland', 'gershwin', 'barber',
    'philip glass', 'steve reich', 'john adams', 'arvo part',
    'max richter', 'olafur arnalds', 'nils frahm', 'ludovico einaudi',
    'yiruma', 'joe hisaishi', 'hans zimmer', 'john williams',
    'ennio morricone', 'howard shore', 'alexandre desplat',
    'yo-yo ma', 'itzhak perlman', 'lang lang', 'martha argerich',
    'hilary hahn', 'janine jansen', 'joshua bell',
    'concerto', 'quartet', 'sonata', 'opus', 'chamber music',
    'philharmonic', 'overture', 'requiem', 'nocturne', 'etude',
    'prelude', 'fugue', 'aria', 'serenade', 'suite',
  ],
  'hip-hop': [
    'hip hop', 'hip-hop', 'rap', 'kendrick', 'kendrick lamar',
    'drake', 'j. cole', 'j cole', 'travis scott', 'travis',
    'kanye', 'kanye west', 'ye', 'eminem', 'jay-z', 'jay z', 'hov',
    'nas', 'wu-tang', 'wu tang', 'tupac', '2pac', 'biggie', 'notorious',
    'snoop dogg', 'snoop', 'dr. dre', 'dr dre', 'ice cube',
    'lil wayne', 'lil baby', 'lil uzi', 'lil nas x', 'lil durk',
    'young thug', 'thugger', 'gunna', 'future', 'metro boomin',
    'tyler the creator', 'tyler', 'a$ap rocky', 'asap rocky',
    'playboi carti', 'carti', 'jack harlow', '21 savage',
    'megan thee stallion', 'megan', 'cardi b',
    'nicki minaj', 'nicki', 'missy elliott', 'lauryn hill',
    'outkast', 'andre 3000', 'big boi', 'run the jewels',
    'chance the rapper', 'chance', 'childish gambino', 'donald glover',
    'mac miller', 'juice wrld', 'xxxtentacion', 'pop smoke',
    'roddy ricch', 'dababy', 'migos', 'quavo', 'offset', 'takeoff',
    'pusha t', 'freddie gibbs', 'denzel curry', 'jid',
    'earthgang', 'dreamville', 'baby keem', 'sza',
    'schoolboy q', 'ab-soul', 'isaiah rashad',
    'joey badass', 'flatbush zombies', 'beast coast',
    'vince staples', 'earl sweatshirt', 'danny brown',
    'anderson paak', '.paak', 'silk sonic',
    'little simz', 'stormzy', 'dave', 'skepta', 'uk rap',
    'central cee', 'headie one',
    'trap', 'boom bap', 'conscious rap', 'mumble rap', 'drill',
    'grime', 'uk drill', 'atlanta', 'west coast', 'east coast',
  ],
  'r&b': [
    'r&b', 'rnb', 'soul', 'frank ocean', 'frank', 'sza',
    'usher', 'beyonce', 'beyoncé', 'marvin gaye', 'stevie wonder',
    'alicia keys', 'john legend', 'daniel caesar', 'giveon',
    'jhene aiko', 'jhené', 'h.e.r.', 'her', 'summer walker',
    'brent faiyaz', 'don toliver', 'the weeknd', 'abel',
    'khalid', 'bryson tiller', 'partynextdoor', 'pnd',
    'chris brown', 'trey songz', 'miguel', 'jeremih',
    'kehlani', 'tinashe', 'jorja smith', 'snoh aalegra',
    'erykah badu', 'lauryn hill', 'mary j blige', 'tlc',
    'destiny\'s child', 'aaliyah', 'brandy', 'monica',
    'r. kelly', 'boyz ii men', 'jodeci', 'new edition',
    'prince', 'janet jackson', 'whitney houston',
    'luther vandross', 'barry white', 'al green', 'otis redding',
    'aretha franklin', 'ray charles', 'sam cooke',
    'leon bridges', 'anderson paak', 'silk sonic',
    'victoria monet', 'lucky daye', 'ravyn lenae',
    'ari lennox', 'chloe x halle', 'dvsn',
    'neo-soul', 'neo soul', 'contemporary r&b', 'quiet storm',
    'rhythm and blues', 'motown', 'gospel', 'urban',
  ],
  'metal': [
    'metal', 'heavy metal', 'death metal', 'black metal',
    'metallica', 'slipknot', 'pantera', 'lamb of god', 'meshuggah',
    'iron maiden', 'judas priest', 'black sabbath', 'ozzy',
    'megadeth', 'anthrax', 'slayer', 'testament',
    'motorhead', 'dio', 'rainbow', 'deep purple',
    'opeth', 'mastodon', 'gojira', 'between the buried and me',
    'dream theater', 'tool', 'a perfect circle', 'puscifer',
    'deftones', 'korn', 'limp bizkit', 'rage against',
    'rammstein', 'nightwish', 'epica', 'within temptation',
    'dimmu borgir', 'cradle of filth', 'behemoth', 'mayhem',
    'cannibal corpse', 'death', 'deicide', 'morbid angel',
    'amon amarth', 'in flames', 'dark tranquillity', 'soilwork',
    'arch enemy', 'children of bodom', 'power metal',
    'helloween', 'blind guardian', 'stratovarius', 'rhapsody',
    'trivium', 'killswitch engage', 'as i lay dying',
    'august burns red', 'parkway drive', 'architects',
    'periphery', 'animals as leaders', 'polyphia', 'chon',
    'djent', 'metalcore', 'deathcore', 'thrash', 'doom',
    'stoner metal', 'sludge', 'progressive metal', 'power metal',
    'symphonic metal', 'folk metal', 'viking metal',
    'nu metal', 'groove metal', 'speed metal',
  ],
  'folk': [
    'folk', 'acoustic', 'indie folk', 'bon iver', 'fleet foxes',
    'iron and wine', 'iron & wine', 'sufjan stevens', 'sufjan',
    'joanna newsom', 'nick drake', 'elliott smith',
    'bob dylan', 'dylan', 'woody guthrie', 'pete seeger',
    'joni mitchell', 'joan baez', 'simon and garfunkel', 'simon & garfunkel',
    'cat stevens', 'yusuf', 'james taylor', 'carole king',
    'mumford and sons', 'mumford & sons', 'the lumineers', 'lumineers',
    'of monsters and men', 'vance joy', 'passenger',
    'lord huron', 'the head and the heart', 'gregory alan isakov',
    'hozier', 'city and colour', 'city & colour', 'jose gonzalez',
    'nick mulvey', 'laura marling', 'first aid kit',
    'angus and julia stone', 'the paper kites', 'daughter',
    'the tallest man on earth', 'the avett brothers', 'avett brothers',
    'john prine', 'townes van zandt', 'lucinda williams',
    'jason isbell', 'sturgill simpson', 'tyler childers',
    'phoebe bridgers', 'julien baker', 'lucy dacus', 'boygenius',
    'big thief', 'adrianne lenker', 'weyes blood',
    'singer-songwriter', 'singer songwriter', 'fingerpicking',
    'bluegrass', 'americana', 'country folk', 'celtic', 'irish',
    'unplugged', 'campfire', 'storytelling',
  ],
  'ambient': [
    'ambient', 'meditation', 'sleep', 'relaxing', 'nature', 'lofi',
    'lo-fi', 'chill', 'drone', 'eno', 'brian eno',
    'stars of the lid', 'tim hecker', 'william basinski',
    'grouper', 'julianna barwick', 'biosphere',
    'harold budd', 'robert rich', 'steve roach',
    'loscil', 'geir jenssen', 'eluvium',
    'sigur ros', 'sigur rós', 'jónsi', 'jonsi',
    'explosions in the sky', 'godspeed you black emperor', 'godspeed',
    'mogwai', 'mono', 'this will destroy you',
    'hammock', 'helios', 'balmorhea',
    'nils frahm', 'olafur arnalds', 'ólafur arnalds',
    'max richter', 'johann johannsson',
    'chillhop', 'chillwave', 'downtempo', 'trip-hop', 'trip hop',
    'new age', 'spa music', 'yoga', 'healing', 'asmr',
    'rain sounds', 'white noise', 'pink noise', 'brown noise',
    'binaural', 'deep focus', 'study music',
    'lofi hip hop', 'lo-fi beats', 'chill beats',
    'nujabes', 'j dilla', 'dilla', 'madlib',
    'soundscape', 'atmospheric', 'ethereal', 'dreamy',
    'space music', 'dark ambient', 'light ambient', 'minimal',
  ],
  'unknown': [],
};

// ─── Energy, Mood, and other lookup maps (unchanged structure, expanded) ─────

const ENERGY_KEYWORDS: Record<string, number> = {
  'metal': 0.95, 'heavy metal': 0.95, 'death metal': 0.95, 'black metal': 0.92,
  'edm': 0.9, 'electronic': 0.75, 'rock': 0.8, 'hard rock': 0.85,
  'hip-hop': 0.75, 'hip hop': 0.75, 'rap': 0.75, 'trap': 0.8,
  'dance': 0.85, 'house': 0.85, 'techno': 0.9, 'trance': 0.88,
  'heavy': 0.9, 'energetic': 0.9, 'dubstep': 0.88, 'drum and bass': 0.9,
  'dnb': 0.9, 'punk': 0.88, 'hardcore': 0.92, 'thrash': 0.93,
  'drill': 0.82, 'grime': 0.8, 'uk drill': 0.82,
  'metalcore': 0.9, 'deathcore': 0.92, 'djent': 0.85,
  'pop': 0.6, 'r&b': 0.55, 'rnb': 0.55, 'soul': 0.5, 'funk': 0.7,
  'jazz': 0.45, 'blues': 0.4, 'bossa nova': 0.35,
  'classical': 0.35, 'ambient': 0.15, 'folk': 0.3, 'acoustic': 0.3,
  'sleep': 0.1, 'meditation': 0.1, 'chill': 0.25,
  'lofi': 0.2, 'lo-fi': 0.2, 'relaxing': 0.15,
  'chillhop': 0.25, 'downtempo': 0.2, 'trip-hop': 0.3,
  'singer-songwriter': 0.3, 'bluegrass': 0.45, 'country': 0.5,
  'indie': 0.55, 'indie rock': 0.6, 'indie pop': 0.5,
  'shoegaze': 0.5, 'dream pop': 0.35, 'post-rock': 0.55,
  'post-punk': 0.65, 'new wave': 0.6, 'synthwave': 0.65,
  'latin': 0.7, 'reggaeton': 0.8, 'salsa': 0.75, 'samba': 0.7,
  'afrobeats': 0.7, 'dancehall': 0.8, 'reggae': 0.55,
  'disco': 0.78, 'neo-soul': 0.45,
  'gospel': 0.5, 'worship': 0.4,
  'k-pop': 0.72, 'kpop': 0.72, 'j-pop': 0.6, 'jpop': 0.6,
};

const MOOD_MAP: Record<string, Mood> = {
  'ambient': 'peaceful', 'sleep': 'peaceful', 'meditation': 'peaceful',
  'chill': 'relaxed', 'lofi': 'relaxed', 'lo-fi': 'relaxed', 'folk': 'relaxed',
  'acoustic': 'relaxed', 'classical': 'peaceful', 'spa': 'peaceful',
  'rock': 'intense', 'metal': 'intense', 'heavy': 'intense', 'punk': 'intense',
  'hip-hop': 'energetic', 'hip hop': 'energetic', 'rap': 'energetic', 'trap': 'energetic',
  'edm': 'energetic', 'dance': 'energetic', 'house': 'energetic', 'electronic': 'energetic',
  'pop': 'uplifting', 'soul': 'uplifting', 'jazz': 'melancholic',
  'r&b': 'melancholic', 'rnb': 'melancholic',
  'drill': 'intense', 'dubstep': 'intense', 'dnb': 'energetic',
  'blues': 'melancholic', 'country': 'relaxed', 'reggae': 'relaxed',
  'gospel': 'uplifting', 'disco': 'energetic', 'funk': 'energetic',
  'synthwave': 'energetic', 'shoegaze': 'melancholic', 'dream pop': 'peaceful',
  'post-rock': 'melancholic', 'k-pop': 'energetic', 'kpop': 'energetic',
  'afrobeats': 'energetic', 'reggaeton': 'energetic', 'latin': 'uplifting',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lower(s: string) { return s.toLowerCase(); }

/** Try to match song title against the song database */
function lookupSong(title: string): { genre: Genre; energy: number; mood: Mood; bpm: number } | null {
  const t = lower(title).trim();

  // Direct exact match
  if (SONG_DATABASE[t]) return SONG_DATABASE[t];

  // Try matching without common suffixes like "by artist", "(feat. X)", etc.
  const cleaned = t
    .replace(/\s*\(.*?\)\s*/g, '')       // Remove parenthetical
    .replace(/\s*\[.*?\]\s*/g, '')       // Remove brackets
    .replace(/\s*feat\.?\s.*/i, '')      // Remove "feat..."
    .replace(/\s*ft\.?\s.*/i, '')        // Remove "ft..."
    .replace(/\s*by\s+.*/i, '')          // Remove "by artist"
    .replace(/\s*-\s+.*/i, '')           // Remove "- artist"
    .trim();

  if (cleaned && SONG_DATABASE[cleaned]) return SONG_DATABASE[cleaned];

  // Fuzzy: check if any known song is a substring
  for (const [songTitle, data] of Object.entries(SONG_DATABASE)) {
    if (t.includes(songTitle) || songTitle.includes(t)) {
      return data;
    }
  }

  return null;
}

function detectGenre(title: string): Genre {
  const t = lower(title);
  for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS) as [Genre, string[]][]) {
    if (genre === 'unknown') continue;
    if (keywords.some(kw => t.includes(kw))) return genre;
  }
  return 'unknown';
}

function estimateEnergy(title: string, genre: Genre): number {
  const t = lower(title);
  for (const [kw, val] of Object.entries(ENERGY_KEYWORDS)) {
    if (t.includes(kw)) return val;
  }
  const genreEnergy: Partial<Record<Genre, number>> = {
    'electronic': 0.75, 'rock': 0.75, 'metal': 0.9, 'hip-hop': 0.7,
    'pop': 0.6, 'r&b': 0.5, 'jazz': 0.45, 'classical': 0.35,
    'folk': 0.3, 'ambient': 0.15, 'unknown': 0.5,
  };
  return genreEnergy[genre] ?? 0.5;
}

function estimateMood(title: string, genre: Genre, energy: number): Mood {
  const t = lower(title);
  for (const [kw, mood] of Object.entries(MOOD_MAP)) {
    if (t.includes(kw)) return mood;
  }
  const genreMoods: Partial<Record<Genre, Mood>> = {
    'ambient': 'peaceful', 'classical': 'peaceful', 'folk': 'relaxed',
    'jazz': 'melancholic', 'r&b': 'melancholic', 'pop': 'uplifting',
    'electronic': 'energetic', 'hip-hop': 'energetic', 'rock': 'intense',
    'metal': 'intense',
  };
  const byGenre = genreMoods[genre];
  if (byGenre) return byGenre;
  if (energy > 0.7) return 'energetic';
  if (energy < 0.3) return 'peaceful';
  return 'uplifting';
}

function estimateBPM(genre: Genre, energy: number): number {
  const baseBPM: Partial<Record<Genre, number>> = {
    'ambient': 60, 'classical': 80, 'folk': 90, 'jazz': 100,
    'r&b': 85, 'pop': 115, 'hip-hop': 95, 'rock': 130,
    'electronic': 128, 'metal': 170, 'unknown': 100,
  };
  const base = baseBPM[genre] ?? 100;
  return Math.round(base + (energy - 0.5) * 30);
}

function estimateBassEmphasis(genre: Genre): number {
  const map: Partial<Record<Genre, number>> = {
    'hip-hop': 0.85, 'electronic': 0.75, 'metal': 0.7, 'rock': 0.6,
    'r&b': 0.65, 'pop': 0.5, 'jazz': 0.4, 'folk': 0.3,
    'classical': 0.3, 'ambient': 0.4, 'unknown': 0.5,
  };
  return map[genre] ?? 0.5;
}

function estimateVocalPresence(genre: Genre): number {
  const map: Partial<Record<Genre, number>> = {
    'folk': 0.85, 'r&b': 0.82, 'pop': 0.8, 'rock': 0.65, 'jazz': 0.6,
    'hip-hop': 0.7, 'classical': 0.2, 'electronic': 0.3, 'metal': 0.55,
    'ambient': 0.1, 'unknown': 0.5,
  };
  return map[genre] ?? 0.5;
}

function estimateTrebleEnergy(genre: Genre, energy: number): number {
  const map: Partial<Record<Genre, number>> = {
    'metal': 0.75, 'electronic': 0.7, 'rock': 0.65, 'pop': 0.55,
    'jazz': 0.5, 'classical': 0.55, 'folk': 0.4, 'ambient': 0.25,
    'r&b': 0.45, 'hip-hop': 0.5, 'unknown': 0.5,
  };
  return (map[genre] ?? 0.5) * (0.5 + energy * 0.5);
}

// ─── Main analysis function (heuristic only) ─────────────────────────────────

export function analyzeSong(title: string): SongProfile {
  // 1. Try exact song lookup first
  const songMatch = lookupSong(title);
  if (songMatch) {
    const genre = songMatch.genre;
    return {
      title,
      genre,
      energy: songMatch.energy,
      mood: songMatch.mood,
      bpmEstimate: songMatch.bpm,
      bassEmphasis: estimateBassEmphasis(genre),
      vocalPresence: estimateVocalPresence(genre),
      trebleEnergy: estimateTrebleEnergy(genre, songMatch.energy),
      rhythmIntensity: Math.min(1, songMatch.energy * 1.1),
    };
  }

  // 2. Keyword/artist matching
  const genre = detectGenre(title);
  const energy = estimateEnergy(title, genre);
  const mood = estimateMood(title, genre, energy);
  const bpmEstimate = estimateBPM(genre, energy);
  const bassEmphasis = estimateBassEmphasis(genre);
  const vocalPresence = estimateVocalPresence(genre);
  const trebleEnergy = estimateTrebleEnergy(genre, energy);
  const rhythmIntensity = Math.min(1, energy * 1.1);

  return {
    title, genre, energy, mood, bpmEstimate,
    bassEmphasis, vocalPresence, trebleEnergy, rhythmIntensity,
  };
}

// ─── Enhanced analysis with audio file ───────────────────────────────────────

export async function analyzeSongWithAudio(
  title: string,
  audioFile?: File,
): Promise<SongProfile> {
  const heuristicProfile = analyzeSong(title);

  if (audioFile) {
    const audioFeatures = await analyzeAudioFile(audioFile);
    if (audioFeatures) {
      console.log('[Song] Audio analysis complete:', audioFeatures);
      return mergeAudioFeatures(heuristicProfile, audioFeatures);
    }
  }

  return heuristicProfile;
}
