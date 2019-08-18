This project sets up an simple REST api for iCal calendars.

It can be used to:

- [ ] import .ical files
- [X] export .ical files - endpoint:`GET@/api/calendar/sync`
- [X] create new anniversaries - endpoint:`POST@/api/calendar/anniversary`
- [ ] read all anniversaries
- [ ] edit/update anniversaries
- [ ] remove anniversaries
- [X] create new appointments - endpoint:`POST@/api/calendar/appointment`
- [ ] read all appointments
- [ ] edit/update appointments
- [ ] remove appointments
- [ ] create and add alarms to appointments
- [ ] read all alarms of an appointment
- [ ] edit/update alarms of an appointment
- [ ] remove alarms of an appointment
- [ ] persist calendars

This project base on work from [Shaun Xu](http://geekswithblogs.net/shaunxu/archive/2016/03/18/implement-ical-subscription-service-through-in-node.js.aspx).