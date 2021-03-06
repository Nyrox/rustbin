// Send's a simple POST Ajax request with 'data' as payload and returns the return payload
function send_ajax_request(url, type, data, ajax, callback) {
	let httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = function() {
		if(httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === 200) {
				callback(httpRequest.responseText);
			}
			else {
				callback(null);
			}
		}
	}
	
	httpRequest.open(type, url, ajax);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(data);
}

class Header extends React.Component {
	constructor() {
		super();
	}
	
	render() {
		return (<div className="header">
			<div className="clear-btn btn" onClick={(e) => { window.dispatchEvent(new Event("app.editor.clear")); }}>
				<img className="icon" src="public/images/clear.svg" alt="clear" />
				<p>New</p>
			</div>
			<div className="save-btn btn" onClick={(e) => { window.dispatchEvent(new Event("app.editor.save")); }}>
				<img className="icon" src="public/images/save.svg" alt="save" />
				<p>Save</p>
			</div>
			<div className="login-btn btn" onClick={() => { this.onLoginClicked() }}>
				<p>{ rustbin.app.state.user || "Not signed in"}</p>
				<img className="icon" src="public/images/arrow.svg" alt="expand-menu" />
			</div>
		</div>);
	}
	
	onLoginClicked() {
		return;
		if(rustbin.app.state.user) {
			rustbin.app.toggleMenu();
		}
		else {
			rustbin.app.toggleLogin();
		}
	}
}

class Login extends React.Component {
	
	render() {
		return (<div className="login">
			
		</div>)
	}
}

class Editor extends React.Component {
	constructor() {
		super();
		console.log(location.pathname);
		let self = this;
		
		self.code = "";
		if(location.pathname && location.pathname != "/") {
			send_ajax_request("./api/get/" + location.pathname, "GET", null, false, function(response) {
				self.code = response;
				setTimeout(function() {
					document.querySelector(".editor textarea").value = response;
				}, 100);
			});
		}

		window.addEventListener("app.editor.clear", function() {
			document.querySelector(".editor textarea").value = "";
		});
		
		window.addEventListener("app.editor.save", function() {
			let value = document.querySelector(".editor textarea").value;
			send_ajax_request("./api/save", "POST", JSON.stringify({ payload: value }), true, function(response) {
				if (response === null) { 
					console.error("API Request to './api/save' has failed");
					return;
				}
				
				let data = JSON.parse(response);
				location.pathname = String(data.id);
			});
		});
		
		window.addEventListener("keydown", function(e) {
			if(e.ctrlKey || e.metaKey) {
				switch (String.fromCharCode(event.which).toLowerCase()) {
				case 's':
					e.preventDefault();
					window.dispatchEvent(new Event("app.editor.save"));
					break;
				}
			}
		})
		
	}
	
	
	render() {
		return (
			<div className="editor">
				<textarea spellCheck="false" />
			</div>
		);
	}

}

class Application extends React.Component {
	constructor() {
		super();
		window.rustbin = window.rustbin || {};
		window.rustbin.app = this;
		
		this.state = {
			user: null,
			loginExpanded: false
		};		
	}
	
	render() {
		return (<div>
			<Header />
			{ this.state.loginExpanded &&
				<Login />					
			}
			<div className="main">
				<Editor />
			</div>			
		</div>);
	}
	
	toggleLogin() {
		this.setState({ loginExpanded: !this.state.loginExpanded });
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