'use strict';

const _ = require('lodash');
const bcrypt = require('bcrypt');
const Treeize = require('treeize');
const config = require('../../config/main');

class UserUtils {
    constructor() { };

    mapUsersToDto(users) {
        users = [].concat(users);
        let results = _.map(users, user => {
            let result = {
                id: user.id,
                name: user.name || null,
                email: user.email || null,
                roles: user.roles ? user.roles : null,
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
            password: user.password || null,
            name: user.name,
            points: user.points || 0,
            facebook_id: user.facebook_id || null,
            profile_image_path: user.profile_image_path || null,
            profile_image_url: user.profile_image_url || null
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

    growTreeFromData(data) {
        if(!data.length) {
            data = [].concat(data);
        }
        const tree = new Treeize();
        tree.grow(data);
        const treeData = tree.getData();
        _.forEach(treeData, (data) => {
            if(data.roles.length) {
                data.roles = _.map(data.roles, 'role');
            }
        });
        return treeData;
    };

    async encryptPassword(password) {
        const SALT_FACTOR = config.SALT_FACTOR;
        try {
            const salt = await bcrypt.genSalt(SALT_FACTOR);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (error) {
            throw new Error(error);
        }
    };

    async comparePasswords(passwordAttempt, hashedPass) {
        try {
            const isMatch = await bcrypt.compare(passwordAttempt, hashedPass);
            return isMatch;
        } catch (error) {
            throw new Error(error);
        }
    };
};

module.exports = UserUtils;