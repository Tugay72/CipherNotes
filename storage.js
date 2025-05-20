export const loadNotes = async () => {
    try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
            const notes = JSON.parse(storedNotes);
            setNotesData(notes);
            setFilteredNotes(notes);
        } else {
            setNotesData([]);
            setFilteredNotes([]);
        }
    } catch (error) {
        console.error('Error loading notes:', error);
    }
};

export const filterNotes = () => {
    if (searchText === '') {
        setFilteredNotes(notesData);
    } else {
        const filtered = notesData.filter(note =>
            note.title.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredNotes(filtered);
    }
};

export const saveNotes = async (newNotes) => {
    try {
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
        setNotesData(newNotes);
        setFilteredNotes(newNotes);
    } catch (error) {
        console.error('Error saving notes:', error);
    }
};

export const saveNoteByID = async (id, notePassword = '', title = 'Untitled', content = 'Text', time = '/', date = '/', theme = '', fontSize = '', fontFamily = '') => {
    let updatedNotes = [...notesData];
    const index = updatedNotes.findIndex(note => note.id === id);
    if (title == '' || title == null) {
        title = 'Title'
    }

    if (content == '' || content == null) {
        content = 'Text'
    }
    const newNote = { id, notePassword, title, content, time, date, theme, fontSize, fontFamily };

    if (index !== -1) {
        updatedNotes[index] = newNote;
    } else {
        const newId = (Date.now()).toString();
        updatedNotes.push({ ...newNote, id: newId });
    }

    await saveNotes(updatedNotes);
};

export const deleteNoteByID = async (id) => {
    const updatedNotes = notesData.filter(note => note.id !== id);
    await saveNotes(updatedNotes);
};

export const onCreateNote = () => {
    navigation.navigate('CreateNote', { id: null, title: '', content: '', time: '', date: '', theme: '', fontSize: '', fontFamily: '', saveNoteByID, deleteNoteByID });
};


export const saveToDos = async (toDos) => {
    try {
        await AsyncStorage.setItem('@my_todos', JSON.stringify(toDos));
    } catch (e) {
        console.error('ToDo kaydedilirken hata:', e);
    }
};

export const loadToDos = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@my_todos');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('ToDo okunurken hata:', e);
        return [];
    }
};

export const saveToDoByID = async (id, contentJSON = [], title = 'Untitled', theme = '', fontSize = '', fontFamily = '') => {
    let updatedToDos = [...toDoData];
    const index = updatedToDos.findIndex(todo => todo.id === id);

    if (!title || title.trim() === '') {
        title = 'Title';
    }

    const newToDo = {
        id,
        title,
        contentJSON: typeof contentJSON === 'string' ? contentJSON : JSON.stringify(contentJSON),
        theme: theme,
        fontSize,
        fontFamily
    };

    if (index !== -1) {
        updatedToDos[index] = newToDo;
    } else {
        const newId = Date.now().toString();
        updatedToDos.push({ ...newToDo, id: newId });
    }

    await saveToDos(updatedToDos);
};

export const deleteToDoByID = async (id) => {
    const updatedToDos = toDoData.filter(todo => todo.id !== id);
    await saveToDos(updatedToDos);
};

export const filterTodos = () => {
    if (searchText === '') {
        setFilteredTodos(toDoData);
    } else {
        const filtered = toDoData.filter(todo =>
            todo.title.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredTodos(filtered);
    }
};

export const onCreateToDo = () => {
    navigation.navigate('CreateToDo', {
        id: '',
        notePassword: '',
        title: '',
        contentJSON: '',
        theme: '',
        fontSize: '',
        fontFamily: '',
        saveToDoByID,
        deleteToDoByID
    })
}

export const saveReminders = async (reminders) => {
    try {
        await AsyncStorage.setItem('@my_reminders', JSON.stringify(reminders));
    } catch (e) {
        console.error('Hatırlatıcı kaydedilirken hata:', e);
    }
};

export const loadReminders = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@my_reminders');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Hatırlatıcı okunurken hata:', e);
        return [];
    }
};

export const saveReminderByID = async (id, title = 'Untitled', date = new Date().toISOString(), theme = '') => {
    let updatedReminders = [...reminderData];
    const index = updatedReminders.findIndex(reminder => reminder.id === id);

    if (!title || title.trim() === '') {
        title = 'Untitled';
    }

    const newReminder = {
        id,
        title,
        date,
        theme
    };

    if (index !== -1) {
        updatedReminders[index] = newReminder;
    } else {
        const newId = Date.now().toString();
        updatedReminders.push({ ...newReminder, id: newId });
    }

    setReminderData(updatedReminders);
    setFilteredReminders(updatedReminders);
    await saveReminders(updatedReminders);
    return true;
};

export const deleteReminderByID = async (id) => {
    const updatedReminders = reminderData.filter(reminder => reminder.id !== id);
    setReminderData(updatedReminders);
    setFilteredReminders(updatedReminders);
    await saveReminders(updatedReminders);
};

export const filterReminders = () => {
    if (searchText === '') {
        setFilteredReminders(reminderData);
    } else {
        const filtered = reminderData.filter(reminder =>
            reminder.title.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredReminders(filtered);
    }
};

export const onCreateReminder = () => {
    navigation.navigate('CreateReminder', {
        id: '',
        title: '',
        date: '',
        theme: '',
        saveReminderByID,
        deleteReminderByID
    });
};