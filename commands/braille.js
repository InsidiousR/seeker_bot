const RU_MAP = {
    '⠁': 'а', 
    '⠃': 'б', 
    '⠺': 'в', 
    '⠛': 'г', 
    '⠙': 'д', 
    '⠑': 'е', 
    '⠡': 'ё', 
    '⠚': 'ж', 
    '⠵': 'з',
    '⠊': 'и', 
    '⠯': 'й', 
    '⠅': 'к', 
    '⠇': 'л', 
    '⠍': 'м', 
    '⠝': 'н', 
    '⠕': 'о', 
    '⠏': 'п',
    '⠗': 'р',
    '⠎': 'с',
    '⠞': 'т',
    '⠥': 'у',
    '⠋': 'ф',
    '⠓': 'х',
    '⠉': 'ц',
    '⠟': 'ч',
    '⠱': 'ш',
    '⠭': 'щ',
    '⠷': 'ъ',
    '⠮': 'ы',
    '⠾': 'ь',
    '⠪': 'э',
    '⠳': 'ю',
    '⠫': 'я',
    '⠀': ' ',
    ' ': ' '
  };
  
  const EN_MAP = {
    '⠁': 'a',
    '⠃': 'b',
    '⠉': 'c',
    '⠙': 'd',
    '⠑': 'e',
    '⠋': 'f',
    '⠛': 'g',
    '⠓': 'h',
    '⠊': 'i',
    '⠚': 'j',
    '⠅': 'k',
    '⠇': 'l',
    '⠍': 'm',
    '⠝': 'n',
    '⠕': 'o',
    '⠏': 'p',
    '⠟': 'q',
    '⠗': 'r',
    '⠎': 's',
    '⠞': 't',
    '⠥': 'u',
    '⠧': 'v',
    '⠺': 'w',
    '⠭': 'x',
    '⠽': 'y',
    '⠵': 'z'
  };
  
  const DIGITS_MAP = '⠚⠁⠃⠉⠙⠑⠋⠛⠓⠊';
  
  const SPECIALS = {
    toUpper: Symbol('toUpper'),
    toDigit: Symbol('toDigit')
  };
  
  const SPECIALS_MAP = {
    '⠠': SPECIALS.toUpper,
    '⠼': SPECIALS.toDigit,
    '⠲': '.',
    '⠂': ',',
    '⠢': '?',
    '⠆': ';',
    '⠤': '-',
    '⠀': ' '
  };
  
  /**
   * Decodes braille on generic language
   * @param letters object - object with mapping braille on letters
   * @param str string - String to be decoded
   * @param ignoreForeigns bool - Ignore or include foreign chars. Default: include.
   * @returns string - Decoded string
  */
  function decode(letters, str, ignoreForeigns = false) {
    let modifier = null;
    return Array.from(str).map(e => {
      if(e in letters) {
        switch(modifier) {
          case SPECIALS.toUpper:
            modifier = null;
            return letters[e].toUpperCase();
          case SPECIALS.toDigit:
            modifier = null;
            if(!DIGITS_MAP.includes(e)) return e;
            return DIGITS_MAP.indexOf(e).toString();
          default:
            return letters[e];
        }
      }
      if(e in SPECIALS_MAP) {
        if(typeof SPECIALS_MAP[e] === 'string') return SPECIALS_MAP[e];
        modifier = SPECIALS_MAP[e];
        return '';
      }
      if(ignoreForeigns) return '';
      return e;
    }).join('');
  }
  
  /**
   * Decodes braille on Russian
   * @param str string - String to be decoded
   * @returns string - Decoded string
  */
  function decodeRU(str) {
    return decode(RU_MAP, str);
  }
  
  /**
   * Decodes braille on English
   * @param str string - String to be decoded
   * @returns string - Decoded string
  */
  function decodeEN(str) {
    return decode(EN_MAP, str);
  }
  
  module.exports = {decode, decodeRU, decodeEN};
