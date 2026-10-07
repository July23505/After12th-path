# After12Path — Phase 1

A mobile-first HTML, CSS and vanilla JavaScript website. No framework or build step.

## Run on Windows (easy option)
1. Extract After12Path.zip to a folder.
2. Open the extracted folder in Visual Studio Code.
3. Install the **Live Server** extension by Ritwick Dey.
4. Right-click index.html and choose **Open with Live Server**.
5. Click Find My Options, choose a stream, confirm the actual subjects and view results.

Keep index.html, style.css, script.js and courses.json together. Do not open index.html by double-clicking: browsers commonly block fetch() for local file URLs.

## Alternative if Python is already installed
Open a terminal in the extracted folder containing index.html and run:

    py -m http.server 8000

Then open http://localhost:8000 in your browser. Stop the server with Ctrl+C.
On macOS/Linux use python3 -m http.server 8000 instead.

Node.js is not needed. Internet is only needed for downloading tools and the Google-hosted Poppins font. The page falls back to Arial if the font cannot load.

## Files
- index.html: landing page, stream step, subject step and results.
- style.css: mobile-first layout, colours and responsive cards.
- script.js: navigation, validation, JSON loading and subject filtering.
- courses.json: 10 sample courses across eight categories.

## Data and filtering
A course matches when its streams array includes the selected stream, every requiredSubjects entry is checked, and at least one subject in each subjectAlternatives group is checked. Empty subject requirements permit any checked subjects within an allowed stream. All subjects stay editable to accommodate electives.

The catalogue is illustrative, not exhaustive. Matching only checks stream and subjects. College-specific requirements, marks, age and other admission conditions must be verified. General routes are explicitly labelled; specialist programmes can have stricter requirements. Add more records using the same JSON structure after verifying their requirements.

Official references for medical and defence examples:
- https://neet.nta.nic.in/admission-bulletin/
- https://neet.nta.nic.in/document/eligibility-criteria-english/
- https://www.careerairforce.gov.in/nda-entry

No accounts, backend, payments, recommendations or other phases are included.

## Premium redesign
Dark purple palette, Outfit typography, responsive cards, expanded course descriptions, refined spacing and reduced-motion support. Phase 1 filtering and all ten sample courses are retained.

## Replace your existing website
1. Extract After12Path-premium.zip.
2. Back up your current website folder.
3. Copy index.html, style.css, script.js and courses.json from the extracted folder into your existing website folder. Choose Replace when Windows asks.
4. Keep the exact filenames above, without (1) or other suffixes.
5. In VS Code open index.html with Live Server. Press Ctrl+Shift+R in the browser if the old design remains.
6. If updating GitHub, upload these four files to the same location as your old files and commit the changes.

Change the colours in the :root section at the top of style.css. The Google-hosted Outfit font requires internet; Arial is the fallback. Course descriptions are stored in courses.json and displayed by script.js.
