import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'

// ── Data ─────────────────────────────────────────────────────────────────────

interface Material {
  item: string
  detail?: string
}

interface Step {
  label: string
  detail?: string
}

interface Section {
  id: string
  name: string
  timeLimit: string
  goal: string
  bagLabel: string
  icon: string
  materials: Material[]
  steps: Step[]
  proTip?: string
}

const SECTIONS: Section[] = [
  {
    id: 'pre-exam',
    name: 'Pre-Exam Setup & Disinfection',
    timeLimit: '10 min',
    goal: 'Prepare a safe, sanitary station before any services begin.',
    bagLabel: 'Pre-Exam Setup & Disinfection',
    icon: '🧼',
    materials: [
      { item: 'Paper Towels', detail: 'Full roll, in a bag labeled "Paper Towels"' },
      { item: 'Trash Bag', detail: 'Heavy-duty, labeled "Trash Bag"' },
      { item: 'Heavy-Duty Tape', detail: 'One roll to secure trash bag at station' },
      { item: 'EPA Disinfectant Spray', detail: 'Closed, labeled "EPA Disinfectant"' },
      { item: 'Water Bottle', detail: 'Labeled "Water"' },
      { item: 'Blood Spill Kit / First-Aid Kit', detail: 'Fully assembled and labeled — contains: Roll of Gauze, Alcohol Wipes, Band-Aids, Disposable Gloves' },
      { item: 'Hand Sanitizer', detail: 'Labeled' },
    ],
    steps: [
      { label: 'Sanitize your hands', detail: 'As soon as you\'re told to begin, sanitize thoroughly.' },
      { label: 'Set up tripod or clamp', detail: 'Position securely at your assigned station.' },
      { label: 'Remove mannequin head & implements bag', detail: 'Take these out first; immediately close your large kit bag to avoid point loss.' },
      { label: 'Secure mannequin on tripod', detail: 'Make sure the mannequin head is tightly fastened.' },
      { label: 'Pull out EPA disinfectant & paper towels', detail: 'Ensure the bottle is labeled "EPA Disinfectant."' },
      { label: 'Spray & wipe down all work surfaces', detail: 'Large haircutting station, small manicure table, and both chairs.' },
      { label: 'Place & secure trash bag', detail: 'Use the large labeled trash bag. Staple or tape it inside your foldable hamper; it must touch the floor.' },
      { label: 'Neatly place labeled items on station', detail: 'Hand sanitizer, water bottle, blood spill kit, and tape — all visible and labeled.' },
      { label: 'Discard used paper towels in trash', detail: 'Never leave used towels on the station.' },
      { label: 'Sanitize your hands again', detail: 'Always sanitize after handling trash or setup items.' },
      { label: 'Stand back & raise your hand', detail: 'Signal the examiner that you\'re finished.' },
    ],
    proTip: 'Keep your large kit bag closed after pulling items out. Examiners deduct points for open kits.',
  },
  {
    id: 'manicure',
    name: 'Manicure Service',
    timeLimit: '22 min',
    goal: 'Perform a basic manicure on five nails of a mannequin hand, demonstrating proper setup, technique, and cleanup.',
    bagLabel: 'Manicure Service',
    icon: '💅',
    materials: [
      { item: '2½-Gallon Zip-Seal Bag', detail: 'Label one side "Manicure Service," the other side "Trash"' },
      { item: 'Towels (×3)', detail: 'Any color — white not required' },
      { item: 'Mannequin Hand', detail: 'Pre-tipped with shaped and filed nail tips. No labels, markings, or names.' },
      { item: 'Finger Bowl', detail: 'Small bowl for soaking' },
      { item: 'Soapy Water container', detail: 'Small container labeled "Soapy Water"' },
      { item: 'Cuticle Oil', detail: 'Container labeled "Cuticle Oil"' },
      { item: 'Cuticle Remover', detail: 'Container labeled "Cuticle Remover"' },
      { item: 'Cotton Rounds', detail: 'Inside labeled "Sanitized Implements" container' },
      { item: 'Nail File', detail: 'Inside implements container' },
      { item: 'Nail Buffer', detail: 'Inside implements container' },
      { item: 'Nail Brush', detail: 'Inside implements container' },
      { item: 'Wooden Pusher(s)', detail: 'Bring extras — you snap & discard after each use' },
      { item: 'Wooden Cotton-Tip Swab', detail: 'Inside implements container' },
      { item: 'Small Trash Bag', detail: 'Labeled "Trash" for manicure table' },
      { item: 'Tape', detail: 'To secure small trash bag to table' },
    ],
    steps: [
      { label: 'Sanitize hands & prepare kit', detail: 'Open your bag; remove the Manicure Service bag; close large kit immediately.' },
      { label: 'Set up supplies', detail: 'Lay out: sanitized implements container, mannequin hand, towels, soapy water, cuticle oil, cuticle remover, small trash bag, and tape.' },
      { label: 'Tape small trash bag to manicure table', detail: 'Secure with multiple strips of tape; sanitize hands after.' },
      { label: 'Create workspace bump', detail: 'Fold one towel; fold a second towel over it to form a support bump. Place bump under mannequin hand for stability.' },
      { label: 'Perform hand & nail analysis', detail: 'Sanitize hands and the mannequin hand; perform a quick analysis before proceeding.' },
      { label: 'Shape nails', detail: 'Sanitize hands; remove nail file from implements container; shape each of the five nails (round, square, or point); discard file and sanitize hands.' },
      { label: 'Soften cuticles', detail: 'Pour soapy water into the finger bowl; soak fingers for 1 minute; close soapy water container; sanitize hands.' },
      { label: 'Clean nails', detail: 'Use nail brush over the finger bowl to clean debris from all nails; discard brush and sanitize hands.' },
      { label: 'Dry & apply cuticle remover', detail: 'Use an extra towel to dry the hand; set aside; sanitize hands; apply a small drop of cuticle remover at each cuticle; close remover; sanitize hands.' },
      { label: 'Push back cuticles', detail: 'Use a wooden pusher to gently push back cuticles on all five nails; wipe pusher on towel; snap in half; discard; sanitize hands.' },
      { label: 'Clean under free edge', detail: 'Take the cotton-tipped wooden stick from implements; clean under each nail\'s free edge; snap stick in half; discard; sanitize hands.' },
      { label: 'Buff nails', detail: 'Use nail buffer on each nail (side-to-side, top-to-bottom motions); discard buffer; sanitize hands.' },
      { label: 'Apply cuticle oil', detail: 'Apply one drop of cuticle oil to each nail; close oil; sanitize hands.' },
      { label: 'Remove excess oil', detail: 'Wipe off excess oil with a cotton round; remove any lint; discard cotton round and any leftover supplies; sanitize hands.' },
      { label: 'Clean up & disinfect', detail: 'Absorb finger bowl water with towels; discard towels; sanitize hands; disinfect station with EPA spray + paper towels; discard all waste and remaining items except mannequin hand.' },
      { label: 'Signal completion', detail: 'Place the finished mannequin hand on the table; raise your hand to notify the examiner.' },
    ],
    proTip: 'Pack liquids upright in leak-proof containers. Wrap sharp tools for safety. Use small sub-bags for organization and leave extra space for easy grab-and-go on exam day.',
  },
  {
    id: 'professional-shave',
    name: 'Professional Shave Service',
    timeLimit: '42 min',
    goal: 'Apply lather and towels, then demonstrate proper razor stroke techniques on a mannequin.',
    bagLabel: 'Professional Shave Service',
    icon: '🪒',
    materials: [
      { item: 'Towels (×6)', detail: 'Six towels — extras optional but not required' },
      { item: 'Cape', detail: 'Folded flat at the back for easy access' },
      { item: 'Razor', detail: 'Wrapped in a padded sleeve or towel for protection (no blade for mannequin)' },
      { item: 'Headrest Cover', detail: 'Processing cap to cover the chair headrest' },
      { item: 'Astringent / Aftershave', detail: 'Bottle labeled "Astringent" or "Aftershave," tightly closed' },
      { item: 'Shaving Cream', detail: 'Container labeled "Shaving Cream"' },
    ],
    steps: [
      { label: 'Sanitize hands & prepare kit', detail: 'Open bag; remove the Professional Shave Service bag; close large kit immediately. Set out: 7–8 towels, cape + neck strip, headrest cover, shaving cream, aftershave, razor.' },
      { label: 'Drape the mannequin', detail: 'Sanitize hands. Place first towel snugly around neck; tuck edges. Drape cape over towel; tie securely. Add second towel over cape; adjust to expose neck. Apply headrest cover.' },
      { label: 'Steam & prep skin', detail: 'Sanitize hands. Wet towel under hot water; wring out excess. Test temp below nose with fingertip. Drape hot towel over beard area for 2 minutes, massaging gently. Remove in one smooth, circular motion; discard towel. Sanitize hands.' },
      { label: 'Lather & repeat hot towel', detail: 'Apply shaving cream to back of hand; spread onto beard area. Massage cream in direction of hair growth. Sanitize hands. Repeat hot towel process: hot, test, massage, remove. Sanitize hands.' },
      { label: 'Demonstrate shaving strokes', detail: 'Sanitize hands. Hold closed razor up to signal examiner. On instruction, demonstrate: freehand stroke (stretch skin, smooth pass, wipe razor), backhand stroke, reverse freehand stroke.' },
      { label: 'Complete the shave', detail: 'Sanitize hands. Perform strokes 1–14 in order, wiping razor between each. Discard razor cover; sanitize hands.' },
      { label: 'Cold towel & pore close', detail: 'Wet towel under cold water; wring out. Test temp; drape over shaved area, press for 2 minutes. Remove in one motion; discard towel. Sanitize hands.' },
      { label: 'Apply aftershave', detail: 'Sanitize hands. Spray/apply astringent to towel or paper towel (do not rub). Pat into shaved areas to close pores. Discard towel; sanitize hands.' },
      { label: 'Clean up & disinfect', detail: 'Disinfect station + chair with EPA spray and towel; discard towel. Remove all waste except drape towels + headrest cover (leave draping intact). Sanitize hands.' },
      { label: 'Signal completion', detail: 'Raise your hand to notify the examiner.' },
    ],
    proTip: 'Roll towels tightly and stack vertically for extra space. Use small labeled travel bottles for shaving cream and aftershave. Wrap the razor in a padded sleeve or towel for protection.',
  },
  {
    id: 'blood-exposure',
    name: 'Blood Exposure Incident',
    timeLimit: '12 min',
    goal: 'Correctly simulate cleaning and bandaging a minor cut using proper blood spill protocol. Tests your ability to handle exposure safely and legally.',
    bagLabel: 'Blood Exposure Incident',
    icon: '🩺',
    materials: [
      { item: 'Small Ziploc labeled "Biohazard"', detail: 'For contaminated waste disposal' },
      { item: 'Small Ziploc labeled "Trash"', detail: 'Outer bag for the sealed biohazard bag' },
      { item: 'Small Ziploc labeled "Pre-Sanitized" or "Disinfected"', detail: 'Contains all clean supplies — pack together inside this bag' },
      { item: 'Gloves (1 pair)', detail: 'Inside the Pre-Sanitized bag' },
      { item: 'Cotton Rounds (×2+)', detail: 'Inside the Pre-Sanitized bag — bring extras' },
      { item: 'Band-Aid (×1+)', detail: 'Inside the Pre-Sanitized bag' },
      { item: 'Alcohol Swab (×1+)', detail: 'Inside the Pre-Sanitized bag' },
      { item: 'Cotton (×1+)', detail: 'Inside the Pre-Sanitized bag' },
      { item: 'Nick Relief / Styptic Powder', detail: 'Inside the Pre-Sanitized bag — securely closed' },
    ],
    steps: [
      { label: 'Sanitize hands & remove towel', detail: 'Sanitize hands. If a wiping towel is still on your station, remove and discard it. Sanitize hands again.' },
      { label: 'Retrieve kits & set up bags', detail: 'Open large kit bag; remove the Blood Exposure Incident Service bag; close kit bag immediately. Take out: gloves, biohazard bag, trash bag, alcohol swab, styptic powder, Q-tip, cotton rounds (2), Band-Aid. Close and set aside the service bag.' },
      { label: 'Don & sanitize gloves', detail: 'Put on gloves (ensure proper fit); sanitize gloved hands.' },
      { label: 'Apply pressure & cleanse', detail: 'Wet one cotton round from your water bottle; apply pressure to the simulated cut for 15 seconds. Discard cotton round into biohazard bag; sanitize gloves. Open alcohol swab; cleanse the cut thoroughly. Discard swab + wrapper into biohazard bag; sanitize gloves.' },
      { label: 'Apply styptic powder', detail: 'Sprinkle a small amount of styptic powder onto a Q-tip using a cotton round. Apply powder to the cut. Discard used cotton round + Q-tip; sanitize gloves.' },
      { label: 'Apply Band-Aid', detail: 'Sanitize gloves. Open Band-Aid without touching the pad; apply over the cut carefully. Discard Band-Aid wrapper into biohazard bag; sanitize gloves.' },
      { label: 'Double-bag & dispose', detail: 'Place all biohazard items (gloves, swabs, pads) into the biohazard bag. Close biohazard bag; place it into the labeled trash bag. Ensure the biohazard label is visible; discard into the exam trash.' },
      { label: 'Clean up station', detail: 'EPA-disinfect your station surface; discard disinfectant wipe. Sanitize your hands.' },
      { label: 'Signal completion', detail: 'Ensure your station is neat and the Band-Aid is correctly applied. Raise your hand to notify the examiner.' },
    ],
    proTip: 'Separate small items in mini bags or pill boxes. Keep biohazard bag on top for quick access. Pre-fill styptic to avoid spills. Pack only essentials — skip bulky kits.',
  },
  {
    id: 'facial',
    name: 'Facial Service',
    timeLimit: '17 min',
    goal: 'Safely perform a basic facial on a mannequin — cleansing, massage manipulation, toning, and moisturizing — while following all sanitation procedures.',
    bagLabel: 'Facial Service',
    icon: '🫧',
    materials: [
      { item: 'Cape', detail: 'For draping client/mannequin' },
      { item: 'Headband or Hair Clips', detail: 'To keep hair away from face' },
      { item: 'Cotton Pads / Cotton Rounds', detail: 'Multiple; for cleanser removal and toner application' },
      { item: 'Cleanser', detail: 'Labeled container' },
      { item: 'Toner', detail: 'Labeled container or mist bottle' },
      { item: 'Moisturizer', detail: 'Labeled container' },
      { item: 'Gloves', detail: 'For sanitation compliance' },
      { item: 'Towels (×2)', detail: 'For hot towel and cleanup' },
      { item: 'Massage Cream', detail: 'Labeled container — used during facial massage manipulation' },
      { item: 'Spatulas (×3 minimum)', detail: 'For applying products hygienically — bring extras in case of contamination' },
      { item: 'Shower Cap (separate from headband)', detail: 'Protects hair during facial service — listed separately from headband on exam checklist' },
    ],
    steps: [
      { label: 'Sanitize hands & put on gloves', detail: 'Gloves on before touching face or products.' },
      { label: 'Drape with cape & apply headband', detail: 'Secure cape properly; use headband or clips to pull all hair back.' },
      { label: 'Examine skin condition', detail: 'Note any visible skin concerns before applying products.' },
      { label: 'Apply cleanser', detail: 'Apply cleanser to face area; massage in circular motions to lift debris.' },
      { label: 'Remove cleanser', detail: 'Remove with dampened cotton pads in upward strokes; use clean pads until all product is removed.' },
      { label: 'Apply toner', detail: 'Apply toner with a fresh cotton pad or mist; work over entire face area.' },
      { label: 'Perform facial massage', detail: 'Use effleurage (light gliding) and petrissage (kneading) movements. Follow proper technique for the service.' },
      { label: 'Apply moisturizer', detail: 'Apply evenly over face area to complete the service.' },
      { label: 'Remove cape & clean up', detail: 'Remove cape carefully; discard single-use items; disinfect implements and station.' },
      { label: 'Signal completion', detail: 'Stand back and raise your hand to notify the examiner.' },
    ],
    proTip: 'Keep product containers clearly labeled and in the order you\'ll use them. This saves time and shows the examiner you\'re organized.',
  },
  {
    id: 'haircutting',
    name: 'Haircutting Service',
    timeLimit: '37 min',
    goal: 'Safely perform a basic haircut on a mannequin using clippers, shears, and trimmers. Demonstrate cutting at least one inch of hair, blend with shear-over-comb, and show arching technique.',
    bagLabel: 'Haircutting Service',
    icon: '✂️',
    materials: [
      { item: 'Comb(s)', detail: 'In sanitized container or sub-bag' },
      { item: 'Clippers + Guards', detail: 'Sanitized and labeled; extra guards if needed' },
      { item: 'Scissors', detail: 'In sanitized container — shears must be cleaned and labeled' },
      { item: 'Cape', detail: 'For draping mannequin' },
      { item: 'Neck Strip', detail: 'Single-use; discard after' },
      { item: 'Spray Bottle', detail: 'Labeled "Water"' },
      { item: 'Mannequin Head', detail: 'Prepped with appropriate hair length' },
      { item: 'Sectioning Clips', detail: 'Multiple; for holding panels during cut' },
    ],
    steps: [
      { label: 'Sanitize hands & inspect implements', detail: 'Confirm all tools are sanitized before use.' },
      { label: 'Apply neck strip & cape', detail: 'Place neck strip first, then drape cape over it properly.' },
      { label: 'Position mannequin & dampen hair', detail: 'Secure mannequin head; mist hair evenly with water spray bottle.' },
      { label: 'Section hair & analyze', detail: 'Create sections based on your service technique; analyze growth patterns.' },
      { label: 'Perform haircut', detail: 'Execute your technique — clipper-over-comb, scissor-over-comb, or freehand — with consistent guides and tension.' },
      { label: 'Cross-check for evenness', detail: 'Check the cut from multiple angles; clean up any uneven sections.' },
      { label: 'Detail neckline and sideburns', detail: 'Define neckline shape and clean up sideburns with clippers or trimmers.' },
      { label: 'Remove cape & neck strip', detail: 'Remove cape without spreading loose hair onto the mannequin.' },
      { label: 'Clean up & disinfect implements', detail: 'Brush loose hair from station; discard neck strip and single-use items; disinfect all tools.' },
      { label: 'Signal completion', detail: 'Raise your hand to notify the examiner.' },
    ],
    proTip: 'Keep guards organized and in order. Examiners notice when barbers fumble for the right guard mid-cut.',
  },
  {
    id: 'blow-dry-thermal',
    name: 'Blow-Drying & Thermal Curling',
    timeLimit: '22 min',
    goal: 'Safely demonstrate thermal styling on a mannequin. Blow-dry one section of wet hair and curl a subsection using a curling iron — while maintaining sanitation, draping, and tool safety.',
    bagLabel: 'Blow-Drying & Thermal Curling Service',
    icon: '💨',
    materials: [
      { item: 'Blow Dryer', detail: 'With multiple heat/speed settings' },
      { item: 'Thermal Iron / Curling Iron', detail: 'Appropriate size for the service' },
      { item: 'Vent Brush or Round Brush', detail: 'For blow-dry tension and direction' },
      { item: 'Comb', detail: 'Wide-tooth for detangling; fine-tooth for finishing' },
      { item: 'Sectioning Clips', detail: 'Multiple, for working in sections' },
      { item: 'Cape', detail: 'For draping mannequin' },
      { item: 'Heat Protectant', detail: 'Labeled container — apply before any heat' },
      { item: 'Mannequin Head', detail: 'With appropriate hair length for styling' },
    ],
    steps: [
      { label: 'Drape client with cape and neck strip', detail: 'Secure cape properly before any product or tool touches the hair.' },
      { label: 'Section hair into 4 quadrants using clips', detail: 'Use sectioning clips to divide hair into manageable sections before heat work.' },
      { label: 'Apply heat protectant spray evenly throughout', detail: 'Apply labeled heat protectant to all sections before any heat tool touches the hair.' },
      { label: 'Begin blow-drying from the nape, working upward in sections', detail: 'Use brush to create tension; direct heat down the hair shaft from root to tip.' },
      { label: 'Check hair saturation — ensure hair is 80–90% dry before iron', detail: 'Hair must be nearly fully dry before thermal iron contact; damp hair + high heat = damage deduction.' },
      { label: 'Test curling iron temperature on white tissue paper at 400°F — tissue should not scorch', detail: 'Hold iron closed on tissue for 2 seconds. If tissue scorches or yellows, reduce temperature before touching hair.' },
      { label: 'Divide hair into 1-inch sections; begin from nape working toward crown', detail: 'Smaller sections produce more defined results; consistency of section size matters to examiners.' },
      { label: 'Clamp iron at root with even tension; rotate and pull toward ends in one fluid motion', detail: 'Uneven tension or stopping mid-stroke causes kinks. Keep motion smooth and continuous.' },
      { label: 'Repeat on all sections; alternate direction for volume at crown', detail: 'Alternating curl direction at the crown prevents flat spots and adds natural-looking volume.' },
      { label: 'Take a test curl from the side — check that curl holds and bounces back', detail: 'A curl that drops immediately means the iron temperature is too low or the section was too damp.' },
      { label: 'Allow curls to cool completely before touching — do NOT comb through hot', detail: 'Combing through hot curls breaks the wave pattern before it sets. Wait for full cool-down.' },
      { label: 'Comb or brush through finished style; check for uniformity', detail: 'Final comb-through reveals any missed sections. Check for consistent curl pattern from nape to crown.' },
    ],
    proTip: 'Never skip the tissue test on your thermal iron. Scorched hair during the exam is a major deduction.',
  },
  {
    id: 'chemical-app-prep',
    name: 'Chemical Application Preparation',
    timeLimit: '5 min',
    goal: 'Assemble the chemical prep bag before Permanent Wave service',
    bagLabel: 'Chemical Prep Bag',
    icon: '🧪',
    materials: [
      { item: '2 Towels (clean, folded)', detail: 'Any color — one for neck drape, one for lap' },
      { item: 'Protective Cap', detail: 'For client head protection during chemical service' },
      { item: 'Protective Cream (e.g. Vaseline)', detail: 'Labeled container — applied along hairline before chemical contact' },
      { item: 'Small Ziploc bag labeled "Sanitized Implements"', detail: 'Contains: Spatula + Disposable Gloves inside — both must be inside before sealing' },
    ],
    steps: [
      { label: 'Retrieve your pre-labeled Chemical Prep Bag from your kit', detail: 'Open large kit bag; remove Chemical Prep Bag; close kit immediately.' },
      { label: 'Confirm bag contains: 2 towels, Protective Cap, Protective Cream, and Sanitized Implements Ziploc', detail: 'Visual check before opening anything — missing items at this stage is a deduction.' },
      { label: 'Open Sanitized Implements Ziploc — verify spatula and gloves are inside', detail: 'Do not touch contents; verify visually. If missing, alert examiner.' },
      { label: 'Place Protective Cream within easy reach of the chemical application area', detail: 'Labeled side facing outward — examiners check labels.' },
      { label: 'Lay out towels at draping position — one for neck, one for lap', detail: 'Fold towels neatly; place at mannequin draping position before chemical service begins.' },
      { label: 'Do NOT open chemical products yet — wait for examiner signal to begin Permanent Wave', detail: 'Opening solution before the signal is a protocol violation. Keep sealed until told to proceed.' },
    ],
    proTip: 'This bag is inspected before Permanent Wave begins. Everything must be labeled. If Protective Cream is not labeled, you may be docked points.',
  },
  {
    id: 'permanent-wave',
    name: 'Permanent Wave Service',
    timeLimit: '20 min',
    goal: 'Demonstrate proper perm rod wrapping on a mannequin — correct sectioning, end papers, cotton barrier, mock solution application, and a test curl — while following safety and sanitation protocol.',
    bagLabel: 'Permanent Wave Service',
    icon: '🌀',
    materials: [
      { item: 'Towels (×2)', detail: 'Any color' },
      { item: 'Cape', detail: 'Any color' },
      { item: 'Small Ziploc labeled "Disinfected"', detail: 'Contains: at least 4 perm rods (extras recommended), handful of perm papers, 1 pair of gloves' },
      { item: 'Perm Solution Container', detail: 'Filled with water for the exam (mock solution); tightly closed' },
    ],
    steps: [
      { label: 'Sanitize hands & prepare kit', detail: 'Sanitize hands. Open large kit bag; remove Permanent Wave Service bag; close kit bag immediately.' },
      { label: 'Retrieve supplies & drape', detail: 'Empty service bag contents onto station; discard the bag. Discard previous drape if needed; sanitize hands. Drape mannequin with towel + cape.' },
      { label: 'Section & measure', detail: 'Sanitize hands. Release side clips; create straight-line section at the back of the head. Measure subsections by rod length + width; clip excess hair away.' },
      { label: 'Wrap rods (4 minimum)', detail: 'Sanitize hands. Choose wrapping method: single flat, double flat, or bookend. Place end paper, align hair ends, roll rod with moderate tension. Secure rod with elastic band at the start of the curl. Repeat for all four rods, keeping consistent elevation (on-base, half-, or off-base).' },
      { label: 'Protect & prepare', detail: 'Wrap cotton around each rod to catch drips. Adjust mannequin tilt if needed.' },
      { label: 'Apply mock perm solution', detail: 'Sanitize hands + put on gloves. Hold solution bottle in a "Z" pattern; saturate each rod thoroughly. Close solution + set aside.' },
      { label: 'Demonstrate test curl', detail: 'Hold towel under one rod; unwrap partially to show curl formation. If requested, unwrap end paper to show hair ends are wrapped correctly.' },
      { label: 'Clean up & disinfect', detail: 'Discard end papers + excess cotton; sanitize hands. Disinfect station with EPA spray; discard wipe + any dropped items. Sanitize hands.' },
      { label: 'Signal completion', detail: 'Ensure station is tidy + no papers or cotton on the floor. Raise your hand to notify the examiner.' },
    ],
    proTip: 'Keep perm rods and end papers in a mini pouch, pre-roll cotton and secure it, fill mock perm solution with gel or water, and place comb and clips on top for easy access.',
  },
  {
    id: 'single-color',
    name: 'Single Color Retouch',
    timeLimit: '22 min',
    goal: 'Simulate applying hair color to 1 inch of regrowth in one quadrant, including a patch test and strand test. Proper sanitation, control, and application technique are critical.',
    bagLabel: 'Single Color Retouch',
    icon: '🎨',
    materials: [
      { item: 'Towels (×2)', detail: 'Any color — one for drape, one for patch test' },
      { item: 'Gloves (×1 set)', detail: 'Mandatory — color is a chemical service' },
      { item: 'Foil Sheet (×1)', detail: 'For sealing the strand test' },
      { item: 'Q-tip (×1+)', detail: 'For patch test application' },
      { item: 'Color Bowl', detail: 'Clean; labeled' },
      { item: 'Color Brush', detail: 'Tint brush for application' },
      { item: 'Mock Hair Color', detail: 'Labeled "Hair Color"; tightly closed — e.g., hair gel or similar mock product' },
    ],
    steps: [
      { label: 'Sanitize hands & prepare kit', detail: 'Sanitize hands. Open large kit bag; remove Single Color Retouch Service bag; close kit bag immediately.' },
      { label: 'Retrieve supplies & drape', detail: 'Empty service bag contents onto station; discard the bag. Sanitize hands. Prepare two towels: one for drape (replace if wet), one for patch test.' },
      { label: 'Patch test & strand test', detail: 'Sanitize hands. Prepare color in the bowl; close container. Perform patch test behind ear with Q-tip; discard Q-tip. Unpin hair; select 1" strand at occipital bone for strand test. Apply color to strand; seal in foil. Wet towel; check patch test for redness + check strand color on white towel. Discard foil + towel; sanitize hands.' },
      { label: 'Section & apply color', detail: 'Sanitize hands. Divide hair into four subsections (¼"–½" wide). For each subsection: apply color 1" from scalp on both sides of part; avoid overlapping onto previously colored hair; lay subsection down neatly.' },
      { label: 'Confirm separation', detail: 'Sanitize hands. Bend each colored subsection over a brush to show clear 1" regrowth separation.' },
      { label: 'Clean up & disinfect', detail: 'Discard all used items + trash. Sanitize hands.' },
      { label: 'Signal completion', detail: 'Ensure clean drape + clear separation on mannequin. Raise your hand to notify the examiner.' },
    ],
    proTip: 'Use a small squeeze bottle for mock color, pack bowl and brush in a sub-bag, lay gloves flat by the towel, and keep clips and comb on top for quick access.',
  },
  {
    id: 'end-of-exam',
    name: 'End of Exam Disinfection',
    timeLimit: '5 min',
    goal: 'Leave the station clean and all implements returned to labeled bags',
    bagLabel: 'All Bags',
    icon: '🧹',
    materials: [
      { item: 'All labeled kit bags', detail: 'Return all implements to their correct labeled bags — no loose items on station' },
      { item: 'Disinfectant spray or wipes', detail: 'EPA-registered; for station surface, chair, and tool wipe-down' },
      { item: 'Paper towels', detail: 'For wiping down surfaces after disinfectant spray' },
      { item: 'Trash bag or liner', detail: 'For final disposal of all single-use items' },
    ],
    steps: [
      { label: 'When examiner signals end of last service, stop working immediately', detail: 'Do not continue any service after the signal — this is a protocol violation.' },
      { label: 'Return all tools and implements to their labeled bags — no loose items on station', detail: 'Each tool goes back to its designated bag. Examiners check for loose implements.' },
      { label: 'Wipe down all metal tools with disinfectant wipe before bagging', detail: 'Sanitize scissors, combs, clippers, and thermal tools before returning them to bags.' },
      { label: 'Spray and wipe down the station surface, chair headrest, and armrests', detail: 'Use EPA disinfectant; wipe in overlapping strokes; discard used paper towels.' },
      { label: 'Dispose of all single-use items (cotton, neck strips, tissues) in trash bag', detail: 'Nothing single-use should remain on the station or chair.' },
      { label: 'Wipe down your kit exterior and close all compartments', detail: 'Kit must be fully closed before exam dismissal — open kits are a deduction.' },
      { label: 'Stand behind your station — do NOT leave the exam area until dismissed', detail: 'Remain at your station until the examiner releases you. Walking away early is a violation.' },
      { label: 'Wait for examiner to complete station inspection before removing kit', detail: 'Examiner walks the floor after time is called. Station must look the same as when you arrived.' },
    ],
    proTip: 'Examiners walk the floor after time is called. A messy station can cost you points even after services are complete. Station must look the same as when you arrived.',
  },
]

// ── Reusable checklist item ───────────────────────────────────────────────

function CheckItem({
  text,
  detail,
  checked,
  onToggle,
}: {
  text: string
  detail?: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: '10px 14px',
        borderRadius: 8,
        background: checked ? 'rgba(46,139,87,0.06)' : '#fff',
        border: `1px solid ${checked ? 'rgba(46,139,87,0.25)' : 'rgba(0,0,0,0.08)'}`,
        cursor: 'pointer',
        transition: 'all 0.12s',
        userSelect: 'none',
      }}
    >
      <div style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        border: `2px solid ${checked ? '#2e8b57' : 'rgba(0,0,0,0.2)'}`,
        background: checked ? '#2e8b57' : 'transparent',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
        transition: 'all 0.12s',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: 12, lineHeight: 1 }}>✓</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: checked ? 'rgba(0,0,0,0.45)' : 'var(--color-black-95)',
          textDecoration: checked ? 'line-through' : 'none',
          letterSpacing: '-0.01em',
        }}>
          {text}
        </div>
        {detail && (
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 2, lineHeight: 1.45 }}>
            {detail}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Step item ─────────────────────────────────────────────────────────────

function StepItem({
  num,
  label,
  detail,
  done,
  onToggle,
}: {
  num: number
  label: string
  detail?: string
  done: boolean
  onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        padding: '12px 16px',
        borderRadius: 10,
        background: done ? 'rgba(46,139,87,0.05)' : 'var(--color-warm-white)',
        border: `1px solid ${done ? 'rgba(46,139,87,0.2)' : 'rgba(0,0,0,0.06)'}`,
        cursor: 'pointer',
        transition: 'all 0.12s',
        userSelect: 'none',
      }}
    >
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: done ? '#2e8b57' : 'rgba(0,0,0,0.07)',
        color: done ? '#fff' : 'rgba(0,0,0,0.5)',
        fontSize: 12,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.12s',
      }}>
        {done ? '✓' : num}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: done ? 'rgba(0,0,0,0.4)' : 'var(--color-black-95)',
          textDecoration: done ? 'line-through' : 'none',
          letterSpacing: '-0.01em',
          lineHeight: 1.35,
        }}>
          {label}
        </div>
        {detail && !done && (
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', marginTop: 4, lineHeight: 1.5 }}>
            {detail}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section panel ─────────────────────────────────────────────────────────

function SectionPanel({ section }: { section: Section }) {
  const [checkedMaterials, setCheckedMaterials] = useState<boolean[]>(
    () => new Array(section.materials.length).fill(false)
  )
  const [doneSteps, setDoneSteps] = useState<boolean[]>(
    () => new Array(section.steps.length).fill(false)
  )
  const [view, setView] = useState<'materials' | 'steps'>('materials')

  const matDone = checkedMaterials.filter(Boolean).length
  const stepDone = doneSteps.filter(Boolean).length
  const allMatsChecked = matDone === section.materials.length
  const allStepsDone = stepDone === section.steps.length

  function resetAll() {
    setCheckedMaterials(new Array(section.materials.length).fill(false))
    setDoneSteps(new Array(section.steps.length).fill(false))
  }

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: 20 }}>
        {(['materials', 'steps'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              background: 'none',
              border: 'none',
              borderBottom: view === v ? '2px solid var(--color-blue)' : '2px solid transparent',
              color: view === v ? 'var(--color-blue)' : 'rgba(0,0,0,0.4)',
              cursor: 'pointer',
              marginBottom: -1,
              textTransform: 'capitalize',
            }}
          >
            {v === 'materials' ? `Materials Checklist (${matDone}/${section.materials.length})` : `Step-by-Step (${stepDone}/${section.steps.length})`}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {(matDone > 0 || stepDone > 0) && (
          <button
            onClick={resetAll}
            style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px' }}
          >
            Reset
          </button>
        )}
      </div>

      {view === 'materials' && (
        <div>
          {/* Bag label reminder */}
          <div style={{
            background: 'rgba(0,117,222,0.06)',
            border: '1px solid rgba(0,117,222,0.18)',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 14,
            fontSize: 13,
            color: 'var(--color-black-95)',
          }}>
            <span style={{ fontWeight: 700 }}>Bag label: </span>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12 }}>"{section.bagLabel}"</span>
            <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', marginLeft: 6 }}>— printed or written clearly in large black lettering on the front</span>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            {section.materials.map((m, i) => (
              <CheckItem
                key={i}
                text={m.item}
                detail={m.detail}
                checked={checkedMaterials[i]}
                onToggle={() => {
                  const next = [...checkedMaterials]
                  next[i] = !next[i]
                  setCheckedMaterials(next)
                }}
              />
            ))}
          </div>

          {allMatsChecked && (
            <div style={{
              marginTop: 16,
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(46,139,87,0.08)',
              border: '1px solid rgba(46,139,87,0.25)',
              fontSize: 13,
              color: '#2e8b57',
              fontWeight: 600,
            }}>
              ✓ Bag is packed — move on to Step-by-Step when you're ready.
            </div>
          )}
        </div>
      )}

      {view === 'steps' && (
        <div>
          <div style={{ display: 'grid', gap: 8 }}>
            {section.steps.map((s, i) => (
              <StepItem
                key={i}
                num={i + 1}
                label={s.label}
                detail={s.detail}
                done={doneSteps[i]}
                onToggle={() => {
                  const next = [...doneSteps]
                  next[i] = !next[i]
                  setDoneSteps(next)
                }}
              />
            ))}
          </div>

          {allStepsDone && (
            <div style={{
              marginTop: 16,
              padding: '14px 18px',
              borderRadius: 8,
              background: 'rgba(46,139,87,0.08)',
              border: '1px solid rgba(46,139,87,0.25)',
              fontSize: 13,
              color: '#2e8b57',
              fontWeight: 700,
            }}>
              ✓ Section complete — raise your hand and wait for the examiner.
            </div>
          )}
        </div>
      )}

      {/* Pro tip */}
      {section.proTip && (
        <div style={{
          marginTop: 20,
          padding: '12px 16px',
          borderRadius: 8,
          background: 'rgba(212,152,42,0.08)',
          border: '1px solid rgba(212,152,42,0.25)',
          fontSize: 12,
          color: 'rgba(0,0,0,0.65)',
          lineHeight: 1.5,
        }}>
          <span style={{ fontWeight: 700, color: '#b8763a' }}>Pro tip: </span>
          {section.proTip}
        </div>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PracticalExamGuide() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const active = SECTIONS.find(s => s.id === activeId) ?? SECTIONS[0]

  return (
    <div style={{ background: 'var(--color-white)', minHeight: '100vh' }}>
      <PageMeta
        title="TDLR Barber Practical Exam Guide — FadeJunkie"
        description="Complete Texas barber practical exam guide — materials checklist and step-by-step instructions for every section. Powered by FadeJunkie."
        canonical="https://fadejunkie.com/education/practical"
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '52px 24px 36px', background: 'var(--color-warm-white)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Link to="/education" style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', textDecoration: 'none' }}>Education Hub</Link>
            <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.25)' }}>→</span>
            <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', fontWeight: 600 }}>Practical Exam Guide</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.2px', lineHeight: 1.05, color: 'var(--color-black-95)', margin: '0 0 12px' }}>
            TDLR Barber Practical Exam Guide
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.55)', maxWidth: 560, lineHeight: 1.6, margin: '0 0 24px' }}>
            Materials checklist + step-by-step instructions for every section of the Texas Class A Barber Practical Exam. Tap any item to check it off.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '8px 16px', fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: 'var(--color-black-95)' }}>{SECTIONS.length}</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', marginLeft: 4 }}>exam sections</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '8px 16px', fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: 'var(--color-black-95)' }}>{SECTIONS.reduce((a, s) => a + s.materials.length, 0)}</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', marginLeft: 4 }}>total items</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '8px 16px', fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: 'var(--color-black-95)' }}>{SECTIONS.reduce((a, s) => a + s.steps.length, 0)}</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', marginLeft: 4 }}>total steps</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── General bag rules banner ────────────────────────────────────────── */}
      <section style={{ padding: '14px 24px', background: 'var(--color-black-95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bag Rules</span>
          {[
            'Use clear 2½-gallon Ziploc bags',
            'One bag per service — no extras or duplicates',
            'Every item inside must be clearly labeled',
            'Bags in exam order inside rolling kit',
          ].map(rule => (
            <div key={rule} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
              <span style={{ color: '#2e8b57', fontWeight: 700 }}>✓</span>
              {rule}
            </div>
          ))}
        </div>
      </section>

      {/* ── Mobile section selector ────────────────────────────────────────── */}
      <div className="practical-mobile-nav" style={{ display: 'none', padding: '12px 16px', background: 'var(--color-warm-white)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>
            {SECTIONS.findIndex(s => s.id === activeId) + 1} of {SECTIONS.length}
          </span>
          <select
            value={activeId}
            onChange={e => { if (SECTIONS.findIndex(s => s.id === e.target.value) < 3) setActiveId(e.target.value) }}
            style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--color-black-95)', background: '#fff', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}
          >
            {SECTIONS.map((s, idx) => (
              <option key={s.id} value={s.id} disabled={idx >= 3}>{idx + 1}. {s.name} · {s.timeLimit}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Main body ──────────────────────────────────────────────────────── */}
      <div className="practical-body" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px', display: 'grid', gridTemplateColumns: 'min(280px, 100%) 1fr', gap: 32, alignItems: 'flex-start' }}>

        {/* Section nav */}
        <div className="section-nav" style={{ position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(0,0,0,0.38)', marginBottom: 10 }}>Exam Sections</div>
          <div style={{ display: 'grid', gap: 4 }}>
            {SECTIONS.map((s, idx) => {
              const isActive = s.id === activeId
              const isLocked = idx >= 3
              return (
                <button
                  key={s.id}
                  onClick={() => !isLocked && setActiveId(s.id)}
                  disabled={isLocked}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${isActive ? 'rgba(0,117,222,0.25)' : 'transparent'}`,
                    background: isActive ? 'rgba(0,117,222,0.06)' : 'transparent',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.1s',
                    opacity: isLocked ? 0.38 : 1,
                  }}
                >
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: isActive ? 'var(--color-blue)' : 'rgba(0,0,0,0.06)',
                    color: isActive ? '#fff' : 'rgba(0,0,0,0.45)',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--color-blue)' : 'var(--color-black-95)', lineHeight: 1.3 }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.38)', marginTop: 2 }}>{s.timeLimit}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active section panel */}
        <div>
          {/* Section header */}
          <div style={{
            background: 'var(--color-warm-white)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 12,
            padding: '22px 24px',
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ fontSize: 32, lineHeight: 1 }}>{active.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--color-black-95)', margin: 0 }}>
                    {active.name}
                  </h2>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: 'var(--color-blue)',
                    color: '#fff',
                  }}>
                    {active.timeLimit}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.55)', margin: 0, lineHeight: 1.55 }}>{active.goal}</p>
              </div>
            </div>
          </div>

          {/* Interactive panel */}
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '20px 24px' }}>
            <SectionPanel key={active.id} section={active} />
          </div>

          {/* Prev/Next nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 12 }}>
            {SECTIONS.findIndex(s => s.id === activeId) > 0 ? (
              <button
                onClick={() => setActiveId(SECTIONS[SECTIONS.findIndex(s => s.id === activeId) - 1].id)}
                style={{ padding: '10px 18px', fontSize: 13, fontWeight: 600, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, background: '#fff', cursor: 'pointer', color: 'var(--color-black-95)' }}
              >
                ← {SECTIONS[SECTIONS.findIndex(s => s.id === activeId) - 1].name}
              </button>
            ) : <div />}
            {(() => {
              const currentIdx = SECTIONS.findIndex(s => s.id === activeId)
              const nextIdx = currentIdx + 1
              if (nextIdx < SECTIONS.length && nextIdx < 3) {
                return (
                  <button
                    onClick={() => setActiveId(SECTIONS[nextIdx].id)}
                    className="fj-btn-primary"
                    style={{ fontSize: 13, padding: '10px 18px' }}
                  >
                    {SECTIONS[nextIdx].name} →
                  </button>
                )
              }
              return (
                <div style={{ padding: '10px 18px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: 'rgba(46,139,87,0.1)', color: '#2e8b57', border: '1px solid rgba(46,139,87,0.25)' }}>
                  ✓ All sections covered
                </div>
              )
            })()}
          </div>
        </div>
      </div>

      {/* ── Mobile layout override ────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 767px) {
          .practical-mobile-nav { display: block !important; }
          .practical-body {
            grid-template-columns: 1fr !important;
            padding: 16px 16px 60px !important;
            gap: 16px !important;
          }
          .section-nav { display: none !important; }
        }
      `}</style>
    </div>
  )
}
