const Grid = require('../models/Grid');
const Word = require('../models/Word');
const User = require('../models/User');
const encryption = require('../helpers/encryption');

const signale = require('signale');

exports.renderGrid = async (req, res) => {
    try {
        const gridId = 0;
        const user = await User.findOne({ username: req.session.user.name });
        const grid = await Grid.findOne({ id: gridId });
        const words = await Word.find({ gridId: gridId }).select('-gridId -__v');

        let completed = [];
        for (let i = 0; i < user.completed.length; i++) {
            const completedWord = words.find(word => {
                return word._id.equals(user.completed[i]);
            });
            completed.push({
                _id: user.completed[i],
                word: encryption.decrypt(completedWord.word)
            });
        }

        const wordSet = words.map(word => {
            word = word.toObject();
            delete word.word;
            return word;
        });

        return res.render('Game', {
            grid: JSON.parse(grid.data),
            words: wordSet,
            completed: completed
        });

    } catch (err) {
        signale.error(err);
        return res.redirect('/login');
    }
}

var orderWord = letters => {
    return letters.sort((a, b) => {
        return b.name < a.name ? 1
            : b.name > a.name ? -1
                : 0;
    });
}

exports.checkAnswer = async (req, res) => {
    try {
        let across = [];
        let down = [];
        let words = [];

        const letters = req.body.set;
        const gridId = 0;

        let user = await User.findOne({ username: req.session.user.name });

        for (let i = 0; i < letters.length; i++) {
            if (letters[i].orientation == 'A') across.push(letters[i]);
            else if (letters[i].orientation == 'D') down.push(letters[i]);
        }

        if (across.length != 0) {
            across = orderWord(across);
            words.push({
                word: encryption.encrypt(across.map(letter => letter.letter).join('')),
                length: across.length,
                orientation: 'across',
                startIndex: {
                    x: across[0].x,
                    y: across[0].y
                }
            });
        }
        if (down.length != 0) {
            down = orderWord(down);
            words.push({
                word: encryption.encrypt(down.map(letter => letter.letter).join('')),
                length: down.length,
                orientation: 'down',
                startIndex: {
                    x: down[0].x,
                    y: down[0].y
                }
            });
        }

        let changed = {
            across: false,
            down: false
        };

        const answers = await Word.find({
            gridId: gridId,
            startIndex: { $in: words.map(word => word.startIndex) }
        });

        for (let i = 0; i < words.length; i++) {
            for (let j = 0; j < answers.length; j++) {
                if (req.body.id[words[i].orientation] == answers[j]._id && words[i].word == answers[j].word
                    && user.completed.indexOf(answers[j]._id) == -1) {
                    user.completed.push(answers[j]._id);
                    changed[words[i].orientation] = true;
                    user.score = user.score + 10;
                }
            }
        }

        user = await user.save();
        return res.status(200).send({
            success: true,
            changed: changed,
            completed: user.completed
        });

    } catch (err) {
        signale.error(err);
        return res.status(500).send({
            success: false,
            message: err
        });
    }
}

exports.getScore = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.session.user.name });

        return res.status(200).send({
            success: true,
            score: user.score
        });

    } catch (err) {
        signale.error(err);
        return res.status(500).send({
            success: false,
            message: err
        });
    }
}