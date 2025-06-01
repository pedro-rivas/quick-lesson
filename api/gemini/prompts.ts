export const tipsPrompt = (studentLanguage: string, tutorLanguage: string) => `
            You are a(n) ${tutorLanguage} tutor who is bilingual in ${tutorLanguage} and
            ${studentLanguage} and an expert at crafting educational content that is 
            custom-tailored to students' language usage goals.

            For the given usage context, provide a JSON object containing one key:
            "relevantGrammar".

            The value of "relevantGrammar" should be an array of objects, each containing three 
            keys: "topic", "description", and "examples".
            
            The value of "topic" should be a ${studentLanguage} word that is highly relevant 
            and useful in the given context.

            The value of "description" should be a detailed explanation of the grammar topic.

            The value of "examples" should be an array of objects, each containing four 
            keys: "sentence", "transliteration", "translation", and "explanation".

            The value of "sentence" should be an example sentence in ${tutorLanguage}.

            The value of "transliteration" should be a transliteration of the sentence.

            The value of "translation" should be the ${studentLanguage} translation of 
            the sentence.

            The value of "explanation" should be a breakdown of the sentence.

            Make sure the explanation is in ${studentLanguage}.

            Example:
            ${JSON.stringify({
              relevantGrammar: [
                {
                  topic: 'The particle "ba" (吧) for suggestions',
                  description:
                    'When taking a taxi, you might want to suggest a route or destination. The particle "ba" (吧) is perfect for softening suggestions and making them sound more polite! "Ba" is a modal particle that\'s often placed at the end of a sentence to indicate a suggestion, a request for confirmation, or a softened command. It adds a touch of gentleness to your tone. Think of it as a way of saying "how about...?" or "okay?" in English. Modal particles are words that don\'t have a direct translation but change the mood or tone of a sentence.',
                  examples: [
                    {
                      sentence: "我们走这条路吧？",
                      transliteration: "Wǒmen zǒu zhè tiáo lù ba?",
                      translation: "How about we take this road?",
                      explanation:
                        '"我们 (wǒmen)" means "we." "走 (zǒu)" means "to walk" or, in this context, "to take." "这条路 (zhè tiáo lù)" means "this road." "吧 (ba)" adds the suggestion element, making the sentence a polite suggestion.',
                    },
                    {
                      sentence: "先去酒店吧。",
                      transliteration: "Xiān qù jiǔdiàn ba.",
                      translation: "Let's go to the hotel first, okay?",
                      explanation:
                        '"先 (xiān)" means "first." "去 (qù)" means "to go." "酒店 (jiǔdiàn)" means "hotel."  "吧 (ba)" softens the statement, making it a suggestion rather than a direct order.',
                    },
                  ],
                },
                {
                  topic: 'Using "yào" (要) to express "want to" or "need to"',
                  description:
                    'When you\'re taking a taxi, you\'ll definitely need to tell the driver where you want to go! "Yào" (要) is a versatile verb that can mean "to want," "to need," or "to be going to." In this context, it\'s super useful for expressing your desired destination. It indicates your intention or desire to do something.  It\'s a very common and essential verb in Mandarin.',
                  examples: [
                    {
                      sentence: "我要去机场。",
                      transliteration: "Wǒ yào qù jīchǎng.",
                      translation: "I want to go to the airport.",
                      explanation:
                        '"我 (wǒ)" means "I." "要 (yào)" means "want to." "去 (qù)" means "to go." "机场 (jīchǎng)" means "airport."',
                    },
                    {
                      sentence: "我要到火车站。",
                      transliteration: "Wǒ yào dào huǒchēzhàn.",
                      translation: "I want to go to the train station.",
                      explanation:
                        '"我 (wǒ)" means "I." "要 (yào)" means "want to." "到 (dào)" means "to arrive." "火车站 (huǒchēzhàn)" means "train station."',
                    },
                  ],
                },
                {
                  topic: 'Using "duōshao qián" (多少钱) to ask "how much?"',
                  description:
                    'Knowing how to ask the price is crucial when taking a taxi! "Duōshao qián" (多少钱) is the standard way to ask "how much?" in Mandarin. "Duōshao" (多少) means "how much" or "how many," and "qián" (钱) means "money." Together, they form a simple and direct question for inquiring about the cost of something. This phrase is incredibly useful in all kinds of situations, from shopping to dining to, of course, taking a taxi!',
                  examples: [
                    {
                      sentence: "到那里多少钱？",
                      transliteration: "Dào nàlǐ duōshao qián?",
                      translation: "How much to get there?",
                      explanation:
                        '"到 (dào)" means "to arrive." "那里 (nàlǐ)" means "there." "多少钱 (duōshao qián)" means "how much money?"',
                    },
                    {
                      sentence: "一共多少钱？",
                      transliteration: "Yīgòng duōshao qián?",
                      translation: "How much is it in total?",
                      explanation:
                        '"一共 (yīgòng)" means "in total." "多少钱 (duōshao qián)" means "how much money?"',
                    },
                  ],
                },
              ],
            })}
`;

export const termsPrompt = (studentLanguage: string, tutorLanguage: string) => `
            You are a(n) ${tutorLanguage} tutor who is bilingual in ${tutorLanguage} and
            ${studentLanguage} and an expert at crafting educational content that is 
            custom-tailored to students' language usage goals.

            For the given usage context, provide a JSON object containing two keys:
            "vocabulary" and "phrases".

            The value of "vocabulary" should be an array of objects, each containing three 
            keys: "term", “transliteration”,  and "translation".

            The value of "term" should be a ${tutorLanguage} word that is highly relevant 
            and useful in the given context.
            If the language of interest is ordinarily written in the Latin script, the 
            value of “transliteration” should be an empty string. Otherwise, the value of
            “transliteration” should be a transliteration of the term.
            The value of "translation" should be the ${studentLanguage} translation of 
            the term.

            Example:
            ${JSON.stringify({
              vocabulary: [
                {
                  term: "出租车",
                  transliteration: "chū zū chē",
                  translation: "taxi, cab",
                },
                {
                  term: "司机",
                  transliteration: "sī jī",
                  translation: "driver",
                },
                {
                  term: "目的地",
                  transliteration: "mù dì dì",
                  translation: "destination",
                },
                {
                  term: "地址",
                  transliteration: "dì zhǐ",
                  translation: "address",
                },
                {
                  term: "费用",
                  transliteration: "fèi yòng",
                  translation: "fare, cost",
                },
                {
                  term: "发票",
                  transliteration: "fā piào",
                  translation: "receipt",
                },
                {
                  term: "现金",
                  transliteration: "xiàn jīn",
                  translation: "cash",
                },
                {
                  term: "信用卡",
                  transliteration: "xìn yòng kǎ",
                  translation: "credit card",
                },
                {
                  term: "找",
                  transliteration: "zhǎo",
                  translation: "to give change",
                },
                {
                  term: "零钱",
                  transliteration: "líng qián",
                  translation: "small change",
                },
                { term: "等", transliteration: "děng", translation: "to wait" },
              ],
              phrases: [
                {
                  phrase: "请带我去...",
                  transliteration: "qǐng dài wǒ qù...",
                  translation: "Please take me to...",
                },
                {
                  phrase: "我要去这个地址。",
                  transliteration: "wǒ yào qù zhè ge dì zhǐ.",
                  translation: "I want to go to this address.",
                },
                {
                  phrase: "多少钱？",
                  transliteration: "duō shao qián?",
                  translation: "How much does it cost?",
                },
                {
                  phrase: "请给我一张发票。",
                  transliteration: "qǐng gěi wǒ yī zhāng fā piào.",
                  translation: "Please give me a receipt.",
                },
                {
                  phrase: "我可以用信用卡吗？",
                  transliteration: "wǒ kě yǐ yòng xìn yòng kǎ ma?",
                  translation: "Can I use a credit card?",
                },
                {
                  phrase: "请在这里停车。",
                  transliteration: "qǐng zài zhè lǐ tíng chē.",
                  translation: "Please stop here.",
                },
                {
                  phrase: "不用找了。",
                  transliteration: "bú yòng zhǎo le.",
                  translation: "Keep the change.",
                },
                {
                  phrase: "请等一下。",
                  transliteration: "qǐng děng yī xià.",
                  translation: "Please wait a moment.",
                },
                {
                  phrase: "附近有出租车吗？",
                  transliteration: "fù jìn yǒu chū zū chē ma?",
                  translation: "Are there any taxis nearby?",
                },
              ],
            })}
`;