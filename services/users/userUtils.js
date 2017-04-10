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
                roles: user.roles ? _.map(user.roles, 'role') : null,
                points: user.points || 0,
                createdAt: user.created_at || null,
                lastLogin: user.last_login || null
            };
            return result;
        });
        return results;
    };

    mapDtoToDatabaseModel(user) {
        const dbUser = {
            email: user.email,
            name: user.name,
            points: user.points || 0
        };
        return dbUser;
    };

    findUserRank(allUsersPoints, userPoints) {
        const usersLen = allUsersPoints.length;
        let rank = 1;
        for (let i = 0; i < usersLen; i++) {
            let currentUserPoints = allUsersPoints[i];
            if (currentUserPoints >= userPoints) {
                ++rank;
            }
        }
        return rank;
    };
};

module.exports = UserUtils;