import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import scenes from '../data/scenes.json';

interface Vocab {
  fr: string;
  en: string;
  zh: string;
}

const vocabList: Vocab[] = scenes.flatMap(s => s.stages.flatMap(st => st.vocabulary));

export default function Dictionary() {
  const [query, setQuery] = useState('');
  const result = vocabList.find(v => v.fr.toLowerCase() === query.toLowerCase());
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter French word"
        value={query}
        onChangeText={setQuery}
      />
      {result && (
        <Text style={styles.result}>{result.fr} - {result.en} - {result.zh}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
  },
  result: { fontSize: 16, fontWeight: '600' },
});
