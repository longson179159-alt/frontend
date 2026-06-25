import { computed, type ComputedRef, type Ref } from 'vue'

type StatusMapItem = {
    status: number
    [key: string]: unknown
}

type StatusMapRef = Ref<Record<string, StatusMapItem>> | ComputedRef<Record<string, StatusMapItem>>

export function useStatusMap(statusTagsMeanings: StatusMapRef) {
    const newStatusDict = computed(() => {
        const statusDict: Record<string, number> = {}
        const listKeys = Object.keys(statusTagsMeanings.value)
        for (const item of listKeys) {
            if (item.split(" ").length === 1 || statusTagsMeanings.value[item].status > 0) {
                statusDict[item] = statusTagsMeanings.value[item].status
            }

        }
        return statusDict
    })

    return {
        newStatusDict
    }
}
