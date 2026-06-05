/* ════════════════════════════════════════════════════════════════
   EXAM DATA — Cambridge B1 PET Reading Paper
════════════════════════════════════════════════════════════════ */

export const EXAM_DATA = {
  part1: {
    instructions: "For each question, choose the correct answer A, B, or C.",
    texts: [
      { id:"t1", type:"sms", label:"Text 1", note:"Text message", from:"Sam", to:"Alex",
        content:"Hey Alex! Just wanted to let you know — we're meeting at the cinema at 7pm tonight, not 6pm like I said earlier. I've already bought both tickets online so there's no need to bring any cash. See you there! 😊" },
      { id:"t2", type:"notice", label:"Text 2", note:"Shop notice", title:"PRICE REDUCTION WEEKEND",
        content:"All summer clothing now 30% off marked prices. Offer valid Saturday and Sunday ONLY. Please note: sale items cannot be exchanged or refunded after purchase." },
      { id:"t3", type:"email", label:"Text 3", note:"Email", from:"noreply@riversidelibrary.org",
        subject:"Temporary Library Closure – Monday 14th",
        content:"Dear Members,\n\nWe would like to remind you that the library will be closed this Monday 14th for essential building maintenance work. Books already reserved can be collected from the front desk when we reopen on Tuesday 15th. We apologise for any inconvenience.\n\nKind regards,\nThe Riverside Library Team" },
      { id:"t4", type:"announcement", label:"Text 4", note:"School announcement", title:"📢 STUDENT NOTICE",
        content:"The science competition entry deadline has been moved to Friday 25th October. Students who have already submitted entries do NOT need to resubmit. For any questions, please speak to Mr Davies in Room 12." },
      { id:"t5", type:"sign", label:"Text 5", note:"Road sign",
        content:"ROAD CLOSED AHEAD\nDiversion via Park Road & Church Lane\nFollow yellow signs\nResident access only: 8am – 6pm" },
    ],
    questions: [
      { id:"q1_1", text:"What is Sam telling Alex?",
        options:[{l:"A",t:"To buy tickets for the cinema"},{l:"B",t:"To arrive at a different time"},{l:"C",t:"To bring money for tonight"}],
        correct:"B", explanation:"Sam says the time has changed from 6pm to 7pm. The tickets are already purchased, so Alex doesn't need money or to buy tickets." },
      { id:"q1_2", text:"What does the notice say about sale items?",
        options:[{l:"A",t:"They are only available this weekend"},{l:"B",t:"They cannot be returned after purchase"},{l:"C",t:"They have been moved to a new area"}],
        correct:"B", explanation:"The notice says items 'cannot be exchanged or refunded' — this means they cannot be returned." },
      { id:"q1_3", text:"Why is the library sending this email?",
        options:[{l:"A",t:"To inform members about changed opening times"},{l:"B",t:"To explain new book collection rules"},{l:"C",t:"To advertise new library services"}],
        correct:"A", explanation:"The email tells members the library will be closed on Monday — this is a change to opening hours." },
      { id:"q1_4", text:"What do students learn from the school notice?",
        options:[{l:"A",t:"They must speak to Mr Davies before entering"},{l:"B",t:"Students who already entered need do nothing"},{l:"C",t:"The competition has been cancelled"}],
        correct:"B", explanation:"The notice says students who submitted entries 'do NOT need to resubmit.'" },
      { id:"q1_5", text:"What does the road sign tell drivers?",
        options:[{l:"A",t:"The road will close at 8am"},{l:"B",t:"Yellow signs show an alternative route"},{l:"C",t:"Residents cannot use the road"}],
        correct:"B", explanation:"The sign says 'Follow yellow signs' for the diversion." },
    ],
  },

  part2: {
    instructions:"The people below are all looking for something to read. Read the descriptions of eight books (A–H). Decide which book would be most suitable for each person.",
    books:[
      { id:"A", title:"The Time Keeper", content:"A fast-paced science fiction adventure following a teenager who discovers a mysterious clock able to control time. Features clever plot twists and complex moral dilemmas. Best for confident readers aged 14+." },
      { id:"B", title:"Cooking with Friends", content:"A beautifully illustrated recipe book with simple, healthy meals designed to prepare with others. Step-by-step photographs and beginner-friendly instructions — no cooking experience required!" },
      { id:"C", title:"City Lights", content:"A moving novel about a young woman building a new life in a big city after leaving her small hometown. Explores friendship, loneliness, and personal growth in a warm, accessible style." },
      { id:"D", title:"Planet Earth: Our Future", content:"An informative guide to climate change and environmental challenges written specifically for young adults. Explains the science clearly and shows readers what they can do personally." },
      { id:"E", title:"Best Goals Ever!", content:"Stories about iconic football matches and legendary players worldwide. Packed with stunning photographs, player interviews, and fascinating statistics. Perfect for sports fans of all ages." },
      { id:"F", title:"Mind Games", content:"A collection of logic puzzles, word games, and brain teasers to challenge and entertain. Suitable for all ages — ideal for long journeys or quiet afternoons at home." },
      { id:"G", title:"My Kitchen Garden", content:"A practical guide to growing vegetables, fruits, and herbs at home — even in a small space. Includes monthly planting calendars, pest advice, and tips for limited outdoor areas." },
      { id:"H", title:"Journey to the North", content:"A beautifully written memoir about one woman's solo journey across Scandinavia, blending personal reflections with vivid descriptions of remote landscapes, Nordic culture, and traditional food." },
    ],
    questions:[
      { id:"q2_1", name:"Maria", desc:"Maria enjoys outdoor activities and wants to eat more healthily. She has rarely cooked before and is looking for guidance to start making her own meals at home.", correct:"B", explanation:"'Cooking with Friends' (B) is designed for beginners with no cooking experience and focuses on healthy meals." },
      { id:"q2_2", name:"David", desc:"David is deeply concerned about environmental problems and wants to understand the science of climate change and what he can do personally to help.", correct:"D", explanation:"'Planet Earth: Our Future' (D) explains climate change science for young adults and encourages personal action." },
      { id:"q2_3", name:"Sophie", desc:"Sophie loves reading about real places and personal experiences. She is fascinated by Scandinavian culture and is considering visiting that region.", correct:"H", explanation:"'Journey to the North' (H) is a personal memoir about travelling in Scandinavia, with culture and landscape descriptions." },
      { id:"q2_4", name:"Jake", desc:"Jake is passionate about football and enjoys reading about the history of the sport, famous players, and memorable matches from around the world.", correct:"E", explanation:"'Best Goals Ever!' (E) is specifically about iconic matches and legendary players." },
      { id:"q2_5", name:"Lily", desc:"Lily enjoys fiction and particularly likes stories where the main character faces personal challenges and grows as a result of their experiences.", correct:"C", explanation:"'City Lights' (C) follows a young woman who faces challenges and discovers herself in a new city." },
    ],
  },

  part3: {
    instructions:"Read the article. For each question (11–15), choose the correct answer A, B, C, or D.",
    article:{
      title:"The Secrets of a Long Life",
      paragraphs:[
        { id:"p1", text:"Every year, researchers studying human longevity travel to interview the world's oldest living people — supercentenarians, those aged 110 years or over. These remarkable individuals have survived world wars, major illnesses, and extraordinary technological change. Their existence raises a fascinating question: what exactly is the secret to living an exceptionally long life?" },
        { id:"p2", text:"Dr Elena Martinez, a gerontologist at the University of Barcelona, has spent fifteen years studying people aged over 100. 'The first thing you notice is that there is no single pattern,' she explains. 'Some of our subjects have smoked their whole lives. Others have never touched alcohol. A few have had very stressful careers, while others have lived quietly in small villages for decades. What they share is something harder to measure than diet or exercise.'" },
        { id:"p3", text:"That elusive 'something', Dr Martinez believes, is a combination of positive attitude and strong social connections. In her most recent study, published last year, she found that people who maintained close friendships well into old age were significantly more likely to reach 100 than those who lived isolated lives. 'Loneliness appears to be as damaging to health as smoking fifteen cigarettes a day,' she notes. 'Yet we rarely treat it as the serious public health issue it clearly is.'" },
        { id:"p4", text:"Genetics certainly plays a role. Studies of identical twins suggest that roughly 25% of our lifespan is determined by the genes we inherit from our parents. This is significant — but it means 75% is shaped by lifestyle choices, environmental factors, and what researchers call 'chance events': infections, accidents, and other unpredictable occurrences no individual can fully control." },
        { id:"p5", text:"Diet is often assumed to be the master key to long life, and while it matters, Dr Martinez cautions against oversimplification. 'People in many different cultures live very long lives on quite different diets,' she observes. 'Mediterranean, plant-based, high-fish diets — they all seem to work. What they share is a preference for unprocessed foods in moderate portions.' Exercise matters too, but gentle daily movement — walking, gardening, cycling short distances — appears more common among supercentenarians than intense gym workouts." },
      ],
    },
    questions:[
      { id:"q3_1", para:"p2", text:"What does Dr Martinez say is the most notable finding about very old people?",
        options:[{l:"A",t:"Diet has almost no effect on lifespan"},{l:"B",t:"There is no single shared lifestyle pattern"},{l:"C",t:"Genetics explains most of their longevity"},{l:"D",t:"Stress is the main cause of early death"}],
        correct:"B", explanation:"Dr Martinez says 'the first thing you notice is that there is no single pattern.'" },
      { id:"q3_2", para:"p3", text:"What did Dr Martinez's most recent study show about living to 100?",
        options:[{l:"A",t:"Regular exercise was the single most important factor"},{l:"B",t:"Maintaining close friends greatly increases the chance"},{l:"C",t:"Living in rural areas extends life significantly"},{l:"D",t:"Avoiding tobacco was the biggest contributor"}],
        correct:"B", explanation:"The study found that 'people who maintained close friendships well into old age were significantly more likely to reach 100.'" },
      { id:"q3_3", para:"p4", text:"What does the article say about the role of genetics?",
        options:[{l:"A",t:"It controls 75% of how long we live"},{l:"B",t:"Scientists have found the specific genes involved"},{l:"C",t:"It accounts for roughly one quarter of lifespan"},{l:"D",t:"It matters more than all lifestyle choices combined"}],
        correct:"C", explanation:"'Roughly 25%' means about one quarter." },
      { id:"q3_4", para:"p5", text:"What is Dr Martinez's main point about diet and longevity?",
        options:[{l:"A",t:"The Mediterranean diet is the single best option"},{l:"B",t:"High-fish diets should generally be avoided"},{l:"C",t:"Unprocessed food in moderate portions is key"},{l:"D",t:"Diet is more important than any other factor"}],
        correct:"C", explanation:"Different diets all work, but they share 'a preference for unprocessed foods in moderate portions.'" },
      { id:"q3_5", para:"p5", text:"What kind of exercise does the article link to very long lives?",
        options:[{l:"A",t:"Intensive gym sessions multiple times a week"},{l:"B",t:"Swimming and yoga throughout adult life"},{l:"C",t:"Gentle everyday movement such as walking"},{l:"D",t:"Competitive sports well into old age"}],
        correct:"C", explanation:"'Gentle daily movement — walking, gardening, cycling short distances — appears more common among supercentenarians than intense gym workouts.'" },
    ],
  },

  part4: {
    instructions:"Five sentences have been removed from the article below. For each gap (1–5), choose the sentence from A–H that best fits. There are THREE extra sentences you do not need to use.",
    article:{
      title:"Urban Farming: Growing Food in the City",
      segments:[
        {t:"text",v:"Urban farming — the practice of growing food within city boundaries — is becoming increasingly popular across the world. "},
        {t:"gap",n:1},
        {t:"text",v:" In Tokyo, New York, and London, rooftop gardens and community allotments are appearing in unexpected places, transforming unused spaces into productive green areas.\n\nThe benefits of urban farming extend well beyond simply producing fresh food. "},
        {t:"gap",n:2},
        {t:"text",v:" Studies have consistently shown that spending time growing plants reduces stress and improves mental wellbeing. Many urban farmers describe their plots as peaceful retreats from hectic city life.\n\nHowever, urban farming is not without real challenges. Space is frequently limited, and city-centre land is often very expensive. "},
        {t:"gap",n:3},
        {t:"text",v:" For this reason, many growers have turned to vertical farming — growing crops on stacked shelves under artificial lighting — as a more space-efficient alternative.\n\nTechnology has come to play an increasingly important role. "},
        {t:"gap",n:4},
        {t:"text",v:" Sensors monitor soil moisture and automatically water plants only when needed, reducing water use by up to 70% compared to traditional methods.\n\nDespite these innovations, critics remain sceptical. They argue that urban farms can only ever supply a tiny fraction of a city's food requirements. "},
        {t:"gap",n:5},
        {t:"text",v:" Whether urban farming becomes truly significant will depend on how quickly these barriers of cost and scale are overcome."},
      ],
    },
    sentences:[
      {id:"A",text:"What is more, the social aspect of communal growing spaces can help bring isolated city residents together."},
      {id:"B",text:"Growing enough food to make a real difference would require far more land than cities can realistically provide."},
      {id:"C",text:"Creating these spaces can involve complex engineering solutions and very significant financial investment."},
      {id:"D",text:"Smart irrigation systems and data-driven techniques have transformed what is possible in a small urban area."},
      {id:"E",text:"In some cities, urban farming has become a meaningful way for residents to reconnect with their food sources."},
      {id:"F",text:"Many beginners find the learning curve involved in growing their own food considerably steeper than expected."},
      {id:"G",text:"As food prices continue to rise globally, more people are looking for ways to reduce their household grocery bills."},
      {id:"H",text:"The technology required to run these systems is rapidly becoming cheaper and more widely accessible."},
    ],
    answers:{1:"G",2:"A",3:"C",4:"D",5:"B"},
    explanations:{
      1:"G introduces rising food prices as the reason for urban farming's growing popularity.",
      2:"A extends the benefits beyond food production, introducing the social aspect.",
      3:"C explains what the challenge of limited, expensive space involves.",
      4:"D introduces smart irrigation and data-driven techniques.",
      5:"B gives the critics' specific argument — scale is the fundamental barrier.",
    },
  },

  part5: {
    instructions:"For each gap (21–26), choose the word (A, B, C or D) that best fits the text.",
    segments:[
      {t:"text",v:"Learning a new language as an adult can feel "},
      {t:"gap",n:1},
      {t:"text",v:" at first. Unlike young children, who absorb languages naturally, adults often "},
      {t:"gap",n:2},
      {t:"text",v:" with unfamiliar grammar rules and unusual sounds. However, research suggests that adult learners actually have several important "},
      {t:"gap",n:3},
      {t:"text",v:". We can follow complex explanations more easily, we have a larger first-language vocabulary to "},
      {t:"gap",n:4},
      {t:"text",v:" new words to, and we are generally more "},
      {t:"gap",n:5},
      {t:"text",v:" to study in a structured way. The key is to find a method that "},
      {t:"gap",n:6},
      {t:"text",v:" your personal learning style, and to practise every day — even just fifteen minutes."},
    ],
    gaps:[
      {id:"q5_1",n:1,opts:[{l:"A",w:"overwhelming"},{l:"B",w:"exciting"},{l:"C",w:"unnecessary"},{l:"D",w:"boring"}],correct:"A",hint:"Adjective for a difficult first impression",explanation:"'Overwhelming' fits — 'at first' implies initial difficulty."},
      {id:"q5_2",n:2,opts:[{l:"A",w:"struggle"},{l:"B",w:"deal"},{l:"C",w:"cope"},{l:"D",w:"manage"}],correct:"A",hint:"Verb + 'with' meaning to have difficulty",explanation:"'Struggle with' is the natural collocation for having difficulty with something."},
      {id:"q5_3",n:3,opts:[{l:"A",w:"advantages"},{l:"B",w:"skills"},{l:"C",w:"abilities"},{l:"D",w:"qualities"}],correct:"A",hint:"Noun: beneficial factors adults have over children",explanation:"'Advantages' means beneficial factors adults have that children don't."},
      {id:"q5_4",n:4,opts:[{l:"A",w:"compare"},{l:"B",w:"connect"},{l:"C",w:"link"},{l:"D",w:"relate"}],correct:"C",hint:"Verb: attach new words to existing knowledge",explanation:"'Link new words to' means attaching them to existing vocabulary."},
      {id:"q5_5",n:5,opts:[{l:"A",w:"motivated"},{l:"B",w:"willing"},{l:"C",w:"likely"},{l:"D",w:"able"}],correct:"B",hint:"Adjective: ready and prepared to do something",explanation:"'Willing to study' means ready and prepared to do it deliberately."},
      {id:"q5_6",n:6,opts:[{l:"A",w:"suits"},{l:"B",w:"matches"},{l:"C",w:"fits"},{l:"D",w:"follows"}],correct:"A",hint:"Verb meaning 'is appropriate for a person'",explanation:"'Suits your style' is the most idiomatic collocation."},
    ],
  },

  part6: {
    instructions:"For each gap (27–32), write ONE word which best completes the text. Use only one word per gap.",
    segments:[
      {t:"text",v:"Coffee is "},
      {t:"gap",n:1},
      {t:"text",v:" of the world's most popular beverages, consumed by billions every day. It "},
      {t:"gap",n:2},
      {t:"text",v:" first discovered in Ethiopia, where farmers noticed their goats became energetic after eating berries from a wild tree. The drink "},
      {t:"gap",n:3},
      {t:"text",v:" has changed considerably over the centuries — early drinkers simply chewed the raw berries. Coffee houses soon became important places "},
      {t:"gap",n:4},
      {t:"text",v:" writers, merchants, and philosophers met to exchange ideas. Today, "},
      {t:"gap",n:5},
      {t:"text",v:" than two billion cups are drunk worldwide every day. Despite its popularity, scientists have "},
      {t:"gap",n:6},
      {t:"text",v:" not reached agreement on whether regular coffee consumption is beneficial or harmful to health."},
    ],
    gaps:[
      {id:"q6_1",n:1,correct:"one",hint:"Think: number phrase (one of the...)",explanation:"'One of' is a fixed phrase."},
      {id:"q6_2",n:2,correct:"was",hint:"Think: past simple passive (it ___ discovered)",explanation:"'Was' completes 'it was first discovered.'"},
      {id:"q6_3",n:3,correct:"itself",hint:"Think: reflexive pronoun for emphasis",explanation:"'Itself' emphasises the drink as opposed to its culture or preparation."},
      {id:"q6_4",n:4,correct:"where",hint:"Think: relative adverb for a place",explanation:"'Where' is a relative adverb for places."},
      {id:"q6_5",n:5,correct:"more",hint:"Think: comparative (more than / fewer than)",explanation:"'More than two billion' means in excess of two billion."},
      {id:"q6_6",n:6,correct:"still",hint:"Think: adverb meaning 'up to now / not yet'",explanation:"'Still not reached' means they have not yet reached agreement even now."},
    ],
  },
};

export const ALL_QIDS = [
  ...EXAM_DATA.part1.questions.map(q=>({id:q.id,part:1})),
  ...EXAM_DATA.part2.questions.map(q=>({id:q.id,part:2})),
  ...EXAM_DATA.part3.questions.map(q=>({id:q.id,part:3})),
  ...[1,2,3,4,5].map(n=>({id:`q4_${n}`,part:4})),
  ...EXAM_DATA.part5.gaps.map(g=>({id:g.id,part:5})),
  ...EXAM_DATA.part6.gaps.map(g=>({id:g.id,part:6})),
];

export const DEFS = {
  longevity:"how long a person lives; a long life",
  gerontologist:"a scientist who studies old age and the ageing process",
  supercentenarian:"a person who is 110 years old or older",
  genetics:"the study of how characteristics are passed from parents to children",
  isolated:"alone and away from other people",
  memoir:"a book written by someone about their own life experiences",
  allotment:"a small area of land rented for growing vegetables",
  irrigation:"a system for supplying water to farmland",
  moderate:"not too much or too little; a reasonable amount",
  diversion:"an alternative route when the main road is closed",
  beverages:"drinks, especially ones that are not water",
};

export const PART_ICONS = ["📝","🔗","📖","✂️","🔤","✏️"];
export const PART_NAMES = ["Short Texts","Matching","Long Text","Gapped Text","Word Choice","Open Fill"];
