new Vue({
    el: '#app',
    data: {
        lessons: lessons,
        cart: []
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
        }
    }
})