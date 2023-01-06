import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import { useRecipient } from "../hooks/useRecipient";
import { Conversation, IMessage } from "../types";
import {
  convertFirestoreTimestampToString,
  generateQueryGetMessages,
  transformMessage,
} from "../utils/getMessagesInConversation";
import RecipientAvatar from "./RecipientAvatar";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CallIcon from "@mui/icons-material/Call";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useRef,
  useState,
} from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Message from "./Message";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import storage from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const listEmotionIcon = [
  [
    {
      name: "Grinning Face",
      value: "\u{1F600}",
    },
    {
      name: "Grinning Face with Smiling Eyes",
      value: "\u{1F601}",
    },
    {
      name: "Face with Tears of Joy",
      value: "\u{1F602}",
    },
    {
      name: "Smiling Face with Open Mouth",
      value: "\u{1F603}",
    },
    {
      name: "Smiling Face with Open Mouth and Smiling Eyes",
      value: "\u{1F604}",
    },
    {
      name: "Smiling Face with Open Mouth and Cold Sweat",
      value: "\u{1F605}",
    },
    {
      name: "Smiling Face with Open Mouth and Tightly-Closed Eyes",
      value: "\u{1F606}",
    },
    {
      name: "Smiling Face with Halo",
      value: "\u{1F607}",
    },
  ],
  [
    {
      name: "Winking Face",
      value: "\u{1F609}",
    },
    {
      name: "Rolling On The Floor Laughing",
      value: "\u{1F923}",
    },
    {
      name: "Smiling Face with Smiling Eyes",
      value: "\u{1F60A}",
    },
    {
      name: "Slightly Smiling Face",
      value: "\u{1F642}",
    },
    {
      name: "Upside-Down Face",
      value: "\u{1F643}",
    },
  ],
  [
    {
      name: "Kissing Face with Closed Eyes",
      value: "\u{1F61A}",
    },
    {
      name: "Smiling Face with Smiling Eyes and Three Hearts",
      value: "\u{1F970}",
    },
    {
      name: "Kissing Face with Smiling Eyes",
      value: "\u{1F619}",
    },
    {
      name: "White Smiling Face",
      value: "\u{263A}",
    },
    {
      name: "Smiling Face with Heart-Shaped Eyes",
      value: "\u{1F60D}",
    },
    {
      name: "Kissing Face",
      value: "\u{1F617}",
    },
    {
      name: "Grinning Face With Star Eyes",
      value: "\u{1F929}",
    },
    {
      name: "Face Throwing a Kiss",
      value: "\u{1F618}",
    },
  ],

  [
    {
      name: "Face Savouring Delicious Food",
      value: "\u{1F60B}",
    },
    {
      name: "Face with Stuck-Out Tongue",
      value: "\u{1F61B}",
    },
    {
      name: "Face with Stuck-Out Tongue and Winking Eye",
      value: "\u{1F61C}",
    },
    {
      name: "Grinning Face With One Large And One Small Eye",
      value: "\u{1F92A}",
    },
    {
      name: "Face with Stuck-Out Tongue and Tightly-Closed Eyes",
      value: "\u{1F61D}",
    },
    {
      name: "Money-Mouth Face",
      value: "\u{1F911}",
    },
  ],
  [
    {
      name: "Thinking Face",
      value: "\u{1F914}",
    },
    {
      name: "Smiling Face With Smiling Eyes And Hand Covering Mouth",
      value: "\u{1F92D}",
    },
    {
      name: "Hugging Face",
      value: "\u{1F917}",
    },
    {
      name: "Face With Finger Covering Closed Lips",
      value: "\u{1F92B}",
    },
  ],
  [
    {
      name: "Neutral Face",
      value: "\u{1F610}",
    },
    {
      name: "Face Without Mouth",
      value: "\u{1F636}",
    },
    {
      name: "Face With One Eyebrow Raised",
      value: "\u{1F928}",
    },
    {
      name: "Grimacing Face",
      value: "\u{1F62C}",
    },
    {
      name: "Smirking Face",
      value: "\u{1F60F}",
    },
    {
      name: "Expressionless Face",
      value: "\u{1F611}",
    },
    {
      name: "Unamused Face",
      value: "\u{1F612}",
    },
    {
      name: "Face With Rolling Eyes",
      value: "\u{1F644}",
    },
  ],
  [
    {
      name: "Zipper-Mouth Face",
      value: "\u{1F910}",
    },
    {
      name: "Lying Face",
      value: "\u{1F925}",
    },
  ],
  [
    {
      name: "Relieved Face",
      value: "\u{1F60C}",
    },
    {
      name: "Pensive Face",
      value: "\u{1F614}",
    },
    {
      name: "Sleepy Face",
      value: "\u{1F62A}",
    },
    {
      name: "Sleeping Face",
      value: "\u{1F634}",
    },
    {
      name: "Drooling Face",
      value: "\u{1F924}",
    },
  ],
  [
    {
      name: "Freezing Face",
      value: "\u{1F976}",
    },
    {
      name: "Sneezing Face",
      value: "\u{1F927}",
    },
    {
      name: "Face with Medical Mask",
      value: "\u{1F637}",
    },
    {
      name: "Shocked Face With Exploding Head",
      value: "\u{1F92F}",
    },
    {
      name: "Face with Uneven Eyes and Wavy Mouth",
      value: "\u{1F635}",
    },
    {
      name: "Face With Thermometer",
      value: "\u{1F912}",
    },
    {
      name: "Overheated Face",
      value: "\u{1F975}",
    },
  ],
  [
    {
      name: "Face With Open Mouth Vomiting",
      value: "\u{1F92E}",
    },
    {
      name: "Face With Head-Bandage",
      value: "\u{1F915}",
    },
    {
      name: "Nauseated Face",
      value: "\u{1F922}",
    },
    {
      name: "Disguised Face",
      value: "\u{1F978}",
    },
    {
      name: "Face with Cowboy Hat",
      value: "\u{1F920}",
    },
    {
      name: "Face with Party Horn and Party Hat",
      value: "\u{1F973}",
    },
  ],
  [
    {
      name: "Nerd Face",
      value: "\u{1F913}",
    },
    {
      name: "Smiling Face with Sunglasses",
      value: "\u{1F60E}",
    },
    {
      name: "Face With Monocle",
      value: "\u{1F9D0}",
    },
  ],
  [
    {
      name: "Confused Face",
      value: "\u{1F615}",
    },
    {
      name: "Confounded Face",
      value: "\u{1F616}",
    },
    {
      name: "Anguished Face",
      value: "\u{1F627}",
    },
    {
      name: "Face with Pleading Eyes",
      value: "\u{1F97A}",
    },
    {
      name: "Tired Face",
      value: "\u{1F62B}",
    },
    {
      name: "Face Screaming In Fear",
      value: "\u{1F631}",
    },
    {
      name: "Disappointed Face",
      value: "\u{1F61E}",
    },
    {
      name: "Hushed Face",
      value: "\u{1F62F}",
    },
  ],
  [
    {
      name: "Face with Open Mouth",
      value: "\u{1F62E}",
    },
    {
      name: "Loudly Crying Face",
      value: "\u{1F62D}",
    },
    {
      name: "Worried Face",
      value: "\u{1F61F}",
    },
    {
      name: "Face with Cold Sweat",
      value: "\u{1F613}",
    },
    {
      name: "Weary Face",
      value: "\u{1F629}",
    },
    {
      name: "Crying Face",
      value: "\u{1F622}",
    },
    {
      name: "Astonished Face",
      value: "\u{1F632}",
    },
    {
      name: "Fearful Face",
      value: "\u{1F628}",
    },
  ],
  [
    {
      name: "Yawning Face",
      value: "\u{1F971}",
    },
    {
      name: "Flushed Face",
      value: "\u{1F633}",
    },
    {
      name: "Slightly Frowning Face",
      value: "\u{1F641}",
    },
    {
      name: "Disappointed But Relieved Face",
      value: "\u{1F625}",
    },
    {
      name: "Persevering Face",
      value: "\u{1F623}",
    },
    {
      name: "Frowning Face with Open Mouth",
      value: "\u{1F626}",
    },
    {
      name: "White Frowning Face",
      value: "\u{2639}",
    },
    {
      name: "Face with Open Mouth and Cold Sweat",
      value: "\u{1F630}",
    },
  ],
  [
    {
      name: "Skull and Crossbones",
      value: "\u{2620}",
    },
    {
      name: "Face with Look of Triumph",
      value: "\u{1F624}",
    },
    {
      name: "Smiling Face with Horns",
      value: "\u{1F608}",
    },
    {
      name: "Pouting Face",
      value: "\u{1F621}",
    },
    {
      name: "Skull",
      value: "\u{1F480}",
    },
    {
      name: "Imp",
      value: "\u{1F47F}",
    },
    {
      name: "Serious Face With Symbols Covering Mouth",
      value: "\u{1F92C}",
    },
    {
      name: "Angry Facee",
      value: "\u{1F620}",
    },
  ],
  [
    {
      name: "Pile of Poo",
      value: "\u{1F4A9}",
    },
    {
      name: "Clown Face",
      value: "\u{1F921}",
    },
    {
      name: "Robot Face",
      value: "\u{1F916}",
    },
    {
      name: "Extraterrestrial Alien",
      value: "\u{1F47D}",
    },
    {
      name: "Alien Monster",
      value: "\u{1F47E}",
    },
    {
      name: "Ghost",
      value: "\u{1F47B}",
    },
    {
      name: "Japanese Goblin",
      value: "\u{1F47A}",
    },
    {
      name: "Japanese Ogre",
      value: "\u{1F479}",
    },
  ],
  [
    {
      name: "Weary Cat Face",
      value: "\u{1F640}",
    },
    {
      name: "Kissing Cat Face with Closed Eyes",
      value: "\u{1F63D}",
    },
    {
      name: "Grinning Cat Face with Smiling Eyes",
      value: "\u{1F638}",
    },
    {
      name: "Crying Cat Face",
      value: "\u{1F63F}",
    },
    {
      name: "Pouting Cat Face",
      value: "\u{1F63E}",
    },
    {
      name: "Smiling Cat Face with Heart-Shaped Eyes",
      value: "\u{1F63B}",
    },
    {
      name: "Smiling Cat Face with Open Mouth",
      value: "\u{1F63A}",
    },
    {
      name: "Cat Face with Wry Smile",
      value: "\u{1F63C}",
    },
  ],
  [
    {
      name: "Cat Face with Tears of Joy",
      value: "\u{1F639}",
    },
  ],
  [
    {
      name: "Hear-No-Evil Monkey",
      value: "\u{1F649}",
    },
    {
      name: "Speak-No-Evil Monkey",
      value: "\u{1F64A}",
    },
    {
      name: "See-No-Evil Monkey",
      value: "\u{1F648}",
    },
  ],
  [
    {
      name: "Black Heart Symbol",
      value: "\u{2764}",
    },
    {
      name: "Hundred Points Symbol",
      value: "\u{1F4AF}",
    },
    {
      name: "Two Hearts",
      value: "\u{1F495}",
    },
    {
      name: "Love Letter",
      value: "\u{1F48C}",
    },
    {
      name: "White Heart",
      value: "\u{1F90D}",
    },
    {
      name: "Blue Heart",
      value: "\u{1F499}",
    },
  ],
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export interface SimpleDialogProps {
  open: boolean;
  setNewMessage: (value: any) => void;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, setNewMessage, open } = props;
  const [value, setValue] = useState(0);

  const handleClose = () => {
    onClose("");
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Emoji" {...a11yProps(0)} />
            <Tab label="Activity" {...a11yProps(1)} />
            <Tab label="Enimals" {...a11yProps(2)} />
          </Tabs>
        </Box>{" "}
        <TabPanel value={value} index={0}>
          <List sx={{ pt: 0 }}>
            {listEmotionIcon.map((emotion, index) => (
              <ListItem key={index} disableGutters alignItems="center">
                <ListItemButton
                  onClick={(event) =>
                    setNewMessage((prev: any) => prev + event.target.innerText)
                  }
                >
                  <>
                    {emotion.map((item, index) => (
                      <StyledRowEmotion key={item.name}>
                        {item.value}
                      </StyledRowEmotion>
                    ))}
                  </>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <List sx={{ pt: 0 }}>
            {listEmotionIcon.map((emotion, index) => (
              <ListItem key={index} disableGutters alignItems="center">
                <ListItemButton
                  onClick={(event) =>
                    setNewMessage((prev: any) => prev + event.target.innerText)
                  }
                >
                  <>
                    {emotion.map((item, index) => (
                      <StyledRowEmotion key={item.name}>
                        {item.value}
                      </StyledRowEmotion>
                    ))}
                  </>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <List sx={{ pt: 0 }}>
            {listEmotionIcon.map((emotion, index) => (
              <ListItem key={index} disableGutters alignItems="center">
                <ListItemButton
                  onClick={(event) =>
                    setNewMessage((prev: any) => prev + event.target.innerText)
                  }
                >
                  <>
                    {emotion.map((item, index) => (
                      <StyledRowEmotion key={item.name}>
                        {item.value}
                      </StyledRowEmotion>
                    ))}
                  </>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Box>
    </Dialog>
  );
}

const ConversationScreen = ({
  conversation,
  messages,
}: {
  conversation: Conversation;
  messages: IMessage[];
}) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const [isOpenIcon, setIsOpenIcon] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState("");

  const conversationUsers = conversation.users;

  const { recipientEmail, recipient } = useRecipient(conversationUsers);

  const router = useRouter();
  const conversationId = router.query.id; // localhost:3000/conversations/:id

  const queryGetMessages = generateQueryGetMessages(conversationId as string);

  const [messagesSnapshot, messagesLoading, __error] =
    useCollection(queryGetMessages);

  const showMessages = () => {
    // If front-end is loading messages behind the scenes, display messages retrieved from Next SSR (passed down from [id].tsx)
    if (messagesLoading) {
      return messages.map((message) => (
        <Message key={message.id} message={message} />
      ));
    }

    // If front-end has finished loading messages, so now we have messagesSnapshot
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message key={message.id} message={transformMessage(message)} />
      ));
    }

    return null;
  };

  const addMessageToDbAndUpdateLastSeen = async () => {
    // update last seen in 'users' collection
    await setDoc(
      doc(db, "users", loggedInUser?.email as string),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    ); // just update what is changed

    // add new message to 'messages' collection
    await addDoc(collection(db, "messages"), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: newMessage,
      user: loggedInUser?.email,
    });

    // reset input field
    setNewMessage("");

    // scroll to bottom
    scrollToBottom();
  };

  const sendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!newMessage) return;
      addMessageToDbAndUpdateLastSeen();
    }
  };

  const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    if (!newMessage) return;
    addMessageToDbAndUpdateLastSeen();
  };

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleClickOpen = () => {
    setIsOpenIcon(true);
  };

  const handleClose = () => {
    setIsOpenIcon(false);
  };

  function handleChange(e) {
	const reader = new FileReader();
    let file = e.target.files[0]; // get the supplied file
    // if there is a file, set image to that file
    if (file) {
      reader.onload = () => {
        if (reader.readyState === 2) {
          console.log(file);
          setFile(file);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    // if there is no file, set image back to null
    } else {
      setFile(null);
    }
  }
  function uploadToFirebase () {
	e.preventDefault()
    if (file) {
		//2.
		const storageRef = storage.ref();
		//3.
		const imageRef = storageRef.child(file.name);
		//4.
		imageRef.put(file)
	   //5.
	   .then(() => {
		  alert("Image uploaded successfully to Firebase.");
	  });
	  } else {
		alert("Please upload an image first.");
	  }
  }
  return (
    <>
      <StyledRecipientHeader>
        <RecipientAvatar
          recipient={recipient}
          recipientEmail={recipientEmail}
        />

        <StyledHeaderInfo>
          <StyledH3>{recipientEmail}</StyledH3>
          {recipient && (
            <span>
              Last active:{" "}
              {convertFirestoreTimestampToString(recipient.lastSeen)}
            </span>
          )}
        </StyledHeaderInfo>

        <StyledHeaderIcons>
          {" "}
          <IconButton>
            <CallIcon />
          </IconButton>
          <IconButton>
            <VideoCallIcon />
          </IconButton>
          <IconButton>
            <ReportGmailerrorredIcon />
          </IconButton>
        </StyledHeaderIcons>
      </StyledRecipientHeader>

      <StyledMessageContainer>
        {showMessages()}
        {/* for auto scroll to the end when a new message is sent */}
        <EndOfMessagesForAutoScroll ref={endOfMessagesRef} />
      </StyledMessageContainer>

      {/* Enter new message */}
      <StyledInputContainer>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
        >
          <input hidden accept="image/*" type="file" onChange={e => handleChange(e)} />
          <AttachFileIcon />
        </IconButton>
        <button onClick={uploadToFirebase}>Upload to Firebase</button>
        <IconButton onClick={handleClickOpen}>
          <InsertEmoticonIcon />
        </IconButton>
        <SimpleDialog
          setNewMessage={setNewMessage}
          open={isOpenIcon}
          onClose={handleClose}
        />

        <StyledInput
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyDown={sendMessageOnEnter}
        />
        <IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
          <SendIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  );
};

const StyledRecipientHeader = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  align-items: center;
  padding: 11px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const StyledHeaderInfo = styled.div`
  flex-grow: 1;

  > h3 {
    margin-top: 0;
    margin-bottom: 3px;
  }

  > span {
    font-size: 14px;
    color: gray;
  }
`;

const StyledH3 = styled.h3`
  word-break: break-all;
`;

const StyledHeaderIcons = styled.div`
  display: flex;
`;

const StyledMessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const StyledInputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 15px;
  margin-left: 15px;
  margin-right: 15px;
`;

const EndOfMessagesForAutoScroll = styled.div`
  margin-bottom: 30px;
`;

const StyledRowEmotion = styled.div`
  padding: 0 10px;
`;
export default ConversationScreen;
