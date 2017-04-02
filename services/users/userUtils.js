'use strict';

const _ = require('lodash');

class UserUtils {
    constructor() {};

    mapUsersToDto(users) {
        users = [].concat(users);
        let results = _.map(users, user => {
            let result = {
                id: user.id,
                name: user.name || null,
                email: user.email || null,
                role: user.user_role || null,
                points: user.points || 0,
                createdAt: user.created_at || null,
                lastLogin: user.last_login || null
            };
            return result;
        });
        return results;
    };
};

module.exports = UserUtils;