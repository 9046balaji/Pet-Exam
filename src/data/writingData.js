/* ════════════════════════════════════════════════════════════════
   WRITING DATA — Cambridge B1 PET Writing Paper
════════════════════════════════════════════════════════════════ */

export const WRITING_TASKS = {
  part1: {
    email: {
      sender: "Alex",
      avatarInitials: "AJ",
      date: "Tuesday, 3 June",
      time: "14:22",
      subject: "Join my new photography club! 📷",
      body: [
        { id: "p1", text: "Hi there! How are you? I hope you're having a great week." },
        { id: "p2", text: "I've just started a new photography club and I'd love you to join us! We meet every week to share photos, give feedback and go on photography walks together." },
        { id: "p3", text: "I think you'd be perfect for the club because you always take such amazing pictures. What kind of photography do you enjoy most?" },
        { id: "p4", text: "We're planning our first meeting soon — which day would work best for you? Also, don't worry if you don't have much equipment — let me know what you have and I can help." },
        { id: "p5", text: "Hope to hear from you soon! Alex 😊" },
      ],
      notes: [
        { id: 1, text: "Say yes!", anchor: "p2", color: "#FBBF24" },
        { id: 2, text: "Explain what kind of photography you like", anchor: "p3", color: "#F59E0B" },
        { id: 3, text: "Suggest a day to meet", anchor: "p4", color: "#FBBF24" },
        { id: 4, text: "Ask about equipment needed", anchor: "p4", color: "#F59E0B" },
      ],
    },
    modelAnswer: `Hi Alex,\n\nThanks so much for your email — what a brilliant idea! I'd absolutely love to join your photography club.\n\nI'm really into landscape and nature photography. There's nothing better than capturing a beautiful sunset or an interesting insect in a garden!\n\nHow about we meet on Saturday? That works best for me as I'm free all day. I could also come on Thursday evening if that's better for everyone.\n\nBy the way, what equipment do we need? I have a basic digital camera but I'm not sure if that's enough. Do I need a tripod or any special lenses?\n\nCan't wait to hear more — speak soon!\n\nSophie`,
  },
  part2: {
    article: {
      prompt: "Write an article for a student magazine about the best way to learn a new language. Give your opinion and reasons.",
      tags: ["semi-formal", "opinion", "3 paragraphs"],
      modelAnswer: `Learning a new language is one of the most rewarding challenges you can take on — but what's the best way to do it?\n\nIn my opinion, the most effective method is immersion. By surrounding yourself with the language every day — through films, music, podcasts and conversations with native speakers — you start to think and feel in that language naturally. Of course, studying grammar and vocabulary is also important, but it should support real communication, not replace it.\n\nPersonally, I believe that making mistakes is essential. Many learners are afraid of speaking because they fear getting things wrong. But native speakers are usually very patient and encouraging. The more you practise speaking, the faster you improve.\n\nTo sum up, the best approach combines structured study with plenty of real-world practice. Find something in the language you love — a TV show, a song, a book — and enjoy the journey. Language learning is not a race; it's an adventure!`,
    },
    story: {
      openingSentence: "I opened the old box and could not believe what I found inside.",
      tags: ["narrative", "past tense", "3 paragraphs"],
      modelAnswer: `I opened the old box and could not believe what I found inside. There, wrapped carefully in faded yellow cloth, was a small golden compass. It was covered in strange symbols I had never seen before, and the needle was spinning wildly — even though there was no wind.\n\nSuddenly, the compass stopped moving. It was pointing directly at the old painting on the wall — a landscape of mountains and forests I had always assumed was just decoration. My heart was racing as I lifted the painting and discovered a small wooden door hidden behind it. I couldn't believe my eyes.\n\nFrom that day on, nothing in my life was ever the same. The door led to a secret room filled with maps, journals and photographs going back hundreds of years. It turned out that my family had been keeping a remarkable secret — and now it was my turn to continue the story.`,
    },
  },
};

export const PHRASE_BANKS = {
  email: {
    Greetings: ["Hi [Name],", "Hey [Name]!", "Dear [Name],"],
    "Opening lines": ["Thanks for your email!", "Great to hear from you!", "I was so happy to get your message!"],
    "Responding to news": ["That sounds amazing!", "What great news!", "I'm so glad to hear that!"],
    "Asking questions": ["What do you think about…?", "Have you ever tried…?", "Can you tell me more about…?"],
    "Closing lines": ["Hope to hear from you soon!", "Can't wait to see you!", "Take care and write back soon!"],
  },
  article: {
    Introduction: ["In my opinion,", "Personally, I think", "Many people believe that"],
    Opinions: ["It seems to me that", "I am convinced that", "From my point of view,"],
    Examples: ["For example,", "For instance,", "A good example of this is"],
    Contrast: ["However,", "On the other hand,", "Despite this,"],
    Conclusion: ["To sum up,", "All in all,", "In conclusion,"],
  },
  story: {
    "Scene-setting": ["It was a dark and stormy night.", "The street was completely empty.", "Everything was unusually quiet."],
    Action: ["Suddenly,", "Without warning,", "At that exact moment,"],
    Feelings: ["I was terrified.", "I couldn't believe my eyes.", "My heart was racing."],
    "Time transitions": ["A few hours later,", "The next morning,", "Just as I was about to leave,"],
    Ending: ["From that day on,", "It turned out that", "I will never forget"],
  },
};
