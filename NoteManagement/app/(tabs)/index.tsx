import React, {useState} from "react";
import { Image, StyleSheet, Button, Platform, TextInput, FlatList } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const addNote = () => {
    if (noteText.trim() == "") {
      return;
    }
    setNotes([...notes, noteText]);
    setNoteText("");
  };
  const deleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };
  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#FFFFFF', dark: '#000000' }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Note Management</ThemedText>
      </ThemedView>
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your note here..."
          value={noteText}
          onChangeText={setNoteText}
        />
        <Button title="Add Note" onPress={addNote} />
      </ThemedView>
      <ThemedView style={styles.notesContainer}>
        <ThemedText type="subtitle">Your Notes:</ThemedText>
        <FlatList
          data={notes}
          renderItem={({ item, index }) => (
          <ThemedView style={styles.noteItem}>
            <ThemedText>{item}</ThemedText>
            <Button title="Delete" onPress={() => deleteNote(index)} />
          </ThemedView>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
