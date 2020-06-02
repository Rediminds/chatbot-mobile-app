import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import SendIcon from '../assets/send_icon_3.png';
import Sound from 'react-native-sound';
import AbortController from 'abort-controller';

const ChatDialog = ({avatar, API, title, profile, navigation}) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(true);
  const [currentClip, setCurrentClip] = useState(null);
  const [stopAudio, setStopAudio] = useState(false);
  const [isController, isSetController] = useState(new AbortController());
  const [preventButton, setPreventButton] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity>
          <Button
            title="Directory"
            onPress={() => {
              navigation.navigate('Directory');
              setStopAudio(true);
              isController.abort();
              isSetController(new AbortController());
              if (currentClip !== null) {
                currentClip.stop();
              }
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

  const bot = {
    _id: Math.random(),
    name: title,
    avatar: avatar,
  };

  const activeUser = {
    _id: 1,
    name: profile.givenName,
    avatar: profile.picture,
  };

  const onResponse = useCallback(
    async (activity) => {
      let newMessage = {
        _id: Math.random(),
        text: activity.Message,
        createdAt: new Date(Date.now()),
        user: bot,
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values:
            activity.Buttons !== null && activity.Buttons !== undefined
              ? activity.Buttons.map((obj) => {
                  return {
                    title: obj.title,
                    value: obj.payload,
                  };
                })
              : [],
        },
      };

      const initFetchMethods = {
        method: 'POST',
        headers: {
          Authorization: 'Token token=E2IFxvjQrkzTiOljryU0VQtt',
          'Content-Type': 'application/json',
        },
        signal: isController.signal,
        body: JSON.stringify({
          callback_uri: '',
          data: {
            title: 'Sync',
            body: activity.Message,
            voice: 'c2e4ed15',
          },
          precision: 'PCM_32',
          phoneme_timestamps: true,
        }),
      };

      const createSynchronousClipAPI =
        'https://app.resemble.ai/api/v1/projects/984f1f96/clips/sync';

      fetch(createSynchronousClipAPI, initFetchMethods)
        .then((res) => res.json())
        .then((res) => {
          console.log('Message Loaded');
          if (res.url) {
            let synthesizeResponse = new Sound(res.url, null, (err) => {
              if (err) {
                console.log('Got response, but clip failed');
                setTyping(false);
                setMessages((prevMessages) =>
                  GiftedChat.append(prevMessages, newMessage),
                );
                setPreventButton(false);
                return;
              } else {
                setTyping(false);

                setMessages((prevMessages) =>
                  GiftedChat.append(prevMessages, newMessage),
                );

                setCurrentClip(synthesizeResponse);
                setPreventButton(false);
              }
            });
          }
        })
        .catch((err) => {
          console.log('No response from Resemble ❌: ', err);
          setPreventButton(false);
          return setMessages((prevMessages) =>
            GiftedChat.append(prevMessages, newMessage),
          );
        });
    },
    [bot, isController.signal],
  );

  useEffect(() => {
    if (stopAudio) {
      isController.abort();
    } else {
      if (currentClip !== null) {
        currentClip.play();
      }
    }
  }, [stopAudio, currentClip, isController]);

  const callMessageApi = useCallback(
    (value) => {
      setTyping(true);
      setPreventButton(true);
      console.log('Message Loading');
      if (currentClip !== null) {
        currentClip.stop();
      }

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
    },

    [messages.length, text, API, onResponse, activeUser, currentClip],
  );

  const addNewMessage = useCallback(
    (e) => {
      // initial message
      if (e.text) {
        let newMessage = {
          _id: Math.random(),
          user: bot,
          text: `One Moment Please, ${profile.givenName}`,
          createdAt: new Date(Date.now()),
        };

        setMessages((prevState) => GiftedChat.append(prevState, newMessage));

        callMessageApi(e.text);
      } else {
        // input text
        callMessageApi(text);
      }
    },
    [callMessageApi, bot, text, profile],
  );

  useEffect(() => {
    addNewMessage({text: 'Hi'});

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onQuickReply = (quickReplies) => {
    quickReplies.map((obj) => {
      preventButton ? null : callMessageApi(obj.title);
    });
  };

  const renderInputToolbar = (props) => {
    return <InputToolbar {...props} containerStyle={styles.inputToolbar} />;
  };

  const renderSend = (props) => {
    return (
      <>
        {preventButton ? (
          <View style={styles.send}>
            <ActivityIndicator size="small" color="#007bff" />
          </View>
        ) : (
          <Send {...props} textStyle={styles.send}>
            <View style={styles.send}>
              <Image
                source={SendIcon}
                resizeMode="center"
                style={styles.icon}
              />
            </View>
          </Send>
        )}
      </>
    );
  };

  const pressAvatar = (props) => {
    setStopAudio(true);
    navigation.navigate('Profile');
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
          messagesContainerStyle={styles.messageContainer}
          onQuickReply={(reply) => onQuickReply(reply)}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          onPressAvatar={pressAvatar}
          isTyping={typing}
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
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
  },
});

export default ChatDialog;
