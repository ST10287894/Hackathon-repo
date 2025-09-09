import React, { useState, useEffect } from 'react';
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";

import {ChannelListContainer, ChannelContainer, Auth} from './components';
import './App.css';
import 'stream-chat-react/dist/css/index.css';

const cookies = new Cookies();
const apiKey = "uxfmm5h67nmx";

const App = () => {
  const [client, setClient] = useState(null);
  const authToken = cookies.get('token');

  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (authToken) {
      const client = new StreamChat(apiKey);
      
      client.connectUser({
        id: cookies.get('userId'),
        name: cookies.get('username'),
        fullName: cookies.get('fullName'),
        image: cookies.get('avatarURL'),
      }, authToken)
      .then(() => {
        setClient(client);
      })
      .catch((error) => {
        console.error("Stream Chat Connection Error:", error);
        setClient(null);
      });
    }
  }, [authToken, apiKey]);

  if (!authToken) {
    return <Auth />;
  }

  return (
    
    <div className='app__wrapper'>
      {client && (
        <Chat client={client} theme="team light">
          <ChannelListContainer 
            isCreating = {isCreating}
            setIsCreating = {setIsCreating}
            setIsEditing = {setIsEditing}
            setCreateType = {setCreateType}
          />
            
          <ChannelContainer 
            isCreating = {isCreating}
            setIsCreating = {setIsCreating}
            isEditing = {isEditing}
            setIsEditing = {setIsEditing}
            createType = {createType}
          />
        </Chat>
      )}
    </div>
  );
}

export default App;
