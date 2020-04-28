<template>
    <v-app>
        <v-app-bar
                app
                color="primary"
                dark
        >
            <v-toolbar-title>問合せ番号：{{ inquiry }}</v-toolbar-title>
        </v-app-bar>

        <v-content v-if="hasInquiry">
            <Home :inquiry="inquiry" class="mt-3"/>
        </v-content>
    </v-app>
</template>

<script>
    import HelloWorld from './components/HelloWorld';
    import Home from "./views/Home";

    export default {
        name: 'App',

        components: {
            Home,
            HelloWorld,
        },

        data: () => ({
            inquiry: ""
        }),
        computed: {
            hasInquiry() {
                return !!this.inquiry;
            }
        },
        created() {
          this.inquiry = this.$router.currentRoute.query.inquiry
        }


    };
</script>
