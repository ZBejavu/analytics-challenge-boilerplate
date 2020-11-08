import { browser, Event, eventName } from 'models';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {InputLabel, Select, MenuItem, TextField} from '@material-ui/core'
import {getDateInFormat} from './dateHelpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loading } from "react-loading-wrapper";
import Accordion from '@material-ui/core/Accordion';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PageviewIcon from '@material-ui/icons/Pageview';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
type sorting = '+date' | '-date';
interface LogEvent extends Event {
    userName?: string
}
const EventLog = () => {
    const [filteredEvents, setFilteredEvents] = useState<LogEvent[]>();
    const [offset, setOffset] = useState<number>(20);
    const [more, setMore] = useState<boolean>(true);
    const [browserFilter, setBrowserFilter] = useState<browser | undefined>();
    const [typeFilter, setTypeFilter] = useState<eventName | undefined>();
    const [searchRegex, setSearchRegex] = useState<RegExp | string |undefined>()
    const [sortFilters, setSortFilters] = useState<sorting>(`+date`)
    const getFilteredEvents = async() => {
        let searchQuery = `sorting=${sortFilters}`;
        if(browserFilter){
            searchQuery+=`&&browser=${browserFilter}`;
        }
        if(typeFilter){
            searchQuery+=`&&type=${typeFilter}`;
        }
        if(searchRegex){
            searchQuery+=`&&search=${searchRegex}`;
        }
        const {data} = await axios.get(`http://localhost:3001/events/all-filtered?${searchQuery}&&offset=${offset+10}`);
        const filteredEvents:Event[] = data.events;
/*         Promise.all(filteredEvents.map(async (event:Event) => {
            const {data} = await axios.get(`http://localhost:3001/events/userNameByuuid/${event.distinct_user_id}`)
            const userName:string = data;
            return {...event , userName }
        })).then((values:LogEvent[]) => {
            setFilteredEvents(values);
        }) */
        // a cool feature potentially but has very very poor performance

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
        getFilteredEvents();
    },[sortFilters, searchRegex, typeFilter, browserFilter]);

    return (
        <div className='eventTile'>
            <div className='logFilters'>

                <TextField id="standard-basic" label="Standard" onChange={(e)=> setSearchRegex(e.target.value as RegExp | string | undefined)}/>
                {/* sort by date -----------------------------------*/}

                <InputLabel shrink id="sortSelect">Sort</InputLabel>
                <Select
                labelId="sortSelect"
                id="sort"
                value={sortFilters}
                placeholder={sortFilters}
                onChange={(e) => {
                    setSortFilters(e.target.value as sorting)
                }}
                displayEmpty
                >
                    <MenuItem value="+date"><em>+Date</em></MenuItem>
                    <MenuItem value="-date"><em>-Date</em></MenuItem>
                </Select>

                {/* filter by type -----------------------------------*/}

                <InputLabel shrink id="typeFilter">Type</InputLabel>
                <Select
                labelId="typeFilter"
                id="type"
                value={typeFilter}
                onChange={(e) => {
                    setTypeFilter(e.target.value as eventName | undefined)
                }}
                displayEmpty
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value={"login"}>Login</MenuItem>
                    <MenuItem value={"signup"}>Signup</MenuItem>
                    <MenuItem value={"pageView"}>Page View</MenuItem>
                </Select>
                
                {/* filter by browser -----------------------------------*/}

                <InputLabel shrink id="browserFilter">Browser</InputLabel>
                <Select
                labelId="browserFilter"
                id="browser"
                value={browserFilter}
                onChange={(e) => {
                    setBrowserFilter(e.target.value as browser | undefined)
                }}
                displayEmpty
                // className={classes.selectEmpty}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value={"chrome"}>Chrome</MenuItem>
                    <MenuItem value={"safari"}>Safari</MenuItem>
                    <MenuItem value={"edge"}>Edge</MenuItem>
                    <MenuItem value={"firefox"}>FireFox</MenuItem>
                    <MenuItem value={"ie"}>IE</MenuItem>
                    <MenuItem value={"other"}>other</MenuItem>
                </Select>

            </div>
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
                <b>End of the line :)</b>
                </p>
            }>
                {
                    filteredEvents?.map((event:LogEvent) => {
                    return <Accordion key={event._id} style={{width:'40vw'}}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                          {
                              event.name === 'login' ?
                            <AccountCircleIcon />:
                            event.name === 'signup' ?
                            <PersonAddIcon /> :
                            event.name === 'pageView' ?
                            <PageviewIcon />:
                            <SupervisorAccountIcon />
                          }
                          <b>{`   ${event.name}`}</b></Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                            Date : {getDateInFormat(event.date)}<br/>
                            Os : {event.os}<br/>
                            Browser : {event.browser}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>    
                    })
                }
            </InfiniteScroll>
            }
            </div>
        </div>
    );
};

export default EventLog;