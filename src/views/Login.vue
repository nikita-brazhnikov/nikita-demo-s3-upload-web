<template>
    <v-app id="inspire">
        <v-content>
            <v-container
                    class="fill-height"
                    fluid
            >
                <v-row
                        align="center"
                        justify="center"
                >
                    <v-col
                            cols="12"
                            sm="8"
                            md="4"
                    >
                        <v-card v-if="needNewPassword">
                            <v-toolbar
                                    color="primary"
                                    dark
                                    flat
                            >
                                <v-toolbar-title>Setup new password</v-toolbar-title>
                                <v-spacer/>
                            </v-toolbar>
                            <v-card-text>
                                <v-text-field
                                        id="password"
                                        label="New password"
                                        name="password"
                                        type="password"
                                        v-model="newPassword"
                                />
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer/>
                                <v-btn color="primary" @click="completeNewPassword" type="submit">Set password</v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-card class="elevation-12" v-else>
                            <v-toolbar
                                    color="primary"
                                    dark
                                    flat
                            >
                                <v-toolbar-title>Login form</v-toolbar-title>
                                <v-spacer/>
                            </v-toolbar>
                            <v-card-text>

                                <v-text-field
                                        label="Login"
                                        name="login"
                                        prepend-icon="mdi-account-circle"
                                        type="text"
                                        v-model="username"
                                />

                                <v-text-field
                                        id="password"
                                        label="Password"
                                        name="password"
                                        prepend-icon="mdi-lock"
                                        type="password"
                                        v-model="password"
                                />
                                <div v-if="hasError" class="v-alert red--text">{{ error }}</div>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn to="password_reset" tag="a" text>Forgot password?</v-btn>
                                <v-spacer/>
                                <v-btn color="primary" @click="signIn" type="submit">Login</v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    const Amplify = require('aws-amplify');
    export default {
        props: {
            source: String,
        },
        data: function () {
            return {
                password: "",
                username: "",
                error: "",
                needNewPassword: false,
                newPassword: "",
                user: null,
            }
        },
        methods: {
            async signIn() {
                this.error = "";
                try {
                    this.user = await Amplify.Auth.signIn(this.username, this.password);
                    console.log(JSON.stringify(this.user, null, 2));
                    console.log(this.user.challengeName);
                    if (this.user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                        this.needNewPassword = true;
                        console.log("need new password")
                        return;
                    }
                    await this.$router.push("/")
                } catch (e) {
                    if (e.code === 'NotAuthorizedException') {
                        this.error = e.message;
                    }
                    console.log("ERROR", JSON.stringify(e, null, 2));
                }
            },
            async completeNewPassword() {
                await Amplify.Auth.completeNewPassword(this.user, this.newPassword, {});
                await this.$router.push("/")
            }
        },
        computed: {
            hasError() {
                return !!this.error;
            }
        }
    }
</script>