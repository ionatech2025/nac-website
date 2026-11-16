# E9 — Events

## FE-E9-01 Multi-view events calendar

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E9-01 |

**As a** visitor,  
**I want** an events calendar with month, week, day and year views and previous/next navigation,  
**so that** I can see what is coming in the way that suits me.

### Acceptance criteria

- [ ] Month, week, day and year views are available.
- [ ] Previous/next navigation works in each view.
- [ ] Usable on mobile (scroll/touch friendly).
- [ ] Keyboard operable where interactive.

---

## FE-E9-02 Event detail

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E9-02, E9-05 |

**As a** visitor,  
**I want** event details with title, description, start/end, location, image and contact,  
**so that** I know whether to attend.

### Acceptance criteria

- [ ] Detail shows title, description, start/end, location, image, event contact.
- [ ] Times shown in Africa/Kampala unless set otherwise.
- [ ] Unpublished/cancelled handling matches FE-E9-05.

---

## FE-E9-03 Registration link

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E9-03 |

**As a** visitor,  
**I want** an external registration link on an event,  
**so that** I can register without an in-site form.

### Acceptance criteria

- [ ] Registration URL displays when set.
- [ ] Link is marked external and opens safely.
- [ ] No built-in registration form.

---

## FE-E9-04 Past events archive

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E9-04 |

**As a** visitor,  
**I want** past events to stay browsable separately from upcoming events,  
**so that** I can see what has already happened.

### Acceptance criteria

- [ ] Upcoming and past are clearly separated in UI.
- [ ] Past archive is browsable (by month/list as designed).
- [ ] Past events remain linked to their detail pages.

---

## FE-E9-05 Upcoming list and cancelled labelling

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E9-06, E9-07 |

**As a** visitor,  
**I want** a next-events list and clear cancelled labels,  
**so that** I am not misled by removed or cancelled events.

### Acceptance criteria

- [ ] Upcoming events block usable on home/sidebar.
- [ ] Cancelled events are labelled, not silently removed from relevant views.
