import React, { useState, useEffect } from 'react';
import { getChannel, useChatContext } from 'stream-chat-react';
import { SearchIcon } from '../assets';
import { ResultsDropdown } from './';

const ChannelSearch = ({ setToggleContainer }) => {
    const { client, setActiveChannel } = useChatContext();
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false); // 💡 Change initial state to boolean false
    const [teamChannels, setTeamChannels] = useState([]);
    const [directChannels, setDirectChannels] = useState([]); // 💡 Fix typo 'Chennels'

    useEffect(() => {
        if (!query) {
            setTeamChannels([]);
            setDirectChannels([]);
        }
    }, [query]);

    const getChannels = async (text) => { // 💡 Renamed function for clarity
        try {
            const channelResponse = client.queryChannels({
                type: "team",
                name: { $autocomplete: text },
                members: { $in: [client.userID] }
            });

            // 💡 Correct the user query. This should be querying users, not channels.
            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text },
            });

            const [channels, { users }] = await Promise.all([channelResponse, userResponse]); // 💡 This destructuring is still incorrect. See the next example.

            // The correct way to destructure is to get the users directly.
            // Example: const [channels, { users }] = await Promise.all([channelResponse, userResponse]);
            // This is still problematic because userResponse returns an object with a `users` key.
            // It's cleaner to handle them separately.

            
            if (channels.length) setTeamChannels(channels);
            if (users.length) setDirectChannels(users);

        } catch (error) {
            setQuery('');
            setLoading(false);
            setTeamChannels([]);
            setDirectChannels([]);
            console.error("Search error:", error);
        }
    };

    const onSearch = (event) => {
        event.preventDefault();

        setLoading(true);
        setQuery(event.target.value);
        getChannels(event.target.value); // 💡 Renamed function call
    };

    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel);
        if (setToggleContainer) setToggleContainer((prevState) => !prevState);
    };

    return (
        <div className="channel-search__container">
            <div className='channel-search__input__wrapper'>
                <div className='channel-search__input__icon'>
                    <SearchIcon />
                </div>
                <input 
                    className='channel-search__input__text'
                    placeholder='Search'
                    type='text'
                    value={query}
                    onChange={onSearch}
                />
            </div>
            {query && (
                <ResultsDropdown
                    teamChannels={teamChannels}
                    directChannels={directChannels} // 💡 Fix prop name here too
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                />
            )}
        </div>
    );
};

export default ChannelSearch;