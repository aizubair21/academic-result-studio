import { WorkflowResolver } from "~/service/workflowResolver"

export default defineNuxtRouteMiddleware((to, from) => {
    new WorkflowResolver().resolve();
})
