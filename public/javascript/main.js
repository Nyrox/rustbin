class Editor extends React.Component {
	constructor() {
		super();
	}
	
	
	render() {
		return (
			<div className="editor">
				<textarea onChange={this.onChange}/>
			</div>
		);
	}
}

class Application extends React.Component {
	
	render() {
		return <Editor />;
	}
}


ReactDOM.render(<Application />, document.getElementById("react-container"));


/* Polyfill to support tab in textarea */
var textareas = document.getElementsByTagName('textarea');
var count = textareas.length;
for(var i=0;i<count;i++){
    textareas[i].onkeydown = function(e){
        if(e.keyCode==9 || e.which==9){
            e.preventDefault();
            var s = this.selectionStart;
            this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
            this.selectionEnd = s+1; 
        }
    }
}