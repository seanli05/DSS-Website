# Editing the website's content

**All of the text on the site lives in this folder.** You shouldn't need to open
any code to change wording, links, photos, or lists. Find the page below, open the
file, edit the text between the quotes, and save.

Some content comes from **Airtable** instead of these files (projects, the exec
board, partner logos, events, the recruitment timeline) — see
[Things that live in Airtable](#things-that-live-in-airtable) at the bottom.

---

## Where everything is

| I want to change… | Edit this file |
|---|---|
| **Sign-up links** (application form, coffee chats, mailing list, DeCal application) | `site.json` → `links` |
| Contact email, social media links, nav bar links, footer text | `site.json` |
| **Home page** text, buttons, and photos | `home/page.json` |
| The four numbers on the home page (90+ projects, …) | `home/stats.json` |
| **About page** text, story, values | `about/page.json` |
| About → "Our Community" tiles (Big Little, House System, …) | `about/community-traditions.json` |
| About → scrolling photo strip | `about/community-photos.json` |
| **Committee pages** (`/acadev`, `/consulting`, `/social-good`): name, blurb, description, photos, lead, activities | `committees/committees.json` |
| Section headings shared by all committee pages ("What we do", "Join X this semester.") | `committees/page.json` |
| **Join page** text | `join/page.json` |
| Join → FAQ | `join/faq.json` |
| Join → interview resources | `join/interview-resources.json` |
| Join → "The Newbie Experience" | `join/newbie-experience.json` |
| **Partners page** text, process cards, project timeline stages | `partners/page.json` |
| Partners → "Ways to partner" cards (also the inquiry form's dropdown) | `partners/offerings.json` |
| **DeCal page** text and photos | `decal/page.json` |
| DeCal → student project carousel | `decal/student-projects.json` |
| **Contact page** text | `contact/page.json` |

Files ending in `-fallback.json` are backups that only show up when Airtable is
unavailable (for example, when running the site locally without the Airtable
key). You rarely need to edit them. `committees/projects-fallback.json` is
deliberately empty, so the project carousels hide rather than show made-up
projects; add real past projects there if you want a backup.

---

## Every semester

1. **`site.json` → `links`**: paste the new `application`, `coffeeChat`, and
   `decalApplication` form links. The short links `dssberkeley.org/apply` and
   `dssberkeley.org/coffeechat` follow automatically.
2. **`join/page.json`**: update the semester name ("Fall 2026"), tabling
   locations/times, and the DeCal slides link.
3. **Airtable → Recruitment Timeline**: replace last semester's events.
4. **Airtable → Exec Profiles**: update the board.
5. **`committees/committees.json`**: update each `lead` and `workCaption`
   ("Spring 2026 Consulting Committee Members") if the photo changed.
6. Photo captions that name a semester: `home/page.json` (`mission.photo.caption`)
   and `about/page.json` (`story.photo.caption`).
7. Rebuild the site so Airtable changes show up (see the main README → Deploying).

---

## Formatting text

Most text is plain. Two extras work in page and section `subtext`s, the About
page's story paragraphs and values, and the DeCal course descriptions/footnote:

| Write this | To get |
|---|---|
| `**Dwinelle and Wheeler**` | **Dwinelle and Wheeler** (bold) |
| `[DeCal slides](https://dssdecal.org/sp26/)` | a link (opens in a new tab if it leaves the site) |

**Placeholders.** In `committees/page.json`, `{committee}` is replaced with the
committee's name — `"Join {committee} this semester."` → "Join Acadev this semester."

**Paragraphs.** In committee `description`s, a blank line (`\n\n`) starts a new
paragraph. In lists like `paragraphs` or an FAQ `answer`, each item in the
`[ ... ]` is its own paragraph.

**Notes to yourself.** Start a description or body with a one-sentence note like
`"TODO: confirm with the Acadev lead. Real copy starts here..."` and the note is
hidden from visitors. The note must be **one sentence, end in a period, and
contain no other periods** (no "e.g.") — otherwise it hides the real text too.
A committee `lead` that starts with `TODO` hides the "Committee Lead" line.

**JSON rules** (the build fails if these are broken, which is a good thing — it
tells you which file and line):
- Text goes in `"double quotes"`. To use a double quote inside text, write `\"`
  or use curly quotes “like this”.
- Items in a list or object are separated by commas, with **no comma after the
  last one**.
- Use `null` (no quotes) for "nothing here", e.g. a photo that doesn't exist yet.

---

## Photos

1. **Keep the original** in `assets/photo-originals/<page>/` (same folder layout
   as below) so it can be re-cropped later.
2. **Make a web-sized copy** into `public/images/<page>/` with the photo script:

   ```bash
   npm run photo -- assets/photo-originals/home/new.jpg public/images/home/new.jpg
   # crop to an exact shape (4:3 here), keeping the bottom of the frame:
   npm run photo -- in.jpg public/images/committees/acadev/socials.jpg --width 1200 --height 900 --position bottom
   ```

   iPhone `.heic` files: convert first with `sips -s format jpeg in.heic --out in.jpg` (Mac).
3. **Point the content at it**: paths start at `public/`, so
   `public/images/home/new.jpg` is written `"/images/home/new.jpg"`.
4. **Always fill in the alt text** (`alt` / `imageAlt`) — a short description of
   the photo for screen readers.

`public/images/` is organized by page:

```
public/images/
  home/          home page photos
  about/         about page, including community/<tradition>/ photos
  committees/    acadev/, consulting/, social-good/
  join/          newbie-experience/
  decal/         course photos, student-projects/ screenshots
  partners/      fallback partner logos
```

**Recommended shapes** (the site crops to fill, so match these to avoid surprises):

| Where | Shape | Size |
|---|---|---|
| Committee hero (`heroImage`) — also the About page card | 3:2, subject centered with room above and below | 2560×1706 |
| Committee "What we do" photo (`workImage`) | 2:3 portrait or 3:2 landscape — set `workImageOrientation` to match | ~1400×2100 / 1800×1200 |
| Committee activity tiles | 4:3 | 1200×900 |
| Newbie Experience tiles | 5:3 | 1200×720 |
| DeCal course photos, Home "Two ways" panels | 4:3 | 1600×1200 |
| Community tiles (`cover.jpg`) | landscape | ~1600 wide |

A missing photo (`null`) shows a "Photo to come" placeholder at the right shape,
so the layout never breaks while you wait for one.

---

## Things that live in Airtable

These are edited in the DSS Airtable base, not here. Row order in Airtable's
**Grid view** is the order on the site — drag rows to reorder.

| Site section | Airtable table |
|---|---|
| Consulting & Social Good project carousels (+ the home page logo links) | Consulting Projects, Social Good Projects |
| Acadev "Client Projects" | Acadev Projects |
| About → Executive Board | Exec Profiles |
| About → Events We Host | External Events |
| Home & Partners → partner logo strip | Logowall |
| Join → Recruitment timeline | Recruitment Timeline |
| Partners → inquiry form submissions (the site *writes* here) | Partner Inquiries |

**Airtable edits don't appear until the site is rebuilt** — see the main
README → Deploying. Column-by-column details are in
[`docs/airtable.md`](../docs/airtable.md).
