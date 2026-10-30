# Publications Layout Design

[publications-layout.html](publications-layout.html) is the approved interaction reference saved
before implementation. It covers:

- the grouped Publications navigation and legacy submenu labels;
- landing-page hierarchy with latest issue and series entry points;
- searchable/filterable archive cards and empty state;
- publication detail metadata and clear PDF actions;
- a companion admin-editor concept with type-aware fields, upload, preview, and publish states.

## Production alignment rules

The prototype intentionally uses the current site's values (`Inter`, `#1a3a4a`, `#c0392b`,
`#f8fcff`, `#eef7fd`, `#d0eaf6`) so it can be reviewed in isolation. Production code MUST NOT copy
the embedded stylesheet wholesale. It must reuse `data/settings.yml`, `assets/scss/main.scss`, the
existing header/layout partials, and the admin portal's existing component library.

The design is responsive at 320/768/1280 px, prioritizes readable metadata and obvious document
actions, and treats covers as optional enhancement. The final implementation may refine spacing and
component composition while preserving the hierarchy, flows, and acceptance criteria.
