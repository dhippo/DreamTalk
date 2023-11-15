import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Button } from 'react-native-paper';


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Bienvenue sur l'application DreamTalk!</Text>
      <StatusBar style="auto" />
        <Button icon="camera" title="Press me" >
            Press me
        </Button>
        <Button  title="Presse" icon={{ uri: 'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400' }}>
            Press me
        </Button>

    </View>

);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
