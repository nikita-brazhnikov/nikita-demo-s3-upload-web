<template>
    <div class="home">
        <AttachmentUploader :user-id="userId" @uploaded="refreshList"/>
        <AttachmentsPreviewer ref="previewer" :user-id="userId"/>
    </div>
</template>

<script>
    import AttachmentUploader from "../components/AttachmentUploader/AttachmentUploader";
    import AttachmentsPreviewer from "../components/AttachmentsPreviewer";

    export default {
        name: 'Home',
        props: {
            inquiry: String,
        },
        components: {
            AttachmentsPreviewer,
            AttachmentUploader,
        },
        data: function () {
            return {
                userId: this.inquiry
            }
        },
        methods: {
            refreshList() {
                this.$refs.previewer.refresh();
            }
        },
        created() {

        }
    }
</script>

<style lang="scss">
    .home {
        max-width: 800px;
        margin: auto;
    }
</style>