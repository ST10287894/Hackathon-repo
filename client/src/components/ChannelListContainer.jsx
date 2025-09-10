import React, { useState } from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from '../components';
import Cookies from 'universal-cookie';
import HospitalIcon from '../assets/hospital.png';
import LogoutIcon from '../assets/logout.png';

const cookies = new Cookies();
const Sidebar = ({ logout }) => (
    <div className="channel-list__sidebar">
        <div className="channel-list__sidebar__icon1">
            <div className="icon1__inner">
                <img src={HospitalIcon} alt='Hospital' width='30' />
            </div>
        </div>
        <div className="channel-list__sidebar__icon2">
            <div className="icon2__inner" onClick={logout}>
                <img src={LogoutIcon} alt='Logout' width='30' />
            </div>
        </div>
    </div>
);

const CompanyHeader = () => (
    <div className='channel-list__header'>
        <p className='channel-list__header__text'>Connect Us</p>
    </div>
);

const customChannelTeamFilter = (channels) => channels.filter((channel) => channel.type === 'team');
const customChannelMessagingFilter = (channels) => channels.filter((channel) => channel.type === 'messaging');

const ChannelListContent = ({ isCreating, setIsCreating, isEditing, setIsEditing, setCreateType, setToggleContainer, channelListUpdated, setChannelListUpdated }) => {
    const { client } = useChatContext();

    const logout = () => {
        cookies.remove('token');
        cookies.remove('userId');
        cookies.remove('username');
        cookies.remove('fullName');
        cookies.remove('avatarURL');
        cookies.remove('phoneNumber');
        cookies.remove('avatarURL');
        cookies.remove('hashedPassword');
        window.location.reload();
    };

    const filters = { members: { $in: [client.userID] } };

    return (
        <>
            <Sidebar logout={logout} />
            <div className='channel-list__list__wrapper'>
                <CompanyHeader />
                <ChannelSearch setToggleContainer={setToggleContainer} />
                <ChannelList
                    filters={filters}
                    channelRenderFilterFn={customChannelTeamFilter}
                    key={channelListUpdated ? 'team-updated' : 'team-unupdated'}
                    List={(listProps) => (
                        <TeamChannelList
                            {...listProps}
                            type="team"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                            setChannelListUpdated={setChannelListUpdated}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                            type="team"
                        />
                    )}
                />
                <ChannelList
                    filters={filters}
                    channelRenderFilterFn={customChannelMessagingFilter}
                    key={channelListUpdated ? 'messaging-updated' : 'messaging-unupdated'}
                    List={(listProps) => (
                        <TeamChannelList
                            {...listProps}
                            type="messaging"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setCreateType={setCreateType}
                            setToggleContainer={setToggleContainer}
                            setChannelListUpdated={setChannelListUpdated}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                            type="messaging"
                        />
                    )}
                />
            </div>
        </>
    );
};

const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing, setChannelListUpdated }) => {
    const [toggleContainer, setToggleContainer] = useState(false);
    
    return (
        <>
            <div className='channel-list__container'>
                <ChannelListContent 
                    setIsCreating={setIsCreating} 
                    setIsEditing={setIsEditing} 
                    setCreateType={setCreateType}
                    setChannelListUpdated={setChannelListUpdated} 
                    setToggleContainer={setToggleContainer}
                />
            </div>

            <div className='channel-list__container-responsive' style={{ left: toggleContainer ? "0%" : "-89%", backgroundColor: "#005fff" }}>
                <div className='channel-list__container-toggle' onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}>
                    <p>Channels</p>
                </div>
                {toggleContainer && (
                    <ChannelListContent 
                        setIsCreating={setIsCreating} 
                        setIsEditing={setIsEditing} 
                        setCreateType={setCreateType} 
                        setToggleContainer={setToggleContainer}
                        setChannelListUpdated={setChannelListUpdated}
                    />
                )}
            </div>
        </>
    );
};

export default ChannelListContainer;