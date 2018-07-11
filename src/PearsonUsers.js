import React, { Component } from "react";

/**
 * UserProfile component will render following elements
 * User's image, name and delete button
 */

const UserProfile = ({first_name, last_name, avatar, id, onClickDeleteUser, position}) => {
	return (
		<div className="pearson-users__user">
			<img
				alt={`${first_name} ${last_name}`}
				className="pearson-users__user__avatar"
				src={avatar}
			/>
			<h3
				className="pearson-users__user__name"
			>
				{`${first_name} ${last_name}`}
			</h3>
			<button
				className="pearson-users__user__delete-btn"
				type="button"
				onClick={() => onClickDeleteUser(id, position)}
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
			],
			isLoading: false
		};

		this.onClickDeleteUser = this.onClickDeleteUser.bind(this);
	}

	componentDidMount() {
		this.setState({
			isLoading: true
		});

		fetch('https://reqres.in/api/users?page=1&per_page=10')
		.then(data => data.json())
		.then((data) => {
			const newUserList = this.removeDuplicateEntries(data.data);

			this.setState((prevState, props) => {
				return {
					users: [...prevState.users, ...newUserList],
					isLoading: false
				};
			});
		});
  }

	/**
	 * removeDuplicateEntries() function is responsible to remove duplicate entries from fetch response
	 * function will remove duplicate entries and will concate oldUsers data with newUsers data
	 */

	removeDuplicateEntries(newUsersList) {
		const existingUsersId = new Set(this.state.users.map(({id}) => id));
		return newUsersList.filter(user => !existingUsersId.has(user.id));
	}

	/**
	 * onClickDeleteUser() function will remove respected user from component state
	 */

	onClickDeleteUser(userId, position) {
		this.setState((prevState, props) => {
			if(prevState.users[position].id === userId) {
				prevState.users.splice(position, 1)
			}
			return {
				users: prevState.users,
				isLoading: false
			};
		});
	}

	render() {
		const usersProfile = this.state.users.map( (user, index) =>
			<UserProfile
				key={index}
				{...user}
				position={index}
				onClickDeleteUser={this.onClickDeleteUser}
			/>
		);

		return (
			<div className="pearson-users">
				<h1 className="pearson-users__heading">
					Pearson User Management
				</h1>
				<div className="pearson-users__list">
					{usersProfile}
				</div>
				{this.state.isLoading &&
					<div className="pearson-users__loading">
						Loading...
					</div>
				}
			</div>
		);
	}
}
