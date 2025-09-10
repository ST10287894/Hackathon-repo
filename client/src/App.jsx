import React, { useState, useEffect } from 'react';
import { StreamChat } from "stream-chat";
import { Chat, MessageInput, MessageSimple } from "stream-chat-react";
import Cookies from "universal-cookie";

import { ChannelListContainer, ChannelContainer, Auth } from './components';
import './App.css';
import 'stream-chat-react/dist/css/index.css';
//handles authentication , Initializes and manages the connection to the Stream Chat, 
// Maintains state for channel creation/editing modes and application reloads.
//Renders the overall layout containing both the channel list sidebar and the main channel view.
const cookies = new Cookies();
const apiKey = "uxfmm5h67nmx";

const App = () => {
    const [client, setClient] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [createType, setCreateType] = useState('');
    const [reloadKey, setReloadKey] = useState(0); 

    const authToken = cookies.get('token');

    useEffect(() => {
        if (!authToken) {
            return;
        }

        const newClient = new StreamChat(apiKey);

        newClient.connectUser(
            {
                id: cookies.get('userId'),
                name: cookies.get('username'),
                fullName: cookies.get('fullName'),
                image: cookies.get('avatarURL'),
            },
            authToken,
        ).then(() => {
            setClient(newClient);
        }).catch((error) => {
            console.error("Stream Chat Connection Error:", error);
            setClient(null);
        });

        return () => newClient.disconnectUser();
    }, [authToken, apiKey]);

    if (!authToken) {
        return <Auth />;
    }

    return (
        <div className='app__wrapper'>
            {client && (
                <Chat
                    client={client}
                    theme="team light"
                    key={reloadKey}
                    components={{
                        Emoji: () => null,
                        MessageSimple: (props) => (
                            <div className="str-chat__message-simple">
                                <p>{props.message.text}</p>
                            </div>
                        ),
                        MessageInput: (props) => (
                          <MessageInput {...props} emojiPicker={false} />
                        ),
                    }}
                >
                    <ChannelListContainer
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        setCreateType={setCreateType}
                        setReloadKey={setReloadKey}
                    />

                    <ChannelContainer
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        createType={createType}
                    />
                </Chat>
            )}
        </div>
    );
};

export default App;