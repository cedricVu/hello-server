const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const fs = require('fs');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/v1/users', function (req, res, next) { // API get list users

});

app.delete('/api/v1/users/:id', function (req, res, next) { // API delete one user
	try {
		const params = req.params;
		const deletingUserId = parseInt(params.id);
		if (isNaN(deletingUserId)) {
			return res.status(400).json({
				message: 'id have to be number'
			});
		}
		const userDataPath = path.resolve('./data-base');
		let existingUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');
		existingUsers = JSON.parse(existingUsers);
		const userIndex = existingUsers.findIndex(function(item, index) {
			if (item.id === deletingUserId) {
				return true;
			}
		});
		if (userIndex !== -1) {
			existingUsers.splice(userIndex, 1);
			fs.writeFileSync(userDataPath + '/users.json', JSON.stringify(existingUsers));
		} else {
			return res.status(400).json({
				message: 'Not found user'
			});
		}
		return res.json({
			message: 'Delete user ' + deletingUserId + ' successfully'
		});
	} catch(e) {
		console.error(e);
		return res.status(400).json({
			message: 'Something went wrong',
			error: e
		});
	}
});

app.post('/api/v1/users', function (req, res, next) { // API create new user
	try {
		const body = req.body;
		const username = body.username;
		const password = body.password;

		if (!username) {
			return res.status(400).json({
				message: 'username is required field'
			});
		}
		if (!password) {
			return res.status(400).json({
				message: 'password is required field'
			});
		}
		const newUser = {
			username: username,
			password: password
		};
		const userDataPath = path.resolve('./data-base');
		let existingUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');
		if (!existingUsers) {
			existingUsers = [];
		} else {
			existingUsers = JSON.parse(existingUsers);
			if (!Array.isArray(existingUsers)) {
				return res.status(400).json({
					message: 'Database error'
				});
			}
		}
		newUser.id = existingUsers.length + 1;
		existingUsers.push(newUser);
		fs.writeFileSync(userDataPath + '/users.json', JSON.stringify(existingUsers));
		return res.json({
			message: 'Create new user succesfully',
			data: newUser
		})
	} catch(e) {
		console.error(e);
		return res.status(400).json({
			message: 'Something went wrong',
			error: e
		});
	}
});

app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});