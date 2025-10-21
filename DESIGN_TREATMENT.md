# Pharm Life: The Prescription Quest
## High-Level Concept & Design Treatment

---

## 1. CONCEPT OVERVIEW

### Vision Statement
**Pharm Life** is a retro-inspired pharmacy simulation adventure that transforms pharmaceutical education into an engaging, gamified experience. Through immersive gameplay mechanics inspired by classics like *Theme Hospital*, *Cooking Mama*, and *Papers, Please*, students master real-world pharmacy workflows across four critical stages: Receiving, Typing, Picking & Packing, and Dispensing.

### Core Philosophy
- **Learn by Doing**: Replace passive observation with active participation
- **Fail Forward**: Mistakes become teaching moments with immediate feedback
- **Progressive Mastery**: Content adapts to student year level and competency
- **Nostalgic Engagement**: Retro aesthetics make learning feel like play

---

## 2. VISUAL & AESTHETIC DIRECTION

### Art Style: "Pixel Pharmacy Charm"

**Primary Inspiration**:
- **Theme Hospital** (1997) - Isometric pharmacy layout, humorous patient interactions
- **Stardew Valley** - Warm pixel art, cozy shop management feel
- **Papers, Please** - Document verification gameplay, attention to detail mechanics

**Visual Characteristics**:
- **Pixel Art**: 16-bit inspired sprites with modern polish
- **Isometric View**: 3/4 perspective for pharmacy environment
- **Color Palette**:
  - Professional pharmacy whites and blues
  - Warm accent colors (soft orange, mint green) for friendliness
  - Color-coded medication categories for easy visual learning
- **Character Design**: Cute, expressive pixel art students and patients
- **UI Design**: Retro game HUD with modern usability (clear buttons, readable fonts)

### Mood & Tone
- **Educational but Fun**: Serious learning wrapped in playful presentation
- **Encouraging, Not Punishing**: Supportive feedback system
- **Professional with Personality**: Pharmacy accuracy meets game charm
- **Nostalgic Comfort**: Feels like Saturday morning gaming sessions

---

## 3. GAME STRUCTURE & PROGRESSION

### 3.1 Year-Based Campaign Structure

```
YEAR 1: FOUNDATIONS PHARMACY
├─ Chapter 1: First Day Fundamentals
│  ├─ Tutorial: Welcome to Pharm Life
│  ├─ Stage Focus: Receiving & Typing Basics
│  └─ Prescription Validity 101
│
├─ Chapter 2: Dosage Detective
│  ├─ Stage Focus: Understanding Dosage Forms
│  ├─ Tablets, Capsules, Liquids, Topicals
│  └─ Boss Challenge: The Complex Script
│
└─ Chapter 3: Prescription Master
   └─ Full workflow integration (simplified)

YEAR 2: PHARMACOLOGY PRACTITIONER
├─ Chapter 4: Drug Class Chronicles
│  ├─ Stage Focus: Picking by Mechanism of Action
│  ├─ Body System Organization
│  └─ Side Effect Recognition
│
├─ Chapter 5: Counseling Basics
│  ├─ Stage Focus: Dispensing Fundamentals
│  ├─ Patient Communication
│  └─ Safety Warnings
│
└─ Chapter 6: Rush Hour Pharmacy
   └─ Timed challenges, multiple patients

YEAR 3: ADVANCED DISPENSING
├─ Chapter 7: Difficult Customers
│  ├─ Angry Patient Scenarios
│  ├─ Insurance Issues
│  └─ Drug Interaction Alerts
│
├─ Chapter 8: Emergency Protocols
│  ├─ Controlled Substances
│  ├─ Critical Errors Prevention
│  └─ Professional Judgment Calls
│
└─ Chapter 9: Master Pharmacist
   └─ Comprehensive scenarios, full complexity
```

### 3.2 Difficulty Progression
- **Basic Mode** (Year 1): Clear indicators, unlimited time, helpful hints
- **Intermediate Mode** (Year 2): Timer pressure, fewer hints, more drug variety
- **Advanced Mode** (Year 3): Real-world complexity, ethical dilemmas, multi-patient management

---

## 4. GAMEPLAY MECHANICS BY STAGE

### Stage 1: RECEIVING (Patient Intake & Prescription Validation)

**Gameplay Style**: *Papers, Please* meets *Theme Hospital*

**Core Mechanics**:
1. **Patient Greeting Interface**
   - Patient sprite approaches counter with dialogue bubble
   - Student clicks patient to begin interaction
   - Display: Patient name card + prescription document

2. **Identity Verification Mini-Game**
   - Drag patient IC to verification scanner
   - Check two identifiers (name + IC number match)
   - Green checkmark/red X feedback with sound effects
   - Drug allergy pop-up: Click to flag known allergies

3. **Prescription Validation Puzzle**
   - Prescription displayed as scanned document (retro paper texture)
   - Interactive checklist clipboard appears
   - Student examines for validity markers:
     - [ ] Doctor signature present
     - [ ] Date within valid range
     - [ ] Patient details match
     - [ ] Legible medication names
     - [ ] Dosage instructions complete

4. **Decision Point**
   - **Valid**: Green "ACCEPT" stamp - proceed to next stage
   - **Invalid**: Red "REJECT" stamp - opens error identification screen
     - Dropdown menu: "What is the issue?"
       - Missing signature
       - Expired date
       - Incomplete dosage
       - Patient mismatch
       - Illegible handwriting
     - Correct answer: Patient returns with corrected script (+points)
     - Wrong answer: Supervisor feedback bubble, try again (-time penalty)

**Visual Feedback**:
- Valid prescription: Satisfying stamp animation, paper shuffles to "processed" pile
- Invalid: Prescription glows red outline, shake animation
- Correct rejection: Patient nods, walks away to doctor's office
- Background music: Upbeat lofi pharmacy ambience

---

### Stage 2: TYPING (Prescription Interpretation & Label Creation)

**Gameplay Style**: *Cooking Mama* meets typing games

**Core Mechanics**:
1. **Prescription Decoder**
   - Prescription displayed at top of screen
   - Medical abbreviation glossary sidebar (can be toggled on/off by difficulty)
   - Examples:
     - "2 tabs tds" = 2 tablets, three times a day
     - "1 cap bd pc" = 1 capsule, twice daily, after meals
     - "5ml qid prn" = 5ml, four times daily, when necessary

2. **Label Builder Interactive Panel**
   - Blank prescription label template appears
   - Dropdown menus for each field:
     - **Quantity per dose**: [1] [2] [3] [4] [5]
     - **Dosage form**: [tablet] [capsule] [ml] [puff] [application]
     - **Frequency**: [once daily] [twice daily] [3 times daily] [4 times daily] [when necessary]
     - **Special instructions**: [before meals] [after meals] [at bedtime] [with food]

3. **Label Printing Animation**
   - Student clicks "PRINT LABEL"
   - Vintage dot-matrix printer animation with sound effects
   - Label emerges from printer (pixel art animation)
   - Student drags label to medication package
   - Satisfying "STICK" animation with adhesive sound

4. **Verification Step**
   - Side-by-side comparison: Original Rx vs. Generated Label
   - Auto-check system highlights matches (green) or errors (red pulse)
   - Must fix errors before proceeding

**Educational Enhancements**:
- **Abbreviation Dictionary**: Hover over abbreviation for tooltip explanation
- **Common Mistakes Gallery**: After errors, show example of correct interpretation
- **Typing Speed Bonus**: Faster accurate entries = bonus points

---

### Stage 3: PICKING & PACKING (Medication Selection & Inventory)

**Gameplay Style**: *Overcooked* organization meets *Theme Hospital* inventory

**Core Mechanics**:
1. **Pharmacy Inventory Shelving System**
   - Isometric pharmacy room with shelves organized by body system:
     - **Analgesics** (red shelf): Paracetamol, Ibuprofen
     - **Gastrointestinal** (green shelf): Antacids, Anti-diarrheals
     - **Cardiovascular** (blue shelf): Blood pressure meds
     - **Respiratory** (yellow shelf): Inhalers, antihistamines
     - **Antimicrobials** (purple shelf): Antibiotics
     - **Endocrine** (orange shelf): Diabetes medications

2. **Drag-and-Drop Picking Challenge**
   - Prescription list appears on left side of screen
   - Student character (avatar) moves through pharmacy (click to move or WASD controls)
   - Approach correct shelf → Click medication → Drag to picking basket
   - Basket fills with selected items (visual inventory counter)

3. **Dosage Form & Strength Differentiation**
   - Shelves contain multiple options:
     - **Paracetamol 500mg tablets** vs. **Paracetamol 120mg/5ml suspension**
     - **Ibuprofen 200mg** vs. **Ibuprofen 400mg**
   - Must select exact match to prescription
   - Wrong selection: Red outline + buzzer sound + shelf label highlights correct choice

4. **Drug Class & Mechanism Quiz Integration**
   - **Pop Quiz Mode** (Year 2+): Before picking medication, mini-quiz appears:
     - "Paracetamol belongs to which drug class?"
       - [ ] Analgesic (correct)
       - [ ] Antibiotic
       - [ ] Antihistamine
     - "What is Omeprazole's mechanism of action?"
       - [ ] Proton pump inhibitor (correct)
       - [ ] H2 receptor antagonist
       - [ ] Antacid
   - Correct answer: Proceed to pick
   - Wrong answer: Study card appears with explanation, then retry

5. **Packing Station Mini-Game**
   - Picked medications go to packing counter
   - Count out correct quantity into pharmacy bag
   - Click-and-hold to count: 1... 2... 3... (visual counter)
   - Package in safety-sealed bag with label attached
   - Box closes with satisfying animation

**Time Management Element** (Year 2+):
- Timer bar at top of screen
- Multiple prescriptions queue up (up to 3 patients waiting)
- Efficiency bonuses for fast, accurate picking
- Patients show patience meter (Theme Hospital style)

---

### Stage 4: DISPENSING (Patient Counseling & Safety)

**Gameplay Style**: Multiple-choice adventure game meets *Phoenix Wright* evidence presentation

**Core Mechanics**:
1. **Patient Counseling Dialogue Tree**
   - Patient sprite at counter with speech bubble
   - Student pharmacist avatar on left side
   - Medication package displayed prominently

2. **MCQ Counseling System**
   - Question prompt: "Provide counseling for [Medication Name]"
   - 3-4 options presented as dialogue choices:

     **Example: Paracetamol 500mg**
     - A) "Take when necessary for pain or fever" ✓ (correct)
     - B) "This medicine is for diarrhea" ✗
     - C) "May cause drowsiness, avoid driving" ✗
     - D) "Shake well before use" ✗

3. **Multi-Aspect Counseling** (Year 2+)
   - **Indication**: What is this medication for?
   - **Dosage**: How should you take it?
   - **Side Effects**: What should you watch for?
   - **Storage**: How should you store this?
   - **Warnings**: Any special precautions?

   Each aspect is a separate MCQ, building complete counseling profile

4. **Patient Reaction System**
   - **Correct counseling**: Patient smiles, happy animation, walks away satisfied
     - Positive feedback: "Thank you, pharmacist! I understand now."
   - **Incorrect counseling**: Patient looks confused, question mark bubble
     - Supervisor intervention: "Let me help clarify..."
     - Educational pop-up explains correct answer
     - Retry opportunity

5. **Complex Scenarios** (Year 3)
   - **Angry Patient**: "This is too expensive! I want generic!"
     - Dialogue options affect outcome
     - Must balance empathy with policy

   - **Drug Interaction Alert**: System flags potential issue
     - "Patient is already taking [Drug A]. Risk of interaction?"
     - Options: Dispense anyway / Consult pharmacist / Call prescriber

   - **Insurance Denials**: Problem-solving scenarios
   - **Controlled Substance Protocols**: Extra verification steps

**Feedback & Grading**:
- **Safety Score**: Critical errors vs. minor mistakes
- **Communication Score**: Clarity and completeness of counseling
- **Professionalism Score**: Tone and customer service
- **Star Rating**: 1-5 stars per interaction (Theme Hospital style)

---

## 5. META-GAME SYSTEMS

### 5.1 Progression & Unlocks

**Experience Points (Rx Points)**:
- Earn points for each completed stage
- Bonus points for:
  - Speed (Fast service bonus)
  - Accuracy (Perfect prescription badge)
  - Consecutive correct answers (Combo multiplier)
  - First-time completion of new medications

**Leveling System**:
```
Level 1: Pharmacy Trainee
Level 5: Junior Pharmacist
Level 10: Pharmacist
Level 15: Senior Pharmacist
Level 20: Chief Pharmacist
```

**Unlockables**:
- **New Pharmacy Themes**: Modern pharmacy, hospital pharmacy, community pharmacy skins
- **Avatar Customization**: Lab coats, accessories, expressions
- **Medication Database Expansion**: More drugs as you progress
- **Mini-Games**: Inventory management challenge, drug trivia quiz mode
- **Achievement Badges**: Display on profile (e.g., "Zero Error Week", "Speed Demon", "Counseling Expert")

### 5.2 Study Mode & Reference Library

**Pharmacy Encyclopedia**:
- Accessible from main menu
- Database of all medications in game:
  - Generic/brand names
  - Drug class & mechanism
  - Common dosages
  - Side effects
  - Counseling points
- Search function and body system categories
- Study cards can be reviewed anytime
- "Favorites" bookmark system for exam prep

**Practice Mode**:
- No time pressure, unlimited tries
- Can replay any completed level
- Focus on specific stages (e.g., only Picking practice)
- Educational hints always enabled

### 5.3 Performance Analytics

**Student Dashboard**:
- Overall accuracy by stage
- Most common error types
- Time efficiency metrics
- Strengths/weaknesses breakdown
- Progress tracking across year levels

**Instructor View** (Potential Feature):
- Class-wide performance data
- Identify common learning gaps
- Assign specific chapters as homework
- Track individual student progress

---

## 6. USER INTERFACE DESIGN

### Main Menu
```
╔════════════════════════════════════════╗
║   🏥 PHARM LIFE: PRESCRIPTION QUEST   ║
║                                        ║
║   [▶ START GAME]                      ║
║   [📚 STUDY MODE]                     ║
║   [🏆 ACHIEVEMENTS]                   ║
║   [⚙ SETTINGS]                        ║
║   [ℹ ABOUT]                           ║
║                                        ║
║   Current Level: Pharmacy Trainee     ║
║   Rx Points: 1,250                    ║
╚════════════════════════════════════════╝
```

### In-Game HUD (Stage View)
```
┌─────────────────────────────────────────────┐
│ Stage 1: RECEIVING          Timer: 2:30     │
│ Patient: Sarah Tan          Score: 850 🌟   │
├─────────────────────────────────────────────┤
│                                             │
│     [GAME VIEWPORT - Isometric Pharmacy]    │
│                                             │
│     Patient at Counter → Prescription Doc   │
│                                             │
├─────────────────────────────────────────────┤
│ [✓ ID Verified] [📋 Check Prescription]    │
│ Combo: x3      Patients Waiting: 2         │
└─────────────────────────────────────────────┘
```

### Prescription Validation Screen
```
┌──────────────────────┬──────────────────────┐
│  PRESCRIPTION VIEW   │   VALIDATION PANEL   │
│                      │                      │
│  [Scan of Rx Paper]  │  ☐ Doctor Signature  │
│                      │  ☐ Valid Date        │
│  Dr. Lee Ming        │  ☐ Patient Match     │
│  Date: 15/10/2025    │  ☐ Legible Names     │
│  Patient: Sarah Tan  │  ☐ Complete Dosage   │
│  Rx: Paracetamol...  │                      │
│                      │  [ACCEPT] [REJECT]   │
└──────────────────────┴──────────────────────┘
```

---

## 7. AUDIO DESIGN

### Music
- **Main Theme**: Upbeat chiptune melody (8-bit pharmacy adventure)
- **Stage Music**:
  - Receiving: Calm, focused ambient (concentration music)
  - Typing: Rhythmic, typing-game energy
  - Picking: Upbeat, puzzle-solving tempo
  - Dispensing: Warm, conversational jazz lofi
- **Boss Stages**: Faster tempo, slight tension

### Sound Effects
- **Positive Actions**:
  - Stamp approval: Satisfying "THUNK"
  - Label printing: Dot-matrix printer sounds
  - Correct answer: Bright chime, coin collect
  - Level complete: Victory jingle (16-bit fanfare)

- **Negative Actions**:
  - Wrong selection: Gentle buzzer (not harsh)
  - Timer warning: Subtle pulse beep
  - Error feedback: Whoosh + low tone

- **Ambient Sounds**:
  - Pharmacy background: Soft chatter, phone rings
  - Footsteps on pharmacy floor
  - Medication bottles clinking
  - Cash register, drawer closing

---

## 8. ACCESSIBILITY & USABILITY

### Inclusive Design Features
- **Colorblind Modes**: Alternative color schemes for medication categories
- **Text Sizing**: Adjustable font sizes for readability
- **Audio Cues**: Optional voiceover for instructions
- **Dyslexia-Friendly Font**: OpenDyslexic option
- **Subtitles**: All dialogue and audio feedback captioned
- **Adjustable Timer**: Option to extend or remove time limits
- **Hint System**: Graduated hints (no penalty in practice mode)

### Language Support
- Primary: English
- Potential: Simplified Chinese, Malay, Tamil (Singapore context)

---

## 9. TECHNICAL CONSIDERATIONS

### Platform
- **Primary**: Desktop application (Windows/Mac) - offline software priority
- **Future**: Web-based version for broader access
- **Stretch Goal**: Mobile tablet version (iPad for clinical use)

### Technology Stack Recommendations
- **Game Engine**: Unity (cross-platform, 2D tools, educational portfolio)
- **Art Assets**: Custom pixel art (Aseprite, Photoshop)
- **Audio**: FMOD or Unity Audio for adaptive music
- **Database**: JSON/XML for medication data (easy to update)
- **Analytics**: Built-in performance tracking module

### Save System
- **Auto-save**: After each completed stage
- **Cloud Save**: Potential for institutional deployment
- **Profiles**: Multiple student accounts per installation

---

## 10. EDUCATIONAL VALIDATION & LEARNING OUTCOMES

### Alignment with Curriculum
Each game stage maps directly to learning objectives:

| **Stage**         | **Learning Objectives Reinforced**                          |
|-------------------|-------------------------------------------------------------|
| **Receiving**     | ✓ Recognize valid prescriptions<br>✓ Identify invalid elements<br>✓ Patient identification protocols |
| **Typing**        | ✓ Interpret medical abbreviations<br>✓ Differentiate dosage forms<br>✓ Accurate label creation |
| **Picking**       | ✓ Medication organization systems<br>✓ Drug classes & MOA<br>✓ Strength differentiation |
| **Dispensing**    | ✓ Patient counseling skills<br>✓ Safety warnings<br>✓ Professional communication |

### Assessment Integration
- **Formative Assessment**: In-game performance metrics
- **Summative Option**: Final challenge levels as competency checkpoints
- **Self-Assessment**: Study mode with unlimited practice

### Feedback Mechanisms
- **Immediate**: Right/wrong indicators during gameplay
- **Explanatory**: Pop-up educational cards after errors
- **Cumulative**: End-of-level summary with learning points
- **Longitudinal**: Progress dashboard showing improvement over time

---

## 11. INSPIRATION BREAKDOWN

### How Classic Games Inform Design

#### Theme Hospital (1997)
- **Borrowed**: Isometric pharmacy view, humorous patient interactions, queue management
- **Applied**: Multiple patients waiting, time management, facility layout navigation

#### Papers, Please (2013)
- **Borrowed**: Document verification gameplay, attention to detail, moral decision-making
- **Applied**: Prescription validation screen, checklist verification, handling invalid scripts

#### Cooking Mama (2006)
- **Borrowed**: Step-by-step mini-games, satisfying completion animations, positive reinforcement
- **Applied**: Label creation process, drag-and-drop interactions, star rating system

#### Stardew Valley (2016)
- **Borrowed**: Cozy pixel art aesthetic, progression systems, skill leveling
- **Applied**: Pharmacy shop management feel, unlockable content, daily challenge mode (future feature)

#### Overcooked (2016)
- **Borrowed**: Time pressure, organized chaos, teamwork potential
- **Applied**: Picking stage layout, multi-tasking management, efficiency challenges

---

## 12. FUTURE EXPANSION OPPORTUNITIES

### Phase 2 Features
- **Multiplayer Mode**: Cooperative pharmacy management (2-4 students work together)
- **Scenario Editor**: Instructors create custom prescriptions/cases
- **Hospital Pharmacy DLC**: Inpatient medication workflows, IV preparation
- **Polyclinic Specialty**: Community pharmacy focus, OTC counseling
- **Randomized Daily Challenge**: Leaderboard competitions

### Institutional Partnerships
- **Hospital Training Modules**: Adapt for professional onboarding
- **Continuing Education**: Pharmacist recertification content
- **Licensing Prep**: Exam-style challenge modes

### Monetization (If Scaled Beyond School)
- **Base Game**: Free for educational institutions
- **Premium Content**: Advanced specialty modules (oncology, pediatrics)
- **White-Label Licensing**: Hospitals/clinics customize for internal training

---

## 13. SUCCESS METRICS

### Educational Outcomes
- Improved prescription interpretation accuracy (pre/post assessment)
- Increased confidence in pharmacy workflows (student surveys)
- Reduced error rates in subsequent practical training
- Higher engagement vs. traditional lecture methods

### Engagement Metrics
- Average session length (target: 20-30 min per play session)
- Completion rates by chapter
- Replay frequency (indicates enjoyment)
- Voluntary practice mode usage

### Technical Performance
- Load times <3 seconds
- Zero critical bugs in production
- Cross-platform compatibility
- Stable performance on 5-year-old hardware

---

## 14. PROJECT TIMELINE (Proposed)

### Phase 1: Pre-Production (2 months)
- Finalize game design document
- Create style guide & asset templates
- Develop medication database structure
- Build core UI/UX wireframes

### Phase 2: Vertical Slice (3 months)
- Develop one complete chapter (Year 1, Chapter 1)
- All four stages functional
- Core art assets & audio
- Internal testing with focus group

### Phase 3: Content Production (4 months)
- Build out Year 1-3 content
- Full medication database implementation
- Polish animations & sound
- Accessibility features integration

### Phase 4: Testing & Refinement (2 months)
- Beta testing with pharmacy students
- Bug fixing & balance adjustments
- Educational validation study
- Performance optimization

### Phase 5: Launch & Support (Ongoing)
- Initial deployment to school
- Instructor training sessions
- Gather feedback for updates
- Plan expansion content

**Total Development Estimate**: 11 months (iterative approach recommended)

---

## 15. CORE TEAM ROLES (Recommended)

- **Game Designer**: Mechanics design, level balancing, educational alignment
- **Lead Developer**: Unity programming, systems architecture
- **Pixel Artist**: Character sprites, environment art, UI design
- **Audio Designer**: Music composition, SFX creation
- **Pharmacy Subject Matter Expert**: Content validation, accuracy review
- **Educational Consultant**: Learning outcomes assessment, pedagogy integration
- **QA Tester**: Bug tracking, usability testing

---

## 16. CONCLUSION

**Pharm Life: The Prescription Quest** represents a unique opportunity to revolutionize pharmaceutical education through engaging, evidence-based game design. By grounding the experience in proven simulation gameplay mechanics and nostalgic retro aesthetics, the app can transform complex pharmacy workflows into an intuitive, enjoyable learning journey.

The design treatment balances educational rigor with entertainment value, ensuring students not only complete required training but actively seek out practice sessions. With careful attention to accessibility, progression design, and feedback systems, Pharm Life has the potential to become an essential tool for pharmacy education—and a model for gamified professional training across healthcare disciplines.

**Next Steps**:
1. Stakeholder review & approval of design treatment
2. Technical feasibility assessment & tech stack finalization
3. Content database development (medication list expansion)
4. Prototype development (vertical slice of Chapter 1)
5. Student focus group testing & iteration

---

**Document Version**: 1.0
**Date**: October 21, 2025
**Prepared For**: Pharm Life Development Team
**Classification**: Design Treatment - Educational Game Development
