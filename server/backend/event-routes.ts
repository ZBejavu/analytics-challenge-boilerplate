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
  getEventByDate,
  getStartOfDay,
  getDateInFormat,
  getWeekFromNow
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
import { sign } from "crypto";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";
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

router.get('/retention', async (req: Request, res: Response) => {
  let dayZero  = Number(req.query.dayZero);
  dayZero = getStartOfDay(dayZero)
  if(dayZero){
    const day = 1000*60*60*24;
    const week =day* 7;
    const timeNow = getStartOfDay(Date.now()+ day);
    const weeks:number[] = [dayZero];
    for(let i = dayZero + week; i<= timeNow; i+= week){
          weeks.push(i);
    }
    const allEvents = getAllEvents()
    const weekEvents = weeks.map((week, i) => {
      const weekEvents2 = allEvents.filter(event => event.date >= week && event.date < getWeekFromNow(week));
      return weekEvents2;
    })
    const singupsArr = weekEvents.map((week, i) => {
      const signupForThatWeek = getEventByType('signup',week).map((event: Event) => event.distinct_user_id );
      return signupForThatWeek;
    })
    let arrToSend :weeklyRetentionObject[];
    for(let thisWeek = 0; thisWeek < weekEvents.length; thisWeek ++){
      const weeklyRetention = weekEvents.slice(thisWeek, weekEvents.length).map((events:Event[], i:number) =>{
        let count = 0;
        singupsArr[thisWeek].forEach(signup => {
         const found = events.findIndex(event => event.distinct_user_id === signup);
          if(found !== -1){
            count ++;
          }
        })
        return Math.round(count * 100 / singupsArr[thisWeek].length) || 100;
      })
        const retentionObj:weeklyRetentionObject = {
          registrationWeek: thisWeek,
          newUsers: singupsArr[thisWeek].length,
          weeklyRetention: weeklyRetention,
          start: getDateInFormat(weeks[thisWeek]),
          end: getDateInFormat(weeks[thisWeek] + week)
        }
        if(thisWeek === 0){
          arrToSend =[retentionObj]
        }else{
          arrToSend!.push(retentionObj)
        }
    } 

    return res.json(arrToSend!);
  }else {
    res.sendStatus(401).send('forgot to put zeroDays in query params')
  }
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
