<template>
    <div class="AttachmentUploader py-2">
        <v-file-input
                :value="files" @change="setFiles" :loading="loading" :success-messages="success"
                label="Inquiry attachment"
                placeholder="Select your file"
                outlined
        />

    </div>
</template>

<script>
    import {AWS_UPLOAD_BUCKET} from "../../config";

    const AWS = require("aws-sdk");

    export default {
        props: {
            userId: {
                type: String,
                required: true,
            }
        },
        data: function () {
            return {
                files: [],
                loading: false,
                success: "",
            }
        },
        methods: {
            setFiles: function (files) {
                this.files = files;
            }
        },
        watch: {
            files: function (newFiles) {
                if (!newFiles || newFiles.length === 0) return;
                let file;
                if (newFiles.length !== undefined) {
                    file = newFiles[0];
                } else {
                    file = newFiles;
                }
                const key = `${this.userId}/${file.name}`;
                // console.log(key);
                const client = new AWS.S3();
                const presignedUrl = client.getSignedUrl('putObject', {
                    Bucket: AWS_UPLOAD_BUCKET,
                    Key: key,
                    Expires: 100,
                    ContentType: file.type
                });

                // console.log(presignedUrl);

                const reader = new FileReader();
                reader.addEventListener("load", (e) => {
                    const blob = e.target.result;
                    fetch(presignedUrl, {
                        method: 'PUT',
                        body: blob,
                        headers: {
                            'Content-Type': file.type,
                        }
                    }).then((response) => {
                        // console.log(response);

                        const uploaded = {
                            accessUrl: "",
                            filename: "",
                        };
                        this.files = [];

                        this.success = "Uploaded to " + key;
                        this.loading = false;
                        this.$emit("uploaded", uploaded);
                    });


                });
                this.loading = true;
                this.success = "";
                reader.readAsArrayBuffer(file);
            }
        },

    };
</script>
