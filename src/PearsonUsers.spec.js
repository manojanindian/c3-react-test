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

	it("component has title", () => {
		const h1 = component.find("h1.title");
    	expect(h1.text()).toEqual("Pearson User Management");
	});

	/**
	 * UserProfile componet must containe following theree elements
	 * User avatar, user name and delete button
	 */
	  
	it("User Profile has avatar, name and delete button", () => {
		const userProfileComponent = component.find('UserProfile').first().dive();
		expect(userProfileComponent.find('.user-avatar').length).toBe(1);
		expect(userProfileComponent.find('.user-name').length).toBe(1);
		expect(userProfileComponent.find('.user-delete-btn').length).toBe(1);
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
		userProfileComponent.find('.user-delete-btn').simulate('click');
		expect(component.state().users.length).toBe(4);
	});
});
