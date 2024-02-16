<template>

    <div class="flex">
        <div class="w-3/4 bg-white px-10 py-10">
            <div class="flex justify-between border-b pb-8">
                <h1 class="font-semibold text-2xl">Cart</h1>
                <h2 class="font-semibold text-2xl">{{cart.length}} Lesson{{cart.length > 1 ? 's' : ''}}</h2>
            </div>
            <div class="flex mt-10 mb-5">
                <h3 class="font-semibold text-gray-600 text-xs uppercase w-2/5">Lesson Details</h3>
                <h3 class="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">
                    Quantity</h3>
                <h3 class="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">
                    Price</h3>
                <h3 class="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">
                    Total</h3>
            </div>
            <div v-if="cart && cart.length">
                <div class="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5"
                    v-for="(lesson, cartIndex) in cart" :key="cartIndex">
                    <div class="flex w-2/5">
                        <div class="w-20">
                            <img class="h-24 object-cover" :src="`${backendLink}${lesson.image}`" :alt="lesson.subject">
                        </div>
                        <div class="flex flex-col justify-between ml-4 flex-grow">
                            <span class="font-bold text-sm">{{lesson.subject}}</span>
                            <span class="text-red-500 text-xs">{{lesson.location}}</span>
                            <button type="button" @click="$emit('remove', cartIndex)"
                                class="font-semibold hover:text-red-500 text-gray-500 text-xs">Remove</button>
                        </div>
                    </div>
                    <div class="flex justify-center w-1/5">
                        {{lesson.spaces}}
                    </div>
                    <span class="text-center w-1/5 font-semibold text-sm">£{{lesson.price}}</span>
                    <span class="text-center w-1/5 font-semibold text-sm">£{{lesson.price * lesson.spaces}}</span>
                </div>
            </div>
            <p class="text-center text-sm p-5" v-else>No lesson found in your cart</p>
            <button type="button" @click="showCart = !showCart"
                class="flex font-semibold text-indigo-600 text-sm mt-10">
                <svg class="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512">
                    <path
                        d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
                </svg>
                Continue Shopping
            </button>
        </div>

        <form class="w-1/4 px-8 py-10 bg-gray-100" @submit.prevent="$emit('order', { name, phone})">
            <h1 class="font-semibold text-2xl border-b pb-8">Order Summary</h1>
            <div class="mt-10">
                <label class="font-medium inline-block mb-3 text-sm uppercase">Name</label>
                <input type="text" v-model="name" placeholder="Enter your name" class="p-2 text-sm w-full">
            </div>
            <div class="py-6">
                <label class="font-semibold inline-block mb-3 text-sm uppercase">Phone</label>
                <input type="number" v-model="phone" placeholder="Enter your phone"
                    class="p-2 text-sm w-full">
            </div>
            <div class="border-t mt-8">
                <div class="flex font-semibold justify-between py-6 text-sm uppercase">
                    <span>Total cost</span>
                    <span>£{{totalCost}}</span>
                </div>
                <button :disabled="!orderValidated" :class="{
                        'bg-indigo-500 hover:bg-indigo-600': orderValidated,
                        'bg-gray-500 cursor-not-allowed': !orderValidated,
                    }" class="font-semibold py-3 text-sm text-white uppercase w-full">
                    Checkout
                </button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        showCart: {
            type: Boolean,
            default: false
        },
        backendLink: {
            type: String,
            required: true
        },
        cart: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            nameRegex: /^[a-zA-Z ]{2,30}$/,
            phoneRegex: /^\d{11}$/,
            name: '',
            phone: '',
        }
    },
    computed: {
        totalCost() {
            let cost = 0
            this.cart.forEach(lesson => {
                cost += lesson.spaces * lesson.price
            });
            return cost.toFixed(2)
        },
        orderValidated() {
            return this.name && this.nameRegex.test(this.name)
                && this.phone && this.phoneRegex.test(this.phone)
        }
    }
}
</script>