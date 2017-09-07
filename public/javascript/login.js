const LOGIN = 0;
const REGISTER = 1;
const RESET_PW = 2;

class ControlledInput extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			value: props.initialValue || ""
		};
		
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(event) {
		this.setState({ value: event.target.value });
	}
	
	render() {
		return (<input 
			value={this.state.value}
			onChange={this.handleChange}
			type={this.props.type} 
			placeholder={this.props.placeholder} 
			className={this.props.className}
			autoComplete={this.props.autoComplete}
		/>)
	}
}

class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			form_state: LOGIN
		};
	}
	render() {
	 	if(this.state.form_state == LOGIN) return this.login();
		if(this.state.form_state == REGISTER) return this.register();
		if(this.state.form_state == RESET_PW) return this.reset_pw();
	}
	
	login() {
		return (<div className="login">
			<ControlledInput autoComplete="on" type="text" placeholder="Username" className="form-element" />
			<ControlledInput autoComplete="new-password" type="password" placeholder="Password" className="form-element" />
			<div className="form-col-2 form-element">
				<button className="form-element" onClick={() => this.setState({ form_state: REGISTER })}>Register</button>
				<button className="form-element">Login</button>
			</div>
			
		</div>)
	}
	
	register() {
		return (<div className="login">
			<ControlledInput autoComplete="on" type="text" placeholder="Username *" className="form-element" />
			<ControlledInput autoComplete="new-password" type="password" placeholder="Password *" className="form-element" />
			<ControlledInput autoComplete="on" type="email" placeholder="E-Mail *" className="form-element" />
			
			<div className="form-col-2 form-element">
				<button className="form-element">Register</button>		
			</div>
		</div>)
	}
}