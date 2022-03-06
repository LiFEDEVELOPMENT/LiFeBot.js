import sql from '#sql';
import { quote } from '@discordjs/builders';

async function addNote(guildid, noteKey, note, author) {
    // Prepares a SQL statement and inserts the given Note with its Key into the notes table of the db
    let preparedSQL = 
        'INSERT INTO notes (guildid, noteKey, note, author) VALUES (?,?,?,?)';
    await sql.run(preparedSQL, [guildid, noteKey, note, author]);

    // Fetches the last (just generated) object of the notes table and retrievs its id.
    let notes = await sql.query('SELECT * FROM notes');
    return notes[notes.length -1].id;
}

async function deleteNote(id, guildid) {
    if(id < 0) return false;

    // Fetch all notes with a matching guildid and check if the given id matches one.
    let matchedNote = await this.listNotes(guildid);
    if(matchedNote.filter((note) => note.id == id).length < 1) return false;

    await sql.run('DELETE FROM notes WHERE id=?', id);
    return true;
}

async function listNotes(guildid) {
    let notes = await sql.query('SELECT * FROM quotes');
    return notes.filter((notes) => note.guildid == guildid);
}

async function listNotesKey(guildid, noteKey) {
    let notes = await sql.query('SELECT * FROM quotes WHERE noteKey=?', noteKey);
    return notes.filter((note) => note.guildid == guildid);
}

async function charLimitList(guildid) {
    let notes = await this.listNotes(guildid);
    let resultArray = [];
    let result = '';
    notes.forEach((element) => {
        if((result + element.note.toString()).length > 2000) {
            resultArray.push(result);
            result = '';
        }
        result += '\n\n' + element.note.toString + ` **(${element.id})**`;
    });
    if(result!= '') resultArray.push(result);
    return resultArray;
}

async function charLimitListKey(guildid, noteKey) {
    let notes = await this.listNotesKey(guildid, noteKeys);
    let resultArray = [];
    let result = '';
    notes.forEach((element) => {
        if((result + element.note.toString()).length > 2000) {
            resultArray.push(result);
            result = '';
        }
        result += '\n\n' + element.note.toString + ` **(${element.id})**`;
    });
    if(result!= '') resultArray.push(result);
    return resultArray;
}

export default {
    addNote,
    deleteNote,
    listNotes,
    listNotesKey,
    charLimitList,
    charLimitListKey,
}