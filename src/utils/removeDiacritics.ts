const replacementList = [
  { base: ' ', chars: ' ' },
  { base: '0', chars: '߀' },
  { base: 'A', chars: 'ⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ' },
  { base: 'AA', chars: 'Ꜳ' },
  { base: 'AE', chars: 'ÆǼǢ' },
  { base: 'AO', chars: 'Ꜵ' },
  { base: 'AU', chars: 'Ꜷ' },
  { base: 'AV', chars: 'ꜸꜺ' },
  { base: 'AY', chars: 'Ꜽ' },
  { base: 'B', chars: 'ⒷＢḂḄḆɃƁ' },
  { base: 'C', chars: 'ⒸＣꜾḈĆCĈĊČÇƇȻ' },
  { base: 'D', chars: 'ⒹＤḊĎḌḐḒḎĐƊƉᴅꝹ' },
  { base: 'Dh', chars: 'Ð' },
  { base: 'DZ', chars: 'ǱǄ' },
  { base: 'Dz', chars: 'ǲǅ' },
  { base: 'E', chars: 'ɛⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎᴇ' },
  { base: 'F', chars: 'ꝼⒻＦḞƑꝻ' },
  { base: 'G', chars: 'ⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾɢ' },
  { base: 'H', chars: 'ⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ' },
  { base: 'I', chars: 'ⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ' },
  { base: 'J', chars: 'ⒿＪĴɈȷ' },
  { base: 'K', chars: 'ⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ' },
  { base: 'L', chars: 'ⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ' },
  { base: 'LJ', chars: 'Ǉ' },
  { base: 'Lj', chars: 'ǈ' },
  { base: 'M', chars: 'ⓂＭḾṀṂⱮƜϻ' },
  { base: 'N', chars: 'ꞤȠⓃＮǸŃÑṄŇṆŅṊṈƝꞐᴎ' },
  { base: 'NJ', chars: 'Ǌ' },
  { base: 'Nj', chars: 'ǋ' },
  { base: 'O', chars: 'ⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ' },
  { base: 'OE', chars: 'Œ' },
  { base: 'OI', chars: 'Ƣ' },
  { base: 'OO', chars: 'Ꝏ' },
  { base: 'OU', chars: 'Ȣ' },
  { base: 'P', chars: 'ⓅＰṔṖƤⱣꝐꝒꝔ' },
  { base: 'Q', chars: 'ⓆＱꝖꝘɊ' },
  { base: 'R', chars: 'ⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ' },
  { base: 'S', chars: 'ⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ' },
  { base: 'T', chars: 'ⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ' },
  { base: 'Th', chars: 'Þ' },
  { base: 'TZ', chars: 'Ꜩ' },
  { base: 'U', chars: 'ⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ' },
  { base: 'V', chars: 'ⓋＶṼṾƲꝞɅ' },
  { base: 'VY', chars: 'Ꝡ' },
  { base: 'W', chars: 'ⓌＷẀẂŴẆẄẈⱲ' },
  { base: 'X', chars: 'ⓍＸẊẌ' },
  { base: 'Y', chars: 'ⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ' },
  { base: 'Z', chars: 'ⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ' }
]

const diacriticsMap = {} as Record<string, string>

for (let i = 0; i < replacementList.length; i += 1) {
  const chars = replacementList[i].chars
  for (let j = 0; j < chars.length; j += 1) {
    diacriticsMap[chars[j]] = replacementList[i].base
  }
}

function removeDiacritics(a: string) {
  // eslint-disable-next-line no-control-regex
  return a.replace(/[^\u0000-\u007e]/g, function (a) {
    return diacriticsMap[a] || a
  })
}

export default removeDiacritics
