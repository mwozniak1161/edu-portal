# Design System Strategy: The Eduportal

## 1. Overview & Creative North Star: "Eduportal"
This design system moves beyond the utility of a standard Educational ERP to create **Eduportal**. An Eduportal is a place of craft, focus, and intentionality. In an industry often cluttered with dense grids and frantic "dashboarding," this system prioritizes **intellectual headspace**.

We achieve this through "Organic Brutalism"—a style that uses high-contrast typography and sharp, flat geometry, but softens the blow with generous white space and a sophisticated tonal palette. The UI should feel less like a "software tool" and more like a high-end, bespoke digital stationery set. We are not just managing data; we are curating an educational legacy.

---

## 2. Colors & Tonal Architecture
The palette is rooted in the depth of `primary` (#3525cd) and the clarity of `surface_container_lowest` (#ffffff).

### The "No-Line" Rule
Standard ERPs rely on 1px borders to separate every cell and section. **We prohibit this.** Boundaries must be defined through background color shifts. Use `surface_container_low` (#eff4ff) to define a sidebar, and `surface_container_lowest` (#ffffff) for the main canvas. If a visual break is needed, use a 4px vertical "Ink Bar" of `primary` rather than a box border.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested paper sheets:
- **Base Level:** `background` (#f8f9ff)
- **Primary Workspaces:** `surface_container_low` (#eff4ff)
- **Active Cards/Modules:** `surface_container_lowest` (#ffffff)
- **Interaction Overlays:** `surface_bright` (#f8f9ff) with high-end glassmorphism.

### The Glass & Gradient Rule
To prevent the "Flat UI" from feeling "Dead UI," apply a subtle **"Ink Bleed" Gradient** on primary CTAs: a linear transition from `primary` (#3525cd) to `primary_container` (#4f46e5) at a 135-degree angle. Floating menus must use a `surface_container_lowest` background with a 12px backdrop-blur and 85% opacity to maintain an airy, editorial feel.

---

## 3. Typography: Editorial Precision
We utilize **Geist** for its mathematical purity and **Geist Mono** for all data-driven values.

- **The Data/Value Distinction:** All labels (e.g., "Student ID") use `label-md` in Geist Sans. All actual data (e.g., "ID-9920") must use Geist Mono. This creates a clear visual "texture" difference between the interface and the information.
- **Display & Headline:** Use `display-md` for high-level stats (e.g., Enrollment Totals). These should be tracked-in slightly (-0.02em) to feel authoritative and "editorial."
- **Body:** `body-md` is our workhorse. Ensure a line height of at least 1.6 to maintain the "generous whitespace" requirement.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are largely replaced by **Tonal Stacking**.

- **The Layering Principle:** Depth is achieved by placing a "Bright" surface on a "Low" surface. For instance, a `surface_container_lowest` card sitting on a `surface_container_low` background creates a natural lift.
- **Ambient Shadows:** When a modal or popover must float, use a "Tinted Shadow." Instead of `#000000`, use a 6% opacity of `on_surface` (#0b1c30) with a 32px blur and 16px offset. This mimics natural light passing through a classroom window.
- **The "Ghost Border" Fallback:** If a border is required for accessibility in high-density data tables, use `outline_variant` (#c7c4d8) at **20% opacity**. Never use 100% opaque lines; they "shackle" the data.

---

## 5. Components

### Buttons & Interaction
- **Primary:** High-contrast `primary` (#3525cd) with `on_primary` (#ffffff) text. Use `md` (0.375rem) corner radius.
- **Secondary:** `surface_container_high` background with `primary` text. No border.
- **States:** On hover, primary buttons should shift to `primary_container`. Avoid "lifting" animations; use color shifts to maintain the Flat UI aesthetic.

### Data Inputs (The Eduportal Field)
- **Default State:** A `surface_container_lowest` background with a subtle 1px `outline_variant` at 20%.
- **Focus State:** The border opacity jumps to 100% with a 2px "Ink Bar" (primary color) on the left edge of the input.

### Cards & Lists
- **Rule:** Absolute prohibition of divider lines between list items. Use 16px of `body-lg` vertical spacing or a alternating subtle tint (`surface_container_low`) to distinguish rows.
- **Header Cards:** Use `headline-sm` with a large 48px top-padding to give the title "room to breathe."

### Additional Component: The "Context Rail"
A slim, 48px wide vertical bar on the far right of the screen using `surface_container_highest`. It houses secondary "Eduportal" tools (Calendar, Calculator, Quick Notes) to keep the main workspace uncluttered.

---

## 6. Do's and Don'ts

### Do:
- **Embrace Asymmetry:** Align primary headers to the left, but place "Action" buttons in non-traditional spots (like the bottom-left of a header block) to create a custom, high-end feel.
- **Use Mono for Numbers:** Always use Geist Mono for grades, dates, and currency. It implies precision and "ERP-grade" reliability.
- **Scale with Intent:** If a section is important, don't make it bold—make it larger and give it more surrounding whitespace.

### Don't:
- **Don't use "Box-in-Box" design:** Avoid putting a white card inside a white section with a border. Use a color shift (Slate-50 to White) instead.
- **Don't use pure black:** Use `on_surface` (#0b1c30) for text to maintain a softer, more premium contrast.
- **Don't crowd the margins:** If a component feels "stuck" to the edge of its container, increase the padding by 8px. In this system, space is a luxury.