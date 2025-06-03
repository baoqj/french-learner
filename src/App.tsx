import React from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View } from 'react-native';
import scenes from './data/scenes.json';

interface Stage {
  title: string;
  level: number;
}
interface Scene {
  scene: string;
  stages: Stage[];
}

export default function App() {
  const data: Scene[] = scenes as Scene[];
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>French Learner</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.scene}
        renderItem={({ item }) => (
          <View style={styles.sceneContainer}>
            <Text style={styles.sceneTitle}>{item.scene}</Text>
            {item.stages.map((stage) => (
              <Text key={stage.title} style={styles.stageTitle}>
                - {stage.title} (Level {stage.level})
              </Text>
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  sceneContainer: { marginBottom: 20 },
  sceneTitle: { fontSize: 20, fontWeight: '600' },
  stageTitle: { fontSize: 16, marginLeft: 10 },
});
