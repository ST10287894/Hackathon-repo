import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    const handleChange = (event) => {
        event.preventDefault();
        setChannelName(event.target.value);
    };

    return (
        <div className='channel-name-input__wrapper'>
            <p>Name</p>
            <input 
                value={channelName}
                onChange={handleChange}
                placeholder='channel-name'
            />
            <p>Add Members</p>
        </div>
    );
};

const EditChannel = ({ setIsEditing }) => {
    const { channel } = useChatContext();
    const [channelName, setChannelName] = useState(channel?.data?.name);
    
    // 💡 Initialize selectedUsers with the existing members to start
    const [selectedUsers, setSelectedUsers] = useState(
        Object.values(channel.state.members).map(({ user }) => user?.id || '')
    );

    const updateChannel = async (event) => {
        event.preventDefault();

        try {
            // 💡 Safer name change check
            const nameChanged = channelName !== (channel.data.name);

            if (nameChanged) {
                await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}` });
            }

            // 💡 Handle member updates (add or remove)
            const currentMembers = Object.keys(channel.state.members);
            const membersToAdd = selectedUsers.filter(user => !currentMembers.includes(user));
            const membersToRemove = currentMembers.filter(user => !selectedUsers.includes(user) && user !== channel.data.created_by.id);

            if (membersToAdd.length) {
                await channel.addMembers(membersToAdd);
            }
            if (membersToRemove.length) {
                await channel.removeMembers(membersToRemove);
            }

            setChannelName('');
            setIsEditing(false);
            setSelectedUsers([]);
            window.location.reload(); // 💡 Force a page reload to see changes
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='edit-channel__container'>
            <div className='edit-channel__header'>
                <p>Edit Channel</p>
                <CloseCreateChannel setIsEditing={setIsEditing} />
            </div>

            <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
            
            {/* 💡 Pass down the list of pre-selected users */}
            <UserList 
                setSelectedUsers={setSelectedUsers} 
                initialSelectedUsers={selectedUsers} 
            />

            <div className='edit-channel__button-wrapper' onClick={updateChannel}>
                <p>Save Changes</p>
            </div>
        </div>
    );
};

export default EditChannel;