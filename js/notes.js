
class Note extends React.Component {
    constructor(props){
        super(props);

        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this._updateLocalStorage = this._updateLocalStorage.bind(this);

        this._handleContextMenu = this._handleContextMenu.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this._handleScroll = this._handleScroll.bind(this);

        let id = this.props.id;
        let styles = JSON.parse(localStorage.getItem('styles'));
        let noteStyle = styles[id];
         this.state = {
             style: noteStyle,
             visibleMenu: false,
         };
    };

    _handleContextMenu(event){
        event.preventDefault();

        this.setState(function ()
            {
                return {
                        visibleMenu: true,
                }
            }
            );

        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW =  this.refs.root.offsetWidth;
        const rootH =  this.refs.root.offsetHeight;

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;

        if (right) {
            this.refs.root.style.left = `${clickX + 5}px`;
        }

        if (left) {
            this.refs.root.style.left = `${clickX - rootW - 5}px`;
        }

        if (top) {
            this.refs.root.style.top = `${clickY + 5}px`;
        }

        if (bottom) {
            this.refs.root.style.top = `${clickY - rootH - 5}px`;
        }
    };

    _handleClick(event){
        const { visibleMenu } = this.state.visibleMenu;
        const wasOutside = !(event.target.contains === this.refs.root);

        if (wasOutside && visibleMenu)  {
            this.setState(function ()
            {
                return {
                        visibleMenu: false,
                }
            }
        )
    };
    };

    _handleScroll(){
        const { visibleMenu } = this.state.visibleMenu;

        if (visibleMenu) {
            this.setState(function () {
                    return {
                            visibleMenu: false,
                        }
                    }
            );
        };
    };


    componentDidMount(){
        this.refs.note.addEventListener('contextmenu', this._handleContextMenu);
        this.refs.note.addEventListener('click', this._handleClick);
        this.refs.note.addEventListener('scroll', this._handleScroll);
    };
    componentWillUnmount() {
        this.refs.note.removeEventListener('contextmenu', this._handleContextMenu);
        this.refs.note.removeEventListener('click', this._handleClick);
        this.refs.note.removeEventListener('scroll', this._handleScroll);
    };


    componentDidUpdate(){
        this._updateLocalStorage();
    };

    _updateLocalStorage(){
        let id = this.props.id;
        let styles = JSON.parse(localStorage.getItem('styles'));
        styles[id] = this.state.style;
        localStorage.setItem('styles',JSON.stringify(styles));
    };


    static handleDragStart(event){
        event.dataTransfer.effectAllowed='move';
    };


    handleDragEnd(e){

        let wid = getComputedStyle(this.refs.note).width;
        let heig = getComputedStyle(this.refs.note).height;
        wid = wid.slice(0,wid.length-2);
        heig = heig.slice(0,heig.length-2);
        let pageX = e.pageX;
        let pageY = e.pageY;
        let id= this.props.id;


        this.setState(function() {
            return{
                style: {
                    position: 'absolute',
                    left: pageX - wid/2,
                    top: pageY - heig/2,
                    backgroundColor: this.props.backgroundColor,
                    id: id,
                    key: id,
        },
            visibleMenu: false,
            }
        }
        );
    };

    render(){
        const visibleMenu = this.state.visibleMenu;

        console.log(visibleMenu);
        console.log(this.state.style.id);

        let menu ='';
        if (visibleMenu){
            menu = <div ref="root" className="contextMenu">
                <div className="contextMenu--option">Change color</div>
                <div className="contextMenu--option">Delete this</div>
            </div>

        } else {
            menu =
                <div ref="root">
                </div>

        }
        return (
            <div className="note"
                 draggable='true'
                 onDragStart={this.handleDragStart}
                 style={this.state.style}
                 onDragEnd={this.handleDragEnd}
                 ref ="note"
                >
                <div>
                    {menu}
                </div>
                <span className="delete-note"
                      onClick={this.props.onDelete}
                >x</span>
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
      let styles = JSON.parse(localStorage.getItem('styles'));
      if(!styles){
          localStorage.setItem('styles', '{}');
      }
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
        let styleObj = JSON.parse(localStorage.getItem('styles'));
        delete styleObj[noteId];
        localStorage.setItem('styles', JSON.stringify(styleObj));
    };

    handleNoteAdd(newNote){
        let styles = JSON.parse(localStorage.getItem('styles'));
        styles[newNote.id] = newNote;
        localStorage.setItem('styles',JSON.stringify(styles));
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
                  '#f5cccc', '#d8d3d8', '#ecc7ec' ,'#cbeff5','#cbf5e0', '#9fffcf',
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
                backgroundColor: colors[Math.floor(Math.random() * (colors.length +1 )) ],
                id: Date.now(),
                top: 0,
                left: 85,
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
                    return (
                        <Note
                            id={note.id}
                            key = {note.id}
                            onDelete={onNoteDelete.bind(null, note)}
                            backgroundColor ={note.backgroundColor}
                            left = {note.left}
                            top = {note.top}
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