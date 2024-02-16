<template>
    <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div class="sticky top-0 z-50 bg-white flex items-center justify-end mb-3 space-x-4">
                <a :href="backendLink" target="_blank" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                    Backend Link
                </a>
                <button type="button" class="flex items-center space-x-2 p-2 rounded py-2 hover:bg-gray-100" :class="{
                    'cursor-not-allowed':cart.length == 0
                }" :disabled="cart.length == 0" @click="showCart = !showCart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
                        <path fill="currentColor"
                            d="M134 120v56a6 6 0 0 1-12 0v-56a6 6 0 0 1 12 0Zm103.88-22.15l-13.88 104A14 14 0 0 1 210.13 214H45.87A14 14 0 0 1 32 201.85l-13.87-104A14 14 0 0 1 32 82h37.28l54.2-61.95a6 6 0 0 1 9 0l54.2 62H224a14 14 0 0 1 13.87 15.85ZM85.22 82h85.56L128 33.11ZM225.5 94.68A2 2 0 0 0 224 94H32a2 2 0 0 0-1.51.68a2 2 0 0 0-.49 1.58l13.86 104a2 2 0 0 0 2 1.73h164.27a2 2 0 0 0 2-1.73l13.87-104a1.93 1.93 0 0 0-.5-1.58ZM181.4 114a6 6 0 0 0-6.57 5.37l-5.6 56a6 6 0 0 0 5.37 6.63h.61a6 6 0 0 0 6-5.4l5.6-56a6 6 0 0 0-5.41-6.6Zm-100.23 5.4a6 6 0 0 0-11.94 1.2l5.6 56a6 6 0 0 0 6 5.4h.61a6 6 0 0 0 5.37-6.57Z" />
                    </svg>
                    <span>{{cart.length}}</span>
                </button>
            </div>
            <Checkout 
                v-if="showCart"
                :showCart="showCart" 
                :backendLink="backendLink" 
                :cart="cart" 
                @order="order"
                @remove="removeCartItem"
            />
            <Lesson 
                v-else
                :lessons="lessons" 
                :sortList="sortList" 
                :query="query" 
                :backendLink="backendLink" 
                :sortBy="sortBy" 
                :sortOrder="sortOrder"
                @add="addToCart"
                @query="query = $event"
                @sort="sortBy = $event"
                @order="sortOrder = $event"
            />
        </div>
    </div>
</template>

<script>
import Checkout from "./Checkout.vue";
import Lesson from "./Lesson.vue";
export default {
    components: {
        Checkout,
        Lesson
    },
    data() {
        return {
            backendLink: "https://edusync-env.eba-3c6tit6g.eu-west-2.elasticbeanstalk.com",
            lessons: [],
            query: '',
            showCart: false,
            cart: [],
            sortList: [
                {
                    value: 'Subject',
                    key: 'subject'
                },
                {
                    value: 'Location',
                    key: 'location'
                },
                {
                    value: 'Price',
                    key: 'price'
                },
                {
                    value: 'Spaces',
                    key: 'spaces'
                },
            ],
            sortBy: 'subject',
            sortOrder: 'asc'
        }
    },
    created() {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("service-worker.js");
        }
    },
    mounted() {
        this.getLessons()
    },
    methods: {
        async getLessons() {
            try {
                const queryParams = {
                    query: this.query,
                    sortBy: this.sortBy,
                    sortOrder: this.sortOrder,
                }
                const queryString = Object.entries(queryParams)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
                const response = await fetch(`${this.backendLink}/api/lessons?${queryString}`);
                let fetchedLessons = await response.json();
                this.cart.forEach(cartLesson => {
                    const lessonIndex = fetchedLessons.findIndex((l) => l._id === cartLesson._id)
                    if (lessonIndex != -1) {
                        fetchedLessons[lessonIndex].spaces -= cartLesson.spaces
                    }
                });
                this.lessons = fetchedLessons
            } catch (error) {
                console.error('Error fetching lessons:', error);
            }
        },
        addToCart(lessonId) {
            const lessonIndex = this.lessons.findIndex((l) => l._id === lessonId)
            if (this.lessons[lessonIndex].spaces > 0) {
                const cartIndex = this.cart.findIndex((l) => l._id === lessonId)
                if (cartIndex === -1) {
                    this.cart.push({
                        ...this.lessons[lessonIndex],
                        spaces: 1
                    })
                } else {
                    this.cart[cartIndex].spaces++
                }
                this.lessons[lessonIndex].spaces--
            }
        },
        removeCartItem(cartIndex) {
            const lessonIndex = this.lessons.findIndex((l) => l._id === this.cart[cartIndex]._id)
            this.lessons[lessonIndex].spaces++
            this.cart[cartIndex].spaces--
            if (this.cart[cartIndex].spaces == 0) {
                this.cart.splice(cartIndex, 1)
            }
        },
        async order({name, phone}) {
            try {
                await fetch(`${this.backendLink}/api/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        lessons: this.cart.map((lesson) => {
                            return {
                                _id: lesson._id,
                                spaces: lesson.spaces
                            }
                        })
                    })
                });

                await fetch(`${this.backendLink}/api/lessons`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        lessons: this.cart
                    })
                });

                this.showCart = false
                this.cart = []
                alert('Your order has been submitted!')
            } catch (error) {
                alert('Something went wrong! Please try again later')
            }
        }
    },
    watch: {
        query() {
            this.getLessons()
        },
        sortBy() {
            this.getLessons()
        },
        sortOrder() {
            this.getLessons()
        }
    }
}
</script>
