import React from 'react';
import { useChatContext } from 'stream-chat-react';

export const AddChannel = ({ setCreateType, setIsCreating, setIsEditing, setToggleContainer, type, setChannelListUpdated }) => {
    const { client } = useChatContext();

    const handleCreateChannel = async () => {
        try {
            // 💡 Call the Stream Chat API to create the channel.
            // Replace 'your-new-channel-id' and 'Your Channel Name' with dynamic values.
            const newChannel = await client.channel('team', 'your-new-channel-id', {
                name: 'Your Channel Name',
                members: [client.userID]
            }).create();

            await client.setActiveChannel(newChannel);

            // 💡 Call the setter to force the channel list to refresh.
            if (setChannelListUpdated) {
                setChannelListUpdated(prev => !prev);
            }
        } catch (error) {
            console.error("Error creating channel:", error);
        }
    };

    return (
        <svg
            width='14'
            height='14'
            viewBox='0 0 14 14'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            onClick={() => {
                setCreateType(type);
                setIsCreating(prevState => !prevState);
                setIsEditing(false);
                if (setToggleContainer) setToggleContainer(prevState => !prevState);
                
                // 💡 Call the channel creation function
                handleCreateChannel(); 
            }}
        >
            <path
                d='M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM11 7.5H7.5V11H6.5V7.5H3V6.5H6.5V3H7.5V6.5H11V7.5Z'
                fill='white'
                fillOpacity='0.66'
            />
        </svg>
    );
};