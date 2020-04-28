<template>
    <v-data-table :headers="headers" :items="items">
        <template v-slot:item.url="{ item }">
            <div class="p-1">
                <a :href="item.url" target="_blank">Download</a>
            </div>
        </template>
        <template v-slot:item.preview="{ item }">
            <div class="py-3 d-flex justify-center">
                <img :src="item.preview" style="max-height: 200px" v-if="isImage(item.filename)">
                <v-btn v-else icon :href="item.preview" target="_blank">
                    <v-icon>mdi-text-box-multiple</v-icon>
                </v-btn>
            </div>
        </template>
    </v-data-table>
</template>

<script>
    export default {
        name: "AttachmentsPreviewer",
        props: {
            userId: {
                type: String,
                required: true,
            }
        },

        data: function () {
            return {
                items: [],
            }
        },
        computed: {
            headers() {
                return [
                    {text: 'File name', value: 'filename'},
                    {text: 'Download', value: 'url'},
                    {text: 'Preview', value: 'preview'},
                ]
            }
        },
        created() {
            this.refresh();
        },
        methods: {
            isImage(filename) {
                return filename.endsWith("png") || filename.endsWith("jpg")
            },
            refresh() {
                fetch(`https://m4em1bvc6c.execute-api.ap-northeast-1.amazonaws.com/Prod/attachments/${this.userId}`).then((res) => {
                    res.json().then((json) => {
                        this.items = json.map((image) => {
                            return {
                                filename: image.filename,
                                url: image.url,
                                preview: image.url,
                            }
                        })
                    })
                })

            }
        }
    }

</script>

<style scoped>

</style>