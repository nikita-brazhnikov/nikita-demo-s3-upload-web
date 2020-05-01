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
                        <v-card class="">
                            <v-toolbar
                                    color="primary"
                                    dark
                                    flat
                            >
                                <v-toolbar-title>Reset password</v-toolbar-title>
                                <v-spacer/>
                            </v-toolbar>
                            <v-card-text>
                                <v-form>
                                    <v-text-field
                                            label="Username"
                                            name="email"
                                            type="text"
                                            v-model="username"
                                    />

                                    <v-text-field v-if="sended"
                                                  id="code"
                                                  label="Code"
                                                  name="code"
                                                  type="text"
                                                  v-model="code"
                                    />
                                    <v-text-field v-if="sended"
                                                  id="password"
                                                  label="New password"
                                                  name="password"
                                                  type="password"
                                                  v-model="password"
                                    />
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer/>
                                <v-btn color="primary" v-if="sended" @click="resetPassword">Submit</v-btn>
                                <v-btn color="primary" v-else @click="requestCode">Send</v-btn>
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
        name: "ForgotPassword",
        data: function () {
            return {
                username: "",
                code: "",
                password: "",
                sended: false,
                code_checked: false,
            }
        },
        methods: {
            async requestCode() {
                await Amplify.Auth.forgotPassword(this.username);
                this.sended = true;
            },
            async resetPassword() {
                const res = await Amplify.Auth.forgotPasswordSubmit(this.username, this.code, this.password);
                console.log(JSON.stringify(res, null, 2));
                await this.$router.replace("login")
            }
        },
    }
</script>

<style scoped>

</style>