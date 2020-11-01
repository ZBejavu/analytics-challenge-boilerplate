///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
  getAllEvents,
  addEvent,
  getUniqueWeekSessions,
  getUniqueDaySessions,
  getTodaysEvents,
  getWeeksEvents,
  getEventByBrowser,
  getEventByType,
  getEventBySearch,
  getEventByDate
} from "./database";
import { browser, Event, eventName, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import mockData from './__tests__/mock_data';
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

router.get('/all', (req: Request, res: Response) => {
  const allEvents = getAllEvents();
  res.send(allEvents)
});

router.get('/all-filtered', (req: Request, res: Response) => {
  const offset = req.query.offset;
  const browser:browser = req.query.browser;
  const search:RegExp = req.query.search;
  const type:eventName = req.query.type;
  const sort:'+date'|'-date' = req.query.sorting;
  let more:boolean = false;
  let filteredEvents : Event[];
  filteredEvents = getAllEvents();
  if(browser){
    filteredEvents = getEventByBrowser(browser, filteredEvents);
  }
  if(sort){
    // console.log('--------------',sort)
    filteredEvents = getEventByDate(sort, filteredEvents);
  }
  if(search){
    // console.log('--------------',search)
    filteredEvents = getEventBySearch(search, filteredEvents);
  }
  if(type){
    filteredEvents = getEventByType(type, filteredEvents);
    // console.log('-------------------------------------',filteredEvents);
  }
  if(offset){
    if(offset < filteredEvents.length){
      more = true;
      filteredEvents = filteredEvents.slice(0,offset);
    }
  }
  res.json({events:filteredEvents, more: more})
});

router.get('/by-days/:offset', (req: Request, res: Response) => {
  const offset:number = Number(req.params.offset) || 0;
  const dayInMilliseconds = 1000*60*60*24;
  const timeNow = new Date().getTime();
  let dateEnd, dateStart;
  dateEnd = (timeNow + dayInMilliseconds) - dayInMilliseconds*offset;
  let year = new Date(dateEnd).getFullYear()
  let day = new Date(dateEnd).getDate()
  let month = new Date(dateEnd).getMonth() +1;
  dateEnd = new Date(`${year}/${month}/${day}`).getTime();
  dateStart = dateEnd - dayInMilliseconds*7;
  const dates = getUniqueWeekSessions(dateStart,dateEnd);
  res.send(dates);
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  const offset:number = Number(req.params.offset) || 0;
  const dayInMilliseconds = 1000*60*60*24;
  const timeNow = new Date().getTime();
  let dateEnd, dateStart;
  dateEnd = (timeNow + dayInMilliseconds) - dayInMilliseconds*offset;
  let year = new Date(dateEnd).getFullYear()
  let day = new Date(dateEnd).getDate()
  let month = new Date(dateEnd).getMonth() +1;
  dateEnd = new Date(`${year}/${month}/${day}`).getTime();
  dateStart = dateEnd - dayInMilliseconds;

  const dates = getUniqueDaySessions(dateStart,dateEnd);
  res.send(dates);
  res.send('/by-hours/:offset')
});

router.get('/today', (req: Request, res: Response) => {
  const todaysEvents = getTodaysEvents();
  res.send(todaysEvents)
});

router.get('/week', (req: Request, res: Response) => {
  const weeksEvents = getWeeksEvents(mockData.events);
  const sessionIds:string[] = [];
  let sum:number = 0;
  weeksEvents.forEach((event, i) => {
    if(!sessionIds.includes(event.session_id)){
      sessionIds.push(event.session_id);
      sum++;
    }
  })
  res.json({events: weeksEvents, sum : sum})
});

router.get('/retention', (req: Request, res: Response) => {
  const dayZero  = Number(req.query.dayZero);
  if(dayZero){
    const timeNow = Date.now();
    const diff: number = timeNow - dayZero;
    const day = 1000*60*60*24;
    const days:string[] = [];
    const weeks:[string[]] = [[]];
    let index = 0, j= 0;
    for(let i = dayZero; i< timeNow; i+= day){
      if(j === 0 && i!== 0){
        weeks.push([]);
      }
      let year = new Date(i).getFullYear()
      let day = new Date(i).getDate()
      let month = new Date(i).getMonth() +1;
      weeks[index].push(`${year}/${month}/${day}`);
      if(j === 6){
        j = 0;
        i++;
      }else {
        i++;
        j++;
      }
    }
    return res.json(weeks)


  }

  res.send('/retention')
});
router.get('/:eventId',(req : Request, res : Response) => {
  res.send('/:eventId')
});

router.post('/', (req: Request, res: Response) => {
  const eventToAdd:Event = req.body;
  try{
    addEvent(eventToAdd);
    res.json({success: true})
  }catch(e){
    res.status(400).json({success: false})
  }
});

router.get('/chart/os/:time',(req: Request, res: Response) => {
  const time = req.params.time;
  let events;
  if(time === 'all'){
    return res.send(getAllEvents())
  }else if(time === 'today'){
    return res.send(getTodaysEvents())
  }else if(time === 'week'){
    return res.send(getWeeksEvents())
  }else{
    return res.sendStatus(404).send('bad request');
  }
})
  
router.get('/chart/pageview/:time',(req: Request, res: Response) => {
  const time = req.params.time;
  let events;
  if(time === 'all'){
    return res.send(getAllEvents())
  }else if(time === 'today'){
    return res.send(getTodaysEvents())
  }else if(time === 'week'){
    return res.send(getWeeksEvents())
  }else{
    return res.sendStatus(404).send('bad request');
  }
  //res.send('/chart/pageview/:time')
})

router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
  const time = req.params.time;
  let events;
  if(time === 'all'){
    return res.send(getAllEvents())
  }else if(time === 'today'){
    return res.send(getTodaysEvents())
  }else if(time === 'week'){
    return res.send(getWeeksEvents())
  }else{
    return res.sendStatus(404).send('bad request');
  }
  //res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  const time = req.params.time;
  let events;
  if(time === 'all'){
    return res.send(getAllEvents())
  }else if(time === 'today'){
    return res.send(getTodaysEvents())
  }else if(time === 'week'){
    return res.send(getWeeksEvents())
  }else{
    return res.sendStatus(404).send('bad request');
  }
  //res.send('/chart/geolocation/:time')
})


export default router;
