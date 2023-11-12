new Vue({
    el: '#app',
    data: {
        lessons: lessons,
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
    methods: {
        addToCart(lessonId) {
            const lessonIndex = this.lessons.findIndex((l) => l.id === lessonId)
            if (this.lessons[lessonIndex].spaces > 0) {
                const cartIndex = this.cart.findIndex((l) => l.id === lessonId)
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
            const cartLesson = this.cart[cartIndex]
            const lessonIndex = this.lessons.findIndex((l) => l.id === cartLesson.id)
            this.lessons[lessonIndex].spaces += cartLesson.spaces
            this.cart.splice(cartIndex, 1)
        },
        order() {
            if (this.orderValidated) {
                alert("You order has been completed!")
            }
        }
    },
    computed: {
        filteredLessons() {
            let lessons = this.lessons
            if (this.query) {
                const query = this.query.toLowerCase()
                lessons = lessons.filter((lesson) => {
                    return lesson.subject.toLowerCase().includes(query)
                        || lesson.location.toLowerCase().includes(query)
                })
            }
            return lessons.sort((lessonA, lessonB) => {
                switch (this.sortBy) {
                    case 'subject':
                    case 'location':
                        let attributeA, attributeB
                        if (this.sortOrder == 'asc') {
                            attributeA = lessonA[this.sortBy].toLowerCase()
                            attributeB = lessonB[this.sortBy].toLowerCase()
                        } else {
                            attributeA = lessonB[this.sortBy].toLowerCase()
                            attributeB = lessonA[this.sortBy].toLowerCase()
                        }
                        if (attributeA < attributeB) {
                            return -1;
                        }
                        if (attributeA > attributeB) {
                            return 1;
                        }
                        return 0;
                        break;

                    case 'price':
                    case 'spaces':
                        if (this.sortOrder == 'asc') {
                            return lessonA[this.sortBy] - lessonB[this.sortBy]
                        } else {
                            return lessonB[this.sortBy] - lessonA[this.sortBy]
                        }
                        break;
                }
            })
        },
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