class Header extends React.Component {
	constructor() {
		super();
	}
	
	render() {
		return (<div className="header">
			<div className="clear-btn icon" onClick={(e) => { window.dispatchEvent(new Event("app.editor.clear")); }}>
				<img src="public/images/clear.svg" />
			</div>
			<div className="save-btn icon" onClick={(e) => { window.dispatchEvent(new Event("app.editor.save")); }}>
				<img src="public/images/save.svg" />
			</div>
		</div>);
	}
}

class Editor extends React.Component {
	constructor() {
		super();
		
		window.addEventListener("app.editor.clear", function() {
			document.querySelector(".editor textarea").value = "";
		});
	}
	
	
	render() {
		return (
			<div className="editor">
				<textarea spellCheck="false" onChange={(e) => this.onChange}/>
			</div>
		);
	}

}

class Application extends React.Component {
	constructor() {
		super();
	}
	
	render() {
		return (<div>
			<Header />
			<Editor />
		</div>);
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