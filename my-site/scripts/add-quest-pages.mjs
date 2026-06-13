import fs from 'fs';

const pagesPath = new URL('../server/data/wiki/pages.json', import.meta.url).pathname.replace(/^\//, '');

const data = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));

function page(slug, title, summary, icon, tags, sections, requires = null) {
  return { slug, title, summary, icon, tags, requires, bosses: [], items: [], sections };
}

function section(id, title, md, requires = null) {
  return { id, title, requires, bossId: '', itemId: '', contentMarkdown: md };
}

// Map questId → title so we can embed questName in requirements
const QUEST_TITLES = {
  0: 'A Mysterious New Friend',
  1: 'Find an Old Friend',
  2: 'Explore the Ruins',
  3: 'Lost Valley',
  5: 'The Order',
  8: 'The Lost Valley',
  12: 'The First Sacred Rite',
  13: 'The Second Sacred Rite',
  14: 'The Third Sacred Rite',
  15: 'The Dark Path',
  17: 'Desperation',
  18: 'Moneybaggs',
  19: 'Prison Break',
  26: 'Darkness in its Prime',
  27: 'New Dawn',
  29: 'Brothers?',
  33: 'The Sewers',
  34: 'Gathering',
  35: "Let's Get Started",
  38: 'Dream?',
  1000: 'Just a Dream',
  1001: 'Journey to Servitude',
};

function questReq(questId, status = 'finished') {
  return { type: 'quest', questId, questName: QUEST_TITLES[questId] || `Quest ${questId}`, status };
}

const questPages = [
  page(
    'quest-35', "Let's Get Started",
    "Your introduction to Matrix — a welcome from an old wanderer and a first look at the world.",
    '🏁', ['starter', 'quest'],
    [
      section('overview', 'Overview',
        `You arrive in Matrix knowing very little. An old wanderer named **Old Crash** greets you at spawn and gives you your bearings.

> *"Ah you're finally awake. Welcome to Matrix!"*

He'll walk you through the basics and point you toward your first real adventure.`
      )
    ]
  ),

  page(
    'quest-0', 'A Mysterious New Friend',
    'A chance encounter leads you to someone unusual — someone who claims to be far more than they appear.',
    '📜', ['main-story', 'crowley', 'quest'],
    [
      section('overview', 'Overview',
        `While exploring, you come across a mysterious figure who introduces himself as **Crowley**.

> *"Why, I'm Crowley. Long story short I'm what you might call... an all powerful being — trapped inside this body."*

He speaks of someone named **Crash**, and of a binding that keeps him imprisoned. Though cryptic, he asks for your help.`
      )
    ]
  ),

  page(
    'quest-1', 'Find an Old Friend',
    "Crowley reaches out again, asking you to seek out an old contact called Flames.",
    '📜', ['main-story', 'crowley', 'quest'],
    [
      section('overview', 'Overview',
        `Crowley's projection finds you once more. Despite being bound to a location, he still has access to his powers — just enough to send you a message.

> *"Turns out, the spell binding me to this body also bound me to that location... I'm still able to do spells, which is how you're able to see my projection."*

Your task: find **Flames** and get a history lesson. What you learn there sets the rest of the journey in motion.`
      )
    ],
    questReq(0)
  ),

  page(
    'quest-2', 'Explore the Ruins',
    'With new knowledge from Flames, you head into ancient ruins in search of answers.',
    '🗺️', ['main-story', 'crowley', 'quest'],
    [
      section('overview', 'Overview',
        `> *"How'd the chat with Flames go? Wonderful — perhaps we'll defeat the Realixes with knowledge!"*

The ruins hold clues about the Realixes and what Crowley is up against. Navigate carefully — not everything inside is still.`
      )
    ],
    questReq(1)
  ),

  page(
    'quest-3', 'Lost Valley',
    'The trail leads deeper into uncharted territory.',
    '🌄', ['main-story', 'crowley', 'quest'],
    [
      section('overview', 'Overview',
        `> *"Readyyyyy? :D Let's GOOOOOOO"*

The mood is high as your group pushes into the Lost Valley. What you find there sends things in a new direction entirely.`
      )
    ],
    questReq(2)
  ),

  page(
    'quest-8', 'The Lost Valley',
    "Someone — or something — is waiting in the valley, and they are not happy to see you.",
    '🗺️', ['main-story', 'quest'],
    [
      section('overview', 'Overview',
        `> *"What part of 'Leave now' did you not understand?"*
> *"You know who I am."*

Not everyone here is a stranger. Press forward and uncover what this valley is hiding.`
      )
    ],
    questReq(2)
  ),

  page(
    'quest-5', 'The Order',
    'You encounter the Order — a faction long cut off from the rest of the world.',
    '⚔️', ['main-story', 'order', 'quest'],
    [
      section('overview', 'Overview',
        `> *"Well look who showed up."*
> *"Ignore him — he's kind of a buzzkill. His son's lost all hope."*

The Order has been waiting. Their situation is grim, but they may be the allies you need.`
      )
    ]
  ),

  page(
    'quest-12', 'The First Sacred Rite',
    'Ancient trials overseen by a keeper of old knowledge. The first rite begins here.',
    '🕯️', ['sacred-rites', 'quest'],
    [
      section('overview', 'Overview',
        `> *"Ah, so you wish to complete the first sacred rite? Please, come closer — let me speaketh you the knowledge."*

Listen carefully. The keeper does not repeat herself.`
      )
    ]
  ),

  page(
    'quest-13', 'The Second Sacred Rite',
    'The trials grow more complex. Your progress is acknowledged, but greater challenges await.',
    '🕯️', ['sacred-rites', 'quest'],
    [
      section('overview', 'Overview',
        `> *"You are well on your way. The next trials may prove to be more challenging in different ways."*

> *"Well, the first trial was fairly simple. It's what I do best."*

Confidence carries you into the second rite — whether or not it should.`
      )
    ],
    questReq(12)
  ),

  page(
    'quest-14', 'The Third Sacred Rite',
    'The final rite demands everything. What comes after is not what you expected.',
    '🕯️', ['sacred-rites', 'quest'],
    [
      section('overview', 'Overview',
        `> *"I am proud of you. You have yet to take a bite from the forbidden fruit."*

> *"...yet?"*

The keeper's words carry a warning. Completing the third rite opens a door you cannot close.`
      )
    ],
    questReq(13)
  ),

  page(
    'quest-15', 'The Dark Path',
    'The consequences of the sacred rites become real. This is where choices matter most.',
    '🌑', ['sacred-rites', 'quest'],
    [
      section('overview', 'Overview',
        `What the keeper called the "forbidden fruit" is no longer a metaphor.

The dark path is not for everyone — but you're already on it.`
      )
    ],
    questReq(14)
  ),

  page(
    'quest-17', 'Desperation',
    "Someone is running out of time and you may be their last hope.",
    '💊', ['mystery', 'quest'],
    [
      section('overview', 'Overview',
        `> *"Hm, what do you want? Didn't I already tell you I'm busy?"*
> *"Isn't everyone on the planet dying, just at a different rate?"*

> *"Please — you have to help me. I think I'm dying."*

Not everyone will take you seriously. Find someone who will.`
      )
    ]
  ),

  page(
    'quest-18', 'Moneybaggs',
    'A rough journey leaves you worse for wear. Something broke — but what?',
    '💰', ['mystery', 'quest'],
    [
      section('overview', 'Overview',
        `> *"So... how was your journey? By the looks of you, not well."*

> *"All I know is when I went down there and talked to him he broke."*

The consequences of what happened are beginning to surface.`
      )
    ],
    questReq(17)
  ),

  page(
    'quest-19', 'Prison Break',
    'An unlikely proposition from a fellow prisoner — a plan to escape.',
    '🔒', ['mystery', 'quest'],
    [
      section('overview', 'Overview',
        `> *"Psst, hey kid. Listen — I've got a way to bust us both out of this joint."*

> *"Uhh, what if I'd like to serve my time like a good citizen?"*

A classic jailbreak scenario. Cooperate — or don't.`
      )
    ]
  ),

  page(
    'quest-26', 'Darkness in its Prime',
    'Facing forces that will stop at nothing, you must weigh the cost of your convictions.',
    '🌒', ['guild', 'main-story', 'quest'],
    [
      section('overview', 'Overview',
        `> *"What's it gonna be, kid? Are you really going to risk your quest to save the..."*

> *"Okay — but torturing for answers isn't right either."*

The stakes are rising, and so are the moral choices.`
      )
    ]
  ),

  page(
    'quest-27', 'New Dawn',
    'Rescued and regrouping aboard a strange ship, the path ahead starts to take shape.',
    '🌅', ['guild', 'main-story', 'quest'],
    [
      section('overview', 'Overview',
        `> *"Relax — you're safe now. You're on our ship. We rescued you and your friends from that..."*

> *"What the—"*

A new chapter begins from an unexpected vantage point.`
      )
    ],
    questReq(26)
  ),

  page(
    'quest-29', 'Brothers?',
    'A guild with deep roots — and a nagging sense that you have been here before.',
    '🏛️', ['guild', 'main-story', 'quest'],
    [
      section('overview', 'Overview',
        `> *"You've actually been here many times. This is your Adventurers Guild!"*

> *"Wow — this place is incredible."*

The guild feels familiar in ways you can't quite explain. Something happened here, and the answers are close.`
      )
    ],
    questReq(27)
  ),

  page(
    'quest-33', 'The Sewers',
    'Pam and Prime have a monster problem beneath the city. Time to investigate.',
    '🐀', ['guild', 'quest'],
    [
      section('overview', 'Overview',
        `> *"Good afternoon. Yes — Prime mentioned you have a problem with monsters?"*

A straightforward task on the surface. Clear out whatever is lurking in the sewers — or try to.`
      )
    ],
    questReq(29)
  ),

  page(
    'quest-34', 'Gathering',
    'Regrouping and refocusing — the guild turns its attention back to the bigger picture.',
    '📋', ['guild', 'quest'],
    [
      section('overview', 'Overview',
        `> *"Indeed. I think it's high time we get back on target."*

> *"Well, the future certainly is interesting."*

With a clearer mission in mind, the guild readies itself for what comes next.`
      )
    ],
    questReq(29)
  ),

  page(
    'quest-38', 'Dream?',
    'A glimpse of something that should not exist — a new dimension, and Crowley wants answers.',
    '✨', ['dream', 'realix', 'quest'],
    [
      section('overview', 'Overview',
        `> *"Crowley... I don't know how to explain what I just witnessed."*
> *"A new dimension you say? Do you think you might've discovered one of the Realix's domains?"*

What you experienced defies explanation. Crowley is intrigued — and alarmed.`
      )
    ]
  ),

  page(
    'quest-1000', 'Just a Dream',
    "Crowley is furious and skeptical. But what you saw was real.",
    '💤', ['dream', 'realix', 'quest'],
    [
      section('overview', 'Overview',
        `> *"This is bloody ridiculous. What kind of fool do you take me for?"*
> *"Have you tried just getting a permit? How hard is it?"*

Crowley's anger may be covering for something else. The events you witnessed are more real than anyone wants to admit.`
      )
    ],
    questReq(38)
  ),

  page(
    'quest-1001', 'Journey to Servitude',
    'The end of a long road — but Barlion stands in the way.',
    '🔮', ['dream', 'realix', 'quest'],
    [
      section('overview', 'Overview',
        `> *"Crowley, we're almost done. Long story short — I have to become..."*
> *"Oh don't you know? Barlion is working on something. You'll have to come back later."*

The finish line is in sight, but the path is never straightforward.`
      )
    ],
    questReq(1000)
  ),
];

// Remove any stale quest pages then add fresh ones
data.pages = data.pages.filter(p => !p.slug.startsWith('quest-'));
data.pages.push(...questPages);

fs.writeFileSync(pagesPath, JSON.stringify(data, null, 2));
console.log(`Written ${questPages.length} quest pages. Total: ${data.pages.length}`);
