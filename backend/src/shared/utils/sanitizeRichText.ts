import sanitizeHtml from "sanitize-html";

// The admin panel writes a few fields with a rich-text editor (Quill) and the
// public site renders them with `dangerouslySetInnerHTML`. Stored HTML that is
// never checked is stored XSS: it runs on every visitor's browser, for as long
// as the row exists, with no attacker interaction needed.
//
// These fields are admin-authored, so the realistic path is a compromised or
// borrowed admin session turning one form submission into site-wide script
// execution. Sanitising on write means the database can only ever hold markup
// that is safe to render, so a mistake in the frontend cannot reintroduce the
// hole — and existing rows are cleaned the next time they are edited.
//
// Sanitising on the *server* is deliberate. A frontend sanitiser protects only
// the page that remembers to call it; this protects every consumer of the API.

const RICH_TEXT_POLICY: sanitizeHtml.IOptions = {
  // Formatting only. No <script>, <style>, <iframe>, <object>, <embed>,
  // <form>, <input> or <svg>, and no custom elements.
  allowedTags: [
    "p", "br", "span", "div",
    "b", "strong", "i", "em", "u", "s", "strike", "sub", "sup",
    "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "blockquote", "pre", "code",
    "a",
  ],

  // Every attribute not named here is dropped, which is what removes the
  // entire `on*` event-handler family (onerror, onclick, onload, ...) and
  // `style`, whose url() and expression() forms have their own history.
  allowedAttributes: {
    a: ["href", "title"],
    "*": ["class"],
  },

  // An href may only be a link a browser can follow harmlessly. `javascript:`
  // and `data:` are absent by construction, not by blacklist.
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesAppliedToAttributes: ["href"],
  allowProtocolRelative: false,

  // Quill emits class names like "ql-align-center"; anything else an editor
  // invents is discarded rather than trusted.
  allowedClasses: {
    "*": [
      "ql-align-center", "ql-align-right", "ql-align-justify",
      "ql-indent-1", "ql-indent-2", "ql-indent-3",
      "ql-syntax",
    ],
  },

  // Drop the *contents* of a disallowed tag too. Without this, the text inside
  // a stripped <script> would survive as visible page text.
  nonTextTags: ["script", "style", "textarea", "option", "noscript", "title"],

  // Untrusted links should not be able to reach back at the opening page.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer nofollow",
      target: "_blank",
    }),
  },

  disallowedTagsMode: "discard",
};

/** Admin-authored rich text, reduced to markup that is safe to render. */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, RICH_TEXT_POLICY);
}

/**
 * Strips markup entirely, leaving the readable text. For fields that are
 * displayed as plain strings and have no business carrying tags.
 */
export function stripHtml(value: string): string {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}
