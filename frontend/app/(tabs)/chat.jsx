import React, { Component } from "react";
import { StyleSheet, TextInput, Text, View } from "react-native";
import io, { Socket } from "socket.io-client";
import { REACT_NATIVE_IP } from "@env";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      chatMessage: "",
      chatMessages: [],
    };
  }

  componentDidMount() {
    this.socket = io("YOUR IP ADDRESS");
    this.socket.on("chat message", (msg) => {
      this.setState({ chatMessages: [...this.state.chatMessages, msg] });
    });
  }

  submitChatMessage = () => {
    if (this.socket && this.state.chatMessage.trim() !== "") {
      const { username, chatMessage } = this.state;
      this.socket.emit("chat message", { username, message: chatMessage });
      this.setState({ chatMessage: "" });
    }
  };

  renderChatMessages = () => {
    return this.state.chatMessages.map((chatMessage, index) => (
      <View key={index} style={styles.chatBubble}>
        <Text style={styles.username}>{chatMessage.username}:</Text>
        <Text style={styles.chatText}>{chatMessage.message}</Text>
      </View>
    ));
  };

  render() {
    return (
      <View style={styles.chatPage}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Username"
            autoCorrect={false}
            onChangeText={(username) => this.setState({ username })}
            value={this.state.username}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Type your message here..."
            autoCorrect={false}
            onSubmitEditing={this.submitChatMessage}
            onChangeText={(chatMessage) => this.setState({ chatMessage })}
            value={this.state.chatMessage}
            style={styles.textInput}
          />
        </View>
        <View style={styles.chatContainer}>{this.renderChatMessages()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatPage: {
    justifyContent: "center",
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    paddingHorizontal: 10,
    marginBottom: 8,
    marginRight: 8,
    backgroundColor: "white",
  },
  chatContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  chatBubble: {
    backgroundColor: "#F13AB1",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  username: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  chatText: {
    fontSize: 16,
    color: "white",
  },
});
