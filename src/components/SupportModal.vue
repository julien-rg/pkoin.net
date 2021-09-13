<template>
    <div class="support-wpapper">

        <ValidationProvider rules="required" v-slot="{ errors }">
            <InputText id="header" type="text" placeholder="Subject" v-model="ticket_data.subject" />
            <small class="error">{{ errors[0] }}</small>
        </ValidationProvider>

        <ValidationProvider rules="required|isEmail" v-slot="{ errors }">
            <InputText id="email" type="email" placeholder="Your Email" v-model="ticket_data.email" />
            <small class="error">{{ errors[0] }}</small>
        </ValidationProvider>

        <ValidationProvider rules="required" v-slot="{ errors }">
            <InputText id="address" type="email" placeholder="What address you`ve sent currency to?" v-model="ticket_data.address" />
            <small class="error">{{ errors[0] }}</small>
        </ValidationProvider>

        <div>
            <ValidationProvider rules="required" v-slot="{ errors }">
                <Textarea placeholder="What is the problem?" v-model="ticket_data.text" :autoResize="true" rows="5" cols="30" />
                <small class="error">{{ errors[0] }}</small>
            </ValidationProvider>
        </div>

        <Button @click="submitTicket" label="Send" class="p-button-secondary" />
    </div>
</template>

<script>
import api from '@/api/axios'

import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import { ValidationProvider, extend } from 'vee-validate'

extend('required', {
    validate(value) {
        return {
            required: true,
            valid: ['', null, undefined].indexOf(value) === -1,
        }
    },
    message: 'This field is required',
    computesRequired: true
})


extend('isEmail', value => {
    const emailRegex = /.+@.+\..+/gi

    if(emailRegex.test(value)) {
        return true
    }

    return 'Enter a valid email address'
})

export default {
    name: 'SupportModal',
    components: {
        InputText,
        Textarea,
        Dialog,
        Button,
        ValidationProvider
    },

    computed: {
        areNotEmplyFields() {
            return this.ticket_data.email && this.ticket_data.subject && this.ticket_data.text && this.ticket_data.address
        }
    },

    methods: {
        async submitTicket() {

            if(this.areNotEmplyFields) {
                try {
                    this.$emit('closeModal')
                    await api.submitSupportTicket(this.ticket_data)
                    this.$toast.add({severity:'success', summary: 'Ticket sent!', detail:'We will contact you soon', life: 3500})
                    
                } catch (error) {
                    this.$toast.add({severity:'error', summary: '', detail:'Failed to send ticket', life: 3500})
                }

            }
        },

        displayDialog() {
            this.display = false
        }
    },
    data() {
        return {
            ticket_data: {
                email: null,
                subject: null,
                text: null,
                address: null
            },
            display: true
        }
    }
}
</script>

<style lang="sass" scoped>
.support-wpapper
    width: 350px
    height: 420px
    display: grid
    grid-template-rows: repeat(3, 65px) 152px
    padding-top: $r * 3

.textarea-header
    margin: 0 0 3px 
    color: gray

::v-deep .p-inputtextarea
    max-height: 130px

::v-deep .p-dialog-content
    padding: $r * 2.4

::v-deep .p-dialog .p-dialog-header
    padding: $r $r * 2.2
    background: rgba(255,255,255, .9)
    color: gray

::v-deep .p-dialog .p-dialog-content
    display: grid
    grid-gap: 23px
    background: rgba(255,255,255, .9)
    color: white

::v-deep .p-dialog .p-dialog-footer
    background: rgba(255,255,255, .9)
    color: white

::v-deep .p-float-label > label
    color: gray !important

::v-deep .p-inputtext
    width: 100% 
    color: gray !important

.success
    display: flex
    flex-direction: column

    .success_header
        font-size: 1.5em
        margin: $r * 2 0 $r

    .success_text
        font-size: 1.2em

.error
    color: red

@media only screen and (max-width: 320px)
    .support-wpapper
        width: 100%
</style>