import React, { useState, useEffect } from 'react';
import api from '../../API/api';
import { ClanWarData } from '../../API/interfaces';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Sword } from '../../assets/sword.svg';
import { ReactComponent as Star } from '../../assets/star.svg';
import { ReactComponent as Percentage } from '../../assets/percentage.svg';

import io from 'socket.io-client';

const socket = io('http://localhost:3001');


function ClanWar() {
    const [clanTag, setClanTag] = useState('');
    const [urlClanTag, setUrlClanTag] = useState('');
    const [clanData, setClanData] = useState<ClanWarData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const navigate = useNavigate();

    const parentDiv: React.CSSProperties = {
        flexDirection: 'column'
    };

    const clanDPercentageDiv: React.CSSProperties = {
        borderRadius: '4px',
        background: `linear-gradient(to left, rgb(166, 182, 192) ${clanData?.clan.destructionPercentage}%, rgb(166, 182, 192, 0.5) ${clanData?.clan.destructionPercentage}%)`,
    }

    const opponentDPercentageDiv: React.CSSProperties = {
        borderRadius: '4px',
        background: `linear-gradient(to right, rgb(166, 182, 192) ${clanData?.opponent.destructionPercentage}%, rgb(166, 182, 192, 0.5) ${clanData?.opponent.destructionPercentage}%)`,
    }


    useEffect(() => {
        const urlFragment = window.location.hash;

        if (urlFragment && urlFragment.startsWith('#')) {
            setUrlClanTag(urlFragment);
            setShowInput(false);

            if (urlClanTag) fetchData(urlClanTag);
        } else {
            setUrlClanTag('');
            setShowInput(true);
        }

        const fetchDataAndUpdate = async () => {
            try {
                socket.emit('data-update', `clans/${encodeURIComponent('#2GJ99GV90')}/currentwar`);
              
                socket.on('data-update', (data) => {
                    setClanData(data);
                });
               
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataAndUpdate();

      
        const intervalId = setInterval(fetchDataAndUpdate, 500);
        return () => {
            clearInterval(intervalId);
        };
    }, [urlClanTag]);

    const fetchData = async (clanTag: string) => {
        try {
            setIsLoading(true);
            const clanInfo = await api.clanwar.get(encodeURIComponent(clanTag));
            setClanData(clanInfo);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchData(clanTag);
        setSubmitted(true);

        navigate(`/clanwar/${clanTag}`);
    };

    const availableAttacks: number = (clanData?.attacksPerMember ?? 0) * (clanData?.teamSize ?? 0);
    const teamAttacks: number = clanData?.clan.attacks ?? 0;
    const opponentAttacks: number = clanData?.opponent.attacks ?? 0;
    const totalStars: number = (clanData?.teamSize ?? 0) * 3;

    return (
        <div>
        {urlClanTag ? (
            <div>
            {isLoading ? (
                <div className='loading-circle'>
                    <div className='circle'></div>
                </div>
            ) : (clanData && ( 
                <div className='parent-div' style={parentDiv}>
                    <div className="clan-war-div">
                        <div className='svg-div sword-div'><Sword /></div>
                        <div className='svg-div star-div'><Star /></div>
                        <div className='svg-div prc-div'><Percentage /></div>
                        <div className="clan-war-left">
                            <div className="clan-info">
                                <img src={clanData.clan.badgeUrls.small} />
                                <p>{clanData.clan.name}</p>
                            </div>
                            <div className="clan-data">
                                <div className='data-div'>
                                    <div className='data-inner-div'>
                                        <span className='data-span left-0' id='clan-attacks'>{clanData.clan.attacks}</span>
                                        {availableAttacks > 0 && (
                                            Array.from({ length: availableAttacks }, (_, index) => (
                                                <div key={index} className={`stars-divs ${index >= availableAttacks - teamAttacks ? '' : 'not-used'}`}></div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className='data-div'>
                                    <div className='data-inner-div'>
                                        <span className='data-span left-0' id='clan-stars'>{clanData.clan.stars}</span>
                                        {totalStars > 0 && (
                                            Array.from({ length: totalStars }, (_, index) => (
                                                <div key={index} className={`stars-divs ${index >= totalStars - clanData.clan.stars ? '' : 'not-used'}`}></div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className='data-div'>
                                    <div className='data-inner-div' style={clanDPercentageDiv}>
                                        <span className='data-span left-0' id='clan-percentage'>{clanData.clan.destructionPercentage}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="clan-war-right">
                            <div className="clan-info">
                                <img src={clanData.opponent.badgeUrls.small} />
                                <p>{clanData.opponent.name}</p>
                            </div>
                            <div className="clan-data">
                                <div className='data-div'>
                                    <div className='data-inner-div'>
                                        <span className='data-span right-0'>{clanData.opponent.attacks}</span>
                                        {availableAttacks > 0 && (
                                            Array.from({ length: availableAttacks }, (_, index) => (
                                                <div key={index} className={`stars-divs ${index < opponentAttacks ? '' : 'not-used'}`}></div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className='data-div'>
                                    <div className='data-inner-div'>
                                        <span className='data-span right-0'>{clanData.opponent.stars}</span>
                                        {totalStars > 0 && (
                                            Array.from({ length: totalStars }, (_, index) => (
                                                <div key={index} className={`stars-divs ${index < clanData.opponent.stars ? '' : 'not-used'}`}></div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className='data-div'>
                                    <div className='data-inner-div' style={opponentDPercentageDiv}>
                                        <span className='data-span right-0'>{clanData.opponent.destructionPercentage}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )
            )}
            </div>
        ) : (
            <div>
            {!submitted && showInput && (
                <form onSubmit={handleFormSubmit}>
                    <div className='input-div'>
                        <input
                        type="text"
                        name='clan-tag'
                        placeholder='Enter clan tag'
                        className='t-input'
                        value={clanTag}
                        onChange={(e) => setClanTag(e.target.value)}
                        />
                        <button type="submit" className='input-button'>
                        Submit
                        </button>
                    </div>
                </form>
            )}
            {isLoading ? (
                <div className='loading-circle'>
                    <div className='circle'></div>
                </div>
            ) : (submitted && clanData && ( 
                <div className='parent-div' style={parentDiv}>
                    <div className="clan-war-div">
                        <div className='svg-div sword-div'><Sword /></div>
                        <div className='svg-div star-div'><Star /></div>
                        <div className='svg-div prc-div'><Percentage /></div>
                        <div className="clan-war-left">
                            <div className="clan-info">
                                <img src={clanData.clan.badgeUrls.small} />
                                <p>{clanData.clan.name}</p>
                            </div>
                            <div className="clan-data">
                                <div className='data-div'>
                                    <div className='data-inner-div'>
                                        <span className='data-span left-0'>{clanData.clan.attacks}</span>
                                        {availableAttacks > 0 && (
                                            Array.from({ length: availableAttacks }, (_, index) => (
                                                <div key={index} className={`stars-divs ${index >= availableAttacks - teamAttacks ? '' : 'not-used'}`}></div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className='data-div'>
                                    <div className='data-inner-div'>
                                        <span className='data-span left-0'>{clanData.clan.stars}</span>
                                        {totalStars > 0 && (
                                            Array.from({ length: totalStars }, (_, index) => (
                                                <div key={index} className={`stars-divs ${index >= totalStars - clanData.clan.stars ? '' : 'not-used'}`}></div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className='data-div'>
                                    <div className='data-inner-div' style={clanDPercentageDiv}>
                                        <span className='data-span left-0'>{clanData.clan.destructionPercentage}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="clan-war-right">
                            <div className="clan-info">
                                <img src={clanData.opponent.badgeUrls.small} />
                                <p>{clanData.opponent.name}</p>
                            </div>
                            <div className="clan-data">
                                <div className='data-div'>
                                    <div className='data-inner-div'>
                                        <span className='data-span right-0'>{clanData.opponent.attacks}</span>
                                        {availableAttacks > 0 && (
                                            Array.from({ length: availableAttacks }, (_, index) => (
                                                <div key={index} className={`stars-divs ${index < opponentAttacks ? '' : 'not-used'}`}></div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className='data-div'>
                                    <div className='data-inner-div'>
                                        <span className='data-span right-0'>{clanData.opponent.stars}</span>
                                        {totalStars > 0 && (
                                            Array.from({ length: totalStars }, (_, index) => (
                                                <div key={index} className={`stars-divs ${index < clanData.opponent.stars ? '' : 'not-used'}`}></div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className='data-div'>
                                    <div className='data-inner-div' style={opponentDPercentageDiv}>
                                        <span className='data-span right-0'>{clanData.opponent.destructionPercentage}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )
            )}
            </div>
        )}
        </div>
    );
}

export default ClanWar;
