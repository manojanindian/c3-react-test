import React, { Component } from "react";

/**
 * UserProfile component will render following elements
 * User's image, name and delete button
 */

const UserProfile = ({first_name, last_name, avatar, id, onClickDeleteUser}) => {
	return (
		<div className="user-profile">
			<img
				alt={`${first_name} ${last_name}`}
				className="user-avatar"
				src={avatar} 
			/>
			<h3
				className="user-name"
			>
				{`${first_name} ${last_name}`}
			</h3>
			<button
				className="user-delete-btn"
				type="button"
				onClick={() => onClickDeleteUser(id)}
			>
				Delete
			</button>
		</div>
	)
}


export class PearsonUsers extends Component {
	constructor(props) {
		super(props);

		this.state = {
			users: [
			{
				id: 4,
				first_name: "Eve",
				last_name: "Holt",
				avatar:
				"https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
			},
			{
				id: 5,
				first_name: "Charles",
				last_name: "Morris",
				avatar:
				"https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
			},
			{
				id: 6,
				first_name: "Tracey",
				last_name: "Ramos",
				avatar:
				"https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"
			}
			]
		};
		
		this.onClickDeleteUser = this.onClickDeleteUser.bind(this);
	}

  componentDidMount() {
		fetch('https://reqres.in/api/users?page=1&per_page=10')
		.then(data => data.json())
		.then((data) => {
			const newUserList = this.removeDuplicateEntries(data.data);
			this.setState({
				users: newUserList
			});
		}); 
  }
	  
	/**
	 * removeDuplicateEntries() function is responsible to remove duplicate entries from fetch response
	 * function will remove duplicate entries and will concate oldUsers data with newUsers data
	 */

	removeDuplicateEntries(newUsers) {
		const oldUsersId = [...(new Set(this.state.users.map(({id}) => id)))];
		const newUsersId = new Set(newUsers.map(({id}) => id));

		// duplicate users list
		const duplicateUsers = new Set(oldUsersId.filter(userId => newUsersId.has(userId)));

		return [...this.state.users, ...newUsers.filter( user => !duplicateUsers.has(user.id))];
	}

	/**
	 * onClickDeleteUser() function will remove respected user from component state
	 */

	onClickDeleteUser(userId) {
		const users = this.state.users.filter(function(user) { 
			return user.id !== userId
		})

		this.setState({
			users
		});
	}

  	render() {
		const usersProfile = this.state.users.map( (user, index) => 
			<UserProfile key={index} {...user} onClickDeleteUser={this.onClickDeleteUser} />
		);

		return (
			<div className="pearson-users">
				<h1 className="title">Pearson User Management</h1>
				<div className="user-list">
					{usersProfile}
				</div>
			</div>
		);
	}
}
