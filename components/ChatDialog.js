import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import {
  GiftedChat,
  renderMessage,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import Greg from '../assets/me.jpg';
import SendIcon from '../assets/send_icon_3.png';

const ChatDialog = ({avatar, API, title}) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const bot = {
    _id: Math.random(),
    name: title,
    avatar: avatar,
  };

  const activeUser = {
    _id: 1,
    name: 'Greg',
    avatar: Greg,
  };

  const onResponse = useCallback(
    (activity) => {
      let newMessage = {
        _id: Math.random(),
        text: activity.Message,
        createdAt: new Date(Date.now()),
        user: bot,
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values:
            activity.Buttons !== null
              ? activity.Buttons.map((obj) => {
                  return {
                    title: obj.title,
                    value: obj.payload,
                  };
                })
              : [],
        },
      };
      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, newMessage),
      );
    },
    [bot],
  );

  const callMessageApi = useCallback(
    (value) => {
      if (messages.length > 0) {
        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, {
            _id: Math.random(),
            user: activeUser,
            text: value,
            createdAt: new Date(),
          }),
        );
      }

      const initFetchMethods = {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({
          message: value ? value : text,
          source: 'Greg',
        }),
      };

      fetch(API, initFetchMethods)
        .then((res) => res.json())
        .then(onResponse);

      let newMessage = {
        _id: Math.random(),
        user: bot,
        createdAt: new Date(Date.now()),
        typing: true,
      };

      setMessages((prevState) => GiftedChat.append(prevState, newMessage));
    },
    [messages.length, text, API, onResponse, bot, activeUser],
  );

  const addNewMessage = useCallback(
    (e) => {
      if (e.text) {
        callMessageApi(e.text);
      } else {
        callMessageApi(text);
      }
    },
    [callMessageApi, text],
  );

  useEffect(() => {
    addNewMessage({text: 'Hi'});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onQuickReply = (quickReplies) => {
    quickReplies.map((obj) => callMessageApi(obj.title));
  };

  const renderInputToolbar = (props) => {
    return <InputToolbar {...props} containerStyle={styles.inputToolbar} />;
  };

  const renderSend = (props) => {
    return (
      <Send {...props} textStyle={styles.send}>
        <View style={styles.send}>
          <Image source={SendIcon} resizeMode="center" style={styles.icon} />
        </View>
      </Send>
    );
  };

  const pressAvatar = (props) => {
    console.log('Future development');
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.chatContainer}>
        <GiftedChat
          alwaysShowSend
          showUserAvatar
          scrollToBottom
          messages={messages}
          text={text}
          onInputTextChanged={(value) => setText(value)}
          onSend={addNewMessage}
          user={activeUser}
          renderMessage={renderMessage}
          messagesContainerStyle={styles.messageContainer}
          onQuickReply={(reply) => onQuickReply(reply)}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          onPressAvatar={pressAvatar}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
  inputToolbar: {
    borderRadius: 100,
  },
  send: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 5,
  },
  messageContainer: {
    width: '100%',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default ChatDialog;
