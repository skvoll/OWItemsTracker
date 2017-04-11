"use strict";

import {
    Platform,
    TouchableOpacity,
    TouchableNativeFeedback,
} from 'react-native';

let T;

if (Platform.OS === 'android' && Platform.Version >= 21) {
    T = TouchableNativeFeedback;
} else {
    T = TouchableOpacity;
}

export {T as Touchable};
