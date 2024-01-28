new Vue({
    el: '#app',
    data: {
        backendLink: "https://edusync-env.eba-3c6tit6g.eu-west-2.elasticbeanstalk.com",
        lessons: [],
        query: '',
        showCart: false,
        cart: [],
        name: '',
        phone: '',
        nameRegex: /^[a-zA-Z ]{2,30}$/,
        phoneRegex: /^\d{11}$/,
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
        async order() {
            if (this.orderValidated) {
                try {
                    await fetch(`${this.backendLink}/api/orders`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: this.name,
                            phone: this.phone,
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
})