const textToBounce = (text: string) => {
  const letters = text
    .split('')
    .map((char) => {
      const pattern = MAP[removeDiacritics(char.toUpperCase())]

      if (!pattern) {
        return null
      }
      return pattern
    })
    .filter(Boolean) as string[]

  return letters
}

const MAP: { [key: string]: string } = {
  A: ':bounce-a:',
  B: ':bounce-b:',
  C: ':bounce-c:',
  D: ':bounce-d:',
  E: ':bounce-e:',
  F: ':bounce-f:',
  G: ':bounce-g:',
  H: ':bounce-h:',
  I: ':bounce-i:',
  J: ':bounce-j:',
  K: ':bounce-k:',
  L: ':bounce-l:',
  M: ':bounce-m:',
  N: ':bounce-n:',
  O: ':bounce-o:',
  P: ':bounce-p:',
  Q: ':bounce-q:',
  R: ':bounce-r:',
  S: ':bounce-s:',
  T: ':bounce-t:',
  U: ':bounce-u:',
  V: ':bounce-v:',
  W: ':bounce-w:',
  X: ':bounce-x:',
  Y: ':bounce-y:',
  Z: ':bounce-z:',
  ' ': ':_:',
  '0': ':bounce-0:',
  '1': ':bounce-1:',
  '2': ':bounce-2:',
  '3': ':bounce-3:',
  '4': ':bounce-4:',
  '5': ':bounce-5:',
  '6': ':bounce-6:',
  '7': ':bounce-7:',
  '8': ':bounce-8:',
  '9': ':bounce-9:',
  '!': ':bounce-exclamation:',
  '?': ':bounce-question:',
  '.': ':bounce-period:',
  ',': ':bounce-comma:',
  "'": ':bounce-apostrophe:',
  ':': ':bounce-colon:',
  ';': ':bounce-semicolon:',
  '+': ':bounce-plus:',
  '-': ':bounce-hyphen:',
  '*': ':bounce-asterisk:',
  '/': ':bounce-slash:',
  '\\': ':bounce-backslash:',
  _: ':bounce-underscore:',
  '=': ':bounce-equal:',
  '<': ':bounce-less-than:',
  '>': ':bounce-greater-than:',
  '"': ':bounce-quote:',
  '#': ':bounce-hash:',
  $: ':bounce-dollar:',
  '€': ':bounce-euro:',
  '%': ':bounce-percent:',
  '&': ':bounce-ampersand:',
  '@': ':bounce-at:',
  '(': ':bounce-parenthesis-left:',
  ')': ':bounce-parenthesis-right:',
  '[': ':bounce-bracket-left:',
  ']': ':bounce-bracket-right:',
  '{': ':bounce-brace-left:',
  '}': ':bounce-brace-right:',
  '|': ':bounce-vertical-bar:'
}

export default textToBounce
