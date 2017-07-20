import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import PropTypes from 'prop-types';
import update from 'react/lib/update';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragSource } from 'react-dnd';



function noteSource(){
    beginDrag(props){
        const { id, left, top } = props;
        return { id, left, top };
    },
};


@DragSource('box', noteSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))



export default class Note extends React.Component {
    constructor(props){
        super(props);
    };

    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        children: PropTypes.node,
    };


    render(){
        const { left, top, connectDragSource, isDragging, children } = this.props;
        const style = {
            backgroundColor: this.props.color,
            position: 'absolute',
            border: '1px dashed gray',
            padding: '0.5rem 1rem',
            cursor: 'move',
        };

        return connectDragSource(
            <div className="note" style={{ ...style, left, top }}>
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
                left: 80,
                top: 80,
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





const noteTarget = {
    drop(props, monitor, component) {
        const item = monitor.getItem();
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);

        component.moveNote(item.id, left, top);
    },
};

@DragDropContext(HTML5Backend)
@DropTarget('box', noteTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))



export default class NotesGrid extends React.Component{

    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            notes: this.props.notes,
        };
    }

    moveNote(id, left, top) {
        this.setState(update(this.state, {
           notes: {
                [id]: {
                    $merge: { left, top },
                },
            },
        }));
    }


    render() {
    let onNoteDelete = this.props.onNoteDelete;
    const { hideSourceOnDrag, connectDropTarget } = this.props;
    const { notes } = this.state;

    return connectDropTarget(
        <div className="notes-grid">
            {
                notes.map(function(note){
                    const {left, top} = note;
                    return (
                        <Note
                            key={note.id}
                            onDelete={onNoteDelete.bind(null, note)}
                            color = {note.color}
                            hideSourceOnDrag={hideSourceOnDrag}
                            >
                            {note.text}
                        </Note>
                    );
                })
            }
        </div>
    );
}


/*
return connectDropTarget(
    <div style={styles}>
        {Object.keys(boxes).map((key) => {
            const { left, top, title } = boxes[key];
            return (
                <Box
                    key={key}
                    id={key}
                    left={left}
                    top={top}
                    hideSourceOnDrag={hideSourceOnDrag}
                >
                    {title}
                </Box>
            );
        })}
    </div>,
);

*/

};


//export default DragDropContext(HTML5Backend)(NotesApp);


ReactDOM.render(
    <NotesApp />,
        document.getElementById("mount-point")
);