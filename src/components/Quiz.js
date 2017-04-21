"use strict";

import React, {Component} from 'react';
import {
    AsyncStorage,
    Vibration,
    StyleSheet,
    Modal,
    View,
    Text,
} from 'react-native';

import CONFIG from './../config';
import _ from './../i18n';
import Items from './../Items';
import Heroes from './../Heroes';
import {
    Loader,
    Button,
} from './';

export class Quiz extends Component {
    static propTypes = {
        isVisible: React.PropTypes.bool,
        onClose: React.PropTypes.func,
        vibration: React.PropTypes.number,
    };

    static defaultProps = {
        isVisible: false,
        vibration: 20,
    };

    static initialState = {
        isVisible: false,
        isLoaded: false,
        question: null,
        answers: null,
        selectedAnswer: null,
        score: 0,
        bestScore: 0,
    };

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = Quiz.initialState;

        AsyncStorage.getItem('EE__BEST_SCORE').then((bestScore) => {
            if (parseInt(bestScore)) {
                this.setState({
                    bestScore: bestScore,
                });
            }
        }).catch(() => null);
    }

    vibrate() {
        if (this.props.vibration && !this.state.isVisible) {
            Vibration.vibrate(this.props.vibration);
        }
    }

    close() {
        this.setState(Quiz.initialState, () => {
            if (typeof this.props.onClose === 'function') {
                this.props.onClose();
            }
        });
    }

    open() {
        this.vibrate();

        this.loadQuestion();
    }

    loadQuestion() {
        let question = Items.select(null, Items.TYPE.VOICE_LINE),
            answer,
            alreadyUsed = [],
            answers = [];

        question = question[Math.floor(Math.random() * (question.length))];
        question = {
            key: question.hero,
            value: _(question.uid),
        };

        answers.push({
            key: question.key,
            value: _(Heroes.get(question.key).code),
        });

        alreadyUsed.push(question.key);

        for (let i = 0; answers.length < 4; i++) {
            answer = Heroes.get(Math.floor((Math.random() * (Object.keys(Heroes.ITEMS).length)) + 1));

            if (alreadyUsed.indexOf(answer.id) !== -1) {
                continue;
            }

            alreadyUsed.push(answer.id);

            answers.push({
                key: answer.id,
                value: _(answer.code),
            });
        }

        answers.sort(() => {
            return .4 - Math.random();
        });

        this.setState({
            isVisible: true,
            isLoaded: true,
            question: question,
            answers: answers,
            selectedAnswer: null,
        });
    }

    onAnswer(answer) {
        if (this.state.selectedAnswer) {
            return;
        }

        let score = this.state.score,
            bestScore = this.state.bestScore;

        if (answer === this.state.question.key) {
            score++;

            if (score > bestScore) {
                bestScore = score;
                AsyncStorage.setItem('EE__BEST_SCORE', bestScore.toString());
            }
        } else {
            score = 0;
        }

        this.setState({
            selectedAnswer: answer,
            score: score,
            bestScore: bestScore,
        }, () => setTimeout(() => {
            if (this.state.isVisible) {
                this.loadQuestion();
            }
        }, 1000));
    }

    render() {
        let content, answers = [], color;

        if (!this.state.isLoaded) {
            content = (<Loader/>);
        } else {
            this.state.answers.map((item, index) => {
                color = CONFIG.COLORS.LIGHT_BLUE;

                if (this.state.selectedAnswer) {
                    if (this.state.question.key === item.key) {
                        color = CONFIG.COLORS.GREEN;
                    } else if (this.state.selectedAnswer === item.key) {
                        color = CONFIG.COLORS.RED;
                    }
                }

                answers.push((
                    <Button
                        key={`answer-${index}`}
                        title={item.value}
                        onPress={() => this.onAnswer(item.key)}
                        color={color}
                        style={styles.answer}
                    />
                ));
            });

            content = (
                <View style={styles.content}>
                    <Text numberOfLines={1} style={styles.title}>{`${_('EE__TITLE')}?`.toUpperCase()}</Text>
                    <Text style={styles.question}>"{this.state.question.value}"</Text>
                    <View style={styles.score}>
                        <Text style={styles.scoreText}>{`current: ${this.state.score}`.toUpperCase()}</Text>
                        <Text style={styles.scoreText}>{`best: ${this.state.bestScore}`.toUpperCase()}</Text>
                    </View>
                    <View style={styles.answers}>
                        {answers}
                    </View>
                </View>
            );
        }

        return (
            <Modal
                animationType="slide"
                onRequestClose={() => this.close()}
                transparent={true}
                visible={this.state.isVisible}
            >

                <View style={styles.container}>
                    {content}
                    <Button
                        title={_('BUTTON__CLOSE')}
                        icon="close"
                        onPress={() => this.close()}
                        style={styles.close}
                    />
                </View>

            </Modal>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CONFIG.COLORS.DARK_BLUE,
    },
    title: {
        margin: 8,
        textAlign: 'center',
        fontSize: 28,
        fontFamily: 'BigNoodleToo',
        color: CONFIG.COLORS.COMMON,
    },
    close: {
        margin: 8,
    },
    content: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
    },
    question: {
        margin: 8,
        textAlign: 'center',
        fontSize: 28,
        fontFamily: 'BigNoodleToo',
        color: CONFIG.COLORS.COMMON,
    },
    score: {
        margin: 8,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    scoreText: {
        fontSize: 18,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.LIGHT_BLUE,
    },
    answers: {
        flex: 1,
    },
    answer: {
        marginVertical: 8,
    },
});
