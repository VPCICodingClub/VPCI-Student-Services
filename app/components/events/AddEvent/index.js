import { DateTime } from 'luxon';
import template from './addEvent.html';
import internalApi from 'Lib/internalApi';

export default {
    template,
    props: ['clubId'],
    data() {
        return {
            event: {},
        }
    },
    methods: {
        async submit() {
            this.event.ClubId = this.clubId;
            const start = DateTime.fromFormat(this.event.start, 'yyyy-MM-dd');
            const end = DateTime.fromFormat(this.event.end, 'yyyy-MM-dd');

            const newEvent = {
                ...this.event,
                start: start.toISO(),
                end: end.toISO(),
            };

            const addedEvent = await internalApi.put('update/events', { ...newEvent, clubId: this.clubId });
            newEvent.url = `/#/event/${addedEvent.id}`;
            this.$emit('eventAdded', newEvent);
            this.event = {};
        },
    }
};
