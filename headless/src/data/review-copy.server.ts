/**
 * LOCAL REVIEW COPY — NOT APPROVED FOR PUBLICATION.
 *
 * Every string here is draft copy carried forward verbatim from
 * docs/phase-1/copy-deck.md and docs/phase-1/content-inventory.json. None of it
 * has client sign-off. Nothing in this file may be edited into new prose: it is a
 * transcript of existing drafts, not a place to write content.
 *
 * This module must only be reached through a dynamic import guarded by
 * `import.meta.env.DEV`, so the production bundle never contains it. That
 * boundary is asserted by scripts/verify-production.mjs.
 */
export interface ReviewCopy {
  readonly creatorCredit: string;
  readonly footerDescription: string;
  readonly home: {
    readonly definition: string;
    readonly editionHeading: string;
    readonly editionIntro: string;
    readonly closing: string;
  };
  readonly about: {
    readonly opening: string;
    readonly sections: readonly string[];
  };
  readonly editionOne: {
    readonly lead: string;
    readonly intro: string;
  };
  readonly events: { readonly intro: string };
  readonly press: { readonly intro: string };
  /** Working roster from the supplied brief. Not signed-off biography copy. */
  readonly designerRoster: readonly { readonly country: string; readonly designer: string; readonly note: string }[];
}

export const reviewCopy: ReviewCopy = {
  creatorCredit: 'Created by Shiri Achu.',
  footerDescription:
    'Explore the people, symbols and creative interpretations that connect this international cultural initiative.',
  home: {
    definition:
      'Created by Shiri Achu, The Pan-African Fabric is an international cultural initiative connecting designers, communities and cultural institutions through African symbols, textile, art, fashion, education and exchange.',
    editionHeading: 'Nine countries. A shared creative conversation.',
    editionIntro:
      "Discover the people and interpretations behind Edition One. Explore each country's contribution, meet its principal designer and follow the fabric from cultural source to finished garment.",
    closing:
      'Discover what comes next for The Pan-African Fabric and the communities shaping its journey.',
  },
  about: {
    opening:
      'The Pan-African Fabric connects artistic practice with cultural exchange. Created by Shiri Achu, it brings distinct African stories into conversation through textile, design and public participation.',
    sections: [
      'Why it matters',
      'From visual art to fabric',
      'Symbols and cultural integrity',
      'The creator',
      'How the initiative works',
    ],
  },
  editionOne: {
    lead: 'Nine countries. Five regions. One shared visual language.',
    intro:
      'Edition One brings together creative voices from Cameroon, Nigeria, Ghana, Ethiopia, Kenya, Egypt, Morocco, the Central African Republic and South Africa. Explore the designers, cultural sources and garment interpretations behind each contribution.',
  },
  events: {
    intro:
      'Trace The Pan-African Fabric through public programs, creative exchanges and presentations. Discover the next showcase and the moments that have shaped the initiative.',
  },
  press: {
    intro:
      'Find approved information, images and resources for coverage of The Pan-African Fabric. Please retain the captions, credits and usage terms supplied with each asset.',
  },
  designerRoster: [
    { country: 'cameroon', designer: 'Muks’ Couture', note: 'Confirm regional grouping; representative and competition/archive credits.' },
    { country: 'nigeria', designer: 'Goody’s Stitches', note: 'Approve creation story and completed-look imagery.' },
    { country: 'ghana', designer: 'Afua Sam — STUDIO D’MAXSI / The A Concept', note: 'Confirm preferred studio naming hierarchy.' },
    { country: 'ethiopia', designer: 'YYASMINA STAR', note: 'Selected representative in brief; METII and NATANLI remain competition archive participants.' },
    { country: 'kenya', designer: 'Amos Onyango — LAWY Afrik Foundation Limited', note: 'Confirm organization description and professional credit.' },
    { country: 'egypt', designer: 'MOJA Design Studio', note: 'Confirm designer contact, biography and completed looks.' },
    { country: 'morocco', designer: 'Naima El Messaoudi — Caftan Joujou', note: 'Confirm personal/studio-name order and garment cultural details.' },
    { country: 'central-african-republic', designer: 'Diana-Melissa Ngoumape', note: 'Clarify designer/model/representative roles and collaborators.' },
    { country: 'south-africa', designer: 'Fatima Barnes', note: 'Confirm professional affiliation and approved profile language.' },
  ],
};
