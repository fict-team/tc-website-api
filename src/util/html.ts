import sanitize from 'sanitize-html';

// Format that Telegram supports
// 11.03.2020
// Bot API 4.6
const getTelegramOptions = () => ({
  allowedTags: [
    'b', 'strong',        // bold
    'i', 'em',            // italic
    'u', 'ins',           // underlined
    's','strike', 'del',  // strikethrough
    'a',                  // link
    'code',               // inline code
    'pre',                // code block
  ],
  allowedAttributes: {
    a: ['href'],
    code: ['class'],
    pre: ['class'],
  },
  transformTags: {
    ['h1']: 'b',
    'img': null,
  }
});

export const telegramSanitize = (html: string): { images: string[], html: string } => { 
  const images = [];
  const options = getTelegramOptions();

  options.transformTags.img = (_, { src }) => {
    if (src) { images.push(src); }
    return { type: 'img' };
  };

  const sanitizedHtml = sanitize(html, options); 
  return {
    images,
    html: sanitizedHtml,
  };
};
