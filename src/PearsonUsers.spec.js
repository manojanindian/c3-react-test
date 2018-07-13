import React from "react";
import { shallow } from "enzyme";
import { PearsonUsers } from "./PearsonUsers";

describe("PearsonUsers", () => {
	let component;
	/**
	 * Mock global fetch funciton
	 * fetch will return response having 3 users
	 * In 3 users one is duplicate which id is 4
	 */
	
	beforeEach(() => {
		fetch = jest.fn().mockImplementationOnce(() => {
			return new Promise((resolve, reject) => {
				resolve({
					json: () => {
						return {data: [
							{
								id: 1,
								first_name: "Eve",
								last_name: "Holt",
								avatar:
									"https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
							},
							{
								id: 4,
								first_name: "Charles",
								last_name: "Morris",
								avatar:
									"https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
							},
							{
								id: 8,
								first_name: "Charles",
								last_name: "Morris",
								avatar:
									"https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
							}
						]};
					},
				});
			});
		});
	
		component = shallow(<PearsonUsers />);
		
	});

	it("component should be defined", () => {
		expect(component).toBeDefined();
	});

	it("component has heading", () => {
		const heading = component.find(".pearson-users__heading");
		expect(heading.text()).toEqual("Pearson User Management");
	});

	/**
	 * UserProfile componet must containe following three elements
	 * User avatar, user name and delete button
	 */
	  
	it("User Profile has user avatar", () => {
		const userProfileComponent = component.find('UserProfile').first().dive();
		expect(userProfileComponent.find('.pearson-users__user__avatar').length).toBe(1);
	});

	it("User Profile has user name", () => {
		const userProfileComponent = component.find('UserProfile').first().dive();
		expect(userProfileComponent.find('.pearson-users__user__name').length).toBe(1);
	});

	it("User Profile has delete btn", () => {
		const userProfileComponent = component.find('UserProfile').first().dive();
		expect(userProfileComponent.find('.pearson-users__user__delete-btn').length).toBe(1);
	});

	it("fetch should be called", () => {
		expect(fetch.mock.calls.length).toBe(1);
	});

	it("fetch url should be 'https://reqres.in/api/users?page=1&per_page=10'", () => {
		expect(fetch.mock.calls[0][0]).toBe('https://reqres.in/api/users?page=1&per_page=10');
	});

	/**
	 * PearsonUsers component has already 3 users data in state [4, 5, 6]
	 * Fetch is providing 3 more users data [1, 4, 8]
	 * Total users should be 6 now but we have functionality to remove duplicate users [4]
	 * hence Total users should be 5 instead 6
	 */
	
	it("duplicate user should be deleted", () => {
		expect(component.state().users.length).toBe(5);
	});

	/**
	 * After fetch PersonUsers component has 5 users in state [4, 5, 6, 1, 8]
	 * If user click on delete button user's data should be deleted from state
	 * After delete total number of users will be 4 in state
	 */
	
	it("delete user onclick of delete button", () => {
		const userProfileComponent = component.find('UserProfile').first().dive();
		userProfileComponent.find('.pearson-users__user__delete-btn').simulate('click');
		expect(component.state().users.length).toBe(4);
	});

	it("component should render correctly", () => {
		expect(component).toMatchSnapshot();
	})
});
