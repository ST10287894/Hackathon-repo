import React, { useState } from 'react';
import { MessageList, MessageInput, Thread, Window, useChannelActionContext, Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react';
import { ChannelInfo } from '../assets';

export const GiphyContext = React.createContext({});

const TeamChannelHeader = ({ setIsEditing }) => {
    const { channel } = useChannelStateContext();
    const { client } = useChatContext();

    // 💡 Check if the current user has the 'update-channel' permission
    const hasPermission = channel.data.created_by.id === client.userID;
    
    // 💡 The MessagingHeader component is missing, let's include it here.
    const MessagingHeader = () => {
        const members = Object.values(channel.state.members).filter(({ user }) => user?.id !== client?.userID);
        
        const additionalMembers = members.length - 3;

        if (channel.type === 'messaging') {
            return (
                <div className='team-channel-header__name-wrapper'>
                    {members.map(({ user }, i) => (
                        <div key={i} className='team-channel-header__name-multi'>
                            <Avatar 
                                key={user?.image} 
                                image={user?.image} 
                                name={user?.fullName || user?.id} 
                                size={32} 
                            />
                            <p className='team-channel-header__name user'>{user?.fullName || user?.id}</p>
                        </div>
                    ))}
                    {additionalMembers > 0 && <p className='team-channel-header__name user'>and {additionalMembers} more</p>}
                </div>
            );
        }

        return (
            <div className='team-channel-header__channel-wrapper'>
                <p className='team-channel-header__name'># {channel.data.name || channel.data.id}</p>
                <span style={{ display: 'flex' }} onClick={() => setIsEditing(true)}>
                    <ChannelInfo />
                </span>
            </div>
        );
    };

    const getWatcherText = (watchers) => {
        if (!watchers) return 'No users online';
        if (watchers === 1) return '1 user online';
        return `${watchers} users online`;
    };

    return (
        <div className='team-channel-header__container'>
            <MessagingHeader />
            <div className='team-channel-header__right'>
                <p className='team-channel-header__right-text'>{getWatcherText(client?.state?.watchers)}</p>
            </div>
        </div>
    );
};

const ChannelInner = ({ setIsEditing }) => {
    const [giphyState, setGiphyState] = useState(false);
    const { sendMessage } = useChannelActionContext();

    const overrideSubmitHandler = (message) => {
        let updatedMessage = {
            attachments: message.attachments,
            mentioned_users: message.mentioned_users,
            parent_id: message.parent?.id,
            parent: message.parent,
            text: message.text,
        };

        if (giphyState) {
            updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
        }

        if (sendMessage) {
            sendMessage(updatedMessage);
            setGiphyState(false);
        }
    };

    return (
        <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
            <div style={{ display: 'flex', width: '100%' }}>
                <Window>
                    <TeamChannelHeader setIsEditing={setIsEditing} />
                    <MessageList />
                    <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
                </Window>
                <Thread />
            </div>
        </GiphyContext.Provider>
    );
};

export default ChannelInner;