declare type UUID = number;

enum Scale {
  Major,
  Minor,
  HarmonicMinor,
  Chromatic,
  Pentatonic,
}

enum Key {
  A, Bb, B, C, Db, D, Eb, E, F, Gb, G, Ab
}

enum Mode {
  Synth,
  Session,
  Arrangement
}

enum InstrumentType {
  REZ,
  SAMPLER
}
interface Instrument {
  type   : InstrumentType;
  params : Any;
}

enum EffectType {
  Fuzz, Delay, Reverb, Double, Compressor
}
interface Effect {
  type   : EffectType;
  params : Any;
}

interface Mixer {
  effects : Effect[];
  gain    : number;
  pan     : number;
}

interface Track {
  uuid       : UUID;
  name       : string;
  instrument : Instrument;
  mixer      : Mixer;
}

interface Clip {
  name    : string;
  length  : string;
  pattern : number[]; // TODO: midiで制御する
}

interface Scene {
  key   : Key;
  scale : Scale;
  bpm   : number;
  clips : Clip[];
}

interface Artist {
  uuid? : UUID;
  name  : string;
}

interface master {

}

interface Song {
  uuid?  : UUID;
  title  : string;
  artist : Artist;
  tracks : Track[];
  scenes : Scene[];
  master : {

  }
}

interface state {
  mode: Mode;
  song: Song;
}
