import { Event } from 'models';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loading } from "react-loading-wrapper";
const EventLog = () => {
    const [filteredEvents, setFilteredEvents] = useState<Event[]>();
    const [offset, setOffset] = useState<number>(0);
    const [more, setMore] = useState<boolean>(true);
    const [searchFilters, setSearchFilters] = useState<string>(`sorting=+date`)
    const getFilteredEvents = async() => {
        const {data} = await axios.get(`http://localhost:3001/events/all-filtered?${searchFilters}&&offset=${offset+10}`);
        const filteredEvents = data.events;
        const hasMore:boolean = data.more;
        setOffset(offset+ 10)
        setMore(hasMore);
        if(filteredEvents) setFilteredEvents(filteredEvents);
    }

    useEffect(() => {
        getFilteredEvents();
    },[])
    useEffect(() => {
        setOffset(0);
    },[searchFilters]);

    return (
        <div className='eventTile'>
            <div id="scrollableDiv" className="eventContainer">
            {filteredEvents &&
            <InfiniteScroll
            dataLength={filteredEvents ? filteredEvents.length : 0} //This is important field to render the next data
            next={getFilteredEvents}
            scrollableTarget="scrollableDiv"
            style={{width:'100%'}}
            hasMore={more}
            loader={<Loading loading={true}/>}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
                </p>
            }>
                {
                    filteredEvents?.map((event:Event) => {
                    return     <div className='eventCard'
                    style={{ backgroundColor: 'rgb(180, 199, 216)' }}
                  >
                    <div id={event.name} className="eventName">{event.name}</div>
                    <div className="eventContent">{event.date}</div>
                  </div>
                    })
                }
            </InfiniteScroll>
            }
            </div>
            {/* <h1 style={{margin:'auto'}}>Log Of All Events</h1> */}
            {/* <div className="eventContainer">

            </div> */}
        </div>
    );
};

export default EventLog;