import template from './updateClub.html';
import { isAuthed, getUser, clearUser } from 'Lib/auth';
import internalApi from 'Lib/internalApi';
import UpdatePost from '../posts/UpdatePost';
import PostContainer from '../posts/PostContainer';
import Calendar from '../Calendar';
import AddEvent from '../events/AddEvent';

import { updateToken } from 'Lib/auth';

export default {
    template,
    components: {
        PostContainer,
        UpdatePost,
        Calendar,
        AddEvent,
    },
    data() {
        return {
            user: getUser(),
            title: 'New Club',
            club: {
                executives: [],
                supervisors: [],
                socialMedias: [],
            },
            posts: [],
            events: [],
            displayAddPostButton: true,
        }
    },
    async created() {
        if (this.$route.name === 'editClub') {
            this.title = `Editing ${this.club.name} Info`

            const slug = this.$route.params.slug;
            const { data: clubs } = await internalApi.get('clubs', { query: slug });
            this.club = clubs[0];
            // console.log(this.club);

            this.getPosts();
            this.getEvents();
        }
    },
    methods: {
        async getPosts() { // Called when a post was edited or made.
            const { data: posts } = await internalApi.get('posts', { query: this.club.id });
            this.posts = posts;

            this.displayAddPostButton = true; // In case a new post was added, this will ensure the button is shown.
        },
        swapComponent: function(component) {
          this.currentComponent = component;
        },
        submit() {
            (this.$route.name === 'editClub') ? this.editClub() : this.createClub();
        },
        async createClub() {
            const { status, data: { message, data: { newClub, token } } } = await internalApi.post('clubs', { newClub: this.club });

            updateToken(token);

            this.$router.push({ name: 'dashboard' });
        },
        async editClub() {
            const { status, data: { message, data: club } } = await internalApi.put(`clubs/${this.club.id}`, { editedClub: this.club });

            this.$router.push({ name: 'dashboard' });
        },
        async deleteClub() {
            const { data: { message } } = await internalApi.delete(`clubs/${this.club.id}`);
            alert(message);
            this.$router.push({ name: 'dashboard' });
        },
        async getEvents() {
            const { data: events } = await internalApi.get('events', { ClubId: this.club.id });
            this.events = events;
        }
    }
};
