import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  TextInput,
  FlatList,
  View,
  Modal,
  Alert,
  Platform,
  Image,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import MapView, { Marker } from "react-native-maps";
import PushNotification from "react-native-push-notification";
import axios from "axios";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import logo from "../../components/images2/notelogo.jpg";

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const [currentlyEditing, setCurrentlyEditing] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // New state for geolocation and weather
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState("");

  // Show alerts based on weather
  const showWeatherAlert = (weatherData) => {
    if (weatherData && weatherData.main.temp > 30) {
      PushNotification.localNotification({
        title: "Weather Alert",
        message: "It's too hot outside! Stay hydrated!",
      });
    } else if (weatherData && weatherData.weather[0].main === "Rain") {
      PushNotification.localNotification({
        title: "Weather Alert",
        message: "It's raining! Don't forget your umbrella!",
      });
    }
  };

  // Fetch current weather based on geolocation
  const fetchWeather = async (latitude, longitude) => {
    //const apiKey = "YOUR_OPENWEATHER_API_KEY"; // replace with your OpenWeather API key
    //try {
    //  const response = await axios.get(
    //    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    //  );
    setWeather({
      lat: "43.6066N",
      lon: "79.5928W",
      elevation: 127,
      timezone: "UTC",
      units: "metric",
      current: {
        icon: "partly_clear",
        icon_num: 28,
        summary: "Partly clear",
        temperature: 16,
        wind: { speed: 3.5, angle: 274, dir: "W" },
        precipitation: { total: 0, type: "none" },
        cloud_cover: 49,
      },
    });
    showWeatherAlert({
      lat: "43.6066N",
      lon: "79.5928W",
      elevation: 127,
      timezone: "UTC",
      units: "metric",
      current: {
        icon: "partly_clear",
        icon_num: 28,
        summary: "Partly clear",
        temperature: 16,
        wind: { speed: 3.5, angle: 274, dir: "W" },
        precipitation: { total: 0, type: "none" },
        cloud_cover: 49,
      },
    });
    //} catch (error) {
    //  console.error("Weather fetch error:", error);
    //}
  };

  // Get the current location of the user
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.log(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const showAlert = (message) => {
    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert(message);
    }
  };

  const addOrUpdateNote = () => {
    if (title.trim() === "" || content.trim() === "") {
      showAlert("Please fill in the title and content.");
      return;
    }

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

  const deleteNote = () => {
    if (noteToDelete !== null) {
      const updatedNotes = notes.filter((_, index) => index !== noteToDelete);
      setNotes(updatedNotes);
      setIsDeleteModalVisible(false);
      showAlert("Note deleted successfully!");
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tag?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#000000" }}
    >
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Note Management</ThemedText>
      </ThemedView>

      {/* New MapView and Weather Information */}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
        </MapView>
      )}

      {weather && (
        <ThemedView style={styles.weatherContainer}>
          <ThemedText type="subtitle">Weather Information</ThemedText>
          <ThemedText>Temperature: {weather.main.temp}°C</ThemedText>
          <ThemedText>{weather.weather[0].description}</ThemedText>
        </ThemedView>
      )}

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

      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by title or tag..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </ThemedView>

      <ThemedView style={styles.notesContainer}>
        <ThemedText type="subtitle">Your Notes:</ThemedText>
        <FlatList
          data={filteredNotes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.noteItem}>
              <ThemedText style={styles.noteTitle}>{item.title}</ThemedText>
              {item.tag && (
                <ThemedText style={styles.noteTag}>{item.tag}</ThemedText>
              )}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Button
                  title="Edit"
                  onPress={() => {
                    setTitle(item.title);
                    setTag(item.tag);
                    setContent(item.content);
                    setCurrentlyEditing(index);
                  }}
                />
                <Button title="View" onPress={() => setSelectedNote(item)} />
                <Button
                  title="Delete"
                  onPress={() => {
                    setNoteToDelete(index);
                    setIsDeleteModalVisible(true);
                  }}
                />
                {/* Button to check weather beside each note */}
                <Button title="Check Weather" onPress={fetchWeatherData} />
              </View>
            </View>
          )}
        />
      </ThemedView>

      {/* View Note Modal */}
      <Modal
        visible={!!selectedNote}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedNote(null)}
      >
        <View style={styles.modalView}>
          <ThemedText style={styles.noteTitle}>
            {selectedNote?.title}
          </ThemedText>
          {selectedNote?.tag && <ThemedText>{selectedNote.tag}</ThemedText>}
          <ThemedText>{selectedNote?.content}</ThemedText>
          <Button title="Close" onPress={() => setSelectedNote(null)} />
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ThemedText>Are you sure you want to delete this note?</ThemedText>
          <Button title="Yes" onPress={deleteNote} />
          <Button title="No" onPress={() => setIsDeleteModalVisible(false)} />
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginTop: 1,
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 330,
    resizeMode: "contain",
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
  searchContainer: {
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  notesContainer: {
    padding: 16,
  },
  noteItem: {
    marginBottom: 12,
  },
  noteTitle: {
    fontWeight: "bold",
  },
  noteTag: {
    color: "#888",
  },
  weatherContainer: {
    padding: 16,
    marginBottom: 16,
  },
  modalView: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: 250,
    marginBottom: 20,
  },
});
