// Wave 1 (the first build, ~300 species) and wave 2 (toward ~400), per zone.
// Bases are PokeAPI identifiers with hyphens stripped; each pulls in its whole line.
export const ZONES = [
  { key: 'outskirts', name: 'Outskirts (Town edge)', band: [2, 18], theme: 'Street-level mix: Normal, Flying, Bug, Poison, early Fighting.',
    w1: ['weedle','machop','lillipup','fletchling'],
    w2: ['nidoranf','nidoranm','spearow','sentret','hoothoot','taillow','pidove','mankey','pikipek','yungoos','rookidee','skwovet','wooloo'] },
  { key: 'underpass', name: 'Wild Zone Trail: Underpass stage', band: [5, 13], theme: 'Sewers and underpasses: Poison, Ground.',
    w1: ['grimer','diglett','trubbish'], w2: ['shroodle','wiglett'] },
  { key: 'district', name: 'Wild Zone Trail: District stage', band: [9, 18], theme: 'Rooftops and plazas: Psychic, Electric, Flying.',
    w1: ['drowzee','natu','voltorb'], w2: ['woobat','tandemaus','yamper'] },
  { key: 'harbor', name: 'Harbor District', band: [18, 23], theme: 'Water, Ice (the fish market cold store), Flying.',
    w1: ['staryu','shellder','slowpoke','spheal','swinub'], w2: ['poliwag','goldeen','mareanie','cetoddle','binacle','wiglett'] },
  { key: 'ember', name: 'Ember Quarter', band: [23, 28], theme: 'Fire, Rock, Steel, Ground.',
    w1: ['vulpix','ponyta','rhyhorn','onix','roggenrola'], w2: ['larvesta','salandit','litleo','sizzlipede','varoom','capsakid'] },
  { key: 'greenline', name: 'Greenline Terraces', band: [28, 32], theme: 'Grass, Bug, Fairy.',
    w1: ['bellsprout','budew','shroomish','scyther','bounsweet'], w2: ['seedot','petilil','foongus','exeggcute','paras','kricketot','smoliv','blipbug','gossifleur'] },
  { key: 'signal', name: 'Signal District', band: [33, 38], theme: 'Electric, Steel, Psychic.',
    w1: ['shinx','porygon','elgyem','solosis'], w2: ['blitzle','tynamo','helioptile','klefki','dedenne','tadbulb','tinkatink','hatenna'] },
  { key: 'undercity', name: 'Undercity / Old Lines / Terminus', band: [35, 43], theme: 'Dark, Ghost, Poison, Ground.',
    w1: ['sneasel','sandile','yamask','phantump','cubone','honedge'], w2: ['poochyena','purrloin','scraggy','misdreavus','skorupi','hippopotas','greavard','glimmet','maschiff'] },
  { key: 'sprawl', name: 'The Sprawl', band: [43, 47], theme: 'Ordinary city life: Normal, Fairy, Fighting, Psychic.',
    w1: ['timburr','meditite','buneary','jigglypuff','marill'], w2: ['pancham','minccino','togepi','munchlax','stufful','spritzee','swirlix','falinks'] },
  { key: 'underlight', name: 'The Underlight', band: [53, 60], theme: 'Pre-city deep dark: Rock, Ground, Dark, ancient Dragons.',
    w1: ['larvitar','trapinch','deino'], w2: ['ferroseed','tyrunt','amaura','goomy','frigibax','orthworm'] },
  { key: 'skyline', name: 'The Skyline (postgame)', band: [55, 65], theme: 'Flying, Dragon, Electric.',
    w1: ['noibat','dreepy','rufflet'], w2: ['vullaby','hawlucha','tropius','flittle','bombirdier'] },
  { key: 'shoal', name: 'The Long Shoal (postgame island)', band: [60, 65], theme: 'Open ocean: Water, Dark.',
    w1: ['carvanha','wailmer','feebas','frillish','lapras'], w2: ['corphish','skrelp','alomomola','finizen','dhelmise'] },
  { key: 'archive', name: 'The Drowned Archive (postgame island)', band: [63, 68], theme: 'Ruins: Psychic, Steel, ancient fossils.',
    w1: ['beldum','baltoy','lunatone','solrock','omanyte','kabuto','lileep','aerodactyl','latios'], w2: ['anorith','cranidos','shieldon','tirtouga','archen','sigilyph','golett','munna'] }
];
export const EXCLUDE = {
  regional: ['obstagoon','perrserker','cursola','sirfetchd','mrrime','runerigus','overqwil','sneasler','wyrdeer','kleavor','ursaluna','basculegion','annihilape','dudunsparce','clodsire','farigiraf','kingambit']
};

// Batches whose species are generated into src/data/rosterGenerated.js
// (tools/roster/build.mjs). 'completions' finishes the lines already in the game;
// each zone key adds that zone's wave-1 lines. Build in story order.
export const BUILT = ['completions'];

// Which wild-table keys a plan zone feeds. A plain string is the zone itself;
// { zone, types } adds only species with one of those types (the dungeon and
// corridor tables hold a themed subset of their district's roster).
export const ZONE_TABLES = {
  outskirts: ['outskirts'],
  underpass: ['underpass'],
  district: ['district'],
  harbor: ['harbor'],
  ember: ['ember', { zone: 'boiler', filter: true, types: ['Rock', 'Ground', 'Steel', 'Fire'] }],
  greenline: ['greenline'],
  signal: ['signal', { zone: 'risers', filter: true, types: ['Electric', 'Steel'] }],
  undercity: ['undercity', 'oldlines', { zone: 'terminus', filter: true, types: ['Ghost'] }],
  sprawl: ['sprawl'],
  skyline: ['skyline']
};
