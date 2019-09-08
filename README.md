This project sets up an simple REST api for multiple tools.

## Tool 1: Calendar with iCal support

- [ ] import .ical files
- [ ] export .ical files - `GET@/api/calendar/sync`
- [X] create new anniversaries - `POST@/api/calendar/anniversary`
- [X] read all anniversaries - `GET@/api/calendar/anniversary`
- [X] edit/update anniversaries - `POST@/api/calendar/anniversary`
- [X] remove anniversaries - `DELETE@/api/calendar/anniversary`
- [X] create new appointments - `POST@/api/calendar/appointment`
- [X] read all appointments - `GET@/api/calendar/appointment`
- [X] edit/update appointments - `POST@/api/calendar/appointment/:id`
- [X] remove appointments - `DELETE@/api/calendar/appointment/:id`
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