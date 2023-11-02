new Vue({
    el: '#app',
    data: {
        lessons: lessons,
        query: '',
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
                        const attributeA = lessonA[this.sortBy].toLowerCase()
                        const attributeB = lessonB[this.sortBy].toLowerCase()
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
                        return lessonA[this.sortBy] - lessonB[this.sortBy]
                        break;
                }
            })
        }
    }
})