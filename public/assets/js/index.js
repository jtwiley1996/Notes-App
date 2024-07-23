let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/notes') {
    noteForm = document.querySelector('.note-form');
    noteTitle = document.querySelector('.note-title');
    noteText = document.querySelector('.note-textarea');
    saveNoteBtn = document.querySelector('.save-note');
    newNoteBtn = document.querySelector('.new-note');
    clearBtn = document.querySelector('.clear-btn');
    noteList = document.querySelector('#list-group');

    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    clearBtn.addEventListener('click', renderActiveNote);
    noteForm.addEventListener('input', handleRenderBtns);

    getAndRenderNotes();
  }
});

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNewNoteView = () => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};

const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleRenderBtns = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

const getAndRenderNotes = () => {
  getNotes().then(renderNoteList);
};

const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  noteList.innerHTML = '';

  jsonNotes.forEach((note) => {
    const li = createLi(note.title, true);
    li.dataset.note = JSON.stringify(note);
    noteList.appendChild(li);
  });
};

const createLi = (text, delBtn = true) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item');

  const spanEl = document.createElement('span');
  spanEl.classList.add('list-item-title');
  spanEl.innerText = text;
  spanEl.addEventListener('click', handleNoteView);

  liEl.appendChild(spanEl);

  if (delBtn) {
    const delBtnEl = document.createElement('i');
    delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
    delBtnEl.addEventListener('click', handleNoteDelete);
    liEl.appendChild(delBtnEl);
  }

  return liEl;
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

const handleNoteDelete = (e) => {
  e.stopPropagation();
  const noteId = JSON.parse(e.target.parentElement.getAttribute('data-note')).id;
  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};
