// Sources behind each result. Titles are given in the source's own language. URLs checked 2026-11 (zdic is reachable from browsers; it refuses some automated clients).
export const REFS = {
  bzmj: {
    title: "八宅明鏡 (Ba Zhai Ming Jing), 箬冠道人, 1760 掃葉山房 edition",
    url: "https://archive.org/details/20260507_20260507_0702",
  },
  classes: {
    title: "The eight 八宅 classes, ranked, with their trigram pairings",
    url: "https://www.masterseanchan.com/feng-shui-8-mansions-house-types/",
  },
  youNian: {
    title: "風水學中的陽宅三要之大遊年歌 (漢典)",
    url: "https://hl.zdic.net/xxfs/fssl/0224/19876.html",
  },
  skinner: {
    title: "Stephen Skinner: The much neglected Eight Mansions method",
    url: "https://fengshuitoday.com/the-much-neglected-eight-mansions-method/",
  },
  fengshui: { title: "風水 (八宅法、八卦遊年、貪狼九星)", url: "https://zh.wikipedia.org/wiki/%E9%A2%A8%E6%B0%B4" },
  nineStars: { title: "北斗九星", url: "https://zh.wikipedia.org/wiki/%E5%8C%97%E6%96%97%E4%B9%9D%E6%98%9F" },
  bagua: { title: "Bagua (八卦)", url: "https://en.wikipedia.org/wiki/Bagua" },
  lichun: { title: "Lichun (立春)", url: "https://en.wikipedia.org/wiki/Lichun" },
  flyingStar: { title: "Flying Star Feng Shui (玄空飛星)", url: "https://en.wikipedia.org/wiki/Flying_Star_Feng_Shui" },
  loShu: { title: "Luoshu Square (洛書)", url: "https://en.wikipedia.org/wiki/Lo_Shu_Square" },
  taiSui: { title: "Tai Sui (太歲)", url: "https://en.wikipedia.org/wiki/Tai_Sui" },
  wuxing: { title: "Wuxing (五行)", url: "https://en.wikipedia.org/wiki/Wuxing_(Chinese_philosophy)" },
  numerology: { title: "Chinese numerology", url: "https://en.wikipedia.org/wiki/Chinese_numerology" },
};

// Which sources back each result section (section ids as in ui/fold.js sec())
export const SECTION_REFS = {
  kua: ["bzmj", "skinner", "bagua", "lichun"],
  dirs: ["bzmj", "youNian", "classes", "fengshui", "nineStars"],
  place: ["classes", "skinner"],
  year: ["flyingStar", "loShu", "taiSui"],
  house: ["skinner", "youNian", "bagua", "flyingStar"],
  nums: ["wuxing", "numerology"],
  colors: ["wuxing"],
  mats: ["wuxing"],
};
