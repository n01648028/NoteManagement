import React, { useState } from "react";
import {
  StyleSheet,
  Button,
  TextInput,
  FlatList,
  View,
  Modal,
  Alert,
  Platform,
  Image, // Import Image from react-native
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import logo from "../../components/images2/notelogo.jpg"; // Correct relative path

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const [currentlyEditing, setCurrentlyEditing] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const showAlert = (message: string) => {
    console.log("showAlert called with message:", message);
    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert(message);
    }
  };

  const addOrUpdateNote = () => {
    if (title.trim() === "" || content.trim() === "") return;

    if (currentlyEditing !== null) {
      const updatedNotes = notes.map((note, index) =>
        index === currentlyEditing ? { title, tag, content } : note
      );
      setNotes(updatedNotes);
      setCurrentlyEditing(null);
      showAlert("Note updated successfully!");
    } else {
      const newNote = { title, tag, content };
      setNotes([...notes, newNote]);
      showAlert("Note added successfully!");
    }

    setTitle("");
    setTag("");
    setContent("");
  };

  const editNote = (index) => {
    const noteToEdit = notes[index];
    setTitle(noteToEdit.title);
    setTag(noteToEdit.tag);
    setContent(noteToEdit.content);
    setCurrentlyEditing(index);
  };

  const deleteNote = () => {
    const newNotes = notes.filter((_, i) => i !== noteToDelete);
    setNotes(newNotes);
    setIsDeleteModalVisible(false);
    showAlert("Note deleted successfully!");
  };

  const confirmDeleteNote = (index) => {
    setNoteToDelete(index);
    setIsDeleteModalVisible(true);
  };

  const viewNoteDetails = (note) => {
    setSelectedNote(note);
  };

  const closeNoteDetails = () => {
    setSelectedNote(null);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#000000" }}
    >
      {/* Add the logo at the top */}
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Note Management</ThemedText>
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Tag (optional)"
          value={tag}
          onChangeText={setTag}
        />
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <Button
          title={currentlyEditing !== null ? "Save Changes" : "Add Note"}
          onPress={addOrUpdateNote}
        />
      </ThemedView>

      <ThemedView style={styles.notesContainer}>
        <ThemedText type="subtitle">Your Notes:</ThemedText>
        <FlatList
          data={notes}
          renderItem={({ item, index }) => (
            <ThemedView style={styles.noteItem}>
              <ThemedText style={styles.noteTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.noteTag}>
                #{item.tag || "No Tag"}
              </ThemedText>
              <ThemedText>{item.content}</ThemedText>
              <View style={styles.buttonsContainer}>
                <Button title="Edit" onPress={() => editNote(index)} />
                <Button
                  title="Delete"
                  onPress={() => confirmDeleteNote(index)}
                />
                <Button title="View" onPress={() => viewNoteDetails(item)} />
              </View>
            </ThemedView>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </ThemedView>

      {/* Full-Screen View Modal for Viewing Note Details */}
      <Modal
        visible={selectedNote !== null}
        animationType="slide"
        onRequestClose={closeNoteDetails}
      >
        <View style={styles.modalContainer}>
          <ThemedText style={styles.modalTitle}>
            {selectedNote?.title}
          </ThemedText>
          <ThemedText style={styles.modalTag}>
            #{selectedNote?.tag || "No Tag"}
          </ThemedText>
          <ThemedText>{selectedNote?.content}</ThemedText>
          <Button title="Close" onPress={closeNoteDetails} />
        </View>
      </Modal>

      {/* Confirmation Modal for Deleting Note */}
      <Modal
        visible={isDeleteModalVisible}
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ThemedText>Are you sure you want to delete this note?</ThemedText>
          <View style={styles.modalButtons}>
            <Button
              title="Cancel"
              onPress={() => setIsDeleteModalVisible(false)}
            />
            <Button title="Delete" onPress={deleteNote} />
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center", // Centers the logo horizontally
    marginTop: 1, // Adds space from the top
    marginBottom: 20, // Adds space below the logo
  },
  logo: {
    width: 200, // Adjust logo width
    height: 330, // Adjust logo height
    resizeMode: "contain", // Ensure logo maintains aspect ratio
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  contentInput: {
    height: 80,
    textAlignVertical: "top",
  },
  notesContainer: {
    padding: 16,
  },
  noteItem: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 8,
  },
  noteTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  noteTag: {
    fontStyle: "italic",
    color: "#555",
  },
  buttonsContainer: {
    flexDirection: "row", // Layout buttons in a row
    gap: 10, // Adds space between the Edit and Delete buttons
    marginTop: 10, // Adds space from the note content
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalTag: {
    fontStyle: "italic",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
});
