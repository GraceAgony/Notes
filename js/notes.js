

class Note extends React.Component {
    constructor(props){
        super(props);
    };


    render(){

        const style = {
            backgroundColor: this.props.color,
        };


        return (
            <div className="note" style={style}>
                <span className="delete-note" onClick={this.props.onDelete}>x</span>
                <span className="content">{this.props.children}</span>
            </div>
        );
    }
};


class NotesApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.handleNoteDelete = this.handleNoteDelete.bind(this);
        this.handleNoteAdd = this.handleNoteAdd.bind(this);
        this._updateLocalStorage = this._updateLocalStorage.bind(this);

    };

    componentDidMount(){
      let localNotes = JSON.parse(localStorage.getItem('notes'));
      if(localNotes){
          this.setState({notes: localNotes});
      }
    };

    componentDidUpdate(){
        this._updateLocalStorage();
    };

    handleNoteDelete(note){
        let noteId = note.id;
        let newNotes = this.state.notes.filter(function (note) {
            return note.id !== noteId;
        });
        this.setState({notes: newNotes});
    };

    handleNoteAdd(newNote){
        let newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({notes: newNotes});
    }

    _updateLocalStorage(){
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    };

    render(){
        return(
            <div className="notes-app">
                <h2 className="app-header">Notes</h2>
                <NoteEditor onNoteAdd={this.handleNoteAdd}/>
                <NotesGrid notes={this.state.notes} onNoteDelete = {this.handleNoteDelete} />
            </div>
        );
    };

}

    var colors = ['#f6ffab', '#CED9FF', '#ced9ff', '#F6FFAB', '#f2c2fb', '#eaeaea' ,
                  '#f5cccc', '#d8d3d8', '#ecc7ec,' ,'#cbeff5','#cbf5e0', '#9fffcf',
                  '#cdff9f', '#f8fdb0', '#f3dbaf', '#f5d9c9', '#eae5e1'];

class NoteEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleNoteAdd = this.handleNoteAdd.bind(this);
    };



        handleTextChange(event){
            this.setState({
                text: event.target.value,
            })
        };

        handleNoteAdd(){
            let newNote = {
                text: this.state.text,
                color: colors[Math.floor(Math.random() * (colors.length +1 )) ],
                id: Date.now(),
            };

            this.props.onNoteAdd(newNote);
            this.setState({
                text: '',
            });
        };

        render(){
           return(
               <div className="note-editor">
                   <textarea
                       rows={5}
                       placeholder="Enter note here ..."
                       className="textarea"
                       value={this.state.text}
                       onChange={this.handleTextChange}
                   />
                   <button className="add-button" onClick={this.handleNoteAdd}>Add</button>
               </div>
           );
        }
    };



class NotesGrid extends React.Component{

    render() {
    let onNoteDelete = this.props.onNoteDelete;

    return (
        <div className="notes-grid">
            {
                this.props.notes.map(function(note){
                    const {left, top} = note;
                    return (
                        <Note
                            key={note.id}
                            onDelete={onNoteDelete.bind(null, note)}
                            color = {note.color}
                            >
                            {note.text}
                        </Note>
                    );
                })
            }
        </div>
    );
}

};



ReactDOM.render(
    <NotesApp />,
        document.getElementById("mount-point")
);