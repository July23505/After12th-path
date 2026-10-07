'use strict';
const streams = {
  PCM: {label: 'Physics, Chemistry & Mathematics', defaults: ['Physics', 'Chemistry', 'Mathematics', 'English']},
  PCB: {label: 'Physics, Chemistry & Biology', defaults: ['Physics', 'Chemistry', 'Biology', 'English']},
  PCMB: {label: 'Physics, Chemistry, Maths & Biology', defaults: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English']},
  Commerce: {label: 'Business, accounts & economics', defaults: ['Accountancy', 'Business Studies', 'Economics', 'English']},
  Arts: {label: 'Humanities & social sciences', defaults: ['History', 'Political Science', 'English']}
};
const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Biotechnology', 'English', 'Computer Science', 'Accountancy', 'Business Studies', 'Economics', 'History', 'Geography', 'Political Science', 'Psychology', 'Sociology', 'Fine Arts', 'Hindi', 'Other'];
const categories = ['Engineering', 'Medical and Allied Health', 'Science', 'Design', 'Management', 'Law', 'Defence and Aviation', 'Others'];
const state = {stream: '', subjects: new Set(), courses: [], ready: false};
const $ = id => document.getElementById(id);
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function show(view) {
  $('landing').hidden = view !== 'landing';
  $('journey').hidden = view === 'landing';
  ['stream', 'subject', 'results'].forEach(name => $(name + '-step').hidden = view !== name);
  const step = {stream: 1, subject: 2, results: 3}[view] || 0;
  $('progress').setAttribute('aria-valuenow', step);
  $('progress-fill').style.width = `${step / 3 * 100}%`;
  [1, 2, 3].forEach(n => $('marker-' + n).classList.toggle('active', n <= step));
  const heading = $(view === 'landing' ? 'hero-title' : view === 'subject' ? 'subject-title' : view + '-title');
  heading.focus();
  window.scrollTo({top: 0, behavior: 'auto'});
}
Object.entries(streams).forEach(([key, config]) => {
  const label = element('label', 'stream-choice');
  const input = element('input');
  input.type = 'radio'; input.name = 'stream'; input.value = key;
  const text = element('span');
  text.append(element('strong', '', key), element('small', '', config.label));
  label.append(input, text); $('stream-options').append(label);
});
function renderSubjects() {
  $('subject-options').replaceChildren();
  $('subject-intro').textContent = `${state.stream} selected. Typical subjects are preselected; change them to match your actual marksheet.`;
  subjects.forEach(subject => {
    const label = element('label', 'subject-choice');
    const input = element('input');
    input.type = 'checkbox'; input.name = 'subject'; input.value = subject;
    input.checked = state.subjects.has(subject);
    input.addEventListener('change', () => input.checked ? state.subjects.add(subject) : state.subjects.delete(subject));
    label.append(input, element('span', '', subject)); $('subject-options').append(label);
  });
}
// Every required subject must be present. Each alternative group needs at least one match.
function isEligible(course, stream, selected) {
  return course.streams.includes(stream)
    && course.requiredSubjects.every(subject => selected.has(subject))
    && (course.subjectAlternatives || []).every(group => group.some(subject => selected.has(subject)));
}
function renderResults() {
  const matches = state.courses.filter(course => isEligible(course, state.stream, state.subjects));
  $('selection-summary').textContent = `${state.stream} · ${[...state.subjects].join(', ')}`;
  $('result-count').textContent = `${matches.length} matching ${matches.length === 1 ? 'course' : 'courses'} in the sample catalogue`;
  $('course-results').replaceChildren();
  if (!matches.length) {
    $('course-results').append(element('p', 'empty', 'No matches in this sample catalogue. Edit your subjects or expand courses.json with more verified courses.'));
    return;
  }
  categories.forEach(category => {
    const courses = matches.filter(course => course.category === category);
    if (!courses.length) return;
    const section = element('section', 'category');
    section.append(element('h2', '', `${category} (${courses.length})`));
    const grid = element('div', 'course-grid');
    courses.forEach(course => {
      const card = element('article', 'course-card');
      card.append(element('h3', '', course.name), element('span', 'duration', course.duration));
      const details = element('dl');
      [['Eligibility', course.eligibility], ['Entrance exams', course.entranceExams.join('; ')], ['Career options', course.careerOptions.join(', ')]].forEach(([label, value]) => {
        details.append(element('dt', '', label), element('dd', '', value));
      });
      card.append(details); grid.append(card);
    });
    section.append(grid); $('course-results').append(section);
  });
}
function validCourse(course) {
  const stringList = value => Array.isArray(value) && value.every(item => typeof item === 'string');
  return course && ['name', 'duration', 'eligibility'].every(key => typeof course[key] === 'string')
    && categories.includes(course.category) && stringList(course.streams)
    && course.streams.every(stream => Object.hasOwn(streams, stream))
    && stringList(course.requiredSubjects) && course.requiredSubjects.every(subject => subjects.includes(subject))
    && stringList(course.entranceExams) && stringList(course.careerOptions)
    && (course.subjectAlternatives === undefined || (Array.isArray(course.subjectAlternatives)
      && course.subjectAlternatives.every(group => stringList(group) && group.length > 0 && group.every(subject => subjects.includes(subject)))));
}
async function loadCourses() {
  state.ready = false; $('show-results').disabled = true; $('retry').hidden = true;
  $('load-status').hidden = false; $('load-status').textContent = 'Loading course catalogue…';
  try {
    const response = await fetch('./courses.json');
    if (!response.ok) throw new Error('Catalogue request failed');
    const data = await response.json();
    if (!Array.isArray(data) || !data.every(validCourse)) throw new Error('Invalid course data');
    state.courses = data; state.ready = true; $('show-results').disabled = false; $('load-status').hidden = true;
  } catch (error) {
    $('load-status').textContent = 'Could not load courses.json. Run this folder through a local web server, check the JSON file, then retry.';
    $('retry').hidden = false;
  }
}
$('start').addEventListener('click', () => show('stream'));
$('home').addEventListener('click', () => show('landing'));
$('back-stream').addEventListener('click', () => show('stream'));
$('edit-subjects').addEventListener('click', () => show('subject'));
$('retry').addEventListener('click', loadCourses);
$('stream-form').addEventListener('submit', event => {
  event.preventDefault();
  const selected = new FormData(event.currentTarget).get('stream');
  if (!selected) { $('stream-error').textContent = 'Please choose a stream to continue.'; return; }
  $('stream-error').textContent = '';
  if (selected !== state.stream) {
    state.stream = selected; state.subjects = new Set(streams[selected].defaults); renderSubjects();
    $('subject-error').textContent = '';
  }
  show('subject');
});
$('subject-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!state.subjects.size) { $('subject-error').textContent = 'Please select at least one subject.'; return; }
  if (!state.ready) { $('subject-error').textContent = 'Wait for the catalogue to load or retry below.'; return; }
  $('subject-error').textContent = ''; renderResults(); show('results');
});
loadCourses();
