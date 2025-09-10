import React, { useState } from 'react';
import { MessageList, MessageInput, Thread, Window, useChannelActionContext, Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react';
import { ChannelInfo } from '../assets';
import VideoRoom from '../video/VideoRoom';

export const GiphyContext = React.createContext({});

const TeamChannelHeader = ({ setIsEditing }) => {
    const { channel } = useChannelStateContext();
    const { client } = useChatContext();
    const [showVideo, setShowVideo] = useState(false);

    // 💡 Check if the current user has the 'update-channel' permission
    // eslint-disable-next-line no-unused-vars
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
        <>
            <div className='team-channel-header__container'>
                <MessagingHeader />
                <div className='team-channel-header__right'>
                    <p className='team-channel-header__right-text'>{getWatcherText(client?.state?.watchers)}</p>
                    
                    <button className="team-channel-header__video-btn"
                        onClick={() => setShowVideo(true)}
                        title="Start / join video room"
                        style={{ marginLeft: 12, background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                        d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4z"
                        fill="#005fff"
                        />
                    </svg>
                    </button>
                </div>
            </div>
            {showVideo && <VideoRoom roomName={channel.data.name || channel.data.id} onClose={() => setShowVideo(false)} />}
        </>
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