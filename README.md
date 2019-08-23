This project sets up an simple REST api for iCal calendars.

It can be used to:

- [ ] import .ical files
- [X] export .ical files - endpoint:`GET@/api/calendar/sync`
- [X] create new anniversaries - endpoint:`POST@/api/calendar/anniversary`
- [X] read all anniversaries - endpoint:`GET@/api/calendar/anniversary`
- [X] edit/update anniversaries
- [X] remove anniversaries
- [X] create new appointments - endpoint:`POST@/api/calendar/appointment`
- [X] read all appointments - endpoint:`GET@/api/calendar/appointment`
- [X] edit/update appointments - endpoint:`POST@/api/calendar/appointment/:id`
- [X] remove appointments - endpoint:`DELETE@/api/calendar/appointment/:id`
- [ ] create and add alarms to appointments/anniversaries
- [ ] read all alarms of an appointment/anniversary
- [ ] edit/update alarms of an appointment/anniversary
- [ ] remove alarms of an appointment/anniversary
- [X] persist calendars (local file system)
  - [X] CREATE
  - [X] UPDATE
  - [X] DELETE
- [ ] persist calendars (e. g. database)

This project based on work from [Shaun Xu](http://geekswithblogs.net/shaunxu/archive/2016/03/18/implement-ical-subscription-service-through-in-node.js.aspx).