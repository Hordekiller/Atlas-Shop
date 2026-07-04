import sanitizeHtml from "sanitize-html";

const defaultOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "b", "i", "u", "a", "p", "br", "ul", "ol", "li", "strong", "em",
    "h1", "h2", "h3", "h4", "h5", "h6", "img", "blockquote",
    "span", "div", "pre", "code", "hr", "sub", "sup", "small", "mark", "del", "ins",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt"],
    "*": ["style", "class", "id", "dir", "lang", "title"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: "nofollow noopener noreferrer",
        target: "_blank",
      },
    }),
  },
};

function sanitizeHTML(html: string): string {
  return sanitizeHtml(html, defaultOptions);
}

export { sanitizeHTML };
