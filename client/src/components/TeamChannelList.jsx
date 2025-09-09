import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import { AddChannel } from '../assets';

const TeamChannelList = ({ children, error = false, loading, type, isCreating, setIsCreating, setIsEditing, setCreateType, setToggleContainer, setChannelListUpdated }) => {
    if(error) {
        return type === 'team' ? (
            <div className='team-channel-list'>
                <p className='team-channel-list__message'>
                    Connection error, please wait for a few minutes and try again.
                </p>
            </div>
        ) : null;
    }

    if(loading) {
        return (
            <div className='team-channel-list'>
                <p className='team-channel-list__message'>
                    {type === 'team' ? 'Channels' : 'Message'} loading....
                </p>
            </div>
        );
    }
    
    return (
        <div className='team-channel-list'>
            <div className='team-channel__header'>
                <p className='team-channel-list__header__title'>
                    {type === 'team' ? 'Channels' : 'Direct Messages'}
                </p>
                <AddChannel 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setIsEditing={setIsEditing}
                    setCreateType={setCreateType}
                    type={type}
                    setToggleContainer={setToggleContainer}
                    // 💡 Pass the setter down
                    setChannelListUpdated={setChannelListUpdated}
                />
            </div>
            {children}
        </div>
    );
};
export default TeamChannelList;