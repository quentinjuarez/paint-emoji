import bigPatterns from '../assets/data/patterns.json'
import smallPatterns from '../assets/data/small-patterns.json'

const getPatterns = (size: 'normal' | 'tight' = 'normal') => {
  return size === 'normal' ? bigPatterns : smallPatterns
}

const textToPatterns = (text: string, size: 'normal' | 'tight' = 'normal') => {
  const letters = text
    .split('')
    .map((char) => {
      const pattern = MAP(size)[removeDiacritics(char.toUpperCase())]

      if (!pattern) {
        return null
      }
      return pattern
    })
    .filter(Boolean) as string[]

  // pretty print
  // console.log(
  //   letters
  //     .map((letter) =>
  //       letter
  //         .split('\n')
  //         .map((line) =>
  //           line.replace(/0/g, ' ').replaceAll(/1/g, '#').split('').join(' ')
  //         )
  //         .join('\n')
  //     )
  //     .join('\n\n')
  // );

  return joinPatterns(letters, size)
}

const joinPatterns = (patterns: string[], size: 'normal' | 'tight' = 'normal') => {
  const lines = Array.from({ length: 7 }, () => '')

  patterns.forEach((pattern) => {
    const linesPattern = removeEmptyColumns(pattern, size).split('\n')
    linesPattern.forEach((linePattern, i) => {
      lines[i] += linePattern + '0'
    })
  })

  return lines.join('\n')
}

function removeEmptyColumns(pattern: string, size: 'normal' | 'tight' = 'normal'): string {
  if (pattern === getPatterns(size).SPACE) {
    return getPatterns(size).EMPTY.trim()
  }
  const rows = pattern.trim().split('\n')
  const numCols = rows[0].length

  const nonEmptyCols: number[] = []

  // Check each column for emptiness
  for (let col = 0; col < numCols; col++) {
    let isEmpty = true
    for (const row of rows) {
      if (row[col] !== '0') {
        isEmpty = false
        break
      }
    }
    if (!isEmpty) {
      nonEmptyCols.push(col)
    }
  }

  // Generate modified rows
  const modifiedRows = rows.map((row) => {
    let newRow = ''
    for (const col of nonEmptyCols) {
      newRow += row[col]
    }
    return newRow
  })

  // Join modified rows and return the result
  return modifiedRows.join('\n')
}

const MAP = (size: 'normal' | 'tight' = 'normal'): { [key: string]: string } => {
  const patterns = getPatterns(size)
  return {
    A: patterns.A,
    B: patterns.B,
    C: patterns.C,
    D: patterns.D,
    E: patterns.E,
    F: patterns.F,
    G: patterns.G,
    H: patterns.H,
    I: patterns.I,
    J: patterns.J,
    K: patterns.K,
    L: patterns.L,
    M: patterns.M,
    N: patterns.N,
    O: patterns.O,
    P: patterns.P,
    Q: patterns.Q,
    R: patterns.R,
    S: patterns.S,
    T: patterns.T,
    U: patterns.U,
    V: patterns.V,
    W: patterns.W,
    X: patterns.X,
    Y: patterns.Y,
    Z: patterns.Z,
    ' ': patterns.SPACE,
    '0': patterns.NUMBER_0,
    '1': patterns.NUMBER_1,
    '2': patterns.NUMBER_2,
    '3': patterns.NUMBER_3,
    '4': patterns.NUMBER_4,
    '5': patterns.NUMBER_5,
    '6': patterns.NUMBER_6,
    '7': patterns.NUMBER_7,
    '8': patterns.NUMBER_8,
    '9': patterns.NUMBER_9,
    '!': patterns.SYMBOL_EXCLAMATION,
    '?': patterns.SYMBOL_QUESTION,
    '.': patterns.SYMBOL_PERIOD,
    ',': patterns.SYMBOL_COMMA,
    "'": patterns.SYMBOL_APOSTROPHE,
    ':': patterns.SYMBOL_COLON,
    ';': patterns.SYMBOL_SEMICOLON,
    '+': patterns.SYMBOL_PLUS,
    '-': patterns.SYMBOL_MINUS,
    '*': patterns.SYMBOL_ASTERISK,
    '/': patterns.SYMBOL_SLASH,
    '\\': patterns.SYMBOL_BACKSLASH,
    _: patterns.SYMBOL_UNDERSCORE,
    '=': patterns.SYMBOL_EQUAL,
    '<': patterns.SYMBOL_LESS_THAN,
    '>': patterns.SYMBOL_GREATER_THAN,
    '"': patterns.SYMBOL_QUOTATION_MARK,
    '#': patterns.SYMBOL_HASH,
    $: patterns.SYMBOL_DOLLAR,
    '%': patterns.SYMBOL_PERCENT,
    '&': patterns.SYMBOL_AMPERSAND,
    '@': patterns.SYMBOL_AT,
    '(': patterns.SYMBOL_LEFT_PARENTHESIS,
    ')': patterns.SYMBOL_RIGHT_PARENTHESIS,
    '[': patterns.SYMBOL_LEFT_SQUARE_BRACKET,
    ']': patterns.SYMBOL_RIGHT_SQUARE_BRACKET,
    '{': patterns.SYMBOL_LEFT_CURLY_BRACKET,
    '}': patterns.SYMBOL_RIGHT_CURLY_BRACKET,
    '|': patterns.SYMBOL_VERTICAL_BAR,
    '`': patterns.SYMBOL_BACKTICK,
    '~': patterns.SYMBOL_TILDE,
    '^': patterns.SYMBOL_CIRCUMFLEX
  }
}

export default textToPatterns
