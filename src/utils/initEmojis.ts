const largeSquares = [
  {
    name: ':white_large_square:',
    value: '⬜',
    type: 'slack'
  },
  {
    name: ':black_large_square:',
    value: '⬛',
    type: 'slack'
  },
  {
    name: ':large_red_square:',
    value: '🟥',
    type: 'slack'
  },
  {
    name: ':large_orange_square:',
    value: '🟧',
    type: 'slack'
  },
  {
    name: ':large_yellow_square:',
    value: '🟨',
    type: 'slack'
  },
  {
    name: ':large_green_square:',
    value: '🟩',
    type: 'slack'
  },
  {
    name: ':large_blue_square:',
    value: '🟦',
    type: 'slack'
  },
  {
    name: ':large_purple_square:',
    value: '🟪',
    type: 'slack'
  },
  {
    name: ':large_brown_square:',
    value: '🟫',
    type: 'slack'
  }
] as Emoji[]

const hearts = [
  {
    name: ':white_heart:',
    value: '🤍',
    type: 'slack'
  },
  {
    name: ':black_heart:',
    value: '🖤',
    type: 'slack'
  },
  {
    name: ':heart:',
    value: '❤️',
    type: 'slack'
  },
  {
    name: ':orange_heart:',
    value: '🧡',
    type: 'slack'
  },
  {
    name: ':yellow_heart:',
    value: '💛',
    type: 'slack'
  },
  {
    name: ':green_heart:',
    value: '💚',
    type: 'slack'
  },
  {
    name: ':blue_heart:',
    value: '💙',
    type: 'slack'
  },
  {
    name: ':purple_heart:',
    value: '💜',
    type: 'slack'
  },

  {
    name: ':brown_heart:',
    value: '🤎',
    type: 'slack'
  }
] as Emoji[]

const circles = [
  {
    name: ':white_circle:',
    value: '⚪',
    type: 'slack'
  },
  {
    name: ':black_circle:',
    value: '⚫',
    type: 'slack'
  },
  {
    name: ':red_circle:',
    value: '🔴',
    type: 'slack'
  },
  {
    name: ':orange_circle:',
    value: '🟠',
    type: 'slack'
  },
  {
    name: ':yellow_circle:',
    value: '🟡',
    type: 'slack'
  },
  {
    name: ':green_circle:',
    value: '🟢',
    type: 'slack'
  },
  {
    name: ':blue_circle:',
    value: '🔵',
    type: 'slack'
  },
  {
    name: ':purple_circle:',
    value: '🟣',
    type: 'slack'
  },
  {
    name: ':brown_circle:',
    value: '🟤',
    type: 'slack'
  }
] as Emoji[]

const empty = Array.from(
  { length: 9 },
  (_, index) =>
    ({
      name: `:_:`,
      value: String(index + 1),
      type: 'empty'
    }) as Emoji
)

const initEmojis = (pattern?: 'largeSquares' | 'hearts' | 'circles' | 'empty'): Emoji[] => {
  switch (pattern) {
    case 'largeSquares':
      return largeSquares
    case 'hearts':
      return hearts
    case 'circles':
      return circles
    case 'empty':
      return empty
    default:
      return largeSquares
  }
}

export default initEmojis
