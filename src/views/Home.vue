<template>
    <v-app id="inspire">
        <v-app-bar
                app
                color="indigo"
                dark
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title>Home</v-toolbar-title>
            <v-spacer/>
            <v-btn icon @click="logout">
                <v-icon>mdi-exit-run</v-icon>
            </v-btn>
        </v-app-bar>

        <v-content class="mt-8">
            <v-data-table
                    :headers="headers"
                    :items="data"
                    :loading="loading"
                    class="elevation-1"
            >

            </v-data-table>
        </v-content>
        <v-footer
                color="indigo"
                app
        >
            <span class="white--text">&copy; 2019</span>
        </v-footer>
    </v-app>
</template>

<script>
    import {ApiName} from "../services/amplify.service";

    const Amplify = require('aws-amplify');

    export default {
        name: 'Home',
        props: {
            source: String,
        },
        data: () => ({
            drawer: null,
            headers: [
                {text: "診察券番号", value: "consultation_id"},
                {text: "患者氏名", value: "family_name"}
            ],
            data: [],
            loading: false,
        }),
        methods: {
            async logout() {
                await Amplify.Auth.signOut();
                await this.$router.push("/login")
            },
            async refresh() {
                this.loading = true;
                this.data = (await Amplify.API.get(ApiName, "/db_member/all", {})).items;
                this.loading = false;
            }
        },
        created() {
            this.refresh();
        },
    }
</script>

<style lang="scss">
    .home {
        max-width: 800px;
        margin: auto;
    }
</style>