<template>

  <div class="">
    <input 
    type="range"
    min="0"
    :max="maxValue"
    v-model="inputValue"
    step="1"
    @input="emitUpdate"
    class="w-full  rounded cursor-pointer"
    :style="{'--progress' : percent + '%'}"
    >


  </div>
</template>

<script setup>
import {ref} from 'vue'

const props = defineProps({
  inputMax : {type: Number, default: 10},
  inputValue: {type: Number, default : 4}
})
const inputValue = ref(props.inputValue)

// sync maxValue with duration in parent
const maxValue = computed({
  get: () => props.inputMax,
  set: (newMax) => {
    emit('update:inputMax', newMax)
  }
})


watch(() => props.inputValue, (newVal) => {
  if (newVal !== inputValue.value) {
    inputValue.value = newVal
  }
})


const percent = computed(() => 
    maxValue.value > 0 ? (inputValue.value / maxValue.value) * 100 : 0
)
// watchEffect(() => {
//   console.log('value=', inputValue.value, 'max=', maxValue.value, 'percent=', percent.value)
// })

const emit = defineEmits(['update:inputValue'])
const emitUpdate = () => {
  emit('update:inputValue' , Number(inputValue.value))
}

</script>


<style scoped>

/* ============================
   TRACK (the long horizontal bar)
   ============================ */

/* Chrome / Edge / Safari track */
:deep(input[type="range"]::-webkit-slider-runnable-track) {
  height: 3px;                   /* Track thickness (thin bar) */
  border-radius: 9999px;         /* Fully rounded ends */
  background: linear-gradient(   /* Progress + remaining bar */
    to right,
    #22c55e var(--progress, 0%), /* Left side = progress color (green) */
    #d1d5db var(--progress, 0%)  /* Right side = gray background */
  );
}

/* Firefox track */
:deep(input[type="range"]::-moz-range-track) {
  height: 3px;                   /* Same thickness for Firefox */
  border-radius: 9999px;         /* Rounded bar */
  background: linear-gradient(
    to right,
    #22c55e var(--progress, 0%), /* Green progress */
    #d1d5db var(--progress, 0%)  /* Gray rest */
  );
}


/* ============================
   REMOVE DEFAULT BROWSER STYLE
   Needed so custom thumb works
   ============================ */
:deep(input[type="range"]) {
  -webkit-appearance: none;      /* Remove default Chrome/Safari styling */
  appearance: none; 
  height: px;
  padding: 0;
  margin: 0;             /* Remove default Firefox styling */
}


/* ============================
   THUMB (the draggable circle)
   ============================ */

/* Chrome / Edge / Safari thumb */
:deep(input[type="range"]::-webkit-slider-thumb) {
  -webkit-appearance: none;      /* Allow custom styling (required) */
  appearance: none;              /* Remove default style in Firefox too */
  width: 10px;                   /* Thumb size (smaller = thinner slider) */
  height: 10px;                  /* Same height = perfect circle */
  border-radius: 50%;            /* Make the thumb round */
  background: #22c55e;           /* Thumb color (green) */
  cursor: pointer;               /* Pointer cursor on hover */

  /* Center the thumb on the 3px track */
  margin-top: -3.5px;              /* Moves thumb down/up → perfect alignment */

  transition: transform 0.15s ease,  /* Smooth grow animation */
              background 0.15s ease; /* Smooth color change */
}

/* Hover effect for thumb (Chrome/Edge/Safari) */
:deep(input[type="range"]:hover::-webkit-slider-thumb) {
  transform: scale(1.25);        /* Thumb grows on hover */
  background: #16a34a;           /* Slightly darker green */
}


/* Firefox thumb */
:deep(input[type="range"]::-moz-range-thumb) {
  width: 10px;                   /* Same size as WebKit thumb */
  height: 10px;                  /* Same size */
  border-radius: 50%;            /* Round thumb */
  background: #22c55e;           /* Green color */
  cursor: pointer;               /* Pointer cursor */
  border: none;                  /* Remove Firefox default border */
}

</style>
