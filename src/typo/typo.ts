import mailCheck from 'mailcheck'

type TypoSuggestion = {
  address: string
  domain: string
  full: string
}

const topLevelDomains = ["ac", "academy", "accountant", "accountants", "actor", "adult", "ae.org", "africa", "agency", "ai", "airforce", "apartments", "app", "army", "art", "asia"
"associates", "attorney", "auction", "auto", "baby", "band", "bar", "bargains", "beer", "berlin", "best", "bet", "bid", "bike", "bingo", "bio", "biz", "black", "blog", "blue", "boutique", "br.com"
"build", "builders", "business", "buzz", "bz", "ca", "cab", "cafe", "cam", "camera", "camp", "capital", "cards", "care", "careers", "casa", "cash", "casino", "catering", "cc", "center", "ceo"
"ch", "chat", "cheap", "church", "city", "claims", "cleaning", "click", "clinic", "clothing", "cloud", "club", "cm", "cn", "cn.com", "co", "co.bz", "co.com", "co.uk", "coach", "codes"
"coffee", "college", "com", "com.au", "com.de", "com.es", "com.mx", "com.pe", "com.se", "com.sg", "com.vc", "community", "company", "computer", "condos", "construction"
"consulting", "contractors", "cooking", "cool", "country", "coupons", "courses", "credit", "creditcard", "cricket", "cruises", "cx", "cymru", "dance", "date", "dating", "de"
"de.com", "deals", "degree", "delivery", "democrat", "dental", "dentist", "desi", "design", "dev", "diamonds", "digital", "direct", "directory", "discount", "doctor", "dog"
"domains", "download", "earth", "eco", "education", "email", "energy", "engineer", "engineering", "enterprises", "equipment", "es", "estate", "eu", "eu.com", "events"
"exchange", "expert", "exposed", "express", "fail", "faith", "family", "fans", "farm", "fashion", "film", "finance", "financial", "fish", "fishing", "fit", "fitness", "flights"
"florist", "fm", "football", "forsale", "foundation", "fr", "fun", "fund", "furniture", "futbol", "fyi", "gallery", "game", "games", "garden", "gb.net", "gdn", "gg", "gift", "gifts"
"gives", "glass", "global", "gmbh", "gold", "golf", "gr.com", "graphics", "gratis", "green", "gripe", "group", "guide", "guru", "hamburg", "haus", "health", "healthcare", "help"
"hockey", "holdings", "holiday", "horse", "host", "house", "how", "hu.net", "icu", "id", "immo", "immobilien", "in", "in.net", "inc", "industries", "info", "ink", "institute", "insure"
"international", "investments", "io", "irish", "is", "jetzt", "jewelry", "jp.net", "jpn.com", "kaufen", "kim", "kitchen", "kiwi", "krd", "kyoto", "la", "land", "lat", "lawyer", "lease", "legal"
"lgbt", "li", "life", "lighting", "limited", "limo", "link", "live", "llc", "loan", "loans", "lol", "london", "love", "ltd", "ltda", "luxury", "maison", "management", "market"
"marketing", "mba", "me", "me.uk", "media", "melbourne", "memorial", "men", "menu", "mex.com", "mobi", "moda", "moe", "mom", "money", "mortgage", "movie", "mx", "nagoya", "name", "navy", "net"
"net.au", "net.pe", "net.vc", "network", "news", "ninja", "nom.es", "nu", "nyc", "observer", "okinawa", "one", "onl", "online", "org", "org.au", "org.es", "org.mx", "org.pe", "org.uk"
"org.vc", "organic", "osaka", "page", "paris", "partners", "parts", "party", "pe", "photo", "photography", "photos", "physio", "pics", "pictures", "pink", "pizza", "plumbing"
"plus", "poker", "porn", "press", "pro", "productions", "promo", "properties", "protection", "pub", "pw", "racing", "realty", "recipes", "red", "rehab", "reise", "reisen", "rent"
"rentals", "repair", "report", "republican", "rest", "restaurant", "review", "reviews", "rip", "rocks", "rodeo", "ru.com", "run", "ryukyu", "sa.com", "sale", "salon", "sarl"
"school", "schule", "science", "se.net", "security", "services", "sex", "sexy", "sg", "sh", "shiksha", "shoes", "shop", "shopping", "show", "singles", "site", "ski", "soccer", "social"
"software", "solar", "solutions", "soy", "space", "store", "stream", "studio", "study", "style", "sucks", "supplies", "supply", "support", "surf", "surgery", "sydney", "systems"
"tax", "taxi", "team", "tech", "technology", "tel", "tennis", "theater", "tienda", "tips", "tires", "to", "today", "tokyo", "tools", "top", "tours", "town", "toys", "trade", "training"
"travel", "tube", "tv", "uk", "uk.com", "uk.net", "university", "uno", "us", "us.com", "us.org", "vacations", "vc", "vegas", "ventures", "vet", "viajes", "video", "villas", "vin", "vip"
"vision", "vodka", "vote", "voting", "voto", "voyage", "wales", "watch", "webcam", "website", "wedding", "wiki", "win", "wine", "work", "works", "world", "ws", "wtf", "xn", "xxx", "xyz", "yoga"
"yokohama", "za.com"];

export const checkTypo = async (email: string): Promise<string | undefined> =>
  new Promise(r =>
    mailCheck.run({
      email,
      topLevelDomains: topLevelDomains,
      suggested: (suggestion: TypoSuggestion) => {
        r(`Likely typo, suggested email: ${suggestion.full}`)
      },
      empty: function() {
        r()
      },
    })
  )
