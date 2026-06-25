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
            const currentItem = statusTagsMeanings.value[item]
            if (!currentItem) continue

            if (item.split(" ").length === 1 || currentItem.status > 0) {
                statusDict[item] = currentItem.status
            }

        }
        return statusDict
    })

    return {
        newStatusDict
    }
}
