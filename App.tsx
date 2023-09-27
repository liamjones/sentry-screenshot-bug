import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';
import {range} from 'lodash';
import React from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

Sentry.init({
  dsn: 'https://a8e9796651e6b88bb70e505002fc359d@o169785.ingest.sentry.io/4505951781191680',
  enabled: false,
  attachScreenshot: true,
});

const INTERVAL_FOR_TAKING_SCREENSHOTS = 20;
const TIMEOUT_TO_STOP_CAPTURING_SCREENSHOTS_AFTER_DETAILS_SCREEN_IS_RENDERED = 100;
const HOW_MANY_SVGS_TO_RENDER_ON_DETAILS_SCREEN = 20;

let interval;

function HomeScreen() {
  const navigation = useNavigation<any>();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Navigate"
        onPress={() => {
          console.warn('starting captures');
          interval = setInterval(
            () => Sentry.captureException('test'),
            INTERVAL_FOR_TAKING_SCREENSHOTS,
          );
          navigation.navigate('Details');
        }}
      />
    </View>
  );
}

function DetailsScreen() {
  setTimeout(() => {
    if (interval) {
      console.warn('stopping captures');
      clearInterval(interval);
      interval = undefined;
    }
  }, TIMEOUT_TO_STOP_CAPTURING_SCREENSHOTS_AFTER_DETAILS_SCREEN_IS_RENDERED);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
      <ScrollView>
        {range(HOW_MANY_SVGS_TO_RENDER_ON_DETAILS_SCREEN).map(index => (
          <View
            key={`svg-${index}`}
            style={{
              width: 80 * 3,
              height: 80,
              margin: 5,
              backgroundColor: '#ff00ff',
              flexDirection: 'row',
            }}>
            <Svg viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="50" />
            </Svg>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
