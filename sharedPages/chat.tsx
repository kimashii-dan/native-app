import Loading from "@/components/Loading";
import { ChatService } from "@/services/chat";
import { PeopleService } from "@/services/people";
import { RootState } from "@/store/store";
import { FriendType } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { UserCircleIcon, SendHorizonal } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { View, Text, SafeAreaView, TextInput, StyleSheet } from "react-native";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { useSelector } from "react-redux";
export default function ChatComponent() {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) return;
  const { id, chatId } = useLocalSearchParams();
  const realChatId = Array.isArray(chatId) ? chatId[0] : chatId;
  const friendId = Array.isArray(id) ? id[0] : id;
  const [friend, setFriend] = useState<FriendType | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (!friendId) return;
    const fetchFriend = async () => {
      try {
        const userData = await PeopleService.getUserById(friendId);
        setFriend(userData);
      } catch (error) {
        console.error("Failed to fetch friend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriend();
  }, [friendId]);

  useEffect(() => {
    if (!realChatId) return;
    const unsubscribe = ChatService.fetchMessages(realChatId, setMessages);
    return () => unsubscribe();
  }, [realChatId]);

  const onSend = useCallback(
    (newMessages: IMessage[] = []) =>
      ChatService.sendMessage(newMessages, user, realChatId),
    [realChatId, user]
  );

  if (loading) {
    return <Loading />;
  }

  if (!friend) {
    return (
      <SafeAreaView>
        <View>
          <Text>User not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: user?.uid || "",
        name: user?.username || "Me",
      }}
      renderBubble={(props) => (
        <Bubble
          {...props}
          wrapperStyle={{
            right: styles.rightBubble,
            left: styles.leftBubble,
          }}
          textStyle={{
            right: styles.rightText,
            left: styles.leftText,
          }}
        />
      )}
      renderInputToolbar={(props) => (
        <InputToolbar
          {...props}
          containerStyle={styles.inputToolbar}
          renderComposer={(composerProps) => (
            <View style={styles.composerContainer}>
              <TextInput
                style={styles.composerInput}
                placeholder="Type a message..."
                value={composerProps.text}
                onChangeText={composerProps.onTextChanged}
                placeholderTextColor="#999"
                autoCorrect={true}
              />
            </View>
          )}
        />
      )}
      renderSend={(props) => (
        <Send {...props} containerStyle={styles.sendContainer}>
          <View style={styles.sendButton}>
            <SendHorizonal color="white" size={20} />
          </View>
        </Send>
      )}
      alwaysShowSend={true}
      renderAvatar={() => <UserCircleIcon size={35} />}
      renderAvatarOnTop={true}
      bottomOffset={50}
    />
  );
}

const styles = StyleSheet.create({
  rightBubble: {
    backgroundColor: "#007bff",
    borderRadius: 15,
    marginBottom: 5,
    padding: 10,
  },
  leftBubble: {
    backgroundColor: "#e1e2e3",
    borderRadius: 15,
    marginBottom: 5,
    padding: 10,
  },
  rightText: {
    color: "white",
  },
  leftText: {
    color: "black",
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: "#e1e2e3",

    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "inherit",
    flexDirection: "row",
    alignItems: "center",
  },

  composerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  composerInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 40,
  },

  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },

  sendButton: {
    borderRadius: 20,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
});
